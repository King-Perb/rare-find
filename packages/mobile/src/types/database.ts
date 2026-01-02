import type { Database as DatabaseType } from '@rare-find/shared';

export type Database = DatabaseType;
export type Listing = Database['public']['Tables']['listings']['Row'];
export type Recommendation = Database['public']['Tables']['recommendations']['Row'];
export type UserPreference = Database['public']['Tables']['user_preferences']['Row'];
