<script lang="ts">
	import { goto } from '$app/navigation';

	let dragOver = $state(false);
	let fileUploaded = $state(false);
</script>

<svelte:head>
	<title>Upload World — Kosmos WorldPublisher</title>
</svelte:head>

<main class="container mx-auto px-4 py-8 max-w-2xl">
	<h1 class="text-3xl font-bold mb-4">Upload World</h1>
	<p class="text-gray-600 mb-8">
		Upload your world bundle to validate, optimize, and publish to the Kosmos registry.
	</p>

	<!-- Drag and Drop Zone -->
	<div
		class="relative border-2 border-dashed rounded-xl p-16 text-center transition-colors {dragOver
			? 'border-indigo-500 bg-indigo-50'
			: 'border-gray-300 bg-white hover:border-gray-400'}"
		role="button"
		tabindex="0"
		ondragover={(e) => {
			e.preventDefault();
			dragOver = true;
		}}
		ondragleave={() => {
			dragOver = false;
		}}
		ondrop={(e) => {
			e.preventDefault();
			dragOver = false;
			// TODO: Handle file drop
		}}
	>
		<div class="flex flex-col items-center gap-4">
			<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
				</svg>
			</div>
			<div>
				<p class="text-lg font-medium text-gray-700">
					Drag and drop your world bundle here
				</p>
				<p class="text-sm text-gray-400 mt-1">or click to browse files</p>
			</div>
		</div>
	</div>

	<!-- Accepted Formats -->
	<div class="mt-6 bg-gray-50 rounded-lg p-4">
		<h3 class="text-sm font-semibold text-gray-700 mb-2">Accepted formats</h3>
		<ul class="text-sm text-gray-500 space-y-1">
			<li><code class="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.glb</code> &mdash; glTF Binary (3D scene)</li>
			<li><code class="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.wasm</code> &mdash; WebAssembly module (world script)</li>
			<li><code class="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.kosmos</code> &mdash; Kosmos world bundle (pre-packaged)</li>
		</ul>
	</div>

	<!-- Content Limits Summary -->
	<div class="mt-4 bg-gray-50 rounded-lg p-4">
		<h3 class="text-sm font-semibold text-gray-700 mb-2">Content limits</h3>
		<ul class="text-sm text-gray-500 space-y-1">
			<li>Max bundle size: <strong>100 MB</strong> (warning at 50 MB)</li>
			<li>Max polygons: <strong>500,000</strong></li>
			<li>Max Wasm binary: <strong>256 KB</strong></li>
			<li>Textures: <strong>2048x2048</strong> per texture, 48 MB total</li>
		</ul>
	</div>

	<!-- Next Step -->
	<div class="mt-8 text-center">
		<button
			type="button"
			disabled={!fileUploaded}
			onclick={() => goto('/upload/details')}
			class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
		>
			Next: Add Details &rarr;
		</button>
		<p class="text-xs text-gray-400 mt-2">Upload a file to continue</p>
	</div>
</main>
