'use client'

import { useState, useCallback, type FormEvent } from 'react'

export type RegionKey =
  | 'KANNADA' | 'TELUGU' | 'TAMIL' | 'MALAYALAM'
  | 'GUJARATI' | 'MAHARASHTRIAN' | 'BENGALI' | 'NORTH_INDIAN'

export interface PanchangaFormValues {
  date:         string
  lat:          number
  lng:          number
  timezone:     string
  locationName: string
  region:       RegionKey
  ayanamsha:    'LAHIRI' | 'KP' | 'RAMAN' | 'TRUE_CHITRA'
}

interface Props {
  onSubmit:  (values: PanchangaFormValues) => void
  loading:   boolean
}

const REGIONS: { value: RegionKey; label: string }[] = [
  { value: 'NORTH_INDIAN',  label: 'North Indian'   },
  { value: 'TELUGU',        label: 'Telugu'          },
  { value: 'TAMIL',         label: 'Tamil'           },
  { value: 'KANNADA',       label: 'Kannada'         },
  { value: 'MALAYALAM',     label: 'Malayalam'       },
  { value: 'GUJARATI',      label: 'Gujarati'        },
  { value: 'MAHARASHTRIAN', label: 'Maharashtrian'   },
  { value: 'BENGALI',       label: 'Bengali'         },
]

const AYANAMSHAS = [
  { value: 'LAHIRI',      label: 'Lahiri (Chitrapaksha)'   },
  { value: 'KP',          label: 'KP (Krishnamurti)'       },
  { value: 'RAMAN',       label: 'Raman'                   },
  { value: 'TRUE_CHITRA', label: 'True Chitrapaksha'       },
]

