'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Home Dashboard  [V1.3]
//
// Client wrapper that:
//   1. Manages location permission flow on first visit
//   2. Fetches and displays Today's Panchanga automatically (with festivals,
//      deity, spiritual message, share card — V1.3)
//   3. Shows Personal Dashboard (history, favourites — no login)
//
// Desktop: two-column grid — Panchanga left (2/3) + Dashboard right (1/3)
// Mobile:  single column — Panchanga first, Dashboard below
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { LocationSetup }      from './LocationSetup'
import { TodayPanchanga }     from './TodayPanchanga'
import { PersonalDashboard }  from './PersonalDashboard'
import type { StoredLocation } from '@/lib/storage/preferences'

export function HomeDashboard() {
  const [location, setLocation] = useState<StoredLocation | null>(null)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <HomeDashboardSkeleton />

  return (
    <>
      {/* Location permission flow — shown only on first visit or when needed */}
      <LocationSetup onLocationReady={setLocation} />

      {/* Dashboard — shown once location is resolved */}
      {location && (
        <section
          id="today"
          aria-label="Today's Panchanga Dashboard"
          className="w-full border-t border-b border-border/40 bg-gradient-to-b from-background via-muted/10 to-background py-10 px-4"
        >
          <div className="max-w-6xl mx-auto">
            {/* Two-column layout on lg+, single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 xl:gap-12">

              {/* Left: Today's full Panchanga */}
              <div>
                <TodayPanchanga location={location} />
              </div>

              {/* Right: Personal dashboard — hidden on mobile (shown below) */}
              <aside className="hidden lg:block">
                <div className="sticky top-6 space-y-1">
                  <PersonalDashboard />
                </div>
              </aside>
            </div>

            {/* Mobile: Personal dashboard below Panchanga */}
            <div className="mt-8 lg:hidden">
              <div className="border-t border-border/40 pt-8">
                <PersonalDashboard />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function HomeDashboardSkeleton() {
  return (
    <section
      aria-hidden
      className="w-full border-t border-b border-border/40 bg-gradient-to-b from-background via-muted/10 to-background py-10 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-44 rounded-lg bg-muted/50 animate-pulse" />
              <div className="h-4 w-24 rounded-lg bg-muted/40 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-muted/30 animate-pulse" />
              ))}
            </div>
            <div className="h-24 rounded-xl bg-muted/20 animate-pulse" />
          </div>
          <div className="hidden lg:block space-y-3">
            <div className="h-5 w-28 rounded bg-muted/40 animate-pulse" />
            <div className="h-16 rounded-xl bg-muted/30 animate-pulse" />
            <div className="h-16 rounded-xl bg-muted/25 animate-pulse" />
            <div className="h-16 rounded-xl bg-muted/20 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
