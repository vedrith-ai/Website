'use client';

import Link from 'next/link';
import KundaliResult from '@/components/kundali/KundaliResult';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLang } from '@/components/providers/LangProvider';
import type { KundaliChartRecord } from '@/lib/types/kundali-chart';

export default function KundaliChartShell({record}:{record:KundaliChartRecord}) {
  const {lang,setLang}=useLang();
  return <>
    <Header lang={lang} onLangChange={setLang}/>
    <main id="main-content" className="min-h-screen bg-navy-950 pt-20 pb-12">
      <div className="border-b border-white/[0.06] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold-500 mb-2">{lang==='kn'?'ಜನ್ಮ ಕುಂಡಲಿ':'Janma Kundali'}</p>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-cream-100">{record.name}</h1>
          <p className="font-sans text-sm text-cream-100/40 mt-1">{record.chart.birthData.dateOfBirth} · {record.chart.birthData.placeName}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <KundaliResult record={record}/>
        <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between">
          <p className="font-sans text-xs text-cream-100/25">{lang==='kn'?'ಚಾರ್ಟ್ ID':'Chart ID'}: <code className="font-mono text-cream-100/40">{record.id}</code></p>
          <Link href="/kundali" className="font-sans text-[0.7rem] tracking-[0.14em] uppercase px-5 py-2 border border-white/20 text-cream-100/50 hover:border-gold-500/40 hover:text-gold-400 transition-colors">
            {lang==='kn'?'ಮತ್ತೊಂದು ಕುಂಡಲಿ':'Generate Another Chart'}
          </Link>
        </div>
      </div>
    </main>
    <Footer lang={lang}/>
  </>;
}
