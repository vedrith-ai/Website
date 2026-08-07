'use client'
// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Kundali Result Display  [V1.1 — Rich Names + Multilingual]
//
// V1.1 Changes:
//   • Nakshatra shown as "Rohini (4)" not "#4" everywhere
//   • Rashi shown with Sanskrit + English + Kannada + symbol
//   • Planet names localised (Surya/ಸೂರ್ಯ)
//   • Language switcher (EN ↔ KN) — instant, no recalculation
//   • I18nProvider wraps the entire component tree
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import type { KundaliChartRecord } from '@/lib/types/kundali-chart'
import { RASHI_NAMES, ALL_PLANETS } from '@/lib/types/kundali'
import { PLANET_ABBREVIATIONS, DEFAULT_CHART_THEME } from '@/lib/types/kundali-chart'
import { groupPlanetsByHouse } from '@/lib/engines/kundali-chart/house-placement'
import SouthIndianChart from './SouthIndianChart'
import NorthIndianChart from './NorthIndianChart'
import { I18nProvider, useTranslation, LanguageSwitcher } from '@/lib/i18n/index'
import { nakshatraLabel, rashiShort, planetShort, houseLabel } from '@/lib/i18n/kundali-names'

interface Props { record: KundaliChartRecord }

// ── Sub-components ────────────────────────────────────────────────────────────

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

// ── Inner component (has access to i18n context) ──────────────────────────────

