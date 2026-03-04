import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './types.js';

/**
 * Creates a Supabase client for use in the browser.
 * Uses @supabase/ssr's createBrowserClient which handles cookie-based auth automatically.
 */
export function createSupabaseBrowserClient() {
	return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Check if we are running in the browser environment.
 * Re-exported from @supabase/ssr for convenience.
 */
export { isBrowser };

/**
 * Re-export createServerClient for use in hooks.server.ts.
 * The server client must be created per-request with cookie handlers.
 */
export { createServerClient };
export type { Database };
