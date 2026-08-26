'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShareCard } from '@/components/share/ShareCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useLang } from '@/components/providers/LangProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { getRegionKey, regionLabel } from '@/src/lib/utils/region';
import { todayInTimezone } from '@/src/lib/utils/date';
import type { PanchangaResponse } from '@/src/types';
import { t } from '@/src/i18n/ui';

export default function PanchangaPageClient() {
  const {lang,setLang}=useLang();
  const {location,detecting}=useLocation();
  const [date,setDate]=useState('');
  const [data,setData]=useState<PanchangaResponse|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{ if(!detecting) setDate(todayInTimezone(location.timezone)); },[detecting,location.timezone]);

  useEffect(()=>{
    if(detecting || !date) return;
    const controller=new AbortController();
    setLoading(true); setError('');
    fetch('/api/v1/panchanga',{
      method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
      body:JSON.stringify({
        date, latitude:location.latitude, longitude:location.longitude,
        timezone:location.timezone, region:getRegionKey()
      })
    }).then(r=>r.json()).then(j=>{
      if(j.success) setData(j.data); else setError(j.error || t('error.api',lang));
    }).catch(e=>{ if(e.name!=='AbortError') setError(t('error.network',lang)); })
      .finally(()=>setLoading(false));
    return ()=>controller.abort();
  },[date,location,detecting,lang]);

  const label=(key:string)=>t(key,lang);

  return <>
    <Header lang={lang} onLangChange={setLang}/>
    <main id="main-content" className="bg-cream min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-600">{regionLabel(getRegionKey())}</p>
            <h1 className="font-serif text-5xl text-navy-900 font-light mt-2">{label('panchanga.title')}</h1>
            <p className="text-navy-600 mt-3 max-w-2xl">{label('panchanga.subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <label className="text-xs uppercase tracking-wider text-navy-600">{label('common.date')}</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="px-3 py-2 rounded border border-gold-500/25 bg-white/70"/>
          </div>
        </div>

        <div className="mb-8 p-5 border border-gold-500/20 bg-white/60 rounded-sm">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-navy-700">
            <span><strong>{label('common.location')}:</strong> {location.city || '—'}</span>
            <span>{location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°</span>
            <span>{location.timezone}</span>
          </div>
        </div>

        {loading && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array.from({length:9}).map((_,i)=><div key={i} className="h-28 rounded bg-navy-100/60 animate-pulse"/>)}</div>}
        {error && <div className="p-5 border border-red-300 bg-red-50 text-red-700 rounded">{error}</div>}

        {data && <ErrorBoundary lang={lang}><div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              [label('panchanga.vara'), t(`vara.${data.vara}`,lang), ''],
              [label('panchanga.tithi'), `${t(`tithi.${data.tithi}`,lang)} (${data.tithiIndex})`, data.tithiEndTime],
              [label('panchanga.nakshatra'), `${t(`nakshatra.${data.nakshatra}`,lang)} (${data.nakshatraIndex+1})`, `${label('panchanga.pada')} ${data.nakshatraPada} · ${data.nakshatraEndTime}`],
              [label('panchanga.yoga'), `${t(`yoga.${data.yoga}`,lang)} (${data.yogaIndex+1})`, data.yogaEndTime],
              [label('panchanga.karana'), t(`karana.${data.karana}`,lang), ''],
              [label('panchanga.sunrise'), data.sunrise, `${label('panchanga.sunset')}: ${data.sunset}`],
              [label('panchanga.moonrise'), data.moonrise, `${label('panchanga.moonset')}: ${data.moonset}`],
              [label('panchanga.festivals'), data.festivals.length?data.festivals.join(', '):label('panchanga.noFestivals'), ''],
            ].map(([a,b,c])=><div key={a} className="bg-white border border-navy-900/10 p-5 shadow-sm"><p className="text-[0.62rem] uppercase tracking-[0.17em] text-gold-700">{a}</p><p className="font-serif text-xl text-navy-900 mt-2">{b}</p>{c&&<p className="text-xs text-navy-500 mt-1">{c}</p>}</div>)}
          </div>

          <div className="bg-navy-950 text-cream-100 p-6 grid md:grid-cols-2 gap-x-10 gap-y-3">
            {[
              [label('panchanga.abhijit'),`${data.abhijitMuhurta.start} – ${data.abhijitMuhurta.end}`],
              [label('panchanga.rahukalam'),`${data.rahukalam.start} – ${data.rahukalam.end}`],
              [label('panchanga.yamagandam'),`${data.yamagandam.start} – ${data.yamagandam.end}`],
              [label('panchanga.gulikakalam'),`${data.gulikakalam.start} – ${data.gulikakalam.end}`],
            ].map(([a,b])=><div key={a} className="flex justify-between border-b border-white/10 py-3 gap-4"><span className="text-cream-100/50">{a}</span><span className="font-medium">{b}</span></div>)}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gold-500/20 p-6">
              <p className="text-[0.62rem] uppercase tracking-[0.17em] text-gold-700">{label('panchanga.deity')}</p>
              <h2 className="font-serif text-2xl text-navy-900 mt-2">{data.deityOfDay}</h2>
              <p className="text-navy-600 mt-3">{data.spiritualMessage}</p>
            </div>
            <div className="bg-white border border-gold-500/20 p-6">
              <p className="text-[0.62rem] uppercase tracking-[0.17em] text-gold-700">{label('panchanga.auspiciousYoga')}</p>
              <p className="text-navy-700 mt-3">{data.auspiciousYoga ? label('common.auspicious') : label('common.neutral')}</p>
            </div>
          </div>

          <section className="bg-white border border-navy-900/10 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div><h2 className="font-serif text-2xl text-navy-900">{lang==='kn'?'ಇಂದಿನ ಪಂಚಾಂಗ ಹಂಚಿಕೊಳ್ಳಿ':'Share Today’s Panchanga'}</h2><p className="text-sm text-navy-500 mt-1">{location.city || location.country}</p></div>
              <a href="/" className="text-xs uppercase tracking-wider text-gold-700 hover:text-gold-600">{lang==='kn'?'ಮುಖಪುಟ':'Home'}</a>
            </div>
            <ShareCard panchanga={data} lang={lang}/>
          </section>
        </div></ErrorBoundary>}
      </div>
    </main>
    <Footer lang={lang}/>
  </>;
}
