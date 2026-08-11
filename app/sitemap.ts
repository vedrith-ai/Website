import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  return [
    // ── Core pages ──────────────────────────────────────────────────────────
    {
      url:              SITE.url,
      lastModified:     now,
      changeFrequency:  'daily',
      priority:         1.0,
    },
    {
      url:              `${SITE.url}/panchanga`,
      lastModified:     now,
      changeFrequency:  'daily',
      priority:         0.95,
    },
    {
      url:              `${SITE.url}/kundali`,
      lastModified:     now,
      changeFrequency:  'weekly',
      priority:         0.9,
    },
    // ── Legal & Company ──────────────────────────────────────────────────────
    {
      url:              `${SITE.url}/privacy`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.3,
    },
    {
      url:              `${SITE.url}/terms`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         0.3,
    },
    // ── Offline fallback (not indexed) ───────────────────────────────────────
    {
      url:              `${SITE.url}/offline`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.1,
    },
  ]
}
