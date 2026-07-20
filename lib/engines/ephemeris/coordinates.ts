import { julianCenturies, normalize360, toRad, toDeg, J2000 } from './julian-day'
import type { ObliquityResult, EquatorialCoords } from '../../types/kundali'

export function computeObliquity(jd:number):ObliquityResult {
  const T=julianCenturies(jd),T2=T*T,T3=T2*T
  const Om=normalize360(125.04452-1934.136261*T+0.0020708*T2+T3/450000)
  const L0=normalize360(280.4665+36000.7698*T)
  const Lp=normalize360(218.3165+481267.8813*T)
  const dPsi=-17.20*Math.sin(toRad(Om))-1.32*Math.sin(2*toRad(L0))-0.23*Math.sin(2*toRad(Lp))+0.21*Math.sin(2*toRad(Om))
  const dEps=+9.20*Math.cos(toRad(Om))+0.57*Math.cos(2*toRad(L0))+0.10*Math.cos(2*toRad(Lp))-0.09*Math.cos(2*toRad(Om))
  const eps0=23+26/60+21.448/3600-(46.8150*T+0.00059*T2-0.001813*T3)/3600
  return { meanObliquity:eps0, trueObliquity:eps0+dEps/3600, nutationLongitude:dPsi/3600, nutationObliquity:dEps/3600 }
}

export function eclipticToEquatorial(lng:number,lat:number,obl:number):EquatorialCoords {
  const l=toRad(lng),b=toRad(lat),e=toRad(obl)
  const sinDec=Math.sin(b)*Math.cos(e)+Math.cos(b)*Math.sin(e)*Math.sin(l)
  return {
    rightAscension:normalize360(toDeg(Math.atan2(Math.sin(l)*Math.cos(e)-Math.tan(b)*Math.sin(e),Math.cos(l)))),
    declination:toDeg(Math.asin(sinDec))
  }
}

export function equatorialToEcliptic(ra:number,dec:number,obl:number):{longitude:number;latitude:number} {
  const r=toRad(ra),d=toRad(dec),e=toRad(obl)
  return {
    longitude:normalize360(toDeg(Math.atan2(Math.sin(r)*Math.cos(e)+Math.tan(d)*Math.sin(e),Math.cos(r)))),
    latitude:toDeg(Math.asin(Math.sin(d)*Math.cos(e)-Math.cos(d)*Math.sin(e)*Math.sin(r)))
  }
}

export function greenwichMeanSiderealTime(jd:number):number {
  const D=jd-J2000
  return normalize360(280.46061837+360.98564736629*D+0.000387933*(D/36525)**2-(D/36525)**3/38710000)
}

export function localMeanSiderealTime(jd:number,lng:number):number { return normalize360(greenwichMeanSiderealTime(jd)+lng) }

export function greenwichApparentSiderealTime(jd:number):number {
  const {nutationLongitude,trueObliquity}=computeObliquity(jd)
  return normalize360(greenwichMeanSiderealTime(jd)+nutationLongitude*Math.cos(toRad(trueObliquity)))
}

export function localApparentSiderealTime(jd:number,lng:number):number { return normalize360(greenwichApparentSiderealTime(jd)+lng) }

export function computeRAMC(jd:number,lng:number):number { return localApparentSiderealTime(jd,lng) }
