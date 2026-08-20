-- Migration: 0050_events_notifications.sql

CREATE TABLE IF NOT EXISTS public.events (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description TEXT        NOT NULL CHECK (char_length(description) BETWEEN 1 AND 2000),
  date        DATE        NOT NULL,
  category    TEXT        NOT NULL CHECK (category IN ('festival','muhurta','alert','general')),
  region      TEXT        CHECK (region IN ('KARNATAKA','ANDHRA','TAMIL_NADU','KERALA','MAHARASHTRA','NATIONAL')),
  lang        TEXT        CHECK (lang IN ('en','kn')),
  published   BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published" ON public.events
  FOR SELECT USING (published = true);

CREATE POLICY "service_role_all_events" ON public.events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS events_date_idx      ON public.events (date DESC);
CREATE INDEX IF NOT EXISTS events_published_idx ON public.events (published);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT        NOT NULL,
  body       TEXT        NOT NULL,
  lang       TEXT        NOT NULL DEFAULT 'both' CHECK (lang IN ('en','kn','both')),
  region     TEXT        CHECK (region IN ('KARNATAKA','ANDHRA','TAMIL_NADU','KERALA','MAHARASHTRA','NATIONAL')),
  schedule   DATE,
  sent       BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_notifications" ON public.notifications
  FOR ALL TO service_role USING (true) WITH CHECK (true);
