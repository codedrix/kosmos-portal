import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

/**
 * If the user is already authenticated, redirect them to the dashboard.
 */
export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		throw redirect(303, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	/**
	 * Handle new user registration.
	 * Validates all inputs, creates Supabase auth user with username in metadata,
	 * and redirects to login on success.
	 */
	register: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const username = formData.get('username') as string;

		// Validate required fields
		if (!email || !password || !confirmPassword || !username) {
			return fail(400, {
				error: 'All fields are required.',
				email: email ?? '',
				username: username ?? ''
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address.',
				email,
				username
			});
		}

		// Validate username format (lowercase alphanumeric + hyphens, 3-32 chars)
		const usernameRegex = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;
		if (!usernameRegex.test(username)) {
			return fail(400, {
				error:
					'Username must be 3-32 characters, lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen.',
				email,
				username
			});
		}

		// Validate password length
		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters.',
				email,
				username
			});
		}

		// Validate passwords match
		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match.',
				email,
				username
			});
		}

		// Create the user in Supabase Auth.
		// The username is stored in user_metadata and can be used to create
		// the creator_profiles row via a database trigger or on first login.
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					username,
					display_name: username
				}
			}
		});

		if (error) {
			return fail(400, {
				error: error.message,
				email,
				username
			});
		}

		// Redirect to login with a success message via URL params.
		// The user must verify their email before signing in (if email confirmation is enabled).
		throw redirect(303, '/login?registered=true');
	},

	/**
	 * Handle OAuth sign-up (GitHub, Google).
	 * Initiates the OAuth flow by redirecting the user to the provider's authorization page.
	 * Duplicated from login actions so register page doesn't depend on cross-route form actions.
	 */
	oauth: async ({ url, locals: { supabase }, request }) => {
		const formData = await request.formData();
		const provider = formData.get('provider') as string;

		if (provider !== 'github' && provider !== 'google') {
			return fail(400, { error: 'Invalid OAuth provider.' });
		}

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		if (data.url) {
			throw redirect(303, data.url);
		}
	}
};
