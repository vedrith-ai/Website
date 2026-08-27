// ─────────────────────────────────────────────────────────────────────────────
// Lunar Position Engine
// Algorithm: Jean Meeus "Astronomical Algorithms" 2nd Ed., Chapter 47
// ELP2000/82 simplified — accuracy < 0.1° for dates 1900–2100
// Sufficient for Panchanga: Tithi spans 12°, Nakshatra spans 13.33°
// ─────────────────────────────────────────────────────────────────────────────

import { julianCenturies, normalize360, toRad } from './julian-day'

export interface LunarPosition {
  /** Tropical longitude, degrees [0–360) */
  tropicalLongitude: number
  /** Tropical latitude, degrees */
  latitude: number
  /** Distance from Earth centre, km */
  distanceKm: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Periodic terms for longitude (Meeus Table 47.A — top 30 terms)
// Columns: D, M, Mp, F, coefficient (in 0.000001 degrees)
// ─────────────────────────────────────────────────────────────────────────────
const LONGITUDE_TERMS: [number, number, number, number, number][] = [
  [  0,  0,  1,  0,  6288774],
  [  2,  0, -1,  0,  1274027],
  [  2,  0,  0,  0,   658314],
  [  0,  0,  2,  0,   213618],
  [  0,  1,  0,  0,  -185116],
  [  0,  0,  0,  2,  -114332],
  [  2,  0, -2,  0,    58793],
  [  2, -1, -1,  0,    57066],
  [  2,  0,  1,  0,    53322],
  [  2, -1,  0,  0,    45758],
  [  0,  1, -1,  0,   -40923],
  [  1,  0,  0,  0,   -34720],
  [  0,  1,  1,  0,   -30383],
  [  2,  0,  0, -2,    15327],
  [  0,  0,  1,  2,   -12528],
  [  0,  0,  1, -2,    10980],
  [  4,  0, -1,  0,    10675],
  [  0,  0,  3,  0,    10034],
  [  4,  0, -2,  0,     8548],
  [  2,  1, -1,  0,    -7888],
  [  2,  1,  0,  0,    -6766],
  [  1,  0, -1,  0,    -5163],
  [  1,  1,  0,  0,     4987],
  [  2, -1,  1,  0,     4036],
  [  2,  0,  2,  0,     3994],
  [  4,  0,  0,  0,     3861],
  [  2,  0, -3,  0,     3665],
  [  0,  1, -2,  0,    -2689],
  [  2,  0, -1,  2,    -2602],
  [  2, -1, -2,  0,     2390],
]

// ─────────────────────────────────────────────────────────────────────────────
// Periodic terms for latitude (Meeus Table 47.B — top 15 terms)
// ─────────────────────────────────────────────────────────────────────────────
const LATITUDE_TERMS: [number, number, number, number, number][] = [
  [  0,  0,  0,  1,  5128122],
  [  0,  0,  1,  1,   280602],
  [  0,  0,  1, -1,   277693],
  [  2,  0,  0, -1,   173237],
  [  2,  0, -1,  1,    55413],
  [  2,  0, -1, -1,    46271],
  [  2,  0,  0,  1,    32573],
  [  0,  0,  2,  1,    17198],
  [  2,  0,  1, -1,     9266],
  [  0,  0,  2, -1,     8822],
  [  2, -1,  0, -1,     8216],
  [  2,  0, -2, -1,     4324],
  [  2,  0,  1,  1,     4200],
  [  2,  1,  0, -1,    -3359],
  [  2, -1, -1,  1,     2463],
]

/**
 * Compute the Moon's tropical longitude, latitude, and distance for a given JD.
 */
export function computeLunarPosition(jde: number): LunarPosition {
  const T  = julianCenturies(jde)
  const T2 = T * T
  const T3 = T2 * T
  const T4 = T3 * T

  // ── Fundamental arguments (Meeus §47.1) ──────────────────────────────────

  // Moon's mean longitude (degrees)
  const Lp = normalize360(
    218.3164477
    + 481267.88123421 * T
    - 0.0015786       * T2
    + T3 / 538841.0
    - T4 / 65194000.0
  )

  // Moon's mean anomaly (degrees)
  const Mp = normalize360(
    134.9633964
    + 477198.8675055 * T
    + 0.0087414      * T2
    + T3 / 69699.0
    - T4 / 14712000.0
  )

  // Moon's mean elongation (degrees)
  const D = normalize360(
    297.8501921
    + 445267.1114034 * T
    - 0.0018819      * T2
    + T3 / 545868.0
    - T4 / 113065000.0
  )

  // Sun's mean anomaly (degrees)
  const M = normalize360(
    357.5291092
    + 35999.0502909 * T
    - 0.0001536     * T2
    + T3 / 24490000.0
  )

  // Moon's argument of latitude (degrees)
  const F = normalize360(
    93.2720950
    + 483202.0175233 * T
    - 0.0036539      * T2
    - T3 / 3526000.0
    + T4 / 863310000.0
  )

  // Additional arguments (degrees)
  const A1 = normalize360(119.75 + 131.849   * T)
  const A2 = normalize360( 53.09 + 479264.290 * T)
  const A3 = normalize360(313.45 + 481266.484 * T)

  // Earth's orbital eccentricity (affects M-dependent terms)
  const E  = 1.0 - 0.002516 * T - 0.0000074 * T2
  const E2 = E * E

  // Convert to radians
  const Dprad  = toRad(D)
  const Mrad   = toRad(M)
  const Mprad  = toRad(Mp)
  const Frad   = toRad(F)

  // ── Sum longitude periodic terms ─────────────────────────────────────────
  let sumL = 0
  for (const [d, m, mp, f, coeff] of LONGITUDE_TERMS) {
    const arg = d * Dprad + m * Mrad + mp * Mprad + f * Frad
    let term  = coeff * Math.sin(arg)
    // Apply eccentricity correction for M-dependent terms
    if (Math.abs(m) === 1) term *= E
    if (Math.abs(m) === 2) term *= E2
    sumL += term
  }

  // Additional corrections
  sumL += 3958  * Math.sin(toRad(A1))
  sumL += 1962  * Math.sin(toRad(Lp - F))   // note: Lp - F in degrees
  sumL +=  318  * Math.sin(toRad(A2))

  // ── Sum latitude periodic terms ───────────────────────────────────────────
  let sumB = 0
  for (const [d, m, mp, f, coeff] of LATITUDE_TERMS) {
    const arg = d * Dprad + m * Mrad + mp * Mprad + f * Frad
    let term  = coeff * Math.sin(arg)
    if (Math.abs(m) === 1) term *= E
    if (Math.abs(m) === 2) term *= E2
    sumB += term
  }

  // Additional latitude corrections
  sumB -= 2235 * Math.sin(toRad(Lp))
  sumB +=  382 * Math.sin(toRad(A3))
  sumB +=  175 * Math.sin(toRad(A1 - F))
  sumB +=  175 * Math.sin(toRad(A1 + F))
  sumB +=  127 * Math.sin(toRad(Lp - Mp))
  sumB -=  115 * Math.sin(toRad(Lp + Mp))

  // ── Distance periodic terms (top 5, for moonrise/set refraction) ──────────
  const sumR = -20905355 * Math.cos(Mprad)
            -  3699111 * Math.cos(2 * Dprad - Mprad)
            -  2955968 * Math.cos(2 * Dprad)
            -   569925 * Math.cos(2 * Mprad)
            +    48888 * E * Math.cos(Mrad)
  // Convert to km (385000.56 km ≈ mean distance)
  const distanceKm = 385000.56 + sumR / 1000.0

  // ── Final coordinates ─────────────────────────────────────────────────────
  const longitude = normalize360(Lp + sumL / 1_000_000.0)
  const latitude  = sumB / 1_000_000.0   // degrees, small so no normalize needed

  return { tropicalLongitude: longitude, latitude, distanceKm }
}

/**
 * Convenience: get only the Moon's tropical longitude.
 */
export function moonTropicalLongitude(jde: number): number {
  return computeLunarPosition(jde).tropicalLongitude
}
