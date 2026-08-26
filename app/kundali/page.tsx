'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import KundaliBirthForm, { type KundaliFormValues } from '@/components/kundali/KundaliBirthForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLang } from '@/components/providers/LangProvider';

export default function KundaliPage() {
  const router=useRouter();
  const {lang,setLang}=useLang();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const handleSubmit=useCallback(async(values:KundaliFormValues)=>{
    setLoading(true); setError(null);
    try{
      const res=await fetch('/api/v1/kundali/generate',{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)
      });
      const data=await res.json();
      if(!data.success){setError(data.error?.message||'Unable to generate Kundali');return;}
      router.push(`/kundali/${data.data.id}`);
    }catch{setError(lang==='kn'?'ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.':'Network error. Please check your connection and try again.')}
    finally{setLoading(false);}
  },[router,lang]);

  return <>
    <Header lang={lang} onLangChange={setLang}/>
    <main id="main-content" className="min-h-screen bg-navy-950 pt-20 pb-20">
      <div className="border-b border-white/[0.06] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold-500 mb-3">
            {lang==='kn'?'ಜನ್ಮ ಕುಂಡಲಿ':'Kundali Engine V1'}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-cream-100 mb-2">
            {lang==='kn'?'ವೈದಿಕ ಜನ್ಮ ಕುಂಡಲಿ ರಚಿಸಿ':'Vedic Birth Chart Generator'}
          </h1>
          <p className="font-sans text-sm text-cream-100/50 max-w-2xl">
            {lang==='kn'
              ? 'ಲಗ್ನ, ಎಲ್ಲಾ 9 ಗ್ರಹಗಳು, ಭಾವಗಳು, ನಕ್ಷತ್ರ ಮತ್ತು ಜನ್ಮ ಪಂಚಾಂಗದೊಂದಿಗೆ ದಕ್ಷಿಣ ಮತ್ತು ಉತ್ತರ ಭಾರತೀಯ ಕುಂಡಲಿ.'
              : 'Generate a complete Vedic birth chart with Lagna, all 9 planets, house placements, Nakshatra and birth Panchanga in South and North Indian styles.'}
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="bg-navy-900/70 border border-white/[0.08] p-6">
              <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-5">
                {lang==='kn'?'ಜನ್ಮ ವಿವರಗಳು':'Birth Details'}
              </p>
              <KundaliBirthForm onSubmit={handleSubmit} loading={loading}/>
            </div>
            {error&&<div className="mt-4 bg-red-500/8 border border-red-500/20 p-4"><p className="font-sans text-sm text-red-400">{error}</p></div>}
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="relative w-48 h-48 mb-8" aria-hidden="true">
              {[40,72,110,152,192].map((s,i)=><div key={s} className="absolute rounded-full border border-gold-500/15" style={{width:s,height:s,top:'50%',left:'50%',transform:'translate(-50%,-50%)',opacity:0.9-i*0.15}}/> )}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-5xl text-gold-500/25">ॐ</span>
            </div>
            <p className="font-serif text-xl font-light text-cream-100/40 mb-2">
              {lang==='kn'?'ಜನ್ಮ ವಿವರಗಳನ್ನು ನೀಡಿ ಕುಂಡಲಿ ರಚಿಸಿ':'Enter birth details to generate your chart'}
            </p>
            <p className="font-sans text-xs text-cream-100/25 max-w-xs">
              {lang==='kn'?'ದಕ್ಷಿಣ ಮತ್ತು ಉತ್ತರ ಭಾರತೀಯ ಕುಂಡಲಿ, ಸಂಪೂರ್ಣ ಗ್ರಹ ಸ್ಥಾನಗಳು ಮತ್ತು ಭಾವ ವಿವರಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.':'Your South Indian and North Indian charts, complete planetary positions and house placements will appear here.'}
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer lang={lang}/>
  </>;
}
