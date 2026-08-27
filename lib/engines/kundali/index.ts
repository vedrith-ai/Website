import { validateBirthData } from './birth-data-validator'
import { computePlanetaryPositions } from './planetary-positions'
import { computeAscendant } from './ascendant'
import { computeHouseCusps } from './houses'
import { computeObliquity } from '../ephemeris/coordinates'
import { computeAyanamsha } from '../ephemeris/ayanamsha'
import type { BirthData, KundaliChartData, KundaliResult, HouseSystem, AyanamshaKey } from '../../types/kundali'

export { validateBirthData } from './birth-data-validator'
export { computePlanetaryPositions, computeSinglePlanetPosition } from './planetary-positions'
export { computeAscendant, computeAscendantAndMC } from './ascendant'
export { computeHouseCusps } from './houses'
export { placementFromSidereal, tropicalToPlacement, enrichPlanetPosition, houseOfPlanet } from './zodiac'
export { getAyanamsha, formatAyanamsha, compareAyanamshas, ayanamshaProgressionTable, isValidAyanamsha } from './ayanamsha-service'

export interface KundaliOptions { houseSystem?: HouseSystem; ayanamsha?: AyanamshaKey }

export async function computeKundaliFoundation(birthData:BirthData,options:KundaliOptions={}):Promise<KundaliResult<KundaliChartData>> {
  try {
    const vr=validateBirthData(birthData); if(!vr.success)return vr
    const validated=vr.data, ayanamsha=options.ayanamsha??validated.ayanamsha, jd=validated.julianDay
    const obliquity=computeObliquity(jd)
    const ascendant=computeAscendant(jd,validated.latitude,validated.longitude,ayanamsha)
    const houseSystem=options.houseSystem??'WHOLE_SIGN'
    const houseCusps=computeHouseCusps(jd,validated.latitude,validated.longitude,houseSystem,ayanamsha)
    const planets=computePlanetaryPositions(jd,ayanamsha)
    const ayanamshaValue=computeAyanamsha(jd,ayanamsha)
    return {success:true,data:{birthData:validated,ascendant,planets,houseCusps,obliquity,ayanamsha,ayanamshaValue:parseFloat(ayanamshaValue.toFixed(4)),computedAt:new Date().toISOString()}}
  } catch(err) {
    return {success:false,error:{code:'COMPUTATION_ERROR',message:`Kundali computation failed: ${err instanceof Error?err.message:'Unknown error'}`}}
  }
}
