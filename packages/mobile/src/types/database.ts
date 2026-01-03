/**
 * Database Type Aliases for Mobile Package
 *
 * Re-exports Database type from shared package and provides convenient aliases
 * for commonly used table row types.
 *
 * The Database type itself is generated in @rare-find/shared and should be
 * regenerated when the Supabase schema changes:
 *   cd packages/shared && npm run db:generate-types
 */

import type { Database } from '@rare-find/shared';

// Re-export Database type
export type { Database };

// Convenient type aliases for table rows
export type Listing = Database['public']['Tables']['listings']['Row'];
export type Recommendation = Database['public']['Tables']['recommendations']['Row'];
export type SearchPreference = Database['public']['Tables']['search_preferences']['Row'];

// Re-export utility types from @rare-find/shared (generated in database.ts)
export type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  CompositeTypes,
} from '@rare-find/shared';
export { Constants } from '@rare-find/shared';
