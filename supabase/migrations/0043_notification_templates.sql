-- =============================================================================
-- VedRith Notification Platform Phase 1 — Migration 0043: Notification Templates
-- Reusable templates for every channel. Editable from the CMS.
-- Additive only.
-- =============================================================================

CREATE TYPE notification_channel_type AS ENUM (
  'IN_APP',
  'EMAIL',
  'SMS',        -- Phase 2
  'WHATSAPP',   -- Phase 2
  'PUSH',       -- Phase 2
  'WEBHOOK',    -- Phase 2
  'BROWSER'     -- Phase 2
);

-- -----------------------------------------------------------------------------
-- notification_templates: Versioned, channel-specific message templates
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key    TEXT UNIQUE NOT NULL,       -- e.g. 'submission_approved_email'
  name            TEXT NOT NULL,
  description     TEXT,
  channel         notification_channel_type NOT NULL,

  -- Content
  subject         TEXT,                       -- Email subject / notification title
  html_body       TEXT,                       -- HTML body (email) or rich text
  text_body       TEXT NOT NULL,              -- Plain-text fallback (all channels)
  icon            TEXT,                       -- emoji or URL (in-app)
  category        TEXT,                       -- 'editorial' | 'system' | 'content' | ...
  action_url_template TEXT,                   -- e.g. '/admin/cms/submissions/{{submission_id}}'

  -- Template metadata
  variables       JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- [{ "name": "submitter_name", "description": "Name of the submitter", "required": true }]
  example_payload JSONB DEFAULT '{}'::jsonb,  -- For preview mode

  -- Lifecycle
  is_active       BOOLEAN NOT NULL DEFAULT true,
  version         INTEGER NOT NULL DEFAULT 1,

  -- Event binding
  event_type      notification_event_type,    -- NULL = manually triggered
  auto_send       BOOLEAN NOT NULL DEFAULT false,

  -- Audit
  created_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nt_channel      ON notification_templates (channel, is_active);
CREATE INDEX IF NOT EXISTS idx_nt_event_type   ON notification_templates (event_type) WHERE event_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nt_category     ON notification_templates (category);

CREATE OR REPLACE FUNCTION update_nt_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER nt_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_nt_updated_at();

-- ── Seed default templates ────────────────────────────────────────────────────

