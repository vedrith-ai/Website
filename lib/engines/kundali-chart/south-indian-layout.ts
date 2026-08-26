import { ALL_PLANETS } from '../../types/kundali'
import type { RashiIndex, PlanetaryPositions, PlanetId } from '../../types/kundali'

export interface SouthIndianCell {
  row: number; col: number; rashi: RashiIndex
  houseNumber: number; isAscendant: boolean; planets: PlanetId[]
}

const GRID_MAP: ReadonlyArray<{ row: number; col: number; rashi: RashiIndex }> = [
  { row: 0, col: 1, rashi: 0  }, { row: 0, col: 2, rashi: 1  },
  { row: 0, col: 3, rashi: 2  }, { row: 1, col: 3, rashi: 3  },
  { row: 2, col: 3, rashi: 4  }, { row: 3, col: 3, rashi: 5  },
  { row: 3, col: 2, rashi: 6  }, { row: 3, col: 1, rashi: 7  },
  { row: 3, col: 0, rashi: 8  }, { row: 2, col: 0, rashi: 9  },
  { row: 1, col: 0, rashi: 10 }, { row: 0, col: 0, rashi: 11 },
]

export function buildSouthIndianLayout(ascendantRashi: RashiIndex, planets: PlanetaryPositions): SouthIndianCell[] {
  return GRID_MAP.map(({ row, col, rashi }) => ({
    row, col, rashi,
    houseNumber: ((rashi - ascendantRashi + 12) % 12) + 1,
    isAscendant: rashi === ascendantRashi,
    planets: ALL_PLANETS.filter(p => planets[p].rashi === rashi),
  }))
}

export const SOUTH_INDIAN_GRID_SIZE = 4
