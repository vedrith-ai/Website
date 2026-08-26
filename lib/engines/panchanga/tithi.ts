// ─────────────────────────────────────────────────────────────────────────────
// Tithi Engine
// Tithi = lunar day defined by 12° Sun-Moon elongation
// 15 Shukla Paksha tithis + 15 Krishna Paksha tithis = 30 total
// ─────────────────────────────────────────────────────────────────────────────

import { normalize360, formatLocalTime, jdToDate } from '../ephemeris/julian-day'
import { tropicalToSidereal }                       from '../ephemeris/ayanamsha'
import { sunTropicalLongitude }                     from '../ephemeris/solar'
import { moonTropicalLongitude }                    from '../ephemeris/lunar'
import type { TithiResult, AyanamshaKey, Paksha }   from '../../types/panchanga'

/** Each Tithi spans 12° of Sun-Moon elongation */
export const TITHI_SPAN_DEG = 12.0

// ── English / Sanskrit names ──────────────────────────────────────────────────
const TITHI_NAMES_SHUKLA = [
  'Pratipada', 'Dvitiya',   'Tritiya',    'Chaturthi',  'Panchami',
  'Shashthi',  'Saptami',   'Ashtami',    'Navami',     'Dashami',
  'Ekadashi',  'Dwadashi',  'Trayodashi', 'Chaturdashi', 'Purnima',
]
const TITHI_NAMES_KRISHNA = [
  'Pratipada', 'Dvitiya',   'Tritiya',    'Chaturthi',  'Panchami',
  'Shashthi',  'Saptami',   'Ashtami',    'Navami',     'Dashami',
  'Ekadashi',  'Dwadashi',  'Trayodashi', 'Chaturdashi', 'Amavasya',
]

/** Tithi quality based on classical texts */
const TITHI_QUALITY: Record<number, 'SHUBHA' | 'ASHUBHA' | 'MIXED'> = {
  1: 'MIXED',    2: 'SHUBHA',  3: 'SHUBHA',  4: 'ASHUBHA',
  5: 'SHUBHA',  6: 'MIXED',   7: 'SHUBHA',  8: 'ASHUBHA',
  9: 'ASHUBHA', 10: 'SHUBHA', 11: 'SHUBHA', 12: 'SHUBHA',
  13: 'MIXED',  14: 'ASHUBHA', 15: 'SHUBHA',
}

/**
 * Compute the Tithi for a given Julian Day (at local sunrise moment).
 *
 * @param jdSunrise  JD of local sunrise
 * @param ayanamsha  Ayanamsha key (default LAHIRI)
 * @param timezone   IANA timezone string for time formatting
 */
export function computeTithi(
  jdSunrise:  number,
  ayanamsha:  AyanamshaKey = 'LAHIRI',
  timezone:   string = 'Asia/Kolkata'
): TithiResult {
  // Sidereal longitudes at sunrise
  const sunSid  = tropicalToSidereal(sunTropicalLongitude(jdSunrise),  jdSunrise, ayanamsha)
  const moonSid = tropicalToSidereal(moonTropicalLongitude(jdSunrise), jdSunrise, ayanamsha)

  // Elongation Moon - Sun, normalized [0, 360)
  const elongation = normalize360(moonSid - sunSid)

  // Tithi index 0–29
  const tithiIndex = Math.floor(elongation / TITHI_SPAN_DEG)
  const completed  = ((elongation % TITHI_SPAN_DEG) / TITHI_SPAN_DEG) * 100

  // Paksha and local tithi number (1–15)
  const paksha: Paksha    = tithiIndex < 15 ? 'SHUKLA' : 'KRISHNA'
  const localNum          = (tithiIndex % 15) + 1          // 1–15
  const globalNum         = tithiIndex + 1                  // 1–30

  // Name
  const name = paksha === 'SHUKLA'
    ? TITHI_NAMES_SHUKLA[localNum - 1]
    : TITHI_NAMES_KRISHNA[localNum - 1]

  // End time: when elongation reaches next multiple of 12°
  const endJD  = findTithiEnd(jdSunrise, elongation)
  const endDate = jdToDate(endJD)

  return {
    number:     globalNum,
    name,
    nameLocal:  name,           // regional names filled by regional layer
    paksha,
    pakshaName: paksha === 'SHUKLA' ? 'Shukla' : 'Krishna',
    endTime:    endDate,
    endLocal:   formatLocalTime(endDate, timezone),
    completed:  Math.round(completed),
    quality:    TITHI_QUALITY[localNum] ?? 'MIXED',
  }
}

/**
 * Binary search for the JD when the current Tithi ends
 * (i.e., when elongation crosses the next 12° boundary).
 */
function findTithiEnd(jdStart: number, elongStart: number): number {
  // Target elongation = ceil(elongStart / 12) * 12
  const targetElong = (Math.floor(elongStart / TITHI_SPAN_DEG) + 1) * TITHI_SPAN_DEG

  let lo = jdStart
  let hi = jdStart + 1.0   // Tithi lasts at most ~24h

  for (let i = 0; i < 50; i++) {
    const mid    = (lo + hi) / 2
    const sunSid = tropicalToSidereal(sunTropicalLongitude(mid), mid)
    const moonSid = tropicalToSidereal(moonTropicalLongitude(mid), mid)
    const elong  = normalize360(moonSid - sunSid)

    // Adjust for wrap-around at 360°
    const current = elong < elongStart - 6 ? elong + 360 : elong

    if (Math.abs(current - targetElong) < 0.001) break
    if (current < targetElong) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}
