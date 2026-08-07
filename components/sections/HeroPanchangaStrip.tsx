'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Hero Panchanga Strip  [V1.3]
//
// A compact live strip embedded inside HeroSection that shows:
//   Vara · Tithi · Nakshatra · Yoga · Festival (if any)
//   Sunrise · Sunset
//
// Fetches from /api/v1/panchanga/daily using stored location.
// Shows a skeleton while loading; fades in when ready.
// Does NOT duplicate calculation — reuses the same API the dashboard uses.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { getStoredLocation }    from '@/lib/storage/preferences'
import Link                     from 'next/link'

interface StripData {
  vara:      string
  tithi:     string
  nakshatra: string
  yoga:      string
  sunrise:   string
  sunset:    string
  festival?: string
  deity?:    { symbol: string; nameEn: string; mantraEn: string }
}

// ── Pill ──────────────────────────────────────────────────────────────────────

function Pill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
      <span className="text-xs" aria-hidden>{icon}</span>
      <span className="text-[10px] text-white/50 uppercase tracking-wider hidden sm:inline">{label}</span>
      <span className="text-xs font-medium text-white/90">{value}</span>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function HeroPanchangaStrip() {
  const [data,    setData]    = useState<StripData | null>(null)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const loc = getStoredLocation()
    if (!loc) return

    setLoading(true)

    const today  = new Date().toISOString().slice(0, 10)
    const params = new URLSearchParams({
      lat:      loc.lat.toString(),
      lng:      loc.lng.toString(),
      timezone: loc.timezone,
      date:     today,
      lang:     'kn',
      region:   'KANNADA',
    })

    fetch(`/api/v1/panchanga/daily?${params}`)
      .then(r => r.json())
      .then(json => {
        if (!json.success) return
        const d = json.data
        setData({
          vara:      d.vara?.nameLocal || d.vara?.name || '',
          tithi:     d.tithi?.nameLocal || d.tithi?.name || '',
          nakshatra: d.nakshatra?.nameLocal || d.nakshatra?.name || '',
          yoga:      d.yoga?.displayName || d.yoga?.name || '',
          sunrise:   d.sunriseLocal || '',
          sunset:    d.sunsetLocal  || '',
          festival:  d.festivals?.[0]?.nameEn,
          deity:     d.dailyDeity ? {
            symbol:   d.dailyDeity.symbol,
            nameEn:   d.dailyDeity.nameEn,
            mantraEn: d.dailyDeity.mantraEn,
          } : undefined,
        })
        // Small delay so the fade-in is visible
        setTimeout(() => setVisible(true), 100)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && !data) return null

  return (
    <div
      className={`w-full transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      aria-label="Today's Panchanga quick preview"
    >
      {/* Festival banner */}
      {data?.festival && (
        <div className="mb-3 flex items-center justify-center gap-2">
          <span aria-hidden className="text-base">🎉</span>
          <span className="text-xs font-medium text-amber-300">{data.festival}</span>
        </div>
      )}

      {/* Panchanga pills */}
      {data ? (
        <div className="flex flex-wrap justify-center gap-2">
          {data.vara      && <Pill icon="📅" label="Vara"      value={data.vara} />}
          {data.tithi     && <Pill icon="🌙" label="Tithi"     value={data.tithi} />}
          {data.nakshatra && <Pill icon="⭐" label="Nakshatra" value={data.nakshatra} />}
          {data.yoga      && <Pill icon="🔆" label="Yoga"      value={data.yoga} />}
          {data.sunrise   && <Pill icon="🌅" label="Sunrise"   value={data.sunrise} />}
          {data.sunset    && <Pill icon="🌇" label="Sunset"    value={data.sunset} />}
        </div>
      ) : (
        /* Loading skeleton */
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-7 rounded-full bg-white/5 border border-white/10 animate-pulse"
              style={{ width: `${60 + i * 12}px` }}
            />
          ))}
        </div>
      )}

      {/* Deity strip */}
      {data?.deity && (
        <div className="mt-3 flex items-center justify-center gap-2 text-white/60">
          <span className="text-base" aria-hidden>{data.deity.symbol}</span>
          <span className="text-xs">{data.deity.nameEn}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-xs italic text-white/50">{data.deity.mantraEn}</span>
        </div>
      )}

      {/* Link to full panchanga */}
      <div className="mt-4 flex justify-center">
        <Link
          href="#today"
          className="text-[11px] text-amber-400/80 hover:text-amber-300 transition-colors underline underline-offset-4 decoration-dotted"
        >
          View Full Panchanga ↓
        </Link>
      </div>
    </div>
  )
}
