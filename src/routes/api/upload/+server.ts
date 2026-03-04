/**
 * POST /api/upload
 *
 * Accepts a multipart file upload, validates file size client-side gate,
 * stores the file temporarily, and returns an upload ID for SSE validation.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { UPLOAD_MAX_BYTES, ACCEPTED_EXTENSIONS, type AcceptedExtension } from '$lib/constants.js';
import { registerUpload, cleanupStaleUploads } from '$lib/upload-registry.server.js';

export const POST: RequestHandler = async ({ request }) => {
	cleanupStaleUploads();

	const contentType = request.headers.get('content-type') ?? '';
	if (!contentType.includes('multipart/form-data')) {
		throw error(400, 'Expected multipart/form-data');
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		throw error(400, 'Invalid form data');
	}

	const file = formData.get('file');
	if (!file || !(file instanceof File)) {
		throw error(400, 'No file provided. Use field name "file".');
	}

	// Validate file extension
	const filename = file.name;
	const ext = ('.' + filename.split('.').pop()?.toLowerCase()) as string;
	if (!ACCEPTED_EXTENSIONS.includes(ext as AcceptedExtension)) {
		throw error(400, `Invalid file extension "${ext}". Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`);
	}

	// Validate file size (server-side gate)
	const sizeBytes = file.size;
	if (sizeBytes > UPLOAD_MAX_BYTES) {
		const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
		throw error(413, `File too large (${sizeMB} MB). Maximum upload size is ${UPLOAD_MAX_BYTES / (1024 * 1024)} MB.`);
	}

	if (sizeBytes === 0) {
		throw error(400, 'File is empty (0 bytes)');
	}

	// Generate upload ID and store file
	const uploadId = randomUUID();
	const uploadDir = join(tmpdir(), 'kosmos-portal-uploads');
	await mkdir(uploadDir, { recursive: true });

	const safeName = `${uploadId}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
	const filePath = join(uploadDir, safeName);

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(filePath, buffer);

	// Register the upload
	registerUpload(uploadId, {
		filePath,
		filename,
		sizeBytes,
		createdAt: Date.now()
	});

	return json({
		uploadId,
		filename,
		sizeBytes
	});
};
