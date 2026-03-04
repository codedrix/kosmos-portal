<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let publishing = $state(false);
	let publishStep = $state('');
	let copied = $state(false);

	// Determine display state from form action results
	let publishSuccess = $derived(form?.success === true);
	let publishError = $derived(form?.error ?? null);
	let publishedUrl = $derived(form?.worldUrl ?? null);

	/**
	 * Copy the world URL to the clipboard and show a brief confirmation.
	 */
	function copyUrl() {
		if (publishedUrl) {
			navigator.clipboard.writeText(publishedUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}

	/**
	 * Format a capability name for display:
	 * scene_read -> Scene Read
	 */
	function formatCap(cap: string): string {
		return cap
			.split('_')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
	}
</script>

<svelte:head>
	<title>Review &amp; Publish — Kosmos WorldPublisher</title>
</svelte:head>

<main class="container mx-auto px-4 py-8 max-w-2xl">
	<div class="mb-6">
		<a href="/upload/details" class="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to Details</a>
	</div>

	<h1 class="text-3xl font-bold mb-4">Review &amp; Publish</h1>
	<p class="text-gray-600 mb-8">
		Review your world details and validation results before publishing.
	</p>

	<!-- Publish Success -->
	{#if publishSuccess && publishedUrl}
		<div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center mb-8">
			<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<h2 class="text-xl font-bold text-green-800 mb-2">World Published!</h2>
			<p class="text-sm text-green-700 mb-4">
				Your world is now live and can be visited in Kosmos VR.
			</p>
			<div class="bg-white border border-green-300 rounded-lg px-4 py-3 inline-flex items-center gap-3">
				<code class="text-sm font-mono text-green-800">{publishedUrl}</code>
				<button
					type="button"
					onclick={copyUrl}
					class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors {copied
						? 'bg-green-100 text-green-700'
						: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
				>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
			<div class="mt-6 flex justify-center gap-4">
				<a
					href="/dashboard"
					class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
				>
					Go to Dashboard
				</a>
				<a
					href="/upload"
					class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					Upload Another
				</a>
			</div>
		</div>
	{:else}
		<!-- Publish Error -->
		{#if publishError}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
				<strong>Publish failed:</strong> {publishError}
			</div>
		{/if}

		<!-- World Summary -->
		<div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
			<div class="p-6">
				<h2 class="text-lg font-semibold mb-4">World Summary</h2>
				<dl class="space-y-3 text-sm">
					<div class="flex justify-between">
						<dt class="text-gray-500">Name</dt>
						<dd class="font-medium text-gray-800">{data.details.worldName}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-gray-500">World URL</dt>
						<dd class="font-mono text-sm text-indigo-600">{data.worldUrl}</dd>
					</div>
					<div class="flex justify-between items-start">
						<dt class="text-gray-500">Description</dt>
						<dd class="font-medium text-gray-800 text-right max-w-xs">
							{data.details.description}
						</dd>
					</div>
					{#if data.details.versionNotes}
						<div class="flex justify-between items-start">
							<dt class="text-gray-500">Version Notes</dt>
							<dd class="font-medium text-gray-800 text-right max-w-xs">
								{data.details.versionNotes}
							</dd>
						</div>
					{/if}
					<div class="flex justify-between items-start">
						<dt class="text-gray-500">Capabilities</dt>
						<dd class="text-right">
							{#if data.details.capabilities.length > 0}
								<div class="flex flex-wrap justify-end gap-1">
									{#each data.details.capabilities as cap}
										<span class="inline-block px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full">
											{formatCap(cap)}
										</span>
									{/each}
								</div>
							{:else}
								<span class="text-gray-400">None selected</span>
							{/if}
						</dd>
					</div>
					{#if data.details.tags.length > 0}
						<div class="flex justify-between items-start">
							<dt class="text-gray-500">Tags</dt>
							<dd class="text-right">
								<div class="flex flex-wrap justify-end gap-1">
									{#each data.details.tags as tag}
										<span class="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
											{tag}
										</span>
									{/each}
								</div>
							</dd>
						</div>
					{/if}
				</dl>
			</div>

			<!-- Validation Results -->
			<div class="p-6">
				<h2 class="text-lg font-semibold mb-4">Validation Results</h2>
				<div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
					<svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<p class="text-sm font-medium text-green-800">
							26 validation rules checked
						</p>
						<p class="text-xs text-green-600 mt-1">
							Polygons, textures, Wasm size, required exports, bundle limits, and more.
						</p>
					</div>
				</div>
			</div>

			<!-- Thumbnail Preview -->
			<div class="p-6">
				<h2 class="text-lg font-semibold mb-4">Thumbnail Preview</h2>
				<div class="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
					1280 x 720 preview
				</div>
			</div>
		</div>

		<!-- Publishing Progress -->
		{#if publishing}
			<div class="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
				<div class="flex items-center gap-3">
					<svg class="w-5 h-5 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					<span class="text-sm font-medium text-indigo-700">{publishStep}</span>
				</div>
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex justify-between mt-8">
			<a
				href="/upload/details"
				class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
			>
				&larr; Edit Details
			</a>
			<form
				method="POST"
				action="?/publish"
				use:enhance={() => {
					publishing = true;
					publishStep = 'Creating world entry...';

					return async ({ update }) => {
						publishStep = 'Registering version...';
						// Short delay to show the second step
						await new Promise((r) => setTimeout(r, 500));
						publishing = false;
						publishStep = '';
						await update();
					};
				}}
			>
				<button
					type="submit"
					disabled={publishing}
					class="inline-flex items-center px-8 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if publishing}
						Publishing...
					{:else}
						Publish World
					{/if}
				</button>
			</form>
		</div>

		<p class="text-xs text-gray-400 text-center mt-4">
			By publishing, you confirm your world complies with the Kosmos content guidelines.
		</p>
	{/if}
</main>
