<script lang="ts">
	// Analytics page — mock data, coming soon
</script>

<svelte:head>
	<title>Analytics — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<h1 class="text-3xl font-bold mb-4">Analytics</h1>
	<p class="text-gray-600 mb-6">
		Track visits, engagement, and performance across all your worlds.
	</p>

	<!-- Coming Soon Banner -->
	<div class="mb-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start gap-3">
		<svg
			class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<div>
			<p class="text-sm font-medium text-indigo-800">Analytics - Coming Soon</p>
			<p class="text-sm text-indigo-600 mt-0.5">
				Analytics powered by Supabase Edge Functions will be available in a future update. The data
				shown below is placeholder content.
			</p>
		</div>
	</div>

	<!-- Mock Stat Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Total Visits</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">1,247</p>
			<p class="text-xs text-green-500 mt-1">+12.3% from last period</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Unique Visitors</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">892</p>
			<p class="text-xs text-green-500 mt-1">+8.1% from last period</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Avg. Session</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">3m 42s</p>
			<p class="text-xs text-gray-400 mt-1">Across all worlds</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Return Rate</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">34%</p>
			<p class="text-xs text-yellow-500 mt-1">-2.1% from last period</p>
		</div>
	</div>

	<!-- Time Range Selector -->
	<div class="flex gap-2 mb-6">
		<button class="px-3 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
			7 Days
		</button>
		<button
			class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
		>
			30 Days
		</button>
		<button
			class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
		>
			90 Days
		</button>
		<button
			class="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
		>
			All Time
		</button>
	</div>

	<!-- Chart Placeholder -->
	<div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
		<h2 class="text-lg font-semibold mb-4">Visits Over Time</h2>
		<div
			class="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400"
		>
			<div class="text-center">
				<svg
					class="w-10 h-10 mx-auto mb-2 text-gray-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
				<p class="text-sm">Charts will appear here when analytics are enabled</p>
			</div>
		</div>
	</div>

	<!-- Per-World Breakdown -->
	<div class="bg-white rounded-lg border border-gray-200 p-6">
		<h2 class="text-lg font-semibold mb-4">Per-World Breakdown</h2>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-200">
						<th class="text-left py-3 px-2 font-medium text-gray-500">World</th>
						<th class="text-right py-3 px-2 font-medium text-gray-500">Visits</th>
						<th class="text-right py-3 px-2 font-medium text-gray-500">Unique</th>
						<th class="text-right py-3 px-2 font-medium text-gray-500">Avg. Session</th>
						<th class="text-right py-3 px-2 font-medium text-gray-500">Return Rate</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					<tr class="text-gray-600">
						<td class="py-3 px-2 font-medium text-gray-800">Sample World</td>
						<td class="py-3 px-2 text-right">743</td>
						<td class="py-3 px-2 text-right">521</td>
						<td class="py-3 px-2 text-right">4m 12s</td>
						<td class="py-3 px-2 text-right">38%</td>
					</tr>
					<tr class="text-gray-600">
						<td class="py-3 px-2 font-medium text-gray-800">Gallery Scene</td>
						<td class="py-3 px-2 text-right">504</td>
						<td class="py-3 px-2 text-right">371</td>
						<td class="py-3 px-2 text-right">3m 05s</td>
						<td class="py-3 px-2 text-right">29%</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-xs text-gray-400 mt-4 text-center">
			All data shown is placeholder content. Real analytics will be available in a future update.
		</p>
	</div>
</div>
