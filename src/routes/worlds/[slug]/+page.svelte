<script lang="ts">
	import type { ResolvedWorld } from './+page.server';

	let { data } = $props();

	let copied = $state(false);

	let world = $derived<ResolvedWorld | null>(data.world ?? null);

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
	 * Copy the world:// URL to the clipboard and show a brief confirmation.
	 */
	async function copyWorldUrl(): Promise<void> {
		if (!world) return;
		const url = `world://${world.slug}`;
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			// Fallback: prompt user
			window.prompt('Copy this world URL:', url);
		}
	}

	/**
	 * Map status to a color class.
	 */
	function statusColor(status: string): string {
		switch (status) {
			case 'published':
				return 'text-green-600 bg-green-50';
			case 'unlisted':
				return 'text-yellow-600 bg-yellow-50';
			case 'removed':
				return 'text-red-600 bg-red-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	}
</script>

<svelte:head>
	<title>{world ? `${world.name} — Kosmos` : 'World Not Found — Kosmos'}</title>
	{#if world}
		<meta
			name="description"
			content={world.description || `${world.name} by ${world.author} — a VR world on Kosmos.`}
		/>
	{/if}
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<!-- Error State (non-404, e.g. API connection failure) -->
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
					<p class="font-semibold">Unable to load world details</p>
					<p class="text-sm mt-1">{data.error}</p>
					<a href="/worlds" class="text-sm text-indigo-600 hover:text-indigo-700 mt-3 inline-block"
						>&larr; Back to Explore</a
					>
				</div>
			</div>
		</div>
	{/if}

	{#if world}
		<!-- Breadcrumb -->
		<nav class="mb-6 text-sm text-gray-500">
			<a href="/worlds" class="hover:text-indigo-600 transition-colors">Explore</a>
			<span class="mx-2">/</span>
			<span class="text-gray-800 font-medium">{world.name}</span>
		</nav>

		<!-- World Header -->
		<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
			<!-- Thumbnail -->
			{#if world.thumbnail_url}
				<div class="w-full h-64 md:h-80 bg-gray-100 overflow-hidden">
					<img
						src={world.thumbnail_url}
						alt="{world.name} thumbnail"
						class="w-full h-full object-cover"
					/>
				</div>
			{:else}
				<div
					class="w-full h-64 md:h-80 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center"
				>
					<svg
						class="w-20 h-20 text-indigo-200"
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

			<div class="p-8">
				<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
					<div class="flex-1 min-w-0">
						<h1 class="text-3xl font-bold mb-2">{world.name}</h1>
						<p class="text-gray-500 text-sm mb-3">
							by <span class="font-medium text-gray-700">{world.author}</span>
						</p>

						<!-- world:// URL -->
						<div
							class="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-4"
						>
							<code class="text-sm font-mono text-indigo-600 font-semibold"
								>world://{world.slug}</code
							>
							<button
								onclick={copyWorldUrl}
								class="text-gray-400 hover:text-indigo-600 transition-colors"
								title="Copy world URL"
							>
								{#if copied}
									<svg
										class="w-4 h-4 text-green-500"
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
								{:else}
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
											d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
										/>
									</svg>
								{/if}
							</button>
						</div>

						{#if world.description}
							<p class="text-gray-600 max-w-2xl">{world.description}</p>
						{/if}
					</div>

					<div class="flex flex-col gap-2 shrink-0">
						<button
							onclick={copyWorldUrl}
							class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
						>
							{#if copied}
								Copied!
							{:else}
								Launch in Kosmos
							{/if}
						</button>
						<a
							href="/worlds/{world.slug}/versions"
							class="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							Version History
						</a>
					</div>
				</div>

				<!-- World Info Cards -->
				<div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-xs text-gray-400 uppercase tracking-wide">Version</p>
						<p class="text-lg font-semibold text-gray-800">{world.version}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-xs text-gray-400 uppercase tracking-wide">Bundle Size</p>
						<p class="text-lg font-semibold text-gray-800">{formatSize(world.bundle_size_bytes)}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-xs text-gray-400 uppercase tracking-wide">Triangles</p>
						<p class="text-lg font-semibold text-gray-800">{formatNumber(world.triangle_count)}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-xs text-gray-400 uppercase tracking-wide">Status</p>
						<p
							class="text-lg font-semibold capitalize {statusColor(
								world.status
							)} inline-block px-2 py-0.5 rounded"
						>
							{world.status}
						</p>
					</div>
				</div>

				<!-- Capabilities -->
				{#if world.capabilities && world.capabilities.length > 0}
					<div class="mt-6">
						<p class="text-xs text-gray-400 uppercase tracking-wide mb-3">Capabilities</p>
						<div class="flex flex-wrap gap-2">
							{#each world.capabilities as cap}
								<span
									class="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full"
								>
									{cap}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Published Date -->
				{#if world.published_at}
					<div class="mt-6 pt-6 border-t border-gray-100">
						<p class="text-sm text-gray-500">
							Published on {formatDate(world.published_at)}
						</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Clipboard Toast -->
	{#if copied}
		<div
			class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50 animate-fade-in"
		>
			Copied world://{world?.slug} to clipboard
		</div>
	{/if}
</main>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}
</style>
