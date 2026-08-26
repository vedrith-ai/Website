# VedRith V1 Security Dependency Update

This release pins Next.js to **15.5.24**.

Next.js 15.5.24 is the patched Maintenance-LTS release for the August 2026 critical security release.

Before committing this release to GitHub, run:

```bash
npm install
npm ci
npm run lint
npm test
npm run build
```

The repository intentionally does not include the previous package-lock.json because it pinned vulnerable Next.js 15.1.0. `npm install` must generate a fresh lockfile for Next.js 15.5.24 and that generated package-lock.json should be committed before production deployment.
