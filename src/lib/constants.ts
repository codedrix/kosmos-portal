/**
 * Kosmos WorldPublisher Portal — Canonical Constants
 *
 * All values sourced from Content Specification v1.0 and CLAUDE.md Decisions Log.
 * These MUST match the WorldPublisher CLI validators exactly.
 */

// ---------------------------------------------------------------------------
// Content Limits
// ---------------------------------------------------------------------------

/** Max polygons per world (hard reject) */
export const POLYGON_MAX = 500_000;

/** Max texture resolution per texture (px) */
export const TEXTURE_MAX_RES = 2048;

/** Total texture memory budget (MB) */
export const TEXTURE_MEMORY_MB = 48;

/** Max Wasm binary size (KB) */
export const WASM_SIZE_KB = 256;

/** Max Wasm linear memory (MB) */
export const WASM_MEMORY_MB = 8;

/** Total audio size budget (MB) */
export const AUDIO_TOTAL_MB = 50;

/** Max size per audio file (MB) */
export const AUDIO_PER_FILE_MB = 5;

/** Max audio duration per file (seconds) */
export const AUDIO_DURATION_S = 300;

/** Bundle size hard reject (MB) */
export const BUNDLE_SIZE_MB = 100;

/** Bundle size warning threshold (MB) */
export const BUNDLE_WARN_MB = 50;

/** Required thumbnail width (px) */
export const THUMBNAIL_W = 1280;

/** Required thumbnail height (px) */
export const THUMBNAIL_H = 720;

/** Max thumbnail file size (KB) */
export const THUMBNAIL_MAX_KB = 512;

/** Per-mesh triangle limit */
export const PER_MESH_TRIANGLES_MAX = 200_000;

// ---------------------------------------------------------------------------
// Upload Limits (Portal-specific)
// ---------------------------------------------------------------------------

/** Max upload size for beta (MB) */
export const UPLOAD_MAX_MB = 200;

/** Max upload size in bytes */
export const UPLOAD_MAX_BYTES = UPLOAD_MAX_MB * 1024 * 1024;

// ---------------------------------------------------------------------------
// Accepted File Extensions
// ---------------------------------------------------------------------------

export const ACCEPTED_EXTENSIONS = ['.glb', '.wasm', '.kosmos', '.worldbundle'] as const;

export type AcceptedExtension = (typeof ACCEPTED_EXTENSIONS)[number];

/** MIME-type accept string for file inputs */
export const ACCEPTED_MIME_STRING = '.glb,.wasm,.kosmos,.worldbundle';

// ---------------------------------------------------------------------------
// Validation Rule IDs (26 rules from Content Spec v1.0)
// ---------------------------------------------------------------------------

export const RULE_IDS = {
	// Manifest rules (6)
	MANIFEST_001: 'MANIFEST_001', // manifest.json exists
	MANIFEST_002: 'MANIFEST_002', // manifest.json valid JSON schema
	MANIFEST_003: 'MANIFEST_003', // required fields present (name, version, entry_scene, entry_script)
	MANIFEST_004: 'MANIFEST_004', // capabilities array valid (13 canonical values only)
	MANIFEST_005: 'MANIFEST_005', // version format valid (semver)
	MANIFEST_006: 'MANIFEST_006', // referenced files exist in bundle

	// glTF rules (6)
	GLTF_001: 'GLTF_001', // glTF binary valid
	GLTF_002: 'GLTF_002', // polygon count within limit
	GLTF_003: 'GLTF_003', // texture resolution within limit
	GLTF_004: 'GLTF_004', // texture memory within budget
	GLTF_005: 'GLTF_005', // per-mesh triangle count within limit
	GLTF_006: 'GLTF_006', // only allowed glTF extensions used

	// Wasm rules (5)
	WASM_001: 'WASM_001', // .wasm file present
	WASM_002: 'WASM_002', // wasm binary size within limit
	WASM_003: 'WASM_003', // required exports present (k_init, k_tick, k_shutdown)
	WASM_004: 'WASM_004', // initial memory within limit
	WASM_005: 'WASM_005', // no disallowed imports

	// Asset rules (6)
	ASSET_001: 'ASSET_001', // bundle total size within limit
	ASSET_002: 'ASSET_002', // audio total size within budget
	ASSET_003: 'ASSET_003', // audio per-file size within limit
	ASSET_004: 'ASSET_004', // audio duration within limit
	ASSET_005: 'ASSET_005', // audio formats valid (WAV or OGG only)
	ASSET_006: 'ASSET_006', // no executable or disallowed file types

	// Security rules (3)
	SEC_001: 'SEC_001', // no path traversal in file paths
	SEC_002: 'SEC_002', // no hidden files or directories
	SEC_003: 'SEC_003' // no symlinks
} as const;

export type RuleId = (typeof RULE_IDS)[keyof typeof RULE_IDS];

/** All 26 rule IDs as an ordered array */
export const ALL_RULE_IDS: RuleId[] = Object.values(RULE_IDS);

// ---------------------------------------------------------------------------
// Rule Categories
// ---------------------------------------------------------------------------

export const RULE_CATEGORIES = {
	MANIFEST: 'manifest',
	GLTF: 'gltf',
	WASM: 'wasm',
	ASSET: 'asset',
	SECURITY: 'security'
} as const;

export type RuleCategory = (typeof RULE_CATEGORIES)[keyof typeof RULE_CATEGORIES];

/** Map rule ID prefix to category */
export function getRuleCategory(ruleId: string): RuleCategory {
	if (ruleId.startsWith('MANIFEST_')) return RULE_CATEGORIES.MANIFEST;
	if (ruleId.startsWith('GLTF_')) return RULE_CATEGORIES.GLTF;
	if (ruleId.startsWith('WASM_')) return RULE_CATEGORIES.WASM;
	if (ruleId.startsWith('ASSET_')) return RULE_CATEGORIES.ASSET;
	if (ruleId.startsWith('SEC_')) return RULE_CATEGORIES.SECURITY;
	return RULE_CATEGORIES.ASSET; // fallback
}

// ---------------------------------------------------------------------------
// Canonical Capability Names (13 from DOM API Spec)
// ---------------------------------------------------------------------------

export const CAPABILITIES = [
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
] as const;

export type Capability = (typeof CAPABILITIES)[number];

// ---------------------------------------------------------------------------
// Allowed glTF Extensions
// ---------------------------------------------------------------------------

export const ALLOWED_GLTF_EXTENSIONS = [
	'KHR_materials_unlit',
	'KHR_texture_transform',
	'KHR_draco_mesh_compression'
] as const;

// ---------------------------------------------------------------------------
// Required Wasm Exports
// ---------------------------------------------------------------------------

export const REQUIRED_WASM_EXPORTS = ['k_init', 'k_tick', 'k_shutdown'] as const;

// ---------------------------------------------------------------------------
// Audio Formats
// ---------------------------------------------------------------------------

export const ALLOWED_AUDIO_FORMATS = ['wav', 'ogg'] as const;

// ---------------------------------------------------------------------------
// Disallowed File Extensions (security)
// ---------------------------------------------------------------------------

export const DISALLOWED_EXTENSIONS = [
	'.exe',
	'.bat',
	'.cmd',
	'.com',
	'.msi',
	'.scr',
	'.pif',
	'.sh',
	'.bash',
	'.ps1',
	'.vbs',
	'.js',
	'.jar',
	'.py',
	'.rb',
	'.dll',
	'.so',
	'.dylib'
] as const;
