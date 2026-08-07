'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Today's Panchanga Dashboard  [V1.3]
//
// Automatically fetches today's Panchanga using stored location.
// No form submission required. Refreshes at midnight via SW message.
//
// V1.3 additions:
//  • Festival banner (from integrated engine)
//  • Deity of the day + mantra
//  • Spiritual message of the day
//  • Auspicious colour / number / direction
//  • Share card modal (ShareCardGenerator)
//  • Full PanchangaResult stored in state
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import { getStoredLocation, saveLastPanchanga, getLastPanchanga, addPanchangaHistory } from '@/lib/storage/preferences'
import type { StoredLocation } from '@/lib/storage/preferences'
import type { PanchangaResult } from '@/lib/types/panchanga'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Lazy-load share modal (contains canvas logic — not needed on first paint)
const ShareCardGenerator = dynamic(
  () => import('@/components/share/ShareCardGenerator').then(m => m.ShareCardGenerator),
  { ssr: false, loading: () => null }
)

interface TodayPanchangaProps {
  location: StoredLocation
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted/50 ${className}`} />
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4" aria-busy aria-label="Loading today's Panchanga">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
      </div>
      <Skeleton className="h-16 rounded-xl" />
    </div>
  )
}

// ── Mini anga card ────────────────────────────────────────────────────────────

function MiniCard({ label, value, sub, icon, highlight }: {
  label:      string
  value:      string
  sub?:       string
  icon:       string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-xl border p-3 transition-colors ${
      highlight
        ? 'border-amber-500/40 bg-amber-500/5'
        : 'border-border bg-muted/30 hover:bg-muted/50'
    }`}>
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-none">{label}</span>
        <span className="text-base leading-none" aria-hidden>{icon}</span>
      </div>
      <p className={`font-semibold text-sm leading-tight ${highlight ? 'text-amber-400' : 'text-foreground'}`}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{sub}</p>}
    </div>
  )
}

// ── Time row card ─────────────────────────────────────────────────────────────

