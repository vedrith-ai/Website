import type { NextConfig } from 'next'

// Stamp every build with a unique ID so the auto-updater can detect deployments.
// On Vercel this is the VERCEL_DEPLOYMENT_ID; locally it falls back to timestamp.
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

  // Allow Vercel to serve the service worker with correct headers
  async headers() {
    return [
      // Service Worker — must be served with no-cache so updates propagate
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
      // PWA icons — long cache
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // All other routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), camera=(), microphone=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              // Nominatim geocoding + Google Fonts
              "connect-src 'self' https://vedrith.sharvasit.in https://*.vedrith.com https://nominatim.openstreetmap.org https://fonts.googleapis.com https://fonts.gstatic.com",
              "worker-src 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
