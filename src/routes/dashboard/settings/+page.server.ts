import type { PageServerLoad, Actions } from './$types';
import type { CreatorProfile, ApiKey } from '$lib/types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, user } = locals;

	if (!user) {
		return {
			profile: null as CreatorProfile | null,
			apiKeys: [] as ApiKey[],
			email: ''
		};
	}

	// Fetch the creator profile
	const { data: profile, error: profileError } = await supabase
		.from('creator_profiles')
		.select('*')
		.eq('id', user.id)
		.single();

	if (profileError) {
		console.error('Failed to load profile:', profileError.message);
	}

	// Fetch API keys (exclude the hash for security — only show prefix + metadata)
	const { data: apiKeys, error: keysError } = await supabase
		.from('api_keys')
		.select('id, creator_id, key_prefix, label, last_used_at, revoked, created_at')
		.eq('creator_id', user.id)
		.order('created_at', { ascending: false });

	if (keysError) {
		console.error('Failed to load API keys:', keysError.message);
	}

	return {
		profile: (profile as CreatorProfile) ?? null,
		apiKeys: (apiKeys ?? []) as Pick<
			ApiKey,
			'id' | 'creator_id' | 'key_prefix' | 'label' | 'last_used_at' | 'revoked' | 'created_at'
		>[],
		email: user.email ?? ''
	};
};

export const actions: Actions = {
	/**
	 * Update the creator's display name.
	 */
	updateProfile: async ({ request, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const displayName = formData.get('display_name') as string;
		const username = formData.get('username') as string;

		if (!displayName || displayName.trim().length === 0) {
			return fail(400, { error: 'Display name is required.' });
		}

		if (displayName.trim().length > 50) {
			return fail(400, { error: 'Display name must be 50 characters or fewer.' });
		}

		// Build update payload — only include username if provided
		const updatePayload: Record<string, string> = {
			display_name: displayName.trim(),
			updated_at: new Date().toISOString()
		};

		if (username && username.trim().length > 0) {
			// Validate username format
			const usernameRegex = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;
			if (!usernameRegex.test(username.trim())) {
				return fail(400, {
					error: 'Username must be 3-32 characters, lowercase letters, numbers, and hyphens only.'
				});
			}
			updatePayload.username = username.trim();
		}

		const { error: updateError } = await supabase
			.from('creator_profiles')
			.update(updatePayload)
			.eq('id', user.id);

		if (updateError) {
			// Check for unique constraint violation on username
			if (updateError.message.includes('unique') || updateError.message.includes('duplicate')) {
				return fail(400, { error: 'This username is already taken.' });
			}
			return fail(500, { error: 'Failed to update profile. Please try again.' });
		}

		return { success: 'Profile updated successfully.' };
	},

	/**
	 * Revoke an API key.
	 */
	revokeKey: async ({ request, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const keyId = formData.get('key_id') as string;

		if (!keyId) {
			return fail(400, { error: 'Key ID is required.' });
		}

		const { error: updateError } = await supabase
			.from('api_keys')
			.update({ revoked: true })
			.eq('id', keyId)
			.eq('creator_id', user.id);

		if (updateError) {
			return fail(500, { error: 'Failed to revoke key. Please try again.' });
		}

		return { success: 'API key revoked.' };
	}
};
