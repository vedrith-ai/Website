import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE.name}`,
  description: `Privacy Policy for ${SITE.name} — how we collect, use, and protect your data.`,
  alternates: { canonical: `${SITE.url}/privacy` },
}

const sections = [
  {
    title: '1. Information We Collect',
    content: `VedRith collects only the minimum information required to provide its services. This includes: location data (used only to compute Panchanga for your city — not stored on our servers), browser preferences stored locally on your device (language, saved searches, Panchanga history), and anonymised usage data for improving the platform. We do not collect names, email addresses, or personal details unless you voluntarily contact us.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `Your location is used solely to fetch astronomical data (Panchanga, Kundali) for that location. Preferences (language, history) are stored in your browser\'s localStorage and never transmitted to our servers. Aggregated, anonymised analytics help us improve the product. We never sell, rent, or share personal data with third parties.`,
  },
  {
    title: '3. Cookies & Local Storage',
    content: `VedRith uses browser localStorage (not tracking cookies) to remember your language preference, recent searches, and Panchanga history. This data lives entirely on your device. You can clear it at any time through your browser settings. We do not use advertising cookies or third-party tracking.`,
  },
  {
    title: '4. Notifications',
    content: `If you enable notifications, your browser push subscription endpoint is stored securely and used only to send Panchanga reminders and festival alerts you explicitly requested. You can unsubscribe at any time via your browser or device settings.`,
  },
  {
    title: '5. Third-Party Services',
    content: `VedRith uses OpenStreetMap Nominatim for geocoding (city name → coordinates). This service receives only the city name you enter — no personal identifiers. Font assets are loaded from Google Fonts CDN. No advertising networks, social media trackers, or analytics SDKs are embedded.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain no personal data on our servers. All preferences and history are stored locally in your browser. Aggregated, anonymised platform metrics are retained for up to 12 months.`,
  },
  {
    title: '7. Your Rights',
    content: `You may clear all locally stored data at any time through your browser settings. If you contact us, any correspondence is retained only for as long as required to respond. For data-related requests, contact: ${SITE.email}`,
  },
  {
    title: '8. Security',
    content: `VedRith operates exclusively over HTTPS. We implement Content Security Policy (CSP), HSTS, X-Frame-Options, and other security headers. Source maps are disabled in production builds. No sensitive computation is exposed client-side.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Significant changes will be communicated via the VedRith platform announcement banner. Continued use of VedRith after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '10. Contact',
    content: `For privacy enquiries: ${SITE.email}. Operated by Sharva\'s IT.`,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-navy-600/50 font-sans">
              <li><Link href="/" className="hover:text-gold-600 transition-colors">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-navy-800">Privacy Policy</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl font-light text-navy-900 mb-2">Privacy Policy</h1>
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
