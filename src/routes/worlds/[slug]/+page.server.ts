import { PUBLIC_REGISTRY_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// ---------------------------------------------------------------------------
// Types — the full response shape from the resolve endpoint
// ---------------------------------------------------------------------------

export interface ResolvedWorld {
	slug: string;
	name: string;
	author: string;
	description: string;
	version: string;
	bundle_url: string;
	manifest_url: string;
	thumbnail_url?: string;
	capabilities: string[];
	bundle_size_bytes: number;
	triangle_count: number;
	status: 'published' | 'unlisted' | 'removed';
	published_at: string;
}

interface ResolveResponse {
	found: boolean;
	world?: ResolvedWorld;
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

export const load: PageServerLoad = async ({ params, fetch }) => {
	const baseUrl = PUBLIC_REGISTRY_URL || 'http://localhost:3001';
	const slug = params.slug;

	try {
		const res = await fetch(`${baseUrl}/api/v1/resolve/${encodeURIComponent(slug)}`);

		if (!res.ok) {
			if (res.status === 404) {
				error(404, {
					message: `World "${slug}" was not found in the registry.`
				});
			}
			error(res.status, {
				message: `Registry API error: ${res.status} ${res.statusText}`
			});
		}

		const data: ResolveResponse = await res.json();

		if (!data.found || !data.world) {
			error(404, {
				message: `World "${slug}" was not found in the registry.`
			});
		}

		return {
			world: data.world,
			error: null
		};
	} catch (err: unknown) {
		// Re-throw SvelteKit HttpError instances (from the error() calls above)
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		const message = err instanceof Error ? err.message : 'Failed to connect to the World Registry';
		return {
			world: null,
			error: message
		};
	}
};
