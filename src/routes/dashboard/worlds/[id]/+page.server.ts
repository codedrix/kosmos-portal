import type { PageServerLoad, Actions } from './$types';
import type { WorldRecord, WorldVersion } from '$lib/types.js';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { supabase, user } = locals;
	const worldId = params.id;

	if (!user) {
		throw error(401, 'Not authenticated');
	}

	// Fetch the world, ensuring it belongs to this user
	const { data: world, error: worldError } = await supabase
		.from('worlds')
		.select('*')
		.eq('id', worldId)
		.eq('creator_id', user.id)
		.single();

	if (worldError || !world) {
		throw error(404, 'World not found');
	}

	// Fetch all versions for this world
	const { data: versions, error: versionsError } = await supabase
		.from('world_versions')
		.select('*')
		.eq('world_id', worldId)
		.order('version', { ascending: false });

	if (versionsError) {
		console.error('Failed to load world versions:', versionsError.message);
	}

	return {
		world: world as WorldRecord,
		versions: (versions ?? []) as WorldVersion[]
	};
};

export const actions: Actions = {
	/**
	 * Update world name and description.
	 */
	updateWorld: async ({ params, request, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		if (!name || name.trim().length === 0) {
			return fail(400, { error: 'World name is required.' });
		}

		if (name.trim().length > 100) {
			return fail(400, { error: 'World name must be 100 characters or fewer.' });
		}

		const { error: updateError } = await supabase
			.from('worlds')
			.update({
				name: name.trim(),
				description: description?.trim() || null,
				updated_at: new Date().toISOString()
			})
			.eq('id', params.id)
			.eq('creator_id', user.id);

		if (updateError) {
			return fail(500, { error: 'Failed to update world. Please try again.' });
		}

		return { success: 'World updated successfully.' };
	},

	/**
	 * Toggle world visibility between published and unlisted.
	 */
	toggleVisibility: async ({ params, request, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const newStatus = formData.get('status') as string;

		if (newStatus !== 'published' && newStatus !== 'unlisted') {
			return fail(400, { error: 'Invalid status value.' });
		}

		const { error: updateError } = await supabase
			.from('worlds')
			.update({
				status: newStatus,
				updated_at: new Date().toISOString()
			})
			.eq('id', params.id)
			.eq('creator_id', user.id);

		if (updateError) {
			return fail(500, { error: 'Failed to update visibility. Please try again.' });
		}

		return { success: `World is now ${newStatus}.` };
	}
};
