import type { Session, User } from '@supabase/supabase-js';

/**
 * Database type definitions for Supabase.
 * Placeholder until generated from Supabase CLI (`supabase gen types typescript`).
 */
export type Database = {
	public: {
		Tables: {
			creator_profiles: {
				Row: CreatorProfile;
				Insert: Omit<CreatorProfile, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<CreatorProfile, 'id' | 'created_at' | 'updated_at'>>;
			};
			api_keys: {
				Row: ApiKey;
				Insert: Omit<ApiKey, 'id' | 'created_at'>;
				Update: Partial<Omit<ApiKey, 'id' | 'created_at'>>;
			};
			worlds: {
				Row: WorldRecord;
				Insert: Omit<WorldRecord, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<WorldRecord, 'id' | 'created_at' | 'updated_at'>>;
			};
			world_versions: {
				Row: WorldVersion;
				Insert: Omit<WorldVersion, 'id' | 'created_at'>;
				Update: Partial<Omit<WorldVersion, 'id' | 'created_at'>>;
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
};

/** An API key for CLI/programmatic access to the World Registry */
export interface ApiKey {
	id: string;
	creator_id: string;
	key_hash: string;
	key_prefix: string;
	label: string;
	last_used_at: string | null;
	revoked: boolean;
	created_at: string;
}

/** A creator profile linked to a Supabase auth user */
export interface CreatorProfile {
	id: string;
	username: string;
	email: string | null;
	display_name: string | null;
	status: 'active' | 'suspended' | 'pending';
	created_at: string;
	updated_at: string;
}

/** A world entry in the registry */
export interface WorldRecord {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	creator_id: string;
	status: 'published' | 'unlisted' | 'removed';
	bundle_url: string;
	manifest_url: string;
	thumbnail_url: string | null;
	created_at: string;
	updated_at: string;
}

/** A specific version of a world */
export interface WorldVersion {
	id: string;
	world_id: string;
	version: number;
	bundle_url: string;
	manifest_url: string;
	bundle_size_bytes: number;
	wasm_size_bytes: number;
	triangle_count: number;
	created_at: string;
}

/** Shared page data shape available in all layouts */
export interface PageData {
	session: Session | null;
	user: User | null;
}

/** Form action result for login/register pages */
export interface AuthActionData {
	error?: string;
	email?: string;
	username?: string;
	success?: string;
}
