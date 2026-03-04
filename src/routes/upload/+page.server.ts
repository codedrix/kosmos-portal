/**
 * Server-side load function for /upload page.
 *
 * The upload flow uses client-side fetch to API routes (/api/upload, /api/validate)
 * rather than SvelteKit form actions, so this file is minimal. It ensures the user
 * is authenticated (handled by hooks.server.ts) and passes content limits for display.
 */

import type { PageServerLoad } from './$types.js';
import {
	UPLOAD_MAX_MB,
	BUNDLE_SIZE_MB,
	BUNDLE_WARN_MB,
	POLYGON_MAX,
	WASM_SIZE_KB,
	TEXTURE_MAX_RES,
	TEXTURE_MEMORY_MB
} from '$lib/constants.js';

export const load: PageServerLoad = async () => {
	return {
		limits: {
			uploadMaxMB: UPLOAD_MAX_MB,
			bundleSizeMB: BUNDLE_SIZE_MB,
			bundleWarnMB: BUNDLE_WARN_MB,
			polygonMax: POLYGON_MAX,
			wasmSizeKB: WASM_SIZE_KB,
			textureMaxRes: TEXTURE_MAX_RES,
			textureMemoryMB: TEXTURE_MEMORY_MB
		}
	};
};
