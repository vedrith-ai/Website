-- =============================================================================
-- VedRith Notification Platform Phase 1 — Migration 0047: RLS Policies
-- Mirrors CMS and Media Platform RLS patterns.
-- Additive only.
-- =============================================================================

-- ── notification_events ───────────────────────────────────────────────────────

ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ne_select" ON notification_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role writes (event engine uses admin client)
CREATE POLICY "ne_manage" ON notification_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ── notification_templates ────────────────────────────────────────────────────

ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read active templates
CREATE POLICY "nt_select" ON notification_templates
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Service role manages all
CREATE POLICY "nt_manage" ON notification_templates
  FOR ALL USING (auth.role() = 'service_role');

-- ── notifications (in-app) ────────────────────────────────────────────────────

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can see their own notifications
-- (recipient_id matches auth.uid() for future user accounts,
--  or 'admin' matches for all admin users in Phase 1)
CREATE POLICY "notif_select" ON notifications
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND (recipient_id = 'admin' OR recipient_id = auth.uid()::text)
  );

-- Service role inserts
CREATE POLICY "notif_insert" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Users can update their own (mark read, archive, dismiss)
CREATE POLICY "notif_update" ON notifications
  FOR UPDATE USING (
    auth.role() IN ('authenticated', 'service_role')
    AND (recipient_id = 'admin' OR recipient_id = auth.uid()::text)
  );

-- ── notification_queue ────────────────────────────────────────────────────────

ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nq_select" ON notification_queue
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "nq_manage" ON notification_queue
  FOR ALL USING (auth.role() = 'service_role');

-- ── notification_delivery_logs ────────────────────────────────────────────────

ALTER TABLE notification_delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ndl_select" ON notification_delivery_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "ndl_insert" ON notification_delivery_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ── notification_channels ─────────────────────────────────────────────────────

ALTER TABLE notification_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nc_select" ON notification_channels
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "nc_manage" ON notification_channels
  FOR ALL USING (auth.role() = 'service_role');

-- ── notification_user_preferences ─────────────────────────────────────────────

ALTER TABLE notification_user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nup_select" ON notification_user_preferences
  FOR SELECT USING (auth.role() = 'authenticated' AND user_id = auth.uid()::text);

CREATE POLICY "nup_manage" ON notification_user_preferences
  FOR ALL USING (auth.role() IN ('authenticated', 'service_role'));
