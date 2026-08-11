import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Terms of Use | ${SITE.name}`,
  description: `Terms of Use for ${SITE.name}. By using VedRith you agree to these terms.`,
  alternates: { canonical: `${SITE.url}/terms` },
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using VedRith (the "Platform"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Platform. VedRith is operated by Sharva\'s IT.`,
  },
  {
    title: '2. Description of Service',
    content: `VedRith provides Vedic astrology calculations including Panchanga, Kundali generation, Knowledge Base, Rules Engine, and related features. The Platform is provided for informational and cultural purposes. Astrological information is not a substitute for professional advice in legal, medical, financial, or other matters.`,
  },
  {
    title: '3. Use of the Platform',
    content: `You may use VedRith for personal, non-commercial purposes. You may not: attempt to reverse-engineer, decompile, or extract source code from the Platform; scrape, crawl, or systematically download Platform data without written permission; use automated tools to overload the Platform infrastructure; or represent VedRith calculations as your own proprietary data.`,
  },
  {
    title: '4. Intellectual Property',
    content: `All content, calculations, code, logos, and visual assets are the exclusive property of Sharva\'s IT and VedRith. The Vedic Astronomy Engine, Panchanga algorithms, and Knowledge Base content are protected by copyright. You may share individual Panchanga results (e.g., via the Share Card feature) with attribution to VedRith.`,
  },
  {
    title: '5. Accuracy & Disclaimer',
    content: `VedRith uses astronomical-grade calculations (VSOP87/ELP2000 based). However, astrological interpretations are provided for cultural and traditional reference purposes only. We make no warranty as to the fitness of astrological information for any specific purpose. Sharva\'s IT is not liable for decisions made based on VedRith output.`,
  },
  {
    title: '6. No Account Required',
    content: `VedRith RC1 does not require account creation. All preferences and history are stored locally on your device. Future versions may offer optional accounts for cross-device synchronisation.`,
  },
  {
    title: '7. Availability',
    content: `VedRith is provided "as is." We strive for 99.9% uptime but do not guarantee uninterrupted availability. We may modify, suspend, or discontinue features with reasonable notice.`,
  },
  {
    title: '8. Changes to Terms',
    content: `We may update these Terms. Material changes will be announced on the Platform. Continued use after changes constitutes acceptance.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Karnataka, India.`,
  },
  {
    title: '10. Contact',
    content: `Questions about these Terms: ${SITE.email}`,
  },
]

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-navy-600/50 font-sans">
              <li><Link href="/" className="hover:text-gold-600 transition-colors">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-navy-800">Terms of Use</li>
            </ol>
          </nav>
          <h1 className="font-serif text-4xl font-light text-navy-900 mb-2">Terms of Use</h1>
          <p className="font-sans text-sm text-navy-600/60 mb-10">Effective date: January 2025 · Last updated: August 2025</p>
          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-serif text-xl font-medium text-navy-800 mb-3">{s.title}</h2>
                <p className="font-sans text-sm text-navy-700/80 leading-relaxed">{s.content}</p>
              </section>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-navy-200/30">
            <Link href="/" className="font-sans text-sm text-gold-600 hover:text-gold-700 transition-colors">
              ← Back to VedRith
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
