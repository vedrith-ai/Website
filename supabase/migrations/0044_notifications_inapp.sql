-- =============================================================================
-- VedRith Notification Platform Phase 1 — Migration 0044: In-App Notifications
-- Stores all in-app notification records.
-- recipient_id is TEXT (future user ID — no auth FK yet per arch rules).
-- Additive only.
-- =============================================================================

CREATE TYPE notification_priority AS ENUM (
  'LOW', 'NORMAL', 'HIGH', 'URGENT'
);

CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Recipient (soft ref — no user FK yet)
  recipient_id    TEXT NOT NULL DEFAULT 'admin',  -- 'admin' | future user UUID

  -- Content
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  icon            TEXT,                            -- emoji or URL
  category        TEXT NOT NULL DEFAULT 'system', -- 'editorial' | 'system' | 'content' | ...
  priority        notification_priority NOT NULL DEFAULT 'NORMAL',
  action_url      TEXT,

  -- State
  is_read         BOOLEAN NOT NULL DEFAULT false,
  read_at         TIMESTAMPTZ,
  is_archived     BOOLEAN NOT NULL DEFAULT false,
  archived_at     TIMESTAMPTZ,
  is_dismissed    BOOLEAN NOT NULL DEFAULT false,
  dismissed_at    TIMESTAMPTZ,

  -- Grouping
  group_key       TEXT,    -- same group_key = collapsible group
  metadata        JSONB DEFAULT '{}'::jsonb,

  -- Traceability (soft references)
  event_id        TEXT,    -- references notification_events.id
  template_key    TEXT,    -- references notification_templates.template_key

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_notif_recipient_unread
  ON notifications (recipient_id, is_read, created_at DESC)
  WHERE is_archived = false AND is_dismissed = false;

CREATE INDEX IF NOT EXISTS idx_notif_recipient_all
  ON notifications (recipient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notif_category
  ON notifications (recipient_id, category);

CREATE INDEX IF NOT EXISTS idx_notif_priority
  ON notifications (recipient_id, priority, is_read);

CREATE INDEX IF NOT EXISTS idx_notif_group_key
  ON notifications (group_key) WHERE group_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notif_event_id
  ON notifications (event_id) WHERE event_id IS NOT NULL;
