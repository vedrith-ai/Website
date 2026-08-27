// ─────────────────────────────────────────────────────────────────────────────
// Vara Engine
// Vara = Hindu weekday, determined by the sunrise on that day
// Starts at local sunrise and ends at the next sunrise
// ─────────────────────────────────────────────────────────────────────────────

import type { VaraResult } from '../../types/panchanga'

interface VaraData {
  name:      string   // English name
  ruler:     string   // Ruling planet
  quality:   'SHUBHA' | 'ASHUBHA' | 'MIXED'
}

// Index: 0=Sunday, 1=Monday, ..., 6=Saturday
const VARA_DATA: VaraData[] = [
  { name: 'Sunday',    ruler: 'Sun',     quality: 'MIXED'   },
  { name: 'Monday',    ruler: 'Moon',    quality: 'SHUBHA'  },
  { name: 'Tuesday',   ruler: 'Mars',    quality: 'ASHUBHA' },
  { name: 'Wednesday', ruler: 'Mercury', quality: 'SHUBHA'  },
  { name: 'Thursday',  ruler: 'Jupiter', quality: 'SHUBHA'  },
  { name: 'Friday',    ruler: 'Venus',   quality: 'SHUBHA'  },
  { name: 'Saturday',  ruler: 'Saturn',  quality: 'ASHUBHA' },
]

// ── Regional weekday names ────────────────────────────────────────────────────
// Index: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
export const VARA_REGIONAL: Record<string, string[]> = {
  TELUGU:       ['Aadivaaram', 'Somavaaram', 'Mangalavaaram', 'Budhaavaaram', 'Guruvaaram', 'Shukravaaram', 'Shanivaaram'],
  TAMIL:        ['Nyayiru',    'Tingal',     'Chevvay',       'Budhan',       'Viyazhan',   'Velli',        'Shani'      ],
  KANNADA:      ['Bhanuvara',  'Somavara',   'Mangalavara',   'Budhavara',    'Guruvara',   'Shukravara',   'Shanivara'  ],
  MALAYALAM:    ['Njayar',     'Thinkal',    'Chowwa',        'Budhan',       'Vyazham',    'Velli',        'Shani'      ],
  GUJARATI:     ['Ravivar',    'Somvar',     'Mangalvar',     'Budhvar',      'Guruvar',    'Shukravar',    'Shanivar'   ],
  MAHARASHTRIAN:['Ravivar',    'Somvar',     'Mangalvar',     'Budhvar',      'Guruvar',    'Shukravar',    'Shanivar'   ],
  BENGALI:      ['Robibar',    'Shombar',    'Mongolbar',     'Budhbar',      'Brihospotibar','Shukrobar',  'Shonibar'   ],
  NORTH_INDIAN: ['Ravivar',    'Somvar',     'Mangalvar',     'Budhvar',      'Guruvar',    'Shukravar',    'Shanivar'   ],
}

/**
 * Compute the Vara for a given Julian Day (at local sunrise moment).
 *
 * The weekday is determined by the Julian Day number at sunrise.
 * JD 0 = Monday (Jan 1, 4713 BC Julian proleptic noon).
 * The day of the week: (JD + 1.5) mod 7, where 0=Sunday.
 *
 * @param jdSunrise  JD of local sunrise
 * @param region     Regional tradition key for name localisation
 */
export function computeVara(
  jdSunrise: number,
  region:    string = 'NORTH_INDIAN'
): VaraResult {
  // Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday
  const dayNum = Math.floor(jdSunrise + 1.5) % 7
  const data   = VARA_DATA[dayNum]
  const regional = VARA_REGIONAL[region] ?? VARA_REGIONAL['NORTH_INDIAN']

  return {
    number:    dayNum,
    name:      data.name,
    nameLocal: regional[dayNum],
    ruler:     data.ruler,
    quality:   data.quality,
  }
}
