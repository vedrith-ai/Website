'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Next Change Countdown  [V1.1]
//
// Live countdown showing time until the next Tithi, Nakshatra, or Yoga change.
// Updates every second. Resets when the element changes.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/index'

interface NextChangeItem {
  label:   string   // e.g. "Tithi"
  labelKn: string
  current: string   // current value name
  endsAt:  Date     // when this element ends
}

interface NextChangeProps {
  items: NextChangeItem[]
  className?: string
}

// ── Format duration ───────────────────────────────────────────────────────────

function formatDuration(ms: number, lang: string): string {
  if (ms <= 0) return lang === 'kn' ? 'ಬದಲಾಗುತ್ತಿದೆ…' : 'Changing…'

  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`
  if (m > 0) return `${m}m ${pad(s)}s`
  return `${s}s`
}

// ── Single countdown item ─────────────────────────────────────────────────────

function CountdownItem({ item, lang }: { item: NextChangeItem; lang: string }) {
  const [remaining, setRemaining] = useState<number>(
    item.endsAt.getTime() - Date.now()
  )

  useEffect(() => {
    const tick = () => setRemaining(item.endsAt.getTime() - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [item.endsAt])

  const label   = lang === 'kn' ? item.labelKn : item.label
  const urgent  = remaining > 0 && remaining < 30 * 60 * 1000   // < 30 min

  return (
    <div className={`rounded-xl border p-3 space-y-1.5 transition-colors ${
      urgent ? 'border-amber-500/50 bg-amber-500/5' : 'border-border bg-muted/20'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {urgent && (
          <span className="text-[10px] text-amber-400 animate-pulse font-medium">
            {lang === 'kn' ? 'ಶೀಘ್ರ' : 'Soon'}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">
        {item.current}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground">
          {lang === 'kn' ? 'ಮುಗಿಯಲು' : 'ends in'}
        </span>
        <span className={`text-xs font-mono font-semibold tabular-nums ${
          urgent ? 'text-amber-400' : 'text-foreground/70'
        }`}>
          {formatDuration(remaining, lang)}
        </span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function NextChangeCountdown({ items, className = '' }: NextChangeProps) {
  const { lang, t } = useTranslation()

  if (!items.length) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('panchanga.next.change')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {items.map((item, i) => (
          <CountdownItem key={i} item={item} lang={lang} />
        ))}
      </div>
    </div>
  )
}

// ── Build NextChangeItem from PanchangaResult ─────────────────────────────────

interface PanchangaTimings {
  tithi?:     { name: string; nameLocal?: string; endTime?: Date }
  nakshatra?: { name: string; nameLocal?: string; endTime?: Date }
  yoga?:      { name: string; nameLocal?: string; endTime?: Date }
}

export function buildNextChangeItems(
  data:    PanchangaTimings,
  lang:    string,
  sunsetAt: Date,
): NextChangeItem[] {
  const items: NextChangeItem[] = []
  const fallbackEnd = new Date(sunsetAt.getTime() + 12 * 60 * 60 * 1000)

  if (data.tithi) {
    items.push({
      label:   'Tithi',
      labelKn: 'ತಿಥಿ',
      current: lang === 'kn'
        ? (data.tithi.nameLocal ?? data.tithi.name)
        : data.tithi.name,
      endsAt:  data.tithi.endTime ?? fallbackEnd,
    })
  }

  if (data.nakshatra) {
    items.push({
      label:   'Nakshatra',
      labelKn: 'ನಕ್ಷತ್ರ',
      current: lang === 'kn'
        ? (data.nakshatra.nameLocal ?? data.nakshatra.name)
        : data.nakshatra.name,
      endsAt:  data.nakshatra.endTime ?? fallbackEnd,
    })
  }

  if (data.yoga) {
    items.push({
      label:   'Yoga',
      labelKn: 'ಯೋಗ',
      current: data.yoga.name,
      endsAt:  data.yoga.endTime ?? fallbackEnd,
    })
  }

  return items
}
