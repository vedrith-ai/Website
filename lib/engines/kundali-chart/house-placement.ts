import { houseOfPlanet } from '../kundali'
import { ALL_PLANETS } from '../../types/kundali'
import type { PlanetaryPositions } from '../../types/kundali'
import type { HousePlacements, PlanetsByHouse } from '../../types/kundali-chart'

export function buildHousePlacements(planets: PlanetaryPositions, cusps: readonly number[]): HousePlacements {
  const result = {} as HousePlacements
  for (const pId of ALL_PLANETS) {
    result[pId] = houseOfPlanet(planets[pId].longitude, [...cusps])
  }
  return result
}

export function groupPlanetsByHouse(placements: HousePlacements): PlanetsByHouse {
  const grouped: PlanetsByHouse = {}
  for (let h = 1; h <= 12; h++) grouped[h] = []
  for (const pId of ALL_PLANETS) grouped[placements[pId]].push(pId)
  return grouped
}
