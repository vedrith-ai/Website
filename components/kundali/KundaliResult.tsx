'use client';

import { t } from '@/src/i18n/ui';
import type { Lang, KundaliResponse } from '@/src/types';

interface Props { data: KundaliResponse; lang: Lang }

export function KundaliResult({ data, lang }: Props) {
  const columns = [
    { key: 'col.planet',    render: (p: KundaliResponse['planets'][0]) => t(`graha.${p.planet}`, lang) },
    { key: 'col.rashi',     render: (p: KundaliResponse['planets'][0]) => t(`rashi.${p.rashi}`, lang) },
    { key: 'col.nakshatra', render: (p: KundaliResponse['planets'][0]) => t(`nakshatra.${p.nakshatra}`, lang) },
    { key: 'col.pada',      render: (p: KundaliResponse['planets'][0]) => String(p.pada) },
    { key: 'col.degree',    render: (p: KundaliResponse['planets'][0]) => `${p.degree.toFixed(2)}°` },
    { key: 'col.house',     render: (p: KundaliResponse['planets'][0]) => String(p.house) },
    { key: 'col.dignity',   render: (p: KundaliResponse['planets'][0]) => t(`kundali.${p.dignity}`, lang) },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-lg border bg-card p-4 space-y-2">
        <h2 className="font-semibold text-lg">{data.name}</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t('kundali.dob', lang)}: </span>
            <span>{data.dob}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('kundali.tob', lang)}: </span>
            <span>{data.tob}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('kundali.pob', lang)}: </span>
            <span>{data.pob}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('kundali.lagna', lang)}: </span>
            <span className="font-medium">{t(`rashi.${data.lagna}`, lang)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('kundali.nakshatraLagna', lang)}: </span>
            <span>{t(`nakshatra.${data.nakshatraLagna}`, lang)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t('kundali.dasha', lang)}: </span>
            <span>{t(`graha.${data.dashaBalance.planet}`, lang)} ({data.dashaBalance.yearsRemaining} {t('dasha.years', lang)})</span>
          </div>
        </div>
      </div>

      {/* Yogas */}
      {data.yogas.length > 0 && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-xs font-medium text-primary mb-2">{t('kundali.yogas', lang)}</p>
          <div className="flex flex-wrap gap-2">
            {data.yogas.map(y => (
              <span key={y} className="text-xs rounded-full bg-primary/10 px-3 py-1">{y}</span>
            ))}
          </div>
        </div>
      )}

      {/* Planets table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                    {t(col.key, lang)}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  {t('col.retrograde', lang)}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.planets.map((planet, i) => (
                <tr key={planet.planet} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                  {columns.map(col => (
                    <td key={col.key} className="px-3 py-2">{col.render(planet)}</td>
                  ))}
                  <td className="px-3 py-2">
                    {planet.isRetrograde && <span className="text-xs text-destructive font-medium">R</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Houses */}
      <div>
        <h3 className="font-medium mb-3">{t('kundali.houses', lang)}</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {data.houses.map(house => (
            <div key={house.house} className="rounded border bg-card p-2 text-center">
              <p className="text-xs text-muted-foreground">{t('col.house', lang)} {house.house}</p>
              <p className="text-sm font-medium">{t(`rashi.${house.rashi}`, lang)}</p>
              {house.planets.length > 0 && (
                <p className="text-xs text-primary mt-0.5">
                  {house.planets.map(p => t(`graha.${p}`, lang)).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
