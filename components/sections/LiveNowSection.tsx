'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — LIVE NOW Section [RC1 — Part 2]
// Shows all platform modules with live/coming-soon status.
// No redesign — matches existing visual system exactly.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { LIVE_MODULES, type LiveModule } from '@/lib/constants'
import { useTranslation } from '@/lib/i18n'
import SectionHeader from '@/components/ui/SectionHeader'
import OrnamentDivider from '@/components/ui/OrnamentDivider'

function ModuleCard({ mod }: { mod: LiveModule }) {
  const isLive = mod.status === 'LIVE'
  const { lang } = useTranslation()
  const title = lang === 'kn' ? mod.titleKn : mod.title
  const desc  = lang === 'kn' ? mod.descriptionKn : mod.description

  const card = (
    <div className={`
      group relative flex flex-col gap-3 p-5 rounded-lg border transition-all duration-200
      ${isLive
        ? 'border-gold-500/30 bg-navy-800/60 hover:border-gold-500/60 hover:bg-navy-800/90 cursor-pointer'
        : 'border-white/[0.06] bg-navy-900/40 opacity-60 cursor-default'
      }
    `}>
      {/* Status badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl" role="img" aria-hidden="true">{mod.icon}</span>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-[0.6rem] font-sans tracking-widest uppercase text-gold-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            Available Now
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[0.6rem] font-sans tracking-widest uppercase text-cream-100/35">
            Coming Soon
          </span>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className={`font-serif text-lg font-medium mb-1.5 ${isLive ? 'text-cream-100' : 'text-cream-100/50'}`}>
          {title}
        </h3>
        <p className={`font-sans text-xs leading-relaxed ${isLive ? 'text-cream-100/60' : 'text-cream-100/30'}`}>
          {desc}
        </p>
      </div>

      {/* Arrow — live only */}
      {isLive && (
        <div className="mt-auto pt-2 flex items-center gap-1 text-gold-500 text-xs font-sans tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          Open module
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" d="M17 8l4 4-4 4M3 12h18" />
          </svg>
        </div>
      )}
    </div>
  )

  if (isLive) {
    // Smart Search opens the header search overlay
    if (mod.id === 'search') {
      return (
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: '/', bubbles: true })
            document.dispatchEvent(event)
          }}
          className="text-left w-full"
          aria-label={`Open ${title} search`}
        >
          {card}
        </button>
      )
    }
    return <Link href={mod.href} aria-label={`Open ${title}`}>{card}</Link>
  }
  return <div aria-label={`${title} — Coming soon`}>{card}</div>
}

export function LiveNowSection() {
  const { lang } = useTranslation()
  const liveMods   = LIVE_MODULES.filter(m => m.status === 'LIVE')
  const futureMods = LIVE_MODULES.filter(m => m.status === 'COMING_SOON')

  return (
    <section
      id="platform"
      aria-labelledby="platform-heading"
      className="py-16 px-4 bg-navy-950"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Platform"
          title={lang === 'kn' ? 'ಈಗ ಲೈವ್ ಆಗಿದೆ' : 'Live Now'}
          subtitle={
            lang === 'kn'
              ? 'ಎಲ್ಲ ವೈಶಿಷ್ಟ್ಯಗಳು ಉಚಿತವಾಗಿ ಲಭ್ಯವಿದೆ — ಯಾವುದೇ ಲಾಗಿನ್ ಅಗತ್ಯವಿಲ್ಲ.'
              : 'All features are available to everyone — no login required.'
          }
          light
        />

        {/* LIVE modules */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveMods.map(mod => <ModuleCard key={mod.id} mod={mod} />)}
        </div>

        <OrnamentDivider light width="sm" className="my-10" />

        {/* COMING SOON modules */}
        <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-cream-100/30 text-center mb-6">
          {lang === 'kn' ? 'ಶೀಘ್ರದಲ್ಲಿ ಬರುತ್ತಿದೆ' : 'Coming Soon'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureMods.map(mod => <ModuleCard key={mod.id} mod={mod} />)}
        </div>
      </div>
    </section>
  )
}