/** Top Indian cities as quick-select presets */
const PRESET_CITIES = [
  { name: 'Bangalore',  lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'Mumbai',     lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Delhi',      lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Chennai',    lat: 13.0827, lng: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Hyderabad',  lat: 17.3850, lng: 78.4867, tz: 'Asia/Kolkata' },
  { name: 'Kolkata',    lat: 22.5726, lng: 88.3639, tz: 'Asia/Kolkata' },
  { name: 'Varanasi',   lat: 25.3176, lng: 82.9739, tz: 'Asia/Kolkata' },
  { name: 'Tirupati',   lat: 13.6288, lng: 79.4192, tz: 'Asia/Kolkata' },
]

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export default function PanchangaForm({ onSubmit, loading }: Props) {
  const [date,       setDate]       = useState(todayISO())
  const [lat,        setLat]        = useState<string>('')
  const [lng,        setLng]        = useState<string>('')
  const [timezone,   setTimezone]   = useState('Asia/Kolkata')
  const [locName,    setLocName]    = useState('')
  const [region,     setRegion]     = useState<RegionKey>('NORTH_INDIAN')
  const [ayanamsha,  setAyanamsha]  = useState<'LAHIRI'|'KP'|'RAMAN'|'TRUE_CHITRA'>('LAHIRI')
  const [locError,   setLocError]   = useState('')
  const [searching,  setSearching]  = useState(false)
  const [locationQuery, setLocationQuery] = useState('')

  // ── Geocode using Nominatim (OpenStreetMap) ───────────────────────────────
  const geocodeLocation = useCallback(async () => {
    if (!locationQuery.trim()) return
    setSearching(true)
    setLocError('')
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data.length === 0) {
        setLocError('Location not found. Try a city name or landmark.')
        return
      }
      const place = data[0]
      setLat(parseFloat(place.lat).toFixed(6))
      setLng(parseFloat(place.lon).toFixed(6))
      setLocName(place.display_name.split(',').slice(0, 2).join(', '))

      // Determine timezone for Indian locations
      const countryCode = place.address?.country_code?.toUpperCase()
      if (countryCode === 'IN') {
        setTimezone('Asia/Kolkata')
      }
      // For other countries, keep existing timezone or let user adjust
    } catch {
      setLocError('Geocoding failed. Please enter coordinates manually.')
    } finally {
      setSearching(false)
    }
  }, [locationQuery])

  // ── Use device location ────────────────────────────────────────────────────
  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser.')
      return
    }
    setSearching(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6))
        setLng(pos.coords.longitude.toFixed(6))
        setLocName('My Location')
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
        setSearching(false)
      },
      () => {
        setLocError('Could not get your location. Please search manually.')
        setSearching(false)
      }
    )
  }, [])

  // ── Preset city select ─────────────────────────────────────────────────────
  const applyPreset = useCallback((preset: typeof PRESET_CITIES[number]) => {
    setLat(preset.lat.toFixed(6))
    setLng(preset.lng.toFixed(6))
    setTimezone(preset.tz)
    setLocName(preset.name)
    setLocationQuery(preset.name)
    setLocError('')
  }, [])

  // ── Form submit ────────────────────────────────────────────────────────────
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    const latN = parseFloat(lat)
    const lngN = parseFloat(lng)
    if (isNaN(latN) || isNaN(lngN)) {
      setLocError('Please search for a location or enter coordinates.')
      return
    }
    onSubmit({ date, lat: latN, lng: lngN, timezone, locationName: locName, region, ayanamsha })
  }, [date, lat, lng, timezone, locName, region, ayanamsha, onSubmit])

  const inputCls = `
    w-full bg-navy-900/60 border border-white/10 text-cream-100
    px-4 py-3 text-sm font-sans
    focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/25
    transition-colors placeholder:text-cream-100/30
  `
  const labelCls = 'block font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold-500/80 mb-1.5'

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Panchanga calculator">

      {/* ── Date ──────────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <label htmlFor="panchanga-date" className={labelCls}>Date</label>
        <input
          id="panchanga-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          min="1900-01-01"
          max="2100-12-31"
          required
          className={inputCls}
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* ── Location search ───────────────────────────────────────────────── */}
      <div className="mb-3">
        <label htmlFor="loc-search" className={labelCls}>Location</label>
        <div className="flex gap-2">
          <input
            id="loc-search"
            type="text"
            value={locationQuery}
            onChange={e => setLocationQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), geocodeLocation())}
            placeholder="Search city or place…"
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={geocodeLocation}
            disabled={searching || !locationQuery.trim()}
            className="px-4 py-3 bg-gold-500/15 border border-gold-500/30 text-gold-400
                       hover:bg-gold-500/25 transition-colors disabled:opacity-40
                       font-sans text-xs tracking-wider uppercase whitespace-nowrap"
          >
            {searching ? '…' : 'Search'}
          </button>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={searching}
            title="Use my location"
            className="px-3 py-3 bg-navy-800 border border-white/10 text-cream-100/60
                       hover:text-gold-400 hover:border-gold-500/30 transition-colors"
            aria-label="Use my location"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
          </button>
        </div>
        {locError && (
          <p className="mt-1 font-sans text-xs text-red-400">{locError}</p>
        )}
        {locName && !locError && (
          <p className="mt-1 font-sans text-xs text-gold-500/70">📍 {locName}</p>
        )}
      </div>

      {/* ── Preset cities ─────────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className={`${labelCls} mb-2`}>Quick Select</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_CITIES.map(city => (
            <button
              key={city.name}
              type="button"
              onClick={() => applyPreset(city)}
              className={`
                px-3 py-1 font-sans text-[0.7rem] tracking-wide border transition-colors
                ${locName === city.name
                  ? 'border-gold-500/60 bg-gold-500/15 text-gold-400'
                  : 'border-white/10 bg-navy-900/40 text-cream-100/50 hover:border-gold-500/30 hover:text-cream-100/80'
                }
              `}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Coordinates (editable) ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label htmlFor="lat" className={labelCls}>Latitude</label>
          <input
            id="lat" type="number" step="0.000001" min="-90" max="90"
            value={lat} onChange={e => setLat(e.target.value)}
            placeholder="12.9716"
            className={inputCls} required
          />
        </div>
        <div>
          <label htmlFor="lng" className={labelCls}>Longitude</label>
          <input
            id="lng" type="number" step="0.000001" min="-180" max="180"
            value={lng} onChange={e => setLng(e.target.value)}
            placeholder="77.5946"
            className={inputCls} required
          />
        </div>
      </div>

      {/* ── Timezone ──────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <label htmlFor="timezone" className={labelCls}>Timezone</label>
        <input
          id="timezone" type="text"
          value={timezone} onChange={e => setTimezone(e.target.value)}
          placeholder="Asia/Kolkata"
          className={inputCls}
        />
      </div>

      {/* ── Region + Ayanamsha ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div>
          <label htmlFor="region" className={labelCls}>Regional Tradition</label>
          <select
            id="region" value={region}
            onChange={e => setRegion(e.target.value as RegionKey)}
            className={inputCls}
          >
            {REGIONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ayanamsha" className={labelCls}>Ayanamsha</label>
          <select
            id="ayanamsha" value={ayanamsha}
            onChange={e => setAyanamsha(e.target.value as typeof ayanamsha)}
            className={inputCls}
          >
            {AYANAMSHAS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading}
        className={`
          w-full btn-gold
          ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0 1 10 10"/>
              </svg>
              Computing Panchanga…
            </span>
          : 'Calculate Panchanga'
        }
      </button>
    </form>
  )
}
