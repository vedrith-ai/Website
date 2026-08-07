# VedRith — Continuation Prompt for Next Chat Session

## PROJECT OVERVIEW
VedRith is a production-grade Vedic Panchanga and Kundali web app at vedrith.sharvasit.in.
Stack: Next.js 15, TypeScript, Tailwind CSS, Vercel deployment.

## NON-NEGOTIABLE CONSTRAINTS
- NO Swiss Ephemeris anywhere in source code
- NO hardcoded date tables
- NO interpretive/predictive content in engine files
- NO duplication of astronomical calculations
- OpenRouter free models ONLY for any AI: llama-3.3-8b-instruct:free → gemma-3-9b-it:free → mistral-7b-instruct:free → qwen3-8b:free → deepseek-r1:free
- Zero TypeScript errors required for every deliverable
- All browser APIs inside useEffect or callbacks (no hydration issues)

## PROTECTED ENGINE FILES — NEVER MODIFY
Verify MD5 checksums before every change:
- lib/engines/panchanga/tithi.ts
- lib/engines/panchanga/nakshatra.ts
- lib/engines/panchanga/yoga.ts
- lib/engines/panchanga/karana.ts
- lib/engines/panchanga/rahu-kalam.ts
- lib/engines/ephemeris/julian-day.ts
- lib/engines/ephemeris/ayanamsha.ts
- lib/engines/ephemeris/sunrise.ts

## COMPLETED MILESTONES (all QA-verified)
1. Panchanga Traditional Knowledge Engine V1.1
   - Dynamic Abhijit Muhurta, Durmuhurta, Varjyam engines
   - Full metadata for 16 Tithis, 27 Nakshatras, 7 Varas
   - lib/engines/panchanga/durmuhurta.ts
   - lib/engines/panchanga/recommendations.ts
   - lib/engines/festivals/index.ts
   - lib/knowledge/tithi-knowledge.ts, nakshatra-knowledge.ts, vara-knowledge.ts

2. Traditional Rules Engine V1
   - 30 VedicRule objects across 16 activity categories
   - Indexed evaluation engine with LRU caching
   - OpenRouter client with 5-model free fallback chain
   - lib/rules/types.ts, engine.ts, openrouter.ts, explanation.ts
   - lib/rules/database/activity-rules.ts (30 rules)
   - lib/rules/regional.ts, admin/types.ts
   - APIs: /api/v1/rules/activity|tithi|nakshatra|yoga|karana|vara|festival

3. Platform Experience V1 (PWA)
   - public/manifest.webmanifest, public/sw.js
   - lib/storage/preferences.ts, lib/location/index.ts
   - components/pwa/InstallPrompt.tsx, ServiceWorkerRegistration.tsx
   - components/home/HomeDashboard.tsx, TodayPanchanga.tsx, LocationSetup.tsx

4. Platform Completion V1.1
   - lib/i18n/types.ts — 12-language architecture
   - lib/i18n/translations/ui.ts — 95 UI strings EN+KN
   - lib/i18n/index.tsx — I18nProvider, useTranslation, LanguageSwitcher
   - lib/i18n/kundali-names.ts — nakshatraLabel(), rashiShort(), planetShort()
   - components/error/ErrorBoundary.tsx
   - components/panchanga/NextChangeCountdown.tsx
   - KundaliResult.tsx — rich names "Rohini (4)", language switcher EN↔KN
   - lib/future/types.ts — future module interfaces

5. Platform Completion V1.2 (IN PROGRESS — partial)
   - components/search/GlobalSearch.tsx — fuzzy search modal, ⌘K shortcut
   - components/knowledge/KnowledgePanel.tsx — TermLink + side panel for Tithi/Nakshatra/Vara
   - components/ui/CrossLinks.tsx — smart cross-linking between pages
   - lib/engines/kundali-chart/dignity.ts — Exalted/Debilitated/OwnSign/Combust calculations
   - lib/storage/history.ts — recent Kundalis, searches, favorite locations

## REMAINING WORK FOR V1.2
These are the NEXT tasks to implement:

### 1. Add SearchTrigger to Header
File: components/layout/Header.tsx
Add: import { SearchTrigger } from '@/components/search/GlobalSearch'
Place SearchTrigger inside the header nav, before the language switcher.

