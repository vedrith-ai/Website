// ─────────────────────────────────────────────────────────────────────────────
// Solar Position Engine
// Algorithm: Jean Meeus "Astronomical Algorithms" 2nd Ed., Chapter 25
// VSOP87 simplified — accuracy < 0.01° for dates 1950–2050
// ─────────────────────────────────────────────────────────────────────────────

import { julianCenturies, normalize360, toRad } from './julian-day'

export interface SolarPosition {
  /** Apparent tropical (geometric) longitude, degrees [0–360) */
  tropicalLongitude: number
  /** Sun's mean anomaly, degrees */
  meanAnomaly: number
  /** Equation of center, degrees */
  equationOfCenter: number
  /** Solar declination, degrees */
  declination: number
  /** Right Ascension, degrees */
  rightAscension: number
  /** Equation of time, minutes */
  equationOfTime: number
}

/**
 * Compute the Sun's apparent tropical longitude and related quantities
 * for a given Julian Day (UT).
 *
 * @param jde  Julian Day in Terrestrial Time (≈ UT for our purposes)
 */
export function computeSolarPosition(jde: number): SolarPosition {
  const T  = julianCenturies(jde)
  const T2 = T * T
  const T3 = T2 * T

  // ── Geometric mean longitude of the Sun (degrees) ─────────────────────────
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T2
  L0 = normalize360(L0)

  // ── Mean anomaly of the Sun (degrees) ─────────────────────────────────────
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T2 + T3 / 24490000.0
  M = normalize360(M)
  const Mrad = toRad(M)

  // ── Equation of center ────────────────────────────────────────────────────
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T)                  * Math.sin(2 * Mrad) +
    0.000289                                    * Math.sin(3 * Mrad)

  // ── Sun's true longitude ───────────────────────────────────────────────────
  const sunTrue = normalize360(L0 + C)

  // ── Sun's true anomaly ────────────────────────────────────────────────────
  const v = normalize360(M + C)

  // ── Apparent longitude (nutation + aberration) ────────────────────────────
  const omega    = normalize360(125.04 - 1934.136 * T)
  const omegaRad = toRad(omega)
  const apparent = normalize360(sunTrue - 0.00569 - 0.00478 * Math.sin(omegaRad))

  // ── Obliquity of the ecliptic (Meeus Ch.22) ───────────────────────────────
  const eps0  = 23.0 + 26.0 / 60.0 + 21.448 / 3600.0
                - (46.8150 * T + 0.00059 * T2 - 0.001813 * T3) / 3600.0
  const eps   = eps0 + 0.00256 * Math.cos(omegaRad)   // corrected obliquity
  const epsRad = toRad(eps)

  // ── Right Ascension and Declination ───────────────────────────────────────
  const apparentRad = toRad(apparent)
  const ra  = normalize360(toDegFromRad(
    Math.atan2(Math.cos(epsRad) * Math.sin(apparentRad), Math.cos(apparentRad))
  ))
  const dec = toDegFromRad(Math.asin(Math.sin(epsRad) * Math.sin(apparentRad)))

  // ── Equation of Time (minutes) — Meeus p.185 ────────────────────────────
  const y    = Math.tan(epsRad / 2) ** 2
  const L0rad = toRad(L0)
  const eot  = toDegFromRad(
    y * Math.sin(2 * L0rad) -
    2 * eccentricity(T) * Math.sin(Mrad) +
    4 * eccentricity(T) * y * Math.sin(Mrad) * Math.cos(2 * L0rad) -
    0.5 * y * y * Math.sin(4 * L0rad) -
    1.25 * eccentricity(T) ** 2 * Math.sin(2 * Mrad)
  ) * 4  // convert degrees to minutes of time

  return {
    tropicalLongitude: apparent,
    meanAnomaly:       M,
    equationOfCenter:  C,
    declination:       dec,
    rightAscension:    ra,
    equationOfTime:    eot,
  }
}

/** Earth's orbital eccentricity */
function eccentricity(T: number): number {
  return 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T
}

/** Radians to degrees helper (avoids circular import) */
function toDegFromRad(rad: number): number {
  return (rad * 180) / Math.PI
}

/**
 * Get only the Sun's tropical longitude for a given JD.
 * Convenience wrapper used by other modules.
 */
export function sunTropicalLongitude(jde: number): number {
  return computeSolarPosition(jde).tropicalLongitude
}
