<script lang="ts">
	import type { WorldRecord } from '$lib/types.js';

	let { data } = $props();

	const totalWorlds = $derived(data.totalWorlds as number);
	const publishedCount = $derived(data.publishedCount as number);
	const recentWorlds = $derived(data.recentWorlds as WorldRecord[]);

	function statusBadgeClass(status: WorldRecord['status']): string {
		switch (status) {
			case 'published':
				return 'bg-green-100 text-green-700';
			case 'unlisted':
				return 'bg-yellow-100 text-yellow-700';
			case 'removed':
				return 'bg-red-100 text-red-700';
			default:
				return 'bg-gray-100 text-gray-600';
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
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
			<p class="text-2xl font-bold text-gray-800 mt-1">{totalWorlds}</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Published</p>
			<p class="text-2xl font-bold text-green-600 mt-1">{publishedCount}</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Total Visits</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">--</p>
			<p class="text-xs text-gray-400 mt-0.5">Coming soon</p>
		</div>
		<div class="bg-white rounded-lg border border-gray-200 p-5">
			<p class="text-sm text-gray-500">Active Users (24h)</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">--</p>
			<p class="text-xs text-gray-400 mt-0.5">Coming soon</p>
		</div>
	</div>

	<!-- Recent Worlds -->
	<div class="bg-white rounded-lg border border-gray-200">
		<div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Recent Worlds</h2>
			{#if recentWorlds.length > 0}
				<a href="/dashboard/worlds" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
					View All &rarr;
				</a>
			{/if}
		</div>

		{#if recentWorlds.length === 0}
			<div class="p-8 text-center text-gray-400">
				<svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
				</svg>
				<p>No worlds yet. <a href="/upload" class="text-indigo-600 hover:underline">Upload your first world</a>.</p>
			</div>
		{:else}
			<div class="divide-y divide-gray-100">
				{#each recentWorlds as world}
					<a
						href="/dashboard/worlds/{world.id}"
						class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
					>
						<div class="flex items-center gap-4">
							{#if world.thumbnail_url}
								<img
									src={world.thumbnail_url}
									alt={world.name}
									class="w-12 h-8 rounded object-cover border border-gray-200"
								/>
							{:else}
								<div class="w-12 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
									<svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
									</svg>
								</div>
							{/if}
							<div>
								<p class="text-sm font-medium text-gray-900">{world.name}</p>
								<p class="text-xs text-gray-500">world://{world.slug}</p>
							</div>
						</div>
						<div class="flex items-center gap-4">
							<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {statusBadgeClass(world.status)}">
								{world.status}
							</span>
							<span class="text-xs text-gray-400">{formatDate(world.updated_at)}</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
