'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { useLang } from '@/components/providers/LangProvider'
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


const NAMING_SYLLABLES: Record<number,string[]> = {
  1:['Chu','Che','Cho','La'], 2:['Li','Lu','Le','Lo'], 3:['A','E','U','Ae'],
  4:['O','Va','Vi','Vu'], 5:['Ve','Vo','Ka','Ki'], 6:['Ku','Gha','Na','Cha'],
  7:['Ke','Ko','Ha','Hi'], 8:['Hu','He','Ho','Da'], 9:['Di','Du','De','Do'],
  10:['Ma','Mi','Mu','Me'],11:['Mo','Ta','Ti','Tu'],12:['Te','To','Pa','Pi'],
  13:['Pu','Sha','Na','Tha'],14:['Pe','Po','Ra','Ri'],15:['Ru','Re','Ro','Ta'],
  16:['Ti','Tu','Te','To'],17:['Na','Ne','Nu','No'],18:['Yi','Yu','Ye','Yo'],
  19:['Ye','Yo','Bha','Bhi'],20:['Bhu','Dha','Pha','Bhe'],21:['Be','Bo','Ja','Ji'],
  22:['Ju','Je','Jo','Gha'],23:['Ga','Gi','Gu','Ge'],24:['Go','Sa','Si','Su'],
  25:['Se','So','Da','Di'],26:['Du','Tha','Jha','Na'],27:['De','Do','Cha','Chi'],
};

function makeNameSuggestions(nak:number,pada:number){
  const sounds=NAMING_SYLLABLES[nak]||[];
  const prefix=sounds[Math.max(0,Math.min(3,pada-1))]||sounds[0]||'';
  const examples=['Anika','Aarav','Aditi','Anaya','Ishaan','Isha','Kiran','Kavya','Riya','Rohan','Sahana','Varun'];
  const matches=examples.filter(n=>n.toLowerCase().startsWith(prefix.toLowerCase().slice(0,1)));
  return { prefix, examples: matches.length ? matches.slice(0,4) : examples.slice(0,4) };
}

