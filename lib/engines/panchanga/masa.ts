// ─────────────────────────────────────────────────────────────────────────────
// Chandramana Masa Engine (Lunar Month)
//
// Computes the lunar month name (Chaitra…Phalguna) using both the Amanta
// (South Indian / Kannada tradition — month ends at Amavasya) and
// Purnimanta (North Indian tradition — month ends at Purnima) systems.
//
// ALGORITHM (standard, used by most Panchanga software):
//   1. Find the JD of the next Amavasya (New Moon) from the current moment.
//      This marks the END of the current Amanta lunar month.
//   2. Compute the Sun's sidereal longitude at that Amavasya.
//   3. amantaMasaIndex = floor(sunSiderealAtAmavasya / 30)   → 0=Chaitra…11=Phalguna
//      (The lunar month takes the name of the solar Rashi the Sun occupies
//       at the Amavasya that ends it — the standard naming convention.)
//   4. Purnimanta month name derives from Amanta via the well-known rule:
//        - If current Paksha = SHUKLA → Purnimanta masa = Amanta masa (same)
//        - If current Paksha = KRISHNA → Purnimanta masa = Amanta masa + 1
//      (Verified against the Diwali example: Amanta "Ashwin" Krishna paksha
//       = Purnimanta "Kartik" Krishna paksha; Ashwin(7)+1=Kartik(8). ✓)
//
// KNOWN LIMITATION (documented, not silently ignored):
//   Adhika Masa (leap month) and Kshaya Masa (deficit month) detection —
//   which occur when the Sun does/doesn't change Rashi within a single
//   lunar month — are NOT implemented in V1.1. These are rare events
//   (Adhika Masa occurs roughly once every 32-33 months) and the standard
//   naming above is correct for all non-leap months, which is the vast
//   majority of dates. This is a documented scope boundary for a future
//   release, not a silent inaccuracy.
// ─────────────────────────────────────────────────────────────────────────────

import { normalize360 } from '../ephemeris/julian-day'
import { tropicalToSidereal } from '../ephemeris/ayanamsha'
import { sunTropicalLongitude }  from '../ephemeris/solar'
import { moonTropicalLongitude } from '../ephemeris/lunar'
import { MASA_NAMES, type NameTable } from '../../knowledge/localization'
import type { AyanamshaKey, Paksha, CalendarSystem } from '../../types/panchanga'

export interface MasaInfo {
  /** 0=Chaitra … 11=Phalguna */
  index:     number
  name:      string       // English name (e.g. "Chaitra")
  nameTranslations: NameTable
}

export interface MasaResult {
  amanta:     MasaInfo
  purnimanta: MasaInfo
  /** The system selected by the query (default AMANTA) */
  calendarSystem: CalendarSystem
  /** Convenience: whichever of amanta/purnimanta matches calendarSystem */
  current:    MasaInfo
}

/**
 * Compute the Chandramana Masa (Amanta + Purnimanta) for a given moment.
 *
 * @param jd             Julian Day (UT) — typically local sunrise
 * @param currentPaksha  The Paksha (SHUKLA/KRISHNA) at this jd, from computeTithi()
 * @param ayanamsha      Ayanamsha system (default LAHIRI)
 * @param calendarSystem Which system to expose as `current` (default AMANTA)
 */
export function computeMasa(
  jd:              number,
  currentPaksha:   Paksha,
  ayanamsha:       AyanamshaKey = 'LAHIRI',
  calendarSystem:  CalendarSystem = 'AMANTA'
): MasaResult {
  // ── 1. Find the next Amavasya (end of current Amanta month) ───────────────
  const nextAmavasyaJD = findNextAmavasyaJD(jd, ayanamsha)

  // ── 2. Sun's sidereal longitude at that Amavasya ──────────────────────────
  const sunSidAtAmavasya = tropicalToSidereal(
    sunTropicalLongitude(nextAmavasyaJD), nextAmavasyaJD, ayanamsha
  )

  // ── 3. Amanta masa index from solar Rashi (0=Mesha/Chaitra…11=Meena/Phalguna)
  const amantaIndex = Math.floor(sunSidAtAmavasya / 30) % 12

  // ── 4. Purnimanta masa index via the Paksha-offset rule ───────────────────
  const purnimantaIndex = currentPaksha === 'KRISHNA'
    ? (amantaIndex + 1) % 12
    : amantaIndex

  const amanta: MasaInfo = {
    index: amantaIndex,
    name:  MASA_NAMES[amantaIndex].en,
    nameTranslations: MASA_NAMES[amantaIndex],
  }

  const purnimanta: MasaInfo = {
    index: purnimantaIndex,
    name:  MASA_NAMES[purnimantaIndex].en,
    nameTranslations: MASA_NAMES[purnimantaIndex],
  }

  return {
    amanta,
    purnimanta,
    calendarSystem,
    current: calendarSystem === 'PURNIMANTA' ? purnimanta : amanta,
  }
}

/**
 * Binary search for the next Amavasya (New Moon, elongation ≡ 0°/360°)
 * strictly after the given JD.
 *
 * Mirrors the binary-search pattern used in tithi.ts/nakshatra.ts/yoga.ts —
 * same helper functions (normalize360, tropicalToSidereal), same tolerance,
 * same max-iteration bound — for consistency with existing engine code.
 */
function findNextAmavasyaJD(jdStart: number, ayanamsha: AyanamshaKey): number {
  const sunSidStart  = tropicalToSidereal(sunTropicalLongitude(jdStart),  jdStart, ayanamsha)
  const moonSidStart = tropicalToSidereal(moonTropicalLongitude(jdStart), jdStart, ayanamsha)
  const elongStart   = normalize360(moonSidStart - sunSidStart)

  // Next Amavasya = next point where elongation wraps to 360 (≡ 0)
  const targetElong = 360

  let lo = jdStart
  let hi = jdStart + 30   // a synodic month is ~29.53 days; 30 is a safe upper bound

  for (let i = 0; i < 60; i++) {
    const mid      = (lo + hi) / 2
    const sunSid   = tropicalToSidereal(sunTropicalLongitude(mid),  mid, ayanamsha)
    const moonSid  = tropicalToSidereal(moonTropicalLongitude(mid), mid, ayanamsha)
    const elong    = normalize360(moonSid - sunSid)
    const adjusted = elong < elongStart ? elong + 360 : elong

    if (Math.abs(adjusted - targetElong) < 0.0001) break
    if (adjusted < targetElong) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}
