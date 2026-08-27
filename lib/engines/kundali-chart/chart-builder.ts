import { randomUUID } from 'node:crypto'
import { computeKundaliFoundation } from '../kundali'
import { computeTithi }  from '../panchanga/tithi'
import { computeYoga }   from '../panchanga/yoga'
import { computeKarana } from '../panchanga/karana'
import { buildHousePlacements } from './house-placement'
import type { BirthData } from '../../types/kundali'
import type { KundaliFormInput, KundaliChartRecord } from '../../types/kundali-chart'
import type { KundaliResult } from '../../types/kundali'

export async function buildKundaliChart(input: KundaliFormInput): Promise<KundaliResult<KundaliChartRecord>> {
  const birthData: BirthData = {
    name: input.name, dateOfBirth: input.dateOfBirth, timeOfBirth: input.timeOfBirth,
    timezone: input.timezone, latitude: input.latitude, longitude: input.longitude,
    placeName: input.placeName, ayanamsha: input.ayanamsha,
  }

  const foundationResult = await computeKundaliFoundation(birthData, {
    houseSystem: input.houseSystem ?? 'WHOLE_SIGN',
    ayanamsha: input.ayanamsha,
  })

  if (!foundationResult.success) return foundationResult

  const chart = foundationResult.data

  try {
    const birthJD  = chart.birthData.julianDay
    const tz       = chart.birthData.timezone
    const ay       = chart.ayanamsha

    const birthTithi  = computeTithi(birthJD, ay, tz)
    const birthYoga   = computeYoga(birthJD, ay, tz)
    const birthKarana = computeKarana(birthJD, ay, tz)
    const housePlacements = buildHousePlacements(chart.planets, chart.houseCusps.cusps)

    const now = new Date().toISOString()
    const record: KundaliChartRecord = {
      id: `kc_${randomUUID()}`, name: input.name, gender: input.gender,
      chart, birthTithi, birthYoga, birthKarana, housePlacements,
      houseSystemUsed: chart.houseCusps.system, createdAt: now, updatedAt: now,
    }
    return { success: true, data: record }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: { code: 'COMPUTATION_ERROR', message: `Chart assembly failed: ${message}` } }
  }
}
