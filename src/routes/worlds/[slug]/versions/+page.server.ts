import { PUBLIC_REGISTRY_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VersionEntry {
	versionId: string;
	version: string;
	bundle_url: string;
	manifest_url: string;
	bundle_size_bytes: number;
	triangle_count: number;
	created_at: string;
}

export interface WorldWithVersions {
	worldId: string;
	slug: string;
	name: string;
	author: string;
	description: string;
	versions: VersionEntry[];
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

export const load: PageServerLoad = async ({ params, fetch }) => {
	const baseUrl = PUBLIC_REGISTRY_URL || 'http://localhost:3001';
	const slug = params.slug;

	try {
		const res = await fetch(`${baseUrl}/api/v1/worlds/${encodeURIComponent(slug)}`);

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

		const data: WorldWithVersions = await res.json();

		return {
			world: {
				slug: data.slug,
				name: data.name,
				author: data.author
			},
			versions: data.versions ?? [],
			error: null
		};
	} catch (err: unknown) {
		// Re-throw SvelteKit HttpError instances
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		const message = err instanceof Error ? err.message : 'Failed to connect to the World Registry';
		return {
			world: null,
			versions: [] as VersionEntry[],
			error: message
		};
	}
};
