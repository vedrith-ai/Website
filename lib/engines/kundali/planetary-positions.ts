import { computeSolarPosition } from '../ephemeris/solar'
import { computeLunarPosition } from '../ephemeris/lunar'
import { computeAllPlanetPositions } from '../ephemeris/planets'
import { enrichPlanetPosition, tropicalToPlacement } from './zodiac'
import type { PlanetaryPositions, PlanetaryPosition, AyanamshaKey } from '../../types/kundali'

const CACHE=new Map<string,{data:PlanetaryPositions;exp:number}>()
const TTL=3600000

function key(jd:number,ay:AyanamshaKey){return `${jd.toFixed(4)}:${ay}`}
function get(k:string){const e=CACHE.get(k);if(!e)return null;if(e.exp<Date.now()){CACHE.delete(k);return null}return e.data}
function set(k:string,d:PlanetaryPositions){if(CACHE.size>200){const now=Date.now();for(const [k2,v] of CACHE)if(v.exp<now)CACHE.delete(k2)}CACHE.set(k,{data:d,exp:Date.now()+TTL})}

function sun(jd:number,ay:AyanamshaKey):PlanetaryPosition {
  const s=computeSolarPosition(jd),sn=computeSolarPosition(jd+1)
  const p=tropicalToPlacement(s.tropicalLongitude,jd,ay)
  let dm=sn.tropicalLongitude-s.tropicalLongitude; if(dm>180)dm-=360; if(dm<-180)dm+=360
  return {planet:'SUN',longitude:p.siderealLongitude,latitude:0,distance:1,rashi:p.rashi,rashiLongitude:p.rashiLongitude,nakshatra:p.nakshatra,pada:p.pada,isRetrograde:false,dailyMotion:parseFloat(dm.toFixed(6))}
}

function moon(jd:number,ay:AyanamshaKey):PlanetaryPosition {
  const m=computeLunarPosition(jd),mn=computeLunarPosition(jd+1)
  const p=tropicalToPlacement(m.tropicalLongitude,jd,ay)
  let dm=mn.tropicalLongitude-m.tropicalLongitude; if(dm>180)dm-=360; if(dm<-180)dm+=360
  return {planet:'MOON',longitude:p.siderealLongitude,latitude:parseFloat(m.latitude.toFixed(6)),distance:parseFloat(m.distanceKm.toFixed(2)),rashi:p.rashi,rashiLongitude:p.rashiLongitude,nakshatra:p.nakshatra,pada:p.pada,isRetrograde:false,dailyMotion:parseFloat(dm.toFixed(6))}
}

export function computePlanetaryPositions(jd:number,ay:AyanamshaKey='LAHIRI'):PlanetaryPositions {
  const k=key(jd,ay),c=get(k); if(c)return c
  const raw=computeAllPlanetPositions(jd)
  const result:PlanetaryPositions={
    SUN:sun(jd,ay),MOON:moon(jd,ay),
    MARS:enrichPlanetPosition('MARS',raw.MARS,jd,ay),
    MERCURY:enrichPlanetPosition('MERCURY',raw.MERCURY,jd,ay),
    JUPITER:enrichPlanetPosition('JUPITER',raw.JUPITER,jd,ay),
    VENUS:enrichPlanetPosition('VENUS',raw.VENUS,jd,ay),
    SATURN:enrichPlanetPosition('SATURN',raw.SATURN,jd,ay),
    RAHU:enrichPlanetPosition('RAHU',raw.RAHU,jd,ay),
    KETU:enrichPlanetPosition('KETU',raw.KETU,jd,ay),
  }
  set(k,result); return result
}

export function computeSinglePlanetPosition(planet:keyof PlanetaryPositions,jd:number,ay:AyanamshaKey='LAHIRI'):PlanetaryPosition {
  const k=key(jd,ay),c=get(k); if(c)return c[planet]
  if(planet==='SUN') return sun(jd,ay)
  if(planet==='MOON') return moon(jd,ay)
  const {[planet]:raw}=computeAllPlanetPositions(jd)
  return enrichPlanetPosition(planet,raw,jd,ay)
}
