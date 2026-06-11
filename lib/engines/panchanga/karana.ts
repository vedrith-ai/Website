// ─────────────────────────────────────────────────────────────────────────────
// Karana Engine
// Karana = half of a Tithi (6° Sun-Moon elongation span)
// 4 Fixed (Sthira) Karanas + 7 Movable (Chara) Karanas = 11 types total
// In a lunar month: 60 Karanas (30 tithis × 2 half-tithis)
// ─────────────────────────────────────────────────────────────────────────────

import { normalize360, formatLocalTime, jdToDate } from '../ephemeris/julian-day'
import { tropicalToSidereal }                       from '../ephemeris/ayanamsha'
import { sunTropicalLongitude }                     from '../ephemeris/solar'
import { moonTropicalLongitude }                    from '../ephemeris/lunar'
import type { KaranaResult, AyanamshaKey }          from '../../types/panchanga'

const KARANA_SPAN_DEG = 6.0  // half of 12° tithi

// ── 7 Movable (Chara) Karanas — repeat 8 times in a lunar month ──────────────
const CHARA_KARANAS = [
  { name: 'Bava',     quality: 'SHUBHA'  as const },
  { name: 'Balava',   quality: 'SHUBHA'  as const },
  { name: 'Kaulava',  quality: 'SHUBHA'  as const },
  { name: 'Taitila',  quality: 'SHUBHA'  as const },
  { name: 'Garaja',   quality: 'MIXED'   as const },
  { name: 'Vanija',   quality: 'SHUBHA'  as const },
  { name: 'Vishti',   quality: 'ASHUBHA' as const },  // Also called Bhadra
]

// ── 4 Fixed (Sthira) Karanas — occupy specific positions ─────────────────────
const STHIRA_KARANAS = [
  { name: 'Shakuni',     quality: 'ASHUBHA' as const },
  { name: 'Chatushpada', quality: 'MIXED'   as const },
  { name: 'Naga',        quality: 'ASHUBHA' as const },
  { name: 'Kimstughna',  quality: 'SHUBHA'  as const },
]

/**
 * Compute the Karana at a given Julian Day (local sunrise moment).
 *
 * The 60 Karanas in a lunar month are numbered 1–60:
 * - Karana 1: Kimstughna (fixed)
 * - Karanas 2–57: 8 cycles of 7 Chara Karanas
 * - Karanas 58–60: Shakuni, Chatushpada, Naga (fixed)
 */
export function computeKarana(
  jdSunrise:  number,
  ayanamsha:  AyanamshaKey = 'LAHIRI',
  timezone:   string = 'Asia/Kolkata'
): KaranaResult {
  const sunSid  = tropicalToSidereal(sunTropicalLongitude(jdSunrise),  jdSunrise, ayanamsha)
  const moonSid = tropicalToSidereal(moonTropicalLongitude(jdSunrise), jdSunrise, ayanamsha)

  const elongation = normalize360(moonSid - sunSid)
  const karanaSeq  = Math.floor(elongation / KARANA_SPAN_DEG)  // 0–59

  let name:    string
  let quality: 'SHUBHA' | 'ASHUBHA' | 'MIXED'
  let isFixed: boolean

  if (karanaSeq === 0) {
    // First Karana of the month: Kimstughna (fixed)
    const k = STHIRA_KARANAS[3]
    name = k.name; quality = k.quality; isFixed = true
  } else if (karanaSeq >= 57) {
    // Last 3 Karanas: Shakuni (57), Chatushpada (58), Naga (59)
    const k = STHIRA_KARANAS[karanaSeq - 57]
    name = k.name; quality = k.quality; isFixed = true
  } else {
    // Movable Karanas: karanaSeq 1–56, cycling through 7 Chara Karanas
    const idx = (karanaSeq - 1) % 7
    const k   = CHARA_KARANAS[idx]
    name = k.name; quality = k.quality; isFixed = false
  }

  // End time
  const endJD   = findKaranaEnd(jdSunrise, elongation)
  const endDate = jdToDate(endJD)

  return {
    number:   karanaSeq + 1,
    name,
    isFixed,
    endTime:  endDate,
    endLocal: formatLocalTime(endDate, timezone),
    quality,
  }
}

function findKaranaEnd(jdStart: number, elongStart: number): number {
  const targetElong = (Math.floor(elongStart / KARANA_SPAN_DEG) + 1) * KARANA_SPAN_DEG

  let lo = jdStart
  let hi = jdStart + 0.8   // Karana lasts ~6–12 hours

  for (let i = 0; i < 50; i++) {
    const mid     = (lo + hi) / 2
    const sunSid  = tropicalToSidereal(sunTropicalLongitude(mid),  mid)
    const moonSid = tropicalToSidereal(moonTropicalLongitude(mid), mid)
    const elong   = normalize360(moonSid - sunSid)
    const adj     = elong < elongStart - 3 ? elong + 360 : elong

    if (Math.abs(adj - targetElong) < 0.001) break
    if (adj < targetElong) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}