### 2. Wire TermLink into PanchangaResult
File: components/panchanga/PanchangaResult.tsx
Import: import { TermLink } from '@/components/knowledge/KnowledgePanel'
Wrap tithi name: <TermLink element="tithi" termKey={tithi.name}>{tithi.displayName}</TermLink>
Wrap nakshatra name: <TermLink element="nakshatra" termKey={nakshatra.name}>{nakshatra.displayName}</TermLink>
Wrap vara name: <TermLink element="vara" termKey={vara.name}>{vara.displayName}</TermLink>

### 3. Wire DignityBadge into KundaliResult
File: components/kundali/KundaliResult.tsx
Import: import { getAllDignities, dignityBadgeClass } from '@/lib/engines/kundali-chart/dignity'
In planetary table: compute dignities from planets data, show badge next to each planet row.
Badge: <span className={`text-[9px] px-1.5 py-0.5 border rounded ${dignityBadgeClass(dignity.dignity)}`}>{dignity.label}</span>

### 4. Add CrossLinks to pages
File: app/panchanga/page.tsx — add <CrossLinks context="panchanga" /> at bottom
File: app/kundali/page.tsx — add <CrossLinks context="kundali" /> at bottom
Import: import { CrossLinks } from '@/components/ui/CrossLinks'

### 5. Wire saveRecentKundali in Kundali flow
File: app/kundali/page.tsx or wherever KundaliResult is shown after generation
Import: import { saveRecentKundali } from '@/lib/storage/history'
Call after successful generation with the chart data.

### 6. Create PersonalDashboard component
File: components/dashboard/PersonalDashboard.tsx (NEW)
Uses: getDashboardSummary() from lib/storage/history.ts
Shows: recent Kundalis (clickable to re-open), recent searches, favorite locations
Client component with 'use client' directive.

### 7. Add PersonalDashboard to home page
File: app/page.tsx
Add <PersonalDashboard /> in <HomeDashboard /> or as a separate section.

### 8. Final QA gate
- npx tsc --noEmit → ZERO errors
- Scan for Swiss Ephemeris references
- Verify protected file MD5s unchanged
- Verify all browser APIs inside useEffect
- Package final zip: vedrith-platform-v1.2-qa-verified.zip

## KEY ARCHITECTURE PATTERNS
- Every new page component: check for 'use client' if it uses hooks/browser APIs
- Every new knowledge display: import from lib/knowledge/ (never duplicate)
- Every new calculation: check lib/engines/ first (never recalculate what exists)
- Every new string: add to lib/i18n/translations/ui.ts with en + kn keys
- Every API route: return { success, data, meta } shape
- Test imports with: import from '@/lib/...' (tsconfig paths alias)

## IMPORTANT FILES STRUCTURE
app/
  layout.tsx          — Root layout with I18nProvider, PWA meta, SW registration
  page.tsx            — Home page: Hero + HomeDashboard + Features + ...
  panchanga/page.tsx  — Panchanga calculator page
  kundali/page.tsx    — Kundali generator page
  offline/page.tsx    — Offline fallback
  api/v1/
    panchanga/daily/route.ts
    kundali/generate/route.ts, [id]/route.ts
    rules/activity|tithi|nakshatra|yoga|karana|vara|festival/route.ts

lib/
  engines/
    panchanga/      — Core engine (PROTECTED — do not modify)
    ephemeris/      — Astronomy (PROTECTED — do not modify)
    kundali/        — Kundali calculation engine
    kundali-chart/  — Chart rendering + dignity calculations
    festivals/      — Rule-based festival generation
  knowledge/        — Tithi, Nakshatra, Vara knowledge bases
  rules/            — Traditional Rules Engine V1
  i18n/             — Multilingual system (EN+KN implemented)
  storage/          — localStorage preferences, history, PWA state
  location/         — GPS + Nominatim geocoding
  search/           — Global fuzzy search
  future/           — Future module interfaces (types only)

components/
  layout/           — Header, Footer
  sections/         — HeroSection, FeaturesSection, etc.
  panchanga/        — PanchangaResult, NextChangeCountdown
  kundali/          — KundaliResult, SouthIndianChart, NorthIndianChart
  knowledge/        — KnowledgePanel, TermLink
  search/           — GlobalSearch, SearchTrigger
  home/             — HomeDashboard, TodayPanchanga, LocationSetup
  pwa/              — InstallPrompt, ServiceWorkerRegistration
  error/            — ErrorBoundary
  ui/               — CrossLinks, Breadcrumb
  dashboard/        — PersonalDashboard (TO CREATE)
