// ─────────────────────────────────────────────────────────────────────────────
// Abhijit Muhurta Engine
// Abhijit = "the victorious" — the most universally auspicious Muhurta
// Defined as a 48-minute window centred on solar noon (transit)
// Some texts give it as the 8th Muhurta of the day (out of 15)
// ─────────────────────────────────────────────────────────────────────────────

import type { TimeRange } from '../../types/panchanga'
import { formatLocalTime } from '../ephemeris/julian-day'

/**
 * Duration of Abhijit Muhurta on each side of solar noon, in milliseconds.
 * Classically: 24 minutes before and after noon = 48 minute window.
 */
const ABHIJIT_HALF_DURATION_MS = 24 * 60 * 1000   // 24 minutes in ms

/**
 * Compute the Abhijit Muhurta window for a given day.
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
  // Solar noon = midpoint of sunrise and sunset
  const solarNoonMs = (sunrise.getTime() + sunset.getTime()) / 2

  const start = new Date(solarNoonMs - ABHIJIT_HALF_DURATION_MS)
  const end   = new Date(solarNoonMs + ABHIJIT_HALF_DURATION_MS)

  return {
    start,
    end,
    startLocal: formatLocalTime(start, timezone),
    endLocal:   formatLocalTime(end,   timezone),
  }
}
