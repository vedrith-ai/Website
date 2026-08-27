// ─────────────────────────────────────────────────────────────────────────────
// Ayanamsha Engine
// Converts tropical longitudes to sidereal (Vedic) longitudes
// Reference: IAU/Lahiri standard, KP ayanamsha, Raman ayanamsha
// ─────────────────────────────────────────────────────────────────────────────

import { julianCenturies, normalize360 } from './julian-day'
import type { AyanamshaKey } from '../../types/panchanga'

// ── Ayanamsha at J2000.0 (degrees) ───────────────────────────────────────────
// These values are calibrated reference points accepted in Vedic practice
const AYANAMSHA_J2000: Record<AyanamshaKey, number> = {
  // Lahiri (Chitrapaksha) — Government of India standard
  // Value at J2000.0 (Jan 1.5, 2000): 23.8532 degrees
  LAHIRI:      23.8532,

  // KP (Krishnamurti Paddhati) — K.S.Krishnamurti's value
  // Approximately 0.092° ahead of Lahiri
  KP:          23.9456,

  // Raman — B.V.Raman's ayanamsha
  // Slightly different from Lahiri
  RAMAN:       23.1928,

  // True Chitrapaksha — lunar position-based correction
  TRUE_CHITRA: 23.8569,
}

// Annual precession rate in degrees/year (mean precession)
const PRECESSION_RATE_DEG_PER_YEAR = 50.27 / 3600.0   // ≈ 0.01396°/year

/**
 * Compute the ayanamsha in degrees for a given Julian Day.
 *
 * The ayanamsha is the angle between the Tropical (vernal equinox) and
 * Sidereal (fixed star) zodiac origins. For a tropical longitude λ_trop,
 * the sidereal longitude is:
 *
 *   λ_sid = λ_trop − ayanamsha(JD)
 *
 * @param jd         Julian Day (UT)
 * @param ayanamsha  Which ayanamsha system to use (default LAHIRI)
 */
export function computeAyanamsha(
  jd:        number,
  ayanamsha: AyanamshaKey = 'LAHIRI'
): number {
  const T             = julianCenturies(jd)
  const yearsFromJ2000 = T * 100.0   // T is in centuries, so *100 = years

  const baseValue = AYANAMSHA_J2000[ayanamsha]
  const value     = baseValue + yearsFromJ2000 * PRECESSION_RATE_DEG_PER_YEAR

  // Clamp to [0, 360) — in normal use this will always be ~23–25°
  return normalize360(value)
}

/**
 * Convert a tropical longitude to sidereal using the given ayanamsha.
 *
 * @param tropicalLongitude  Tropical ecliptic longitude (degrees)
 * @param jd                 Julian Day for which to compute ayanamsha
 * @param ayanamsha          Ayanamsha system
 */
export function tropicalToSidereal(
  tropicalLongitude: number,
  jd:               number,
  ayanamsha:        AyanamshaKey = 'LAHIRI'
): number {
  const ay = computeAyanamsha(jd, ayanamsha)
  return normalize360(tropicalLongitude - ay)
}

/**
 * Get the ayanamsha value at a named epoch for reference / display.
 *
 * @param year     Gregorian year (integer)
 * @param ayanamsha
 */
export function ayanamshaForYear(year: number, ayanamsha: AyanamshaKey = 'LAHIRI'): number {
  const yearsFromJ2000 = year - 2000.0
  const baseValue      = AYANAMSHA_J2000[ayanamsha]
  return baseValue + yearsFromJ2000 * PRECESSION_RATE_DEG_PER_YEAR
}
