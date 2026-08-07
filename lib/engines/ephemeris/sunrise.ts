// ─────────────────────────────────────────────────────────────────────────────
// Sunrise / Sunset / Moonrise / Moonset Engine
// Algorithm: USNO Astronomical Applications Department
// Ref: Meeus Ch.15, Meeus Ch.17 (rise/set/transit)
// Accuracy: ±1 minute for latitudes |φ| < 65°
// ─────────────────────────────────────────────────────────────────────────────

import {
  normalize360,
  toRad,
  toDeg,
  gregorianToJD,
  julianCenturies,
} from './julian-day'
import { computeSolarPosition } from './solar'
import { computeLunarPosition  } from './lunar'

/** Standard atmospheric refraction + solar disc semi-diameter */
const SUN_ALTITUDE_AT_RISE  = -0.8333  // degrees (includes refraction)
const MOON_ALTITUDE_AT_RISE = 0.125    // degrees (no standard disc correction)

export interface SunTimes {
  sunrise:  Date
  sunset:   Date
  /** Solar noon (transit) */
  solarNoon: Date
}

export interface MoonTimes {
  moonrise: Date | null
  moonset:  Date | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Sun rise / set
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute sunrise, sunset, and solar noon for a given date and location.
 *
 * @param year   Local year
 * @param month  Local month (1–12)
 * @param day    Local day
 * @param lat    Observer latitude (degrees, positive = N)
 * @param lng    Observer longitude (degrees, positive = E)
 * @returns SunTimes with UTC Date objects
 */
export function computeSunTimes(
  year:  number,
  month: number,
  day:   number,
  lat:   number,
  lng:   number
): SunTimes {
  // JD for noon UTC on the requested date
  const jdNoon = gregorianToJD(year, month, day, 12.0)

  // Initial solar position at noon
  const { equationOfTime, declination } =
    computeSolarPosition(jdNoon)

  const latRad  = toRad(lat)
  const decRad  = toRad(declination)
  const h0Rad   = toRad(SUN_ALTITUDE_AT_RISE)

  // Hour angle at rise/set
  const cosH = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(decRad)) /
               (Math.cos(latRad) * Math.cos(decRad))

  // Handle circumpolar / never-rises cases
  let H0deg: number
  if (cosH < -1) {
    H0deg = 180  // midnight sun — always above horizon
  } else if (cosH > 1) {
    H0deg = 0    // polar night — never rises
  } else {
    H0deg = toDeg(Math.acos(cosH))
  }

  // Transit time in decimal hours (UT)
  // Transit = 12 + correction for longitude and equation of time
  const transit = 12.0 - lng / 15.0 - equationOfTime / 60.0

  const sunriseUT = transit - H0deg / 15.0
  const sunsetUT  = transit + H0deg / 15.0

  return {
    sunrise:   utHourToDate(year, month, day, sunriseUT),
    sunset:    utHourToDate(year, month, day, sunsetUT),
    solarNoon: utHourToDate(year, month, day, transit),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Moon rise / set  (iterative approach — Moon moves ~13° per day)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute moonrise and moonset for a given date and location.
 * Uses a 3-pass iterative method because the Moon's declination changes
 * significantly over a 24-hour period.
 */
export function computeMoonTimes(
  year:  number,
  month: number,
  day:   number,
  lat:   number,
  lng:   number
): MoonTimes {
  try {
    const moonrise = findMoonEvent(year, month, day, lat, lng, 'rise')
    const moonset  = findMoonEvent(year, month, day, lat, lng, 'set')
    return { moonrise, moonset }
  } catch {
    return { moonrise: null, moonset: null }
  }
}

function findMoonEvent(
  year:  number,
  month: number,
  day:   number,
  lat:   number,
  lng:   number,
  event: 'rise' | 'set'
): Date | null {
  const latRad  = toRad(lat)
  const h0Rad   = toRad(MOON_ALTITUDE_AT_RISE)

  // Start with an estimate at 6h (rise) or 18h (set) UT
  let jdEst = gregorianToJD(year, month, day, event === 'rise' ? 6.0 : 18.0)

  for (let iter = 0; iter < 5; iter++) {
    const { tropicalLongitude: moonLng, latitude: moonLat } =
      computeLunarPosition(jdEst)

    // Moon's equatorial coordinates (approximate)
    const { dec: moonDec, ra: moonRA } = eclipticToEquatorial(
      moonLng, moonLat, jdEst
    )

    const decRad = toRad(moonDec)
    const cosH   = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(decRad)) /
                   (Math.cos(latRad) * Math.cos(decRad))

    if (cosH < -1 || cosH > 1) return null  // always above/below horizon

    const H0    = toDeg(Math.acos(cosH))
    const transit = moonTransit(moonRA, lng, jdEst)

    const eventUT = event === 'rise'
      ? transit - H0 / 15.0
      : transit + H0 / 15.0

    const jdNew = gregorianToJD(year, month, day, eventUT)
    if (Math.abs(jdNew - jdEst) < 0.001 / 24.0) break   // converged
    jdEst = jdNew
  }

  const { hour: rh } = jdToGregorianLocal(jdEst)
  return utHourToDate(year, month, day, rh + (jdEst - gregorianToJD(year, month, day, 0)) * 24)
}

/** Approximate Moon transit time in hours UT */
function moonTransit(raDecDeg: number, lngDeg: number, jd: number): number {
  // GMST at 0h UT for the JD's day
  const T    = julianCenturies(Math.floor(jd) + 0.5)
  const gmst = normalize360(100.4606184 + 36000.77004 * T + 0.000387933 * T * T)
  const lha  = normalize360(gmst + lngDeg - raDecDeg)
  return 12.0 - lha / 15.0
}

/** Convert ecliptic to equatorial (approximate) */
function eclipticToEquatorial(
  lng: number, lat: number, jd: number
): { dec: number; ra: number } {
  const T   = julianCenturies(jd)
  const eps = 23.4393 - 0.01300 * T   // obliquity (degrees)
  const epsR = toRad(eps)
  const lngR = toRad(lng)
  const latR = toRad(lat)

  const sinDec = Math.sin(latR) * Math.cos(epsR) +
                 Math.cos(latR) * Math.sin(epsR) * Math.sin(lngR)
  const dec    = toDeg(Math.asin(sinDec))
  const ra     = normalize360(toDeg(
    Math.atan2(
      Math.sin(lngR) * Math.cos(epsR) - Math.tan(latR) * Math.sin(epsR),
      Math.cos(lngR)
    )
  ))
  return { dec, ra }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a fractional UT hour on a given Gregorian date to a JS Date (UTC) */
export function utHourToDate(
  year: number, month: number, day: number, utHour: number
): Date {
  // Convert fractional UT hours to milliseconds since epoch
  const ms = Date.UTC(year, month - 1, day) + utHour * 3_600_000
  return new Date(ms)
}

/** jdToGregorianLocal stub — avoid circular, just re-export via JD util */
function jdToGregorianLocal(jd: number): { year: number; month: number; day: number; hour: number } {
  const jd0 = jd + 0.5
  const Z   = Math.trunc(jd0)
  const F   = jd0 - Z
  let A     = Z
  if (Z >= 2299161) {
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
  return { year, month, day, hour: F * 24 }
}
