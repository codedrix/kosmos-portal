import type { PageServerLoad } from './$types';
import type { WorldRecord } from '$lib/types.js';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, user } = locals;

	if (!user) {
		return {
			worlds: [] as WorldRecord[]
		};
	}

	const { data: worlds, error } = await supabase
		.from('worlds')
		.select('*')
		.eq('creator_id', user.id)
		.order('updated_at', { ascending: false });

	if (error) {
		console.error('Failed to load worlds:', error.message);
		return {
			worlds: [] as WorldRecord[]
		};
	}

	return {
		worlds: (worlds ?? []) as WorldRecord[]
	};
};
