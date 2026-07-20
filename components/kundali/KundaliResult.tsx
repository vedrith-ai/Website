import type { ReactNode } from 'react'
import type { KundaliChartRecord } from '@/lib/types/kundali-chart'
import { RASHI_NAMES, ALL_PLANETS } from '@/lib/types/kundali'
import { PLANET_ABBREVIATIONS, DEFAULT_CHART_THEME } from '@/lib/types/kundali-chart'
import { groupPlanetsByHouse } from '@/lib/engines/kundali-chart/house-placement'
import SouthIndianChart from './SouthIndianChart'
import NorthIndianChart from './NorthIndianChart'

interface Props { record: KundaliChartRecord }

function Card({ label, children, className='' }: { label:string; children:ReactNode; className?:string }) {
  return (
    <div className={`bg-navy-900/60 border border-white/[0.07] p-5 ${className}`}>
      <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-4">{label}</p>
      {children}
    </div>
  )
}
function Row({ label, value }: { label:string; value:string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-white/[0.05] last:border-0 gap-4">
      <span className="font-sans text-xs text-cream-100/50 flex-shrink-0">{label}</span>
      <span className="font-sans text-sm text-cream-100/90 text-right">{value}</span>
    </div>
  )
}
function QBadge({ q }: { q:'SHUBHA'|'ASHUBHA'|'MIXED' }) {
  const s={SHUBHA:'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',ASHUBHA:'bg-red-500/10 text-red-400 border-red-500/25',MIXED:'bg-gold-500/10 text-gold-400 border-gold-500/25'}
  return <span className={`font-sans text-[0.58rem] tracking-[0.12em] uppercase px-2 py-0.5 border ${s[q]}`}>{q.charAt(0)+q.slice(1).toLowerCase()}</span>
}

