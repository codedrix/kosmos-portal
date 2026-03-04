<script lang="ts">
	// Analytics page — requires auth
</script>

<svelte:head>
	<title>Analytics — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<h1 class="text-3xl font-bold mb-4">Analytics</h1>
	<p class="text-gray-600 mb-8">Track visits, engagement, and performance across all your worlds.</p>

	<!-- Time Range Selector Placeholder -->
	<div class="flex gap-2 mb-6">
		<button class="px-3 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
			7 Days
		</button>
		<button class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
			30 Days
		</button>
		<button class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
			90 Days
		</button>
		<button class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
			All Time
		</button>
	</div>

	<!-- Chart Placeholder -->
	<div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
		<h2 class="text-lg font-semibold mb-4">Visits Over Time</h2>
		<div class="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
			Chart coming soon
		</div>
	</div>

	<!-- Per-World Breakdown -->
	<div class="bg-white rounded-lg border border-gray-200 p-6">
		<h2 class="text-lg font-semibold mb-4">Per-World Breakdown</h2>
		<div class="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 text-sm">
			World-level analytics coming soon
		</div>
	</div>
</div>
