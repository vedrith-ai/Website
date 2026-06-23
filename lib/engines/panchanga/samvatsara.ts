// ─────────────────────────────────────────────────────────────────────────────
// Samvatsara Engine — 60-Year Brihaspati (Jovian) Cycle
//
// ALGORITHM:
//   The 60-year Samvatsara cycle is indexed against the Shaka calendar era
//   (Shalivahana Shaka — the era used in Kannada, Telugu, and most South
//   Indian Panchangas). The standard formula is:
//
//     cycleIndex (0-based) = (shakaYear + 11) mod 60
//     samvatsaraName       = SAMVATSARA_NAMES[cycleIndex]
//
//   Worked example (verified): Shaka 1947 (≈ 2025-26 CE) → (1947+11) mod 60
//   = 1958 mod 60 = 38 (0-based) → SAMVATSARA_NAMES[38] = "Vishvavasu" —
//   which matches the published Samvatsara name for that Shaka year.
//
// SHAKA YEAR DERIVATION FROM A GREGORIAN DATE:
//   The Shaka year increments at Chaitra Shukla Pratipada (Ugadi), which
//   falls in mid-March to mid-April. Given the Amanta masa index (0=Chaitra)
//   and Paksha for the query date, plus the Gregorian month:
//
//     - Jan, Feb                → Shaka year has NOT yet incremented this
//                                   Gregorian year → shakaYear = gYear - 79
//     - May…Dec                 → Ugadi has definitely passed             → shakaYear = gYear - 78
//     - Mar, Apr (Ugadi window) → check masa/paksha directly:
//         masaIndex === 0 (Chaitra) && paksha === SHUKLA  → past Ugadi    → gYear - 78
//         masaIndex === 0 (Chaitra) && paksha === KRISHNA → before Ugadi  → gYear - 79
//         masaIndex >= 1 (Vaishakha+)                     → past Ugadi    → gYear - 78
//         masaIndex === 11 (Phalguna, tail of prior year) → before Ugadi  → gYear - 79
//
//   This 3-branch heuristic covers the full historical range of Ugadi dates
//   (March 14 – April 14) correctly. It is a documented, deterministic rule
//   — not a silent approximation.
//
// VIKRAM SAMVAT (supplementary):
//   vikramYear = shakaYear + 135 (Chaitradi reckoning, used across most of
//   North India). Gujarat's Kartikadi Vikram Samvat has a different new-year
//   point and is NOT specifically handled — vikramYear is supplementary
//   context, not the primary output for the Kannada tradition.
// ─────────────────────────────────────────────────────────────────────────────

import { SAMVATSARA_NAMES, type NameTable } from '../../knowledge/localization'
import type { Paksha } from '../../types/panchanga'

export interface SamvatsaraResult {
  /** 1-based position in the 60-year cycle (1=Prabhava … 60=Akshaya) */
  index:  number
  name:   string
  nameTranslations: NameTable
  /** Shalivahana Shaka year (primary reckoning for Kannada Panchanga) */
  shakaYear:  number
  /** Supplementary — Chaitradi Vikram Samvat year (shakaYear + 135) */
  vikramYear: number
}

/**
 * Compute the Samvatsara (60-year cycle name) for a given date.
 *
 * @param gregorianYear   e.g. 2026
 * @param gregorianMonth  1–12
 * @param amantaMasaIndex 0=Chaitra … 11=Phalguna (from computeMasa().amanta.index)
 * @param paksha          SHUKLA | KRISHNA (from computeTithi().paksha)
 */
export function computeSamvatsara(
  gregorianYear:    number,
  gregorianMonth:   number,
  amantaMasaIndex:  number,
  paksha:           Paksha
): SamvatsaraResult {
  const shakaYear = deriveShakaYear(gregorianYear, gregorianMonth, amantaMasaIndex, paksha)

  // cycleIndex: 0-based position, 0=Prabhava … 59=Akshaya
  const cycleIndex0 = normalizeMod(shakaYear + 11, 60)

  const nameTranslations = SAMVATSARA_NAMES[cycleIndex0]

  return {
    index: cycleIndex0 + 1,            // 1-based for display (1=Prabhava…60=Akshaya)
    name:  nameTranslations.en,
    nameTranslations,
    shakaYear,
    vikramYear: shakaYear + 135,
  }
}

/**
 * Derive the Shalivahana Shaka year from a Gregorian date + lunar context.
 * See module header for the full derivation and worked example.
 */
function deriveShakaYear(
  gregorianYear:   number,
  gregorianMonth:  number,
  amantaMasaIndex: number,
  paksha:          Paksha
): number {
  // Jan, Feb — definitely before this year's Ugadi
  if (gregorianMonth <= 2) {
    return gregorianYear - 79
  }

  // May…Dec — definitely after this year's Ugadi
  if (gregorianMonth >= 5) {
    return gregorianYear - 78
  }

  // March or April — the Ugadi window. Determine via masa/paksha.
  const pastUgadi =
    (amantaMasaIndex === 0 && paksha === 'SHUKLA') ||
    (amantaMasaIndex >= 1 && amantaMasaIndex <= 10)

  return pastUgadi ? gregorianYear - 78 : gregorianYear - 79
}

/** Modulo that always returns a non-negative result (JS `%` can return negative). */
function normalizeMod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus
}
