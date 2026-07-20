'use client'
import { RASHI_NAMES } from '@/lib/types/kundali'
import { buildSouthIndianLayout, SOUTH_INDIAN_GRID_SIZE } from '@/lib/engines/kundali-chart/south-indian-layout'
import { PLANET_ABBREVIATIONS, ASCENDANT_ABBREVIATION, DEFAULT_CHART_THEME, type KundaliChartTheme } from '@/lib/types/kundali-chart'
import type { RashiIndex, PlanetaryPositions } from '@/lib/types/kundali'

interface Props { ascendantRashi:RashiIndex; planets:PlanetaryPositions; theme?:KundaliChartTheme; size?:number; className?:string; title?:string }

export default function SouthIndianChart({ ascendantRashi, planets, theme=DEFAULT_CHART_THEME, size=400, className='', title }: Props) {
  const cells=buildSouthIndianLayout(ascendantRashi,planets)
  const cs=size/SOUTH_INDIAN_GRID_SIZE
  const fs={rashi:cs*0.12,house:cs*0.13,planet:cs*0.11,asc:cs*0.10,center:size*0.055}
  return (
    <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" className={`w-full max-w-full ${className}`} role="img" aria-label={title??'South Indian Kundali chart'} style={{background:theme.background}}>
      <rect x={0} y={0} width={size} height={size} fill={theme.background}/>
      <rect x={1} y={1} width={size-2} height={size-2} fill="none" stroke={theme.cellStroke} strokeWidth={1.5}/>
      <rect x={cs} y={cs} width={cs*2} height={cs*2} fill={theme.cellFillAlt} stroke={theme.cellStroke} strokeWidth={0.75}/>
      {title&&<text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle" fill={theme.houseNumberColor} fontSize={fs.center} fontFamily="Georgia,serif">{title}</text>}
      {cells.map(cell=>{
        const x=cell.col*cs,y=cell.row*cs,mid=cs/2,px=cs*0.07,py=cs*0.10
        const rashiSa=RASHI_NAMES[cell.rashi].sa.slice(0,3)
        return (
          <g key={cell.rashi}>
            <rect x={x} y={y} width={cs} height={cs} fill={cell.isAscendant?theme.ascendantHighlight:theme.cellFill} stroke={theme.cellStroke} strokeWidth={0.75}/>
            <text x={x+px} y={y+py+fs.rashi} fill={theme.houseNumberColor} fontSize={fs.rashi} fontFamily="Georgia,serif" fontStyle="italic">{rashiSa}</text>
            <text x={x+cs-px} y={y+py+fs.house} textAnchor="end" fill={theme.houseNumberColor} fontSize={fs.house} fontFamily="Georgia,serif">{cell.houseNumber}</text>
            {cell.isAscendant&&<text x={x+px} y={y+cs-py} fill={theme.ascendantText} fontSize={fs.asc} fontFamily="sans-serif" fontWeight="bold">{ASCENDANT_ABBREVIATION}</text>}
            {cell.planets.map((p,i)=>(
              <text key={p} x={x+mid*0.45} y={y+mid-(cell.planets.length-1)*fs.planet*0.7/2+i*fs.planet*0.95} textAnchor="middle" dominantBaseline="middle" fill={theme.textColor} fontSize={fs.planet} fontFamily="Georgia,serif">{PLANET_ABBREVIATIONS[p]}</text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}
