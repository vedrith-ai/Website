import type { Metadata }    from 'next'
import Link                 from 'next/link'
import { SITE }             from '@/lib/constants'
import { CrossLinks }       from '@/components/ui/CrossLinks'
import KundaliClientPage    from './KundaliClientPage'

export const metadata: Metadata = {
  title:       `Kundali — Free Vedic Birth Chart | ${SITE.name}`,
  description: 'Generate your Vedic birth chart (Kundali) for free. Planetary positions, house placements, Lagna, Rashi, Nakshatra — in South and North Indian styles.',
  alternates:  { canonical: `${SITE.url}/kundali` },
  keywords: [
    'Free Kundali', 'Vedic birth chart', 'Janam Kundali', 'Kundali online',
    'Planetary positions', 'Vimshottari Dasha', 'South Indian chart', 'North Indian chart',
    'ಕುಂಡಲಿ', 'ಜನ್ಮ ಕುಂಡಲಿ',
  ],
  openGraph: {
    type:        'website',
    url:         `${SITE.url}/kundali`,
    title:       `Kundali — Free Vedic Birth Chart | ${SITE.name}`,
    description: 'Complete Vedic birth chart with planetary positions, house placements & Dasha — free.',
    images:      [{ url: '/images/logo-full.png', width: 1080, height: 1080, alt: 'VedRith Kundali' }],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type':    'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',    item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Kundali', item: `${SITE.url}/kundali` },
  ],
}

export default function KundaliPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 pt-4 pb-0">
        <ol className="flex items-center gap-2 text-xs text-navy-600/50 font-sans">
          <li><Link href="/" className="hover:text-gold-600 transition-colors">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-navy-800" aria-current="page">Kundali</li>
        </ol>
      </nav>

      <KundaliClientPage />

      <CrossLinks />
    </>
  )
}
