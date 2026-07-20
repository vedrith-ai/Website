'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Knowledge Popup Component  [V1.1 — New]
//
// Renders a modal popup with traditional knowledge for any Panchanga element.
// Uses Tailwind CSS only — no additional libraries.
//
// Source Attribution displayed in every popup:
//   • Calculations: VedRith Astronomical Engine (pure TypeScript)
//   • Knowledge: Classical texts (Muhurta Chintamani, Dharma Sindhu, etc.)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import type { TithiKnowledge }     from '@/lib/knowledge/tithi-knowledge'
import type { NakshatraKnowledge } from '@/lib/knowledge/nakshatra-knowledge'
import type { VaraKnowledge }      from '@/lib/knowledge/vara-knowledge'

// ── Union type for any knowledge entry ───────────────────────────────────────
export type KnowledgeEntry =
  | ({ _type: 'tithi' }     & TithiKnowledge)
  | ({ _type: 'nakshatra' } & NakshatraKnowledge)
  | ({ _type: 'vara' }      & VaraKnowledge)
  | ({ _type: 'simple'; nameEn: string; nameKn: string; meaning: string; description: string; suitableActivities?: string[]; avoidActivities?: string[] })

interface KnowledgePopupProps {
  entry:   KnowledgeEntry | null
  onClose: () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Badge({ label, variant }: { label: string; variant: 'blue' | 'green' | 'amber' | 'red' | 'purple' }) {
  const colours: Record<typeof variant, string> = {
    blue:   'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    green:  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    amber:  'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    red:    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  }
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colours[variant]}`}>{label}</span>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {children}
    </div>
  )
}

function ListItems({ items, variant }: { items: string[]; variant: 'green' | 'red' }) {
  const dot = variant === 'green'
    ? 'text-emerald-500'
    : 'text-red-500'
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground/80">
          <span className={`mt-0.5 shrink-0 font-bold ${dot}`}>{variant === 'green' ? '✓' : '✗'}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ── Tithi popup content ───────────────────────────────────────────────────────

function TithiContent({ k }: { k: TithiKnowledge }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Badge label={`Deity: ${k.deity}`} variant="purple" />
        <Badge label={`Symbol: ${k.symbol}`} variant="blue" />
      </div>

      <Section title="Meaning">
        <p className="text-sm text-foreground/80">{k.meaning}</p>
      </Section>

      <Section title="Description">
        <p className="text-sm text-foreground/80">{k.description}</p>
      </Section>

      <Section title="Spiritual Significance">
        <p className="text-sm text-foreground/80">{k.spiritualSignificance}</p>
      </Section>

      <Section title="Recommended Activities">
        <ListItems items={k.suitableActivities} variant="green" />
      </Section>

      <Section title="Activities to Avoid">
        <ListItems items={k.avoidActivities} variant="red" />
      </Section>

      <Section title="Mantra">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300 leading-relaxed">{k.mantra}</p>
      </Section>

      <Section title="Fasting Observance">
        <p className="text-sm text-foreground/80">{k.fastingInfo}</p>
      </Section>

      <Section title="Traditional Remedy">
        <p className="text-sm text-foreground/80">{k.remedy}</p>
      </Section>
    </div>
  )
}

// ── Nakshatra popup content ───────────────────────────────────────────────────

function NakshatraContent({ k }: { k: NakshatraKnowledge }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Badge label={`Ruler: ${k.ruler}`} variant="purple" />
        <Badge label={`Gana: ${k.gana}`} variant="blue" />
        <Badge label={`Nature: ${k.nature}`} variant="amber" />
        <Badge label={`Element: ${k.element}`} variant="green" />
        <Badge label={`Yoni: ${k.yoni}`} variant="red" />
      </div>

      <Section title="Meaning">
        <p className="text-sm text-foreground/80">{k.meaning}</p>
      </Section>

      <Section title="Description">
        <p className="text-sm text-foreground/80">{k.description}</p>
      </Section>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="text-muted-foreground text-xs">Deity</span><p className="font-medium">{k.deity}</p></div>
        <div><span className="text-muted-foreground text-xs">Symbol</span><p className="font-medium">{k.symbol}</p></div>
        <div><span className="text-muted-foreground text-xs">Tree</span><p className="font-medium">{k.tree}</p></div>
        <div><span className="text-muted-foreground text-xs">Animal</span><p className="font-medium">{k.animal}</p></div>
        <div><span className="text-muted-foreground text-xs">Colour</span><p className="font-medium">{k.colour}</p></div>
      </div>

      <Section title="Strengths">
        <ListItems items={k.strengths} variant="green" />
      </Section>

      <Section title="Weaknesses / Challenges">
        <ListItems items={k.weaknesses} variant="red" />
      </Section>

      <Section title="Suitable Activities">
        <ListItems items={k.suitableActivities} variant="green" />
      </Section>

      <Section title="Activities to Avoid">
        <ListItems items={k.avoidActivities} variant="red" />
      </Section>

      <Section title="Nakshatra Devata Mantra">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300 leading-relaxed">{k.mantra}</p>
      </Section>
    </div>
  )
}

// ── Vara popup content ────────────────────────────────────────────────────────

function VaraContent({ k }: { k: VaraKnowledge }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Badge label={`Planet: ${k.planet}`} variant="purple" />
        <Badge label={`Gem: ${k.gem}`} variant="blue" />
        <Badge label={`Metal: ${k.metal}`} variant="amber" />
        <Badge label={`Colour: ${k.colour}`} variant="green" />
      </div>

      <Section title="Ruling Deity">
        <p className="text-sm font-medium">{k.deity}</p>
      </Section>

      <Section title="Meaning">
        <p className="text-sm text-foreground/80">{k.meaning}</p>
      </Section>

      <Section title="Description">
        <p className="text-sm text-foreground/80">{k.description}</p>
      </Section>

      <Section title="Spiritual Significance">
        <p className="text-sm text-foreground/80">{k.spiritualSignificance}</p>
      </Section>

      <Section title="Suitable Activities">
        <ListItems items={k.suitableActivities} variant="green" />
      </Section>

      <Section title="Activities to Avoid">
        <ListItems items={k.avoidActivities} variant="red" />
      </Section>

      <Section title="Day Mantra">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300 leading-relaxed">{k.mantra}</p>
      </Section>

      <Section title="Fasting Observance">
        <p className="text-sm text-foreground/80">{k.fastingInfo}</p>
      </Section>
    </div>
  )
}

// ── Simple popup content (Yoga / Karana) ─────────────────────────────────────

function SimpleContent({ k }: { k: Extract<KnowledgeEntry, { _type: 'simple' }> }) {
  return (
    <div className="space-y-5">
      <Section title="Meaning">
        <p className="text-sm text-foreground/80">{k.meaning}</p>
      </Section>
      <Section title="Description">
        <p className="text-sm text-foreground/80">{k.description}</p>
      </Section>
      {k.suitableActivities && k.suitableActivities.length > 0 && (
        <Section title="Suitable Activities">
          <ListItems items={k.suitableActivities} variant="green" />
        </Section>
      )}
      {k.avoidActivities && k.avoidActivities.length > 0 && (
        <Section title="Activities to Avoid">
          <ListItems items={k.avoidActivities} variant="red" />
        </Section>
      )}
    </div>
  )
}

// ── Source attribution footer ─────────────────────────────────────────────────

function AttributionFooter() {
  return (
    <div className="mt-6 pt-4 border-t border-border/50 space-y-1">
      <p className="text-[10px] text-muted-foreground">
        <span className="font-semibold">Calculations:</span> VedRith Astronomical Engine (pure TypeScript, no Swiss Ephemeris)
      </p>
      <p className="text-[10px] text-muted-foreground">
        <span className="font-semibold">Traditional Knowledge:</span> Muhurta Chintamani (Rama Dayalu), Dharma Sindhu (Kashinath Upadhyaya), Brihat Samhita (Varahamihira), Jataka Parijata
      </p>
    </div>
  )
}

// ── Main popup component ──────────────────────────────────────────────────────

export function KnowledgePopup({ entry, onClose }: KnowledgePopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (entry) document.body.style.overflow = 'hidden'
    else        document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [entry])

  if (!entry) return null

  const title = `${entry.nameEn} (${entry.nameKn})`

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Panel */}
      <div className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[85dvh] flex flex-col bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border bg-muted/30">
          <div>
            <h3 className="text-base font-semibold leading-snug">{entry.nameEn}</h3>
            <p className="text-sm text-muted-foreground font-kannada">{entry.nameKn}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 mt-0.5 rounded-full w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {entry._type === 'tithi'     && <TithiContent     k={entry} />}
          {entry._type === 'nakshatra' && <NakshatraContent k={entry} />}
          {entry._type === 'vara'      && <VaraContent      k={entry} />}
          {entry._type === 'simple'    && <SimpleContent    k={entry} />}
          <AttributionFooter />
        </div>
      </div>
    </div>
  )
}

// ── Trigger wrapper ───────────────────────────────────────────────────────────

interface KnowledgeTriggerProps {
  children:  React.ReactNode
  onOpen:    () => void
  className?: string
  title?:    string
}

/**
 * Wraps any child element to become a clickable knowledge trigger.
 * Shows a subtle underline and info cursor.
 */
export function KnowledgeTrigger({ children, onOpen, className = '', title }: KnowledgeTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title={title ?? 'Tap to learn more'}
      className={`group inline-flex items-center gap-1 cursor-pointer text-left hover:text-primary transition-colors ${className}`}
    >
      <span className="underline underline-offset-4 decoration-dotted decoration-primary/50 group-hover:decoration-primary">
        {children}
      </span>
      <span className="text-primary/50 group-hover:text-primary text-xs leading-none transition-colors" aria-hidden>ⓘ</span>
    </button>
  )
}
