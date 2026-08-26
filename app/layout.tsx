import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Kannada, Cormorant_Garamond, Lato } from 'next/font/google';
import { LangProvider }     from '@/components/providers/LangProvider';
import { LocationProvider } from '@/components/providers/LocationProvider';
import './globals.css';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { RuntimePrompts } from '@/components/RuntimePrompts';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300','400','500','600','700'],
});

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  weight: ['300','400','700','900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display:  'swap',
});

const notoKannada = Noto_Sans_Kannada({
  subsets:  ['kannada'],
  weight:   ['400', '500', '600', '700'],
  variable: '--font-noto-kannada',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       { default: 'VedRith — Vedic Astrology & Panchanga', template: '%s | VedRith' },
  description: "Daily Panchanga, Kundali birth charts, Muhurta, Nakshatras and Vedic calendar in English and Kannada. By Sharva's IT.",
  keywords:    ['Panchanga','Kundali','Vedic Astrology','Nakshatra','Muhurta','Kannada','ಪಂಚಾಂಗ'],
  authors:     [{ name: "Sharva's IT", url: 'https://vedrith.sharvasit.in' }],
  metadataBase: new URL('https://vedrith.sharvasit.in'),
  openGraph: {
    type: 'website', locale: 'en_IN', url: 'https://vedrith.sharvasit.in',
    siteName: 'VedRith', title: 'VedRith — Vedic Astrology & Panchanga',
    description: 'Daily Panchanga, Kundali and Muhurta in English & Kannada.',
    images: [{ url: '/icons/og-image.png', width: 1200, height: 630 }],
  },
  manifest: '/manifest.json',
  icons: {
    icon:  [{ url: '/icons/icon-192.png', sizes: '192x192' }],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#f56e15', width: 'device-width', initialScale: 1, viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lato.variable} ${cormorant.variable} ${notoKannada.variable} min-h-screen`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground">
          Skip to main content
        </a>
        {/* LangProvider and LocationProvider wrap the entire app */}
        <LangProvider>
          <LocationProvider>
            {children}
            <ServiceWorkerRegistration />
            <RuntimePrompts />
          </LocationProvider>
        </LangProvider>
      </body>
    </html>
  );
}
