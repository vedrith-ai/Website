# VedRith — Technical Architecture Document

**Document Version:** 1.0.0
**Classification:** Internal — Confidential
**Authored by:** Chief Software Architect, VedRith
**Last Revised:** June 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack Overview](#2-technology-stack-overview)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication Flow](#5-authentication-flow)
6. [API Design](#6-api-design)
7. [Panchanga Calculation Architecture](#7-panchanga-calculation-architecture)
8. [Kundali Generation Architecture](#8-kundali-generation-architecture)
9. [Muhurta Engine Architecture](#9-muhurta-engine-architecture)
10. [Future: Matchmaking Architecture](#10-future-matchmaking-architecture)
11. [Future: Numerology Architecture](#11-future-numerology-architecture)
12. [Security Architecture](#12-security-architecture)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Multi-Language Architecture](#14-multi-language-architecture)
15. [Admin Panel Architecture](#15-admin-panel-architecture)
16. [Architecture Decision Log](#16-architecture-decision-log)

---

## 1. Executive Summary

VedRith is a modern, full-stack Vedic astrology platform designed to deliver classical Jyotiṣa computations — Panchanga, Kundali, Muhurta, Matchmaking, and Numerology — through a scalable, type-safe, and multilingual web application.

The platform is engineered for high precision (astronomical-grade calculations), cultural fidelity (regional Panchanga variation support), and extensibility (plugin-style engine modules). It is built on a serverless-first philosophy using Next.js on Vercel and Supabase as the managed backend, enabling zero-infrastructure operations while supporting tens of thousands of concurrent users.

### Core Design Principles

- **Separation of Concerns** — Calculation engines are isolated from presentation and persistence layers.
- **Type Safety First** — Every contract between modules is expressed in TypeScript interfaces.
- **Calculation Correctness** — Astronomical algorithms take precedence over UI convenience.
- **Privacy by Design** — Birth data is sensitive; encryption and row-level isolation are non-negotiable.
- **Localization Native** — Every user-facing string and calendar output is language/region aware from day one.
- **Progressive Feature Delivery** — Matchmaking and Numerology modules are architected now, shipped later.

---

## 2. Technology Stack Overview

| Layer | Technology | Rationale |
|---|---|---|
| Frontend Framework | Next.js 15 (App Router) | Server Components, streaming SSR, built-in API routes |
| Language | TypeScript 5.x (strict mode) | End-to-end type safety across all layers |
| Styling | Tailwind CSS 4.x | Utility-first, consistent design token system |
| Backend-as-a-Service | Supabase | Auth, Postgres, Storage, Realtime, Edge Functions |
| Database | PostgreSQL 16 (via Supabase) | ACID compliance, JSONB for flexible astrological data |
| Hosting | Vercel | Edge network, serverless functions, preview deployments |
| Calculation Runtime | Vercel Edge Functions / Node.js | Low-latency astronomical computation |
| File Storage | Supabase Storage | Chart PDF/SVG storage, user profile images |
| Caching | Vercel KV (Redis) | Ephemeris data caching, session state |
| Email | Supabase + Resend | Transactional email (OTP, reports) |
| Monitoring | Vercel Analytics + Sentry | Performance, error tracking |
| CI/CD | GitHub Actions + Vercel | Automated testing and deployment pipeline |

---

## 3. Folder Structure

The repository follows Next.js App Router conventions with strict domain-based separation.

```
vedrith/
│
├── app/                                  # Next.js App Router root
│   ├── (auth)/                           # Auth route group (no shared layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── verify-otp/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                      # Authenticated user area
│   │   ├── layout.tsx                    # Shell with sidebar, nav
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── panchanga/
│   │   │   ├── page.tsx                  # Daily Panchanga viewer
│   │   │   └── [date]/
│   │   │       └── page.tsx              # Specific date Panchanga
│   │   ├── kundali/
│   │   │   ├── page.tsx                  # Kundali list / create
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx              # Kundali detail view
│   │   │       └── report/
│   │   │           └── page.tsx          # Printable report
│   │   ├── muhurta/
│   │   │   ├── page.tsx
│   │   │   └── [eventType]/
│   │   │       └── page.tsx
│   │   ├── matchmaking/                  # Future module (scaffolded)
│   │   │   └── page.tsx
│   │   ├── numerology/                   # Future module (scaffolded)
│   │   │   └── page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── profile/
│   │       │   └── page.tsx
│   │       └── preferences/
│   │           └── page.tsx
│   │
│   ├── (admin)/                          # Admin panel route group
│   │   ├── layout.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx                  # Admin dashboard
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   ├── ayanamsha/                # Manage calculation settings
│   │   │   │   └── page.tsx
│   │   │   └── content/
│   │   │       └── page.tsx
│   │
│   ├── api/                              # Next.js Route Handlers
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts              # Supabase OAuth callback
│   │   │   └── signout/
│   │   │       └── route.ts
│   │   ├── v1/                           # Versioned API
│   │   │   ├── panchanga/
│   │   │   │   ├── daily/
│   │   │   │   │   └── route.ts
│   │   │   │   └── monthly/
│   │   │   │       └── route.ts
│   │   │   ├── kundali/
│   │   │   │   ├── route.ts              # POST create, GET list
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts          # GET, PUT, DELETE
│   │   │   │       └── report/
│   │   │   │           └── route.ts      # Generate PDF report
│   │   │   ├── muhurta/
│   │   │   │   ├── route.ts
│   │   │   │   └── [eventType]/
│   │   │   │       └── route.ts
│   │   │   ├── matchmaking/              # Future
│   │   │   │   └── route.ts
│   │   │   ├── numerology/               # Future
│   │   │   │   └── route.ts
│   │   │   └── geocode/
│   │   │       └── route.ts              # Location → lat/lng/timezone
│   │
│   ├── layout.tsx                        # Root layout (font, metadata, providers)
│   ├── page.tsx                          # Marketing home page
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/                           # Shared UI components
│   ├── ui/                               # Primitive design system
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── skeleton.tsx
│   │   └── tooltip.tsx
│   ├── astro/                            # Astrology-specific components
│   │   ├── KundaliChart/
│   │   │   ├── index.tsx                 # Wrapper / export
│   │   │   ├── NorthChart.tsx            # North Indian chart SVG
│   │   │   ├── SouthChart.tsx            # South Indian chart SVG
│   │   │   └── EastChart.tsx             # East Indian chart SVG
│   │   ├── PanchangaCard.tsx
│   │   ├── PlanetTable.tsx
│   │   ├── DashaTimeline.tsx
│   │   ├── MuhurtaCalendar.tsx
│   │   ├── AyanamshaSelector.tsx
│   │   └── RasiWheel.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   └── shared/
│       ├── DateTimePicker.tsx
│       ├── LocationSearch.tsx            # Powered by geocode API
│       ├── LoadingState.tsx
│       └── ErrorBoundary.tsx
│
├── lib/                                  # Pure library code (no React)
│   ├── engines/                          # Calculation engine modules
│   │   ├── panchanga/
│   │   │   ├── index.ts                  # Public API
│   │   │   ├── tithi.ts
│   │   │   ├── nakshatra.ts
│   │   │   ├── yoga.ts
│   │   │   ├── karana.ts
│   │   │   ├── vara.ts
│   │   │   ├── rahu-kalam.ts
│   │   │   ├── abhijit.ts
│   │   │   └── regional/
│   │   │       ├── types.ts
│   │   │       ├── telugu.ts
│   │   │       ├── tamil.ts
│   │   │       ├── kannada.ts
│   │   │       ├── malayalam.ts
│   │   │       ├── gujarati.ts
│   │   │       ├── maharashtrian.ts
│   │   │       ├── bengali.ts
│   │   │       └── north-indian.ts
│   │   ├── kundali/
│   │   │   ├── index.ts
│   │   │   ├── planetary-positions.ts
│   │   │   ├── ascendant.ts
│   │   │   ├── house-system.ts           # Placidus, Whole Sign, etc.
│   │   │   ├── ayanamsha.ts              # Lahiri, KP, Raman, etc.
│   │   │   ├── dasha/
│   │   │   │   ├── vimshottari.ts
│   │   │   │   ├── yogini.ts
│   │   │   │   └── ashtottari.ts
│   │   │   ├── divisional-charts/
│   │   │   │   ├── navamsha.ts           # D9
│   │   │   │   ├── dashamsha.ts          # D10
│   │   │   │   ├── saptamsha.ts          # D7
│   │   │   │   └── index.ts
│   │   │   ├── yogas/
│   │   │   │   ├── raja-yogas.ts
│   │   │   │   ├── dhana-yogas.ts
│   │   │   │   ├── dosha/
│   │   │   │   │   ├── mangal-dosha.ts
│   │   │   │   │   ├── kaal-sarpa.ts
│   │   │   │   │   └── pitru-dosha.ts
│   │   │   │   └── index.ts
│   │   │   └── shadbala.ts               # Planetary strength
│   │   ├── muhurta/
│   │   │   ├── index.ts
│   │   │   ├── choghadiya.ts
│   │   │   ├── hora.ts
│   │   │   ├── tarabala.ts
│   │   │   ├── chandrabala.ts
│   │   │   ├── panchaka.ts
│   │   │   ├── events/
│   │   │   │   ├── vivaha.ts             # Marriage
│   │   │   │   ├── griha-pravesha.ts     # Housewarming
│   │   │   │   ├── upanayana.ts          # Sacred thread
│   │   │   │   ├── namakarana.ts         # Naming ceremony
│   │   │   │   ├── business.ts
│   │   │   │   └── travel.ts
│   │   │   └── scorer.ts                 # Composite muhurta scoring
│   │   ├── matchmaking/                  # Future — interfaces defined now
│   │   │   ├── index.ts
│   │   │   ├── ashtakoot.ts              # 36-point compatibility
│   │   │   ├── mangal-dosha-check.ts
│   │   │   └── guna-milan.ts
│   │   ├── numerology/                   # Future — interfaces defined now
│   │   │   ├── index.ts
│   │   │   ├── chaldean.ts
│   │   │   ├── pythagorean.ts
│   │   │   └── vedic.ts
│   │   └── ephemeris/
│   │       ├── index.ts                  # Abstraction over Swiss Ephemeris
│   │       ├── swisseph-adapter.ts
│   │       └── cache.ts                  # Redis-backed positional cache
│   │
│   ├── supabase/
│   │   ├── client.ts                     # Browser client
│   │   ├── server.ts                     # Server-side client (SSR)
│   │   ├── middleware.ts                 # Auth session refresh
│   │   └── admin.ts                      # Service-role client (admin only)
│   │
│   ├── validators/
│   │   ├── birth-data.ts                 # Zod schemas
│   │   ├── panchanga-query.ts
│   │   ├── muhurta-query.ts
│   │   └── user-profile.ts
│   │
│   ├── utils/
│   │   ├── astronomy.ts                  # Coordinate transforms, JD conversion
│   │   ├── timezone.ts                   # IANA tz resolution
│   │   ├── date-format.ts                # Locale-aware date formatting
│   │   ├── string.ts
│   │   └── constants.ts                  # Graha names, Nakshatra list, etc.
│   │
│   └── types/
│       ├── astro.ts                      # Core domain types
│       ├── api.ts                        # Request/response types
│       ├── database.ts                   # Generated Supabase DB types
│       └── engine.ts                     # Engine input/output contracts
│
├── hooks/                                # React custom hooks
│   ├── use-auth.ts
│   ├── use-kundali.ts
│   ├── use-panchanga.ts
│   ├── use-muhurta.ts
│   ├── use-location.ts
│   └── use-locale.ts
│
├── store/                                # Client state (Zustand)
│   ├── auth-store.ts
│   ├── kundali-store.ts
│   └── preferences-store.ts
│
├── messages/                             # i18n translation files
│   ├── en.json
│   ├── hi.json                           # Hindi
│   ├── te.json                           # Telugu
│   ├── ta.json                           # Tamil
│   ├── kn.json                           # Kannada
│   ├── ml.json                           # Malayalam
│   ├── gu.json                           # Gujarati
│   ├── mr.json                           # Marathi
│   └── bn.json                           # Bengali
│
├── supabase/
│   ├── migrations/                       # SQL migration files
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   ├── 0003_admin_tables.sql
│   │   └── 0004_audit_log.sql
│   ├── functions/                        # Supabase Edge Functions
│   │   ├── generate-kundali-pdf/
│   │   │   └── index.ts
│   │   └── send-report-email/
│   │       └── index.ts
│   └── seed.sql
│
├── public/
│   ├── fonts/
│   ├── images/
│   └── locales/                          # Static locale assets
│
├── tests/
│   ├── unit/
│   │   ├── engines/
│   │   │   ├── panchanga.test.ts
│   │   │   ├── kundali.test.ts
│   │   │   └── muhurta.test.ts
│   │   └── validators/
│   ├── integration/
│   │   └── api/
│   └── e2e/                              # Playwright
│       ├── auth.spec.ts
│       └── kundali-flow.spec.ts
│
├── middleware.ts                         # Next.js middleware (auth guard)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                            # Local secrets (never committed)
├── .env.example
└── package.json
```

---

## 4. Database Schema

All tables reside in Supabase (PostgreSQL 16). Row-Level Security (RLS) is enabled on every user-owned table. The schema uses UUIDs for all primary keys to prevent enumeration attacks.

### 4.1 Entity Relationship Overview

```
users (Supabase Auth)
  │
  ├──< profiles           (1:1 user extension)
  ├──< birth_profiles     (1:many — stored horoscopes)
  │       │
  │       ├──< kundali_charts       (1:many — one per chart style/settings)
  │       ├──< dasha_periods        (1:many — Vimshottari sequence)
  │       └──< divisional_charts    (1:many — D9, D10, etc.)
  │
  ├──< panchanga_cache    (1:many — pre-computed daily entries)
  ├──< muhurta_queries    (1:many — saved muhurta searches)
  └──< matchmaking_pairs  (1:many — future)
```

### 4.2 Core Tables

#### `profiles`
Extension of `auth.users`. Created automatically via trigger on user signup.

```sql
CREATE TABLE public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name      TEXT,
  avatar_url        TEXT,
  phone             TEXT,
  preferred_language CHAR(2) NOT NULL DEFAULT 'en',     -- ISO 639-1
  preferred_region  TEXT NOT NULL DEFAULT 'IN',          -- ISO 3166-1
  ayanamsha         TEXT NOT NULL DEFAULT 'LAHIRI',      -- Calculation preference
  chart_style       TEXT NOT NULL DEFAULT 'NORTH',       -- NORTH | SOUTH | EAST
  timezone          TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  subscription_tier TEXT NOT NULL DEFAULT 'FREE',        -- FREE | PRO | PREMIUM
  subscription_expires_at TIMESTAMPTZ,
  is_admin          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `birth_profiles`
Stores birth data for persons whose charts are to be calculated. A user may store multiple birth profiles (self, family members, clients).

```sql
CREATE TABLE public.birth_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,                         -- e.g., "My Chart", "Mother"
  full_name       TEXT NOT NULL,
  date_of_birth   DATE NOT NULL,
  time_of_birth   TIME NOT NULL,
  time_unknown    BOOLEAN NOT NULL DEFAULT FALSE,
  place_of_birth  TEXT NOT NULL,                         -- Human-readable
  latitude        NUMERIC(9,6) NOT NULL,
  longitude       NUMERIC(9,6) NOT NULL,
  altitude_m      NUMERIC(7,2) NOT NULL DEFAULT 0,
  timezone        TEXT NOT NULL,                         -- IANA tz identifier
  utc_offset_mins SMALLINT NOT NULL,                     -- At time of birth
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_latitude  CHECK (latitude  BETWEEN -90  AND 90),
  CONSTRAINT chk_longitude CHECK (longitude BETWEEN -180 AND 180)
);

CREATE INDEX idx_birth_profiles_user_id ON public.birth_profiles(user_id);
```

#### `kundali_charts`
Stores a computed Kundali result. Separated from `birth_profiles` so that re-computation under different settings (ayanamsha, house system) produces a distinct record without duplication of birth data.

```sql
CREATE TABLE public.kundali_charts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_profile_id  UUID NOT NULL REFERENCES public.birth_profiles(id) ON DELETE CASCADE,
  ayanamsha         TEXT NOT NULL,         -- LAHIRI | KP | RAMAN | KRISHNAMURTI | TRUE_CHITRA
  house_system      TEXT NOT NULL,         -- WHOLE_SIGN | PLACIDUS | EQUAL | SRIPATI
  julian_day_ut     DOUBLE PRECISION NOT NULL,   -- Julian Day in UT at birth moment
  lagna_sign        SMALLINT NOT NULL,     -- 1–12
  lagna_degree      NUMERIC(6,4) NOT NULL,
  planet_positions  JSONB NOT NULL,        -- See Planet Position schema below
  house_cusps       JSONB NOT NULL,        -- 12 cusp degrees
  yogas             JSONB,                 -- Detected yogas
  doshas            JSONB,                 -- Detected doshas
  shadbala          JSONB,                 -- Planetary strengths
  pdf_url           TEXT,                  -- Supabase Storage URL
  computed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_current        BOOLEAN NOT NULL DEFAULT TRUE,   -- Most recent computation
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- planet_positions JSONB structure:
-- {
--   "SU": { "sign": 1, "degree": 14.55, "retrograde": false, "nakshatra": "Ashwini", "pada": 2 },
--   "MO": { ... },
--   "MA": { ... }, "ME": { ... }, "JU": { ... }, "VE": { ... }, "SA": { ... },
--   "RA": { ... }, "KE": { ... }
-- }

CREATE INDEX idx_kundali_birth_profile ON public.kundali_charts(birth_profile_id);
CREATE INDEX idx_kundali_current ON public.kundali_charts(birth_profile_id, is_current);
```

#### `dasha_periods`
Pre-computed Vimshottari Dasha sequence for a kundali chart.

```sql
CREATE TABLE public.dasha_periods (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kundali_id      UUID NOT NULL REFERENCES public.kundali_charts(id) ON DELETE CASCADE,
  level           SMALLINT NOT NULL,       -- 1=Maha, 2=Antar, 3=Pratyantar
  lord            CHAR(2) NOT NULL,        -- SU, MO, MA, RA, JU, SA, ME, KE, VE
  starts_at       DATE NOT NULL,
  ends_at         DATE NOT NULL,
  parent_id       UUID REFERENCES public.dasha_periods(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dasha_kundali ON public.dasha_periods(kundali_id, level);
CREATE INDEX idx_dasha_date_range ON public.dasha_periods USING GIST (
  daterange(starts_at, ends_at)
);
```

#### `divisional_charts`
Stores vargas (divisional charts) associated with a Kundali.

```sql
CREATE TABLE public.divisional_charts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kundali_id        UUID NOT NULL REFERENCES public.kundali_charts(id) ON DELETE CASCADE,
  division          SMALLINT NOT NULL,     -- 1=Rashi, 2=Hora, 3=Drekkana, 9=Navamsha...
  division_name     TEXT NOT NULL,         -- D1, D2, D3, D9, D10, etc.
  planet_positions  JSONB NOT NULL,
  lagna_sign        SMALLINT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `panchanga_cache`
Pre-computed daily Panchanga data per location cluster and regional tradition. Cache keys include rounded coordinates and regional variant.

```sql
CREATE TABLE public.panchanga_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panchanga_date  DATE NOT NULL,
  region_key      TEXT NOT NULL,           -- e.g., 'TELUGU', 'TAMIL', 'NORTH'
  lat_bucket      NUMERIC(4,1) NOT NULL,   -- Rounded to 0.5° for cache grouping
  lng_bucket      NUMERIC(5,1) NOT NULL,
  timezone        TEXT NOT NULL,
  ayanamsha       TEXT NOT NULL DEFAULT 'LAHIRI',
  tithi           JSONB NOT NULL,
  nakshatra       JSONB NOT NULL,
  yoga            JSONB NOT NULL,
  karana          JSONB NOT NULL,
  vara            JSONB NOT NULL,
  rahu_kalam      JSONB NOT NULL,
  yamaganda       JSONB NOT NULL,
  gulika          JSONB NOT NULL,
  abhijit_muhurta JSONB,
  planetary_hour  JSONB,
  sunrise         TIMESTAMPTZ NOT NULL,
  sunset          TIMESTAMPTZ NOT NULL,
  moonrise        TIMESTAMPTZ,
  moonset         TIMESTAMPTZ,
  computed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  UNIQUE(panchanga_date, region_key, lat_bucket, lng_bucket, ayanamsha)
);

CREATE INDEX idx_panchanga_lookup ON public.panchanga_cache
  (panchanga_date, region_key, lat_bucket, lng_bucket, ayanamsha);
```

#### `muhurta_queries`
Saved muhurta searches for authenticated users.

```sql
CREATE TABLE public.muhurta_queries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  birth_profile_id UUID REFERENCES public.birth_profiles(id),
  event_type      TEXT NOT NULL,           -- VIVAHA | GRIHA_PRAVESHA | BUSINESS | TRAVEL | etc.
  search_start    DATE NOT NULL,
  search_end      DATE NOT NULL,
  location        TEXT NOT NULL,
  latitude        NUMERIC(9,6) NOT NULL,
  longitude       NUMERIC(9,6) NOT NULL,
  timezone        TEXT NOT NULL,
  constraints     JSONB,                   -- User-specified filters
  results         JSONB,                   -- Ranked muhurta windows
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `matchmaking_pairs` *(Future)*

```sql
CREATE TABLE public.matchmaking_pairs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_a_id     UUID NOT NULL REFERENCES public.birth_profiles(id),
  profile_b_id     UUID NOT NULL REFERENCES public.birth_profiles(id),
  ashtakoot_score  NUMERIC(4,1),           -- Out of 36
  guna_details     JSONB,
  dosha_analysis   JSONB,
  compatibility    TEXT,                   -- EXCELLENT | GOOD | AVERAGE | POOR
  report_url       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_different_profiles CHECK (profile_a_id <> profile_b_id)
);
```

#### `numerology_reports` *(Future)*

```sql
CREATE TABLE public.numerology_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  birth_profile_id UUID REFERENCES public.birth_profiles(id),
  system          TEXT NOT NULL,           -- CHALDEAN | PYTHAGOREAN | VEDIC
  full_name       TEXT NOT NULL,
  date_of_birth   DATE NOT NULL,
  life_path       SMALLINT,
  destiny_number  SMALLINT,
  soul_urge       SMALLINT,
  personality     SMALLINT,
  expression      SMALLINT,
  results         JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `audit_log`
Immutable append-only audit trail for security-sensitive operations.

```sql
CREATE TABLE public.audit_log (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,              -- e.g., 'KUNDALI_CREATE', 'PROFILE_DELETE'
  resource    TEXT,                       -- e.g., 'kundali_charts'
  resource_id UUID,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log is append-only; no UPDATE or DELETE permitted via RLS
```

---

## 5. Authentication Flow

VedRith uses Supabase Auth as the identity provider, with support for email/password, Google OAuth, and OTP-based magic links.

### 5.1 Auth Providers

| Provider | Use Case | Notes |
|---|---|---|
| Email + Password | Primary registration | Email verified via OTP |
| Google OAuth | Social login | One-click registration |
| Magic Link (OTP) | Passwordless login | Sent via Resend SMTP |
| Phone OTP | Mobile-first users | Twilio via Supabase |

### 5.2 Session Architecture

```
Client (Browser)
    │
    │  1. POST /auth/login → credentials
    ▼
Supabase Auth
    │
    │  2. Returns: access_token (JWT, 1h), refresh_token (7d)
    ▼
Next.js Middleware (middleware.ts)
    │
    │  3. Reads session from httpOnly cookies (set by @supabase/ssr)
    │  4. Validates JWT on every request
    │  5. Refreshes token transparently if within 5min of expiry
    ▼
Route Handler / Server Component
    │
    │  6. Creates server-side Supabase client with session
    │  7. All DB queries execute with user's JWT → RLS enforces isolation
```

### 5.3 Authentication Flow — Email Registration

```
1. User submits registration form
      │
      ▼
2. Client calls supabase.auth.signUp({ email, password })
      │
      ▼
3. Supabase sends OTP verification email via Resend
      │
      ▼
4. User clicks link / enters OTP → supabase.auth.verifyOtp()
      │
      ▼
5. Supabase Auth creates entry in auth.users
      │
      ▼
6. Database trigger fires:
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, display_name)
     VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
      │
      ▼
7. profiles row created (1:1 with auth.users)
      │
      ▼
8. access_token + refresh_token returned to client
      │
      ▼
9. Tokens stored in httpOnly cookies by @supabase/ssr
      │
      ▼
10. User redirected to /dashboard
```

### 5.4 OAuth Flow — Google

```
1. User clicks "Continue with Google"
      │
      ▼
2. supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/api/auth/callback' })
      │
      ▼
3. User authenticates with Google
      │
      ▼
4. Google redirects to /api/auth/callback?code=...
      │
      ▼
5. Route Handler: supabase.auth.exchangeCodeForSession(code)
      │
      ▼
6. Session established → redirect to /dashboard
```

### 5.5 Middleware Auth Guard

```
Every Request
      │
      ▼
middleware.ts
      │
      ├── Public paths (/, /login, /register, /api/auth/*)?
      │     └── ALLOW
      │
      └── Protected paths?
            │
            ├── Valid session cookie?
            │     ├── YES → refresh if needed → ALLOW
            │     └── NO  → redirect to /login?redirectTo=<path>
            │
            └── Admin paths (/admin/*)?
                  ├── profile.is_admin = true → ALLOW
                  └── false → 403 Forbidden
```

### 5.6 Role Hierarchy

| Role | Definition | Access Level |
|---|---|---|
| `ANONYMOUS` | Unauthenticated visitor | Public pages, sample Panchanga only |
| `FREE` | Authenticated, free tier | Basic Kundali (1 chart), Today's Panchanga |
| `PRO` | Paid subscriber | Multiple charts, Muhurta, PDF reports |
| `PREMIUM` | Full access | All features, API access, priority compute |
| `ADMIN` | Platform administrator | Admin panel, all data, system config |

---

## 6. API Design

All application API routes are versioned under `/api/v1/`. Route Handlers use Next.js 15 conventions (async `GET`, `POST`, etc.). All responses follow a consistent envelope format.

### 6.1 Response Envelope

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "req_01hx...",
    "computed_at": "2026-06-08T10:30:00Z",
    "cache_hit": true
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "INVALID_BIRTH_DATA",
    "message": "Date of birth cannot be in the future.",
    "field": "date_of_birth"
  }
}
```

### 6.2 Error Code Registry

| Code | HTTP Status | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid session |
| `FORBIDDEN` | 403 | Insufficient subscription tier |
| `INVALID_BIRTH_DATA` | 422 | Birth data validation failed |
| `GEOCODE_FAILED` | 422 | Location could not be resolved |
| `CHART_NOT_FOUND` | 404 | Kundali chart does not exist or is not owned by user |
| `COMPUTATION_ERROR` | 500 | Ephemeris calculation failure |
| `RATE_LIMITED` | 429 | API rate limit exceeded |
| `TIER_LIMIT` | 402 | Feature requires higher subscription tier |

### 6.3 API Endpoints

#### Panchanga

| Method | Endpoint | Description | Auth | Tier |
|---|---|---|---|---|
| GET | `/api/v1/panchanga/daily` | Today's Panchanga for given location | Optional | FREE |
| GET | `/api/v1/panchanga/daily?date=YYYY-MM-DD&lat=&lng=&region=` | Specific date Panchanga | Optional | FREE |
| GET | `/api/v1/panchanga/monthly?month=&year=&lat=&lng=&region=` | Month view (tithi calendar) | Auth | FREE |

**Query Parameters — `/panchanga/daily`:**
```
date     : YYYY-MM-DD (defaults to today)
lat      : Decimal degrees latitude
lng      : Decimal degrees longitude
timezone : IANA timezone identifier (e.g., Asia/Kolkata)
region   : TELUGU | TAMIL | KANNADA | MALAYALAM | GUJARATI | NORTH | MAHARASHTRIAN | BENGALI
ayanamsha: LAHIRI (default) | KP | RAMAN | TRUE_CHITRA
lang     : en | hi | te | ta | kn | ml | gu | mr | bn
```

#### Kundali

| Method | Endpoint | Description | Auth | Tier |
|---|---|---|---|---|
| GET | `/api/v1/kundali` | List user's birth profiles + charts | Auth | FREE |
| POST | `/api/v1/kundali` | Create a new birth profile + compute chart | Auth | FREE (1), PRO (10+) |
| GET | `/api/v1/kundali/[id]` | Get a specific chart | Auth | FREE |
| PUT | `/api/v1/kundali/[id]` | Update settings, recompute | Auth | FREE |
| DELETE | `/api/v1/kundali/[id]` | Delete chart and birth profile | Auth | FREE |
| GET | `/api/v1/kundali/[id]/report` | Generate and return PDF report URL | Auth | PRO |

**POST `/api/v1/kundali` Request Body:**
```json
{
  "label": "My Chart",
  "full_name": "Arjun Sharma",
  "date_of_birth": "1990-04-15",
  "time_of_birth": "06:30:00",
  "time_unknown": false,
  "place_of_birth": "Bangalore, India",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "timezone": "Asia/Kolkata",
  "ayanamsha": "LAHIRI",
  "house_system": "WHOLE_SIGN"
}
```

#### Muhurta

| Method | Endpoint | Description | Auth | Tier |
|---|---|---|---|---|
| GET | `/api/v1/muhurta` | List saved muhurta queries | Auth | PRO |
| POST | `/api/v1/muhurta` | Find auspicious windows | Auth | PRO |
| GET | `/api/v1/muhurta/[eventType]` | Event-specific muhurta rules | Auth | PRO |

**POST `/api/v1/muhurta` Request Body:**
```json
{
  "event_type": "VIVAHA",
  "birth_profile_id": "uuid-of-person",
  "search_start": "2026-11-01",
  "search_end": "2027-02-28",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "timezone": "Asia/Kolkata",
  "constraints": {
    "exclude_weekdays": ["SUN"],
    "preferred_nakshatras": ["Rohini", "Magha", "Uttara Phalguni"],
    "min_score": 70
  }
}
```

#### Matchmaking *(Future)*

| Method | Endpoint | Description | Auth | Tier |
|---|---|---|---|---|
| GET | `/api/v1/matchmaking` | List matchmaking reports | Auth | PREMIUM |
| POST | `/api/v1/matchmaking` | Create compatibility report | Auth | PREMIUM |

#### Numerology *(Future)*

| Method | Endpoint | Description | Auth | Tier |
|---|---|---|---|---|
| POST | `/api/v1/numerology` | Compute numerology report | Auth | PRO |

#### Utility

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/geocode?q=<location>` | Resolve location to lat/lng/timezone | Auth |

### 6.4 Rate Limiting

Rate limits are enforced at the Vercel Edge layer using Vercel KV (Redis) with a sliding window algorithm.

| Tier | Endpoint Group | Limit |
|---|---|---|
| Anonymous | Panchanga | 10 req/hour |
| FREE | All API | 50 req/hour |
| PRO | All API | 500 req/hour |
| PREMIUM | All API | 5,000 req/hour |
| ADMIN | All API | Unlimited |

---

## 7. Panchanga Calculation Architecture

### 7.1 Overview

The Panchanga engine computes the five primary limbs (Pancha + Anga) of the Hindu almanac for any date, geographic location, and regional tradition. It is a pure computation module (`lib/engines/panchanga/`) with no side effects or database dependencies.

### 7.2 The Five Limbs (Panchanga)

| Limb | Sanskrit | Definition |
|---|---|---|
| Tithi | तिथि | Lunar day (30 per lunar month); based on Sun–Moon angular separation |
| Vara | वार | Weekday; determined by sunrise and ruling planet |
| Nakshatra | नक्षत्र | Lunar mansion (27/28); Moon's position in the ecliptic |
| Yoga | योग | Sum of Sun and Moon longitudes ÷ 13°20'; 27 yogas |
| Karana | करण | Half of a Tithi; 11 types (7 movable, 4 fixed) |

### 7.3 Computation Pipeline

```
Input: { date, latitude, longitude, timezone, ayanamsha, region }
        │
        ▼
1. Julian Day Calculation
   Convert local date/time at sunrise to Julian Day (UT)
   Using: JD = date_to_jd(year, month, day) + (UTC_time / 24)
        │
        ▼
2. Ephemeris Query (Swiss Ephemeris via swisseph-adapter.ts)
   Fetch for sunrise moment:
   - Sun longitude (tropical)
   - Moon longitude (tropical)
   - Moon latitude
   - All planet longitudes
        │
        ▼
3. Ayanamsha Application
   Sidereal positions = Tropical positions − Ayanamsha(JD)
   Ayanamsha options: Lahiri (Chitrapaksha), Raman, KP, True Chitrapaksha
        │
        ▼
4. Sunrise/Sunset Calculation
   Using: USNO algorithm with refraction correction
   Inputs: JD, lat, lng, elevation
   Outputs: sunrise_JD, sunset_JD, moonrise_JD, moonset_JD
        │
        ▼
5. Five Limb Calculations (parallel)
   │
   ├── Tithi:     ∆λ = Moon_lng − Sun_lng
   │              Tithi_num = floor(∆λ / 12°) + 1
   │              Tithi_end = time when ∆λ = next multiple of 12°
   │
   ├── Vara:      Derived from weekday at local sunrise
   │              Planetary lord assigned per classical scheme
   │
   ├── Nakshatra: Nakshatra_num = floor(Moon_lng_sid / (360°/27)) + 1
   │              Pada = floor((Moon_lng_sid % 13.333°) / 3.333°) + 1
   │
   ├── Yoga:      Yoga_sum = (Sun_lng_sid + Moon_lng_sid) % 360°
   │              Yoga_num = floor(Yoga_sum / 13.333°) + 1
   │
   └── Karana:    Half-tithi; computed from same ∆λ as Tithi
        │
        ▼
6. Supplementary Computations
   - Rahu Kalam    : 1/8th of day duration; varies by weekday
   - Yamaganda     : 1/8th periods; weekday-dependent
   - Gulika Kalam  : Same basis, different weekday mapping
   - Abhijit       : 48 min window around solar noon
   - Choghadiya    : Day/night divided into 8 parts; each ruled by a planet
   - Planetary Hour: Each hour of day/night ruled cyclically
        │
        ▼
7. Regional Variant Application
   - Apply region-specific naming (regional.ts files)
   - Apply region-specific calendar epoch (Vikram Samvat, Shaka, etc.)
   - Apply regional month names (Chaitra, Vaishakha / Chittirai, Vaikasi...)
   - Apply regional auspicious/inauspicious day overrides
        │
        ▼
8. Output (PanchangaResult)
{
  date, weekday, tithi, nakshatra, yoga, karana,
  rahu_kalam, yamaganda, gulika, abhijit,
  sunrise, sunset, moonrise, moonset,
  choghadiya_day[], choghadiya_night[],
  planetary_hours[],
  samvatsara, month_name, paksha
}
        │
        ▼
9. Cache Storage
   Store in panchanga_cache with 24h expiry
   Key: (date, region, lat_bucket, lng_bucket, ayanamsha)
```

### 7.4 Ephemeris Adapter

The Swiss Ephemeris (swisseph Node.js binding or WASM build) is abstracted behind `swisseph-adapter.ts`. This indirection allows future swap to a pure-JS ephemeris without touching calculation logic.

```
lib/engines/ephemeris/
  ├── index.ts              ← Public interface: getPlanetPositions(jd, bodies[])
  ├── swisseph-adapter.ts   ← Calls swisseph Node module
  └── cache.ts              ← Redis: cache planet positions for JD + body
```

**Cache Strategy:** Planetary positions for a given Julian Day (rounded to 0.001 precision, ~1.44 min) are cached in Vercel KV for 30 days. Ephemeris data is deterministic and time-invariant.

### 7.5 Regional Panchanga Variants

Each regional file exports a `RegionalConfig` implementing:

```typescript
interface RegionalConfig {
  region: string;
  calendarEra: 'VIKRAM_SAMVAT' | 'SHAKA' | 'KALI_YUGA' | 'BANGLA_SAN';
  monthSystem: 'SOLAR' | 'LUNISOLAR';
  monthNames: string[];      // 12 entries, localized
  nakshatra27or28: 27 | 28;  // Abhijit nakshatra inclusion
  rahuKalamOrder: number[];  // Weekday → period index mapping
  yogaKalamOrder: number[];  // Variant Rahu Kalam naming
  specialDays: SpecialDayRule[];
}
```

---

## 8. Kundali Generation Architecture

### 8.1 Overview

The Kundali engine (`lib/engines/kundali/`) computes a complete Vedic birth horoscope: all nine grahas, the Ascendant (Lagna), 12 house cusps, Dasha sequence, divisional charts, yogas, doshas, and planetary strengths.

### 8.2 Computation Pipeline

```
Input: BirthData { dob, tob, lat, lng, timezone, ayanamsha, house_system }
        │
        ▼
1. Birth Moment → Julian Day (UT)
   Convert local birth time to UTC, then to Julian Day
        │
        ▼
2. Obliquity of Ecliptic
   ε = 23.439° − 0.0000004° × (JD − 2451545)
   Required for coordinate transforms
        │
        ▼
3. Planetary Position Fetch (Ephemeris)
   Bodies: SU, MO, MA, ME, JU, VE, SA, RA (mean/true node), KE
   Returns: tropical ecliptic longitude, latitude, distance, speed
        │
        ▼
4. Ayanamsha Subtraction → Sidereal Longitudes
   For each planet: λ_sid = λ_trop − Ayanamsha(JD)
   Retrograde flag: planet.speed < 0
        │
        ▼
5. Ascendant Calculation
   Using RAMC (Right Ascension of Midheaven) + obliquity + latitude
   Lagna = sidereal ecliptic longitude of eastern horizon
        │
        ▼
6. House Cusp Calculation
   Whole Sign: House 1 = Lagna sign; each subsequent house = next sign
   Placidus / Equal: Computed via standard algorithms from RAMC
   Sripati: Bhava Madhya (house midpoints) method
        │
        ▼
7. Sign and Nakshatra Assignment
   For each planet:
   - sign   = floor(λ_sid / 30°) + 1        → 1–12 (Aries–Pisces)
   - degree = λ_sid mod 30°
   - nakshatra = floor(λ_sid / (360°/27)) + 1
   - pada   = floor((λ_sid mod 13.333°) / 3.333°) + 1
        │
        ▼
8. Vimshottari Dasha Calculation
   - Moon's nakshatra at birth → starting Maha Dasha lord
   - Elapsed fraction of nakshatra → starting balance
   - Full 120-year dasha sequence generated (9 lords × allotted years)
   - Antar dashas (sub-periods) computed for all levels (up to Pratyantar)
        │
        ▼
9. Divisional Charts (Vargas)
   For each requested division (D1, D2, D3, D7, D9, D10, D12, D16):
   Apply divisional formula to each planet's longitude
   D9 (Navamsha): 9 divisions per sign; widely used for marriage analysis
        │
        ▼
10. Yoga Detection
    Evaluate rule-based conditions on planet positions:
    - Raja Yogas (Kendra-Kona lords in mutual association)
    - Dhana Yogas (2nd/11th lord combinations)
    - Pancha Mahapurusha Yogas (strong planets in Kendra in own/exaltation)
    Each yoga: { name, description, strength: STRONG | MEDIUM | WEAK, planets[] }
        │
        ▼
11. Dosha Detection
    - Mangal Dosha: Mars in houses 1, 4, 7, 8, 12 (variant rules by region)
    - Kaal Sarpa Dosha: All planets between Rahu and Ketu
    - Pitru Dosha: Afflicted 9th house / Sun conditions
    Each dosha: { name, present: boolean, intensity, remedies[] }
        │
        ▼
12. Shadbala Computation
    Six-fold planetary strength:
    Sthana, Dig, Kala, Cheshta, Naisargika, Drik Bala
    Rupa (numeric strength unit) computed per classical rules
        │
        ▼
13. Persist to Database
    INSERT into kundali_charts (planet_positions JSONB, ...)
    INSERT into dasha_periods (level 1, 2, 3 rows)
    INSERT into divisional_charts (per division)
        │
        ▼
Output: KundaliResult { lagna, planets, houses, dashas, vargas, yogas, doshas, shadbala }
```

### 8.3 Chart SVG Rendering

Three rendering components handle chart styles:

| Style | Component | Tradition |
|---|---|---|
| North Indian | `NorthChart.tsx` | Diamond lattice; signs fixed, planets placed |
| South Indian | `SouthChart.tsx` | Square grid; signs fixed clockwise |
| East Indian | `EastChart.tsx` | Circular / Bengali style |

All chart components receive `KundaliResult` as props and produce pure SVG. No calculation logic exists inside rendering components.

### 8.4 PDF Report Generation

PDF reports are generated by a Supabase Edge Function (`generate-kundali-pdf`):

```
Client requests PDF → /api/v1/kundali/[id]/report
        │
        ▼
Route Handler verifies tier (PRO required)
        │
        ▼
Invokes Supabase Edge Function with kundali data
        │
        ▼
Edge Function renders HTML/CSS report via Puppeteer (headless Chrome)
        │
        ▼
Converts to PDF buffer
        │
        ▼
Uploads to Supabase Storage: kundali-reports/{user_id}/{chart_id}.pdf
        │
        ▼
Signed URL (24h expiry) returned to client
        │
        ▼
pdf_url stored in kundali_charts.pdf_url
```

---

## 9. Muhurta Engine Architecture

### 9.1 Overview

The Muhurta engine identifies astronomically and classically auspicious time windows for specific life events. It is built as a scorer over a time-slot stream, evaluating each slot against a weighted ruleset derived from the Muhurta Chintamani and Brihat Samhita.

### 9.2 Scoring Model

Each candidate time slot is scored on a scale of 0–100 via a weighted sum of contributing factors:

| Factor | Weight | Source |
|---|---|---|
| Tithi quality | 20% | Classical tithi classification |
| Vara suitability | 15% | Weekday–event mapping |
| Nakshatra quality | 20% | Nakshatra–event suitability matrix |
| Yoga quality | 10% | 27 yoga classification (Shubha/Ashubha) |
| Choghadiya | 15% | Day segment auspiciousness |
| Lagna strength | 10% | Ascendant sign + occupying/aspecting planets |
| Tarabala | 5% | Moon nakshatra relative to native's birth nakshatra |
| Chandrabala | 5% | Moon position relative to native's birth Moon sign |

### 9.3 Computation Pipeline

```
Input: MuhurtaQuery { event_type, search_range, location, birth_profile?, constraints }
        │
        ▼
1. Generate Candidate Slots
   Divide search range into 30-minute windows
   Total slots: (days × 48) per search range
        │
        ▼
2. For each slot (parallelizable):
   a. Compute ephemeris for slot midpoint
   b. Derive Panchanga (tithi, vara, nakshatra, yoga)
   c. Compute Lagna for slot moment + location
   d. Apply EventRuleSet (event-specific rules from /events/*.ts)
   e. Calculate composite score via scorer.ts
        │
        ▼
3. Filter Slots
   - Score ≥ min_score (default 65)
   - Apply user constraints (excluded weekdays, preferred nakshatras, etc.)
   - Remove slots during eclipse, Amavasya, Shraadha period if event requires
        │
        ▼
4. Aggregate into Windows
   Merge adjacent high-scoring slots into continuous Muhurta windows
   Each window: { start, end, score, tithi, nakshatra, vara, highlights[] }
        │
        ▼
5. Rank and Limit
   Sort by score descending
   Return top N windows (configurable, default 10)
        │
        ▼
6. Persist result in muhurta_queries.results JSONB
        │
        ▼
Output: MuhurtaResult { windows: MuhurtaWindow[], query_meta }
```

### 9.4 Event Rule Sets

Each event type exports an `EventRuleSet`:

```typescript
interface EventRuleSet {
  eventType: EventType;
  prohibitedTithis: number[];
  prohibitedVaras: Vara[];
  prohibitedNakshatras: string[];
  requiredTithis?: number[];
  preferredNakshatras: string[];
  lagnaRequirements: LagnaRule[];
  specialRules: SpecialRule[];
  scoreModifiers: ScoreModifier[];
}
```

Example — Vivaha (Marriage) rule set prohibits: Tithis 4, 8, 9, 12, 14, 30; Sundays, Tuesdays; Nakshatras Jyeshtha, Moola, Ardra, Bharani; and requires Shubha yogas (Siddhi, Amrita, Mrityu-free).

---

## 10. Future: Matchmaking Architecture

### 10.1 Overview

The Matchmaking module (scheduled for V2 release) performs Ashtakoot Guna Milan (36-point compatibility analysis) between two birth profiles, along with Mangal Dosha comparison, Nadi analysis, and overall compatibility scoring.

### 10.2 Architecture Design (Defined Now)

All database tables, TypeScript interfaces, and API route stubs are defined in the current codebase. The module is gated behind a `FEATURE_FLAG_MATCHMAKING` environment variable set to `false` until release.

### 10.3 Ashtakoot Scoring Model

| Koot (Factor) | Points | Measures |
|---|---|---|
| Varna | 1 | Spiritual compatibility |
| Vashya | 2 | Attraction and dominance |
| Tara | 3 | Birth star compatibility and health |
| Yoni | 4 | Biological and temperamental compatibility |
| Graha Maitri | 5 | Mental compatibility; Moon sign lord friendship |
| Gana | 6 | Temperament: Deva, Manushya, Rakshasa |
| Rashi / Bhakoot | 7 | Emotional and financial compatibility |
| Nadi | 8 | Genetic and health compatibility (most critical) |
| **Total** | **36** | |

### 10.4 Computation Pipeline (Planned)

```
Input: { profile_a_id, profile_b_id, ayanamsha }
        │
        ▼
1. Fetch both KundaliCharts from database
        │
        ▼
2. Extract Moon Nakshatra, Rashi, Lagna for both
        │
        ▼
3. Compute all 8 Koot scores via ashtakoot.ts
        │
        ▼
4. Mangal Dosha cross-check (mangal-dosha-check.ts)
   - Both have Dosha → Cancelled (Dosha Samya)
   - One has Dosha → Flag
        │
        ▼
5. Nadi Exception check
   (Same Nadi may be overridden by certain Nakshatra combinations)
        │
        ▼
6. Aggregate score + compatibility grade
        │
        ▼
7. Generate narrative report (AI-assisted via Claude API)
        │
        ▼
8. Persist to matchmaking_pairs
```

### 10.5 Feature Flag Gates

```typescript
// middleware.ts
if (pathname.startsWith('/matchmaking') && !FEATURE_FLAGS.MATCHMAKING) {
  return NextResponse.redirect('/coming-soon?feature=matchmaking');
}
```

---

## 11. Future: Numerology Architecture

### 11.1 Overview

The Numerology module (scheduled for V2.5) computes key numerological numbers from a person's full name and date of birth, supporting Chaldean, Pythagorean, and Vedic numerology systems.

### 11.2 Supported Systems

| System | Origin | Name Mapping |
|---|---|---|
| Chaldean | Ancient Babylonian | 1–8 mapping (no 9 in name calc) |
| Pythagorean | Greek / Western | 1–9 sequential A–Z mapping |
| Vedic (Sankhya) | Indian | Modified Chaldean with Sanskrit phonetics |

### 11.3 Core Numbers Computed

| Number | Basis | Derived From |
|---|---|---|
| Life Path Number | Date of birth | Sum of DOB digits, reduced to single digit |
| Destiny / Expression | Full name | Sum of all name letter values |
| Soul Urge (Heart's Desire) | Vowels in name | Sum of vowel values |
| Personality Number | Consonants in name | Sum of consonant values |
| Birthday Number | Day of birth | Raw birth day |
| Maturity Number | Life Path + Destiny | Sum of both |

### 11.4 Multi-Script Name Support

A critical requirement: Sanskrit names written in Devanagari, Telugu, Tamil, etc. must be correctly transliterated to phonetic values before numerological mapping. The `vedic.ts` module handles ITRANS-based romanisation with phonetic equivalency rules.

---

## 12. Security Architecture

### 12.1 Defense Layers

```
[Internet]
    │
    ├── Vercel Edge Network
    │     ├── DDoS protection (Vercel Shield)
    │     ├── WAF (rate limiting, geo-blocking)
    │     └── TLS 1.3 termination
    │
    ├── Next.js Middleware
    │     ├── Session validation (Supabase JWT)
    │     ├── Route-level authorization
    │     ├── CSRF protection (SameSite cookie policy)
    │     └── Content Security Policy headers
    │
    ├── API Route Handlers
    │     ├── Input validation (Zod schemas)
    │     ├── Tier-based access control
    │     ├── Rate limiting (Vercel KV)
    │     └── Audit log writes
    │
    └── Supabase (PostgreSQL)
          ├── Row-Level Security on all user tables
          ├── Service role key never exposed to client
          ├── Encrypted connections (TLS)
          └── Encrypted at rest (AES-256)
```

### 12.2 Row-Level Security Policies

RLS policies ensure a user can only access their own data. Key policies:

```sql
-- profiles: Users see only their own row
CREATE POLICY "Own profile only"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- birth_profiles: Users see only their own profiles
CREATE POLICY "Own birth profiles"
  ON public.birth_profiles FOR ALL
  USING (auth.uid() = user_id);

-- kundali_charts: Users see charts belonging to their birth profiles
CREATE POLICY "Own charts"
  ON public.kundali_charts FOR ALL
  USING (
    birth_profile_id IN (
      SELECT id FROM public.birth_profiles WHERE user_id = auth.uid()
    )
  );

-- panchanga_cache: Publicly readable (no PII), write restricted to service role
CREATE POLICY "Panchanga readable by all authenticated"
  ON public.panchanga_cache FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Panchanga write only by service role"
  ON public.panchanga_cache FOR INSERT
  USING (auth.role() = 'service_role');

-- audit_log: Append-only; admins can read
CREATE POLICY "Audit append"
  ON public.audit_log FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Audit read by admin"
  ON public.audit_log FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

### 12.3 Sensitive Data Handling

Birth data (exact date, time, location) is personal and legally sensitive in several jurisdictions.

| Measure | Implementation |
|---|---|
| No PII in logs | Sentry configured to scrub `lat`, `lng`, `date_of_birth`, `time_of_birth` |
| Secure deletion | `DELETE FROM birth_profiles CASCADE` on user account deletion |
| Timezone-only in responses | API never returns raw lat/lng back to client unless it was the requester's input |
| PDF expiry | Signed URLs for reports expire after 24 hours |
| Cookie security | `httpOnly: true`, `secure: true`, `sameSite: 'lax'` on all auth cookies |

### 12.4 API Security

- All API routes require `Authorization` via session cookie (not Bearer token) to prevent XSS-based token theft.
- The Supabase `service_role` key is used exclusively in server-side API route handlers. It is never included in any client bundle.
- Input validation via Zod is applied before any database interaction. Invalid requests are rejected at the boundary with 422 responses.
- All database operations use parameterized queries via the Supabase client. No raw SQL string interpolation exists.

### 12.5 Security Headers

Applied globally via `next.config.ts`:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://[supabase-project].supabase.co
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), camera=(), microphone=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## 13. Deployment Architecture

### 13.1 Environment Tiers

| Environment | Purpose | Trigger |
|---|---|---|
| `development` | Local developer machine | `pnpm dev` |
| `preview` | PR-based preview deployments | Git push to feature branch |
| `staging` | Pre-production validation | Merge to `staging` branch |
| `production` | Live application | Merge to `main` branch |

### 13.2 Infrastructure Topology

```
                    ┌─────────────────────────────┐
                    │         Vercel Edge          │
                    │   (300+ global PoPs)          │
                    │                             │
Users ──────────────│→  Static Assets (CDN)        │
                    │→  Server Components (SSR)    │
                    │→  API Route Handlers         │
                    │→  Middleware (Edge runtime)  │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │         Vercel KV            │
                    │   (Redis / Edge caching)     │
                    │   - Ephemeris cache          │
                    │   - Rate limit counters      │
                    │   - Session metadata         │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │          Supabase            │
                    │                             │
                    │  ┌─────────┐ ┌───────────┐  │
                    │  │ Auth    │ │ PostgreSQL │  │
                    │  │ Service │ │ Database  │  │
                    │  └─────────┘ └───────────┘  │
                    │  ┌─────────┐ ┌───────────┐  │
                    │  │ Storage │ │   Edge    │  │
                    │  │ (S3)    │ │ Functions │  │
                    │  └─────────┘ └───────────┘  │
                    └─────────────────────────────┘
```

### 13.3 CI/CD Pipeline

```
Developer pushes to feature branch
        │
        ▼
GitHub Actions: CI Workflow
  ├── pnpm install --frozen-lockfile
  ├── tsc --noEmit (TypeScript check)
  ├── eslint --max-warnings 0
  ├── jest (unit + integration tests)
  └── playwright (e2e on preview URL)
        │
        ▼
Vercel Preview Deployment (automatic)
  URL: vedrith-<branch>-<hash>.vercel.app
        │
        ▼
Code Review + QA on Preview URL
        │
        ▼
Merge PR to main
        │
        ▼
GitHub Actions: Deploy Workflow
  ├── Run full test suite
  ├── supabase db push --linked (apply migrations)
  └── Vercel Production Deployment
        │
        ▼
Post-deploy: Smoke Tests (Playwright headless)
        │
        ▼
Sentry release tracking + Vercel Analytics baseline
```

### 13.4 Database Migration Strategy

- All schema changes live as numbered SQL files in `supabase/migrations/`.
- Migrations are applied via `supabase db push` in CI before deploying application code.
- Destructive migrations (table drops, column drops) require a two-phase deploy: first deprecate, then remove in the next release.
- RLS policies are part of migration files, not applied ad hoc.

### 13.5 Secrets Management

| Secret | Storage | Access |
|---|---|---|
| `SUPABASE_URL` | Vercel Environment Variables | Runtime (server) |
| `SUPABASE_ANON_KEY` | Vercel Environment Variables | Runtime (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Environment Variables | Runtime (server only) |
| `NEXT_PUBLIC_*` keys | Vercel Environment Variables | Build-time (public) |
| `RESEND_API_KEY` | Supabase Vault + Vercel | Server only |
| Swiss Ephemeris data files | Vercel Build Asset | Build-time inclusion |

Never committed to Git. `.env.local` is listed in `.gitignore`. `.env.example` contains all required variable names with placeholder values.

---

## 14. Multi-Language Architecture

### 14.1 Supported Languages

| Language | Code | Script | Priority |
|---|---|---|---|
| English | `en` | Latin | V1 (launch) |
| Hindi | `hi` | Devanagari | V1 (launch) |
| Telugu | `te` | Telugu | V1 (launch) |
| Tamil | `ta` | Tamil | V1 (launch) |
| Kannada | `kn` | Kannada | V1.5 |
| Malayalam | `ml` | Malayalam | V1.5 |
| Gujarati | `gu` | Gujarati | V2 |
| Marathi | `mr` | Marathi | V2 |
| Bengali | `bn` | Bengali | V2 |

### 14.2 i18n Library

VedRith uses `next-intl` for internationalization, chosen for native App Router support, Server Component compatibility, and type-safe message keys.

### 14.3 URL Strategy

Locale is embedded in the URL path using Next.js's built-in i18n routing:

```
/en/dashboard        → English
/hi/dashboard        → Hindi
/te/panchanga        → Telugu
/ta/kundali/[id]     → Tamil
```

Default locale (`en`) does not require prefix for SEO simplicity (configurable).

### 14.4 Translation Architecture

```
messages/
  en.json       ← Source of truth; all keys defined here
  hi.json
  te.json
  ...

Translation file structure:
{
  "nav": {
    "dashboard": "Dashboard",
    "panchanga": "Panchanga",
    "kundali": "Kundali"
  },
  "panchanga": {
    "tithi": {
      "label": "Tithi",
      "pratipada": "Pratipada",
      "dvitiya": "Dvitiya",
      ...
    },
    "nakshatra": { "ashwini": "Ashwini", ... },
    "yoga": { "vishkambha": "Vishkambha", ... },
    "vara": { "sunday": "Sunday", ... }
  },
  "kundali": { ... },
  "muhurta": { ... },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "save": "Save"
  }
}
```

### 14.5 Astrological Term Localization

Astrological terms (nakshatra names, graha names, tithi names) require careful translation — they are not merely translated but must use the canonical regional name (e.g., "Karthigai" in Tamil vs "Krittika" in Sanskrit/Hindi). This is handled by region-specific name maps in each engine's regional variant files, separate from UI string translations.

### 14.6 Font Strategy

All Indic scripts require specific web fonts served from `/public/fonts/`:

| Script | Font | Format |
|---|---|---|
| Devanagari | Noto Sans Devanagari | WOFF2 |
| Telugu | Noto Sans Telugu | WOFF2 |
| Tamil | Noto Sans Tamil | WOFF2 |
| Kannada | Noto Sans Kannada | WOFF2 |
| Malayalam | Noto Sans Malayalam | WOFF2 |

Fonts are subset to reduce payload; Latin subset is always loaded, Indic subset loaded on locale detection.

### 14.7 Locale Detection

```
1. URL path locale prefix (highest priority)  → /te/panchanga → te
2. User profile preferred_language (if authenticated)
3. Accept-Language header
4. Default: 'en'
```

RTL support is not required for current language set (all listed languages are LTR).

---

## 15. Admin Panel Architecture

### 15.1 Overview

The Admin Panel (`/admin/*`) is a separate route group within the Next.js application, guarded by `is_admin = TRUE` on the `profiles` table. It does not use a separate application — this simplifies deployment while keeping codebase unified.

### 15.2 Access Control

Admin routes are protected by two layers:
- **Middleware** (`middleware.ts`): Checks `profiles.is_admin` from session JWT custom claims.
- **Server Components** and **Route Handlers**: Re-verify `is_admin` from the database on every sensitive operation.

Admin actions use the Supabase `admin` client (`lib/supabase/admin.ts`) which holds the `service_role` key and bypasses RLS. This client is only instantiated in server-only code paths.

### 15.3 Admin Panel Modules

#### Dashboard
- Total users (by tier), new registrations (7d/30d), Kundali charts created, Panchanga requests
- System health: Supabase connection, KV cache hit rate, recent errors (Sentry widget)
- Revenue overview (PRO + PREMIUM subscriber counts)

#### User Management (`/admin/users`)
- Searchable table: user ID, email, display name, tier, join date, last active
- Actions: change subscription tier, reset password (trigger email), deactivate account, view user's charts (read-only)
- Export CSV (filtered results)

#### Content Management (`/admin/content`)
- Manage static astrological content: yoga descriptions, dosha remedies, nakshatra interpretations
- These are stored in a `content_blocks` table (not in this document's primary schema for brevity) and served via the API for rendering in reports
- Rich text editor (TipTap) with multi-language support

#### Calculation Settings (`/admin/ayanamsha`)
- Configure default Ayanamsha per region
- Set Ephemeris version (Swiss Ephemeris data file version in use)
- Preview Panchanga output for a test date/location (sanity check tool)

#### Audit Log Viewer (`/admin/reports`)
- Searchable, filterable audit log table
- Filter by: user, action type, date range, resource
- Export for compliance purposes

#### Feature Flags (`/admin/flags`)
- Toggle `FEATURE_FLAG_MATCHMAKING`, `FEATURE_FLAG_NUMEROLOGY`, etc.
- Stored in a `feature_flags` table, read at startup and cached in Vercel KV

### 15.4 Admin Data Flow

```
Admin user action (e.g., change user tier)
        │
        ▼
Admin Route Handler (/api/v1/admin/users/[id])
        │
        ▼
Re-verify is_admin from Supabase (no caching)
        │
        ▼
Execute via service_role client (bypasses RLS)
        │
        ▼
Write to audit_log with action metadata
        │
        ▼
Return result to Admin Panel UI
```

---

## 16. Architecture Decision Log

Key decisions and the rationale behind them.

| # | Decision | Alternative Considered | Rationale |
|---|---|---|---|
| 1 | App Router (Next.js 15) | Pages Router | Server Components eliminate waterfall data fetching; streaming SSR improves TTFB for heavy computation results |
| 2 | Supabase over Firebase | Firebase | PostgreSQL (JSONB, RLS, full SQL) is essential for complex astrological relational data; Supabase provides Postgres-native experience |
| 3 | Swiss Ephemeris | Custom JS ephemeris | Swiss Ephemeris has sub-arc-second accuracy validated by astronomers; no pure-JS alternative matches its precision for dates pre-1800 and post-2400 |
| 4 | Whole Sign House System as default | Placidus | Traditional Vedic astrology predominantly uses Whole Sign (Shri Pati is the exception); can be changed per user preference |
| 5 | Lahiri Ayanamsha as default | KP, Raman | Lahiri (Chitrapaksha) is the Government of India standard and most widely used in practice |
| 6 | Panchanga cache with lat/lng bucketing | Per-user caching | Panchanga varies by geography but not by user identity; shared cache reduces ephemeris calls by ~95% |
| 7 | JSONB for planet positions | Separate graha table | Planet positions are always read and written together; JSONB avoids 9+ joins per chart query |
| 8 | next-intl over react-i18next | react-i18next | next-intl has first-class App Router and Server Component support; avoids client-side hydration mismatch for translated content |
| 9 | PDF generation via Supabase Edge Function | Client-side PDF (jsPDF) | Server-side rendering ensures consistent, print-quality charts across all devices; avoids shipping heavy Puppeteer to client bundle |
| 10 | Matchmaking/Numerology as feature-flagged modules | Separate microservices | Unified deployment reduces operational overhead at current scale; module isolation enforced via TypeScript interface boundaries |

---

*End of Document*

**VedRith Technical Architecture Document — v1.0.0**
*For internal use only. Do not distribute.*
