'use client';

import { useState } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang, PanchangaResponse, ShareTheme, ShareAspect } from '@/src/types';

interface Props { panchanga: PanchangaResponse; lang: Lang }

const THEMES: ShareTheme[]  = ['saffron', 'midnight', 'lotus', 'forest'];
const ASPECTS: ShareAspect[] = ['1:1', '4:5', '9:16', '16:9'];

// Preview CSS styles (DOM card)
const THEME_PREVIEW: Record<ShareTheme, { bg: string; text: string; sub: string }> = {
  saffron:  { bg: 'from-orange-700 via-amber-500 to-yellow-400',  text: 'text-white',        sub: 'text-white/70' },
  midnight: { bg: 'from-slate-900 via-indigo-950 to-slate-800',   text: 'text-amber-100',    sub: 'text-amber-200/60' },
  lotus:    { bg: 'from-rose-100 via-pink-50 to-rose-200',        text: 'text-rose-900',     sub: 'text-rose-700/70' },
  forest:   { bg: 'from-emerald-900 via-green-800 to-emerald-700',text: 'text-emerald-50',   sub: 'text-emerald-200/70' },
};

// Canvas gradient stops per theme
const THEME_CANVAS: Record<ShareTheme, { stops: [number, string][]; text: string; sub: string }> = {
  saffron:  { stops: [[0,'#9a3412'],[0.45,'#ea580c'],[1,'#fbbf24']], text:'#ffffff',   sub:'rgba(255,255,255,0.7)' },
  midnight: { stops: [[0,'#0f0c29'],[0.5,'#302b63'],[1,'#24243e']], text:'#fef3c7',   sub:'rgba(254,243,199,0.6)' },
  lotus:    { stops: [[0,'#fce7f3'],[0.5,'#fbcfe8'],[1,'#f9a8d4']], text:'#881337',   sub:'rgba(136,19,55,0.7)' },
  forest:   { stops: [[0,'#14532d'],[0.5,'#166534'],[1,'#15803d']], text:'#ecfdf5',   sub:'rgba(236,253,245,0.65)' },
};

const ASPECT_PREVIEW: Record<ShareAspect, string> = {
  '1:1':  'aspect-square w-64',
  '4:5':  'aspect-[4/5] w-52',
  '9:16': 'aspect-[9/16] w-36',
  '16:9': 'aspect-video w-96',
};

const CANVAS_DIMS: Record<ShareAspect, { w: number; h: number }> = {
  '1:1':  { w: 1080, h: 1080 },
  '4:5':  { w: 1080, h: 1350 },
  '9:16': { w: 1080, h: 1920 },
  '16:9': { w: 1920, h: 1080 },
};

const PRODUCTION_DOMAIN = 'vedrith.sharvasit.in';

