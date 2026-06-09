import SectionHeader  from '@/components/ui/SectionHeader'
import OrnamentDivider from '@/components/ui/OrnamentDivider'
import { ROADMAP, type RoadmapMilestone } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Status badge styles
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  RoadmapMilestone['status'],
  { label: string; dotClass: string; badgeClass: string }
> = {
  building: {
    label:      'Building Now',
    dotClass:   'bg-gold-400 shadow-gold-sm animate-pulse',
    badgeClass: 'bg-gold-500/20 text-gold-400 border border-gold-500/40',
  },
  upcoming: {
    label:      'Coming Soon',
    dotClass:   'bg-gold-600/70',
    badgeClass: 'bg-gold-500/10 text-gold-500/80 border border-gold-500/25',
  },
  planned: {
    label:      'Planned',
    dotClass:   'bg-navy-400/60',
    badgeClass: 'bg-cream-100/5 text-cream-100/50 border border-white/10',
  },
  future: {
    label:      'Future',
    dotClass:   'bg-navy-400/30',
    badgeClass: 'bg-cream-100/[0.03] text-cream-100/35 border border-white/8',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Single milestone card
// ─────────────────────────────────────────────────────────────────────────────
function MilestoneCard({
  milestone,
  index,
  isLast,
}: {
  milestone: RoadmapMilestone
  index:     number
  isLast:    boolean
}) {
  const config  = STATUS_CONFIG[milestone.status]
  const isLive  = milestone.status === 'building'
  const isFaded = milestone.status === 'future'

  return (
    <div
      className={`relative flex flex-col ${isFaded ? 'opacity-55' : ''}`}
    >
      {/* Connector line — hidden on last card */}
      {!isLast && (
        <div
          className="hidden lg:block absolute top-[2.15rem] left-[calc(100%+0px)] w-full h-px z-0"
          style={{
            background: isLive
              ? 'linear-gradient(to right, rgba(201,160,82,0.5), rgba(201,160,82,0.15))'
              : 'linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
          }}
          aria-hidden="true"
        />
      )}

      {/* Card */}
      <div
        className={`
          milestone-card relative z-10
          border rounded-sm p-6
          ${isLive
            ? 'border-gold-500/40 bg-navy-800/80'
            : 'border-white/[0.07] bg-navy-900/60'
          }
          ${isLive ? 'is-active' : ''}
          h-full flex flex-col
        `}
      >
        {/* Top row: dot + version + badge */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            {/* Status dot */}
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${config.dotClass}`}
              aria-hidden="true"
            />
            {/* Version */}
            <span
              className="font-serif text-cream-100 font-light"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
            >
              {milestone.version}
            </span>
          </div>

          {/* Status badge */}
          <span
            className={`
              font-sans text-[0.58rem] tracking-[0.14em] uppercase
              px-2.5 py-1 rounded-sm flex-shrink-0
              ${config.badgeClass}
            `}
          >
            {config.label}
          </span>
        </div>

        {/* Label */}
        <h3 className="font-serif text-lg text-cream-100/90 font-light mb-1">
          {milestone.label}
        </h3>

        {/* Timeline */}
        <p className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-gold-500/70 mb-5">
          {milestone.timeline}
        </p>

        <OrnamentDivider light width="full" className="mb-5" />

        {/* Feature list */}
        <ul className="flex flex-col gap-2.5 mt-auto" role="list">
          {milestone.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <circle
                  cx="6" cy="6" r="2"
                  fill={isLive ? '#C9A052' : 'rgba(201,160,82,0.4)'}
                />
              </svg>
              <span className="font-sans text-[0.8rem] text-cream-100/60 leading-snug">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* "Building Now" glow ring — only on active card */}
        {isLive && (
          <div
            className="absolute inset-0 rounded-sm pointer-events-none"
            style={{
              boxShadow: '0 0 0 1px rgba(201,160,82,0.20), inset 0 1px 0 rgba(201,160,82,0.15)',
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Step number indicator */}
      <p
        className="font-sans text-[0.55rem] tracking-[0.25em] uppercase text-cream-100/20 text-center mt-3"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────────────
export default function RoadmapSection() {
  return (
    <section
      id="roadmap"
      className="relative bg-navy-950 py-28 lg:py-36 overflow-hidden"
      aria-label="Product Roadmap"
    >
      {/* Background stars/dots */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,160,82,0.08) 1px, transparent 1px)',
          backgroundSize:  '56px 56px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          light
          eyebrow="Product Vision"
          title="The Road to"
          titleItalic="Complete Vedic Wisdom"
          subtitle="VedRith is built milestone by milestone — each version delivering a complete, production-quality module before the next begins."
        />

        {/* Milestone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {ROADMAP.map((milestone, i) => (
            <MilestoneCard
              key={milestone.version}
              milestone={milestone}
              index={i}
              isLast={i === ROADMAP.length - 1}
            />
          ))}
        </div>

        {/* Bottom note */}
        <p className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-cream-100/20 text-center mt-16">
          Timelines are approximate and subject to refinement
        </p>
      </div>
    </section>
  )
}
