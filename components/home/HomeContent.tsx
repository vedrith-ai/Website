'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroPanchangaStrip } from '@/components/sections/HeroPanchangaStrip';
import { TodayPanchanga } from '@/components/home/TodayPanchanga';
import { CrossLinks } from '@/components/CrossLinks';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useLang } from '@/components/providers/LangProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { t } from '@/src/i18n/ui';

export function HomeContent() {
  const {lang,setLang}=useLang();
  const {location,detecting}=useLocation();
  const tr=(en:string,kn:string)=>lang==='kn'?kn:en;

  const live = [
    {href:'/panchanga', title:t('nav.panchanga',lang), desc:lang==='kn'?'ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ಇಂದಿನ ನಿಖರ ಪಂಚಾಂಗ.':'Today’s location-aware Panchanga.'},
    {href:'/kundali', title:t('nav.kundali',lang), desc:lang==='kn'?'ಜನ್ಮ ವಿವರಗಳಿಂದ ಕುಂಡಲಿ ರಚಿಸಿ.':'Generate a Vedic birth chart from your birth details.'},
    {href:'/knowledge', title:t('nav.knowledge',lang), desc:lang==='kn'?'ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ ಮತ್ತು ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ.':'Explore the meaning behind Panchanga and Jyotisha terms.'},
    {href:'/search', title:t('nav.search',lang), desc:lang==='kn'?'ಜ್ಞಾನ ಮತ್ತು ಪಂಚಾಂಗ ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ.':'Search VedRith knowledge and Panchanga concepts.'},
    {href:'/share', title:t('nav.share',lang), desc:lang==='kn'?'ಇಂದಿನ ಪಂಚಾಂಗವನ್ನು JPG ಆಗಿ ಹಂಚಿಕೊಳ್ಳಿ.':'Create and download today’s Panchanga card as JPG.'},
  ];

  return <>
    <Header lang={lang} onLangChange={setLang} />
    <HeroPanchangaStrip lang={lang} />

    <main id="main-content" className="bg-cream pt-16">
      <section className="hero-bg relative overflow-hidden">
        <div aria-hidden="true">
          {[260,440,640,860].map((size,i)=>
            <div key={size} className="mandala-ring" style={{width:size,height:size,opacity:0.2/(i+1),animation:i%2?'spin-slow 40s linear infinite':undefined,borderStyle:i%2?'dashed':'solid'}}/>
          )}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div>
              <Image src="/images/logo-full.png" alt="VedRith" width={260} height={360} className="w-44 sm:w-56 h-auto mx-auto lg:mx-0 mb-8 animate-float" priority />
              <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-gold-600 mb-4">{tr("Powered by Sharva's IT","ಶಾರ್ವಾಸ್ IT ಮೂಲಕ")}</p>
              <h1 className="font-serif text-navy-900 font-light leading-[1.06]" style={{fontSize:'clamp(2.8rem,6vw,5.3rem)'}}>
                {lang==='kn'?'ಪ್ರಾಚೀನ ಜ್ಞಾನ · ಆಧುನಿಕ ಅನುಭವ':'Ancient Wisdom'}
                <br/>
                <span className="text-shimmer italic">{lang==='kn'?'ವೇದಋಷಿ · ಎಲ್ಲರಿಗೂ':'Modern Experience · For Everyone'}</span>
              </h1>
              <p className="mt-7 max-w-2xl font-sans text-navy-700 leading-relaxed text-base sm:text-lg">
                {lang==='kn'
                  ? 'ಸ್ಥಳಾಧಾರಿತ ಪಂಚಾಂಗ, ಕುಂಡಲಿ ಮತ್ತು ವೈದಿಕ ಜ್ಞಾನವನ್ನು ಒಂದೇ ವಿಶ್ವಾಸಾರ್ಹ ವೇದಿಕೆಯಲ್ಲಿ.'
                  : 'A trusted, location-aware home for Panchanga, Kundali and Vedic knowledge.'}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/panchanga" className="btn-gold">{t('nav.panchanga',lang)}</Link>
                <Link href="/kundali" className="btn-ghost">{t('nav.kundali',lang)}</Link>
              </div>
            </div>

            <div className="rounded-sm border border-gold-500/25 bg-navy-950 shadow-navy-md p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="font-sans text-[0.62rem] tracking-[0.22em] uppercase text-gold-500">{tr("Today","ಇಂದು")}</p>
                  <h2 className="font-serif text-2xl text-cream-100 font-light">{t('panchanga.title',lang)}</h2>
                </div>
                <span className="text-xs text-cream-100/40">{location.city || t('common.location',lang)}</span>
              </div>
              <ErrorBoundary lang={lang}>
                <TodayPanchanga lang={lang} latitude={location.latitude} longitude={location.longitude} timezone={location.timezone} detecting={detecting} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500">{tr("Live in V1","V1 ನಲ್ಲಿ ಲೈವ್")}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-100 font-light mt-3">{tr("The VedRith Foundation","ವೇದಋಥ್ V1 ಅಡಿಪಾಯ")}</h2>
            <p className="font-sans text-cream-100/55 mt-4">{tr("The current release focuses on a dependable daily Panchanga, Kundali foundation, knowledge, sharing and location-aware experience.","ಪ್ರಸ್ತುತ ಆವೃತ್ತಿಯಲ್ಲಿ ನಿಖರ ದೈನಂದಿನ ಪಂಚಾಂಗ, ಕುಂಡಲಿ, ಜ್ಞಾನ, ಹಂಚಿಕೆ ಮತ್ತು ಸ್ಥಳಾಧಾರಿತ ಅನುಭವಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಲಾಗಿದೆ.")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {live.map(x=>(
              <Link key={x.href} href={x.href} className="feature-card p-6 rounded-sm group">
                <p className="text-gold-400 text-sm tracking-[0.15em] uppercase mb-4">{tr("Live","ಲೈವ್")}</p>
                <h3 className="font-serif text-2xl text-cream-100 font-light mb-3 group-hover:text-gold-400 transition-colors">{x.title}</h3>
                <p className="font-sans text-sm text-cream-100/55 leading-relaxed">{x.desc}</p>
                <span className="inline-block mt-5 text-xs uppercase tracking-[0.16em] text-gold-500">{tr("Open →","ತೆರೆಯಿರಿ →")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-600">{tr('Our Vision','ನಮ್ಮ ದೃಷ್ಟಿ')}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy-900 font-light mt-3">{lang==='kn'?'ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ವೈದಿಕ ಜ್ಞಾನ':'One connected Vedic platform'}</h2>
          <p className="font-sans text-navy-600 leading-relaxed mt-5 max-w-3xl mx-auto">
            {lang==='kn'
              ? 'ಪಂಚಾಂಗ, ಕುಂಡಲಿ, ಜ್ಞಾನ ಮತ್ತು ಭವಿಷ್ಯದ ವೈದಿಕ ಸೇವೆಗಳು ಒಂದೇ ಅನುಭವದಲ್ಲಿ ಸಂಪರ್ಕಗೊಳ್ಳುವಂತೆ ವೇದಋಥ್ ಬೆಳೆಯುತ್ತಿದೆ.'
              : 'VedRith is being built to connect Panchanga, Kundali, knowledge and future Vedic services into one trusted experience.'}
          </p>
        </div>
      </section>

      <section className="bg-navy-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              [lang==='kn'?'ಪಂಚಾಂಗ':'Panchanga','/panchanga'],
              [lang==='kn'?'ಕುಂಡಲಿ':'Kundali','/kundali'],
              [lang==='kn'?'ಜ್ಞಾನ':'Knowledge','/knowledge'],
            ].map(([label,href])=>(
              <Link key={href} href={href} className="border border-white/10 bg-white/[0.02] p-6 hover:border-gold-500/30 transition">
                <h3 className="font-serif text-2xl text-cream-100 font-light">{label}</h3>
                <p className="text-sm text-cream-100/45 mt-2">{tr("Explore VedRith →","ವೇದಋಥ್ ಅನ್ವೇಷಿಸಿ →")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-gold-500/20 p-6 bg-gold-500/[0.03]">
            <div>
              <p className="font-serif text-2xl text-navy-900">{tr("Coming after V1","V1 ನಂತರ")}</p>
              <p className="text-sm text-navy-600 mt-1">{tr('Temple Directory, devotional library, family tools, Muhurta and advanced Jyotisha remain on the roadmap.','ದೇವಾಲಯ ನಿರ್ದೇಶಿಕೆ, ಭಕ್ತಿ ಗ್ರಂಥಾಲಯ, ಕುಟುಂಬ ಸಾಧನಗಳು, ಮುಹೂರ್ತ ಮತ್ತು ಉನ್ನತ ಜ್ಯೋತಿಷ್ಯ ಮುಂದಿನ ಹಂತದಲ್ಲಿವೆ.')}</p>
            </div>
            <Link href="/about" className="btn-ghost">{tr("Vision & Roadmap","ದೃಷ್ಟಿ ಮತ್ತು ಮಾರ್ಗಸೂಚಿ")}</Link>
          </div>
        </div>
      </section>

      <CrossLinks lang={lang} current="/" />
    </main>

    <Footer lang={lang} />
  </>;
}
