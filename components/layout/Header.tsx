'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

const NAV = [
  ['/panchanga','nav.panchanga'],
  ['/kundali','nav.kundali'],
  ['/knowledge','nav.knowledge'],
  ['/search','nav.search'],
  ['/share','nav.share'],
] as const;

export function Header({ lang, onLangChange }: { lang: Lang; onLangChange: (l: Lang)=>void }) {
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{ const on=()=>setScrolled(window.scrollY>24); window.addEventListener('scroll',on,{passive:true}); return()=>window.removeEventListener('scroll',on)},[]);
  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled?'bg-cream-100/95 backdrop-blur border-b border-gold-500/15 shadow-navy-sm':'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image src="/images/logo-horizontal.png" alt="VedRith" width={220} height={55} className="hidden sm:block h-11 w-auto object-contain" priority />
            <Image src="/images/logo-circular.png" alt="VedRith" width={44} height={44} className="sm:hidden h-11 w-11 rounded-full" priority />
          </Link>
          <nav className="hidden md:flex items-center gap-1" aria-label={t('nav.home',lang)}>
            {NAV.map(([href,key])=><Link key={href} href={href} className="px-3 py-2 font-sans text-[0.7rem] tracking-[0.16em] uppercase text-navy-700 hover:text-gold-700 transition-colors rounded">{t(key,lang)}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={()=>onLangChange(lang==='en'?'kn':'en')} className="rounded-full border border-gold-500/30 px-3 py-1.5 text-xs text-navy-800 hover:bg-gold-500/10 transition" aria-label={t('a11y.langSwitch',lang)}>
              {lang==='en'?'ಕನ್ನಡ':'English'}
            </button>
            <Link href="/search" className="hidden sm:inline-flex px-3 py-2 text-xs text-navy-700 hover:text-gold-700">{t('nav.search',lang)}</Link>
            <button className="md:hidden w-10 h-10 rounded border border-navy-900/10" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label={open?t('a11y.menuClose',lang):t('a11y.menuOpen',lang)}>
              <span className="sr-only">{open?t('a11y.menuClose',lang):t('a11y.menuOpen',lang)}</span>
              <div className="mx-auto w-5 space-y-1"><span className="block h-px bg-navy-900"/><span className="block h-px bg-navy-900"/><span className="block h-px bg-navy-900"/></div>
            </button>
          </div>
        </div>
      </header>
      {open && <div className="fixed inset-0 z-40 bg-navy-950 md:hidden pt-24 px-6">
        <nav className="flex flex-col gap-2">
          {NAV.map(([href,key])=><Link key={href} href={href} onClick={()=>setOpen(false)} className="font-serif text-4xl font-light text-cream-100 py-3 border-b border-white/5">{t(key,lang)}</Link>)}
        </nav>
        <div className="mt-8"><button onClick={()=>{onLangChange(lang==='en'?'kn':'en');setOpen(false)}} className="btn-gold w-full">{lang==='en'?'ಕನ್ನಡ':'English'}</button></div>
      </div>}
    </>
  );
}
