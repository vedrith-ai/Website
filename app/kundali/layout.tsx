import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kundali — Vedic Birth Chart',
  description: 'Generate your complete Vedic birth chart (Kundali) — Lagna, all 9 planets, 12 houses, Nakshatra, Yogas, in South and North Indian styles.',
  alternates: { canonical: '/kundali' },
  openGraph: {
    title: 'VedRith Kundali — Vedic Birth Chart Generator',
    description: 'Free Vedic birth chart with planetary positions, house placements, and traditional Kannada Jyotisha analysis.',
    url: '/kundali',
  },
}

export default function KundaliLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
