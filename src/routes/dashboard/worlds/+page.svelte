<script lang="ts">
	// My Worlds list — requires auth
</script>

<svelte:head>
	<title>My Worlds — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold mb-2">My Worlds</h1>
			<p class="text-gray-600">Manage all your published and draft worlds.</p>
		</div>
		<a
			href="/upload"
			class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
		>
			<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
			</svg>
			Upload New
		</a>
	</div>

	<!-- Filters -->
	<div class="flex gap-2 mb-6">
		<button class="px-3 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
			All
		</button>
		<button class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
			Published
		</button>
		<button class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
			Draft
		</button>
		<button class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
			Under Review
		</button>
	</div>

	<!-- Worlds Table / List -->
	<div class="bg-white rounded-lg border border-gray-200">
		<!-- TODO: Implement world list with real data -->
		<div class="p-12 text-center text-gray-400">
			<p class="mb-2">No worlds found.</p>
			<p class="text-sm">
				<a href="/upload" class="text-indigo-600 hover:underline">Upload your first world</a>
				to get started.
			</p>
		</div>
	</div>
</div>
