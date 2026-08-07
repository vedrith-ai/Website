'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Personal Dashboard  [V1.3]
//
// Shows the user's local history and preferences WITHOUT any login.
// All data is stored in browser localStorage only.
//
// Displays:
//  • Recent Kundalis
//  • Panchanga history
//  • Favourite locations
//  • Recent searches
//  • Preferences summary + link to settings
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getRecentKundalis,
  getPanchangaHistory,
  getFavouriteLocations,
  getRecentSearches,
  clearRecentSearches,
  clearPanchangaHistory,
  getPreferences,
  type RecentKundali,
  type PanchangaHistoryEntry,
  type FavouriteLocation,
  type RecentSearch,
} from '@/lib/storage/preferences'

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ title, count, onClear }: {
  title:   string
  count:   number
  onClear?: () => void
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
        {count > 0 && (
          <span className="ml-1.5 rounded-full bg-muted/60 px-1.5 py-0.5 text-[10px] font-normal">{count}</span>
        )}
      </h3>
      {onClear && count > 0 && (
        <button
          onClick={onClear}
          className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ message, icon }: { message: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border/40 px-4 py-3 text-xs text-muted-foreground/60">
      <span aria-hidden className="text-base">{icon}</span>
      <span>{message}</span>
    </div>
  )
}

// ── Kundali item ──────────────────────────────────────────────────────────────

function KundaliItem({ k }: { k: RecentKundali }) {
  const age = Math.floor((Date.now() - new Date(k.viewedAt).getTime()) / (1000 * 60 * 60 * 24))
  return (
    <Link
      href={`/kundali?id=${k.id}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors"
    >
      <span className="text-lg shrink-0" aria-hidden>🔮</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{k.name}</p>
        <p className="text-[11px] text-muted-foreground">{k.dob} · {k.pob}</p>
      </div>
      <div className="text-right shrink-0">
        {k.lagna && <p className="text-[11px] text-amber-400">{k.lagna} Lagna</p>}
        <p className="text-[10px] text-muted-foreground/60">{age === 0 ? 'Today' : `${age}d ago`}</p>
      </div>
      <span className="text-muted-foreground/40 group-hover:translate-x-0.5 transition-transform text-sm" aria-hidden>›</span>
    </Link>
  )
}

// ── Panchanga history item ────────────────────────────────────────────────────

function PanchangaHistoryItem({ h }: { h: PanchangaHistoryEntry }) {
  return (
    <Link
      href={`/panchanga?date=${h.date}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors"
    >
      <span className="text-lg shrink-0" aria-hidden>📅</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {new Date(h.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {h.tithi} · {h.nakshatra}
          {h.festival && ` · 🎉 ${h.festival}`}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px] text-muted-foreground/60 truncate max-w-[80px]">{h.locationName}</p>
      </div>
      <span className="text-muted-foreground/40 group-hover:translate-x-0.5 transition-transform text-sm" aria-hidden>›</span>
    </Link>
  )
}

// ── Favourite location item ───────────────────────────────────────────────────

function FavouriteItem({ f }: { f: FavouriteLocation }) {
  return (
    <button
      className="group flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors text-left w-full"
      onClick={() => {
        // Dispatch event to switch to this location
        window.dispatchEvent(new CustomEvent('vedrith:switch-location', { detail: f }))
      }}
    >
      <span className="text-lg shrink-0" aria-hidden>📍</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{f.label || f.name}</p>
        <p className="text-[11px] text-muted-foreground">{f.timezone} · {f.region}</p>
      </div>
      <span className="text-[10px] text-amber-400/70 shrink-0">Set</span>
    </button>
  )
}

// ── Recent search pill ────────────────────────────────────────────────────────

const SEARCH_TYPE_ICONS: Record<string, string> = {
  panchanga:  '📅',
  kundali:    '🔮',
  knowledge:  '📖',
  festival:   '🎉',
}

function SearchItem({ s }: { s: RecentSearch }) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(s.query)}`}
      className="flex items-center gap-1.5 rounded-full border border-border bg-muted/20 hover:bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors"
    >
      <span aria-hidden>{SEARCH_TYPE_ICONS[s.type] ?? '🔍'}</span>
      <span className="truncate max-w-[140px]">{s.query}</span>
    </Link>
  )
}

// ── Preferences badge ─────────────────────────────────────────────────────────

function PrefBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-center">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <p className="text-xs font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export function PersonalDashboard() {
  const [kundalis,   setKundalis]   = useState<RecentKundali[]>([])
  const [history,    setHistory]    = useState<PanchangaHistoryEntry[]>([])
  const [favourites, setFavourites] = useState<FavouriteLocation[]>([])
  const [searches,   setSearches]   = useState<RecentSearch[]>([])
  const [prefs,      setPrefs]      = useState({ lang: 'kn', chartStyle: 'south', regionalTrad: 'Karnataka' })

  useEffect(() => {
    setKundalis(getRecentKundalis())
    setHistory(getPanchangaHistory())
    setFavourites(getFavouriteLocations())
    setSearches(getRecentSearches())
    const p = getPreferences()
    setPrefs({ lang: p.lang, chartStyle: p.chartStyle, regionalTrad: p.regionalTrad })
  }, [])

  const hasAnyData = kundalis.length > 0 || history.length > 0 || favourites.length > 0 || searches.length > 0

  return (
    <section aria-label="Personal Dashboard" className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <span aria-hidden>🗃️</span>
            My Dashboard
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your local history — no account needed
          </p>
        </div>
        <Link
          href="/settings"
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
          aria-label="Open preferences settings"
        >
          Settings →
        </Link>
      </div>

      {/* Preferences quick summary */}
      <div className="grid grid-cols-3 gap-2">
        <PrefBadge label="Language"   value={prefs.lang === 'kn' ? 'ಕನ್ನಡ' : 'English'} />
        <PrefBadge label="Chart"      value={prefs.chartStyle === 'south' ? 'South Indian' : 'North Indian'} />
        <PrefBadge label="Region"     value={prefs.regionalTrad} />
      </div>

      {!hasAnyData ? (
        <div className="rounded-xl border border-border/40 bg-muted/10 px-5 py-8 text-center">
          <p className="text-3xl mb-2">🌟</p>
          <p className="text-sm font-medium text-foreground">Welcome to VedRith!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your Kundalis, Panchanga history, and favourite locations will appear here.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Link href="/panchanga" className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors">
              View Panchanga
            </Link>
            <Link href="/kundali" className="rounded-lg border border-border bg-muted/30 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
              Generate Kundali
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Recent Kundalis */}
          <div>
            <SectionHeader title="Recent Kundalis" count={kundalis.length} />
            {kundalis.length > 0 ? (
              <div className="space-y-2">
                {kundalis.map(k => <KundaliItem key={k.id} k={k} />)}
                <Link href="/kundali" className="block text-center text-xs text-amber-400 hover:text-amber-300 py-1 transition-colors">
                  Generate new →
                </Link>
              </div>
            ) : (
              <EmptyState message="No Kundalis yet. Generate one to get started." icon="🔮" />
            )}
          </div>

          {/* Panchanga History */}
          {history.length > 0 && (
            <div>
              <SectionHeader
                title="Panchanga History"
                count={history.length}
                onClear={() => { clearPanchangaHistory(); setHistory([]) }}
              />
              <div className="space-y-2">
                {history.slice(0, 4).map(h => <PanchangaHistoryItem key={`${h.date}-${h.locationName}`} h={h} />)}
              </div>
            </div>
          )}

          {/* Favourite Locations */}
          {favourites.length > 0 && (
            <div>
              <SectionHeader title="Favourite Locations" count={favourites.length} />
              <div className="space-y-2">
                {favourites.map(f => <FavouriteItem key={`${f.lat}-${f.lng}`} f={f} />)}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {searches.length > 0 && (
            <div>
              <SectionHeader
                title="Recent Searches"
                count={searches.length}
                onClear={() => { clearRecentSearches(); setSearches([]) }}
              />
              <div className="flex flex-wrap gap-2">
                {searches.slice(0, 8).map(s => <SearchItem key={s.query} s={s} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
