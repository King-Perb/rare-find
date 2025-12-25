-- Enable RLS on Prisma migrations table with service role policy
-- This satisfies Supabase security advisor while allowing Prisma migrations to work
-- Prisma uses service role credentials for migrations, so this policy allows full access

-- First, re-enable RLS (in case it was disabled)
ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to migrations table
-- This is safe because:
-- 1. Only Prisma (via service role) needs to access this table
-- 2. Application users never query this table directly
-- 3. Service role credentials are not exposed to client applications
CREATE POLICY "Service role can manage migrations"
  ON _prisma_migrations
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

