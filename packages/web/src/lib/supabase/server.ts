/**
 * Supabase client for server-side usage (API routes, Server Components)
 * 
 * This client uses the secret key and bypasses RLS.
 * Use with caution - only for admin operations or when RLS is not applicable.
 * 
 * For most operations, prefer using the client-side supabase client with
 * proper RLS policies instead.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../db/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseSecretKey) {
  throw new Error('Missing SUPABASE_SECRET_KEY environment variable');
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

