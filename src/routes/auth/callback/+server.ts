import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * OAuth callback handler.
 * After a user authenticates with an OAuth provider (GitHub, Google),
 * the provider redirects back here with an authorization code.
 * We exchange that code for a session and redirect to the dashboard.
 */
export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const nextParam = url.searchParams.get('next') ?? '/dashboard';

	// Validate the redirect target to prevent open redirect attacks.
	// Only allow relative paths that start with '/' and don't contain '//' or a protocol scheme.
	const isSafeRedirect =
		nextParam.startsWith('/') && !nextParam.startsWith('//') && !nextParam.includes('://');
	const next = isSafeRedirect ? nextParam : '/dashboard';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			// If code exchange fails, redirect to login with an error indicator
			throw redirect(303, '/login?error=auth_callback_failed');
		}
	}

	throw redirect(303, next);
};
