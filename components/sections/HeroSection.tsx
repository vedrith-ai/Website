'use client'
// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Hero Section  [RC1 — i18n complete]
// ─────────────────────────────────────────────────────────────────────────────
import Image           from 'next/image'
import Link            from 'next/link'
import OrnamentDivider from '@/components/ui/OrnamentDivider'
import { SITE }        from '@/lib/constants'
import { HeroPanchangaStrip } from './HeroPanchangaStrip'
import { useTranslation }     from '@/lib/i18n'

const STATS_DATA = [
  { valueEn: '2',    valueKn: '2',    labelEn: 'Languages (Live)',    labelKn: 'ಭಾಷೆಗಳು (ಲೈವ್)' },
  { valueEn: '8+',   valueKn: '8+',   labelEn: 'Regional Traditions', labelKn: 'ಪ್ರಾದೇಶಿಕ ಸಂಪ್ರದಾಯ' },
  { valueEn: '5',    valueKn: '5',    labelEn: 'Live Modules',        labelKn: 'ಲೈವ್ ಮಾಡ್ಯೂಲ್‌ಗಳು' },
  { valueEn: 'RC1',  valueKn: 'RC1',  labelEn: 'Release Candidate',   labelKn: 'ರಿಲೀಸ್ ಕ್ಯಾಂಡಿಡೇಟ್' },
]

const TAGLINE = {
  en: SITE.tagline,
  kn: 'ವೈದಿಕ ಜ್ಞಾನದ ಲಯ',
}

const DESCRIPTION = {
  en: "India's precision Vedic astrology platform — Panchanga, Kundali, Knowledge Base & Jyotisha Rules in English and Kannada.",
  kn: "ಭಾರತದ ನಿಖರ ವೈದಿಕ ಜ್ಯೋತಿಷ ವೇದಿಕೆ — ಪಂಚಾಂಗ, ಕುಂಡಲಿ, ಜ್ಞಾನ ಭಂಡಾರ ಮತ್ತು ಜ್ಯೋತಿಷ ನಿಯಮಗಳು.",
}

const CTA = {
  primary: { en: 'View Today\'s Panchanga', kn: 'ಇಂದಿನ ಪಂಚಾಂಗ ನೋಡಿ' },
  secondary: { en: 'Generate Kundali',      kn: 'ಕುಂಡಲಿ ತಯಾರಿಸಿ' },
}

export default function HeroSection() {
  const { lang: rawLang } = useTranslation()
  const lang = rawLang === 'kn' ? 'kn' : 'en'

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-bg"
      aria-label="Hero"
    >
      {/* ── Sacred geometry background (CSS-only, aria-hidden) ─────────── */}
      <div aria-hidden="true">
        <div className="mandala-ring" style={{ width: '260px', height: '260px', opacity: 0.30 }} />
        <div className="mandala-ring" style={{ width: '440px', height: '440px', opacity: 0.18, animation: 'spin-slow 40s linear infinite', borderStyle: 'dashed' }} />
        <div className="mandala-ring" style={{ width: '620px', height: '620px', opacity: 0.10 }} />
        <div className="mandala-ring" style={{ width: '820px', height: '820px', opacity: 0.06, animation: 'spin-slow 80s linear infinite reverse' }} />
      </div>

      {/* ── Live Panchanga Strip ────────────────────────────────────────── */}
      <HeroPanchangaStrip />

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-32 pb-16 max-w-4xl mx-auto">

        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logo-icon.png"
            alt={`${SITE.name} — ${TAGLINE[lang]}`}
            width={120}
            height={120}
            className="h-28 w-auto mx-auto"
            priority
          />
        </div>

        {/* Site name */}
        <h1 className="font-serif text-6xl sm:text-7xl font-light text-navy-900 tracking-tight mb-3">
          {SITE.name}
        </h1>

        {/* Tagline */}
        <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-gold-600 mb-6">
          {TAGLINE[lang]}
        </p>

        <OrnamentDivider width="sm" className="mb-6" />

        {/* Description */}
        <p className="font-sans text-base sm:text-lg text-navy-700/80 leading-relaxed max-w-2xl mb-10">
          {DESCRIPTION[lang]}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-14">
          <Link href="/panchanga" className="btn-gold px-8 py-4 text-sm">
            {CTA.primary[lang]}
          </Link>
          <Link href="/kundali"
            className="px-8 py-4 rounded border border-navy-300 text-navy-700 hover:border-gold-500 hover:text-gold-700 transition-colors text-sm font-sans tracking-wide">
            {CTA.secondary[lang]}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
          {STATS_DATA.map((stat) => (
            <div key={stat.labelEn} className="flex flex-col items-center gap-1">
              <span className="font-serif text-3xl font-light text-gold-600">
                {lang === 'kn' ? stat.valueKn : stat.valueEn}
              </span>
              <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-navy-600/60">
                {lang === 'kn' ? stat.labelKn : stat.labelEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Powered by */}
      <p className="relative z-10 font-sans text-[0.65rem] tracking-[0.2em] uppercase text-navy-600/40 pb-8">
        {SITE.poweredBy}
      </p>
    </section>
  )
}
