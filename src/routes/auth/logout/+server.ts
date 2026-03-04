import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Logout endpoint.
 * Signs the user out of Supabase (clears session cookies) and redirects to the home page.
 * Uses POST method to prevent CSRF via GET requests.
 */
export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	await supabase.auth.signOut();
	throw redirect(303, '/');
};
