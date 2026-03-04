<script lang="ts">
	let publishing = $state(false);
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

	<!-- Upload Summary -->
	<div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
		<div class="p-6">
			<h2 class="text-lg font-semibold mb-4">World Summary</h2>
			<dl class="space-y-3 text-sm">
				<div class="flex justify-between">
					<dt class="text-gray-500">Name</dt>
					<dd class="font-medium text-gray-800">--</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-gray-500">Description</dt>
					<dd class="font-medium text-gray-800 text-right max-w-xs truncate">--</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-gray-500">Bundle Size</dt>
					<dd class="font-medium text-gray-800">-- MB</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-gray-500">Capabilities</dt>
					<dd class="font-medium text-gray-800">--</dd>
				</div>
			</dl>
		</div>

		<!-- Validation Results Placeholder -->
		<div class="p-6">
			<h2 class="text-lg font-semibold mb-4">Validation Results</h2>
			<div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 text-sm">
				Validation results will appear here after processing.
				<br />
				26 rules checked (polygons, textures, Wasm size, required exports, etc.)
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

	<!-- Actions -->
	<div class="flex justify-between mt-8">
		<a
			href="/upload/details"
			class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
		>
			&larr; Edit Details
		</a>
		<button
			disabled={publishing}
			onclick={() => {
				publishing = true;
				// TODO: Implement publish flow
			}}
			class="inline-flex items-center px-8 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if publishing}
				Publishing...
			{:else}
				Publish World
			{/if}
		</button>
	</div>

	<p class="text-xs text-gray-400 text-center mt-4">
		By publishing, you confirm your world complies with the Kosmos content guidelines.
	</p>
</main>
