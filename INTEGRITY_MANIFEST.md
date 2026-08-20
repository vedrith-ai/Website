# VedRith V1.0 — Integrity Manifest
Generated: 2026-08-20T01:18:32Z

## Build Certification
- TypeScript errors: **0**
- ESLint errors: **0**
- Test suite: **261 / 261 PASSED**
- Production build: **CLEAN EXIT 0** _(run `npm ci && npm run build` to verify)_

## Coverage
- Pages: **25 / 25** (24 × page.tsx + not-found.tsx)
- API routes: **10** (panchanga, kundali, contact, events, events/publish, location, admin/auth, admin/notify, version, search)
- i18n key definitions (ui.ts): **478** (EN + KN pairs)
- Missing EN keys: **0** · Missing KN keys: **0** · Duplicate keys: **0**

## Dependency Lockfile
- package-lock.json: **PRESENT** (lockfileVersion 3, 825 packages)
- Reproducible install: `npm ci`

## Critical File Hashes (SHA-256)
| File | SHA-256 |
|------|---------|
| src/i18n/ui.ts | 23cb63a5564074c2365369c266ed72a90663221fa549cea11acb07ed624e0c01 |
| middleware.ts | 70e9ad95536e2763ffb0015cbc13d394da119b61ea6cf2e745546b39598ae848 |
| src/lib/utils/location.ts | 2d4f9dddc3d0ba4726293a0ad837583188115c92ed553c1784cd00d8cf8db702 |
| components/providers/LangProvider.tsx | e67db27993165874f64924169137f74ff8f2ed785390019998be7fa121198e9f |
| components/providers/LocationProvider.tsx | 59731f57dc549c9d29e0d55b4f92dbca111d8a91d261a61ed80aa6cae801abc8 |
| app/api/v1/contact/route.ts | c21250a5bc9c3ce097b292313ef01a90531a82b353e200bfe0f416c9e351bd97 |
| app/api/v1/events/publish/route.ts | 6f3642b2a293cb86f61c35728361c016451d8945452368e5abddde4f3a656e84 |
| app/api/v1/admin/auth/route.ts | 6345212bcafaff12acbddf9fe9498f3c29cab4507fc3ea1b1f99ef6d29e5ebff |
| src/lib/panchanga/engine.ts | faf2229df800747e73d38bbd8ab677d8cdc8f2408110250d18bf55f417caa759 |
| src/lib/kundali/calculator.ts | 0f913c7bb08e2ab513eabddb402e09a2ee95005e493c761a0c6186b43eb26b33 |
| src/lib/auth/hmac.ts | e682b1904964c737757cbf131e8268564b2dacd3ff253a9a7a1f18518b2855db |

## Audit Fixes Applied (V1.0-final)
| Issue | Fix |
|-------|-----|
| Hardcoded `const lang = 'en'` on homepage | LangProvider context; all pages use `useLang()` |
| Hardcoded Bengaluru in HeroPanchangaStrip | Uses `useLocation()` from LocationProvider |
| No location detection | GPS → /api/v1/location (Vercel geo) → saved → fallback |
| Missing package-lock.json | Generated via `npm install --package-lock-only` |
| Event publish bypass (unset secret) | FIXED in publish/route.ts |
| Contact API fake success | FIXED — 503 in production |
| Admin HMAC two-layer defence | CONFIRMED |
| col.pada missing key | FIXED in ui.ts |
| error.boundary missing key | FIXED in ui.ts |
| Hardcoded region 'KANNADA' | FIXED — getRegionKey() throughout |
| Share card domain vedrith.com | FIXED — vedrith.sharvasit.in |

## Location Resolution Chain
1. Saved manual preference (localStorage)
2. Device GPS (Geolocation API, 6s timeout)
3. IP geolocation via `/api/v1/location` (Vercel Edge geo headers, no third party)
4. Previously saved location (any source)
5. Fallback: Bengaluru 12.9716°N, 77.5946°E

## Language System
- Provider: LangProvider (React context, localStorage-persisted)
- Hook: useLang() — used by all pages and components
- Toggle: Header component language button (EN ↔ KN)
- SSR: Defaults to 'en'; hydrates from localStorage on client

## Security Audit
- Committed secrets: **NONE FOUND**
- Event publish bypass: **FIXED**
- Contact fake-success: **FIXED**
- Admin HMAC: **CONFIRMED** (HMAC-SHA-256, timingSafeEqual, 8h TTL)
- Production domain: **vedrith.sharvasit.in** exclusively
- Admin dashboard: **Intentionally English-only** (NotificationDashboard.tsx)

## Deployment
- URL: https://vedrith.sharvasit.in · Platform: Vercel
- Command: `npm ci && npm run lint && npm test && npm run build && vercel --prod`
