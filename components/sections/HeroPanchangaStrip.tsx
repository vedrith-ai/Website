'use client';

import { useState, useEffect } from 'react';
import { t } from '@/src/i18n/ui';
import { getRegionKey, regionLabel } from '@/src/lib/utils/region';
import { todayInTimezone } from '@/src/lib/utils/date';
import { useLocation } from '@/components/providers/LocationProvider';
import type { Lang, PanchangaResponse } from '@/src/types';

interface Props { lang: Lang }

export function HeroPanchangaStrip({ lang }: Props) {
  const { location, detecting } = useLocation();
  const [data,    setData]    = useState<PanchangaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [region,  setRegion]  = useState('');

  useEffect(() => {
    if (detecting) return; // Wait until location is resolved

    const tz         = location.timezone;
    const date       = todayInTimezone(tz);
    const regionKey  = getRegionKey();   // never hardcoded
    setRegion(regionLabel(regionKey));

    setLoading(true);
    fetch(
      `/api/v1/panchanga?date=${date}` +
      `&latitude=${location.latitude}` +
      `&longitude=${location.longitude}` +
      `&timezone=${encodeURIComponent(tz)}` +
      `&region=${regionKey}`
    )
      .then(r => r.json())
      .then(json => { if (json.success) setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [location, detecting]);

  if (loading || detecting || !data) {
    return (
      <div className="w-full bg-gradient-to-r from-vedic-maroon to-saffron-600 py-2">
        <div className="container mx-auto px-4 flex gap-6 text-white/70 text-sm animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-20 bg-white/20 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const items = [
    { label: t('panchanga.vara',      lang), value: t(`vara.${data.vara}`, lang) },
    { label: t('panchanga.tithi',     lang), value: t(`tithi.${data.tithi}`, lang) },
    { label: t('panchanga.nakshatra', lang), value: t(`nakshatra.${data.nakshatra}`, lang) },
    { label: t('panchanga.yoga',      lang), value: t(`yoga.${data.yoga}`, lang) },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-vedic-maroon via-saffron-700 to-vedic-maroon py-2 overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 text-white text-xs">
          <span className="opacity-70 whitespace-nowrap mr-2">
            {t('hero.strip.for', lang)} {region}:
          </span>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              <span className="opacity-70">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
              {i < items.length - 1 && <span className="opacity-40 mx-1">·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
