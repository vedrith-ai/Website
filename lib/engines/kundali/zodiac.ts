import { normalize360 } from '../ephemeris/julian-day'
import { tropicalToSidereal, computeAyanamsha } from '../ephemeris/ayanamsha'
import type { AyanamshaKey, RashiIndex, PlanetaryPosition, PlanetId } from '../../types/kundali'
import type { RawPlanetPosition } from '../ephemeris/planets'

const RASHI_SPAN=30, NAK_SPAN=360/27, PADA_SPAN=NAK_SPAN/4
export { RASHI_SPAN as RASHI_SPAN_DEG, NAK_SPAN as NAKSHATRA_SPAN_DEG, PADA_SPAN as PADA_SPAN_DEG }

export function placementFromSidereal(sid:number):{rashi:RashiIndex;rashiLongitude:number;nakshatra:number;pada:number} {
  const l=normalize360(sid)
  return {
    rashi:Math.floor(l/RASHI_SPAN) as RashiIndex,
    rashiLongitude:parseFloat((l%RASHI_SPAN).toFixed(6)),
    nakshatra:Math.floor(l/NAK_SPAN)+1,
    pada:Math.floor((l%NAK_SPAN)/PADA_SPAN)+1
  }
}

export function tropicalToPlacement(trop:number,jd:number,ay:AyanamshaKey='LAHIRI') {
  const sid=tropicalToSidereal(trop,jd,ay)
  return {siderealLongitude:parseFloat(sid.toFixed(6)),...placementFromSidereal(sid)}
}

export function enrichPlanetPosition(planet:PlanetId,raw:RawPlanetPosition,jd:number,ay:AyanamshaKey='LAHIRI'):PlanetaryPosition {
  const p=tropicalToPlacement(raw.longitude,jd,ay)
  return {planet,longitude:p.siderealLongitude,latitude:raw.latitude,distance:raw.distanceAU,rashi:p.rashi,rashiLongitude:p.rashiLongitude,nakshatra:p.nakshatra,pada:p.pada,isRetrograde:raw.isRetrograde,dailyMotion:parseFloat(raw.dailyMotion.toFixed(6))}
}

export function houseOfPlanet(planetLng:number,cusps:number[]):number {
  const p=normalize360(planetLng)
  for(let h=0;h<12;h++){
    const c=normalize360(cusps[h]),n=normalize360(cusps[(h+1)%12])
    if(c<=n){if(p>=c&&p<n)return h+1}
    else{if(p>=c||p<n)return h+1}
  }
  return 1
}

export { computeAyanamsha, tropicalToSidereal } from '../ephemeris/ayanamsha'
