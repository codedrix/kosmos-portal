<script lang="ts">
	let worldName = $state('');
	let description = $state('');
	let selectedCapabilities = $state<string[]>([]);

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
</script>

<svelte:head>
	<title>World Details — Kosmos WorldPublisher</title>
</svelte:head>

<main class="container mx-auto px-4 py-8 max-w-2xl">
	<div class="mb-6">
		<a href="/upload" class="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to Upload</a>
	</div>

	<h1 class="text-3xl font-bold mb-4">World Details</h1>
	<p class="text-gray-600 mb-8">
		Add metadata for your world. This information will be shown on the public world page.
	</p>

	<form class="space-y-6" onsubmit={(e) => e.preventDefault()}>
		<!-- World Name -->
		<div>
			<label for="world-name" class="block text-sm font-medium text-gray-700 mb-1">
				World Name <span class="text-red-500">*</span>
			</label>
			<input
				id="world-name"
				type="text"
				bind:value={worldName}
				placeholder="my-awesome-world"
				class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
			/>
			<p class="text-xs text-gray-400 mt-1">
				Used in your world URL: <code>world://{worldName || 'name'}.author</code>
			</p>
		</div>

		<!-- Description -->
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
				Description <span class="text-red-500">*</span>
			</label>
			<textarea
				id="description"
				bind:value={description}
				rows={4}
				placeholder="Describe your world..."
				class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
			></textarea>
		</div>

		<!-- Thumbnail -->
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				Thumbnail
			</label>
			<div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 text-sm">
				Drop a thumbnail image here (1280x720, PNG or JPG, max 512 KB)
			</div>
		</div>

		<!-- Capabilities -->
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-2">
				Capabilities
			</label>
			<p class="text-xs text-gray-400 mb-3">
				Select which capabilities your world script requires.
			</p>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
				{#each capabilities as cap}
					<label class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
						<input
							type="checkbox"
							value={cap}
							checked={selectedCapabilities.includes(cap)}
							onchange={(e) => {
								const target = e.currentTarget;
								if (target.checked) {
									selectedCapabilities = [...selectedCapabilities, cap];
								} else {
									selectedCapabilities = selectedCapabilities.filter((c) => c !== cap);
								}
							}}
							class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<span class="text-gray-700">{cap}</span>
					</label>
				{/each}
			</div>
		</div>

		<!-- Actions -->
		<div class="flex justify-between pt-4">
			<a
				href="/upload"
				class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
			>
				&larr; Back
			</a>
			<a
				href="/upload/review"
				class="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
			>
				Review &rarr;
			</a>
		</div>
	</form>
</main>
