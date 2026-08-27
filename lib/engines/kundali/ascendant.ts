import { normalize360, toRad, toDeg } from '../ephemeris/julian-day'
import { computeRAMC, computeObliquity } from '../ephemeris/coordinates'
import { tropicalToPlacement } from './zodiac'
import type { AscendantResult, AyanamshaKey } from '../../types/kundali'

function mcTropical(ramc:number,obl:number):number {
  return normalize360(toDeg(Math.atan2(Math.sin(toRad(ramc)),Math.cos(toRad(ramc))*Math.cos(toRad(obl)))))
}

function ascTropical(ramc:number,obl:number,lat:number):number {
  const r=toRad(ramc),e=toRad(obl),l=toRad(lat)
  const asc=normalize360(toDeg(Math.atan2(-Math.cos(r),Math.sin(e)*Math.tan(l)+Math.cos(e)*Math.sin(r))))
  const mc=mcTropical(ramc,obl)
  const diff=normalize360(asc-normalize360(mc+90))
  return (diff>90&&diff<270)?normalize360(asc+180):asc
}

export function computeAscendant(jd:number,lat:number,lng:number,ay:AyanamshaKey='LAHIRI'):AscendantResult {
  const {trueObliquity}=computeObliquity(jd)
  const ramc=computeRAMC(jd,lng)
  const p=tropicalToPlacement(ascTropical(ramc,trueObliquity,lat),jd,ay)
  return {longitude:p.siderealLongitude,rashi:p.rashi,rashiLongitude:p.rashiLongitude,nakshatra:p.nakshatra,pada:p.pada,ramc}
}

export function computeAscendantAndMC(jd:number,lat:number,lng:number,ay:AyanamshaKey='LAHIRI') {
  const {trueObliquity}=computeObliquity(jd)
  const ramc=computeRAMC(jd,lng)
  const ascP=tropicalToPlacement(ascTropical(ramc,trueObliquity,lat),jd,ay)
  const mcP=tropicalToPlacement(mcTropical(ramc,trueObliquity),jd,ay)
  return {
    ascendant:{longitude:ascP.siderealLongitude,rashi:ascP.rashi,rashiLongitude:ascP.rashiLongitude,nakshatra:ascP.nakshatra,pada:ascP.pada,ramc},
    mcTropical:mcTropical(ramc,trueObliquity), mcSidereal:mcP.siderealLongitude, ramc, trueObliquity
  }
}
