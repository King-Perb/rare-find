-- Optimize RLS policies for better performance at scale
-- This migration fixes performance issues by wrapping auth functions in subqueries
-- to prevent re-evaluation for each row. See:
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

-- ============================================================================
-- Users table policies
-- ============================================================================

-- Drop and recreate with optimized version
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================================================
-- Search Preferences table policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can manage own preferences" ON search_preferences;
CREATE POLICY "Users can manage own preferences"
  ON search_preferences
  FOR ALL
  USING ((SELECT auth.uid()) = "userId")
  WITH CHECK ((SELECT auth.uid()) = "userId");

-- ============================================================================
-- Listings table policies
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can read listings" ON listings;
CREATE POLICY "Authenticated users can read listings"
  ON listings
  FOR SELECT
  USING ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Service role can insert listings" ON listings;
CREATE POLICY "Service role can insert listings"
  ON listings
  FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Service role can update listings" ON listings;
CREATE POLICY "Service role can update listings"
  ON listings
  FOR UPDATE
  USING ((SELECT auth.role()) = 'service_role');

-- ============================================================================
-- AI Evaluations table policies
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can read evaluations" ON ai_evaluations;
CREATE POLICY "Authenticated users can read evaluations"
  ON ai_evaluations
  FOR SELECT
  USING ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Service role can insert evaluations" ON ai_evaluations;
CREATE POLICY "Service role can insert evaluations"
  ON ai_evaluations
  FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Service role can update evaluations" ON ai_evaluations;
CREATE POLICY "Service role can update evaluations"
  ON ai_evaluations
  FOR UPDATE
  USING ((SELECT auth.role()) = 'service_role');

-- ============================================================================
-- Recommendations table policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own recommendations" ON recommendations;
CREATE POLICY "Users can read own recommendations"
  ON recommendations
  FOR SELECT
  USING ((SELECT auth.uid()) = "userId");

DROP POLICY IF EXISTS "Service role can insert recommendations" ON recommendations;
CREATE POLICY "Service role can insert recommendations"
  ON recommendations
  FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Users can update own recommendations" ON recommendations;
CREATE POLICY "Users can update own recommendations"
  ON recommendations
  FOR UPDATE
  USING ((SELECT auth.uid()) = "userId")
  WITH CHECK ((SELECT auth.uid()) = "userId");

-- ============================================================================
-- Notifications table policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  USING ((SELECT auth.uid()) = "userId");

DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING ((SELECT auth.uid()) = "userId")
  WITH CHECK ((SELECT auth.uid()) = "userId");

