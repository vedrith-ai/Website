import type { Metadata } from 'next'
import Link               from 'next/link'
import { SITE }           from '@/lib/constants'
import PanchangaClientPage from './PanchangaClientPage'
import { CrossLinks }     from '@/components/ui/CrossLinks'

export const metadata: Metadata = {
  title:       `Panchanga — Daily Vedic Calendar | ${SITE.name}`,
  description: 'Daily Panchanga for any Indian city. Tithi, Nakshatra, Yoga, Karana, Vara, Rahu Kalam, Abhijit Muhurta, festivals and auspicious timings.',
  alternates:  { canonical: `${SITE.url}/panchanga` },
  keywords: [
    'Panchanga today', 'Daily Panchanga', 'Kannada Panchanga', 'Vedic calendar',
    'Nakshatra today', 'Tithi today', 'Rahu Kalam', 'Abhijit Muhurta',
    'Hindu calendar', 'ಪಂಚಾಂಗ', 'ಇಂದಿನ ಪಂಚಾಂಗ',
  ],
  openGraph: {
    type:        'website',
    url:         `${SITE.url}/panchanga`,
    title:       `Panchanga — Daily Vedic Calendar | ${SITE.name}`,
    description: 'Daily Tithi, Nakshatra, Yoga, Karana & Vara for any Indian city.',
    images:      [{ url: '/images/logo-full.png', width: 1080, height: 1080, alt: 'VedRith Panchanga' }],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type':    'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',      item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Panchanga', item: `${SITE.url}/panchanga` },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type':    'FAQPage',
  mainEntity: [
    {
      '@type':        'Question',
      name:           'What is Panchanga?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:    'Panchanga is the traditional Hindu almanac covering five key elements: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (luni-solar combination), Karana (half-day period), and Vara (weekday). VedRith computes these with astronomical-grade precision.',
      },
    },
    {
      '@type':        'Question',
      name:           'Is VedRith Panchanga free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:    'Yes. VedRith Panchanga is completely free for everyone — no account or login required.',
      },
    },
  ],
}

export default function PanchangaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 pt-4 pb-0">
        <ol className="flex items-center gap-2 text-xs text-navy-600/50 font-sans">
          <li><Link href="/" className="hover:text-gold-600 transition-colors">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-navy-800" aria-current="page">Panchanga</li>
        </ol>
      </nav>

      <PanchangaClientPage />

      <CrossLinks />
    </>
  )
}
