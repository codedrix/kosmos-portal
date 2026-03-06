<script lang="ts">
	import type { VersionEntry } from './+page.server';

	let { data } = $props();

	let world = $derived(data.world);
	let versions = $derived<VersionEntry[]>(data.versions ?? []);

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

	/**
	 * Format an ISO date string into a readable date.
	 */
	function formatDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return iso;
		}
	}

	/**
	 * Format an ISO date string into a readable date with time.
	 */
	function formatDateTime(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return iso;
		}
	}
</script>

<svelte:head>
	<title>{world ? `Version History — ${world.name}` : 'Version History'} — Kosmos</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<!-- Error State -->
	{#if data.error && !world}
		<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6">
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
					<p class="font-semibold">Unable to load version history</p>
					<p class="text-sm mt-1">{data.error}</p>
					<a href="/worlds" class="text-sm text-indigo-600 hover:text-indigo-700 mt-3 inline-block"
						>&larr; Back to Explore</a
					>
				</div>
			</div>
		</div>
	{/if}

	{#if world}
		<!-- Breadcrumb / Back Link -->
		<nav class="mb-6 text-sm text-gray-500">
			<a href="/worlds" class="hover:text-indigo-600 transition-colors">Explore</a>
			<span class="mx-2">/</span>
			<a href="/worlds/{world.slug}" class="hover:text-indigo-600 transition-colors">{world.name}</a
			>
			<span class="mx-2">/</span>
			<span class="text-gray-800 font-medium">Versions</span>
		</nav>

		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-2">Version History</h1>
			<p class="text-gray-600">
				All published versions of <span class="font-medium text-gray-800">{world.name}</span>
				by <span class="font-medium text-gray-700">{world.author}</span>.
			</p>
		</div>

		<!-- Version Timeline -->
		{#if versions.length > 0}
			<div class="space-y-4">
				{#each versions as version, index (version.versionId || index)}
					{@const isLatest = index === 0}
					<div
						class="bg-white rounded-lg border border-gray-200 p-6 {isLatest
							? 'ring-2 ring-indigo-100 border-indigo-200'
							: ''}"
					>
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-3 mb-1">
									<span class="text-lg font-semibold text-gray-900">
										v{version.version}
									</span>
									{#if isLatest}
										<span
											class="px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full"
										>
											Latest
										</span>
									{/if}
								</div>
								<p class="text-sm text-gray-500">
									Published on {formatDate(version.created_at)}
								</p>
								<div class="flex items-center gap-4 mt-2 text-sm text-gray-400">
									<span class="flex items-center gap-1">
										<svg
											class="w-4 h-4"
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
										Bundle: {formatSize(version.bundle_size_bytes)}
									</span>
									<span class="flex items-center gap-1">
										<svg
											class="w-4 h-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M4.5 12.75l6 6 9-13.5"
											/>
										</svg>
										Triangles: {formatNumber(version.triangle_count)}
									</span>
								</div>
							</div>

							<!-- Timestamp (right side on desktop) -->
							<div class="text-sm text-gray-400 shrink-0">
								{formatDateTime(version.created_at)}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Single version note -->
			{#if versions.length === 1}
				<div
					class="mt-8 p-6 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400"
				>
					<p class="text-sm">This is the only version. Future updates will appear here.</p>
				</div>
			{/if}
		{:else}
			<!-- Empty State -->
			<div class="text-center py-16">
				<svg
					class="w-12 h-12 text-gray-300 mx-auto mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h2 class="text-lg font-semibold text-gray-700 mb-2">No versions found</h2>
				<p class="text-gray-500">Version history is not available for this world.</p>
			</div>
		{/if}
	{/if}
</main>
