create table if not exists public.kundali_charts (
  id                 text primary key,
  name               text not null,
  gender             text not null check (gender in ('MALE','FEMALE','OTHER')),
  chart              jsonb not null,
  birth_tithi        jsonb not null,
  birth_yoga         jsonb not null,
  birth_karana       jsonb not null,
  house_placements   jsonb not null,
  house_system_used  text not null check (house_system_used in ('WHOLE_SIGN','EQUAL','PLACIDUS')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_kundali_charts_created_at on public.kundali_charts (created_at desc);
alter table public.kundali_charts enable row level security;
