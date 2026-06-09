import SectionHeader from '@/components/ui/SectionHeader'
import { FEATURES, type Feature, type FeatureTier } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Tier badge colours
// ─────────────────────────────────────────────────────────────────────────────
const TIER_STYLES: Record<FeatureTier, string> = {
  Free:    'bg-navy-700/60 text-cream-200/70 border border-white/10',
  PRO:     'bg-gold-500/15 text-gold-400 border border-gold-500/30',
  Premium: 'bg-gold-500/10 text-gold-300 border border-gold-400/25',
}

const STATUS_LABEL: Record<Feature['status'], string> = {
  live:    '',
  soon:    'Coming V2',
  planned: 'Coming V2.5',
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature icon — renders an SVG from a path string
// ─────────────────────────────────────────────────────────────────────────────
function FeatureIcon({ path }: { path: string }) {
  return (
    <div
      className="flex items-center justify-center w-12 h-12 rounded-full border border-gold-500/25 bg-navy-950 mb-6 flex-shrink-0"
      aria-hidden="true"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A052"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual feature card
// ─────────────────────────────────────────────────────────────────────────────
function FeatureCard({ feature }: { feature: Feature }) {
  const isDimmed = feature.status !== 'live'

  return (
    <article
      className={`feature-card p-7 rounded-sm ${isDimmed ? 'opacity-75' : ''}`}
    >
      {/* Icon */}
      <FeatureIcon path={feature.iconPath} />

      {/* Tier + status badge row */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`
            font-sans text-[0.6rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm
            ${TIER_STYLES[feature.tier]}
          `}
        >
          {feature.tier}
        </span>
        {feature.status !== 'live' && (
          <span className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-cream-100/35">
            {STATUS_LABEL[feature.status]}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-light text-cream-100 mb-3 leading-snug">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="font-sans text-sm text-cream-100/55 leading-relaxed">
        {feature.description}
      </p>

      {/* Gold bottom accent — visible on hover via CSS */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-sm"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,160,82,0.5), transparent)',
          opacity: 0,
          transition: 'opacity 0.35s ease',
        }}
      />
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-navy-900 py-28 lg:py-36"
      aria-label="Features"
    >
      {/* Top cream-to-navy transition */}
      <div
        className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(248,243,236,0.5), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          light
          eyebrow="Everything You Need"
          title="Complete Vedic Wisdom"
          titleItalic="In One Platform"
          subtitle="From daily Panchanga to full Kundali charts, Muhurta timing, Temple Directory, and a self-explaining Knowledge Base — VedRith covers the complete spectrum of Vedic spiritual life."
        />

        {/* Features grid — 3×3 desktop, 2×5 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="font-sans text-[0.7rem] tracking-[0.15em] uppercase text-cream-100/25 text-center mt-14">
          Free tier available at launch &nbsp;·&nbsp; PRO &amp; Premium via Razorpay
        </p>
      </div>

      {/* Bottom transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(248,243,236,0.15))',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
