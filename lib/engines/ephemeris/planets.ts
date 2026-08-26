import { julianCenturies, normalize360, toRad, toDeg } from './julian-day'
import type { PlanetId } from '../../types/kundali'

export interface RawPlanetPosition {
  longitude: number; latitude: number; distanceAU: number
  dailyMotion: number; isRetrograde: boolean
}

interface OrbitalElements { L0:number;L1:number;a:number;e0:number;e1:number;i0:number;i1:number;Om0:number;Om1:number;w0:number;w1:number }

const ELEMENTS: Record<Exclude<PlanetId,'SUN'|'MOON'|'RAHU'|'KETU'>, OrbitalElements> = {
  MERCURY:{ L0:252.250324,L1:4.09233445,a:0.387098,e0:0.20563175,e1:-0.000000591,i0:7.004986,i1:-0.0059516,Om0:48.330893,Om1:-0.1254229,w0:77.456119,w1:0.1588643 },
  VENUS:  { L0:181.979801,L1:1.60213034,a:0.723330,e0:0.00677188,e1:-0.000000476,i0:3.394662,i1:-0.0008568,Om0:76.679920,Om1:-0.2780080,w0:131.563703,w1:0.0048746 },
  MARS:   { L0:355.433,   L1:0.52402068,a:1.523688,e0:0.09339410,e1:0.000000882, i0:1.849726,i1:-0.0006011,Om0:49.558093,Om1:-0.2950981,w0:336.060234,w1:0.4439016 },
  JUPITER:{ L0:34.351519, L1:0.08309256,a:5.202561,e0:0.04849485,e1:0.000163244, i0:1.303270,i1:-0.0019872,Om0:100.464441,Om1:0.1766828,w0:14.331309,w1:0.2155209 },
  SATURN: { L0:50.077444, L1:0.03345565,a:9.537070,e0:0.05550825,e1:-0.000346641,i0:2.488878,i1:0.0025515, Om0:113.665503,Om1:-0.2566722,w0:93.057237,w1:0.5665415 },
}

function solveKepler(M:number,e:number):number {
  let E=M
  for(let i=0;i<50;i++){const d=(M-E+e*Math.sin(E))/(1-e*Math.cos(E));E+=d;if(Math.abs(d)<1e-10)break}
  return E
}

function helioEcl(el:OrbitalElements,T:number):{x:number;y:number;z:number;distAU:number} {
  const d=T*36525
  const L=normalize360(el.L0+el.L1*d)
  const om=normalize360(el.w0+el.w1/100*T)
  const M=toRad(normalize360(L-om))
  const e=el.e0+el.e1*T
  const E=solveKepler(M,e)
  const nu=2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2))
  const r=el.a*(1-e*Math.cos(E))
  const Om=toRad(normalize360(el.Om0+el.Om1/100*T))
  const w=toRad(normalize360(om-toDeg(Om)))
  const inc=toRad(el.i0+el.i1/100*T)
  return {
    x:r*(Math.cos(Om)*Math.cos(nu+w)-Math.sin(Om)*Math.sin(nu+w)*Math.cos(inc)),
    y:r*(Math.sin(Om)*Math.cos(nu+w)+Math.cos(Om)*Math.sin(nu+w)*Math.cos(inc)),
    z:r*Math.sin(nu+w)*Math.sin(inc), distAU:r
  }
}

function earthHel(T:number):{x:number;y:number;z:number} {
  const L=normalize360(280.46646+36000.76983*T+0.0003032*T*T)+180
  const M=toRad(normalize360(357.52911+35999.05029*T-0.0001537*T*T))
  const C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M)+0.000289*Math.sin(3*M)
  const th=toRad(normalize360(L+C))
  const R=1.000001018*(1-0.016708634*0.016708634)/(1+0.016708634*Math.cos(M+toRad(C)))
  return {x:R*Math.cos(th),y:R*Math.sin(th),z:0}
}

function computePlanet(id:Exclude<PlanetId,'SUN'|'MOON'|'RAHU'|'KETU'>,jd:number):RawPlanetPosition {
  const T=julianCenturies(jd); const el=ELEMENTS[id]
  const P=helioEcl(el,T); const E=earthHel(T)
  const dist=Math.sqrt((P.x-E.x)**2+(P.y-E.y)**2+(P.z-E.z)**2)
  const jdC=jd-dist*0.0057755183
  const Pc=helioEcl(el,julianCenturies(jdC)); const dxc=Pc.x-E.x,dyc=Pc.y-E.y,dzc=Pc.z-E.z
  const longitude=normalize360(toDeg(Math.atan2(dyc,dxc)))
  const distC=Math.sqrt(dxc*dxc+dyc*dyc+dzc*dzc)
  const latitude=toDeg(Math.asin(dzc/distC))
  const Pn=helioEcl(el,julianCenturies(jd+1)); const En=earthHel(julianCenturies(jd+1))
  let dm=normalize360(toDeg(Math.atan2(Pn.y-En.y,Pn.x-En.x)))-longitude
  if(dm>180)dm-=360; if(dm<-180)dm+=360
  return {longitude,latitude,distanceAU:distC,dailyMotion:dm,isRetrograde:dm<0}
}

function computeNodes(jd:number):{rahu:RawPlanetPosition;ketu:RawPlanetPosition} {
  const T=julianCenturies(jd),T2=T*T,T3=T2*T,T4=T3*T
  const Om=normalize360(125.0445479-1934.1362608*T+0.0020754*T2+T3/467441-T4/60616000)
  const T1=julianCenturies(jd+1)
  const Om1=normalize360(125.0445479-1934.1362608*T1+0.0020754*T1*T1+T1**3/467441-T1**4/60616000)
  let dm=Om1-Om; if(dm>180)dm-=360; if(dm<-180)dm+=360
  return {
    rahu:{longitude:Om,latitude:0,distanceAU:0,dailyMotion:dm,isRetrograde:true},
    ketu:{longitude:normalize360(Om+180),latitude:0,distanceAU:0,dailyMotion:-dm,isRetrograde:true}
  }
}

export interface AllPlanetPositions { MARS:RawPlanetPosition;MERCURY:RawPlanetPosition;JUPITER:RawPlanetPosition;VENUS:RawPlanetPosition;SATURN:RawPlanetPosition;RAHU:RawPlanetPosition;KETU:RawPlanetPosition }

export function computeAllPlanetPositions(jd:number):AllPlanetPositions {
  const n=computeNodes(jd)
  return { MARS:computePlanet('MARS',jd), MERCURY:computePlanet('MERCURY',jd), JUPITER:computePlanet('JUPITER',jd), VENUS:computePlanet('VENUS',jd), SATURN:computePlanet('SATURN',jd), RAHU:n.rahu, KETU:n.ketu }
}

export function computeSinglePlanet(planet:Exclude<PlanetId,'SUN'|'MOON'|'RAHU'|'KETU'>,jd:number):RawPlanetPosition {
  return computePlanet(planet,jd)
}
