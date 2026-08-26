import { normalize360, toRad, toDeg } from '../ephemeris/julian-day'
import { computeAscendantAndMC } from './ascendant'
import { tropicalToPlacement, RASHI_SPAN_DEG } from './zodiac'
import type { HouseCusps, HouseSystem, AyanamshaKey, RashiIndex } from '../../types/kundali'

function wholeSign(ascSid:number):HouseCusps {
  const r=Math.floor(ascSid/RASHI_SPAN_DEG) as RashiIndex
  const cusps=Array.from({length:12},(_,i)=>normalize360(r*30+i*30)) as HouseCusps['cusps']
  const rashis=Array.from({length:12},(_,i)=>((r+i)%12) as RashiIndex) as Required<HouseCusps>['rashis']
  return {system:'WHOLE_SIGN',cusps,rashis}
}

function equalHouse(ascSid:number):HouseCusps {
  const cusps=Array.from({length:12},(_,i)=>normalize360(ascSid+i*30)) as HouseCusps['cusps']
  return {system:'EQUAL',cusps}
}

function placidus(ramc:number,obl:number,lat:number,ascSid:number,mcSid:number,jd:number,ay:AyanamshaKey):HouseCusps {
  function solve(target:number):number {
    const tRA=normalize360(ramc+target); const eR=toRad(obl),lR=toRad(lat); let lam=tRA
    for(let i=0;i<50;i++){
      const lR2=toRad(lam)
      const ra=normalize360(toDeg(Math.atan2(Math.sin(lR2)*Math.cos(eR),Math.cos(lR2))))
      const dec=toDeg(Math.asin(Math.sin(eR)*Math.sin(lR2))),dR=toRad(dec)
      const cosAD=-Math.tan(lR)*Math.tan(dR)
      if(Math.abs(cosAD)>1)break
      const AD=toDeg(Math.acos(Math.max(-1,Math.min(1,cosAD))))
      const OA=normalize360(ra-AD),diff=normalize360(tRA-OA)
      const corr=(diff>180?diff-360:diff)*0.8; lam=normalize360(lam+corr)
      if(Math.abs(corr)<0.0001)break
    }
    return tropicalToPlacement(lam,jd,ay).siderealLongitude
  }
  const c11=solve(30),c12=solve(60),c10=mcSid,c1=ascSid
  const c2=solve(120),c3=solve(150)
  const c4=normalize360(c10+180),c5=normalize360(c11+180),c6=normalize360(c12+180)
  const c7=normalize360(c1+180),c8=normalize360(c2+180),c9=normalize360(c3+180)
  return {system:'PLACIDUS',cusps:[c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12]}
}

export function computeHouseCusps(jd:number,lat:number,lng:number,system:HouseSystem='WHOLE_SIGN',ay:AyanamshaKey='LAHIRI'):HouseCusps {
  const {ascendant,mcSidereal,ramc,trueObliquity}=computeAscendantAndMC(jd,lat,lng,ay)
  if(system==='WHOLE_SIGN') return wholeSign(ascendant.longitude)
  if(system==='EQUAL') return equalHouse(ascendant.longitude)
  return placidus(ramc,trueObliquity,lat,ascendant.longitude,mcSidereal,jd,ay)
}
