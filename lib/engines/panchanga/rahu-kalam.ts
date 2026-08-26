// ─────────────────────────────────────────────────────────────────────────────
// Rahu Kalam / Gulika Kalam / Yamaganda Engine
// Each inauspicious period = 1/8 of the day duration (sunrise to sunset)
// Period positions vary by weekday — classical Muhurta Chintamani rules
// ─────────────────────────────────────────────────────────────────────────────

import type { TimeRange } from '../../types/panchanga'
import { formatLocalTime } from '../ephemeris/julian-day'

/**
 * Period index (1-based, starting from sunrise) by weekday.
 * weekday index: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
 *
 * Verified against Drik Panchanga and traditional Muhurta texts.
 */
const RAHU_KALAM_PERIOD: Record<number, number> = {
  0: 8,  // Sunday:    8th period
  1: 2,  // Monday:    2nd period
  2: 7,  // Tuesday:   7th period
  3: 5,  // Wednesday: 5th period
  4: 6,  // Thursday:  6th period
  5: 3,  // Friday:    3rd period
  6: 4,  // Saturday:  4th period
}

const GULIKA_KALAM_PERIOD: Record<number, number> = {
  0: 7,  // Sunday
  1: 6,  // Monday
  2: 5,  // Tuesday
  3: 4,  // Wednesday
  4: 3,  // Thursday
  5: 2,  // Friday
  6: 1,  // Saturday
}

const YAMAGANDA_PERIOD: Record<number, number> = {
  0: 5,  // Sunday
  1: 4,  // Monday
  2: 3,  // Tuesday
  3: 2,  // Wednesday
  4: 1,  // Thursday
  5: 7,  // Friday
  6: 6,  // Saturday
}

/**
 * Compute the time range for an inauspicious period.
 *
 * @param sunrise     Sunrise as JS Date (UTC)
 * @param sunset      Sunset as JS Date (UTC)
 * @param periodIndex 1-based index of the period (1=first 1/8 of day)
 * @param timezone    IANA timezone for formatting
 */
function computePeriod(
  sunrise:     Date,
  sunset:      Date,
  periodIndex: number,
  timezone:    string
): TimeRange {
  const dayDurationMs = sunset.getTime() - sunrise.getTime()
  const periodMs      = dayDurationMs / 8.0

  const start = new Date(sunrise.getTime() + (periodIndex - 1) * periodMs)
  const end   = new Date(sunrise.getTime() + periodIndex       * periodMs)

  return {
    start,
    end,
    startLocal: formatLocalTime(start, timezone),
    endLocal:   formatLocalTime(end,   timezone),
  }
}

/**
 * Compute Rahu Kalam for a given day.
 *
 * @param sunrise   Sunrise Date (UTC)
 * @param sunset    Sunset Date (UTC)
 * @param weekday   0=Sun, 1=Mon, ..., 6=Sat
 * @param timezone  IANA timezone
 */
export function computeRahuKalam(
  sunrise:  Date,
  sunset:   Date,
  weekday:  number,
  timezone: string
): TimeRange {
  return computePeriod(sunrise, sunset, RAHU_KALAM_PERIOD[weekday], timezone)
}

/**
 * Compute Gulika Kalam for a given day.
 */
export function computeGulikaKalam(
  sunrise:  Date,
  sunset:   Date,
  weekday:  number,
  timezone: string
): TimeRange {
  return computePeriod(sunrise, sunset, GULIKA_KALAM_PERIOD[weekday], timezone)
}

/**
 * Compute Yamaganda for a given day.
 */
export function computeYamaganda(
  sunrise:  Date,
  sunset:   Date,
  weekday:  number,
  timezone: string
): TimeRange {
  return computePeriod(sunrise, sunset, YAMAGANDA_PERIOD[weekday], timezone)
}
