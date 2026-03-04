<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		UPLOAD_MAX_MB,
		ACCEPTED_EXTENSIONS,
		ACCEPTED_MIME_STRING,
		BUNDLE_SIZE_MB,
		POLYGON_MAX,
		WASM_SIZE_KB,
		TEXTURE_MAX_RES,
		TEXTURE_MEMORY_MB
	} from '$lib/constants.js';

	// ---------- Types ----------

	interface CheckResult {
		ruleId: string;
		category: string;
		name: string;
		status: 'pass' | 'fail' | 'warn' | 'running';
		message?: string;
		value?: number;
		limit?: number;
	}

	type UploadStage = 'idle' | 'selected' | 'uploading' | 'validating' | 'done' | 'error';

	// ---------- State (Svelte 5 runes) ----------

	let dragOver = $state(false);
	let stage = $state<UploadStage>('idle');
	let selectedFile = $state<File | null>(null);
	let uploadId = $state<string | null>(null);
	let errorMessage = $state('');
	let uploadProgress = $state(0);

	let validationChecks = $state<CheckResult[]>([]);
	let validationPassed = $state(false);
	let validationErrors = $state(0);
	let validationWarnings = $state(0);

	// SSE reconnect state
	let sseRetryCount = $state(0);
	const SSE_MAX_RETRIES = 2;
	const SSE_TIMEOUT_MS = 30_000;

	// ---------- Derived values ----------

	let fileSizeMB = $derived(selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0');
	let fileSizeDisplay = $derived(
		selectedFile
			? selectedFile.size < 1024
				? `${selectedFile.size} B`
				: selectedFile.size < 1024 * 1024
					? `${(selectedFile.size / 1024).toFixed(1)} KB`
					: `${fileSizeMB} MB`
			: ''
	);
	let canProceed = $derived(stage === 'done' && validationPassed);
	let isWorking = $derived(stage === 'uploading' || stage === 'validating');

	// ---------- File validation ----------

	function isAcceptedFile(file: File): boolean {
		const name = file.name.toLowerCase();
		return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
	}

	function checkFileSize(file: File): string | null {
		const maxBytes = UPLOAD_MAX_MB * 1024 * 1024;
		if (file.size > maxBytes) {
			return `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum upload size is ${UPLOAD_MAX_MB} MB.`;
		}
		if (file.size === 0) {
			return 'File is empty (0 bytes).';
		}
		return null;
	}

	// ---------- File selection ----------

	function handleFileSelect(file: File) {
		// Reset previous state
		validationChecks = [];
		validationPassed = false;
		validationErrors = 0;
		validationWarnings = 0;
		uploadId = null;
		errorMessage = '';
		sseRetryCount = 0;

		// Validate extension
		if (!isAcceptedFile(file)) {
			errorMessage = `Invalid file type. Accepted formats: ${ACCEPTED_EXTENSIONS.join(', ')}`;
			stage = 'error';
			return;
		}

		// Validate size (client-side gate)
		const sizeError = checkFileSize(file);
		if (sizeError) {
			errorMessage = sizeError;
			stage = 'error';
			return;
		}

		selectedFile = file;
		stage = 'selected';
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFileSelect(files[0]);
		}
	}

	function handleFileInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			handleFileSelect(files[0]);
		}
		// Reset input so the same file can be re-selected
		target.value = '';
	}

	function openFilePicker() {
		const input = document.getElementById('file-input') as HTMLInputElement | null;
		input?.click();
	}

	// ---------- Upload ----------

	async function uploadFile() {
		if (!selectedFile) return;

		stage = 'uploading';
		uploadProgress = 0;
		errorMessage = '';

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const body = await response.json().catch(() => ({ message: response.statusText }));
				throw new Error(body.message || `Upload failed (${response.status})`);
			}

			const result: { uploadId: string; filename: string; sizeBytes: number } = await response.json();
			uploadId = result.uploadId;
			uploadProgress = 100;

			// Start validation
			startValidation(result.uploadId);
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Upload failed unexpectedly';
			stage = 'error';
		}
	}

	// ---------- SSE Validation ----------

	function startValidation(id: string) {
		stage = 'validating';
		validationChecks = [];
		validationErrors = 0;
		validationWarnings = 0;

		const eventSource = new EventSource(`/api/validate?id=${encodeURIComponent(id)}`);
		let timeoutHandle: ReturnType<typeof setTimeout>;

		// Set a timeout — if no events received in SSE_TIMEOUT_MS, fall back to polling
		function resetTimeout() {
			clearTimeout(timeoutHandle);
			timeoutHandle = setTimeout(() => {
				eventSource.close();
				fallbackToPoll(id);
			}, SSE_TIMEOUT_MS);
		}
		resetTimeout();

		eventSource.onmessage = (event) => {
			resetTimeout();

			try {
				const data = JSON.parse(event.data);

				if (data.type === 'check') {
					const check: CheckResult = {
						ruleId: data.ruleId,
						category: data.category,
						name: data.name,
						status: data.status,
						message: data.message,
						value: data.value,
						limit: data.limit
					};
					validationChecks = [...validationChecks, check];

					if (data.status === 'fail') validationErrors++;
					if (data.status === 'warn') validationWarnings++;
				} else if (data.type === 'complete') {
					validationPassed = data.passed;
					validationErrors = data.errors;
					validationWarnings = data.warnings;
					stage = 'done';
					eventSource.close();
					clearTimeout(timeoutHandle);
				} else if (data.type === 'error') {
					errorMessage = data.message || 'Validation failed';
					stage = 'error';
					eventSource.close();
					clearTimeout(timeoutHandle);
				}
			} catch {
				// Ignore malformed events
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			clearTimeout(timeoutHandle);

			// If we already received some results and have a completion, don't retry
			if (stage === 'done') return;

			sseRetryCount++;
			if (sseRetryCount <= SSE_MAX_RETRIES) {
				// Retry SSE connection
				setTimeout(() => startValidation(id), 1000);
			} else {
				// Fall back to polling
				fallbackToPoll(id);
			}
		};
	}

	async function fallbackToPoll(id: string) {
		try {
			const response = await fetch(`/api/validate?id=${encodeURIComponent(id)}&poll=true`);
			if (!response.ok) {
				throw new Error(`Polling failed (${response.status})`);
			}

			const result: {
				checks: CheckResult[];
				passed: boolean;
				errors: number;
				warnings: number;
			} = await response.json();

			validationChecks = result.checks;
			validationPassed = result.passed;
			validationErrors = result.errors;
			validationWarnings = result.warnings;
			stage = 'done';
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Validation polling failed';
			stage = 'error';
		}
	}

	// ---------- Reset ----------

	function resetUpload() {
		stage = 'idle';
		selectedFile = null;
		uploadId = null;
		errorMessage = '';
		uploadProgress = 0;
		validationChecks = [];
		validationPassed = false;
		validationErrors = 0;
		validationWarnings = 0;
		sseRetryCount = 0;
	}

	// ---------- Status helpers ----------

	function statusIcon(status: string): string {
		switch (status) {
			case 'pass':
				return '\u2713';
			case 'fail':
				return '\u2717';
			case 'warn':
				return '!';
			case 'running':
				return '\u2026';
			default:
				return '?';
		}
	}

	function statusColor(status: string): string {
		switch (status) {
			case 'pass':
				return 'text-green-600';
			case 'fail':
				return 'text-red-600';
			case 'warn':
				return 'text-amber-600';
			case 'running':
				return 'text-blue-600';
			default:
				return 'text-gray-400';
		}
	}

	function statusBg(status: string): string {
		switch (status) {
			case 'pass':
				return 'bg-green-50 border-green-200';
			case 'fail':
				return 'bg-red-50 border-red-200';
			case 'warn':
				return 'bg-amber-50 border-amber-200';
			default:
				return 'bg-gray-50 border-gray-200';
		}
	}
</script>

<svelte:head>
	<title>Upload World — Kosmos WorldPublisher</title>
</svelte:head>

<main class="container mx-auto px-4 py-8 max-w-2xl">
	<h1 class="text-3xl font-bold mb-4">Upload World</h1>
	<p class="text-gray-600 mb-8">
		Upload your world bundle to validate, optimize, and publish to the Kosmos registry.
	</p>

	<!-- Hidden file input -->
	<input
		id="file-input"
		type="file"
		accept={ACCEPTED_MIME_STRING}
		class="hidden"
		onchange={handleFileInput}
	/>

	<!-- Drag and Drop Zone -->
	{#if stage === 'idle' || stage === 'error'}
		<div
			class="relative border-2 border-dashed rounded-xl p-16 text-center transition-colors cursor-pointer {dragOver
				? 'border-indigo-500 bg-indigo-50'
				: 'border-gray-300 bg-white hover:border-gray-400'}"
			role="button"
			tabindex="0"
			ondragover={(e: DragEvent) => {
				e.preventDefault();
				dragOver = true;
			}}
			ondragleave={() => {
				dragOver = false;
			}}
			ondrop={handleDrop}
			onclick={openFilePicker}
			onkeydown={(e: KeyboardEvent) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					openFilePicker();
				}
			}}
		>
			<div class="flex flex-col items-center gap-4">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
					<svg
						class="w-8 h-8 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
						/>
					</svg>
				</div>
				<div>
					<p class="text-lg font-medium text-gray-700">
						Drag and drop your world bundle here
					</p>
					<p class="text-sm text-gray-400 mt-1">or click to browse files</p>
				</div>
			</div>
		</div>

		<!-- Error message -->
		{#if stage === 'error' && errorMessage}
			<div class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
				<div class="flex items-start gap-3">
					<span class="text-red-600 font-bold text-lg leading-none mt-0.5">{'\u2717'}</span>
					<div>
						<p class="text-sm font-medium text-red-800">Upload Error</p>
						<p class="text-sm text-red-700 mt-1">{errorMessage}</p>
					</div>
				</div>
				<button
					type="button"
					onclick={resetUpload}
					class="mt-3 text-sm text-red-600 hover:text-red-800 underline"
				>
					Try again
				</button>
			</div>
		{/if}
	{/if}

	<!-- File Selected / Uploading / Validating State -->
	{#if stage !== 'idle' && stage !== 'error'}
		<div class="border border-gray-200 rounded-xl p-6 bg-white">
			<!-- File info header -->
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
					>
						<svg
							class="w-5 h-5 text-indigo-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
							/>
						</svg>
					</div>
					<div>
						<p class="text-sm font-medium text-gray-900">
							{selectedFile?.name ?? 'Unknown file'}
						</p>
						<p class="text-xs text-gray-500">{fileSizeDisplay}</p>
					</div>
				</div>

				{#if !isWorking}
					<button
						type="button"
						onclick={resetUpload}
						class="text-sm text-gray-400 hover:text-gray-600"
						title="Remove file"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				{/if}
			</div>

			<!-- Upload progress bar -->
			{#if stage === 'uploading'}
				<div class="mb-4">
					<div class="flex items-center justify-between text-sm mb-1">
						<span class="text-gray-600">Uploading...</span>
						<span class="text-gray-500">{uploadProgress}%</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-2">
						<div
							class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
							style="width: {uploadProgress}%"
						></div>
					</div>
				</div>
			{/if}

			<!-- Upload button (when file is selected but not yet uploaded) -->
			{#if stage === 'selected'}
				<button
					type="button"
					onclick={uploadFile}
					class="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
				>
					Upload & Validate
				</button>
			{/if}

			<!-- Validation results -->
			{#if stage === 'validating' || stage === 'done'}
				<div class="mt-2">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold text-gray-700">Validation Results</h3>
						{#if stage === 'validating'}
							<span class="text-xs text-blue-600 flex items-center gap-1">
								<svg
									class="w-3 h-3 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
								>
									<circle
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
										class="opacity-25"
									/>
									<path
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										class="opacity-75"
									/>
								</svg>
								Running checks...
							</span>
						{:else if validationPassed}
							<span class="text-xs text-green-600 font-medium">All checks passed</span>
						{:else}
							<span class="text-xs text-red-600 font-medium">
								{validationErrors} error{validationErrors !== 1 ? 's' : ''}{validationWarnings > 0
									? `, ${validationWarnings} warning${validationWarnings !== 1 ? 's' : ''}`
									: ''}
							</span>
						{/if}
					</div>

					<!-- Check list -->
					<div class="space-y-1.5 max-h-80 overflow-y-auto">
						{#each validationChecks as check (check.ruleId)}
							<div
								class="flex items-start gap-2 px-3 py-2 rounded-lg border text-sm {statusBg(
									check.status
								)}"
							>
								<span
									class="font-mono font-bold text-base leading-none mt-0.5 {statusColor(
										check.status
									)}"
								>
									{statusIcon(check.status)}
								</span>
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2">
										<span class="font-medium text-gray-800">{check.name}</span>
										<span
											class="text-xs text-gray-400 font-mono"
											>{check.ruleId}</span
										>
									</div>
									{#if check.message}
										<p class="text-xs text-gray-600 mt-0.5 truncate">
											{check.message}
										</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					<!-- Validation summary (when done) -->
					{#if stage === 'done'}
						<div class="mt-4 pt-4 border-t border-gray-200">
							{#if validationPassed}
								<div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
									<p class="text-green-800 font-medium">
										{'\u2713'} Bundle passed all validation checks
									</p>
									{#if validationWarnings > 0}
										<p class="text-xs text-green-700 mt-1">
											{validationWarnings} warning{validationWarnings !== 1
												? 's'
												: ''} (non-blocking)
										</p>
									{/if}
								</div>
							{:else}
								<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
									<p class="text-red-800 font-medium">
										{'\u2717'} Validation failed with {validationErrors} error{validationErrors !== 1
											? 's'
											: ''}
									</p>
									<p class="text-xs text-red-700 mt-1">
										Fix the errors above and try uploading again.
									</p>
									<button
										type="button"
										onclick={resetUpload}
										class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
									>
										Upload a different file
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Accepted Formats -->
	<div class="mt-6 bg-gray-50 rounded-lg p-4">
		<h3 class="text-sm font-semibold text-gray-700 mb-2">Accepted formats</h3>
		<ul class="text-sm text-gray-500 space-y-1">
			<li>
				<code class="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.glb</code> &mdash; glTF Binary
				(3D scene)
			</li>
			<li>
				<code class="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.wasm</code> &mdash; WebAssembly
				module (world script)
			</li>
			<li>
				<code class="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.kosmos</code> &mdash; Kosmos
				world bundle (pre-packaged)
			</li>
			<li>
				<code class="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.worldbundle</code> &mdash;
				World bundle archive
			</li>
		</ul>
	</div>

	<!-- Content Limits Summary -->
	<div class="mt-4 bg-gray-50 rounded-lg p-4">
		<h3 class="text-sm font-semibold text-gray-700 mb-2">Content limits</h3>
		<ul class="text-sm text-gray-500 space-y-1">
			<li>
				Max bundle size: <strong>{BUNDLE_SIZE_MB} MB</strong> (warning at 50 MB)
			</li>
			<li>Max polygons: <strong>{POLYGON_MAX.toLocaleString()}</strong></li>
			<li>Max Wasm binary: <strong>{WASM_SIZE_KB} KB</strong></li>
			<li>
				Textures: <strong>{TEXTURE_MAX_RES}x{TEXTURE_MAX_RES}</strong> per texture,
				{TEXTURE_MEMORY_MB} MB total
			</li>
			<li>
				Upload limit: <strong>{UPLOAD_MAX_MB} MB</strong> (beta)
			</li>
		</ul>
	</div>

	<!-- Next Step -->
	<div class="mt-8 text-center">
		<button
			type="button"
			disabled={!canProceed}
			onclick={() => {
				if (uploadId) {
					goto(`/upload/details?uploadId=${encodeURIComponent(uploadId)}`);
				}
			}}
			class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
		>
			Next: Add Details &rarr;
		</button>
		<p class="text-xs text-gray-400 mt-2">
			{#if stage === 'idle'}
				Upload a file to continue
			{:else if stage === 'selected'}
				Click "Upload & Validate" to proceed
			{:else if isWorking}
				Please wait...
			{:else if stage === 'done' && !validationPassed}
				Fix validation errors to continue
			{:else if canProceed}
				Validation passed — ready to continue
			{:else}
				Upload a file to continue
			{/if}
		</p>
	</div>
</main>
