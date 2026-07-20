// ─────────────────────────────────────────────────────────────────────────────
// Durmuhurta & Varjyam Engine  [V1.1 — New]
//
// DURMUHURTA
// Inauspicious Muhurta periods within the daytime.
// Daytime is divided into 15 equal Muhurtas (sunrise → sunset).
// Specific period(s) for each weekday are considered Durmuhurta.
//
// Period table (1-based, within 15 daytime Muhurtas):
//   Source: Muhurta Chintamani (Rama Dayalu), Dharma Sindhu (Kashinath
//   Upadhyaya), cross-referenced with Drik Panchanga standard implementation.
//
// VARJYAM
// A nakshatra sub-period of ~1h 36m (4 ghatikas) considered inauspicious for
// beginning any new work. Occurs at a fixed offset within each nakshatra period,
// based on the nakshatra's position in the 27-fold cycle.
//
// Source: Muhurta Chintamani Chapter 2; Brihat Samhita XXIV
// ─────────────────────────────────────────────────────────────────────────────

import type { TimeRange } from '../../types/panchanga'
import { formatLocalTime } from '../ephemeris/julian-day'

// ── Durmuhurta period indices by weekday ─────────────────────────────────────
// weekday: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// Values: 1-based Muhurta index within the 15 daytime Muhurtas
// Empty array = no Durmuhurta during daytime for that weekday (Wednesday)
const DURMUHURTA_PERIODS: Record<number, number[]> = {
  0: [12],           // Sunday:    12th Muhurta (late afternoon)
  1: [7],            // Monday:    7th Muhurta (around midday)
  2: [8, 9],         // Tuesday:   8th and 9th Muhurta
  3: [],             // Wednesday: No daytime Durmuhurta (occurs at midnight)
  4: [6],            // Thursday:  6th Muhurta
  5: [10, 11],       // Friday:    10th and 11th Muhurta
  6: [9],            // Saturday:  9th Muhurta
}

/**
 * Compute all Durmuhurta windows for a given day.
 *
 * Returns an array (0–2 elements) of inauspicious time windows.
 * Wednesday returns an empty array (no daytime Durmuhurta).
 *
 * @param sunrise   Sunrise as UTC Date
 * @param sunset    Sunset as UTC Date
 * @param weekday   0=Sun … 6=Sat
 * @param timezone  IANA timezone
 */
export function computeDurmuhurtas(
  sunrise:  Date,
  sunset:   Date,
  weekday:  number,
  timezone: string
): TimeRange[] {
  const periodIndices = DURMUHURTA_PERIODS[weekday] ?? []
  if (periodIndices.length === 0) return []

  const daytimeMs = sunset.getTime() - sunrise.getTime()
  const muhurtaMs = daytimeMs / 15

  return periodIndices.map(index => {
    const start = new Date(sunrise.getTime() + (index - 1) * muhurtaMs)
    const end   = new Date(sunrise.getTime() + index       * muhurtaMs)
    return {
      start,
      end,
      startLocal: formatLocalTime(start, timezone),
      endLocal:   formatLocalTime(end,   timezone),
    }
  })
}

// ── Varjyam offset table by nakshatra (1-based, 1=Ashwini … 27=Revati) ──────
// Each value is the start offset as a fraction of one full nakshatra period.
// Varjyam lasts 4 ghatikas = 4/60 of a nakshatra period (= 1h 36m per 24h nk).
//
// These offsets are derived from the classical Varjya ghatika table:
// (Muhurta Chintamani, Varjya Kanda; Dharma Sindhu II)
// The table maps nakshatra number → starting ghatika (out of 60) within
// the nakshatra period, then converted to fractional offset.
const VARJYAM_OFFSET: Record<number, number> = {
   1: 0.400,   // Ashwini    — 24th ghatika
   2: 0.717,   // Bharani    — 43rd
   3: 0.483,   // Krittika   — 29th
   4: 0.133,   // Rohini     — 8th
   5: 0.567,   // Mrigashira — 34th
   6: 0.650,   // Ardra      — 39th
   7: 0.300,   // Punarvasu  — 18th
   8: 0.767,   // Pushya     — 46th
   9: 0.850,   // Ashlesha   — 51st
  10: 0.183,   // Magha      — 11th
  11: 0.033,   // Purva Phalguni — 2nd
  12: 0.533,   // Uttara Phalguni — 32nd
  13: 0.617,   // Hasta      — 37th
  14: 0.250,   // Chitra     — 15th
  15: 0.083,   // Swati      — 5th
  16: 0.883,   // Vishakha   — 53rd
  17: 0.467,   // Anuradha   — 28th
  18: 0.350,   // Jyeshtha   — 21st
  19: 0.933,   // Moola      — 56th
  20: 0.700,   // Purva Ashadha — 42nd
  21: 0.217,   // Uttara Ashadha — 13th
  22: 0.783,   // Shravana   — 47th
  23: 0.433,   // Dhanishtha — 26th
  24: 0.967,   // Shatabhisha — 58th
  25: 0.550,   // Purva Bhadrapada — 33rd
  26: 0.100,   // Uttara Bhadrapada — 6th
  27: 0.817,   // Revati     — 49th
}

/** Varjyam duration: 4 ghatikas as fraction of nakshatra period */
const VARJYAM_FRACTION = 4 / 60   // ≈ 0.0667 of nakshatra period

/**
 * Compute the Varjyam window for a given nakshatra period.
 *
 * @param nakshatraStart   Start time of the current nakshatra (UTC Date)
 * @param nakshatraEnd     End time of the current nakshatra (UTC Date)
 * @param nakshatraNumber  1-based nakshatra number (1=Ashwini … 27=Revati)
 * @param timezone         IANA timezone
 */
export function computeVarjyam(
  nakshatraStart:  Date,
  nakshatraEnd:    Date,
  nakshatraNumber: number,
  timezone:        string
): TimeRange {
  const nkDurationMs = nakshatraEnd.getTime() - nakshatraStart.getTime()
  const offset        = VARJYAM_OFFSET[nakshatraNumber] ?? 0.5

  const start = new Date(nakshatraStart.getTime() + offset              * nkDurationMs)
  const end   = new Date(nakshatraStart.getTime() + (offset + VARJYAM_FRACTION) * nkDurationMs)

  return {
    start,
    end,
    startLocal: formatLocalTime(start, timezone),
    endLocal:   formatLocalTime(end,   timezone),
  }
}
