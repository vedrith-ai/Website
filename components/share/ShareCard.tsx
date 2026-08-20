'use client';

import { useState } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang, PanchangaResponse, ShareTheme, ShareAspect } from '@/src/types';

interface Props { panchanga: PanchangaResponse; lang: Lang }

const THEMES: ShareTheme[]  = ['saffron', 'midnight', 'lotus', 'forest'];
const ASPECTS: ShareAspect[] = ['1:1', '4:5', '9:16', '16:9'];

const THEME_STYLES: Record<ShareTheme, string> = {
  saffron:  'from-saffron-600 via-vedic-gold to-saffron-500 text-white',
  midnight: 'from-slate-900 via-indigo-950 to-slate-800 text-amber-100',
  lotus:    'from-rose-100 via-pink-50 to-rose-200 text-rose-900',
  forest:   'from-emerald-900 via-green-800 to-emerald-700 text-emerald-50',
};

const ASPECT_CLASSES: Record<ShareAspect, string> = {
  '1:1':  'aspect-square w-64',
  '4:5':  'aspect-[4/5] w-52',
  '9:16': 'aspect-[9/16] w-40',
  '16:9': 'aspect-video w-96',
};

const PRODUCTION_DOMAIN = 'vedrith.sharvasit.in';

export function ShareCard({ panchanga, lang }: Props) {
  const [theme,  setTheme]  = useState<ShareTheme>('saffron');
  const [aspect, setAspect] = useState<ShareAspect>('1:1');

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">{t('share.theme', lang)}</p>
          <div className="flex gap-2">
            {THEMES.map(th => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  theme === th ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                {t(`share.${th}`, lang)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">{t('share.aspect', lang)}</p>
          <div className="flex gap-2">
            {ASPECTS.map(asp => (
              <button
                key={asp}
                onClick={() => setAspect(asp)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  aspect === asp ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                {asp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card preview */}
      <div className="flex justify-center">
        <div
          className={`${ASPECT_CLASSES[aspect]} bg-gradient-to-br ${THEME_STYLES[theme]} rounded-2xl p-5 flex flex-col justify-between shadow-xl select-none overflow-hidden`}
          role="img"
          aria-label={t('a11y.chart', lang)}
        >
          <div>
            <p className="text-xs font-medium opacity-75">{t('share.tagline', lang)}</p>
            <p className="text-xl font-bold mt-1">{t('hero.title', lang)}</p>
          </div>

          <div className="space-y-1.5">
            <Row label={t('panchanga.vara', lang)}      value={t(`vara.${panchanga.vara}`, lang)} />
            <Row label={t('panchanga.tithi', lang)}     value={t(`tithi.${panchanga.tithi}`, lang)} />
            <Row label={t('panchanga.nakshatra', lang)} value={t(`nakshatra.${panchanga.nakshatra}`, lang)} />
            <Row label={t('panchanga.yoga', lang)}      value={t(`yoga.${panchanga.yoga}`, lang)} />
          </div>

          <div>
            <p className="text-[10px] font-medium opacity-60">{panchanga.date}</p>
            {/* Production domain only — never vedrith.com */}
            <p className="text-[10px] opacity-50">{PRODUCTION_DOMAIN}</p>
          </div>
        </div>
      </div>

      {/* Download button */}
      <div className="flex justify-center">
        <button
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => window.print()}
        >
          {t('share.download', lang)}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
