<script lang="ts">
	// TODO: Add +page.server.ts load function to fetch world data by slug
</script>

<svelte:head>
	<title>World Details — Kosmos WorldPublisher</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<!-- World Header -->
	<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
		<!-- Thumbnail Placeholder -->
		<div class="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
			<span class="text-gray-400 text-lg">World Thumbnail (1280x720)</span>
		</div>

		<div class="p-8">
			<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
				<div>
					<h1 class="text-3xl font-bold mb-2">World Name</h1>
					<p class="text-gray-500 text-sm mb-4">
						by <span class="font-medium text-gray-700">author</span>
					</p>
					<p class="text-gray-600 max-w-2xl">
						A brief description of this world. Creators will fill this in when they upload their world bundle.
					</p>
				</div>

				<div class="flex flex-col gap-2 shrink-0">
					<button
						class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Launch in Kosmos
					</button>
					<a
						href="versions"
						class="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Version History
					</a>
				</div>
			</div>

			<!-- World Info -->
			<div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
				<div class="bg-gray-50 rounded-lg p-4">
					<p class="text-xs text-gray-400 uppercase tracking-wide">Version</p>
					<p class="text-lg font-semibold text-gray-800">1.0.0</p>
				</div>
				<div class="bg-gray-50 rounded-lg p-4">
					<p class="text-xs text-gray-400 uppercase tracking-wide">Bundle Size</p>
					<p class="text-lg font-semibold text-gray-800">-- MB</p>
				</div>
				<div class="bg-gray-50 rounded-lg p-4">
					<p class="text-xs text-gray-400 uppercase tracking-wide">Polygons</p>
					<p class="text-lg font-semibold text-gray-800">--</p>
				</div>
				<div class="bg-gray-50 rounded-lg p-4">
					<p class="text-xs text-gray-400 uppercase tracking-wide">Status</p>
					<p class="text-lg font-semibold text-green-600">Published</p>
				</div>
			</div>
		</div>
	</div>

	<!-- TODO: Implement full UI (comments, related worlds, embed code) -->
	<div class="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400">
		Additional world details coming soon
	</div>
</main>
