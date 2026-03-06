/**
 * Shared upload registry — tracks temporary file uploads by ID.
 *
 * Server-only module (.server.ts) used by:
 *   - POST /api/upload  (registers new uploads)
 *   - GET  /api/validate (looks up upload paths for validation)
 */

/** Entry stored for each uploaded file */
export interface UploadEntry {
	filePath: string;
	filename: string;
	sizeBytes: number;
	createdAt: number;
}

/** In-memory map of upload IDs to file metadata (persists for server lifetime) */
const uploadRegistry = new Map<string, UploadEntry>();

/** Register a new upload */
export function registerUpload(uploadId: string, entry: UploadEntry): void {
	uploadRegistry.set(uploadId, entry);
}

/** Look up an upload by ID */
export function getUploadPath(
	uploadId: string
): { filePath: string; filename: string; sizeBytes: number } | undefined {
	return uploadRegistry.get(uploadId);
}

/** Remove entries older than 1 hour */
export function cleanupStaleUploads(): void {
	const oneHourAgo = Date.now() - 60 * 60 * 1000;
	for (const [id, entry] of uploadRegistry) {
		if (entry.createdAt < oneHourAgo) {
			uploadRegistry.delete(id);
		}
	}
}
