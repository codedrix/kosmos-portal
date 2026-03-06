import { PUBLIC_REGISTRY_URL } from '$env/static/public';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistryWorld {
	worldId: string;
	slug: string;
	name: string;
	author: string;
	description: string;
	status: 'published' | 'unlisted' | 'removed';
	created_at: string;
}

export interface RegistryVersion {
	versionId: string;
	version: string;
	worldId: string;
	bundleUrl: string;
	manifestUrl: string;
}

export interface RegistryError {
	message: string;
	status: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const baseUrl = PUBLIC_REGISTRY_URL || 'http://localhost:3001';

/**
 * Shared fetch wrapper that throws a descriptive error on non-2xx responses.
 */
async function registryFetch(path: string, options: RequestInit = {}): Promise<Response> {
	const url = `${baseUrl}${path}`;
	const res = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	if (!res.ok) {
		let errorMessage = `Registry API error: ${res.status} ${res.statusText}`;
		try {
			const body = await res.json();
			if (body.error) {
				errorMessage = body.error;
			} else if (body.message) {
				errorMessage = body.message;
			}
		} catch {
			// Response body was not JSON — use the default message.
		}
		const err: RegistryError = { message: errorMessage, status: res.status };
		throw err;
	}

	return res;
}

/**
 * Build an Authorization header with a Bearer token.
 */
function authHeader(apiKey: string): Record<string, string> {
	return { Authorization: `Bearer ${apiKey}` };
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/**
 * Create a new world in the registry.
 * POST /api/v1/worlds
 */
export async function createWorld(
	data: { slug: string; name: string; author: string; description: string },
	apiKey: string
): Promise<RegistryWorld> {
	const res = await registryFetch('/api/v1/worlds', {
		method: 'POST',
		headers: authHeader(apiKey),
		body: JSON.stringify(data)
	});
	return res.json();
}

/**
 * Create a new version for an existing world.
 * POST /api/v1/worlds/{worldId}/versions
 */
export async function createVersion(
	worldId: string,
	data: {
		version: string;
		bundle_url: string;
		manifest_url: string;
		thumbnail_url?: string;
		capabilities: string[];
		bundle_size_bytes: number;
		triangle_count: number;
		status: string;
	},
	apiKey: string
): Promise<RegistryVersion> {
	const res = await registryFetch(`/api/v1/worlds/${worldId}/versions`, {
		method: 'POST',
		headers: authHeader(apiKey),
		body: JSON.stringify(data)
	});
	return res.json();
}

/**
 * List worlds with optional filtering and pagination.
 * GET /api/v1/worlds
 */
export async function getWorlds(params?: {
	status?: string;
	limit?: number;
	offset?: number;
}): Promise<{ worlds: RegistryWorld[]; total: number }> {
	const query = new URLSearchParams();
	if (params?.status) query.set('status', params.status);
	if (params?.limit !== undefined) query.set('limit', String(params.limit));
	if (params?.offset !== undefined) query.set('offset', String(params.offset));

	const qs = query.toString();
	const path = `/api/v1/worlds${qs ? `?${qs}` : ''}`;
	const res = await registryFetch(path);
	return res.json();
}

/**
 * Get a specific world by slug, including its versions.
 * GET /api/v1/worlds/{slug}
 */
export async function getWorldBySlug(
	slug: string
): Promise<RegistryWorld & { versions: RegistryVersion[] }> {
	const res = await registryFetch(`/api/v1/worlds/${encodeURIComponent(slug)}`);
	return res.json();
}

/**
 * Resolve a world slug to its latest version bundle URL.
 * GET /api/v1/resolve/{slug}
 */
export async function resolveWorld(
	slug: string
): Promise<{ found: boolean; world?: RegistryWorld & { bundle_url?: string } }> {
	const res = await registryFetch(`/api/v1/resolve/${encodeURIComponent(slug)}`);
	return res.json();
}

/**
 * Update an existing world's metadata.
 * PUT /api/v1/worlds/{worldId}
 */
export async function updateWorld(
	worldId: string,
	data: Partial<{ name: string; description: string }>,
	apiKey: string
): Promise<RegistryWorld> {
	const res = await registryFetch(`/api/v1/worlds/${worldId}`, {
		method: 'PUT',
		headers: authHeader(apiKey),
		body: JSON.stringify(data)
	});
	return res.json();
}

/**
 * Delete a world from the registry.
 * DELETE /api/v1/worlds/{worldId}
 */
export async function deleteWorld(worldId: string, apiKey: string): Promise<void> {
	await registryFetch(`/api/v1/worlds/${worldId}`, {
		method: 'DELETE',
		headers: authHeader(apiKey)
	});
}
