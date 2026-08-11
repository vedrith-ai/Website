import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: {
    default:  `Kundali — Vedic Birth Chart | ${SITE.name}`,
    template: `%s | ${SITE.name} Kundali`,
  },
  description: 'Generate your complete Vedic birth chart (Kundali) — Lagna, all 9 planets, 12 houses, Nakshatra, Yogas, in South and North Indian styles.',
  alternates: { canonical: `${SITE.url}/kundali` },
}

export default function KundaliLayout({ children }: { children: ReactNode }) {
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
