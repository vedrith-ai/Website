-- =============================================================================
-- VedRith Notification Platform Phase 1 — Migration 0045: Notification Queue
-- Background queue for all outbound channel messages.
-- Separate from media_processing_jobs to avoid coupling.
-- Additive only.
-- =============================================================================

CREATE TYPE notification_queue_status AS ENUM (
  'PENDING',
  'SENDING',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
  'SCHEDULED',
  'DEAD_LETTER'  -- max retries exceeded, moved here for manual review
);

CREATE TABLE IF NOT EXISTS notification_queue (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Routing
  channel               notification_channel_type NOT NULL,
  recipient_identifier  TEXT NOT NULL,  -- email address | phone | user_id | webhook URL
  template_key          TEXT NOT NULL,  -- references notification_templates.template_key

  -- Content (resolved at enqueue time, not at send time)
  resolved_subject      TEXT,
  resolved_body         TEXT NOT NULL,
  resolved_html         TEXT,

  -- Execution
  status                notification_queue_status NOT NULL DEFAULT 'PENDING',
  priority              SMALLINT NOT NULL DEFAULT 5,  -- 1 (highest) – 10 (lowest)
  attempts              SMALLINT NOT NULL DEFAULT 0,
  max_attempts          SMALLINT NOT NULL DEFAULT 3,
  scheduled_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_attempt_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at               TIMESTAMPTZ,

  -- Result
  provider_response     JSONB DEFAULT NULL,
  error_message         TEXT,

  -- Context (soft references)
  event_id              TEXT,  -- references notification_events.id
  metadata              JSONB DEFAULT '{}'::jsonb,

  -- Rate limiting
  rate_limit_group      TEXT,  -- e.g. 'email:admin@vedrith.com'

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_nq_dispatch
  ON notification_queue (status, priority, next_attempt_at)
  WHERE status IN ('PENDING', 'SCHEDULED');

CREATE INDEX IF NOT EXISTS idx_nq_channel
  ON notification_queue (channel, status);

CREATE INDEX IF NOT EXISTS idx_nq_recipient
  ON notification_queue (recipient_identifier);

CREATE INDEX IF NOT EXISTS idx_nq_event_id
  ON notification_queue (event_id) WHERE event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_nq_created_at
  ON notification_queue (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_nq_rate_limit
  ON notification_queue (rate_limit_group, sent_at)
  WHERE rate_limit_group IS NOT NULL;

CREATE OR REPLACE FUNCTION update_nq_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER nq_updated_at
  BEFORE UPDATE ON notification_queue
  FOR EACH ROW EXECUTE FUNCTION update_nq_updated_at();

-- ── Delivery logs (immutable) ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_delivery_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id            TEXT NOT NULL,        -- references notification_queue.id (soft)
  channel             notification_channel_type NOT NULL,
  recipient_identifier TEXT NOT NULL,
  template_key        TEXT NOT NULL,
  status              notification_queue_status NOT NULL,
  provider_response   JSONB DEFAULT NULL,
  error_message       TEXT,
  attempt_number      SMALLINT NOT NULL DEFAULT 1,
  delivered_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE RULE ndl_no_update AS ON UPDATE TO notification_delivery_logs DO INSTEAD NOTHING;
CREATE RULE ndl_no_delete AS ON DELETE TO notification_delivery_logs DO INSTEAD NOTHING;

CREATE INDEX IF NOT EXISTS idx_ndl_queue_id   ON notification_delivery_logs (queue_id);
CREATE INDEX IF NOT EXISTS idx_ndl_channel    ON notification_delivery_logs (channel, status);
CREATE INDEX IF NOT EXISTS idx_ndl_created_at ON notification_delivery_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ndl_status     ON notification_delivery_logs (status);

-- ── Analytics aggregates view ─────────────────────────────────────────────────

CREATE OR REPLACE VIEW notification_delivery_stats AS
SELECT
  channel,
  template_key,
  COUNT(*)                                              AS total_attempts,
  COUNT(*) FILTER (WHERE status = 'DELIVERED')         AS delivered,
  COUNT(*) FILTER (WHERE status = 'FAILED')            AS failed,
  COUNT(*) FILTER (WHERE status = 'DEAD_LETTER')       AS dead_letter,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'DELIVERED')::numeric /
    NULLIF(COUNT(*), 0) * 100, 1
  )                                                     AS delivery_rate_pct,
  MAX(created_at)                                       AS last_attempt_at
FROM notification_delivery_logs
GROUP BY channel, template_key;
