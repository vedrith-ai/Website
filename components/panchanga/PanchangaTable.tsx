import { t } from '@/src/i18n/ui';
import type { Lang, PanchangaResponse } from '@/src/types';

interface Props { data: PanchangaResponse; lang: Lang }

export function PanchangaTable({ data, lang }: Props) {
  const rows = [
    { label: t('panchanga.vara',      lang), value: t(`vara.${data.vara}`, lang) },
    { label: t('panchanga.tithi',     lang), value: `${t(`tithi.${data.tithi}`, lang)} (${t(`common.${data.tithiPaksha}paksha`, lang)})` },
    { label: t('panchanga.nakshatra', lang), value: `${t(`nakshatra.${data.nakshatra}`, lang)} — ${t('panchanga.pada', lang)} ${data.nakshatraPada}` },
    { label: t('panchanga.yoga',      lang), value: t(`yoga.${data.yoga}`, lang) },
    { label: t('panchanga.karana',    lang), value: t(`karana.${data.karana}`, lang) },
    { label: t('panchanga.sunrise',   lang), value: data.sunrise },
    { label: t('panchanga.sunset',    lang), value: data.sunset },
    { label: t('panchanga.moonrise',  lang), value: data.moonrise },
    { label: t('panchanga.moonset',   lang), value: data.moonset },
    { label: t('panchanga.abhijit',   lang), value: `${data.abhijitMuhurta.start} – ${data.abhijitMuhurta.end} (${data.abhijitMuhurta.durationMinutes} ${t('panchanga.minutes', lang)})` },
    { label: t('panchanga.rahukalam', lang), value: `${data.rahukalam.start} – ${data.rahukalam.end}`, warn: true },
    { label: t('panchanga.yamagandam', lang), value: `${data.yamagandam.start} – ${data.yamagandam.end}`, warn: true },
    { label: t('panchanga.gulikakalam', lang), value: `${data.gulikakalam.start} – ${data.gulikakalam.end}`, warn: true },
  ];

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
              <td className="px-4 py-2.5 text-muted-foreground font-medium w-40 text-xs">{row.label}</td>
              <td className={`px-4 py-2.5 font-medium ${row.warn ? 'text-destructive/80' : ''}`}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
