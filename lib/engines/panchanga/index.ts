// ─────────────────────────────────────────────────────────────────────────────
// Panchanga Engine — Main Orchestrator
// Combines all five limbs + timing elements into one PanchangaResult
// All Route Handlers that call this MUST declare:
//   export const runtime = 'nodejs'
//   export const maxDuration = 30
// ─────────────────────────────────────────────────────────────────────────────

import {
  localDateToJD,
  formatLocalTime,
  jdToDate,
} from '../ephemeris/julian-day'
import { computeSunTimes, computeMoonTimes } from '../ephemeris/sunrise'
import { computeAyanamsha }                  from '../ephemeris/ayanamsha'
import { computeTithi }                      from './tithi'
import { computeNakshatra }                  from './nakshatra'
import { computeYoga }                       from './yoga'
import { computeKarana }                     from './karana'
import { computeVara }                       from './vara'
import { computeRahuKalam, computeGulikaKalam, computeYamaganda } from './rahu-kalam'
import { computeAbhijitMuhurta }             from './abhijit'
import { getRegionalConfig }                 from './regional'
import type {
  PanchangaQuery,
  PanchangaResult,
  AyanamshaKey,
} from '../../types/panchanga'

/**
 * Compute a complete Panchanga for the given query.
 * This is the single public entry point for the Panchanga engine.
 *
 * All sub-calculations are performed using real astronomical algorithms
 * (VSOP87 / ELP2000) — no mock data, no hardcoded values.
 *
 * @param query  Validated PanchangaQuery
 * @returns      Complete PanchangaResult
 */
export async function computePanchanga(
  query: PanchangaQuery
): Promise<PanchangaResult> {
  const {
    date,
    lat,
    lng,
    timezone,
    region,
    ayanamsha = 'LAHIRI',
    locationName = 'Unknown Location',
  } = query

  // ── 1. Parse date and compute JD for local midnight ────────────────────────
  const [yearStr, monthStr, dayStr] = date.split('-')
  const year  = parseInt(yearStr,  10)
  const month = parseInt(monthStr, 10)
  const day   = parseInt(dayStr,   10)

  const { jd: jdMidnight, utcOffsetHours } = localDateToJD(date, timezone)

  // ── 2. Sunrise and sunset ──────────────────────────────────────────────────
  const { sunrise, sunset, solarNoon } = computeSunTimes(year, month, day, lat, lng)

  // ── 3. Moonrise and moonset ────────────────────────────────────────────────
  const { moonrise, moonset } = computeMoonTimes(year, month, day, lat, lng)

  // ── 4. Julian Day at local sunrise (used for all limb calculations) ────────
  const jdSunrise = jdMidnight + (sunrise.getTime() / 86_400_000 -
    Math.floor(sunrise.getTime() / 86_400_000)) +
    (utcOffsetHours < 0
      ? (24 + utcOffsetHours) / 24
      : -(utcOffsetHours > 0 ? (24 - utcOffsetHours) / 24 : 0))

  // Simpler: use the actual millisecond timestamp of sunrise to compute JD
  const jdAtSunrise = msToJD(sunrise.getTime())

  // ── 5. Ayanamsha value for display ────────────────────────────────────────
  const ayanamshaValue = computeAyanamsha(jdAtSunrise, ayanamsha as AyanamshaKey)

  // ── 6. Weekday from JD at sunrise ─────────────────────────────────────────
  const weekday = Math.floor(jdAtSunrise + 1.5) % 7   // 0=Sun, 6=Sat

  // ── 7. Five limbs ─────────────────────────────────────────────────────────
  const [tithi, nakshatra, yoga, karana, vara] = await Promise.all([
    Promise.resolve(computeTithi(    jdAtSunrise, ayanamsha as AyanamshaKey, timezone)),
    Promise.resolve(computeNakshatra(jdAtSunrise, ayanamsha as AyanamshaKey, timezone)),
    Promise.resolve(computeYoga(     jdAtSunrise, ayanamsha as AyanamshaKey, timezone)),
    Promise.resolve(computeKarana(   jdAtSunrise, ayanamsha as AyanamshaKey, timezone)),
    Promise.resolve(computeVara(     jdAtSunrise, region)),
  ])

  // ── 8. Apply regional name overrides ──────────────────────────────────────
  const regional = getRegionalConfig(region)

  const tithiLocalIndex = (tithi.number - 1) % 15   // 0-based within paksha
  tithi.nameLocal = tithi.paksha === 'SHUKLA'
    ? regional.tithiShukla[tithiLocalIndex]
    : regional.tithiKrishna[tithiLocalIndex]
  tithi.pakshaName = tithi.paksha === 'SHUKLA'
    ? regional.pakshaShukla
    : regional.pakshaKrishna
  nakshatra.nameLocal = regional.nakshatraNames[nakshatra.number - 1]
  vara.nameLocal      = regional.varNames[vara.number]

  // ── 9. Inauspicious periods ────────────────────────────────────────────────
  const rahuKalam    = computeRahuKalam(   sunrise, sunset, weekday, timezone)
  const gulikaKalam  = computeGulikaKalam( sunrise, sunset, weekday, timezone)
  const yamaganda    = computeYamaganda(   sunrise, sunset, weekday, timezone)

  // ── 10. Abhijit Muhurta ────────────────────────────────────────────────────
  const abhijitMuhurta = computeAbhijitMuhurta(sunrise, sunset, timezone)

  // ── 11. Format display times ───────────────────────────────────────────────
  const sunriseLocal   = formatLocalTime(sunrise,  timezone)
  const sunsetLocal    = formatLocalTime(sunset,   timezone)
  const moonriseLocal  = moonrise ? formatLocalTime(moonrise, timezone) : null
  const moonsetLocal   = moonset  ? formatLocalTime(moonset,  timezone) : null

  return {
    date,
    location: {
      lat,
      lng,
      timezone,
      name: locationName,
    },
    region,
    ayanamsha:      ayanamsha as AyanamshaKey,
    ayanamshaValue: parseFloat(ayanamshaValue.toFixed(4)),

    sunrise,
    sunset,
    moonrise: moonrise ?? null,
    moonset:  moonset  ?? null,

    sunriseLocal,
    sunsetLocal,
    moonriseLocal,
    moonsetLocal,

    tithi,
    nakshatra,
    yoga,
    karana,
    vara,

    rahuKalam,
    gulikaKalam,
    yamaganda,
    abhijitMuhurta,

    computedAt: new Date().toISOString(),
    julianDay:  parseFloat(jdAtSunrise.toFixed(6)),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: milliseconds since Unix epoch → Julian Day
// ─────────────────────────────────────────────────────────────────────────────
function msToJD(ms: number): number {
  // Unix epoch (Jan 1, 1970 00:00:00 UTC) = JD 2440587.5
  return ms / 86_400_000 + 2440587.5
}
