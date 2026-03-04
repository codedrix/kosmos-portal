/**
 * GET /api/validate?id={uploadId}
 *
 * Returns an SSE (Server-Sent Events) stream of validation results.
 * Each check is streamed as it completes.
 *
 * Query params:
 *   id    — required, the upload ID from POST /api/upload
 *   poll  — optional, if "true" returns a JSON response instead of SSE stream
 */

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getUploadPath } from '$lib/upload-registry.server.js';
import { validateBundle, validateBundleFull, type ValidationCheck } from '$lib/validation.js';

export const GET: RequestHandler = async ({ url }) => {
	const uploadId = url.searchParams.get('id');
	if (!uploadId) {
		throw error(400, 'Missing required query parameter: id');
	}

	const upload = getUploadPath(uploadId);
	if (!upload) {
		throw error(404, 'Upload not found. It may have expired (uploads are retained for 1 hour).');
	}

	// Polling fallback: return full validation result as JSON
	const poll = url.searchParams.get('poll');
	if (poll === 'true') {
		const result = await validateBundleFull(upload.filePath);
		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// SSE streaming mode
	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();

			function sendEvent(data: Record<string, unknown>) {
				const payload = `data: ${JSON.stringify(data)}\n\n`;
				controller.enqueue(encoder.encode(payload));
			}

			try {
				let errors = 0;
				let warnings = 0;
				const allChecks: ValidationCheck[] = [];

				for await (const check of validateBundle(upload.filePath)) {
					allChecks.push(check);
					if (check.status === 'fail') errors++;
					if (check.status === 'warn') warnings++;

					sendEvent({
						type: 'check',
						ruleId: check.ruleId,
						category: check.category,
						name: check.name,
						status: check.status,
						message: check.message,
						value: check.value,
						limit: check.limit
					});
				}

				// Send completion summary
				sendEvent({
					type: 'complete',
					passed: errors === 0,
					errors,
					warnings,
					totalChecks: allChecks.length
				});
			} catch (err) {
				sendEvent({
					type: 'error',
					message: err instanceof Error ? err.message : 'Validation failed unexpectedly'
				});
			} finally {
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'X-Accel-Buffering': 'no' // Disable nginx buffering if proxied
		}
	});
};
