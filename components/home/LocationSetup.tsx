'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getStoredLocation, saveLocation, hasLocationBeenAsked,
  markLocationAsked, hasCustomLocation,
} from '@/lib/storage/preferences'
import { requestGPSLocation, searchCities, cityToLocation, locationDriftedSignificantly } from '@/lib/location/index'
import type { CitySearchResult } from '@/lib/location/index'
import type { StoredLocation } from '@/lib/storage/preferences'

interface LocationSetupProps {
  onLocationReady: (location: StoredLocation) => void
}

export function LocationSetup({ onLocationReady }: LocationSetupProps) {
  const [step, setStep]           = useState<'idle' | 'asking' | 'searching' | 'drift' | 'done'>('idle')
  const [cityQuery, setCityQuery] = useState('')
  const [results, setResults]     = useState<CitySearchResult[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [driftCoords, setDrift]   = useState<{ lat: number; lng: number } | null>(null)
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stored = getStoredLocation()

    // If never asked, show permission dialog
    if (!hasLocationBeenAsked()) {
      setStep('asking')
      return
    }

    // If has custom location, use it and check for drift
    if (hasCustomLocation()) {
      onLocationReady(stored)
      checkForDrift(stored)
      return
    }

    // Use default
    onLocationReady(stored)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function checkForDrift(stored: StoredLocation) {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      if (locationDriftedSignificantly(stored, pos.coords.latitude, pos.coords.longitude)) {
        setDrift({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStep('drift')
      }
    }, () => {}, { timeout: 5000, maximumAge: 10 * 60 * 1000 })
  }

  async function handleAllowGPS() {
    setLoading(true)
    setError(null)
    markLocationAsked()

    const result = await requestGPSLocation()

    if (result.success) {
      saveLocation(result.location)
      onLocationReady(result.location)
      setStep('done')
    } else {
      if (result.error === 'PERMISSION_DENIED') {
        setError('Location access was denied. Please search for your city below.')
      } else {
        setError('Could not detect location. Please search for your city.')
      }
      setStep('searching')
    }
    setLoading(false)
  }

  function handleSkip() {
    markLocationAsked()
    const stored = getStoredLocation()
    onLocationReady(stored)
    setStep('done')
  }

  function handleManualSearch() {
    markLocationAsked()
    setStep('searching')
  }

  const searchDebounced = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (!q.trim() || q.length < 2) { setResults([]); return }
      setLoading(true)
      const found = await searchCities(q)
      setResults(found)
      setLoading(false)
    }, 350)
  }, [])

  function onQueryChange(q: string) {
    setCityQuery(q)
    searchDebounced(q)
  }

  async function selectCity(city: CitySearchResult) {
    const loc = await cityToLocation(city)
    saveLocation(loc)
    onLocationReady(loc)
    setStep('done')
    setResults([])
    setCityQuery('')
  }

  async function keepCurrentLocation() {
    const stored = getStoredLocation()
    onLocationReady(stored)
    setDrift(null)
    setStep('done')
  }

  async function useNewLocation() {
    if (!driftCoords) return
    setLoading(true)
    const result = await requestGPSLocation()
    if (result.success) {
      saveLocation(result.location)
      onLocationReady(result.location)
    }
    setDrift(null)
    setStep('done')
    setLoading(false)
  }

  if (step === 'done' || step === 'idle') return null

  // ── Drift dialog ──────────────────────────────────────────────────────────
  if (step === 'drift') {
    return (
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full sm:max-w-sm rounded-2xl border border-border bg-background p-5 space-y-4 shadow-2xl">
          <div className="text-center">
            <p className="text-2xl mb-2">📍</p>
            <h3 className="font-semibold text-foreground">Your location has changed</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You appear to be more than 50 km from your saved location.<br />
              Would you like to update?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={useNewLocation}
              disabled={loading}
              className="flex-1 rounded-lg bg-amber-500 text-black text-sm font-semibold py-2.5 hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Use Current'}
            </button>
            <button
              onClick={keepCurrentLocation}
              className="flex-1 rounded-lg border border-border text-sm py-2.5 hover:bg-muted transition-colors"
            >
              Keep Previous
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Permission dialog ─────────────────────────────────────────────────────
  if (step === 'asking') {
    return (
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal aria-labelledby="loc-title">
        <div className="w-full sm:max-w-sm rounded-2xl border border-border bg-background p-5 space-y-4 shadow-2xl">
          <div className="text-center">
            <p className="text-3xl mb-2">🌅</p>
            <h3 id="loc-title" className="font-semibold text-foreground">Accurate Panchanga requires your location</h3>
          </div>

          <div className="rounded-xl bg-muted/50 p-3 space-y-1.5 text-xs text-muted-foreground">
            {['Accurate Sunrise & Sunset', 'Moonrise & Moonset', 'Rahu Kalam & Abhijit Muhurta', 'Timezone-precise Tithi boundaries', 'Local festival timing'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-amber-400">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground/70 text-center">
            Location data is stored only on your device. Never shared or uploaded.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleAllowGPS}
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 text-black font-semibold text-sm py-3 hover:bg-amber-400 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {loading ? 'Detecting location…' : '📍 Allow Location'}
            </button>
            <button
              onClick={handleManualSearch}
              className="w-full rounded-xl border border-border text-sm py-2.5 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              🔍 Search my city instead
            </button>
            <button
              onClick={handleSkip}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5"
            >
              Use Bengaluru (default) — change later
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── City search ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal aria-labelledby="city-title">
      <div className="w-full sm:max-w-sm rounded-2xl border border-border bg-background p-5 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 id="city-title" className="font-semibold text-foreground">Select your city</h3>
          <button onClick={handleSkip} aria-label="Close" className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted">✕</button>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="relative">
          <input
            autoFocus
            type="search"
            value={cityQuery}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Search city, town…"
            aria-label="Search for your city"
            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs animate-pulse">…</span>
          )}
        </div>

        {results.length > 0 && (
          <ul className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border" role="listbox" aria-label="City search results">
            {results.map((city, i) => (
              <li key={i}>
                <button
                  onClick={() => selectCity(city)}
                  role="option"
                  aria-selected={false}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:bg-muted"
                >
                  <span className="font-medium text-foreground">{city.displayName}</span>
                  {city.country && city.country !== 'India' && (
                    <span className="ml-1 text-xs text-muted-foreground">· {city.country}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {cityQuery.length >= 2 && results.length === 0 && !loading && (
          <p className="text-xs text-muted-foreground text-center py-2">No cities found. Try a different spelling.</p>
        )}

        <button onClick={() => { handleSkip(); }} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5">
          Skip — use Bengaluru (default)
        </button>
      </div>
    </div>
  )
}
