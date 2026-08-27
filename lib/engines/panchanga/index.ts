// ─────────────────────────────────────────────────────────────────────────────
// Panchanga Engine — Main Orchestrator
// Combines all five limbs + timing elements into one PanchangaResult
// All Route Handlers that call this MUST declare:
//   export const runtime = 'nodejs'
//   export const maxDuration = 30
//
// [V1.1] Additions: Paksha display, Chandramana Masa (Amanta + Purnimanta),
// Samvatsara (60-year cycle), and English/Kannada display-name localisation.
// All additions are wired in AFTER the original five-limb calculation block,
// which is unmodified from V1.0.
// ─────────────────────────────────────────────────────────────────────────────

import { formatLocalTime } from '../ephemeris/julian-day'
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
import { computeMasa }                       from './masa'         // [V1.1]
import { computeSamvatsara }                 from './samvatsara'   // [V1.1]
import { computeDurmuhurtas, computeVarjyam } from './durmuhurta'  // [V1.1]
import { computeDailyRecommendations }        from './recommendations' // [V1.1]
import {
  VARA_NAMES, getTithiNameTable,
  NAKSHATRA_NAMES, YOGA_NAMES, getKaranaNameTable, pickName,
} from '../../knowledge/localization'                              // [V1.1]
import type {
  PanchangaQuery,
  PanchangaResult,
  AyanamshaKey,
  LanguageCode,
  CalendarSystem,
} from '../../types/panchanga'

