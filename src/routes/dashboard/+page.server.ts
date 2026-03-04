import type { PageServerLoad } from './$types';
import type { WorldRecord } from '$lib/types.js';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, user } = locals;

	if (!user) {
		return {
			totalWorlds: 0,
			publishedCount: 0,
			recentWorlds: [] as WorldRecord[]
		};
	}

	// Fetch all worlds for this creator to compute stats
	const { data: worlds, error } = await supabase
		.from('worlds')
		.select('*')
		.eq('creator_id', user.id)
		.order('updated_at', { ascending: false });

	if (error) {
		console.error('Failed to load dashboard worlds:', error.message);
		return {
			totalWorlds: 0,
			publishedCount: 0,
			recentWorlds: [] as WorldRecord[]
		};
	}

	const allWorlds = (worlds ?? []) as WorldRecord[];
	const totalWorlds = allWorlds.length;
	const publishedCount = allWorlds.filter((w) => w.status === 'published').length;
	const recentWorlds = allWorlds.slice(0, 5);

	return {
		totalWorlds,
		publishedCount,
		recentWorlds
	};
};
