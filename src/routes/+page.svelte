<script lang="ts">
	// Landing page — no data loading needed
</script>

<svelte:head>
	<title>Kosmos WorldPublisher — Build Worlds for VR</title>
</svelte:head>

<main>
	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
		<div class="container mx-auto px-4 py-24 text-center">
			<h1 class="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Build worlds for VR</h1>
			<p class="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto">
				Create, publish, and share immersive 3D worlds on Kosmos — the VR browser for Meta Quest 3.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/register"
					class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
				>
					Get Started
				</a>
				<a
					href="/docs"
					class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
				>
					Read the Docs
				</a>
			</div>
		</div>
	</section>

	<!-- Feature Cards -->
	<section class="container mx-auto px-4 py-20">
		<div class="grid md:grid-cols-3 gap-8">
			<!-- Create -->
			<div class="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
				<div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
					<span class="text-2xl">🛠</span>
				</div>
				<h3 class="text-xl font-semibold mb-2">Create</h3>
				<p class="text-gray-600">
					Build 3D worlds using glTF models and WebAssembly scripts. Use the Creator SDK to add
					interactivity with Rust or C.
				</p>
			</div>

			<!-- Publish -->
			<div class="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
					<span class="text-2xl">🚀</span>
				</div>
				<h3 class="text-xl font-semibold mb-2">Publish</h3>
				<p class="text-gray-600">
					Validate, optimize, and upload your world bundle through the CLI or this portal. Get a <code
						class="text-sm bg-gray-100 px-1 rounded">world://</code
					> URL instantly.
				</p>
			</div>

			<!-- Share -->
			<div class="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
				<div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
					<span class="text-2xl">🌐</span>
				</div>
				<h3 class="text-xl font-semibold mb-2">Share</h3>
				<p class="text-gray-600">
					Share your world URL with anyone on Quest 3. Visitors enter your world in seconds — like
					visiting a website, but in VR.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gray-100 py-16">
		<div class="container mx-auto px-4 text-center">
			<h2 class="text-3xl font-bold mb-4">Ready to build?</h2>
			<p class="text-gray-600 mb-8 max-w-lg mx-auto">
				The WorldPublisher Portal gives you everything you need to manage your Kosmos worlds.
			</p>
			<a
				href="/register"
				class="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
			>
				Create Your Account
			</a>
		</div>
	</section>
</main>
