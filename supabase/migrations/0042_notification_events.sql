-- =============================================================================
-- VedRith Notification Platform Phase 1 — Migration 0042: Notification Events
-- Central event store. Every notification originates from an event.
-- Additive only. No cross-module FKs. Continues from Media Platform (0041).
-- =============================================================================

CREATE TYPE notification_event_type AS ENUM (
  -- Content lifecycle
  'CONTENT_PUBLISHED',
  'CONTENT_UPDATED',
  'CONTENT_ARCHIVED',
  -- Editorial workflow
  'EDITORIAL_REVIEW_REQUIRED',
  'SUBMISSION_APPROVED',
  'SUBMISSION_REJECTED',
  'TRANSLATION_REQUIRED',
  -- Import / processing
  'IMPORT_COMPLETED',
  'IMPORT_FAILED',
  'MEDIA_PROCESSING_COMPLETED',
  'MEDIA_PROCESSING_FAILED',
  -- System
  'SYSTEM_HEALTH_ALERT',
  'PROVIDER_FAILURE',
  'STORAGE_ALERT',
  'QUEUE_FAILURE',
  'BACKUP_COMPLETED',
  -- Future domains (reserved)
  'PANCHANGA_ALERT',
  'KUNDALI_ALERT',
  'USER_EVENT',
  'CUSTOM'
);

-- -----------------------------------------------------------------------------
-- notification_events: Immutable, append-only event log
-- Every notification is traceable to an event.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  event_type      notification_event_type NOT NULL,

  -- Source (soft references — no FK per arch rules)
  source_module   TEXT NOT NULL,              -- 'cms' | 'media' | 'knowledge' | 'system' | ...
  source_id       TEXT,                       -- entity ID that triggered the event
  actor_id        TEXT,                       -- user / job that triggered it (NULL = system)

  -- Event data
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- e.g. { "title": "Sivasamudram Temple", "slug": "sivasamudram", "action": "approved" }

  -- Processing state
  processed       BOOLEAN NOT NULL DEFAULT false,
  processed_at    TIMESTAMPTZ,
  handler_results JSONB DEFAULT '[]'::jsonb,  -- array of per-handler results

  -- Audit
  correlation_id  TEXT,                       -- optional trace ID for grouping related events
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Append-only enforcement
CREATE RULE notification_events_no_update AS ON UPDATE TO notification_events DO INSTEAD NOTHING;
CREATE RULE notification_events_no_delete AS ON DELETE TO notification_events DO INSTEAD NOTHING;

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ne_event_type   ON notification_events (event_type);
CREATE INDEX IF NOT EXISTS idx_ne_source       ON notification_events (source_module, source_id);
CREATE INDEX IF NOT EXISTS idx_ne_processed    ON notification_events (processed, created_at);
CREATE INDEX IF NOT EXISTS idx_ne_created_at   ON notification_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ne_correlation  ON notification_events (correlation_id) WHERE correlation_id IS NOT NULL;

-- Allow updates only to processed/processed_at/handler_results (workaround for append-only rule)
CREATE OR REPLACE FUNCTION mark_event_processed(
  p_event_id      UUID,
  p_handler_results JSONB DEFAULT '[]'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notification_events
  SET
    processed       = true,
    processed_at    = NOW(),
    handler_results = p_handler_results
  WHERE id = p_event_id;
END;
$$;
