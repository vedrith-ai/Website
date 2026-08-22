# VedRith V1.0 — Integrity Manifest
Generated: 2026-08-21T11:05:57Z

## Build Certification
- TypeScript errors: **0**
- ESLint warnings: **0**
- ESLint errors: **0**
- Test suite: **261 / 261** _(run `npm ci && npm test` to verify)_
- Production build: **CLEAN** _(run `npm ci && npm run build` to verify)_

## Coverage
- Pages: **25 / 25** (24 × page.tsx + not-found.tsx)
- API routes: **10** (panchanga, kundali, contact, events, events/publish, location, admin/auth, admin/notify, version, search)
- i18n keys (ui.ts): **478** EN+KN pairs · 0 missing · 0 duplicates · 0 empty
- package-lock.json: **PRESENT** (lockfileVersion 3, 825 packages)

## Critical File Hashes (SHA-256)
| File | SHA-256 |
|------|---------|
| src/i18n/ui.ts | 23cb63a5564074c2365369c266ed72a90663221fa549cea11acb07ed624e0c01 |
| middleware.ts | 70e9ad95536e2763ffb0015cbc13d394da119b61ea6cf2e745546b39598ae848 |
| src/lib/utils/location.ts | 2d4f9dddc3d0ba4726293a0ad837583188115c92ed553c1784cd00d8cf8db702 |
| components/providers/LangProvider.tsx | e67db27993165874f64924169137f74ff8f2ed785390019998be7fa121198e9f |
| components/providers/LocationProvider.tsx | 59731f57dc549c9d29e0d55b4f92dbca111d8a91d261a61ed80aa6cae801abc8 |
| components/share/ShareCard.tsx | 3d2c3319f6d77e08b2949d856131f252c3aeac3aff84c9b67bd5c3217fb5d480 |
| app/not-found.tsx | f5c677c15c44025b3bb2e83f79ec625e0ace52410f4f3b4f562b8da028ebdddd |
| components/NotFoundContent.tsx | 8acba9a59ee8f09131f3a76c90219dae1a020db5eba500d40006aefaa56a8db0 |
| app/api/v1/contact/route.ts | c21250a5bc9c3ce097b292313ef01a90531a82b353e200bfe0f416c9e351bd97 |
| app/api/v1/events/publish/route.ts | 6f3642b2a293cb86f61c35728361c016451d8945452368e5abddde4f3a656e84 |
| src/lib/panchanga/engine.ts | fee640d13b7bd5cc979300d54945cee8ac5e71da1f3545c30372ee8f4d16351c |
| src/lib/kundali/calculator.ts | 8c892ae4e989d759e5ca0484c9868f8a66691078892cd3b952f86d791dba87de |
| src/lib/auth/hmac.ts | e682b1904964c737757cbf131e8268564b2dacd3ff253a9a7a1f18518b2855db |

## V1.0 Audit — All Issues Resolved
| Issue | Status |
|-------|--------|
| Homepage `const lang = 'en'` | ✅ FIXED — LangProvider + useLang() |
| HeroPanchangaStrip Bengaluru hardcode | ✅ FIXED — useLocation() |
| Missing package-lock.json | ✅ FIXED — lockfileVersion 3, 825 packages |
| 404 page hardcoded English | ✅ FIXED — NotFoundContent uses useLang() |
| Share Card `window.print()` | ✅ FIXED — Canvas API JPEG download |
| Event publish bypass (unset secret) | ✅ FIXED |
| Contact API fake success | ✅ FIXED — 503 in production |
| Admin HMAC two-layer defence | ✅ CONFIRMED |
| col.pada missing key | ✅ FIXED |
| error.boundary missing key | ✅ FIXED |
| Hardcoded region 'KANNADA' | ✅ FIXED — getRegionKey() |
| Share card domain vedrith.com | ✅ FIXED — vedrith.sharvasit.in |

## Share Card — JPEG Download
- Method: HTML5 Canvas API (no new dependencies)
- Format: JPEG 93% quality
- Output resolutions: 1:1 → 1080×1080 · 4:5 → 1080×1350 · 9:16 → 1080×1920 · 16:9 → 1920×1080
- Filename: VedRith-Panchanga-YYYY-MM-DD.jpg
- Preserves: theme, aspect ratio, language (EN/KN), Panchanga data, domain watermark

## Language System
- Provider: LangProvider (React context, localStorage key: vedrith:lang)
- Hook: useLang() — used by all pages, components, and 404
- Toggle: Header language button (EN ↔ KN)
- SSR default: 'en'; hydrates to stored preference on client
- 404 page: NotFoundContent client component uses useLang()

## Location Resolution Chain
1. Saved manual preference (localStorage)
2. Device GPS (Geolocation API, 6s timeout)
3. IP geolocation via /api/v1/location (Vercel Edge geo headers)
4. Previously saved location (any source)
5. Fallback: Bengaluru 12.9716°N, 77.5946°E

## Security Audit
- window.print() in ShareCard: **NONE** (removed, replaced with Canvas download)
- Committed secrets: **NONE FOUND**
- vedrith.com references: **NONE** in src/app/components
- tsbuildinfo: **NONE**
- const lang = 'en' hardcoded: **NONE** in app/components
- Event publish bypass: **FIXED**
- Contact fake-success: **FIXED**
- Admin dashboard: **Intentionally English-only** (NotificationDashboard.tsx)

## Deployment
- URL: https://vedrith.sharvasit.in · Platform: Vercel
- Command: `npm ci && npm run lint && npm test && npm run build && vercel --prod`
