-- =============================================================================
-- VedRith Notification Platform Phase 1 — Migration 0046:
-- Channel Registry + User Preferences Architecture
-- Channels are configured here; switching providers needs only a config update.
-- User preferences table is structural-only (no auth yet).
-- Additive only.
-- =============================================================================

-- ── Channel registry ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_channels (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_key         TEXT UNIQUE NOT NULL,   -- e.g. 'in-app-primary', 'email-resend'
  label               TEXT NOT NULL,
  channel_type        notification_channel_type NOT NULL,
  config              JSONB NOT NULL DEFAULT '{}'::jsonb,  -- secrets stored at app layer
  is_active           BOOLEAN NOT NULL DEFAULT true,
  is_default          BOOLEAN NOT NULL DEFAULT false,

  -- Health
  health_status       TEXT NOT NULL DEFAULT 'UNKNOWN',  -- 'UP'|'DEGRADED'|'DOWN'|'UNKNOWN'
  last_health_check   TIMESTAMPTZ,

  -- Stats
  messages_sent       BIGINT NOT NULL DEFAULT 0,
  messages_failed     BIGINT NOT NULL DEFAULT 0,
  last_used_at        TIMESTAMPTZ,

  -- Rate limiting
  rate_limit_per_hour INTEGER DEFAULT NULL,  -- NULL = unlimited
  sort_order          INTEGER DEFAULT 0,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_nc_default_per_type
  ON notification_channels (channel_type) WHERE is_default = true;

CREATE OR REPLACE FUNCTION update_nc_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER nc_updated_at
  BEFORE UPDATE ON notification_channels
  FOR EACH ROW EXECUTE FUNCTION update_nc_updated_at();

-- Seed default channels
INSERT INTO notification_channels (channel_key, label, channel_type, is_default, is_active, sort_order)
VALUES
  ('in-app-primary', 'In-App Notifications (Primary)', 'IN_APP', true, true, 0),
  ('email-primary',  'Email (Primary)',                 'EMAIL',  true, true, 1)
ON CONFLICT (channel_key) DO NOTHING;

-- ── User preferences (architecture only — no user auth yet) ───────────────────

CREATE TABLE IF NOT EXISTS notification_user_preferences (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             TEXT UNIQUE NOT NULL,    -- future user UUID (TEXT, no FK)

  -- Channel opt-ins per type
  channel_preferences JSONB NOT NULL DEFAULT
    '{"IN_APP":true,"EMAIL":false,"SMS":false,"PUSH":false}'::jsonb,

  -- Frequency & delivery
  language            TEXT NOT NULL DEFAULT 'en',
  digest_mode         BOOLEAN NOT NULL DEFAULT false,
  digest_frequency    TEXT DEFAULT 'daily',    -- 'daily' | 'weekly'

  -- Quiet hours
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start   TIME,                    -- e.g. 22:00
  quiet_hours_end     TIME,                    -- e.g. 07:00

  -- Category opt-outs
  category_preferences JSONB NOT NULL DEFAULT
    '{"editorial":true,"system":true,"content":true}'::jsonb,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nup_user_id ON notification_user_preferences (user_id);

CREATE OR REPLACE FUNCTION update_nup_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER nup_updated_at
  BEFORE UPDATE ON notification_user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_nup_updated_at();
