-- =============================================================================
-- VedRith Notification Platform Phase 1 — Migration 0048: DB Functions
-- Atomic queue claiming, stats, cleanup, and alert helpers.
-- Additive only.
-- =============================================================================

-- ── Claim next queue item (atomic — prevents duplicate sends) ─────────────────

CREATE OR REPLACE FUNCTION claim_next_notification_job(worker_id TEXT DEFAULT 'default')
RETURNS notification_queue
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE v_job notification_queue;
BEGIN
  SELECT * INTO v_job
  FROM notification_queue
  WHERE
    status IN ('PENDING', 'SCHEDULED')
    AND attempts    < max_attempts
    AND next_attempt_at <= NOW()
  ORDER BY priority ASC, created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_job.id IS NULL THEN RETURN NULL; END IF;

  UPDATE notification_queue
  SET
    status          = 'SENDING',
    attempts        = attempts + 1,
    updated_at      = NOW()
  WHERE id = v_job.id
  RETURNING * INTO v_job;

  RETURN v_job;
END;
$$;

-- ── Get unread notification count ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_unread_notification_count(p_recipient_id TEXT DEFAULT 'admin')
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM notifications
  WHERE
    recipient_id = p_recipient_id
    AND is_read      = false
    AND is_archived  = false
    AND is_dismissed = false;
$$;

-- ── Mark all as read ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_recipient_id TEXT DEFAULT 'admin')
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE v_count INTEGER;
BEGIN
  UPDATE notifications
  SET is_read = true, read_at = NOW()
  WHERE recipient_id = p_recipient_id AND is_read = false;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- ── Move failed jobs to dead letter queue ─────────────────────────────────────

CREATE OR REPLACE FUNCTION move_to_dead_letter()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE v_count INTEGER;
BEGIN
  UPDATE notification_queue
  SET status = 'DEAD_LETTER', updated_at = NOW()
  WHERE status = 'FAILED' AND attempts >= max_attempts;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- ── Queue health stats ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_notification_queue_stats()
RETURNS TABLE (
  status       TEXT,
  channel      TEXT,
  count        BIGINT,
  oldest_item  TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    status::TEXT,
    channel::TEXT,
    COUNT(*)        AS count,
    MIN(created_at) AS oldest_item
  FROM notification_queue
  GROUP BY status, channel
  ORDER BY status, channel;
$$;

-- ── Increment channel stats ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_channel_stats(
  p_channel_key TEXT,
  p_success     BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notification_channels
  SET
    messages_sent   = messages_sent   + CASE WHEN p_success THEN 1 ELSE 0 END,
    messages_failed = messages_failed + CASE WHEN p_success THEN 0 ELSE 1 END,
    last_used_at    = NOW(),
    updated_at      = NOW()
  WHERE channel_key = p_channel_key;
END;
$$;

-- ── Cleanup delivered items older than 30 days ────────────────────────────────

CREATE OR REPLACE FUNCTION cleanup_notification_queue(p_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE v_count INTEGER;
BEGIN
  DELETE FROM notification_queue
  WHERE status IN ('DELIVERED', 'CANCELLED')
    AND created_at < NOW() - (p_days || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
