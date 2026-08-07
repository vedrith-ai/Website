'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Knowledge Panel & TermLink  [V1.2]
//
// TermLink:   Wraps any Vedic term to make it clickable.
// KnowledgePanel: Side panel / modal showing full knowledge for a term.
//
// Usage:
//   <TermLink element="nakshatra" termKey="Rohini">Rohini</TermLink>
//   <TermLink element="tithi" termKey="Purnima" lang="kn">ಹುಣ್ಣಿಮೆ</TermLink>
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, type ReactNode } from 'react'
import type { PanchangaElementType } from '@/lib/rules/types'
import { getTithiKnowledge }     from '@/lib/knowledge/tithi-knowledge'
import { getNakshatraKnowledge } from '@/lib/knowledge/nakshatra-knowledge'
import { getVaraKnowledge }      from '@/lib/knowledge/vara-knowledge'
import { useTranslation }        from '@/lib/i18n/index'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TermData {
  nameEn:      string
  nameKn:      string
  meaning:     string
  description: string
  deity:       string
  symbol?:     string
  mantra?:     string
  suitable:    string[]
  avoid:       string[]
  extra:       Record<string, string>   // additional fields rendered dynamically
  refs:        string[]
}

// ── Knowledge resolvers ───────────────────────────────────────────────────────

function resolveTermData(element: PanchangaElementType | 'graha' | 'rashi', key: string): TermData | null {
  if (element === 'tithi') {
    const k = getTithiKnowledge(key)
    if (!k) return null
    return {
      nameEn: k.nameEn, nameKn: k.nameKn, meaning: k.meaning,
      description: k.description, deity: k.deity, symbol: k.symbol,
      mantra: k.mantra,
      suitable: k.suitableActivities, avoid: k.avoidActivities,
      extra: {
        'Spiritual Significance': k.spiritualSignificance,
        'Fasting Observance':     k.fastingInfo,
        'Traditional Remedy':     k.remedy,
      },
      refs: ['Muhurta Chintamani', 'Dharma Sindhu', 'Brihat Samhita'],
    }
  }

  if (element === 'nakshatra') {
    const k = getNakshatraKnowledge(key)
    if (!k) return null
    return {
      nameEn: k.nameEn, nameKn: k.nameKn, meaning: k.meaning,
      description: k.description, deity: k.deity, symbol: k.symbol,
      mantra: k.mantra,
      suitable: k.suitableActivities, avoid: k.avoidActivities,
      extra: {
        'Planetary Ruler': k.ruler,
        'Gana':            k.gana,
        'Nature':          k.nature,
        'Element':         k.element,
        'Yoni':            k.yoni,
        'Tree':            k.tree,
        'Colour':          k.colour,
        'Strengths':       k.strengths.join('; '),
        'Challenges':      k.weaknesses.join('; '),
      },
      refs: ['BPHS', 'Brihat Samhita', 'Muhurta Chintamani', 'Jataka Parijata'],
    }
  }

  if (element === 'vara') {
    const k = getVaraKnowledge(key)
    if (!k) return null
    return {
      nameEn: k.nameEn, nameKn: k.nameKn, meaning: k.meaning,
      description: k.description, deity: k.deity,
      mantra: k.mantra,
      suitable: k.suitableActivities, avoid: k.avoidActivities,
      extra: {
        'Ruling Planet': k.planet,
        'Gem':           k.gem,
        'Metal':         k.metal,
        'Colour':        k.colour,
        'Spiritual Significance': k.spiritualSignificance,
        'Fasting Observance':     k.fastingInfo,
      },
      refs: ['Muhurta Chintamani', 'Dharma Sindhu'],
    }
  }

  return null
}

