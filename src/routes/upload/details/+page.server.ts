import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/** Slug pattern: 3-64 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphen */
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;

/** Predefined tag categories that creators can choose from (max 5) */
const VALID_TAGS = [
	'adventure',
	'arcade',
	'art',
	'education',
	'exploration',
	'game',
	'horror',
	'meditation',
	'multiplayer',
	'music',
	'narrative',
	'nature',
	'puzzle',
	'relaxation',
	'sandbox',
	'sci-fi',
	'simulation',
	'social',
	'sports',
	'strategy'
];

/** The 13 canonical capabilities from Content Spec v1.0 */
const VALID_CAPABILITIES = [
	'scene_read',
	'scene_write',
	'transform',
	'events',
	'audio',
	'animation',
	'ui_basic',
	'state',
	'timer',
	'player_read',
	'player_write',
	'physics_query',
	'physics_config'
];

export const load: PageServerLoad = async ({ cookies }) => {
	// Restore previously saved details from cookie (if user navigates back)
	const saved = cookies.get('world_details');
	let details = null;
	if (saved) {
		try {
			details = JSON.parse(saved);
		} catch {
			// Ignore invalid cookie data
		}
	}

	return {
		validTags: VALID_TAGS,
		savedDetails: details
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const worldName = (formData.get('worldName') as string)?.trim() ?? '';
		const description = (formData.get('description') as string)?.trim() ?? '';
		const versionNotes = (formData.get('versionNotes') as string)?.trim() ?? '';
		const tagsRaw = formData.getAll('tags') as string[];
		const capabilitiesRaw = formData.getAll('capabilities') as string[];

		// --- Validation ---

		if (!worldName) {
			return fail(400, {
				error: 'World name is required.',
				worldName,
				description,
				versionNotes,
				tags: tagsRaw,
				capabilities: capabilitiesRaw
			});
		}

		if (!SLUG_PATTERN.test(worldName)) {
			return fail(400, {
				error:
					'World name must be 3-64 characters, lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen.',
				worldName,
				description,
				versionNotes,
				tags: tagsRaw,
				capabilities: capabilitiesRaw
			});
		}

		if (!description) {
			return fail(400, {
				error: 'Description is required.',
				worldName,
				description,
				versionNotes,
				tags: tagsRaw,
				capabilities: capabilitiesRaw
			});
		}

		if (description.length > 500) {
			return fail(400, {
				error: 'Description must be 500 characters or fewer.',
				worldName,
				description,
				versionNotes,
				tags: tagsRaw,
				capabilities: capabilitiesRaw
			});
		}

		// Filter tags to valid values only, max 5
		const tags = tagsRaw.filter((t) => VALID_TAGS.includes(t)).slice(0, 5);

		// Filter capabilities to valid values only
		const capabilities = capabilitiesRaw.filter((c) => VALID_CAPABILITIES.includes(c));

		// Build details object
		const details = {
			worldName,
			description,
			versionNotes,
			tags,
			capabilities
		};

		// Store in a cookie so the review page can read it server-side.
		// Max cookie size is ~4 KB; this payload is well within that.
		cookies.set('world_details', JSON.stringify(details), {
			path: '/upload',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 // 1 hour
		});

		throw redirect(303, '/upload/review');
	}
};
