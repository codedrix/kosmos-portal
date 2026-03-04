<script lang="ts">
	// Dashboard overview — requires auth
</script>

<svelte:head>
	<title>Dashboard — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<h1 class="text-3xl font-bold mb-2">Dashboard</h1>
	<p class="text-gray-600 mb-8">Welcome back. Here is an overview of your worlds.</p>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Total Worlds</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">--</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Published</p>
			<p class="text-2xl font-bold text-green-600 mt-1">--</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Total Visits</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">--</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Active Users (24h)</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">--</p>
		</div>
	</div>

	<!-- Recent Worlds -->
	<div class="bg-white rounded-lg border border-gray-200">
		<div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Recent Worlds</h2>
			<a href="/dashboard/worlds" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
				View All &rarr;
			</a>
		</div>
		<div class="p-8 text-center text-gray-400">
			<!-- TODO: Implement world list -->
			<p>No worlds yet. <a href="/upload" class="text-indigo-600 hover:underline">Upload your first world</a>.</p>
		</div>
	</div>
</div>