export function ShareCard({ panchanga, lang }: Props) {
  const [theme,      setTheme]      = useState<ShareTheme>('saffron');
  const [aspect,     setAspect]     = useState<ShareAspect>('1:1');
  const [generating, setGenerating] = useState(false);

  // ── Real JPEG download via Canvas API ────────────────────────────────────
  const downloadJPEG = async () => {
    setGenerating(true);
    try {
      const { w, h }   = CANVAS_DIMS[aspect];
      const canvas      = document.createElement('canvas');
      canvas.width      = w;
      canvas.height     = h;
      const ctx         = canvas.getContext('2d');
      if (!ctx) return;

      // Wait for fonts to be available (Inter + Noto Sans Kannada)
      await document.fonts.ready;

      const tc   = THEME_CANVAS[theme];
      const pad  = Math.round(w * 0.08);
      const fontFace = lang === 'kn'
        ? '"Noto Sans Kannada", sans-serif'
        : 'Inter, system-ui, sans-serif';

      // ── Background gradient ──────────────────────────────────────────────
      const grad = ctx.createLinearGradient(0, 0, w, h);
      tc.stops.forEach(([pos, color]) => grad.addColorStop(pos, color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // ── Subtle top-right decorative circle ───────────────────────────────
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(w * 0.85, h * 0.12, w * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Tagline ──────────────────────────────────────────────────────────
      const taglineSz = Math.round(w * 0.026);
      ctx.font        = `400 ${taglineSz}px ${fontFace}`;
      ctx.fillStyle   = tc.sub;
      ctx.globalAlpha = 1;
      ctx.fillText(t('share.tagline', lang), pad, pad + taglineSz);

      // ── App name ─────────────────────────────────────────────────────────
      const titleSz  = Math.round(w * 0.065);
      ctx.font       = `700 ${titleSz}px ${fontFace}`;
      ctx.fillStyle  = tc.text;
      ctx.fillText('☀ ' + t('hero.title', lang), pad, pad + taglineSz + titleSz * 1.2);

      // ── Separator line ───────────────────────────────────────────────────
      const sepY = pad + taglineSz + titleSz * 1.2 + titleSz * 0.6;
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = tc.text;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(pad, sepY);
      ctx.lineTo(w - pad, sepY);
      ctx.stroke();
      ctx.restore();

      // ── Panchanga fields ─────────────────────────────────────────────────
      const fields: [string, string][] = [
        [t('panchanga.vara',      lang), t(`vara.${panchanga.vara}`,           lang)],
        [t('panchanga.tithi',     lang), t(`tithi.${panchanga.tithi}`,         lang)],
        [t('panchanga.nakshatra', lang), t(`nakshatra.${panchanga.nakshatra}`, lang)],
        [t('panchanga.yoga',      lang), t(`yoga.${panchanga.yoga}`,           lang)],
      ];

      const fieldStartY  = sepY + h * 0.06;
      const fieldSpacing = Math.min(h * 0.115, (h * 0.55) / fields.length);
      const labelSz      = Math.round(w * 0.026);
      const valueSz      = Math.round(w * 0.042);

      fields.forEach(([label, value], i) => {
        const baseY = fieldStartY + i * fieldSpacing;

        ctx.font      = `400 ${labelSz}px ${fontFace}`;
        ctx.fillStyle = tc.sub;
        ctx.fillText(label.toUpperCase(), pad, baseY);

        ctx.font      = `600 ${valueSz}px ${fontFace}`;
        ctx.fillStyle = tc.text;
        ctx.fillText(value, pad, baseY + labelSz * 1.5);
      });

      // ── Sunrise / Sunset row ─────────────────────────────────────────────
      const srY      = fieldStartY + fields.length * fieldSpacing + h * 0.02;
      const srLblSz  = Math.round(w * 0.024);
      ctx.font       = `400 ${srLblSz}px ${fontFace}`;
      ctx.fillStyle  = tc.sub;
      const srLabel  = `${t('panchanga.sunrise', lang)} ${panchanga.sunrise}  ·  ${t('panchanga.sunset', lang)} ${panchanga.sunset}`;
      ctx.fillText(srLabel, pad, srY);

      // ── Abhijit Muhurta ──────────────────────────────────────────────────
      const amY  = srY + srLblSz * 1.8;
      ctx.font   = `400 ${srLblSz}px ${fontFace}`;
      ctx.fillStyle = tc.sub;
      const amLabel = `${t('panchanga.abhijit', lang)}  ${panchanga.abhijitMuhurta.start} – ${panchanga.abhijitMuhurta.end}`;
      ctx.fillText(amLabel, pad, amY);

      // ── Date ─────────────────────────────────────────────────────────────
      const dateSz  = Math.round(w * 0.028);
      ctx.font      = `500 ${dateSz}px ${fontFace}`;
      ctx.fillStyle = tc.text;
      ctx.globalAlpha = 0.85;
      ctx.fillText(panchanga.date, pad, h - pad - dateSz * 1.6);

      // ── Production domain watermark ───────────────────────────────────────
      const domSz   = Math.round(w * 0.022);
      ctx.font      = `400 ${domSz}px ${fontFace}`;
      ctx.fillStyle = tc.sub;
      ctx.globalAlpha = 0.7;
      ctx.fillText(PRODUCTION_DOMAIN, pad, h - pad);

      // ── Export as JPEG ────────────────────────────────────────────────────
      const filename = `VedRith-Panchanga-${panchanga.date}.jpg`;
      canvas.toBlob(
        blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a   = document.createElement('a');
          a.href     = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // Small delay before revoking so mobile Safari can pick it up
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        },
        'image/jpeg',
        0.93
      );
    } finally {
      setGenerating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const preview = THEME_PREVIEW[theme];

  return (
    <div className="space-y-6">

      {/* Theme selector */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">{t('share.theme', lang)}</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map(th => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                theme === th
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              {t(`share.${th}`, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect selector */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">{t('share.aspect', lang)}</p>
        <div className="flex flex-wrap gap-2">
          {ASPECTS.map(asp => (
            <button
              key={asp}
              onClick={() => setAspect(asp)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                aspect === asp
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              {asp}
            </button>
          ))}
        </div>
      </div>

      {/* Card preview */}
      <div className="flex justify-center">
        <div
          className={`${ASPECT_PREVIEW[aspect]} bg-gradient-to-br ${preview.bg} rounded-2xl p-5 flex flex-col justify-between shadow-xl overflow-hidden select-none`}
          role="img"
          aria-label={t('a11y.chart', lang)}
        >
          <div>
            <p className={`text-xs font-medium ${preview.sub}`}>{t('share.tagline', lang)}</p>
            <p className={`text-xl font-bold mt-1 ${preview.text}`}>☀ {t('hero.title', lang)}</p>
          </div>

          <div className="space-y-1.5">
            {[
              [t('panchanga.vara', lang),      t(`vara.${panchanga.vara}`, lang)],
              [t('panchanga.tithi', lang),     t(`tithi.${panchanga.tithi}`, lang)],
              [t('panchanga.nakshatra', lang),  t(`nakshatra.${panchanga.nakshatra}`, lang)],
              [t('panchanga.yoga', lang),       t(`yoga.${panchanga.yoga}`, lang)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center text-xs">
                <span className={preview.sub}>{label}</span>
                <span className={`font-semibold ${preview.text}`}>{value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className={`text-[10px] font-medium ${preview.sub}`}>{panchanga.date}</p>
            <p className={`text-[10px] ${preview.sub} opacity-60`}>{PRODUCTION_DOMAIN}</p>
          </div>
        </div>
      </div>

      {/* Download button — generates real JPEG via Canvas API */}
      <div className="flex justify-center">
        <button
          onClick={downloadJPEG}
          disabled={generating}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {generating ? t('share.generating', lang) : t('share.download', lang)}
        </button>
      </div>

      {/* Aspect ratio output info */}
      <p className="text-center text-xs text-muted-foreground">
        {CANVAS_DIMS[aspect].w} × {CANVAS_DIMS[aspect].h}px · JPEG
      </p>
    </div>
  );
}
