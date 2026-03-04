import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

/**
 * Simple in-memory rate limiter for login attempts.
 * Limits each IP to a max number of attempts within a sliding window.
 * In production, replace with a Redis-backed or database-backed solution.
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // max attempts per window
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15-minute window

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const record = loginAttempts.get(ip);

	if (!record || now > record.resetAt) {
		loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}

	if (record.count >= RATE_LIMIT_MAX) {
		return false;
	}

	record.count++;
	return true;
}

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
	 * Handle email/password login.
	 * Validates input, applies rate limiting, calls Supabase signInWithPassword,
	 * and redirects to dashboard on success.
	 */
	login: async ({ request, locals: { supabase }, getClientAddress }) => {
		const clientIp = getClientAddress();

		// Rate limit login attempts per IP address
		if (!checkRateLimit(clientIp)) {
			return fail(429, {
				error: 'Too many login attempts. Please try again in 15 minutes.',
				email: ''
			});
		}

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required.',
				email: email ?? ''
			});
		}

		// Basic email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address.',
				email
			});
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, {
				error: error.message,
				email
			});
		}

		throw redirect(303, '/dashboard');
	},

	/**
	 * Handle OAuth login (GitHub, Google).
	 * Initiates the OAuth flow by redirecting the user to the provider's authorization page.
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
