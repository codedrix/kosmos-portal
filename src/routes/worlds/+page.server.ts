import { PUBLIC_REGISTRY_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

// ---------------------------------------------------------------------------
// Types — the full WorldEntry shape returned by the Registry API
// ---------------------------------------------------------------------------

export interface WorldEntry {
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

interface WorldsApiResponse {
	worlds: WorldEntry[];
	total: number;
	hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 24;

export const load: PageServerLoad = async ({ url, fetch }) => {
	const baseUrl = PUBLIC_REGISTRY_URL || 'http://localhost:3001';
	const offset = Number(url.searchParams.get('offset') ?? '0');
	const limit = Number(url.searchParams.get('limit') ?? String(ITEMS_PER_PAGE));

	try {
		const apiUrl = new URL('/api/v1/worlds', baseUrl);
		apiUrl.searchParams.set('status', 'published');
		apiUrl.searchParams.set('limit', String(limit));
		apiUrl.searchParams.set('offset', String(offset));

		const res = await fetch(apiUrl.toString());

		if (!res.ok) {
			return {
				worlds: [] as WorldEntry[],
				total: 0,
				hasMore: false,
				error: `Registry API returned ${res.status}: ${res.statusText}`,
				offset,
				limit
			};
		}

		const data: WorldsApiResponse = await res.json();

		return {
			worlds: data.worlds ?? [],
			total: data.total ?? 0,
			hasMore: data.hasMore ?? false,
			error: null,
			offset,
			limit
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Failed to connect to the World Registry';
		return {
			worlds: [] as WorldEntry[],
			total: 0,
			hasMore: false,
			error: message,
			offset,
			limit
		};
	}
};