export default function KundaliResult({ record }: Props) {
  const { chart, birthTithi, birthYoga, birthKarana, housePlacements, houseSystemUsed } = record
  const { ascendant, planets, houseCusps, ayanamsha, ayanamshaValue, birthData, computedAt } = chart
  const lagna=RASHI_NAMES[ascendant.rashi], moon=RASHI_NAMES[planets.MOON.rashi], sun=RASHI_NAMES[planets.SUN.rashi]
  const byHouse=groupPlanetsByHouse(housePlacements)
  const dispDate=new Date(birthData.dateOfBirth+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-navy-900/80 border border-gold-500/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500 mb-1">Janma Kundali</p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream-100">{record.name}</h2>
            <p className="font-sans text-sm text-cream-100/50 mt-1">{dispDate} · {birthData.timeOfBirth} · {birthData.placeName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/25">{record.gender.charAt(0)+record.gender.slice(1).toLowerCase()}</span>
            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 bg-navy-800/60 text-cream-100/50 border border-white/10">{ayanamsha} {ayanamshaValue.toFixed(2)}°</span>
            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 bg-navy-800/60 text-cream-100/50 border border-white/10">{houseSystemUsed.replace('_',' ')}</span>
          </div>
        </div>
      </div>

      {/* Lagna / Moon / Sun */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[{label:'Lagna (Ascendant)',r:lagna,extra:`${ascendant.rashiLongitude.toFixed(2)}° · Nak ${ascendant.nakshatra} Pada ${ascendant.pada}`,house:1},
          {label:'Chandra Rashi',r:moon,extra:'',house:housePlacements.MOON},
          {label:'Surya Rashi',r:sun,extra:'',house:housePlacements.SUN}].map((item,i)=>(
          <div key={i} className={`bg-navy-800/50 border p-5 ${i===0?'border-gold-500/20':'border-white/[0.07]'}`}>
            <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">{item.label}</p>
            <p className="font-serif text-2xl font-light text-cream-100">{item.r.sa}</p>
            <p className="font-sans text-xs text-cream-100/50 mt-0.5">{item.r.en} · House {item.house}</p>
            {item.extra&&<p className="font-sans text-xs text-cream-100/40 mt-1">{item.extra}</p>}
          </div>
        ))}
      </div>

      {/* Birth Panchanga */}
      <Card label="Janma Nakshatra & Birth Panchanga">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[{lbl:'Nakshatra',val:`#${planets.MOON.nakshatra}`,sub:`Pada ${planets.MOON.pada}`},
            {lbl:'Tithi',val:birthTithi.name,sub:birthTithi.pakshaName+' Paksha',q:birthTithi.quality},
            {lbl:'Yoga',val:birthYoga.name,sub:'',q:birthYoga.quality},
            {lbl:'Karana',val:birthKarana.name,sub:birthKarana.isFixed?'Sthira':'Chara',q:birthKarana.quality},
            {lbl:'Vara',val:new Date(birthData.dateOfBirth+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long'}),sub:''}
          ].map((item,i)=>(
            <div key={i}>
              <p className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-cream-100/40 mb-1">{item.lbl}</p>
              <p className="font-serif text-lg font-light text-cream-100">{item.val}</p>
              {item.sub&&<p className="font-sans text-xs text-cream-100/50">{item.sub}</p>}
              {item.q&&<QBadge q={item.q as 'SHUBHA'|'ASHUBHA'|'MIXED'}/>}
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card label="South Indian Kundali">
          <SouthIndianChart ascendantRashi={ascendant.rashi} planets={planets} theme={DEFAULT_CHART_THEME} size={400} title={record.name}/>
        </Card>
        <Card label="North Indian Kundali">
          <NorthIndianChart ascendantRashi={ascendant.rashi} planets={planets} theme={DEFAULT_CHART_THEME} size={400} title={record.name}/>
        </Card>
      </div>

      {/* Planetary Positions Table */}
      <Card label="Planetary Positions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Planet','Sign','Deg','Nakshatra','Pada','House','R?','°/day'].map(h=>(
                <th key={h} className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-cream-100/40 text-left py-2 pr-4 whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {ALL_PLANETS.map(pId=>{
                const pos=planets[pId],r=RASHI_NAMES[pos.rashi]
                return (
                  <tr key={pId} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-4 font-sans text-cream-100/90 whitespace-nowrap"><span className="text-gold-500/80 mr-1.5">{PLANET_ABBREVIATIONS[pId]}</span>{pId.charAt(0)+pId.slice(1).toLowerCase()}</td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/80 whitespace-nowrap">{r.sa} <span className="text-cream-100/40">({r.en})</span></td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70">{pos.rashiLongitude.toFixed(2)}°</td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70">{pos.nakshatra}</td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70">{pos.pada}</td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70">{housePlacements[pId]}</td>
                    <td className="py-2.5 pr-4 font-sans">{pos.isRetrograde?<span className="text-amber-400 text-[0.75rem]">R</span>:<span className="text-cream-100/20">—</span>}</td>
                    <td className="py-2.5 font-sans text-cream-100/50 tabular-nums">{pos.dailyMotion>0?'+':''}{pos.dailyMotion.toFixed(4)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* House Placements Table */}
      <Card label={`House Placements — ${houseSystemUsed.replace('_',' ')}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['House','Sign','Cusp °','Planets'].map(h=>(
                <th key={h} className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-cream-100/40 text-left py-2 pr-4">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {houseCusps.cusps.map((cusp,idx)=>{
                const hn=idx+1,ri=Math.floor(cusp/30)%12,r=RASHI_NAMES[ri as 0],ps=byHouse[hn]??[]
                return (
                  <tr key={hn} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-4 font-sans text-gold-500/80 font-medium">{hn}</td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/80 whitespace-nowrap">{r.sa} <span className="text-cream-100/40">({r.en})</span></td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/60 tabular-nums">{cusp.toFixed(4)}°</td>
                    <td className="py-2.5 font-sans text-cream-100/70">
                      {ps.length>0?ps.map(p=><span key={p} className="inline-block mr-2">{PLANET_ABBREVIATIONS[p]}</span>):<span className="text-cream-100/20">—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Birth Details */}
      <Card label="Birth Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <div><Row label="Name" value={birthData.name}/><Row label="Date" value={dispDate}/><Row label="Time" value={birthData.timeOfBirth+' (local)'}/><Row label="UTC Offset" value={`${birthData.utcOffset>=0?'+':''}${birthData.utcOffset} hrs`}/></div>
          <div><Row label="Place" value={birthData.placeName}/><Row label="Latitude" value={`${birthData.latitude.toFixed(4)}°`}/><Row label="Longitude" value={`${birthData.longitude.toFixed(4)}°`}/><Row label="Timezone" value={birthData.timezone}/></div>
        </div>
      </Card>

      {/* Metadata */}
      <p className="font-sans text-[0.6rem] text-cream-100/20 text-right">
        JD {chart.birthData.julianDay?.toFixed(6)} · {ayanamsha} {ayanamshaValue.toFixed(4)}° · Computed {new Date(computedAt).toLocaleString()} · {record.id}
      </p>
    </div>
  )
}
