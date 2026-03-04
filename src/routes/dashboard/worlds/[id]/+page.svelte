<script lang="ts">
	import { enhance } from '$app/forms';
	import type { WorldRecord, WorldVersion } from '$lib/types.js';

	let { data, form } = $props();

	const world = $derived(data.world as WorldRecord);
	const versions = $derived(data.versions as WorldVersion[]);

	type TabId = 'overview' | 'versions' | 'settings';

	let activeTab = $state<TabId>('overview');

	const tabs: { id: TabId; label: string }[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'versions', label: 'Versions' },
		{ id: 'settings', label: 'Settings' }
	];

	// Compute the world:// URL using dot notation (slug already has dot format)
	const worldUrl = $derived(`world://${world.slug}`);

	// Get the latest version for overview stats
	const latestVersion = $derived(versions.length > 0 ? versions[0] : null);

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

	function formatDateTime(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatTriangles(count: number): string {
		if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
		if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
		return count.toString();
	}
</script>

<svelte:head>
	<title>{world.name} — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<!-- Back link -->
	<div class="mb-6">
		<a href="/dashboard/worlds" class="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to My Worlds</a>
	</div>

	<!-- World Header -->
	<div class="flex items-start justify-between mb-6">
		<div>
			<div class="flex items-center gap-3 mb-2">
				<h1 class="text-3xl font-bold">{world.name}</h1>
				<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {statusBadgeClass(world.status)}">
					{world.status}
				</span>
			</div>
			<div class="flex items-center gap-4 text-sm text-gray-500">
				<span class="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{worldUrl}</span>
				<span>Created {formatDate(world.created_at)}</span>
			</div>
		</div>
	</div>

	<!-- Form action feedback -->
	{#if form?.success}
		<div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
			{form.success}
		</div>
	{/if}
	{#if form?.error}
		<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<!-- Tab Navigation -->
	<div class="border-b border-gray-200 mb-6">
		<nav class="flex gap-6">
			{#each tabs as tab}
				<button
					onclick={() => { activeTab = tab.id; }}
					class="pb-3 text-sm font-medium border-b-2 transition-colors {activeTab === tab.id
						? 'border-indigo-600 text-indigo-600'
						: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				>
					{tab.label}
					{#if tab.id === 'versions'}
						<span class="ml-1 text-xs text-gray-400">({versions.length})</span>
					{/if}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Tab Content -->

	<!-- ===== Overview Tab ===== -->
	{#if activeTab === 'overview'}
		<div class="space-y-6">
			<!-- Thumbnail + Description -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Thumbnail -->
				<div class="lg:col-span-1">
					{#if world.thumbnail_url}
						<img
							src={world.thumbnail_url}
							alt="{world.name} thumbnail"
							class="w-full rounded-lg border border-gray-200 object-cover aspect-video"
						/>
					{:else}
						<div class="w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center aspect-video bg-gray-50">
							<div class="text-center text-gray-400">
								<svg class="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<p class="text-xs">No thumbnail</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Description + Details -->
				<div class="lg:col-span-2 space-y-4">
					<div class="bg-white rounded-lg border border-gray-200 p-5">
						<h3 class="text-sm font-medium text-gray-500 mb-2">Description</h3>
						{#if world.description}
							<p class="text-sm text-gray-700">{world.description}</p>
						{:else}
							<p class="text-sm text-gray-400 italic">No description provided.</p>
						{/if}
					</div>

					<!-- Quick Stats -->
					{#if latestVersion}
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<div class="bg-white rounded-lg border border-gray-200 p-4">
								<p class="text-xs text-gray-500 mb-1">Bundle Size</p>
								<p class="text-lg font-semibold text-gray-800">{formatBytes(latestVersion.bundle_size_bytes)}</p>
							</div>
							<div class="bg-white rounded-lg border border-gray-200 p-4">
								<p class="text-xs text-gray-500 mb-1">Wasm Size</p>
								<p class="text-lg font-semibold text-gray-800">{formatBytes(latestVersion.wasm_size_bytes)}</p>
							</div>
							<div class="bg-white rounded-lg border border-gray-200 p-4">
								<p class="text-xs text-gray-500 mb-1">Triangles</p>
								<p class="text-lg font-semibold text-gray-800">{formatTriangles(latestVersion.triangle_count)}</p>
							</div>
						</div>
					{:else}
						<div class="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-400 text-center">
							No version data available.
						</div>
					{/if}
				</div>
			</div>

			<!-- World URL info -->
			<div class="bg-white rounded-lg border border-gray-200 p-5">
				<h3 class="text-sm font-medium text-gray-500 mb-2">World URL</h3>
				<div class="flex items-center gap-3">
					<code class="flex-1 bg-gray-50 px-3 py-2 rounded text-sm font-mono text-gray-700 border border-gray-200">
						{worldUrl}
					</code>
				</div>
				<p class="text-xs text-gray-400 mt-2">Users visit your world using this URL in the Kosmos VR browser.</p>
			</div>
		</div>
	{/if}

	<!-- ===== Versions Tab ===== -->
	{#if activeTab === 'versions'}
		<div class="space-y-4">
			{#if versions.length === 0}
				<div class="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
					<svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
					<p>No versions published yet.</p>
					<p class="text-sm mt-1">Upload a bundle to create the first version.</p>
				</div>
			{:else}
				<!-- Version List -->
				<div class="bg-white rounded-lg border border-gray-200">
					<div class="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
						<div class="col-span-2">Version</div>
						<div class="col-span-3">Date</div>
						<div class="col-span-2">Bundle Size</div>
						<div class="col-span-2">Wasm Size</div>
						<div class="col-span-2">Triangles</div>
						<div class="col-span-1"></div>
					</div>
					<div class="divide-y divide-gray-100">
						{#each versions as version, i}
							<div class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center {i === 0 ? 'bg-indigo-50/30' : ''}">
								<div class="col-span-2">
									<span class="text-sm font-semibold text-gray-900">v{version.version}</span>
									{#if i === 0}
										<span class="ml-2 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Current</span>
									{/if}
								</div>
								<div class="col-span-3">
									<span class="text-sm text-gray-600">{formatDateTime(version.created_at)}</span>
								</div>
								<div class="col-span-2">
									<span class="text-sm text-gray-600">{formatBytes(version.bundle_size_bytes)}</span>
								</div>
								<div class="col-span-2">
									<span class="text-sm text-gray-600">{formatBytes(version.wasm_size_bytes)}</span>
								</div>
								<div class="col-span-2">
									<span class="text-sm text-gray-600">{formatTriangles(version.triangle_count)}</span>
								</div>
								<div class="col-span-1 text-right">
									{#if i !== 0}
										<button
											disabled
											class="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 cursor-not-allowed"
											title="Rollback coming soon"
										>
											Rollback
										</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- ===== Settings Tab ===== -->
	{#if activeTab === 'settings'}
		<div class="space-y-6">
			<!-- Edit Name / Description -->
			<div class="bg-white rounded-lg border border-gray-200 p-6">
				<h2 class="text-lg font-semibold mb-4">Basic Information</h2>
				<form method="POST" action="?/updateWorld" use:enhance>
					<div class="space-y-4">
						<div>
							<label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">World Name</label>
							<input
								id="edit-name"
								name="name"
								type="text"
								value={world.name}
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label for="edit-desc" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea
								id="edit-desc"
								name="description"
								rows={3}
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
							>{world.description ?? ''}</textarea>
						</div>
					</div>
					<button
						type="submit"
						class="mt-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Save Changes
					</button>
				</form>
			</div>

			<!-- Visibility Toggle -->
			<div class="bg-white rounded-lg border border-gray-200 p-6">
				<h2 class="text-lg font-semibold mb-2">Visibility</h2>
				<p class="text-sm text-gray-600 mb-4">
					Control whether your world appears in public listings. Unlisted worlds are only accessible via direct URL.
				</p>
				<form method="POST" action="?/toggleVisibility" use:enhance>
					<input type="hidden" name="status" value={world.status === 'published' ? 'unlisted' : 'published'} />
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-900">
								Currently: <span class="font-semibold {world.status === 'published' ? 'text-green-600' : 'text-yellow-600'}">{world.status}</span>
							</p>
						</div>
						{#if world.status !== 'removed'}
							<button
								type="submit"
								class="px-4 py-2 text-sm font-medium border rounded-lg transition-colors {world.status === 'published'
									? 'text-yellow-700 border-yellow-300 hover:bg-yellow-50'
									: 'text-green-700 border-green-300 hover:bg-green-50'}"
							>
								{world.status === 'published' ? 'Make Unlisted' : 'Publish'}
							</button>
						{:else}
							<p class="text-sm text-red-500">This world has been removed. Contact support to restore it.</p>
						{/if}
					</div>
				</form>
			</div>

			<!-- Danger Zone -->
			<div class="bg-white rounded-lg border border-red-200 p-6">
				<h2 class="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
				<p class="text-sm text-gray-600 mb-4">
					Permanently deleting a world removes all versions and is irreversible.
				</p>
				<button
					disabled
					class="px-4 py-2 text-sm font-medium text-red-400 border border-red-200 rounded-lg cursor-not-allowed bg-gray-50"
					title="Contact support to delete a world"
				>
					Delete World
				</button>
				<p class="text-xs text-gray-400 mt-2">Contact support to delete a world.</p>
			</div>
		</div>
	{/if}
</div>
