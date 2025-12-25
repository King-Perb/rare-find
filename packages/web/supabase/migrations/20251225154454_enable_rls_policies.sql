-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Users table policies
-- ============================================================================

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own record (when account is created)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Search Preferences table policies
-- ============================================================================

-- Users can manage their own search preferences
CREATE POLICY "Users can manage own preferences"
  ON search_preferences
  FOR ALL
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

-- ============================================================================
-- Listings table policies
-- ============================================================================

-- All authenticated users can read listings (public data)
CREATE POLICY "Authenticated users can read listings"
  ON listings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- System/service role can insert listings (backend operations)
-- Note: This allows service role to create listings via API routes
-- Regular users cannot insert listings directly
CREATE POLICY "Service role can insert listings"
  ON listings
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- System/service role can update listings (backend operations)
CREATE POLICY "Service role can update listings"
  ON listings
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- AI Evaluations table policies
-- ============================================================================

-- All authenticated users can read AI evaluations (public data)
CREATE POLICY "Authenticated users can read evaluations"
  ON ai_evaluations
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- System/service role can insert AI evaluations (backend operations)
CREATE POLICY "Service role can insert evaluations"
  ON ai_evaluations
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- System/service role can update AI evaluations (backend operations)
CREATE POLICY "Service role can update evaluations"
  ON ai_evaluations
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- Recommendations table policies
-- ============================================================================

-- Users can only see their own recommendations
CREATE POLICY "Users can read own recommendations"
  ON recommendations
  FOR SELECT
  USING (auth.uid() = "userId");

-- System/service role can insert recommendations (backend creates recommendations)
CREATE POLICY "Service role can insert recommendations"
  ON recommendations
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Users can update their own recommendations (mark as viewed, dismissed, purchased)
CREATE POLICY "Users can update own recommendations"
  ON recommendations
  FOR UPDATE
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

-- ============================================================================
-- Notifications table policies
-- ============================================================================

-- Users can only see their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = "userId");

-- System/service role can insert notifications (backend creates notifications)
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

