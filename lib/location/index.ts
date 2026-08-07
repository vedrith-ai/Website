// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Location Utilities  [Platform V1]
//
// GPS via browser Geolocation API + reverse geocoding via Nominatim
// Manual city search via Nominatim (already used in Kundali)
//
// Timezone is derived from the Intl API after getting coordinates.
// ─────────────────────────────────────────────────────────────────────────────

import type { StoredLocation } from '@/lib/storage/preferences'

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const NOMINATIM_HEADERS = {
  'User-Agent': 'VedRith/1.0 (https://vedrith.sharvasit.in)',
  'Accept-Language': 'en',
}

export type LocationResult =
  | { success: true;  location: StoredLocation }
  | { success: false; error: 'PERMISSION_DENIED' | 'UNAVAILABLE' | 'TIMEOUT' | 'GEOCODE_FAILED' | 'UNSUPPORTED' }

// ── GPS location ──────────────────────────────────────────────────────────────

export async function requestGPSLocation(): Promise<LocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { success: false, error: 'UNSUPPORTED' }
  }

  const coords = await new Promise<GeolocationCoordinates | GeolocationPositionError>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => resolve(err),
      { timeout: 10_000, enableHighAccuracy: false, maximumAge: 5 * 60 * 1000 }
    )
  })

  if (coords instanceof GeolocationPositionError) {
    const errorMap: Record<number, 'PERMISSION_DENIED' | 'UNAVAILABLE' | 'TIMEOUT'> = {
      1: 'PERMISSION_DENIED',
      2: 'UNAVAILABLE',
      3: 'TIMEOUT',
    }
    return { success: false, error: errorMap[coords.code] ?? 'UNAVAILABLE' }
  }

  // Reverse geocode
  try {
    const res = await fetch(
      `${NOMINATIM_BASE}/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&zoom=10`,
      { headers: NOMINATIM_HEADERS }
    )
    const data = await res.json()

    const city    = data.address?.city ?? data.address?.town ?? data.address?.village ?? data.address?.county ?? 'Your Location'
    const state   = data.address?.state ?? ''
    const country = data.address?.country_code?.toUpperCase() ?? 'IN'
    const name    = country === 'IN' ? `${city}, ${state}` : city

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return {
      success: true,
      location: {
        lat:      coords.latitude,
        lng:      coords.longitude,
        name,
        timezone,
        region:   deriveRegion(data.address),
        source:   'gps',
        savedAt:  new Date().toISOString(),
      }
    }
  } catch {
    // GPS worked but geocoding failed — still use coordinates
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return {
      success: true,
      location: {
        lat:      coords.latitude,
        lng:      coords.longitude,
        name:     `${coords.latitude.toFixed(2)}°N ${coords.longitude.toFixed(2)}°E`,
        timezone,
        region:   'Karnataka',
        source:   'gps',
        savedAt:  new Date().toISOString(),
      }
    }
  }
}

// ── Manual city search ────────────────────────────────────────────────────────

export interface CitySearchResult {
  lat:      number
  lng:      number
  name:     string
  state:    string
  country:  string
  timezone: string
  region:   string
  displayName: string
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query.trim() || query.length < 2) return []

  try {
    const res = await fetch(
      `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1&featuretype=city,town,village`,
      { headers: NOMINATIM_HEADERS }
    )
    const data = await res.json()

    return (data as Record<string, unknown>[])
      .filter(d => d.address)
      .map(d => {
        const addr    = d.address as Record<string, string>
        const city    = addr.city ?? addr.town ?? addr.village ?? addr.county ?? String(d.name)
        const state   = addr.state ?? ''
        const country = addr.country ?? ''
        const cc      = (addr.country_code ?? '').toUpperCase()
        const display = cc === 'IN' ? `${city}, ${state}` : `${city}, ${country}`

        return {
          lat:         parseFloat(String(d.lat)),
          lng:         parseFloat(String(d.lon)),
          name:        display,
          state,
          country,
          timezone:    guessTimezone(parseFloat(String(d.lon)), cc),
          region:      deriveRegion(addr),
          displayName: display,
        }
      })
      .filter(r => !isNaN(r.lat) && !isNaN(r.lng))
  } catch {
    return []
  }
}

export async function cityToLocation(city: CitySearchResult): Promise<StoredLocation> {
  return {
    lat:      city.lat,
    lng:      city.lng,
    name:     city.name,
    timezone: city.timezone,
    region:   city.region,
    source:   'manual',
    savedAt:  new Date().toISOString(),
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveRegion(address: Record<string, string>): string {
  const state = (address.state ?? '').toLowerCase()
  if (state.includes('karnataka'))                  return 'Karnataka'
  if (state.includes('maharashtra'))                return 'Maharashtra'
  if (state.includes('tamil'))                      return 'TamilNadu'
  if (state.includes('andhra') || state.includes('telangana')) return 'AndhraTelangana'
  if (state.includes('kerala'))                     return 'Kerala'
  return 'Karnataka'   // Default
}

function guessTimezone(lng: number, countryCode: string): string {
  if (countryCode === 'IN') return 'Asia/Kolkata'
  // Rough longitude-based fallback
  const offset = Math.round(lng / 15)
  const utc    = offset >= 0 ? `Etc/GMT-${offset}` : `Etc/GMT+${Math.abs(offset)}`
  return utc
}

/** Check if current location has drifted significantly from stored one */
export function locationDriftedSignificantly(
  stored: StoredLocation,
  newLat: number,
  newLng: number,
  thresholdKm = 50
): boolean {
  const R    = 6371
  const dLat = (newLat - stored.lat) * Math.PI / 180
  const dLng = (newLng - stored.lng) * Math.PI / 180
  const a    = Math.sin(dLat / 2) ** 2 +
               Math.cos(stored.lat * Math.PI / 180) * Math.cos(newLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return dist > thresholdKm
}
