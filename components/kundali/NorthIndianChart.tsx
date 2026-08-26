'use client'
import { RASHI_NAMES } from '@/lib/types/kundali'
import { buildNorthIndianLayout } from '@/lib/engines/kundali-chart/north-indian-layout'
import { PLANET_ABBREVIATIONS, ASCENDANT_ABBREVIATION, DEFAULT_CHART_THEME, type KundaliChartTheme } from '@/lib/types/kundali-chart'
import type { RashiIndex, PlanetaryPositions } from '@/lib/types/kundali'

interface Props { ascendantRashi:RashiIndex; planets:PlanetaryPositions; theme?:KundaliChartTheme; size?:number; className?:string; title?:string }

export default function NorthIndianChart({ ascendantRashi, planets, theme=DEFAULT_CHART_THEME, size=400, className='', title }: Props) {
  const slots=buildNorthIndianLayout(ascendantRashi,planets,size)
  const S=size,sk={stroke:theme.cellStroke,strokeWidth:1 as number,fill:'none'}
  return (
    <svg viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg" className={`w-full max-w-full ${className}`} role="img" aria-label={title??'North Indian Kundali chart'} style={{background:theme.background}}>
      <rect x={0} y={0} width={S} height={S} fill={theme.background}/>
      <rect x={1} y={1} width={S-2} height={S-2} fill="none" stroke={theme.cellStroke} strokeWidth={1.5}/>
      <polygon points={`${S/2},0 ${S},${S/2} ${S/2},${S} 0,${S/2}`} fill="none" stroke={theme.cellStroke} strokeWidth={1}/>
      <line x1={0} y1={0} x2={S} y2={S} {...sk}/><line x1={S} y1={0} x2={0} y2={S} {...sk}/>
      <line x1={0} y1={0} x2={S/2} y2={S/2} {...sk}/><line x1={S} y1={0} x2={S/2} y2={S/2} {...sk}/>
      <line x1={S} y1={S} x2={S/2} y2={S/2} {...sk}/><line x1={0} y1={S} x2={S/2} y2={S/2} {...sk}/>
      {slots.map(slot=>{
        const {labelPos}=slot, rashiSa=RASHI_NAMES[slot.rashi].sa.slice(0,3)
        const isK=slot.slot===1||slot.slot===4||slot.slot===7||slot.slot===10
        const fB=S*0.035,pF=S*0.028,rF=S*0.028,lineH=pF*1.25
        const totalH=slot.planets.length*lineH,startY=labelPos.y+(isK?rF*1.2:rF*0.8)
        return (
          <g key={slot.slot}>
            <polygon points={slot.pointsAttr} fill={slot.isAscendant?theme.ascendantHighlight:theme.cellFill} stroke="none"/>
            <text x={labelPos.x} y={labelPos.y-(isK?fB*1.4:fB*1.0)} textAnchor="middle" dominantBaseline="middle" fill={theme.houseNumberColor} fontSize={fB*0.85} fontFamily="Georgia,serif">{slot.slot}</text>
            <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle" fill={slot.isAscendant?theme.ascendantText:theme.houseNumberColor} fontSize={rF} fontFamily="Georgia,serif" fontStyle="italic" fontWeight={slot.isAscendant?'bold':'normal'}>{rashiSa}{slot.isAscendant?` · ${ASCENDANT_ABBREVIATION}`:''}</text>
            {slot.planets.map((p,i)=>(
              <text key={p} x={labelPos.x} y={startY+i*lineH-totalH/2+lineH/2} textAnchor="middle" dominantBaseline="middle" fill={theme.textColor} fontSize={pF} fontFamily="Georgia,serif">{PLANET_ABBREVIATIONS[p]}</text>
            ))}
          </g>
        )
      })}
      {title&&<text x={S/2} y={S/2} textAnchor="middle" dominantBaseline="middle" fill={theme.houseNumberColor} fontSize={S*0.035} fontFamily="Georgia,serif" opacity={0.7}>{title}</text>}
    </svg>
  )
}
