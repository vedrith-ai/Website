import { computeAyanamsha, ayanamshaForYear } from '../ephemeris/ayanamsha'
import type { AyanamshaKey } from '../../types/kundali'

export interface AyanamshaInfo { key:AyanamshaKey;displayName:string;founder:string;description:string;approx2024:string }
export const AYANAMSHA_INFO:Record<AyanamshaKey,AyanamshaInfo>={
  LAHIRI:{key:'LAHIRI',displayName:'Lahiri (Chitrapaksha)',founder:'N.C. Lahiri — Government of India Standard (1955)',description:'The official ayanamsha recommended by the Calendar Reform Committee of India. Places the star Chitra (Spica) at 180° sidereal longitude. Most widely used in India.',approx2024:'24.19°'},
  KP:{key:'KP',displayName:'KP (Krishnamurti Paddhati)',founder:'K.S. Krishnamurti',description:'Developed for the KP system of astrology. Approximately 0.092° ahead of Lahiri.',approx2024:'24.28°'},
  RAMAN:{key:'RAMAN',displayName:'Raman',founder:'B.V. Raman — Bangalore School',description:'Ayanamsha used by B.V. Raman. Approximately 0.66° behind Lahiri for contemporary dates.',approx2024:'23.53°'},
  TRUE_CHITRA:{key:'TRUE_CHITRA',displayName:'True Chitrapaksha',founder:'Cyril Fagan / Fagan-Allen Sidereal Tradition',description:'Places the star Chitra (Spica) at exactly 180° using its true apparent position. Differs from Lahiri by a small nutation correction.',approx2024:'24.19°'},
}

export function getAyanamsha(jd:number,system:AyanamshaKey='LAHIRI'):number { return computeAyanamsha(jd,system) }
export function formatAyanamsha(deg:number):string {
  const d=Math.floor(deg),rem=(deg-d)*60,m=Math.floor(rem),s=Math.round((rem-m)*60)
  return `${d}° ${m.toString().padStart(2,'0')}' ${s.toString().padStart(2,'0')}"`
}
export function compareAyanamshas(jd:number) {
  return Object.fromEntries((['LAHIRI','KP','RAMAN','TRUE_CHITRA'] as AyanamshaKey[]).map(k=>{
    const degrees=computeAyanamsha(jd,k)
    return [k,{degrees:parseFloat(degrees.toFixed(6)),formatted:formatAyanamsha(degrees),info:AYANAMSHA_INFO[k]}]
  })) as Record<AyanamshaKey,{degrees:number;formatted:string;info:AyanamshaInfo}>
}
export function ayanamshaProgressionTable(from:number,to:number,step=1,system:AyanamshaKey='LAHIRI') {
  const rows=[]
  for(let y=from;y<=to;y+=step){const d=ayanamshaForYear(y,system);rows.push({year:y,degrees:parseFloat(d.toFixed(6)),formatted:formatAyanamsha(d)})}
  return rows
}
export function isValidAyanamsha(k:string):k is AyanamshaKey { return k==='LAHIRI'||k==='KP'||k==='RAMAN'||k==='TRUE_CHITRA' }
export function getAyanamshaDisplayName(k:AyanamshaKey):string { return AYANAMSHA_INFO[k].displayName }
