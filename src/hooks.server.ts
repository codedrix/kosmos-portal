import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

/**
 * SvelteKit server hook that:
 * 1. Creates a per-request Supabase server client with cookie-based session management
 * 2. Attaches session and user to event.locals for use in load functions and actions
 * 3. Protects /dashboard/* and /upload/* routes by redirecting unauthenticated users to /login
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Create a Supabase server client for this request.
	// The cookie handlers bridge SvelteKit's cookie API with Supabase's session persistence.
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (
				cookiesToSet: Array<{ name: string; value: string; options: CookieSerializeOptions }>
			) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	// Use getUser() for server-side auth verification.
	// Unlike getSession(), getUser() re-validates the JWT against the Supabase auth server,
	// making it the more secure choice for route protection decisions.
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

	// Also retrieve session for client-side use (tokens, expiry).
	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	event.locals.session = session;
	event.locals.user = user;

	// Protect authenticated routes.
	// Users without a verified user identity are redirected to the login page.
	const protectedRoutes = ['/dashboard', '/upload'];
	const isProtected = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isProtected && !user) {
		throw redirect(303, '/login');
	}

	return resolve(event, {
		/**
		 * Filter serialized response headers to allow Supabase-specific headers through.
		 * This is required for proper Supabase client-server communication.
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
