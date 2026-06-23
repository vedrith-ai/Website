import Image            from 'next/image'
import SectionHeader     from '@/components/ui/SectionHeader'
import OrnamentDivider   from '@/components/ui/OrnamentDivider'
import { STATS, REGIONAL_TRADITIONS, SITE } from '@/lib/constants'

// Pillar data — core commitments
const PILLARS = [
  {
    title:       'Calculation Correctness',
    description: 'Astronomical calculations powered by the VedRith Astronomy Engine. Lahiri, KP, Raman, and True Chitrapaksha Ayanamsha. No approximations.',
  },
  {
    title:       'Cultural Fidelity',
    description: 'Each regional tradition is modelled separately — Telugu Panchanga is not Tamil Panchanga. Nakshatra names, month names, and auspicious rules differ by region and VedRith honours every variation.',
  },
  {
    title:       'Self-Explaining Results',
    description: "Every computed result links to its Knowledge Base entry. When VedRith shows 'Rohini Nakshatra', you can tap to see its deity, meaning, suitable activities, remedy, and mantra — without leaving the app.",
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative bg-cream py-28 lg:py-36 overflow-hidden"
      aria-label="About VedRith"
    >
      {/* Background decoration — faint OM */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif pointer-events-none select-none"
        style={{
          fontSize: '32rem',
          color: 'rgba(201,160,82,0.025)',
          lineHeight: 1,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        ॐ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <SectionHeader
          eyebrow="Our Vision"
          title="Built for India's"
          titleItalic="Spiritual Diversity"
          subtitle="VedRith is built on a single conviction: India's 5,000-year-old astronomical tradition deserves a platform built with the precision it commands and the reverence it demands."
        />

        {/* ── Main content: two columns ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">

          {/* Left — logo visual */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Decorative ring behind logo */}
              <div
                className="absolute inset-0 rounded-full border border-gold-500/20"
                style={{ transform: 'scale(1.15)' }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 rounded-full border border-gold-500/10"
                style={{ transform: 'scale(1.35)' }}
                aria-hidden="true"
              />

              <Image
                src="/images/logo-full.png"
                alt="VedRith — The Rhythm of Vedic Wisdom"
                width={380}
                height={480}
                className="relative z-10 w-64 sm:w-72 lg:w-80 h-auto"
                style={{ filter: 'drop-shadow(0 24px 48px rgba(201,160,82,0.18))' }}
              />
            </div>
          </div>

          {/* Right — content */}
          <div className="flex flex-col gap-8">
            <p
              className="font-serif text-navy-800 leading-relaxed"
              style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 300 }}
            >
              We are building India&apos;s most accurate, most culturally faithful
              Vedic astrology platform. Every calculation — from the simplest
              Tithi to the most complex Shadbala — follows classical{' '}
              <em>Jyotiṣa</em> rules, computed with astronomical grade precision.
            </p>

            <OrnamentDivider className="self-start" width="sm" />

            {/* Three pillars */}
            <div className="flex flex-col gap-7">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="flex gap-5">
                  {/* Gold dot */}
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-gold-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-navy-900 font-medium text-lg mb-1">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-navy-600 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Powered by note */}
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px w-8 bg-gold-500/50" aria-hidden="true" />
              <p className="font-sans text-[0.7rem] tracking-[0.2em] uppercase text-navy-500">
                {SITE.poweredBy}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-20">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`
                flex flex-col items-center justify-center py-10 px-6 text-center
                ${i < STATS.length - 1 ? 'md:border-r md:border-gold-500/20' : ''}
                bg-navy-900/5 hover:bg-navy-900/8 transition-colors
              `}
            >
              <span
                className="font-serif text-gold-600 mb-2 leading-none"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 300 }}
              >
                {stat.value}
              </span>
              <span className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-navy-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Regional traditions strip ───────────────────────────────────── */}
        <div className="text-center">
          <p className="font-sans text-[0.65rem] tracking-[0.28em] uppercase text-gold-600 mb-7">
            Regional Traditions Supported
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {REGIONAL_TRADITIONS.map((region, i) => (
              <div key={region} className="flex items-center gap-8">
                <span className="font-serif text-navy-700 text-lg font-light">
                  {region}
                </span>
                {i < REGIONAL_TRADITIONS.length - 1 && (
                  <span
                    className="text-gold-500/40 text-sm"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
