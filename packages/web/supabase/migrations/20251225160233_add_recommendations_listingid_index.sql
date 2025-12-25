-- Add index on recommendations.listingId foreign key
-- This improves query performance when joining or filtering by listingId
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys

CREATE INDEX IF NOT EXISTS recommendations_listingId_idx ON recommendations("listingId");

