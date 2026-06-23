import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        // Disallow internal Next.js API routes and static build files
        disallow: ['/_next/', '/api/'],
      },
    ],
    sitemap:   `${SITE.url}/sitemap.xml`,
    host:      SITE.url,
  }
}
