import type { Metadata } from 'next'
import Header            from '@/components/layout/Header'
import Footer            from '@/components/layout/Footer'
import HeroSection       from '@/components/sections/HeroSection'
import FeaturesSection   from '@/components/sections/FeaturesSection'
import AboutSection      from '@/components/sections/AboutSection'
import RoadmapSection    from '@/components/sections/RoadmapSection'
import FAQSection        from '@/components/sections/FAQSection'
import ContactSection    from '@/components/sections/ContactSection'
import { HomeDashboard } from '@/components/home/HomeDashboard'
import { LiveNowSection } from '@/components/sections/LiveNowSection'
import { SITE }          from '@/lib/constants'
import { CrossLinks }    from '@/components/ui/CrossLinks'

// ── Page metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: SITE.url },
  openGraph: {
    type:        'website',
    url:         SITE.url,
    title:       `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/images/logo-full.png', width: 1080, height: 1080, alt: SITE.name }],
  },
}

// ── JSON-LD breadcrumb ────────────────────────────────────────────────────────
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type':    'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
  ],
}

// ── Announcement banner ───────────────────────────────────────────────────────
function AnnouncementBanner() {
  return (
    <div role="banner" aria-label="Platform announcement"
      className="w-full bg-amber-500/10 border-b border-amber-500/20 text-center py-2 px-4">
      <p className="text-xs text-amber-400">
        🎉 VedRith RC1 — Panchanga, Kundali, Notifications, Knowledge & Rules are now live. Free for everyone.
      </p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-medium">
        Skip to main content
      </a>
      <Header />
      <AnnouncementBanner />
      <main id="main-content">
        <HeroSection />
        {/* Live Dashboard */}
        <HomeDashboard />
        {/* LIVE NOW Section — Part 2 */}
        <LiveNowSection />
        <FeaturesSection />
        <AboutSection />
        <RoadmapSection />
        <FAQSection />
        <ContactSection />
        {/* Cross-links for SEO — Part 7 */}
        <CrossLinks />
      </main>
      <Footer />
    </>
  )
}
