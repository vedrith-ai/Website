import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panchanga Calculator',
  description: 'Traditional Kannada Panchanga for any date and location — Tithi, Nakshatra, Yoga, Karana, Vara, Rahu Kalam, Abhijit Muhurta, festivals and more.',
  alternates: { canonical: '/panchanga' },
  openGraph: {
    title: 'VedRith Panchanga — Daily Vedic Almanac',
    description: 'Astronomical-grade Panchanga in English and Kannada. Five limbs, Chandramana Masa, Samvatsara, all Muhurtas.',
    url: '/panchanga',
  },
}

export default function PanchangaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
