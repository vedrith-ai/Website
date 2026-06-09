import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Lato } from 'next/font/google'
import './globals.css'
import { SITE } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Fonts — loaded via next/font (zero CLS, self-hosted via Google CDN)
// ─────────────────────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  subsets:  ['latin'],
  variable: '--font-cormorant',
  display:  'swap',
})

const lato = Lato({
  weight:   ['300', '400', '700'],
  subsets:  ['latin'],
  variable: '--font-lato',
  display:  'swap',
})

// ─────────────────────────────────────────────────────────────────────────────
// Viewport
// ─────────────────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  themeColor:          '#1B2A4A',
  colorScheme:         'light',
  width:               'device-width',
  initialScale:        1,
  maximumScale:        5,
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:  `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'Vedic astrology', 'Panchanga', 'Kundali', 'Muhurta', 'Jyotisha',
    'Indian astrology', 'horoscope', 'Nakshatra', 'Tithi', 'Rashi',
    'Vimshottari Dasha', 'temple directory', 'Hindu calendar',
    'Telugu Panchanga', 'Tamil Panchanga', 'auspicious timing',
  ],
  authors:   [{ name: "Sharva's IT", url: SITE.url }],
  creator:   "Sharva's IT",
  publisher: 'VedRith',
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type:      'website',
    locale:    'en_IN',
    url:       SITE.url,
    siteName:  SITE.name,
    title:     `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url:    '/images/logo-full.png',
        width:  1080,
        height: 1080,
        alt:    'VedRith — The Rhythm of Vedic Wisdom',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    site:        SITE.twitter,
    creator:     SITE.twitter,
    title:       `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images:      ['/images/logo-full.png'],
  },
  icons: {
    icon:             '/images/logo-circular.png',
    shortcut:         '/images/logo-circular.png',
    apple:            '/images/logo-circular.png',
    other: [
      { rel: 'mask-icon', url: '/images/logo-circular.png', color: '#1B2A4A' },
    ],
  },
  alternates: {
    canonical: SITE.url,
  },
  category: 'Spirituality',
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lato.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
