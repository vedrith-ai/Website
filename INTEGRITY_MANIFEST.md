# VedRith V1 — Final Deployment Candidate

## Release
- Version: 1.0.0
- Product: VedRith
- Production domain: https://vedrith.sharvasit.in
- Scope: V1 only; future roadmap modules are not represented as live features.

## V1 live capabilities
- Location-aware daily Panchanga
- Rich Panchanga V1.1 calculations and traditional knowledge presentation
- English and Kannada
- Full Kundali generation with Supabase persistence
- North Indian and South Indian Kundali charts
- Kundali JPG export
- Traditional Nakshatra/Pada-based name-starting-sound guidance
- Daily Panchanga JPG/share card in four aspect ratios
- Core Knowledge pages: Tithi, Yoga, Karana, Vara, Nakshatra
- Search, Settings, Contact, About, Privacy
- PWA install prompt, Continue-in-Browser option, service-worker registration and update notification
- Protected admin and event publishing infrastructure with HttpOnly admin session cookie

## Intentionally future/not-live in V1
- Advanced Dasha/forecasting
- Dosha/remedies engine
- Temple directory
- full devotional library
- family dashboard
- full Muhurta engine
- monetization
- additional Indian languages beyond English/Kannada

## Security
- Next.js pinned to 15.5.24.
- Admin session is HttpOnly/Secure/SameSite=Strict in production.
- No admin token is kept in browser sessionStorage.
- Event publish endpoint requires either the configured event secret or a verified admin session.
- No production secrets are committed.

## Static QA completed
- ZIP integrity verified.
- No node_modules/.next/.git/.vercel/build-info artifacts.
- No unrelated server/ project contamination.
- No PageTemplate-backed production routes.
- No production window.print() implementation.
- No missing internal TypeScript/TSX imports found by static resolver scan.
- Full Kundali engine/chart/repository files present.
- Rich Panchanga engine and daily API present.
- PWA registration and runtime prompts present.
- Core knowledge route placeholders removed for Tithi/Yoga/Karana/Vara.

## Required final environment verification
This archive intentionally does not contain a generated package-lock.json because the previous lockfile pinned an outdated Next.js version and the current runtime could not reach the npm registry to regenerate it.

In the actual GitHub/Vercel build environment run:

```bash
npm install
npm ci
npm run lint
npm test
npm run build
```

After `npm install`, commit the generated `package-lock.json`. `npm ci` must then succeed from that lockfile.

## Live QA checklist
Verify after deployment:
1. Home loads with live location-aware Panchanga.
2. Device location permission works; selected manual location is remembered.
3. Panchanga page calculates selected date/location correctly.
4. Kundali generates, persists and opens `/kundali/[id]`.
5. North/South charts render.
6. Kundali JPG downloads on desktop and mobile.
7. Panchanga JPG downloads on all four formats.
8. English/Kannada switching persists after reload.
9. PWA install prompt and Continue in Browser both work.
10. PWA update is detected after a new deployment.
11. Admin login/logout works with HttpOnly cookie.
12. Event publish and admin notify reject unauthenticated requests.
13. Contact works with production Supabase configuration.
14. Mobile navigation and all primary routes work.
