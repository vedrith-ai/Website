'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Smart Cross-Links  [V1.2]
//
// Shows contextually relevant suggestions linking Panchanga → Kundali,
// Nakshatra → Festival → Deity → Knowledge, etc.
// Data-driven: links come from a static rule table, not hardcoded JSX.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/index'

// ── Link definition ───────────────────────────────────────────────────────────

interface CrossLinkItem {
  icon:     string
  labelEn:  string
  labelKn:  string
  descEn:   string
  descKn:   string
  href:     string
  external?: boolean
}

// ── Context-based link tables ─────────────────────────────────────────────────

type PageContext = 'panchanga' | 'kundali' | 'nakshatra' | 'tithi' | 'festival' | 'home'

const CROSS_LINK_TABLE: Record<PageContext, CrossLinkItem[]> = {
  panchanga: [
    { icon:'⭕', labelEn:'Generate Kundali', labelKn:'ಕುಂಡಲಿ ತಯಾರಿಸಿ',
      descEn:'Create your Vedic birth chart', descKn:'ಜನ್ಮ ಕುಂಡಲಿ ತಯಾರಿಸಿ',
      href:'/kundali' },
    { icon:'⭐', labelEn:'Nakshatra Guide', labelKn:'ನಕ್ಷತ್ರ ಮಾರ್ಗದರ್ಶಿ',
      descEn:'Deep knowledge of all 27 Nakshatras', descKn:'27 ನಕ್ಷತ್ರಗಳ ಜ್ಞಾನ',
      href:'/panchanga#nakshatra' },
    { icon:'🙏', labelEn:'Today\'s Observances', labelKn:'ಇಂದಿನ ಆಚರಣೆಗಳು',
      descEn:'Festivals, fasting & vrata today', descKn:'ಇಂದಿನ ಹಬ್ಬ, ವ್ರತ',
      href:'/panchanga#festivals' },
    { icon:'⏰', labelEn:'Auspicious Muhurta', labelKn:'ಶುಭ ಮುಹೂರ್ತ',
      descEn:'Best time for important activities today', descKn:'ಇಂದಿನ ಉತ್ತಮ ಸಮಯ',
      href:'/panchanga#muhurta' },
  ],
  kundali: [
    { icon:'📅', labelEn:'Today\'s Panchanga', labelKn:'ಇಂದಿನ ಪಂಚಾಂಗ',
      descEn:'Check today\'s Tithi, Nakshatra & Muhurta', descKn:'ಇಂದಿನ ಪಂಚಾಂಗ ನೋಡಿ',
      href:'/panchanga' },
    { icon:'⭐', labelEn:'Your Birth Nakshatra', labelKn:'ಜನ್ಮ ನಕ್ಷತ್ರ',
      descEn:'Explore your Moon Nakshatra in depth', descKn:'ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರ ತಿಳಿಯಿರಿ',
      href:'/panchanga#nakshatra' },
    { icon:'🪐', labelEn:'Planet Knowledge', labelKn:'ಗ್ರಹ ಜ್ಞಾನ',
      descEn:'Classical meanings of all 9 Grahas', descKn:'9 ಗ್ರಹಗಳ ಕ್ಲಾಸಿಕ್ ಅರ್ಥ',
      href:'/panchanga' },
    { icon:'🏠', labelEn:'House Meanings', labelKn:'ಭವ ಅರ್ಥ',
      descEn:'What each of the 12 houses signifies', descKn:'12 ಭವಗಳ ಮಹತ್ವ',
      href:'/kundali' },
  ],
  nakshatra: [
    { icon:'🙏', labelEn:'Related Festivals', labelKn:'ಸಂಬಂಧಿತ ಹಬ್ಬಗಳು',
      descEn:'Festivals observed on this Nakshatra', descKn:'ಈ ನಕ್ಷತ್ರದ ಹಬ್ಬಗಳು',
      href:'/panchanga#festivals' },
    { icon:'🌅', labelEn:'Open Panchanga', labelKn:'ಪಂಚಾಂಗ ನೋಡಿ',
      descEn:"Check today's Nakshatra timing", descKn:'ಇಂದಿನ ನಕ್ಷತ್ರ ಸಮಯ',
      href:'/panchanga' },
    { icon:'⭕', labelEn:'Kundali Chart', labelKn:'ಕುಂಡಲಿ ಚಕ್ರ',
      descEn:'See your birth Nakshatra in your chart', descKn:'ನಿಮ್ಮ ಕುಂಡಲಿ ನೋಡಿ',
      href:'/kundali' },
  ],
  tithi: [
    { icon:'🙏', labelEn:'Fasting & Vrata', labelKn:'ಉಪವಾಸ ಮತ್ತು ವ್ರತ',
      descEn:'Observances for this Tithi', descKn:'ಈ ತಿಥಿಯ ವ್ರತ',
      href:'/panchanga#festivals' },
    { icon:'📅', labelEn:'Full Panchanga', labelKn:'ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ',
      descEn:'All five Angas for today', descKn:'ಇಂದಿನ ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ',
      href:'/panchanga' },
  ],
  festival: [
    { icon:'📅', labelEn:'Open Panchanga', labelKn:'ಪಂಚಾಂಗ ತೆರೆಯಿರಿ',
      descEn:'Check Muhurta for this festival day', descKn:'ಹಬ್ಬದ ಮುಹೂರ್ತ ನೋಡಿ',
      href:'/panchanga' },
    { icon:'⭕', labelEn:'Kundali', labelKn:'ಕುಂಡಲಿ',
      descEn:'Generate your Vedic birth chart', descKn:'ಜನ್ಮ ಕುಂಡಲಿ ತಯಾರಿಸಿ',
      href:'/kundali' },
  ],
  home: [
    { icon:'📅', labelEn:"Today's Panchanga", labelKn:'ಇಂದಿನ ಪಂಚಾಂಗ',
      descEn:'Tithi, Nakshatra, Yoga, Muhurta', descKn:'ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಮುಹೂರ್ತ',
      href:'/panchanga' },
    { icon:'⭕', labelEn:'Kundali', labelKn:'ಕುಂಡಲಿ',
      descEn:'Vedic birth chart & planetary positions', descKn:'ವೈದಿಕ ಜನ್ಮ ಕುಂಡಲಿ',
      href:'/kundali' },
  ],
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CrossLinksProps {
  context:    PageContext
  className?: string
  title?:     string
}

export function CrossLinks({ context, className = '', title }: CrossLinksProps) {
  const { lang } = useTranslation()
  const links    = CROSS_LINK_TABLE[context] ?? []

  if (!links.length) return null

  const heading = title ?? (lang === 'kn' ? 'ಸಂಬಂಧಿತ ವಿಭಾಗಗಳು' : 'Explore Related')

  return (
    <nav aria-label={lang === 'kn' ? 'ಸಂಬಂಧಿತ ಲಿಂಕ್‌ಗಳು' : 'Related links'} className={className}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {heading}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="group flex flex-col gap-1.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 hover:border-border/80 p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span className="text-xl" aria-hidden>{link.icon}</span>
            <span className="text-xs font-semibold text-foreground group-hover:text-amber-400 transition-colors leading-tight">
              {lang === 'kn' ? link.labelKn : link.labelEn}
            </span>
            <span className="text-[10px] text-muted-foreground leading-snug">
              {lang === 'kn' ? link.descKn : link.descEn}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

// ── Inline breadcrumb trail ───────────────────────────────────────────────────

interface BreadcrumbItem { label: string; href?: string }

export function Breadcrumb({ items, className = '' }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-muted-foreground/40">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground/70">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
