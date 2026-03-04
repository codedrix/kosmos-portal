<script lang="ts">
	// Account settings — requires auth
</script>

<svelte:head>
	<title>Settings — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<h1 class="text-3xl font-bold mb-4">Settings</h1>
	<p class="text-gray-600 mb-8">Manage your account and API keys.</p>

	<div class="space-y-6">
		<!-- Profile -->
		<div class="bg-white rounded-lg border border-gray-200 p-6">
			<h2 class="text-lg font-semibold mb-4">Profile</h2>
			<div class="space-y-4">
				<div>
					<label for="display-name" class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
					<input
						id="display-name"
						type="text"
						placeholder="Your display name"
						class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						id="email"
						type="email"
						placeholder="you@example.com"
						disabled
						class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
					/>
					<p class="text-xs text-gray-400 mt-1">Email is managed by your auth provider.</p>
				</div>
			</div>
			<button class="mt-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
				Save Changes
			</button>
		</div>

		<!-- API Keys -->
		<div class="bg-white rounded-lg border border-gray-200 p-6">
			<h2 class="text-lg font-semibold mb-4">API Keys</h2>
			<p class="text-sm text-gray-600 mb-4">
				API keys are used by the WorldPublisher CLI to upload worlds on your behalf.
			</p>
			<!-- TODO: Implement API key management -->
			<div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 text-sm">
				API key management coming soon
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="bg-white rounded-lg border border-red-200 p-6">
			<h2 class="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
			<p class="text-sm text-gray-600 mb-4">
				Permanently delete your account and all associated worlds. This cannot be undone.
			</p>
			<button class="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
				Delete Account
			</button>
		</div>
	</div>
</div>
