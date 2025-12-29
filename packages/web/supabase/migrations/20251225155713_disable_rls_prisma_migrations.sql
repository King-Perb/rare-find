-- Disable RLS on Prisma migrations table
-- This is a system table that should only be accessed by Prisma (via service role)
-- Application users should never need to access this table, so RLS is unnecessary

ALTER TABLE _prisma_migrations DISABLE ROW LEVEL SECURITY;
