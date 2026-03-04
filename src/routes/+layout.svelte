<script lang="ts">
	let { data, children } = $props();

	const navLinks = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/upload', label: 'Upload' },
		{ href: '/docs', label: 'Docs' }
	];
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
	<!-- Navbar -->
	<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
		<nav class="container mx-auto px-4 h-16 flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-xl font-bold text-indigo-600 tracking-tight">Kosmos</a>

			<!-- Nav Links -->
			<div class="hidden md:flex items-center gap-6">
				{#each navLinks as link}
					<a href={link.href} class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
						{link.label}
					</a>
				{/each}
			</div>

			<!-- Auth Section -->
			<div class="flex items-center gap-3">
				{#if data.session}
					<span class="text-sm text-gray-600">{data.user?.email ?? 'Creator'}</span>
					<a
						href="/dashboard"
						class="text-sm font-medium text-indigo-600 hover:text-indigo-700"
					>
						My Dashboard
					</a>
				{:else}
					<a
						href="/login"
						class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
					>
						Login
					</a>
					<a
						href="/register"
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Register
					</a>
				{/if}
			</div>
		</nav>
	</header>

	<!-- Main Content -->
	<div class="flex-1">
		{@render children()}
	</div>

	<!-- Footer -->
	<footer class="bg-white border-t border-gray-200 py-8">
		<div class="container mx-auto px-4 text-center text-sm text-gray-500">
			<p>&copy; {new Date().getFullYear()} Kosmos. All rights reserved.</p>
			<p class="mt-1">Build worlds for VR &mdash; <span class="font-mono text-xs">publish.kosmos.world</span></p>
		</div>
	</footer>
</div>
