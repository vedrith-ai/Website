-- Migration: 0049_contact_enquiries.sql
-- Creates contact_messages table with RLS

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email      TEXT        NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  subject    TEXT        NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 200),
  message    TEXT        NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  status     TEXT        NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: no public read/write — service role only
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON public.contact_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS contact_messages_status_idx     ON public.contact_messages (status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
