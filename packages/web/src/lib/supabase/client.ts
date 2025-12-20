/**
 * Supabase client for browser/client-side usage
 * 
 * This client respects Row Level Security (RLS) policies.
 * Use this for client components, hooks, and browser-side operations.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../db/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable');
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

