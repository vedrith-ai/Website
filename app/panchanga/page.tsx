'use client';

import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import PanchangaForm, { type PanchangaFormValues } from '@/components/panchanga/PanchangaForm';
import PanchangaResult from '@/components/panchanga/PanchangaResult';
import type { PanchangaResult as TPanchangaResult, ApiResponse } from '@/lib/types/panchanga';
import { useLang } from '@/components/providers/LangProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { getRegionKey } from '@/src/lib/utils/region';
import { todayInTimezone } from '@/src/lib/utils/date';

export default function PanchangaPage() {
  const { lang, setLang } = useLang();
  const { location, detecting } = useLocation();
  const [result,setResult]=useState<TPanchangaResult|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const handleSubmit=useCallback(async(values:PanchangaFormValues)=>{
    setLoading(true); setError(null); setResult(null);
    try{
      const params=new URLSearchParams({
        date:values.date,
        lat:String(values.lat),
        lng:String(values.lng),
        timezone:values.timezone,
        region:values.region,
        ayanamsha:values.ayanamsha,
        locationName:values.locationName,
        lang:values.lang,
        calendarSystem:values.calendarSystem,
      });
      const res=await fetch(`/api/v1/panchanga/daily?${params.toString()}`,{cache:'no-store'});
      const data=await res.json() as ApiResponse<TPanchangaResult>;
      if(!data.success){setError(data.error.message);return;}
      setResult(data.data);
      if(window.innerWidth<1024) setTimeout(()=>document.getElementById('panchanga-result')?.scrollIntoView({behavior:'smooth',block:'start'}),100);
    }catch{setError(lang==='kn'?'ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ.':'Network error. Please check your connection and try again.')}
    finally{setLoading(false);}
  },[lang]);

  // Pre-fill the form automatically from the device/network location and active language.
  const autoValues:PanchangaFormValues={
    date: detecting ? '' : todayInTimezone(location.timezone),
    lat: location.latitude,
    lng: location.longitude,
    timezone: location.timezone,
    locationName: location.city || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
    region: getRegionKey() === 'KARNATAKA' ? 'KANNADA' : 'NORTH_INDIAN',
    ayanamsha:'LAHIRI',
    lang,
    calendarSystem: 'AMANTA',
  };

  useEffect(()=>{
    if(detecting || result) return;
    void handleSubmit(autoValues);
  },[detecting, location.latitude, location.longitude, location.timezone, lang]); // automatic current-day result on page load

  return <>
    <Header lang={lang} onLangChange={setLang}/>
    <main id="main-content" className="min-h-screen bg-navy-950 pt-20 pb-20">
      <div className="border-b border-white/[0.06] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold-500 mb-3">Panchanga</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-cream-100 mb-2">
            {lang==='kn'?'ಇಂದಿನ ಪಂಚಾಂಗ':'Today’s Panchanga'}
          </h1>
          <p className="font-sans text-sm text-cream-100/50 max-w-2xl">
            {lang==='kn'
              ? 'ನಿಮ್ಮ ಸ್ಥಳ, ಪ್ರದೇಶ ಮತ್ತು ಆಯ್ಕೆ ಮಾಡಿದ ಕ್ಯಾಲೆಂಡರ್ ಪದ್ಧತಿಗೆ ಅನುಗುಣವಾಗಿ ಪಂಚಾಂಗ.'
              : 'A location-aware Panchanga using your selected regional tradition and lunar calendar system.'}
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="bg-navy-900/70 border border-white/[0.08] p-6">
              <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-5">
                {lang==='kn'?'ಲೆಕ್ಕಾಚಾರ ಆಯ್ಕೆಗಳು':'Calculation Parameters'}
              </p>
              <PanchangaForm onSubmit={handleSubmit} loading={loading}/>
              <p className="font-sans text-[0.6rem] text-cream-100/20 mt-3 leading-relaxed">
                {lang==='kn'
                  ? 'ಖಗೋಳೀಯ ಗಣನೆಗಳ ಆಧಾರದ ಮೇಲೆ ಪಂಚಾಂಗ ಲೆಕ್ಕಾಚಾರ.'
                  : 'Panchanga calculations use the verified VedRith astronomical engine.'}
              </p>
            </div>
          </div>
          <div id="panchanga-result">
            {loading && (
              <div className="space-y-4 animate-pulse" aria-busy="true">
                <div className="h-28 bg-navy-800/50 border border-white/[0.05]" />
                <div className="grid grid-cols-2 gap-3">{[1,2,3,4,5,6].map(i=><div key={i} className="h-36 bg-navy-800/40 border border-white/[0.04]"/>)}</div>
              </div>
            )}
            {error && !loading && <div className="bg-red-500/8 border border-red-500/20 p-6 text-red-300">{error}</div>}
            {!result&&!loading&&!error && <div className="py-20 text-center text-cream-100/40">ॐ</div>}
            {result&&!loading&&<PanchangaResult result={result}/>}
          </div>
        </div>
      </div>
    </main>
    <Footer lang={lang}/>
  </>;
}
