<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	// Compute initial values reactively from props (form action result or saved data)
	let initialWorldName = $derived(form?.worldName ?? data.savedDetails?.worldName ?? '');
	let initialDescription = $derived(form?.description ?? data.savedDetails?.description ?? '');
	let initialVersionNotes = $derived(form?.versionNotes ?? data.savedDetails?.versionNotes ?? '');
	let initialTags = $derived<string[]>(form?.tags ?? data.savedDetails?.tags ?? []);
	let initialCapabilities = $derived<string[]>(
		form?.capabilities ?? data.savedDetails?.capabilities ?? []
	);

	// Mutable form state (seeded from derived initial values)
	let worldName = $state('');
	let description = $state('');
	let versionNotes = $state('');
	let selectedTags = $state<string[]>([]);
	let selectedCapabilities = $state<string[]>([]);

	// Sync from props when they change (e.g., form action returns with validation errors)
	$effect(() => {
		worldName = initialWorldName;
	});
	$effect(() => {
		description = initialDescription;
	});
	$effect(() => {
		versionNotes = initialVersionNotes;
	});
	$effect(() => {
		selectedTags = [...initialTags];
	});
	$effect(() => {
		selectedCapabilities = [...initialCapabilities];
	});

	/** Canonical 13 capabilities from Content Spec v1.0 (MANIFEST_004) */
	const capabilities = [
		'scene_read',
		'scene_write',
		'transform',
		'events',
		'audio',
		'animation',
		'ui_basic',
		'state',
		'timer',
		'player_read',
		'player_write',
		'physics_query',
		'physics_config'
	];

	const MAX_TAGS = 5;

	/** Slug pattern: 3-64 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphen */
	const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;

	let slugValid = $derived(worldName.length === 0 || SLUG_PATTERN.test(worldName));
	let slugTooShort = $derived(worldName.length > 0 && worldName.length < 3);
	let worldUrl = $derived(`world://${worldName || 'name'}.author`);
</script>

<svelte:head>
	<title>World Details — Kosmos WorldPublisher</title>
</svelte:head>

<main class="container mx-auto px-4 py-8 max-w-2xl">
	<div class="mb-6">
		<a href="/upload" class="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to Upload</a
		>
	</div>

	<h1 class="text-3xl font-bold mb-4">World Details</h1>
	<p class="text-gray-600 mb-8">
		Add metadata for your world. This information will be shown on the public world page.
	</p>

	{#if form?.error}
		<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-6">
		<!-- World Name (Slug) -->
		<div>
			<label for="world-name" class="block text-sm font-medium text-gray-700 mb-1">
				World Name <span class="text-red-500">*</span>
			</label>
			<input
				id="world-name"
				name="worldName"
				type="text"
				bind:value={worldName}
				placeholder="my-awesome-world"
				pattern="[a-z0-9][a-z0-9\-]{'{'}1,62{'}'}[a-z0-9]"
				required
				class="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent {!slugValid
					? 'border-red-400'
					: 'border-gray-300'}"
			/>
			<div class="flex items-center justify-between mt-1">
				<p class="text-xs {!slugValid ? 'text-red-500' : 'text-gray-400'}">
					{#if slugTooShort}
						Minimum 3 characters.
					{:else if !slugValid}
						Lowercase letters, numbers, and hyphens only. No leading/trailing hyphen.
					{:else}
						3-64 characters. Lowercase letters, numbers, and hyphens.
					{/if}
				</p>
				<p class="text-xs text-gray-500 font-mono">
					{worldUrl}
				</p>
			</div>
		</div>

		<!-- Description -->
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
				Description <span class="text-red-500">*</span>
			</label>
			<textarea
				id="description"
				name="description"
				bind:value={description}
				rows={4}
				maxlength={500}
				required
				placeholder="Describe your world..."
				class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
			></textarea>
			<p class="text-xs text-gray-400 mt-1 text-right">{description.length}/500</p>
		</div>

		<!-- Version Notes -->
		<div>
			<label for="version-notes" class="block text-sm font-medium text-gray-700 mb-1">
				Version Notes
			</label>
			<textarea
				id="version-notes"
				name="versionNotes"
				bind:value={versionNotes}
				rows={3}
				maxlength={300}
				placeholder="What changed in this version? (optional)"
				class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
			></textarea>
			<p class="text-xs text-gray-400 mt-1">Shown in the version history on your world page.</p>
		</div>

		<!-- Thumbnail -->
		<div>
			<p class="block text-sm font-medium text-gray-700 mb-1">Thumbnail</p>
			<div
				class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 text-sm"
			>
				Drop a thumbnail image here (1280x720, PNG or JPG, max 512 KB)
			</div>
		</div>

		<!-- Tags -->
		<fieldset>
			<legend class="block text-sm font-medium text-gray-700 mb-2">
				Tags <span class="text-xs text-gray-400 font-normal">(max {MAX_TAGS})</span>
			</legend>
			<div class="flex flex-wrap gap-2">
				{#each data.validTags as tag}
					{@const isSelected = selectedTags.includes(tag)}
					{@const isDisabled = !isSelected && selectedTags.length >= MAX_TAGS}
					<label
						class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer select-none transition-colors
						{isSelected
							? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
							: isDisabled
								? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
								: 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}"
					>
						<input
							type="checkbox"
							name="tags"
							value={tag}
							checked={isSelected}
							disabled={isDisabled}
							onchange={() => {
								if (isSelected) {
									selectedTags = selectedTags.filter((t) => t !== tag);
								} else if (selectedTags.length < MAX_TAGS) {
									selectedTags = [...selectedTags, tag];
								}
							}}
							class="sr-only"
						/>
						{tag}
					</label>
				{/each}
			</div>
			{#if selectedTags.length > 0}
				<p class="text-xs text-gray-400 mt-2">
					{selectedTags.length}/{MAX_TAGS} selected
				</p>
			{/if}
		</fieldset>

		<!-- Capabilities -->
		<fieldset>
			<legend class="block text-sm font-medium text-gray-700 mb-2"> Capabilities </legend>
			<p class="text-xs text-gray-400 mb-3">
				Select which capabilities your world script requires. These determine what DOM API functions
				the Wasm module can call at runtime.
			</p>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
				{#each capabilities as cap}
					<label
						class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm"
					>
						<input
							type="checkbox"
							name="capabilities"
							value={cap}
							checked={selectedCapabilities.includes(cap)}
							onchange={() => {
								if (selectedCapabilities.includes(cap)) {
									selectedCapabilities = selectedCapabilities.filter((c) => c !== cap);
								} else {
									selectedCapabilities = [...selectedCapabilities, cap];
								}
							}}
							class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<span class="text-gray-700">{cap}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<!-- World URL Preview -->
		{#if worldName && slugValid}
			<div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
				<p class="text-xs font-medium text-indigo-600 mb-1">Your world URL</p>
				<p class="font-mono text-sm text-indigo-800">{worldUrl}</p>
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex justify-between pt-4">
			<a
				href="/upload"
				class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
			>
				&larr; Back
			</a>
			<button
				type="submit"
				class="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
			>
				Review &rarr;
			</button>
		</div>
	</form>
</main>
