// ─────────────────────────────────────────────────────────────────────────────
// Julian Day Number Utilities
// Ref: Jean Meeus "Astronomical Algorithms" 2nd Ed., Chapter 7
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a Gregorian calendar date and Universal Time to Julian Day Number.
 * Valid for all dates from 15 October 1582 (Gregorian reform) onwards.
 *
 * @param year   Full year (e.g. 2024)
 * @param month  Month 1–12
 * @param day    Day of month 1–31
 * @param utHour Hours in Universal Time (0–24, fractional allowed)
 */
export function gregorianToJD(
  year:   number,
  month:  number,
  day:    number,
  utHour: number = 0
): number {
  let Y = year
  let M = month

  if (M <= 2) {
    Y -= 1
    M += 12
  }

  const A = Math.trunc(Y / 100)
  const B = 2 - A + Math.trunc(A / 4)

  return (
    Math.trunc(365.25 * (Y + 4716)) +
    Math.trunc(30.6001 * (M + 1)) +
    day +
    B -
    1524.5 +
    utHour / 24.0
  )
}

/**
 * Convert Julian Day Number to Gregorian calendar date (UT).
 * Returns { year, month, day, hour } where hour is fractional UT.
 */
export function jdToGregorian(jd: number): {
  year:  number
  month: number
  day:   number
  hour:  number
} {
  const jd0 = jd + 0.5
  const Z   = Math.trunc(jd0)
  const F   = jd0 - Z

  let A: number
  if (Z < 2299161) {
    A = Z
  } else {
    const alpha = Math.trunc((Z - 1867216.25) / 36524.25)
    A = Z + 1 + alpha - Math.trunc(alpha / 4)
  }

  const B = A + 1524
  const C = Math.trunc((B - 122.1) / 365.25)
  const D = Math.trunc(365.25 * C)
  const E = Math.trunc((B - D) / 30.6001)

  const day   = B - D - Math.trunc(30.6001 * E)
  const month = E < 14 ? E - 1 : E - 13
  const year  = month > 2 ? C - 4716 : C - 4715
  const hour  = F * 24

  return { year, month, day, hour }
}

/**
 * Convert a local date string "YYYY-MM-DD" and timezone to Julian Day at midnight UT.
 * Also returns the UTC offset in hours for the given date+timezone.
 */
export function localDateToJD(
  dateStr:  string,   // "YYYY-MM-DD"
  timezone: string    // IANA tz, e.g. "Asia/Kolkata"
): { jd: number; utcOffsetHours: number } {
  const [yearStr, monthStr, dayStr] = dateStr.split('-')
  const year  = parseInt(yearStr,  10)
  const month = parseInt(monthStr, 10)
  const day   = parseInt(dayStr,   10)

  // Determine the UTC offset for this date and timezone using Intl
  const testDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  const utcOffsetHours = getUTCOffsetHours(testDate, timezone)

  // Local midnight in UT = 0h - utcOffset
  const midnightUT = -utcOffsetHours

  const jd = gregorianToJD(year, month, day, midnightUT)
  return { jd, utcOffsetHours }
}

/**
 * Get the UTC offset in hours for a given Date and IANA timezone string.
 * Positive = east of UTC (e.g. India = +5.5).
 */
export function getUTCOffsetHours(date: Date, timezone: string): number {
  try {
    // Use Intl to find offset: compare UTC time with local time interpretation
    const utcStr   = date.toLocaleString('en-CA', { timeZone: 'UTC',     hour12: false })
    const localStr = date.toLocaleString('en-CA', { timeZone: timezone,  hour12: false })
    const utcMs    = new Date(utcStr   + 'Z').getTime()
    const localMs  = new Date(localStr + 'Z').getTime()
    return (localMs - utcMs) / 3_600_000
  } catch {
    // Fallback to IST if timezone is unrecognised
    return 5.5
  }
}

/**
 * Convert a JD to a JavaScript Date object (UTC).
 */
export function jdToDate(jd: number): Date {
  const { year, month, day, hour } = jdToGregorian(jd)
  const ms = Date.UTC(
    year,
    month - 1,
    day,
    Math.trunc(hour),
    Math.round((hour % 1) * 60)
  )
  return new Date(ms)
}

/**
 * Format a Date as a local time string in a given timezone.
 * Returns e.g. "06:14 AM"
 */
export function formatLocalTime(date: Date, timezone: string): string {
  return date.toLocaleTimeString('en-IN', {
    timeZone: timezone,
    hour:     '2-digit',
    minute:   '2-digit',
    hour12:   true,
  })
}

/**
 * Get the Julian Day for J2000.0 epoch.
 */
export const J2000 = 2451545.0

/**
 * Julian centuries from J2000.0.
 */
export function julianCenturies(jd: number): number {
  return (jd - J2000) / 36525.0
}

/**
 * Normalize an angle in degrees to [0, 360).
 */
export function normalize360(deg: number): number {
  let d = deg % 360
  if (d < 0) d += 360
  return d
}

/**
 * Convert degrees to radians.
 */
export function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Convert radians to degrees.
 */
export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI
}
