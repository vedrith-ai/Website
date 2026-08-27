'use client';
import {useEffect,useState} from 'react';
import {Header} from '@/components/layout/Header'; import {Footer} from '@/components/layout/Footer';
import {ShareCard} from '@/components/share/ShareCard'; import {useLang} from '@/components/providers/LangProvider'; import {useLocation} from '@/components/providers/LocationProvider';
import {getRegionKey} from '@/src/lib/utils/region'; import {todayInTimezone} from '@/src/lib/utils/date'; import type {PanchangaResult} from '@/lib/types/panchanga';
export default function SharePageClient(){
  const {lang,setLang}=useLang(); const {location,detecting}=useLocation(); const [p,setP]=useState<PanchangaResult|null>(null);
  useEffect(()=>{if(detecting)return;const region=getRegionKey()==='KARNATAKA'?'KANNADA':'NORTH_INDIAN';const params=new URLSearchParams({date:todayInTimezone(location.timezone),lat:String(location.latitude),lng:String(location.longitude),timezone:location.timezone,region,ayanamsha:'LAHIRI',lang,calendarSystem:'AMANTA'});fetch(`/api/v1/panchanga/daily?${params.toString()}`,{cache:'no-store'}).then(r=>r.json()).then(j=>j.success&&setP(j.data)).catch(()=>{});},[detecting,location,lang]);
  return <><Header lang={lang} onLangChange={setLang}/><main id="main-content" className="min-h-screen bg-cream pt-28 pb-20"><div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold-700">VedRith</p><h1 className="font-serif text-5xl text-navy-900 font-light mt-2">{lang==='kn'?'ದಿನದ ಪಂಚಾಂಗ ಹಂಚಿಕೊಳ್ಳಿ':'Share Today’s Panchanga'}</h1><p className="text-navy-600 mt-3 mb-10">{location.city||''}</p>{p?<ShareCard panchanga={p} lang={lang}/>:<div className="h-80 bg-navy-100/60 animate-pulse rounded-sm"/>}</div></main><Footer lang={lang}/></>;
}
