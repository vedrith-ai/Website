import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { SITE } from '@/lib/constants'
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { I18nProvider } from '@/lib/i18n/index'

// ─────────────────────────────────────────────────────────────────────────────
// Fonts — loaded via CSS @import in globals.css (runtime, not build-time).
// CSS variables are defined there; Tailwind picks them up via tailwind.config.ts
// (font-serif → var(--font-cormorant), font-sans → var(--font-lato)).
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Viewport — PWA theme colour updated to gold
// ─────────────────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0a0f1e' },
    { media: '(prefers-color-scheme: light)', color: '#d4af37' },
  ],
  colorScheme:         'dark light',
  width:               'device-width',
  initialScale:        1,
  maximumScale:        5,
  viewportFit:         'cover',
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata — enhanced for PWA + SEO
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:  `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'Vedic astrology', 'Panchanga', 'Kannada Panchanga', 'Kundali', 'Muhurta',
    'Jyotisha', 'Indian astrology', 'Hindu calendar', 'Nakshatra', 'Tithi',
    'Rashi', 'Rahu Kalam', 'Abhijit Muhurta', 'Auspicious timing', 'Samvatsara',
    'ಪಂಚಾಂಗ', 'ಕುಂಡಲಿ', 'ಮುಹೂರ್ತ', 'ನಕ್ಷತ್ರ', 'ತಿಥಿ',
  ],
  authors:   [{ name: "Sharva's IT", url: SITE.url }],
  creator:   "Sharva's IT",
  publisher: 'VedRith',
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type:        'website',
    locale:      'kn_IN',
    alternateLocale: ['en_IN'],
    url:         SITE.url,
    siteName:    SITE.name,
    title:       `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{
      url:    '/images/logo-full.png',
      width:  1080,
      height: 1080,
      alt:    'VedRith — The Rhythm of Vedic Wisdom',
    }],
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
    icon:    [
      { url: '/icons/icon-32x32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
    apple:   [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/images/logo-circular.png', color: '#d4af37' },
    ],
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: SITE.url,
    // Note: Language switching is UI-based via a query param (?lang=kn).
    // Separate routes (/en, /kn) do not exist; hreflang tags use root URL.
    languages: { 'en-IN': SITE.url, 'kn-IN': SITE.url },
  },
  category:   'Spirituality',
  appleWebApp: {
    capable:          true,
    statusBarStyle:   'black-translucent',
    title:            'VedRith',
    startupImage:     '/icons/icon-512x512.png',
  },
  formatDetection: { telephone: false, email: false, address: false },
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD — WebSite schema for Google rich results
// ─────────────────────────────────────────────────────────────────────────────

const websiteSchema = {
  '@context':    'https://schema.org',
  '@type':       'WebSite',
  name:          SITE.name,
  url:           SITE.url,
  description:   SITE.description,
  inLanguage:    ['kn', 'en'],
  potentialAction: {
    '@type':       'SearchAction',
    target:        { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/panchanga?date={date}` },
    'query-input': 'required name=date',
  },
  publisher: {
    '@type': 'Organization',
    name:    "Sharva's IT",
    url:     SITE.url,
    logo:    { '@type': 'ImageObject', url: `${SITE.url}/images/logo-full.png` },
  },
}

const mobileAppSchema = {
  '@context':        'https://schema.org',
  '@type':           'MobileApplication',
  name:              SITE.name,
  description:       SITE.description,
  url:               SITE.url,
  applicationCategory: 'LifestyleApplication',
  operatingSystem:   'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  inLanguage:        ['kn', 'en'],
  screenshot:        `${SITE.url}/images/logo-full.png`,
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="kn"
      className="vedrith-fonts"
    >
      <head>
        {/* Google Fonts preconnect — speeds up runtime font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA Meta tags */}
        <meta name="application-name"       content="VedRith" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable"          content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title"            content="VedRith" />
        <meta name="msapplication-TileColor"               content="#0a0f1e" />
        <meta name="msapplication-tap-highlight"           content="no" />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileAppSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        <I18nProvider defaultLang="kn">
          {children}
        </I18nProvider>

        {/* PWA: Service Worker registration — client-only, renders nothing */}
        <ServiceWorkerRegistration />

        {/* PWA: Non-intrusive install prompt */}
        <InstallPrompt />
      </body>
    </html>
  )
}