function KundaliResultInner({ record }: Props) {
  const { lang, t } = useTranslation()
  const { chart, birthTithi, birthYoga, birthKarana, housePlacements, houseSystemUsed } = record
  const { ascendant, planets, houseCusps, ayanamsha, ayanamshaValue, birthData, computedAt } = chart

  const lagna = RASHI_NAMES[ascendant.rashi]
  const moon  = RASHI_NAMES[planets.MOON.rashi]
  const sun   = RASHI_NAMES[planets.SUN.rashi]
  const byHouse = groupPlanetsByHouse(housePlacements)

  const dispDate = new Date(birthData.dateOfBirth+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  // Rich rashi label for a RASHI_NAMES entry
  function rashiDisplay(r: typeof lagna): string {
    if (lang === 'kn') {
      const knMap: Record<string, string> = {
        Mesha:'ಮೇಷ', Vrishabha:'ವೃಷಭ', Mithuna:'ಮಿಥುನ', Karka:'ಕರ್ಕ',
        Simha:'ಸಿಂಹ', Kanya:'ಕನ್ಯಾ', Tula:'ತುಲಾ', Vrishchika:'ವೃಶ್ಚಿಕ',
        Dhanu:'ಧನು', Makara:'ಮಕರ', Kumbha:'ಕುಂಭ', Meena:'ಮೀನ',
      }
      return knMap[r.sa] ?? r.sa
    }
    return `${r.sa} (${r.en})`
  }

  return (
    <div className="space-y-6">
      {/* Header with language switcher */}
      <div className="bg-navy-900/80 border border-gold-500/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500 mb-1">
              {t('kundali.title')}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream-100">{record.name}</h2>
            <p className="font-sans text-sm text-cream-100/50 mt-1">
              {dispDate} · {birthData.timeOfBirth} · {birthData.placeName}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            {/* Language Switcher — instant, no recalculation */}
            <LanguageSwitcher compact />
            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/25">
              {record.gender.charAt(0)+record.gender.slice(1).toLowerCase()}
            </span>
            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 bg-navy-800/60 text-cream-100/50 border border-white/10">
              {ayanamsha} {ayanamshaValue.toFixed(2)}°
            </span>
            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 bg-navy-800/60 text-cream-100/50 border border-white/10">
              {houseSystemUsed.replace('_',' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Lagna / Moon / Sun — V1.1: shows Kannada rashi name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {label: t('label.lagna'),     r:lagna, extra:`${ascendant.rashiLongitude.toFixed(2)}° · ${nakshatraLabel(ascendant.nakshatra, lang)} ${t('label.pada')} ${ascendant.pada}`, house:1},
          {label: t('label.moon.sign'), r:moon,  extra:'', house:housePlacements.MOON},
          {label: t('label.sun.sign'),  r:sun,   extra:'', house:housePlacements.SUN},
        ].map((item,i)=>(
          <div key={i} className={`bg-navy-800/50 border p-5 ${i===0?'border-gold-500/20':'border-white/[0.07]'}`}>
            <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">{item.label}</p>
            {/* V1.1: rich rashi display */}
            <p className="font-serif text-2xl font-light text-cream-100">{rashiDisplay(item.r)}</p>
            <p className="font-sans text-xs text-cream-100/50 mt-0.5">
              {lang === 'kn' ? `(${item.r.sa})` : item.r.en} · {houseLabel(item.house, lang)}
            </p>
            {item.extra && <p className="font-sans text-xs text-cream-100/40 mt-1">{item.extra}</p>}
          </div>
        ))}
      </div>

      {/* Birth Panchanga — V1.1: Nakshatra shows "Rohini (4)" not "#4" */}
      <Card label={t('kundali.panchanga.birth')}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {lbl: t('panchanga.nakshatra'), val: nakshatraLabel(planets.MOON.nakshatra, lang), sub:`${t('label.pada')} ${planets.MOON.pada}`},
            {lbl: t('panchanga.tithi'),     val: birthTithi.name, sub: birthTithi.pakshaName+' Paksha', q: birthTithi.quality},
            {lbl: t('panchanga.yoga'),      val: birthYoga.name,  sub: '', q: birthYoga.quality},
            {lbl: t('panchanga.karana'),    val: birthKarana.name, sub: birthKarana.isFixed ? 'Sthira' : 'Chara', q: birthKarana.quality},
            {lbl: t('label.vara'),          val: new Date(birthData.dateOfBirth+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long'}), sub:''},
          ].map((item,i)=>(
            <div key={i}>
              <p className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-cream-100/40 mb-1">{item.lbl}</p>
              <p className="font-serif text-lg font-light text-cream-100">{item.val}</p>
              {item.sub && <p className="font-sans text-xs text-cream-100/50">{item.sub}</p>}
              {item.q && <QBadge q={item.q as 'SHUBHA'|'ASHUBHA'|'MIXED'}/>}
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card label={t('kundali.chart.south')}>
          <SouthIndianChart ascendantRashi={ascendant.rashi} planets={planets} theme={DEFAULT_CHART_THEME} size={400} title={record.name}/>
        </Card>
        <Card label={t('kundali.chart.north')}>
          <NorthIndianChart ascendantRashi={ascendant.rashi} planets={planets} theme={DEFAULT_CHART_THEME} size={400} title={record.name}/>
        </Card>
      </div>

      {/* Planetary Positions Table — V1.1: rich names everywhere */}
      <Card label={t('kundali.planetary.table')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label={t('kundali.planetary.table')}>
            <thead>
              <tr className="border-b border-white/10">
                {[t('col.planet'),t('col.sign'),t('col.degree'),t('col.nakshatra'),t('col.pada'),t('col.house'),t('col.retro'),t('col.daily')].map(h=>(
                  <th key={h} scope="col" className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-cream-100/40 text-left py-2 pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PLANETS.map(pId=>{
                const pos = planets[pId]
                const r   = RASHI_NAMES[pos.rashi]
                return (
                  <tr key={pId} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                    {/* V1.1: Planet name in language */}
                    <td className="py-2.5 pr-4 font-sans text-cream-100/90 whitespace-nowrap">
                      <span className="text-gold-500/80 mr-1.5">{PLANET_ABBREVIATIONS[pId]}</span>
                      {planetShort(pId as Parameters<typeof planetShort>[0], lang)}
                    </td>
                    {/* V1.1: Rashi with Kannada */}
                    <td className="py-2.5 pr-4 font-sans text-cream-100/80 whitespace-nowrap">
                      {lang === 'kn' ? rashiShort(pos.rashi, lang) : `${r.sa} (${r.en})`}
                    </td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70 tabular-nums">{pos.rashiLongitude.toFixed(2)}°</td>
                    {/* V1.1: Nakshatra as "Rohini (4)" not "#4" */}
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70 whitespace-nowrap">{nakshatraLabel(pos.nakshatra, lang)}</td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70">{pos.pada}</td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/70">{houseLabel(housePlacements[pId], lang)}</td>
                    <td className="py-2.5 pr-4 font-sans">
                      {pos.isRetrograde
                        ? <span className="text-amber-400 text-[0.75rem]" aria-label={t('label.retrograde')}>R</span>
                        : <span className="text-cream-100/20" aria-label={t('label.direct')}>—</span>}
                    </td>
                    <td className="py-2.5 font-sans text-cream-100/50 tabular-nums">{pos.dailyMotion>0?'+':''}{pos.dailyMotion.toFixed(4)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* House Placements Table — V1.1: house labels in Kannada */}
      <Card label={`${t('kundali.house.placements')} — ${houseSystemUsed.replace('_',' ')}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label={t('kundali.house.placements')}>
            <thead>
              <tr className="border-b border-white/10">
                {[t('col.house'),t('col.sign'),'Cusp °',t('col.planet')].map(h=>(
                  <th key={h} scope="col" className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-cream-100/40 text-left py-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {houseCusps.cusps.map((cusp,idx)=>{
                const hn = idx+1
                const ri = Math.floor(cusp/30)%12
                const r  = RASHI_NAMES[ri as 0]
                const ps = byHouse[hn] ?? []
                return (
                  <tr key={hn} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-4 font-sans text-gold-500/80 font-medium whitespace-nowrap">
                      {houseLabel(hn, lang)}
                    </td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/80 whitespace-nowrap">
                      {lang === 'kn' ? rashiShort(ri, lang) : `${r.sa} (${r.en})`}
                    </td>
                    <td className="py-2.5 pr-4 font-sans text-cream-100/60 tabular-nums">{cusp.toFixed(4)}°</td>
                    <td className="py-2.5 font-sans text-cream-100/70">
                      {ps.length>0
                        ? ps.map(p=>(
                          <span key={p} className="inline-block mr-2">
                            {PLANET_ABBREVIATIONS[p]}&nbsp;
                            <span className="text-cream-100/40 text-[0.7rem]">{planetShort(p as Parameters<typeof planetShort>[0], lang)}</span>
                          </span>
                        ))
                        : <span className="text-cream-100/20">—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Birth Details */}
      <Card label={t('kundali.birth.details')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <div>
            <Row label={t('kundali.birth.date')} value={dispDate}/>
            <Row label={t('kundali.birth.time')} value={birthData.timeOfBirth+' (local)'}/>
            <Row label="UTC Offset" value={`${birthData.utcOffset>=0?'+':''}${birthData.utcOffset} hrs`}/>
          </div>
          <div>
            <Row label={t('kundali.birth.place')} value={birthData.placeName}/>
            <Row label="Latitude"  value={`${birthData.latitude.toFixed(4)}°`}/>
            <Row label="Longitude" value={`${birthData.longitude.toFixed(4)}°`}/>
            <Row label="Timezone"  value={birthData.timezone}/>
          </div>
        </div>
      </Card>

      {/* Metadata */}
      <p className="font-sans text-[0.6rem] text-cream-100/20 text-right">
        JD {chart.birthData.julianDay?.toFixed(6)} · {ayanamsha} {ayanamshaValue.toFixed(4)}° · Computed {new Date(computedAt).toLocaleString()} · {record.id}
      </p>
    </div>
  )
}

// ── Public export — wraps with I18nProvider ───────────────────────────────────

export default function KundaliResult({ record }: Props) {
  return (
    <I18nProvider defaultLang="kn">
      <KundaliResultInner record={record} />
    </I18nProvider>
  )
}