INSERT INTO notification_templates (template_key, name, description, channel, subject, html_body, text_body, icon, category, action_url_template, variables, event_type, auto_send)
VALUES
  -- Submission approved (in-app)
  ('submission_approved_inapp', 'Submission Approved (In-App)', 'Shown in the in-app notification centre', 'IN_APP',
   'Your submission has been approved ✅',
   NULL,
   'Your submission "{{title}}" has been approved and published to VedRith.',
   '✅', 'editorial', '/admin/cms/submissions/{{submission_id}}',
   '[{"name":"title","description":"Submission title","required":true},{"name":"submission_id","description":"Submission ID","required":true}]',
   'SUBMISSION_APPROVED', true),

  -- Submission rejected (in-app)
  ('submission_rejected_inapp', 'Submission Rejected (In-App)', NULL, 'IN_APP',
   'Your submission needs revision',
   NULL,
   'Your submission "{{title}}" was returned for revision. Reason: {{reason}}',
   '📝', 'editorial', '/admin/cms/submissions/{{submission_id}}',
   '[{"name":"title","required":true},{"name":"submission_id","required":true},{"name":"reason","required":false}]',
   'SUBMISSION_REJECTED', true),

  -- Editorial review required (in-app)
  ('editorial_review_required_inapp', 'Editorial Review Required (In-App)', NULL, 'IN_APP',
   'New submission awaiting review',
   NULL,
   'A new temple submission "{{title}}" by {{submitter}} is awaiting editorial review.',
   '🔔', 'editorial', '/admin/cms/submissions/{{submission_id}}',
   '[{"name":"title","required":true},{"name":"submitter","required":true},{"name":"submission_id","required":true}]',
   'EDITORIAL_REVIEW_REQUIRED', true),

  -- Media processing completed (in-app)
  ('media_processing_completed_inapp', 'Media Processing Completed (In-App)', NULL, 'IN_APP',
   'Media processing complete ✅',
   NULL,
   '"{{filename}}" has been optimised and {{variants_count}} variants generated.',
   '🖼', 'system', '/admin/media?id={{media_id}}',
   '[{"name":"filename","required":true},{"name":"media_id","required":true},{"name":"variants_count","required":false}]',
   'MEDIA_PROCESSING_COMPLETED', true),

  -- Import completed (in-app)
  ('import_completed_inapp', 'Import Completed (In-App)', NULL, 'IN_APP',
   'Data import completed ✅',
   NULL,
   'Import of {{record_count}} records from "{{source}}" completed successfully.',
   '📥', 'system', '/admin/cms',
   '[{"name":"record_count","required":true},{"name":"source","required":true}]',
   'IMPORT_COMPLETED', true),

  -- System health alert (in-app)
  ('system_health_alert_inapp', 'System Health Alert (In-App)', NULL, 'IN_APP',
   '⚠️ System Alert',
   NULL,
   '{{alert_message}}',
   '⚠️', 'system', '/admin/notifications',
   '[{"name":"alert_message","required":true},{"name":"alert_level","required":false}]',
   'SYSTEM_HEALTH_ALERT', true),

  -- Provider failure (in-app)
  ('provider_failure_inapp', 'Provider Failure (In-App)', NULL, 'IN_APP',
   '🔴 Provider Failure',
   NULL,
   'Provider "{{provider_name}}" failed: {{error_message}}',
   '🔴', 'system', '/admin/notifications/channels',
   '[{"name":"provider_name","required":true},{"name":"error_message","required":true}]',
   'PROVIDER_FAILURE', true),

  -- Submission approved (email)
  ('submission_approved_email', 'Submission Approved (Email)', 'Sent to submitter when their submission is approved', 'EMAIL',
   '✅ Your VedRith submission has been approved',
   '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px"><div style="background:#92400e;padding:16px 24px;border-radius:8px 8px 0 0"><h1 style="color:white;margin:0;font-size:20px">🕉 VedRith</h1></div><div style="background:#fffbf5;border:1px solid #fde68a;border-top:none;padding:24px;border-radius:0 0 8px 8px"><h2 style="color:#78350f;margin-top:0">Submission Approved ✅</h2><p style="color:#44403c">Your submission <strong>{{title}}</strong> has been reviewed and approved by our editorial team.</p><p style="color:#44403c">It is now live on VedRith and available to our community.</p><div style="margin:24px 0"><a href="{{action_url}}" style="background:#d97706;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">View Published Content</a></div><p style="color:#78716c;font-size:13px">Thank you for contributing to VedRith. 🙏</p></div><p style="color:#a8a29e;font-size:12px;text-align:center;margin-top:16px">VedRith — Connecting India to its Sacred Heritage</p></div>',
   'Your VedRith submission "{{title}}" has been approved and published. Thank you for contributing!',
   NULL, 'editorial', '{{action_url}}',
   '[{"name":"title","required":true},{"name":"action_url","required":false},{"name":"submitter_name","required":false}]',
   'SUBMISSION_APPROVED', false),

  -- Weekly editorial summary (email, manual)
  ('weekly_editorial_summary_email', 'Weekly Editorial Summary (Email)', 'Sent to editors with weekly stats', 'EMAIL',
   '📊 VedRith Weekly Summary — {{week_label}}',
   '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px"><div style="background:#92400e;padding:16px 24px;border-radius:8px 8px 0 0"><h1 style="color:white;margin:0;font-size:20px">🕉 VedRith Weekly Summary</h1></div><div style="background:#fffbf5;border:1px solid #fde68a;border-top:none;padding:24px;border-radius:0 0 8px 8px"><h2 style="color:#78350f;margin-top:0">Week of {{week_label}}</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px;border-bottom:1px solid #fde68a;color:#44403c">Submissions Received</td><td style="padding:8px;border-bottom:1px solid #fde68a;font-weight:bold;text-align:right;color:#78350f">{{submissions_count}}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #fde68a;color:#44403c">Approved</td><td style="padding:8px;border-bottom:1px solid #fde68a;font-weight:bold;text-align:right;color:#16a34a">{{approved_count}}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #fde68a;color:#44403c">Rejected</td><td style="padding:8px;border-bottom:1px solid #fde68a;font-weight:bold;text-align:right;color:#dc2626">{{rejected_count}}</td></tr><tr><td style="padding:8px;color:#44403c">Media Processed</td><td style="padding:8px;font-weight:bold;text-align:right;color:#78350f">{{media_count}}</td></tr></table><div style="margin-top:24px"><a href="{{dashboard_url}}" style="background:#d97706;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">View Dashboard</a></div></div><p style="color:#a8a29e;font-size:12px;text-align:center;margin-top:16px">VedRith — Connecting India to its Sacred Heritage</p></div>',
   'VedRith Weekly Summary for {{week_label}}:\n- Submissions: {{submissions_count}}\n- Approved: {{approved_count}}\n- Rejected: {{rejected_count}}\n- Media Processed: {{media_count}}',
   NULL, 'editorial', '/admin/cms',
   '[{"name":"week_label","required":true},{"name":"submissions_count","required":true},{"name":"approved_count","required":true},{"name":"rejected_count","required":true},{"name":"media_count","required":true},{"name":"dashboard_url","required":false}]',
   NULL, false)

ON CONFLICT (template_key) DO NOTHING;
