import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createWorld, createVersion } from '$lib/registry.server';
import type { Actions, PageServerLoad } from './$types';

/** Details shape stored in the world_details cookie */
interface WorldDetails {
	worldName: string;
	description: string;
	versionNotes: string;
	tags: string[];
	capabilities: string[];
}

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const raw = cookies.get('world_details');
	if (!raw) {
		// No details saved — redirect back to the details form
		throw redirect(303, '/upload/details');
	}

	let details: WorldDetails;
	try {
		details = JSON.parse(raw);
	} catch {
		throw redirect(303, '/upload/details');
	}

	// Validate minimum required fields are present
	if (!details.worldName || !details.description) {
		throw redirect(303, '/upload/details');
	}

	// Get the author from the logged-in user's profile
	const author = locals.user?.email?.split('@')[0] ?? 'creator';

	return {
		details,
		author,
		worldUrl: `world://${details.worldName}.${author}`
	};
};

export const actions: Actions = {
	publish: async ({ cookies, locals }) => {
		const raw = cookies.get('world_details');
		if (!raw) {
			return fail(400, { error: 'No world details found. Please go back and fill in details.' });
		}

		let details: WorldDetails;
		try {
			details = JSON.parse(raw);
		} catch {
			return fail(400, { error: 'Invalid world details. Please go back and re-enter.' });
		}

		// Retrieve the dev API key from environment
		const apiKey = env.REGISTRY_DEV_API_KEY;
		if (!apiKey) {
			return fail(500, {
				error: 'Registry API key not configured. Set REGISTRY_DEV_API_KEY in your environment.'
			});
		}

		const author = locals.user?.email?.split('@')[0] ?? 'creator';

		try {
			// Step 1: Create the world entry in the registry
			const world = await createWorld(
				{
					slug: details.worldName,
					name: details.worldName,
					author,
					description: details.description
				},
				apiKey
			);

			// Step 2: Create the initial version
			// For MVP: bundle_url and manifest_url are placeholders until R2 upload is wired.
			await createVersion(
				world.worldId,
				{
					version: '1.0.0',
					bundle_url: `https://r2.kosmos.world/${details.worldName}/v1/bundle.kosmos`,
					manifest_url: `https://r2.kosmos.world/${details.worldName}/v1/manifest.json`,
					capabilities: details.capabilities,
					bundle_size_bytes: 0, // Will be filled once upload is wired
					triangle_count: 0, // Will be filled once validation runs
					status: 'published'
				},
				apiKey
			);

			// Clear the details cookie after successful publish
			cookies.delete('world_details', { path: '/upload' });

			const worldUrl = `world://${details.worldName}.${author}`;

			return {
				success: true,
				worldUrl,
				worldName: details.worldName,
				author
			};
		} catch (err: unknown) {
			const message =
				err && typeof err === 'object' && 'message' in err
					? (err as { message: string }).message
					: 'An unexpected error occurred while publishing.';
			return fail(500, { error: message });
		}
	}
};
