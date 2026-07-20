// ─────────────────────────────────────────────────────────────────────────────
// Abhijit Muhurta Engine  [V1.1 — Dynamic Calculation]
//
// Abhijit = "the victorious" — the most universally auspicious Muhurta.
// Classical definition: the 8th Muhurta of the 15 daytime Muhurtas.
//
// V1.1 FIX: Previous version used a fixed ±24-minute window around solar noon.
// Correct calculation divides actual daytime (sunrise→sunset) into 15 equal
// Muhurtas; the 8th is Abhijit. This makes duration vary with day length
// (~40 min in winter, ~56 min in summer at Indian latitudes).
//
// Source: Muhurta Chintamani (Rama Dayalu), Chapter 1; Brihat Samhita (XXIV)
// ─────────────────────────────────────────────────────────────────────────────

import type { TimeRange } from '../../types/panchanga'
import { formatLocalTime } from '../ephemeris/julian-day'

/** Number of equal daytime Muhurtas in classical reckoning */
const DAYTIME_MUHURTAS = 15

/** Abhijit is the 8th Muhurta (1-based → 0-based index = 7) */
const ABHIJIT_INDEX = 7   // 0-based

/**
 * Compute the Abhijit Muhurta window for a given day.
 *
 * Divides actual daytime (sunrise → sunset) into 15 equal Muhurtas.
 * The 8th Muhurta is Abhijit — centred on solar noon, with duration
 * proportional to the real length of the day.
 *
 * @param sunrise   Sunrise as UTC Date
 * @param sunset    Sunset as UTC Date
 * @param timezone  IANA timezone string
 */
export function computeAbhijitMuhurta(
  sunrise:  Date,
  sunset:   Date,
  timezone: string
): TimeRange {
  const daytimeMs   = sunset.getTime() - sunrise.getTime()
  const muhurtaMs   = daytimeMs / DAYTIME_MUHURTAS

  // 8th Muhurta (0-based index 7): starts at 7×muhurta, ends at 8×muhurta
  const start = new Date(sunrise.getTime() + ABHIJIT_INDEX       * muhurtaMs)
  const end   = new Date(sunrise.getTime() + (ABHIJIT_INDEX + 1) * muhurtaMs)

  return {
    start,
    end,
    startLocal: formatLocalTime(start, timezone),
    endLocal:   formatLocalTime(end,   timezone),
  }
}