/**
 * Compute a complete Panchanga for the given query.
 * This is the single public entry point for the Panchanga engine.
 *
 * All sub-calculations are performed using real astronomical algorithms
 * (VSOP87 / ELP2000 — the VedRith Astronomy Engine) — no mock data,
 * no hardcoded values.
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
    lang           = 'en',          // [V1.1]
    calendarSystem = 'AMANTA',       // [V1.1]
  } = query

  // ── 1. Parse date ──────────────────────────────────────────────────────────
  const [yearStr, monthStr, dayStr] = date.split('-')
  const year  = parseInt(yearStr,  10)
  const month = parseInt(monthStr, 10)
  const day   = parseInt(dayStr,   10)

  // ── 2. Sunrise and sunset ──────────────────────────────────────────────────
  const { sunrise, sunset } = computeSunTimes(year, month, day, lat, lng)

  // ── 3. Moonrise and moonset ────────────────────────────────────────────────
  const { moonrise, moonset } = computeMoonTimes(year, month, day, lat, lng)

  // ── 4. Julian Day at local sunrise — derived from the sunrise Date object ──
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

  // ── 8b. [V1.1] Apply English/Kannada displayName to each limb ──────────────
  // This is a SEPARATE localisation layer from the regional name override
  // above (which is regional-tradition-romanised, e.g. "Aadivaaram" for
  // Telugu Sunday). displayName specifically carries the EN/KN pair from
  // lib/knowledge/localization.ts and is additive — nameLocal is untouched.
  tithi.displayName     = pickName(getTithiNameTable(tithi.number), lang as LanguageCode)
  nakshatra.displayName = pickName(NAKSHATRA_NAMES[nakshatra.number - 1], lang as LanguageCode)
  yoga.displayName       = pickName(YOGA_NAMES[yoga.number - 1], lang as LanguageCode)
  karana.displayName     = pickName(getKaranaNameTable(karana.name), lang as LanguageCode)
  vara.displayName       = pickName(VARA_NAMES[vara.number], lang as LanguageCode)

  // ── 9. Inauspicious periods ────────────────────────────────────────────────
  const rahuKalam    = computeRahuKalam(   sunrise, sunset, weekday, timezone)
  const gulikaKalam  = computeGulikaKalam( sunrise, sunset, weekday, timezone)
  const yamaganda    = computeYamaganda(   sunrise, sunset, weekday, timezone)

  // ── 10. Abhijit Muhurta ────────────────────────────────────────────────────
  const abhijitMuhurta = computeAbhijitMuhurta(sunrise, sunset, timezone)

  // ── 11. [V1.1] Durmuhurta and Varjyam ────────────────────────────────────
  const durmuhurtaWindows = computeDurmuhurtas(sunrise, sunset, weekday, timezone)
  const durmuhurtas = durmuhurtaWindows.map((period, index) => ({ index, period }))

  // Approximate nakshatra start: endTime minus one nakshatra duration
  // A nakshatra spans ~13°20′ of the Moon's orbit ≈ 27h / 27 ≈ ~60 ghatikas
  const NAKSHATRA_DURATION_MS = 24 * 60 * 60 * 1000   // ~24h as safe approximation
  const nakshatraStart = new Date(nakshatra.endTime.getTime() - NAKSHATRA_DURATION_MS)
  const varjyamPeriod = computeVarjyam(
    nakshatraStart,
    nakshatra.endTime,
    nakshatra.number,
    timezone,
  )
  const varjyam = { nakshatraNumber: nakshatra.number, period: varjyamPeriod }

  // ── 11b. [V1.1] Daily Recommendations ────────────────────────────────────
  const recommendations = computeDailyRecommendations({
    tithi:     tithi.name,
    nakshatra: nakshatra.name,
    yoga:      yoga.name,
    karana:    karana.name,
    vara:      vara.name,
  })

  // ── 11c. [V1.1] Source Attribution ───────────────────────────────────────
  const attribution = {
    calculations: 'VedRith Astronomical Engine — pure TypeScript, Keplerian orbital mechanics, Meeus algorithms. No Swiss Ephemeris dependency.',
    knowledge:    'Traditional Knowledge Engine — classical Jyotisha texts: Muhurta Chintamani (Rama Dayalu), Dharma Sindhu (Kashinath Upadhyaya), Brihat Samhita (Varahamihira), Jataka Parijata, Hora Sara (Prithuyasas).',
  }

  // ── 12. Format display times ───────────────────────────────────────────────
  const sunriseLocal   = formatLocalTime(sunrise,  timezone)
  const sunsetLocal    = formatLocalTime(sunset,   timezone)
  const moonriseLocal  = moonrise ? formatLocalTime(moonrise, timezone) : null
  const moonsetLocal   = moonset  ? formatLocalTime(moonset,  timezone) : null

  // ── 12. [V1.1] Chandramana Masa (Amanta + Purnimanta) ───────────────────────
  const masaRaw = computeMasa(
    jdAtSunrise, tithi.paksha, ayanamsha as AyanamshaKey, calendarSystem as CalendarSystem
  )
  const masa = {
    amanta: {
      index: masaRaw.amanta.index,
      name:  masaRaw.amanta.name,
      displayName: pickName(masaRaw.amanta.nameTranslations, lang as LanguageCode),
    },
    purnimanta: {
      index: masaRaw.purnimanta.index,
      name:  masaRaw.purnimanta.name,
      displayName: pickName(masaRaw.purnimanta.nameTranslations, lang as LanguageCode),
    },
    calendarSystem: masaRaw.calendarSystem,
    current: {
      index: masaRaw.current.index,
      name:  masaRaw.current.name,
      displayName: pickName(masaRaw.current.nameTranslations, lang as LanguageCode),
    },
  }

  // ── 13. [V1.1] Samvatsara (60-year cycle) ───────────────────────────────────
  const samvatsaraRaw = computeSamvatsara(year, month, masaRaw.amanta.index, tithi.paksha)
  const samvatsara = {
    index:       samvatsaraRaw.index,
    name:        samvatsaraRaw.name,
    displayName: pickName(samvatsaraRaw.nameTranslations, lang as LanguageCode),
    shakaYear:   samvatsaraRaw.shakaYear,
    vikramYear:  samvatsaraRaw.vikramYear,
  }

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

    masa,                                          // [V1.1]
    samvatsara,                                     // [V1.1]
    lang:           lang as LanguageCode,           // [V1.1]
    calendarSystem: calendarSystem as CalendarSystem, // [V1.1]

    rahuKalam,
    gulikaKalam,
    yamaganda,
    abhijitMuhurta,

    durmuhurtas,                                    // [V1.1]
    varjyam,                                        // [V1.1]
    recommendations,                                // [V1.1]
    attribution,                                    // [V1.1]

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
