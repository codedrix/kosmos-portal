<script lang="ts">
	import { enhance } from '$app/forms';
	import type { CreatorProfile, ApiKey } from '$lib/types.js';

	let { data, form } = $props();

	const profile = $derived(data.profile as CreatorProfile | null);
	const apiKeys = $derived(data.apiKeys as Pick<ApiKey, 'id' | 'creator_id' | 'key_prefix' | 'label' | 'last_used_at' | 'revoked' | 'created_at'>[]);
	const email = $derived(data.email as string);

	// Separate active and revoked keys
	const activeKeys = $derived(apiKeys.filter((k) => !k.revoked));
	const revokedKeys = $derived(apiKeys.filter((k) => k.revoked));

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Settings — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<h1 class="text-3xl font-bold mb-4">Settings</h1>
	<p class="text-gray-600 mb-8">Manage your account and API keys.</p>

	<!-- Form action feedback -->
	{#if form?.success}
		<div class="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
			{form.success}
		</div>
	{/if}
	{#if form?.error}
		<div class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<div class="space-y-6">
		<!-- Profile -->
		<div class="bg-white rounded-lg border border-gray-200 p-6">
			<h2 class="text-lg font-semibold mb-4">Profile</h2>
			<form method="POST" action="?/updateProfile" use:enhance>
				<div class="space-y-4">
					<div>
						<label for="display-name" class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
						<input
							id="display-name"
							name="display_name"
							type="text"
							value={profile?.display_name ?? ''}
							placeholder="Your display name"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
						<input
							id="username"
							name="username"
							type="text"
							value={profile?.username ?? ''}
							placeholder="your-username"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
						<p class="text-xs text-gray-400 mt-1">Lowercase letters, numbers, and hyphens. 3-32 characters.</p>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							disabled
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
						/>
						<p class="text-xs text-gray-400 mt-1">Email is managed by your auth provider.</p>
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

		<!-- API Keys -->
		<div class="bg-white rounded-lg border border-gray-200 p-6">
			<h2 class="text-lg font-semibold mb-2">API Keys</h2>
			<p class="text-sm text-gray-600 mb-4">
				API keys are used by the WorldPublisher CLI to upload worlds on your behalf.
			</p>

			{#if activeKeys.length > 0}
				<div class="mb-4 divide-y divide-gray-100 border border-gray-200 rounded-lg">
					{#each activeKeys as key}
						<div class="flex items-center justify-between px-4 py-3">
							<div>
								<div class="flex items-center gap-2">
									<span class="font-mono text-sm text-gray-800">{key.key_prefix}...</span>
									{#if key.label}
										<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{key.label}</span>
									{/if}
								</div>
								<div class="flex items-center gap-3 mt-1">
									<span class="text-xs text-gray-400">Created {formatDate(key.created_at)}</span>
									{#if key.last_used_at}
										<span class="text-xs text-gray-400">Last used {formatDate(key.last_used_at)}</span>
									{:else}
										<span class="text-xs text-gray-400">Never used</span>
									{/if}
								</div>
							</div>
							<form method="POST" action="?/revokeKey" use:enhance>
								<input type="hidden" name="key_id" value={key.id} />
								<button
									type="submit"
									class="text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 rounded px-2.5 py-1 hover:bg-red-50 transition-colors"
								>
									Revoke
								</button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<div class="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 text-sm">
					No active API keys.
				</div>
			{/if}

			{#if revokedKeys.length > 0}
				<details class="mb-4">
					<summary class="text-xs text-gray-400 cursor-pointer hover:text-gray-500">
						{revokedKeys.length} revoked key{revokedKeys.length > 1 ? 's' : ''}
					</summary>
					<div class="mt-2 divide-y divide-gray-100 border border-gray-200 rounded-lg opacity-60">
						{#each revokedKeys as key}
							<div class="flex items-center justify-between px-4 py-3">
								<div>
									<div class="flex items-center gap-2">
										<span class="font-mono text-sm text-gray-500 line-through">{key.key_prefix}...</span>
										{#if key.label}
											<span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{key.label}</span>
										{/if}
									</div>
									<span class="text-xs text-gray-400">Revoked</span>
								</div>
							</div>
						{/each}
					</div>
				</details>
			{/if}

			<!-- Generate New Key Info -->
			<div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
				<h3 class="text-sm font-medium text-gray-700 mb-2">Generate a New API Key</h3>
				<p class="text-sm text-gray-600 mb-3">
					To generate an API key, use the WorldPublisher CLI:
				</p>
				<code class="block bg-gray-800 text-green-400 text-sm px-4 py-3 rounded-lg font-mono">
					npx kosmos-worldpublisher auth generate-key --label "my-key"
				</code>
				<p class="text-xs text-gray-400 mt-2">
					The CLI will authenticate you and store the key securely.
					API key generation from the portal will be available in a future update.
				</p>
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="bg-white rounded-lg border border-red-200 p-6">
			<h2 class="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
			<p class="text-sm text-gray-600 mb-4">
				Permanently delete your account and all associated worlds. This cannot be undone.
			</p>
			<button
				disabled
				class="px-4 py-2 text-sm font-medium text-red-400 border border-red-200 rounded-lg cursor-not-allowed bg-gray-50"
				title="Contact support to delete your account"
			>
				Delete Account
			</button>
			<p class="text-xs text-gray-400 mt-2">Contact support to delete your account.</p>
		</div>
	</div>
</div>