export default function KundaliResult({ record }: Props) {
  const { lang } = useLang()
  const tr = (en:string, kn:string) => lang === 'kn' ? kn : en
  const [downloadingJpg,setDownloadingJpg] = useState(false)

  const downloadKundaliJpg = async () => {
    setDownloadingJpg(true)
    try {
      await document.fonts.ready
      const canvas = document.createElement('canvas')
      canvas.width = 1600
      canvas.height = 2200
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const bg = ctx.createLinearGradient(0,0,1600,2200)
      bg.addColorStop(0,'#0D1525'); bg.addColorStop(.55,'#18305A'); bg.addColorStop(1,'#0D1525')
      ctx.fillStyle = bg; ctx.fillRect(0,0,1600,2200)
      const pad=100
      const face=lang==='kn'?'Noto Sans Kannada, sans-serif':'Inter, system-ui, sans-serif'
      ctx.fillStyle='#E8C97A'; ctx.font=`600 34px ${face}`; ctx.fillText('VedRith',pad,pad)
      ctx.fillStyle='#F8F3EC'; ctx.font=`700 68px ${face}`; ctx.fillText(tr('Janma Kundali','ಜನ್ಮ ಕುಂಡಲಿ'),pad,pad+90)
      ctx.font=`400 34px ${face}`; ctx.fillStyle='rgba(248,243,236,.72)'
      ctx.fillText(`${record.name} · ${birthData.dateOfBirth} · ${birthData.timeOfBirth}`,pad,pad+145)
      ctx.fillText(`${birthData.placeName} · ${birthData.timezone}`,pad,pad+195)

      let y=390
      ctx.strokeStyle='rgba(201,160,82,.35)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(pad,y-35); ctx.lineTo(1500,y-35); ctx.stroke()
      const boxes=[
        [tr('Lagna','ಲಗ್ನ'),lagna.sa],
        [tr('Moon Rashi','ಚಂದ್ರ ರಾಶಿ'),moon.sa],
        [tr('Sun Rashi','ಸೂರ್ಯ ರಾಶಿ'),sun.sa],
        [tr('Nakshatra','ನಕ್ಷತ್ರ'),`#${planets.MOON.nakshatra} · Pada ${planets.MOON.pada}`],
        [tr('Ayanamsha','ಅಯನಾಂಶ'),`${ayanamsha} ${ayanamshaValue.toFixed(2)}°`],
        [tr('House System','ಭಾವ ಪದ್ಧತಿ'),houseSystemUsed.replace('_',' ')]
      ]
      boxes.forEach(([a,b],i)=>{
        const x=pad+(i%2)*720, yy=y+Math.floor(i/2)*150
        ctx.fillStyle='rgba(255,255,255,.05)'; ctx.fillRect(x,yy-20,650,115)
        ctx.fillStyle='rgba(232,201,122,.85)'; ctx.font=`500 24px ${face}`; ctx.fillText(String(a).toUpperCase(),x+25,yy+15)
        ctx.fillStyle='#F8F3EC'; ctx.font=`600 34px ${face}`; ctx.fillText(String(b),x+25,yy+65)
      })
      y+=500
      ctx.fillStyle='#F8F3EC'; ctx.font=`600 34px ${face}`; ctx.fillText(tr('Planetary Positions','ಗ್ರಹ ಸ್ಥಾನಗಳು'),pad,y); y+=55
      ctx.font=`500 23px ${face}`
      ALL_PLANETS.forEach((pId,idx)=>{
        const pos=planets[pId], r=RASHI_NAMES[pos.rashi]
        const row=idx%6, col=Math.floor(idx/6), x=pad+col*720, yy=y+row*95
        ctx.fillStyle='rgba(255,255,255,.04)'; ctx.fillRect(x,yy-32,650,72)
        ctx.fillStyle='#E8C97A'; ctx.fillText(PLANET_ABBREVIATIONS[pId],x+20,yy+10)
        ctx.fillStyle='#F8F3EC'; ctx.fillText(`${r.sa} · ${pos.rashiLongitude.toFixed(2)}° · ${tr('House','ಭಾವ')} ${housePlacements[pId]}`,x+95,yy+10)
        ctx.fillStyle='rgba(248,243,236,.58)'; ctx.fillText(`${tr('Nakshatra','ನಕ್ಷತ್ರ')} #${pos.nakshatra} · ${tr('Pada','ಪಾದ')} ${pos.pada}`,x+95,yy+38)
      })
      y+=700
      const nameHelp=makeNameSuggestions(planets.MOON.nakshatra,planets.MOON.pada)
      ctx.fillStyle='#F8F3EC'; ctx.font=`600 34px ${face}`; ctx.fillText(tr('Name Suggestion Guidance','ಹೆಸರು ಸೂಚನೆ ಮಾರ್ಗದರ್ಶನ'),pad,y)
      ctx.fillStyle='rgba(248,243,236,.68)'; ctx.font=`400 26px ${face}`; ctx.fillText(`${tr('Traditional starting sound','ಸಾಂಪ್ರದಾಯಿಕ ಆರಂಭ ಧ್ವನಿ')}: ${nameHelp.prefix}`,pad,y+55)
      ctx.fillText(`${tr('Examples','ಉದಾಹರಣೆಗಳು')}: ${nameHelp.examples.join(', ')}`,pad,y+95)
      ctx.fillStyle='rgba(248,243,236,.55)'; ctx.font=`400 22px ${face}`; ctx.fillText('vedrith.sharvasit.in',pad,2100)
      const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',.93))
      if(!blob) return
      const url=URL.createObjectURL(blob); const a=document.createElement('a')
      a.href=url; a.download=`VedRith-Kundali-${record.name.replace(/[^a-z0-9]+/gi,'-')}.jpg`
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),5000)
    } finally { setDownloadingJpg(false) }
  }
  const { chart, birthTithi, birthYoga, birthKarana, housePlacements, houseSystemUsed } = record
  const { ascendant, planets, houseCusps, ayanamsha, ayanamshaValue, birthData, computedAt } = chart
  const lagna=RASHI_NAMES[ascendant.rashi], moon=RASHI_NAMES[planets.MOON.rashi], sun=RASHI_NAMES[planets.SUN.rashi]
  const byHouse=groupPlanetsByHouse(housePlacements)
  const dispDate=new Date(birthData.dateOfBirth+'T12:00:00').toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

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
        {[{label:tr('Lagna (Ascendant)','ಲಗ್ನ (ಉದಯ ರಾಶಿ)'),r:lagna,extra:`${ascendant.rashiLongitude.toFixed(2)}° · Nak ${ascendant.nakshatra} Pada ${ascendant.pada}`,house:1},
          {label:tr('Chandra Rashi','ಚಂದ್ರ ರಾಶಿ'),r:moon,extra:'',house:housePlacements.MOON},
          {label:tr('Surya Rashi','ಸೂರ್ಯ ರಾಶಿ'),r:sun,extra:'',house:housePlacements.SUN}].map((item,i)=>(
          <div key={i} className={`bg-navy-800/50 border p-5 ${i===0?'border-gold-500/20':'border-white/[0.07]'}`}>
            <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">{item.label}</p>
            <p className="font-serif text-2xl font-light text-cream-100">{item.r.sa}</p>
            <p className="font-sans text-xs text-cream-100/50 mt-0.5">{item.r.en} · House {item.house}</p>
            {item.extra&&<p className="font-sans text-xs text-cream-100/40 mt-1">{item.extra}</p>}
          </div>
        ))}
      </div>

      {/* Birth Panchanga */}
      <Card label={tr("Janma Nakshatra & Birth Panchanga","ಜನ್ಮ ನಕ್ಷತ್ರ ಮತ್ತು ಜನ್ಮ ಪಂಚಾಂಗ")}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[{lbl:'Nakshatra',val:`#${planets.MOON.nakshatra}`,sub:`Pada ${planets.MOON.pada}`},
            {lbl:'Tithi',val:birthTithi.name,sub:birthTithi.pakshaName+' Paksha',q:birthTithi.quality},
            {lbl:'Yoga',val:birthYoga.name,sub:'',q:birthYoga.quality},
            {lbl:'Karana',val:birthKarana.name,sub:birthKarana.isFixed?'Sthira':'Chara',q:birthKarana.quality},
            {lbl:'Vara',val:new Date(birthData.dateOfBirth+'T12:00:00').toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN',{weekday:'long'}),sub:''}
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
        <Card label={tr("South Indian Kundali","ದಕ್ಷಿಣ ಭಾರತೀಯ ಕುಂಡಲಿ")}>
          <SouthIndianChart ascendantRashi={ascendant.rashi} planets={planets} theme={DEFAULT_CHART_THEME} size={400} title={record.name}/>
        </Card>
        <Card label={tr("North Indian Kundali","ಉತ್ತರ ಭಾರತೀಯ ಕುಂಡಲಿ")}>
          <NorthIndianChart ascendantRashi={ascendant.rashi} planets={planets} theme={DEFAULT_CHART_THEME} size={400} title={record.name}/>
        </Card>
      </div>

      {/* Planetary Positions Table */}
      <Card label={tr("Planetary Positions","ಗ್ರಹ ಸ್ಥಾನಗಳು")}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {[tr('Planet','ಗ್ರಹ'),tr('Sign','ರಾಶಿ'),tr('Deg','ಅಂಶ'),tr('Nakshatra','ನಕ್ಷತ್ರ'),tr('Pada','ಪಾದ'),tr('House','ಭಾವ'),'R?','°/day'].map(h=>(
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
              {[tr('House','ಭಾವ'),tr('Sign','ರಾಶಿ'),'Cusp °',tr('Planets','ಗ್ರಹಗಳು')].map(h=>(
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
      <Card label={tr("Birth Details","ಜನ್ಮ ವಿವರಗಳು")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <div><Row label={tr('Name','ಹೆಸರು')} value={birthData.name}/><Row label={tr('Date','ದಿನಾಂಕ')} value={dispDate}/><Row label={tr('Time','ಸಮಯ')} value={birthData.timeOfBirth+' (local)'}/><Row label={tr('UTC Offset','UTC ವ್ಯತ್ಯಾಸ')} value={`${birthData.utcOffset>=0?'+':''}${birthData.utcOffset} hrs`}/></div>
          <div><Row label={tr('Place','ಸ್ಥಳ')} value={birthData.placeName}/><Row label={tr('Latitude','ಅಕ್ಷಾಂಶ')} value={`${birthData.latitude.toFixed(4)}°`}/><Row label={tr('Longitude','ರೇಖಾಂಶ')} value={`${birthData.longitude.toFixed(4)}°`}/><Row label={tr('Timezone','ಸಮಯ ವಲಯ')} value={birthData.timezone}/></div>
        </div>
      </Card>

      {/* Name suggestion + download */}
      <section className="bg-navy-900/70 border border-gold-500/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-2">
              {tr('Name Suggestion Guidance','ಹೆಸರು ಸೂಚನೆ ಮಾರ್ಗದರ್ಶನ')}
            </p>
            {(() => {
              const info=makeNameSuggestions(planets.MOON.nakshatra,planets.MOON.pada)
              return <><p className="font-serif text-2xl text-cream-100">{tr('Traditional starting sound','ಸಾಂಪ್ರದಾಯಿಕ ಆರಂಭ ಧ್ವನಿ')}: {info.prefix}</p>
                <p className="text-sm text-cream-100/55 mt-2">{tr('Examples','ಉದಾಹರಣೆಗಳು')}: {info.examples.join(', ')}</p></>
            })()}
            <p className="text-[0.65rem] text-cream-100/30 mt-3">{tr('These are traditional sound-based suggestions, not predictions.','ಇವು ಸಾಂಪ್ರದಾಯಿಕ ಧ್ವನಿ ಆಧಾರಿತ ಸೂಚನೆಗಳು; ಭವಿಷ್ಯವಾಣಿ ಅಲ್ಲ.')}</p>
          </div>
          <button onClick={downloadKundaliJpg} disabled={downloadingJpg} className="btn-gold">
            {downloadingJpg?tr('Generating image…','ಚಿತ್ರ ರಚಿಸಲಾಗುತ್ತಿದೆ…'):tr('Download Kundali JPG','ಕುಂಡಲಿ JPG ಡೌನ್‌ಲೋಡ್')}
          </button>
        </div>
      </section>

      {/* Metadata */}
      <p className="font-sans text-[0.6rem] text-cream-100/20 text-right">
        JD {chart.birthData.julianDay?.toFixed(6)} · {ayanamsha} {ayanamshaValue.toFixed(4)}° · Computed {new Date(computedAt).toLocaleString(lang === 'kn' ? 'kn-IN' : 'en-IN')} · {record.id}
      </p>
    </div>
  )
}
