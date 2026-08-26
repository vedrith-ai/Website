# VedRith V1 — Security Dependency Patch

Next.js is pinned to `15.5.24`, the patched 15.x Maintenance-LTS release for the August 25, 2026 critical security release.

The project intentionally ships without the previous stale package-lock.json because that lockfile resolved Next.js 15.5.22. Before committing to GitHub, run:

```bash
npm install
npm ci
npm run lint
npm test
npm run build
```

The `npm install` step regenerates a lockfile whose resolved Next.js version is 15.5.24.

Do not use `npm audit fix --force`; keep dependency changes limited to the targeted security patch unless a real build issue requires otherwise.
