<script lang="ts">
	// TODO: Add +page.server.ts load function to fetch version history by slug
</script>

<svelte:head>
	<title>Version History — Kosmos WorldPublisher</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<a href=".." class="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to World</a>
	</div>

	<h1 class="text-3xl font-bold mb-4">Version History</h1>
	<p class="text-gray-600 mb-8">All published versions of this world.</p>

	<!-- Version List Placeholder -->
	<div class="space-y-4">
		<!-- Example version entry -->
		<div class="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between">
			<div>
				<div class="flex items-center gap-3">
					<span class="text-lg font-semibold">v1.0.0</span>
					<span class="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Latest</span>
				</div>
				<p class="text-sm text-gray-500 mt-1">Published on --/--/----</p>
				<p class="text-sm text-gray-400 mt-1">Bundle size: -- MB &middot; Polygons: --</p>
			</div>
			<button class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
				View Details
			</button>
		</div>

		<!-- Placeholder for more versions -->
		<div class="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400">
			Older versions will appear here
		</div>
	</div>
</main>
