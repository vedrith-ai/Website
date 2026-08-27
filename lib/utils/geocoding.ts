import type { GeocodeResult } from '../types/panchanga'

export interface PlaceSearchResult extends GeocodeResult {
  displayName: string
}

export async function searchPlace(query: string, limit = 5): Promise<PlaceSearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=${limit}&addressdetails=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  if (!res.ok) throw new Error(`Place search failed (${res.status})`)
  const raw = (await res.json()) as Array<{
    display_name: string; lat: string; lon: string
    address?: { country?: string }
  }>
  return raw.map(p => ({
    name: p.display_name.split(',').slice(0, 2).join(', '),
    displayName: p.display_name,
    lat: parseFloat(p.lat), lng: parseFloat(p.lon),
    timezone: '', country: p.address?.country ?? '',
  }))
}

export function getBrowserTimezone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone }
  catch { return 'UTC' }
}
