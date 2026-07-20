'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Daily Recommendations Component  [V1.1 — New]
//
// Renders the dynamic activity recommendations with status badges and
// full explanations of WHY each recommendation applies today.
// ─────────────────────────────────────────────────────────────────────────────

import type { DailyRecommendations, ActivityRecommendation, RecommendationStatus } from '@/lib/engines/panchanga/recommendations'

interface DailyRecommendationsProps {
  recommendations: DailyRecommendations
}

const ACTIVITY_ICONS: Record<string, string> = {
  'Marriage':                    '💍',
  'Griha Pravesha (Home Entry)': '🏠',
  'Aksharabhyasa (First Writing)':'📝',
  'Upanayana (Sacred Thread Ceremony)': '🧵',
  'Vehicle Purchase':             '🚗',
  'Business Opening':             '🏪',
  'Travel':                       '✈️',
  'Land Purchase':                '🌿',
  'Bhoomi Puja (Ground Breaking)':'⛏️',
  'Naming Ceremony (Namakarana)': '🌸',
  'Annaprashana (First Solid Food)': '🍚',
}

const STATUS_STYLES: Record<RecommendationStatus, { badge: string; border: string; label: string; dot: string }> = {
  auspicious:   { badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', border: 'border-l-emerald-400', label: 'Auspicious', dot: '●' },
  inauspicious: { badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300', border: 'border-l-red-400', label: 'Inauspicious', dot: '●' },
  neutral:      { badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', border: 'border-l-gray-300 dark:border-l-gray-600', label: 'Mixed / Neutral', dot: '○' },
}

export function DailyRecommendationsPanel({ recommendations }: DailyRecommendationsProps) {
  const entries: ActivityRecommendation[] = Object.values(recommendations)

  const auspicious   = entries.filter(r => r.status === 'auspicious')
  const inauspicious = entries.filter(r => r.status === 'inauspicious')
  const neutral      = entries.filter(r => r.status === 'neutral')

  return (
    <section aria-label="Daily Recommendations" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">Daily Activity Guidance</h3>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="text-emerald-500">●</span> Auspicious ({auspicious.length})</span>
          <span className="flex items-center gap-1"><span className="text-red-500">●</span> Inauspicious ({inauspicious.length})</span>
          <span className="flex items-center gap-1"><span className="text-gray-400">○</span> Mixed ({neutral.length})</span>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map((rec) => {
          const s = STATUS_STYLES[rec.status]
          const icon = ACTIVITY_ICONS[rec.activity] ?? '📋'
          return (
            <details
              key={rec.activity}
              className={`group rounded-lg border border-border border-l-4 ${s.border} bg-background overflow-hidden`}
            >
              <summary className="flex cursor-pointer select-none items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors list-none">
                <span className="text-base leading-none" aria-hidden>{icon}</span>
                <span className="flex-1 text-sm font-medium text-foreground">{rec.activity}</span>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${s.badge}`}>
                  {s.label}
                </span>
                <span className="text-muted-foreground text-xs ml-1 group-open:rotate-90 transition-transform">▶</span>
              </summary>

              <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-3">
                {/* Reason */}
                <p className="text-sm text-foreground/80 leading-relaxed">{rec.reason}</p>

                {/* Contributing factors */}
                {rec.contributors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {rec.contributors.map((c: string, i: number) => (
                      <span key={i} className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Attribution */}
                <p className="text-[10px] text-muted-foreground/70">
                  Based on Muhurta Chintamani, Dharma Sindhu &amp; classical Muhurta rules
                </p>
              </div>
            </details>
          )
        })}
      </div>
    </section>
  )
}
