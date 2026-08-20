'use client';

import { useState, useEffect } from 'react';
import { t } from '@/src/i18n/ui';
import { getRegionKey } from '@/src/lib/utils/region';
import { todayInTimezone } from '@/src/lib/utils/date';
import type { Lang, PanchangaResponse } from '@/src/types';

interface Props {
  lang:       Lang;
  timezone?:  string;
  latitude?:  number;
  longitude?: number;
  detecting?: boolean; // from LocationProvider — wait before fetching
}

export function TodayPanchanga({ lang, timezone, latitude, longitude, detecting }: Props) {
  const [panchanga, setPanchanga] = useState<PanchangaResponse | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    // Wait until location is resolved (avoids double-fetch with wrong coords)
    if (detecting) return;

    const tz  = timezone  ?? 'Asia/Kolkata';
    const lat = latitude  ?? 12.9716;
    const lon = longitude ?? 77.5946;

    const date   = todayInTimezone(tz);
    const region = getRegionKey();

    setLoading(true);
    setError(null);

    fetch('/api/v1/panchanga', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ date, latitude: lat, longitude: lon, timezone: tz, region }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) setPanchanga(json.data);
        else setError(json.error ?? t('error.api', lang));
      })
      .catch(() => setError(t('error.network', lang)))
      .finally(() => setLoading(false));
  }, [lang, timezone, latitude, longitude, detecting]);

  if (detecting || loading) return <PanchangaSkeleton />;
  if (error)   return <div className="text-destructive p-4 rounded-lg border border-destructive/20">{error}</div>;
  if (!panchanga) return null;

  return (
    <section aria-label={t('panchanga.title', lang)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <PanchangaCard label={t('panchanga.vara', lang)}      value={t(`vara.${panchanga.vara}`, lang)} />
        <PanchangaCard label={t('panchanga.tithi', lang)}     value={t(`tithi.${panchanga.tithi}`, lang)} sub={t(`common.${panchanga.tithiPaksha}paksha`, lang)} />
        <PanchangaCard label={t('panchanga.nakshatra', lang)} value={t(`nakshatra.${panchanga.nakshatra}`, lang)} sub={`${t('panchanga.pada', lang)} ${panchanga.nakshatraPada}`} />
        <PanchangaCard label={t('panchanga.yoga', lang)}      value={t(`yoga.${panchanga.yoga}`, lang)} highlight={panchanga.auspiciousYoga} />
        <PanchangaCard label={t('panchanga.karana', lang)}    value={t(`karana.${panchanga.karana}`, lang)} />
        <PanchangaCard label={t('panchanga.sunrise', lang)}   value={panchanga.sunrise} sub={`${t('panchanga.sunset', lang)}: ${panchanga.sunset}`} />
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('panchanga.abhijit', lang)}</span>
          <span className="font-medium">{panchanga.abhijitMuhurta.start} – {panchanga.abhijitMuhurta.end}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('panchanga.rahukalam', lang)}</span>
          <span className="font-medium text-destructive/80">{panchanga.rahukalam.start} – {panchanga.rahukalam.end}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('panchanga.yamagandam', lang)}</span>
          <span className="font-medium text-destructive/60">{panchanga.yamagandam.start} – {panchanga.yamagandam.end}</span>
        </div>
      </div>

      {panchanga.festivals.length > 0 && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-xs text-primary font-medium mb-1">{t('panchanga.festivals', lang)}</p>
          <p className="text-sm">{panchanga.festivals.join(', ')}</p>
        </div>
      )}

      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground mb-1">
          {t('panchanga.deity', lang)}: <strong>{panchanga.deityOfDay}</strong>
        </p>
        <p className="text-sm italic">{panchanga.spiritualMessage}</p>
      </div>
    </section>
  );
}

function PanchangaCard({
  label, value, sub, highlight,
}: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? 'border-primary/50 bg-primary/5' : 'bg-card'}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-sm leading-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function PanchangaSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-3 h-16 skeleton" />
      ))}
    </div>
  );
}
