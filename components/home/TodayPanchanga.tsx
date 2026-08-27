'use client';

import { useEffect, useState } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';
import type { PanchangaResult } from '@/lib/types/panchanga';
import { getRegionKey } from '@/src/lib/utils/region';
import { todayInTimezone } from '@/src/lib/utils/date';

interface Props { lang: Lang; timezone?: string; latitude?: number; longitude?: number; detecting?: boolean }

export function TodayPanchanga({lang,timezone,latitude,longitude,detecting}:Props){
  const [data,setData]=useState<PanchangaResult|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    if(detecting) return;
    const tz=timezone||'Asia/Kolkata';
    const region=getRegionKey()==='KARNATAKA'?'KANNADA':'NORTH_INDIAN';
    const params=new URLSearchParams({
      date:todayInTimezone(tz),lat:String(latitude??12.9716),lng:String(longitude??77.5946),
      timezone:tz,region,ayanamsha:'LAHIRI',lang,calendarSystem:'AMANTA'
    });
    setLoading(true); setError('');
    fetch(`/api/v1/panchanga/daily?${params.toString()}`,{cache:'no-store'}).then(r=>r.json()).then(j=>{
      if(j.success)setData(j.data); else setError(j.error||t('error.api',lang));
    }).catch(()=>setError(t('error.network',lang))).finally(()=>setLoading(false));
  },[detecting,timezone,latitude,longitude,lang]);

  if(loading||detecting) return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[1,2,3,4,5,6].map(i=><div key={i} className="h-20 rounded border bg-white/[0.05] animate-pulse"/>)}</div>;
  if(error) return <div className="p-4 rounded border border-red-300/20 text-red-200">{error}</div>;
  if(!data) return null;

  const cards=[
    [t('panchanga.vara',lang),data.vara.displayName||data.vara.name],
    [t('panchanga.tithi',lang),data.tithi.displayName||data.tithi.name],
    [t('panchanga.nakshatra',lang),`${data.nakshatra.displayName||data.nakshatra.name} (${data.nakshatra.number})`],
    [t('panchanga.yoga',lang),data.yoga.displayName||data.yoga.name],
    [t('panchanga.karana',lang),data.karana.displayName||data.karana.name],
    [t('panchanga.sunrise',lang),data.sunriseLocal],
    [t('panchanga.sunset',lang),data.sunsetLocal],
    [t('panchanga.abhijit',lang),`${data.abhijitMuhurta.startLocal} – ${data.abhijitMuhurta.endLocal}`],
    [t('panchanga.rahukalam',lang),`${data.rahuKalam.startLocal} – ${data.rahuKalam.endLocal}`],
  ];
  return <div className="space-y-4">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map(([label,value])=><div key={label} className="rounded border border-white/[0.07] bg-navy-800/50 p-3"><p className="text-[0.6rem] tracking-[0.13em] uppercase text-gold-500/70">{label}</p><p className="font-serif text-base text-cream-100 mt-1">{value}</p></div>)}
    </div>
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="rounded border border-gold-500/20 bg-white/[0.03] p-4"><p className="text-[0.6rem] tracking-[0.13em] uppercase text-gold-500/70">{lang==='kn'?'ಮಾಸ':'Masa'}</p><p className="font-serif text-xl text-cream-100 mt-1">{data.masa.current.displayName||data.masa.current.name}</p><p className="text-xs text-cream-100/50 mt-1">{data.samvatsara.displayName||data.samvatsara.name}</p></div>
      <div className="rounded border border-gold-500/20 bg-white/[0.03] p-4"><p className="text-[0.6rem] tracking-[0.13em] uppercase text-gold-500/70">{t('panchanga.deity',lang)}</p><p className="font-serif text-xl text-cream-100 mt-1">{data.nakshatra.deity}</p><p className="text-xs text-cream-100/50 mt-1">{lang==='kn'?'ನಕ್ಷತ್ರ ಅಧಿದೇವತೆ':'Nakshatra deity'}</p></div>
    </div>
  </div>;
}