function TimeCard({ label, time, icon, warn }: { label: string; time: string; icon: string; warn?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${
      warn ? 'border-red-400/20 bg-red-950/10' : 'border-border bg-muted/20'
    }`}>
      <span className="text-lg shrink-0" aria-hidden>{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">{label}</p>
        <p className={`text-sm font-semibold tabular-nums ${warn ? 'text-red-300' : 'text-foreground'}`}>{time}</p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function TodayPanchanga({ location }: TodayPanchangaProps) {
  const [result,  setResult]  = useState<PanchangaResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [offline, setOffline] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const today     = new Date()
  const dateLabel = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const fetchPanchanga = useCallback(async (loc: StoredLocation) => {
    setLoading(true)
    setError(null)

    // Quick-resume from summary cache while full fetch runs
    const cached = getLastPanchanga()
    if (cached && !result) {
      // Show cached skeleton data — replaced by full data below
      setLoading(false)
    }

    try {
      const params = new URLSearchParams({
        lat:      loc.lat.toString(),
        lng:      loc.lng.toString(),
        timezone: loc.timezone,
        date:     today.toISOString().slice(0, 10),
        lang:     'kn',
        region:   'KANNADA',
      })

      const res  = await fetch(`/api/v1/panchanga/daily?${params}`)
      const json = await res.json()

      if (!json.success) throw new Error(json.error?.message ?? 'API error')

      const d: PanchangaResult = json.data
      setResult(d)
      setOffline(false)

      // Cache summary for offline quick-resume
      saveLastPanchanga({
        date:         today.toISOString().slice(0, 10),
        locationName: loc.name,
        tithi:        d.tithi?.name ?? '',
        nakshatra:    d.nakshatra?.name ?? '',
        yoga:         d.yoga?.name ?? '',
        vara:         d.vara?.name ?? '',
        sunrise:      d.sunriseLocal ?? '',
        sunset:       d.sunsetLocal ?? '',
      })

      // [V1.3] Add to panchanga history for Personal Dashboard
      addPanchangaHistory({
        date:         today.toISOString().slice(0, 10),
        locationName: loc.name,
        tithi:        d.tithi?.name ?? '',
        nakshatra:    d.nakshatra?.name ?? '',
        vara:         d.vara?.name ?? '',
        festival:     d.festivals?.[0]?.nameEn,
      })
    } catch {
      if (!cached && !result) {
        setError(navigator.onLine ? 'Could not load Panchanga. Please try again.' : null)
        setOffline(!navigator.onLine)
      }
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPanchanga(location)
  }, [location, fetchPanchanga])

  // Refresh on midnight event (from Service Worker)
  useEffect(() => {
    const handler = () => fetchPanchanga(getStoredLocation())
    window.addEventListener('vedrith:date-changed', handler)
    return () => window.removeEventListener('vedrith:date-changed', handler)
  }, [fetchPanchanga])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section aria-label="Today's Panchanga" className="space-y-4">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="font-kannada">ಇಂದಿನ ಪಂಚಾಂಗ</span>
            <span className="text-sm font-normal text-muted-foreground">{dateLabel}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span aria-hidden>📍</span>
            <span>{location.name}</span>
            {offline && <span className="text-amber-400">(offline — cached data)</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Share today's Panchanga"
            >
              <span aria-hidden>📤</span> Share
            </button>
          )}
          <Link
            href="/panchanga"
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium underline underline-offset-4 decoration-dotted"
          >
            Full Panchanga →
          </Link>
        </div>
      </div>

      {/* Share modal */}
      {showShare && result && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal
          aria-label="Share Today's Panchanga"
          onClick={e => { if (e.target === e.currentTarget) setShowShare(false) }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
            <div className="sticky top-0 z-10 bg-background border-b border-border px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Share Today&apos;s Panchanga</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Choose a theme, format, and share</p>
              </div>
              <button
                onClick={() => setShowShare(false)}
                aria-label="Close share dialog"
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <ShareCardGenerator result={result} inline />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading && !result ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-300 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={() => fetchPanchanga(location)}
            className="shrink-0 rounded-lg border border-red-400/30 px-3 py-1 text-xs hover:bg-red-900/30 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : offline && !result ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-300">
          You&apos;re offline. Cached data will appear here once reconnected.
        </div>
      ) : result ? (
        <div className="space-y-3">

          {/* Festival Banner — shown when there's a festival today */}
          {result.festivals && result.festivals.length > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-amber-600/5 px-4 py-3 flex items-center gap-3">
              <span className="text-2xl shrink-0" aria-hidden>🎉</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 font-medium">
                  {result.festivals.length > 1 ? `Today's Festivals (${result.festivals.length})` : "Today's Festival"}
                </p>
                <p className="text-sm font-semibold text-amber-300 leading-tight">
                  <span className="font-kannada">{result.festivals[0].nameKn}</span>
                  <span className="text-amber-400/60 mx-1.5">·</span>
                  <span className="text-amber-400">{result.festivals[0].nameEn}</span>
                </p>
                {result.festivals.length > 1 && (
                  <p className="text-[11px] text-amber-400/60 mt-0.5">
                    {result.festivals.slice(1).map(f => f.nameEn).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Five Angas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <MiniCard
              label="ತಿಥಿ"
              value={result.tithi.nameLocal || result.tithi.name}
              sub={result.tithi.pakshaName ? `${result.tithi.pakshaName} ಪಕ್ಷ` : undefined}
              icon="🌙"
              highlight
            />
            <MiniCard
              label="ನಕ್ಷತ್ರ"
              value={result.nakshatra.nameLocal || result.nakshatra.name}
              icon="⭐"
            />
            <MiniCard
              label="ಯೋಗ"
              value={result.yoga.displayName || result.yoga.name}
              icon="🔆"
            />
            <MiniCard
              label="ಕರಣ"
              value={result.karana.displayName || result.karana.name}
              icon="🔱"
            />
            <MiniCard
              label="ವಾರ"
              value={result.vara.nameLocal || result.vara.displayName || result.vara.name}
              sub={result.masa?.current.displayName || result.masa?.current.name}
              icon="📅"
            />
          </div>

          {/* Sunrise / Sunset / Moon / Rahu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <TimeCard label="ಸೂರ್ಯೋದಯ" time={result.sunriseLocal}    icon="🌅" />
            <TimeCard label="ಸೂರ್ಯಾಸ್ತ"  time={result.sunsetLocal}     icon="🌇" />
            {result.moonriseLocal && (
              <TimeCard label="ಚಂದ್ರೋದಯ" time={result.moonriseLocal} icon="🌕" />
            )}
            {result.rahuKalam && (
              <TimeCard
                label="ರಾಹು ಕಾಲ"
                time={`${result.rahuKalam.startLocal} – ${result.rahuKalam.endLocal}`}
                icon="⚠️"
                warn
              />
            )}
          </div>

          {/* Deity of the day + Spiritual message row */}
          {result.dailyDeity && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

              {/* Deity card */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-start gap-3">
                <span className="text-3xl shrink-0 mt-0.5" aria-hidden>{result.dailyDeity.symbol}</span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    ಇಂದಿನ ದೈವ / Deity of the Day
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    <span className="font-kannada">{result.dailyDeity.nameKn}</span>
                    <span className="text-muted-foreground text-xs ml-1.5">· {result.dailyDeity.nameEn}</span>
                  </p>
                  <p className="text-xs text-amber-400 italic mt-1">{result.dailyDeity.mantraEn}</p>
                  {result.dailyDeity.mantraKn && (
                    <p className="text-[11px] text-amber-400/70 font-kannada">{result.dailyDeity.mantraKn}</p>
                  )}
                </div>
              </div>

              {/* Auspicious panel */}
              {result.dailyAuspicious && (
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2.5">
                    ಶುಭ ಸಂಕೇತ / Auspicious Today
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">ಬಣ್ಣ</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        <span className="font-kannada">{result.dailyAuspicious.colour.kn}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">{result.dailyAuspicious.colour.en}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">ಸಂಖ್ಯೆ</p>
                      <p className="text-lg font-bold text-amber-400">{result.dailyAuspicious.number}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">ದಿಕ್ಕು</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        <span className="font-kannada">{result.dailyAuspicious.direction.kn}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">{result.dailyAuspicious.direction.en}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Spiritual message */}
          {result.spiritualMessage && (
            <div className="rounded-xl border border-border/60 bg-muted/10 px-5 py-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                ಆಧ್ಯಾತ್ಮಿಕ ಸಂದೇಶ / Spiritual Message
              </p>
              <p className="text-sm font-kannada text-foreground leading-relaxed">
                {result.spiritualMessage.messageKn}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed italic">
                {result.spiritualMessage.messageEn}
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-2">
                — {result.spiritualMessage.sourceEn}
              </p>
            </div>
          )}

          {/* Abhijit Muhurta */}
          {result.abhijitMuhurta && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-medium">ಅಭಿಜಿತ್ ಮುಹೂರ್ತ / Abhijit Muhurta</p>
                <p className="text-sm font-semibold text-amber-300 tabular-nums">
                  {result.abhijitMuhurta.startLocal} – {result.abhijitMuhurta.endLocal}
                </p>
              </div>
              <span className="text-xl shrink-0" aria-hidden>✨</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/panchanga"
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 transition-all py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span>ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ</span>
              <span aria-hidden>→</span>
            </Link>
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 text-foreground transition-all py-2.5 px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Download or share today's Panchanga image"
            >
              <span aria-hidden>📤</span>
              <span>Download / Share</span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
