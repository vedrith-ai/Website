import type { NextConfig } from 'next'

// Stamp every build with a unique ID so the auto-updater can detect deployments.
const BUILD_ID = process.env.VERCEL_DEPLOYMENT_ID ?? `local-${Date.now()}`

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  compress: true,
  poweredByHeader: false,

  // ── Security: disable source maps in production ───────────────────────────
  productionBrowserSourceMaps: false,

  // ── Webpack: minify and obfuscate in production ───────────────────────────
  webpack: (config, { dev }) => {
    if (!dev) {
      // Ensure terser removes comments and mangles names
      if (config.optimization) {
        config.optimization.minimize = true
      }
    }
    return config
  },

  async headers() {
    return [
      // Service Worker
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      // PWA manifest
      {
        source: '/manifest.webmanifest',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
      // PWA icons
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // All routes — security headers to prevent source extraction
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), camera=(), microphone=()' },
          // Prevent embedding of source in DevTools inspector
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          // HSTS — only activate on live HTTPS domain
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://vedrith.sharvasit.in https://*.vedrith.com https://nominatim.openstreetmap.org https://fonts.googleapis.com https://fonts.gstatic.com",
              "worker-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
