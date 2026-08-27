'use client';

import { useEffect, useState } from 'react';
import { t } from '@/src/i18n/ui';
import { getRegionKey, regionLabel } from '@/src/lib/utils/region';
import { todayInTimezone } from '@/src/lib/utils/date';
import { useLocation } from '@/components/providers/LocationProvider';
import type { Lang } from '@/src/types';
import type { PanchangaResult } from '@/lib/types/panchanga';

export function HeroPanchangaStrip({ lang }: { lang: Lang }) {
  const { location, detecting } = useLocation();
  const [data, setData] = useState<PanchangaResult | null>(null);

  useEffect(() => {
    if (detecting) return;

    const region =
      getRegionKey() === 'KARNATAKA' ? 'KANNADA' : 'NORTH_INDIAN';

    const params = new URLSearchParams({
      date: todayInTimezone(location.timezone),
      lat: String(location.latitude),
      lng: String(location.longitude),
      timezone: location.timezone,
      region,
      ayanamsha: 'LAHIRI',
      lang,
      calendarSystem: 'AMANTA',
    });

    let cancelled = false;

    fetch(`/api/v1/panchanga/daily?${params.toString()}`, {
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!cancelled && json.success) setData(json.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [detecting, location.latitude, location.longitude, location.timezone, lang]);

  if (!data) {
    return (
      <div className="w-full bg-navy-950 py-2" aria-hidden="true">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 text-white/40 text-xs animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-4 w-24 bg-white/10 rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  const items: [string, string][] = [
    [t('panchanga.vara', lang), data.vara.displayName || data.vara.name],
    [t('panchanga.tithi', lang), data.tithi.displayName || data.tithi.name],
    [
      t('panchanga.nakshatra', lang),
      `${data.nakshatra.displayName || data.nakshatra.name} (${data.nakshatra.number})`,
    ],
    [t('panchanga.yoga', lang), data.yoga.displayName || data.yoga.name],
    [
      lang === 'kn' ? 'ಮಾಸ' : 'Masa',
      data.masa.current.displayName || data.masa.current.name,
    ],
  ];

  return (
    <div className="w-full bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-white whitespace-nowrap">
        <span className="text-gold-400/80">
          {regionLabel(getRegionKey())}:
        </span>

        {items.map(([label, value], index) => (
          <span key={label}>
            <span className="text-white/50">{label}</span>{' '}
            <strong>{value}</strong>
            {index < items.length - 1 && (
              <span className="text-white/20 mx-2">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
