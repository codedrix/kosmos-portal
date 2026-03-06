<script lang="ts">
	import type { WorldRecord } from '$lib/types.js';

	let { data } = $props();

	const worlds = $derived(data.worlds as WorldRecord[]);

	type FilterValue = 'all' | 'published' | 'unlisted' | 'removed';

	let activeFilter = $state<FilterValue>('all');

	const filteredWorlds = $derived(
		activeFilter === 'all' ? worlds : worlds.filter((w) => w.status === activeFilter)
	);

	const filters: { label: string; value: FilterValue }[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Published', value: 'published' },
		{ label: 'Unlisted', value: 'unlisted' },
		{ label: 'Removed', value: 'removed' }
	];

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

	function formatBytes(bytes: number | null | undefined): string {
		if (!bytes) return '--';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
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
		{#each filters as filter}
			<button
				onclick={() => {
					activeFilter = filter.value;
				}}
				class="px-3 py-1.5 text-sm font-medium rounded-full transition-colors {activeFilter ===
				filter.value
					? 'bg-indigo-100 text-indigo-700'
					: 'text-gray-500 hover:bg-gray-100'}"
			>
				{filter.label}
				{#if filter.value === 'all'}
					<span class="ml-1 text-xs">({worlds.length})</span>
				{:else}
					{@const count = worlds.filter((w) => w.status === filter.value).length}
					{#if count > 0}
						<span class="ml-1 text-xs">({count})</span>
					{/if}
				{/if}
			</button>
		{/each}
	</div>

	<!-- Worlds Table -->
	<div class="bg-white rounded-lg border border-gray-200">
		{#if filteredWorlds.length === 0}
			<div class="p-12 text-center text-gray-400">
				{#if worlds.length === 0}
					<svg
						class="w-12 h-12 mx-auto mb-3 text-gray-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
						/>
					</svg>
					<p class="mb-2">No worlds found.</p>
					<p class="text-sm">
						<a href="/upload" class="text-indigo-600 hover:underline">Upload your first world</a>
						to get started.
					</p>
				{:else}
					<p>No worlds match the selected filter.</p>
				{/if}
			</div>
		{:else}
			<!-- Table Header -->
			<div
				class="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider"
			>
				<div class="col-span-4">World</div>
				<div class="col-span-2">Status</div>
				<div class="col-span-2">Slug</div>
				<div class="col-span-2">Created</div>
				<div class="col-span-2 text-right">Updated</div>
			</div>

			<!-- Table Rows -->
			<div class="divide-y divide-gray-100">
				{#each filteredWorlds as world}
					<a
						href="/dashboard/worlds/{world.id}"
						class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
					>
						<!-- World Name + Thumbnail -->
						<div class="col-span-4 flex items-center gap-3">
							{#if world.thumbnail_url}
								<img
									src={world.thumbnail_url}
									alt={world.name}
									class="w-10 h-7 rounded object-cover border border-gray-200 shrink-0"
								/>
							{:else}
								<div
									class="w-10 h-7 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"
								>
									<svg
										class="w-4 h-4 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="1.5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
										/>
									</svg>
								</div>
							{/if}
							<span class="text-sm font-medium text-gray-900 truncate">{world.name}</span>
						</div>

						<!-- Status Badge -->
						<div class="col-span-2">
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {statusBadgeClass(
									world.status
								)}"
							>
								{world.status}
							</span>
						</div>

						<!-- Slug -->
						<div class="col-span-2">
							<span class="text-xs text-gray-500 font-mono">{world.slug}</span>
						</div>

						<!-- Created -->
						<div class="col-span-2">
							<span class="text-xs text-gray-500">{formatDate(world.created_at)}</span>
						</div>

						<!-- Updated -->
						<div class="col-span-2 text-right">
							<span class="text-xs text-gray-500">{formatDate(world.updated_at)}</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
