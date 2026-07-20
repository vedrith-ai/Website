import { ALL_PLANETS } from '../../types/kundali'
import type { RashiIndex, PlanetaryPositions, PlanetId } from '../../types/kundali'

export interface Point { x: number; y: number }
export interface NorthIndianSlot {
  slot: number; rashi: RashiIndex; points: Point[]
  pointsAttr: string; labelPos: Point; isAscendant: boolean; planets: PlanetId[]
}

function buildSlotPolygons(S: number) {
  const O  = { x: S/2,   y: S/2 }
  const MT = { x: S/2,   y: 0   }
  const MR = { x: S,     y: S/2 }
  const MB = { x: S/2,   y: S   }
  const ML = { x: 0,     y: S/2 }
  const TL = { x: 0,     y: 0   }
  const TR = { x: S,     y: 0   }
  const BR = { x: S,     y: S   }
  const BL = { x: 0,     y: S   }
  const qTL = { x: S/4,     y: S/4     }
  const qTR = { x: 3*S/4,   y: S/4     }
  const qBR = { x: 3*S/4,   y: 3*S/4   }
  const qBL = { x: S/4,     y: 3*S/4   }
  return [
    { slot: 1,  points: [MT, qTR, O, qTL] },
    { slot: 2,  points: [MT, TR, qTR]      },
    { slot: 3,  points: [TR, MR, qTR]      },
    { slot: 4,  points: [MR, qBR, O, qTR]  },
    { slot: 5,  points: [MR, BR, qBR]      },
    { slot: 6,  points: [BR, MB, qBR]      },
    { slot: 7,  points: [MB, qBL, O, qBR]  },
    { slot: 8,  points: [MB, BL, qBL]      },
    { slot: 9,  points: [BL, ML, qBL]      },
    { slot: 10, points: [ML, qTL, O, qBL]  },
    { slot: 11, points: [ML, TL, qTL]      },
    { slot: 12, points: [TL, MT, qTL]      },
  ]
}

function centroid(pts: Point[]): Point {
  const s = pts.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 })
  return { x: s.x / pts.length, y: s.y / pts.length }
}
function toAttr(pts: Point[]) { return pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') }

export function buildNorthIndianLayout(ascendantRashi: RashiIndex, planets: PlanetaryPositions, size = 300): NorthIndianSlot[] {
  return buildSlotPolygons(size).map(({ slot, points }) => {
    const rashi = ((ascendantRashi + (slot - 1)) % 12) as RashiIndex
    return {
      slot, rashi, points,
      pointsAttr: toAttr(points),
      labelPos: centroid(points),
      isAscendant: slot === 1,
      planets: ALL_PLANETS.filter(p => planets[p].rashi === rashi),
    }
  })
}

export const NORTH_INDIAN_DEFAULT_SIZE = 300
