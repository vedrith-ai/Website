'use client';

import { useLang }     from '@/components/providers/LangProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { Header }      from '@/components/layout/Header';
import { Footer }      from '@/components/layout/Footer';
import { HeroPanchangaStrip } from '@/components/sections/HeroPanchangaStrip';
import { TodayPanchanga }     from '@/components/home/TodayPanchanga';
import { CrossLinks }         from '@/components/CrossLinks';
import { ErrorBoundary }      from '@/components/ErrorBoundary';
import { InstallPrompt }      from '@/components/InstallPrompt';
import { t } from '@/src/i18n/ui';

export function HomeContent() {
  const { lang, setLang }         = useLang();
  const { location, detecting }   = useLocation();

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />
      <HeroPanchangaStrip lang={lang} />
      <main id="main-content" className="container mx-auto px-4 py-8 space-y-10">
        <section>
          <h1 className="text-3xl font-bold mb-1">{t('panchanga.title', lang)}</h1>
          <p className="text-muted-foreground mb-6">{t('panchanga.subtitle', lang)}</p>
          <ErrorBoundary lang={lang}>
            <TodayPanchanga
              lang={lang}
              latitude={location.latitude}
              longitude={location.longitude}
              timezone={location.timezone}
              detecting={detecting}
            />
          </ErrorBoundary>
        </section>
        <CrossLinks lang={lang} current="/" />
      </main>
      <Footer lang={lang} />
      <InstallPrompt lang={lang} />
    </>
  );
}
