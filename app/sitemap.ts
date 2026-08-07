import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE.url,                 lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE.url}/panchanga`,  lastModified: now, changeFrequency: 'always',  priority: 0.9 },
    { url: `${SITE.url}/kundali`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/offline`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.1 },
  ]
}
