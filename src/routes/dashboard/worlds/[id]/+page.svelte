<script lang="ts">
	// TODO: Add +page.server.ts load function to fetch world data by id for editing
</script>

<svelte:head>
	<title>Edit World — Kosmos WorldPublisher</title>
</svelte:head>

<div>
	<div class="mb-6">
		<a href="/dashboard/worlds" class="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to My Worlds</a>
	</div>

	<div class="flex items-start justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold mb-2">Edit World</h1>
			<p class="text-gray-600">Update your world details, upload new versions, or manage settings.</p>
		</div>
		<div class="flex gap-2">
			<button class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
				Preview
			</button>
			<button class="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
				Unpublish
			</button>
		</div>
	</div>

	<!-- Edit Form -->
	<div class="space-y-6">
		<!-- Basic Info -->
		<div class="bg-white rounded-lg border border-gray-200 p-6">
			<h2 class="text-lg font-semibold mb-4">Basic Information</h2>
			<!-- TODO: Implement edit form with real data -->
			<div class="space-y-4">
				<div>
					<label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">World Name</label>
					<input
						id="edit-name"
						type="text"
						placeholder="World name"
						class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label for="edit-desc" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						id="edit-desc"
						rows={3}
						placeholder="Description"
						class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Version Management -->
		<div class="bg-white rounded-lg border border-gray-200 p-6">
			<h2 class="text-lg font-semibold mb-4">Versions</h2>
			<div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 text-sm">
				Version management coming soon. Upload a new bundle to create a new version.
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="bg-white rounded-lg border border-red-200 p-6">
			<h2 class="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
			<p class="text-sm text-gray-600 mb-4">
				These actions are irreversible. Proceed with caution.
			</p>
			<button class="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
				Delete World
			</button>
		</div>
	</div>
</div>
