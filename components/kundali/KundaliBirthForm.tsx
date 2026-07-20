'use client'
import { useState, useCallback, type FormEvent } from 'react'
import { searchPlace, getBrowserTimezone, type PlaceSearchResult } from '@/lib/utils/geocoding'
import type { Gender } from '@/lib/types/kundali-chart'

export interface KundaliFormValues {
  name: string; gender: Gender; dateOfBirth: string; timeOfBirth: string
  timezone: string; latitude: number; longitude: number; placeName: string
  ayanamsha: 'LAHIRI'|'KP'|'RAMAN'|'TRUE_CHITRA'
  houseSystem: 'WHOLE_SIGN'|'EQUAL'|'PLACIDUS'
}

interface Props { onSubmit: (v: KundaliFormValues) => void; loading: boolean }

const GENDERS   = [{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]
const AYANAMSHAS = [{ value: 'LAHIRI', label: 'Lahiri' }, { value: 'KP', label: 'KP' }, { value: 'RAMAN', label: 'Raman' }, { value: 'TRUE_CHITRA', label: 'True Chitrapaksha' }]
const HOUSE_SYSTEMS = [{ value: 'WHOLE_SIGN', label: 'Whole Sign (Vedic)' }, { value: 'EQUAL', label: 'Equal House' }, { value: 'PLACIDUS', label: 'Placidus' }]

function todayISO() { return new Date().toISOString().split('T')[0] }

export default function KundaliBirthForm({ onSubmit, loading }: Props) {
  const [name,        setName]        = useState('')
  const [gender,      setGender]      = useState<Gender>('MALE')
  const [dateOfBirth, setDateOfBirth] = useState(todayISO())
  const [timeOfBirth, setTimeOfBirth] = useState('12:00')
  const [timezone,    setTimezone]    = useState('Asia/Kolkata')
  const [lat,         setLat]         = useState('')
  const [lng,         setLng]         = useState('')
  const [placeName,   setPlaceName]   = useState('')
  const [ayanamsha,   setAyanamsha]   = useState<KundaliFormValues['ayanamsha']>('LAHIRI')
  const [houseSystem, setHouseSystem] = useState<KundaliFormValues['houseSystem']>('WHOLE_SIGN')
  const [placeQuery,  setPlaceQuery]  = useState('')
  const [searching,   setSearching]   = useState(false)
  const [results,     setResults]     = useState<PlaceSearchResult[]>([])
  const [placeError,  setPlaceError]  = useState('')
  const [formError,   setFormError]   = useState('')

  const handlePlaceSearch = useCallback(async () => {
    if (!placeQuery.trim()) return
    setSearching(true); setPlaceError('')
    try {
      const found = await searchPlace(placeQuery, 5)
      if (!found.length) setPlaceError('No places found. Try a different search.')
      setResults(found)
    } catch { setPlaceError('Search failed. Enter coordinates manually.') }
    finally { setSearching(false) }
  }, [placeQuery])

  const selectPlace = useCallback((p: PlaceSearchResult) => {
    setLat(p.lat.toFixed(6)); setLng(p.lng.toFixed(6))
    setPlaceName(p.name); setPlaceQuery(p.name); setResults([])
    if (p.country === 'India') setTimezone('Asia/Kolkata')
  }, [])

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault(); setFormError('')
    const latN = parseFloat(lat), lngN = parseFloat(lng)
    if (!name.trim()) { setFormError('Please enter the full name.'); return }
    if (isNaN(latN) || isNaN(lngN)) { setFormError('Please search for a birth place or enter coordinates.'); return }
    if (!placeName.trim()) { setFormError('Please enter the birth place name.'); return }
    onSubmit({ name: name.trim(), gender, dateOfBirth, timeOfBirth, timezone: timezone.trim(), latitude: latN, longitude: lngN, placeName: placeName.trim(), ayanamsha, houseSystem })
  }, [name, gender, dateOfBirth, timeOfBirth, timezone, lat, lng, placeName, ayanamsha, houseSystem, onSubmit])

  const inp = `w-full bg-navy-900/60 border border-white/10 text-cream-100 px-4 py-3 text-sm font-sans focus:outline-none focus:border-gold-500/60 transition-colors placeholder:text-cream-100/30`
  const lbl = 'block font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold-500/80 mb-1.5'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div><label className={lbl}>Full Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="As it appears on the chart" className={inp} required /></div>

      <div><p className={lbl}>Gender</p>
        <div className="flex gap-2">
          {GENDERS.map(g => <button key={g.value} type="button" onClick={() => setGender(g.value as Gender)} className={`flex-1 px-4 py-2.5 text-sm font-sans border transition-colors ${gender === g.value ? 'border-gold-500/60 bg-gold-500/15 text-gold-400' : 'border-white/10 bg-navy-900/40 text-cream-100/50'}`}>{g.label}</button>)}
        </div></div>

      <div className="grid grid-cols-2 gap-3">
        <div><label className={lbl}>Date of Birth</label>
          <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} min="1900-01-01" max="2100-12-31" className={inp} style={{ colorScheme: 'dark' }} required /></div>
        <div><label className={lbl}>Time of Birth</label>
          <input type="time" value={timeOfBirth} onChange={e => setTimeOfBirth(e.target.value)} className={inp} style={{ colorScheme: 'dark' }} required /></div>
      </div>

      <div><label className={lbl}>Birth Place</label>
        <div className="flex gap-2">
          <input type="text" value={placeQuery} onChange={e => setPlaceQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handlePlaceSearch())}
            placeholder="Search city or town…" className={`${inp} flex-1`} />
          <button type="button" onClick={handlePlaceSearch} disabled={searching || !placeQuery.trim()}
            className="px-4 py-3 bg-gold-500/15 border border-gold-500/30 text-gold-400 hover:bg-gold-500/25 transition-colors disabled:opacity-40 font-sans text-xs uppercase tracking-wider whitespace-nowrap">
            {searching ? '…' : 'Search'}</button>
        </div>
        {placeError && <p className="mt-1 text-xs text-red-400 font-sans">{placeError}</p>}
        {results.length > 0 && <ul className="mt-2 border border-white/10 bg-navy-900/80 divide-y divide-white/5 max-h-48 overflow-y-auto">
          {results.map((r, i) => <li key={i}><button type="button" onClick={() => selectPlace(r)} className="w-full text-left px-3 py-2.5 text-sm text-cream-100/80 hover:bg-gold-500/10 hover:text-gold-400 transition-colors">{r.displayName}</button></li>)}
        </ul>}
        {placeName && !results.length && <p className="mt-1 text-xs text-gold-500/70 font-sans">📍 {placeName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div><label className={lbl}>Latitude</label><input type="number" step="0.000001" min="-90" max="90" value={lat} onChange={e => setLat(e.target.value)} placeholder="12.9716" className={inp} required /></div>
        <div><label className={lbl}>Longitude</label><input type="number" step="0.000001" min="-180" max="180" value={lng} onChange={e => setLng(e.target.value)} placeholder="77.5946" className={inp} required /></div>
      </div>

      <div><label className={lbl}>Timezone</label>
        <div className="flex gap-2">
          <input type="text" value={timezone} onChange={e => setTimezone(e.target.value)} placeholder="Asia/Kolkata" className={`${inp} flex-1`} required />
          <button type="button" onClick={() => setTimezone(getBrowserTimezone())} className="px-3 py-3 bg-navy-800 border border-white/10 text-cream-100/60 hover:text-gold-400 transition-colors font-sans text-xs whitespace-nowrap">Detect</button>
        </div>
        <p className="mt-1 text-[0.65rem] text-cream-100/30 font-sans">IANA format e.g. &quot;Asia/Kolkata&quot;</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={lbl}>Ayanamsha</label>
          <select value={ayanamsha} onChange={e => setAyanamsha(e.target.value as KundaliFormValues['ayanamsha'])} className={inp}>
            {AYANAMSHAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}</select></div>
        <div><label className={lbl}>House System</label>
          <select value={houseSystem} onChange={e => setHouseSystem(e.target.value as KundaliFormValues['houseSystem'])} className={inp}>
            {HOUSE_SYSTEMS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}</select></div>
      </div>

      {formError && <p className="text-xs text-red-400 font-sans" role="alert">{formError}</p>}

      <button type="submit" disabled={loading} className={`w-full py-4 bg-gold-500/20 border border-gold-500/40 text-gold-400 font-sans text-sm tracking-[0.18em] uppercase hover:bg-gold-500/30 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
        {loading ? 'Generating Kundali…' : 'Generate Kundali Chart'}
      </button>
    </form>
  )
}
