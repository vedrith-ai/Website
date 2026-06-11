// ─────────────────────────────────────────────────────────────────────────────
// Yoga Engine
// Yoga = (Sun_sid + Moon_sid) / 13.333° — 27 Yogas total
// ─────────────────────────────────────────────────────────────────────────────

import { normalize360, formatLocalTime, jdToDate } from '../ephemeris/julian-day'
import { tropicalToSidereal }                       from '../ephemeris/ayanamsha'
import { sunTropicalLongitude }                     from '../ephemeris/solar'
import { moonTropicalLongitude }                    from '../ephemeris/lunar'
import type { YogaResult, AyanamshaKey }            from '../../types/panchanga'

const YOGA_SPAN_DEG = 360 / 27   // ≈ 13.333°

interface YogaData {
  name:    string
  quality: 'SHUBHA' | 'ASHUBHA' | 'MIXED'
}

const YOGAS: YogaData[] = [
  { name: 'Vishkambha',  quality: 'ASHUBHA' },
  { name: 'Priti',       quality: 'SHUBHA'  },
  { name: 'Ayushman',    quality: 'SHUBHA'  },
  { name: 'Saubhagya',   quality: 'SHUBHA'  },
  { name: 'Shobhana',    quality: 'SHUBHA'  },
  { name: 'Atiganda',    quality: 'ASHUBHA' },
  { name: 'Sukarma',     quality: 'SHUBHA'  },
  { name: 'Dhriti',      quality: 'SHUBHA'  },
  { name: 'Shula',       quality: 'ASHUBHA' },
  { name: 'Ganda',       quality: 'ASHUBHA' },
  { name: 'Vriddhi',     quality: 'SHUBHA'  },
  { name: 'Dhruva',      quality: 'SHUBHA'  },
  { name: 'Vyaghata',    quality: 'ASHUBHA' },
  { name: 'Harshana',    quality: 'SHUBHA'  },
  { name: 'Vajra',       quality: 'MIXED'   },
  { name: 'Siddhi',      quality: 'SHUBHA'  },
  { name: 'Vyatipata',   quality: 'ASHUBHA' },
  { name: 'Variyana',    quality: 'SHUBHA'  },
  { name: 'Parigha',     quality: 'ASHUBHA' },
  { name: 'Shiva',       quality: 'SHUBHA'  },
  { name: 'Siddha',      quality: 'SHUBHA'  },
  { name: 'Sadhya',      quality: 'SHUBHA'  },
  { name: 'Shubha',      quality: 'SHUBHA'  },
  { name: 'Shukla',      quality: 'SHUBHA'  },
  { name: 'Brahma',      quality: 'SHUBHA'  },
  { name: 'Mahendra',    quality: 'SHUBHA'  },
  { name: 'Vaidhriti',   quality: 'ASHUBHA' },
]

export function computeYoga(
  jdSunrise: number,
  ayanamsha: AyanamshaKey = 'LAHIRI',
  timezone:  string = 'Asia/Kolkata'
): YogaResult {
  const sunSid  = tropicalToSidereal(sunTropicalLongitude(jdSunrise),  jdSunrise, ayanamsha)
  const moonSid = tropicalToSidereal(moonTropicalLongitude(jdSunrise), jdSunrise, ayanamsha)

  // Yoga sum: (sun + moon) mod 360
  const yogaSum = normalize360(sunSid + moonSid)
  const index   = Math.floor(yogaSum / YOGA_SPAN_DEG)
  const data    = YOGAS[index]

  // End time
  const endJD   = findYogaEnd(jdSunrise, yogaSum)
  const endDate = jdToDate(endJD)

  return {
    number:   index + 1,
    name:     data.name,
    endTime:  endDate,
    endLocal: formatLocalTime(endDate, timezone),
    quality:  data.quality,
  }
}

function findYogaEnd(jdStart: number, yogaSumStart: number): number {
  const targetSum = (Math.floor(yogaSumStart / YOGA_SPAN_DEG) + 1) * YOGA_SPAN_DEG

  let lo = jdStart
  let hi = jdStart + 1.5

  for (let i = 0; i < 50; i++) {
    const mid     = (lo + hi) / 2
    const sunSid  = tropicalToSidereal(sunTropicalLongitude(mid),  mid)
    const moonSid = tropicalToSidereal(moonTropicalLongitude(mid), mid)
    const current = normalize360(sunSid + moonSid)
    const adj     = current < yogaSumStart - 6 ? current + 360 : current

    if (Math.abs(adj - targetSum) < 0.001) break
    if (adj < targetSum) lo = mid
    else hi = mid
  }

  return (lo + hi) / 2
}