// ── Panel content ─────────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
function PanelContent({ data, lang: _lang }: { data: TermData; lang: string }) {
  return (
    <div className="space-y-4 text-sm">
      {/* Meaning */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Meaning</p>
        <p className="text-foreground/80 leading-relaxed">{data.meaning}</p>
      </div>

      {/* Description */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Description</p>
        <p className="text-foreground/80 leading-relaxed">{data.description}</p>
      </div>

      {/* Key facts grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted/30 px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Deity</p>
          <p className="text-xs font-medium text-foreground mt-0.5">{data.deity}</p>
        </div>
        {data.symbol && (
          <div className="rounded-lg bg-muted/30 px-3 py-2">
            <p className="text-[10px] text-muted-foreground">Symbol</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{data.symbol}</p>
          </div>
        )}
      </div>

      {/* Extra fields */}
      {Object.entries(data.extra).filter(([,v]) => v).map(([label, value]) => (
        <div key={label}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
          <p className="text-foreground/80 text-xs leading-relaxed">{value}</p>
        </div>
      ))}

      {/* Suitable */}
      {data.suitable.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-emerald-500/70 mb-1.5">Suitable Activities</p>
          <ul className="space-y-1">
            {data.suitable.slice(0, 4).map((a, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/70">
                <span className="text-emerald-500 shrink-0">✓</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Avoid */}
      {data.avoid.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-red-500/70 mb-1.5">Activities to Avoid</p>
          <ul className="space-y-1">
            {data.avoid.slice(0, 3).map((a, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/70">
                <span className="text-red-500 shrink-0">✗</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mantra */}
      {data.mantra && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1.5">Mantra</p>
          <p className="text-xs text-amber-300 leading-relaxed font-medium">{data.mantra}</p>
        </div>
      )}

      {/* Sources */}
      <div className="pt-3 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground/60">
          <span className="font-medium">Sources:</span>{' '}
          {data.refs.join(' · ')}
        </p>
        <p className="text-[10px] text-muted-foreground/40 mt-0.5">
          Calculations: VedRith Astronomy Engine · Knowledge: Classical texts
        </p>
      </div>
    </div>
  )
}

// ── Knowledge Panel ───────────────────────────────────────────────────────────

interface KnowledgePanelProps {
  element:  PanchangaElementType | 'graha' | 'rashi'
  termKey:  string
  onClose:  () => void
}

export function KnowledgePanel({ element, termKey, onClose }: KnowledgePanelProps) {
  const { lang }    = useTranslation()
  const panelRef    = useRef<HTMLDivElement>(null)
  const data        = resolveTermData(element, termKey)

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!data) return null

  const title = lang === 'kn' ? data.nameKn : data.nameEn
  const sub   = lang === 'kn' ? data.nameEn : data.nameKn

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog" aria-modal aria-labelledby="kp-title"
    >
      {/* Side panel on desktop, bottom sheet on mobile */}
      <div
        ref={panelRef}
        className="relative h-full sm:h-auto sm:max-h-[92vh] w-full sm:max-w-md bg-background border-t sm:border-l border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border bg-muted/20 shrink-0">
          <div>
            <h2 id="kp-title" className="font-semibold text-foreground leading-tight">{title}</h2>
            {sub !== title && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
            <span className="mt-1 inline-block text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {element}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-0.5"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <PanelContent data={data} lang={lang} />
        </div>
      </div>
    </div>
  )
}

// ── TermLink ──────────────────────────────────────────────────────────────────

interface TermLinkProps {
  element:    PanchangaElementType | 'graha' | 'rashi'
  termKey:    string
  children:   ReactNode
  className?: string
}

/**
 * Wraps any Vedic term — clicking opens the Knowledge Panel.
 *
 * @example
 *   <TermLink element="nakshatra" termKey="Rohini">Rohini</TermLink>
 *   <TermLink element="tithi" termKey="Purnima">ಹುಣ್ಣಿಮೆ</TermLink>
 */
export function TermLink({ element, termKey, children, className = '' }: TermLinkProps) {
  const [open, setOpen] = useState(false)

  // Only render the link if knowledge exists
  const data = resolveTermData(element, termKey)
  if (!data) return <span className={className}>{children}</span>

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Learn about ${termKey}`}
        title={`Tap to learn about ${data.nameEn}`}
        className={`group inline-flex items-center gap-1 cursor-pointer text-left hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded ${className}`}
      >
        <span className="underline underline-offset-4 decoration-dotted decoration-amber-500/40 group-hover:decoration-amber-400">
          {children}
        </span>
        <span className="text-amber-500/40 group-hover:text-amber-400 text-[10px] leading-none transition-colors" aria-hidden>ⓘ</span>
      </button>

      {open && (
        <KnowledgePanel
          element={element}
          termKey={termKey}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
