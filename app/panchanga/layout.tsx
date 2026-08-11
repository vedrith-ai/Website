import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: {
    default:  `Panchanga — Daily Vedic Calendar | ${SITE.name}`,
    template: `%s | ${SITE.name} Panchanga`,
  },
  description: 'Daily Panchanga for any Indian city. Tithi, Nakshatra, Yoga, Karana, Vara, Rahu Kalam, Abhijit Muhurta, festivals and auspicious timings.',
  alternates: { canonical: `${SITE.url}/panchanga` },
}

export default function PanchangaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="pt-[72px] min-h-screen bg-cream-50">
        {children}
      </div>
      <Footer />
    </>
  )
}
