<script lang="ts">
	import type { WorldEntry } from './+page.server';

	let { data } = $props();

	// Client-side search filter
	let searchQuery = $state('');

	// Reactive filtered worlds based on search
	let filteredWorlds = $derived(
		searchQuery.trim() === ''
			? data.worlds
			: data.worlds.filter((w: WorldEntry) => {
					const q = searchQuery.toLowerCase();
					return (
						w.name.toLowerCase().includes(q) ||
						w.author.toLowerCase().includes(q) ||
						w.description.toLowerCase().includes(q)
					);
				})
	);

	/**
	 * Format bytes into a human-readable size string.
	 */
	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	/**
	 * Format a number with commas for readability.
	 */
	function formatNumber(n: number): string {
		return n.toLocaleString();
	}
</script>

<svelte:head>
	<title>Explore Worlds — Kosmos</title>
	<meta name="description" content="Browse and discover VR worlds built by creators on Kosmos." />
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold tracking-tight mb-2">Explore Worlds</h1>
		<p class="text-gray-600 text-lg">
			Discover VR worlds built by creators on Kosmos. Open any world with its
			<code class="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">world://</code> URL on Quest 3.
		</p>
	</div>

	<!-- Search Bar -->
	<div class="mb-8">
		<div class="relative max-w-xl">
			<svg
				class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
				/>
			</svg>
			<input
				type="text"
				placeholder="Search worlds by name, author, or description..."
				bind:value={searchQuery}
				class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
			/>
		</div>
	</div>

	<!-- Error State -->
	{#if data.error}
		<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 mb-8">
			<div class="flex items-start gap-3">
				<svg
					class="w-5 h-5 mt-0.5 shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
					/>
				</svg>
				<div>
					<p class="font-semibold">Unable to load worlds</p>
					<p class="text-sm mt-1">{data.error}</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- World Grid -->
	{#if filteredWorlds.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredWorlds as world (world.slug)}
				<a
					href="/worlds/{world.slug}"
					class="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
				>
					<!-- Thumbnail -->
					{#if world.thumbnail_url}
						<div class="w-full aspect-video bg-gray-100 overflow-hidden">
							<img
								src={world.thumbnail_url}
								alt="{world.name} thumbnail"
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
						</div>
					{:else}
						<div
							class="w-full aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
						>
							<svg
								class="w-12 h-12 text-indigo-300"
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
						</div>
					{/if}

					<!-- Card Body -->
					<div class="p-5">
						<h3
							class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 truncate"
						>
							{world.name}
						</h3>
						<p class="text-sm text-gray-500 mb-3">
							by <span class="font-medium text-gray-700">{world.author}</span>
						</p>
						<p class="text-sm text-gray-600 line-clamp-2 mb-4">
							{world.description || 'No description provided.'}
						</p>

						<!-- Stats Row -->
						<div class="flex items-center gap-4 text-xs text-gray-400">
							<span class="flex items-center gap-1" title="Triangle count">
								<svg
									class="w-3.5 h-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>
								{formatNumber(world.triangle_count)}
							</span>
							<span class="flex items-center gap-1" title="Bundle size">
								<svg
									class="w-3.5 h-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
									/>
								</svg>
								{formatSize(world.bundle_size_bytes)}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Load More -->
		{#if data.hasMore && searchQuery.trim() === ''}
			<div class="mt-10 text-center">
				<a
					href="/worlds?offset={data.offset + data.limit}&limit={data.limit}"
					class="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
				>
					Load More Worlds
				</a>
			</div>
		{/if}

		<!-- Results Count -->
		{#if searchQuery.trim() !== ''}
			<p class="mt-6 text-sm text-gray-500 text-center">
				Showing {filteredWorlds.length} of {data.worlds.length} worlds matching "{searchQuery}"
			</p>
		{/if}
	{:else if !data.error}
		<!-- Empty State -->
		<div class="text-center py-20">
			<svg
				class="w-16 h-16 text-gray-300 mx-auto mb-4"
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
			{#if searchQuery.trim() !== ''}
				<h2 class="text-xl font-semibold text-gray-700 mb-2">No worlds match your search</h2>
				<p class="text-gray-500">Try a different search term or clear the filter.</p>
			{:else}
				<h2 class="text-xl font-semibold text-gray-700 mb-2">No worlds published yet</h2>
				<p class="text-gray-500 mb-6">Be the first to publish a world on Kosmos!</p>
				<a
					href="/upload"
					class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
				>
					Upload Your World
				</a>
			{/if}
		</div>
	{/if}
</main>
