// ─────────────────────────────────────────────────────────────────────────────
// Nakshatra Engine
// 27 Nakshatras each spanning 360°/27 ≈ 13.333° of sidereal zodiac
// 4 Padas per Nakshatra, each 3.333°
// ─────────────────────────────────────────────────────────────────────────────

import { formatLocalTime, jdToDate } from '../ephemeris/julian-day'
import { tropicalToSidereal }                       from '../ephemeris/ayanamsha'
import { moonTropicalLongitude }                    from '../ephemeris/lunar'
import type { NakshatraResult, AyanamshaKey }       from '../../types/panchanga'

export const NAKSHATRA_SPAN_DEG = 360 / 27          // ≈ 13.3333°
export const PADA_SPAN_DEG      = NAKSHATRA_SPAN_DEG / 4  // ≈ 3.3333°

// ── Nakshatra data ────────────────────────────────────────────────────────────
interface NakshatraData {
  name:    string
  deity:   string
  ruler:   string
  quality: 'SHUBHA' | 'ASHUBHA' | 'MIXED'
}

export const NAKSHATRAS: NakshatraData[] = [
  { name: 'Ashwini',          deity: 'Ashwini Kumaras', ruler: 'Ketu',    quality: 'SHUBHA'  },
  { name: 'Bharani',          deity: 'Yama',             ruler: 'Venus',   quality: 'ASHUBHA' },
  { name: 'Krittika',         deity: 'Agni',             ruler: 'Sun',     quality: 'MIXED'   },
  { name: 'Rohini',           deity: 'Brahma/Prajapati', ruler: 'Moon',    quality: 'SHUBHA'  },
  { name: 'Mrigashira',       deity: 'Soma/Chandra',     ruler: 'Mars',    quality: 'MIXED'   },
  { name: 'Ardra',            deity: 'Rudra',            ruler: 'Rahu',    quality: 'ASHUBHA' },
  { name: 'Punarvasu',        deity: 'Aditi',            ruler: 'Jupiter', quality: 'SHUBHA'  },
  { name: 'Pushya',           deity: 'Brihaspati',       ruler: 'Saturn',  quality: 'SHUBHA'  },
  { name: 'Ashlesha',         deity: 'Sarpa',            ruler: 'Mercury', quality: 'ASHUBHA' },
  { name: 'Magha',            deity: 'Pitru',            ruler: 'Ketu',    quality: 'MIXED'   },
  { name: 'Purva Phalguni',   deity: 'Bhaga',            ruler: 'Venus',   quality: 'SHUBHA'  },
  { name: 'Uttara Phalguni',  deity: 'Aryaman',          ruler: 'Sun',     quality: 'SHUBHA'  },
  { name: 'Hasta',            deity: 'Savitar',          ruler: 'Moon',    quality: 'SHUBHA'  },
  { name: 'Chitra',           deity: 'Tvashtar/Vishvakarma', ruler: 'Mars', quality: 'MIXED'  },
  { name: 'Swati',            deity: 'Vayu',             ruler: 'Rahu',    quality: 'SHUBHA'  },
  { name: 'Vishakha',         deity: 'Indra-Agni',       ruler: 'Jupiter', quality: 'MIXED'   },
  { name: 'Anuradha',         deity: 'Mitra',            ruler: 'Saturn',  quality: 'SHUBHA'  },
  { name: 'Jyeshtha',         deity: 'Indra',            ruler: 'Mercury', quality: 'ASHUBHA' },
  { name: 'Moola',            deity: 'Nirrti/Alakshmi',  ruler: 'Ketu',    quality: 'ASHUBHA' },
  { name: 'Purva Ashadha',    deity: 'Apah',             ruler: 'Venus',   quality: 'MIXED'   },
  { name: 'Uttara Ashadha',   deity: 'Vishvedeva',       ruler: 'Sun',     quality: 'SHUBHA'  },
  { name: 'Shravana',         deity: 'Vishnu',           ruler: 'Moon',    quality: 'SHUBHA'  },
  { name: 'Dhanishtha',       deity: 'Ashta Vasus',      ruler: 'Mars',    quality: 'MIXED'   },
  { name: 'Shatabhisha',      deity: 'Varuna',           ruler: 'Rahu',    quality: 'MIXED'   },
  { name: 'Purva Bhadrapada', deity: 'Aja Ekapada',      ruler: 'Jupiter', quality: 'ASHUBHA' },
  { name: 'Uttara Bhadrapada',deity: 'Ahir Budhyana',    ruler: 'Saturn',  quality: 'SHUBHA'  },
  { name: 'Revati',           deity: 'Pushan',           ruler: 'Mercury', quality: 'SHUBHA'  },
]

/**
 * Compute the Nakshatra at the given Julian Day (local sunrise moment).
 */
export function computeNakshatra(
  jdSunrise:  number,
  ayanamsha:  AyanamshaKey = 'LAHIRI',
  timezone:   string = 'Asia/Kolkata'
): NakshatraResult {
  const moonTrop = moonTropicalLongitude(jdSunrise)
  const moonSid  = tropicalToSidereal(moonTrop, jdSunrise, ayanamsha)

  // Nakshatra index 0–26
  const index = Math.floor(moonSid / NAKSHATRA_SPAN_DEG)
  const data  = NAKSHATRAS[index]

  // Pada (1–4)
  const posWithinNakshatra = moonSid % NAKSHATRA_SPAN_DEG
  const pada = Math.floor(posWithinNakshatra / PADA_SPAN_DEG) + 1

  // End time
  const endJD  = findNakshatraEnd(jdSunrise, moonSid)
  const endDate = jdToDate(endJD)

  return {
    number:    index + 1,
    name:      data.name,
    nameLocal: data.name,       // regional layer overrides this
    pada,
    endTime:   endDate,
    endLocal:  formatLocalTime(endDate, timezone),
    deity:     data.deity,
    ruler:     data.ruler,
    quality:   data.quality,
  }
}

/**
 * Binary search for when the Moon exits the current Nakshatra.
 */
function findNakshatraEnd(jdStart: number, moonSidStart: number): number {
  const targetLng = (Math.floor(moonSidStart / NAKSHATRA_SPAN_DEG) + 1) * NAKSHATRA_SPAN_DEG

  let lo = jdStart
  let hi = jdStart + 2.0   // Nakshatra lasts ~1–2 days

  for (let i = 0; i < 60; i++) {
    const mid     = (lo + hi) / 2
    const moonSid = tropicalToSidereal(moonTropicalLongitude(mid), mid)

    const current = moonSid < moonSidStart - 6 ? moonSid + 360 : moonSid

    if (Math.abs(current - targetLng) < 0.001) break
    if (current < targetLng) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}
