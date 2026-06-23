import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // SAMEORIGIN (not DENY) allows Vercel's deployment preview iframe to load
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 'unsafe-eval' required by Next.js 15 runtime in production
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              // next/font self-hosts Google Fonts — 'self' is correct here
              "font-src 'self'",
              // Allow same-origin, future API subdomain, and Nominatim geocoding (PanchangaForm)
              "connect-src 'self' https://*.vedrith.com https://nominatim.openstreetmap.org",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
