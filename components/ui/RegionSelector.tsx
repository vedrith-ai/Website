'use client';

import { useState, useEffect } from 'react';
import { getRegionKey, setRegionKey, ALL_REGIONS, regionLabel } from '@/src/lib/utils/region';
import { t } from '@/src/i18n/ui';
import type { Lang, Region } from '@/src/types';

interface Props { lang: Lang; onChange?: (region: Region) => void }

export function RegionSelector({ lang, onChange }: Props) {
  const [selected, setSelected] = useState<Region>('KARNATAKA');

  useEffect(() => { setSelected(getRegionKey()); }, []);

  const handleChange = (r: Region) => {
    setSelected(r);
    setRegionKey(r);
    onChange?.(r);
    // Notify components listening for region changes
    window.dispatchEvent(new CustomEvent('vedrith:regionChange', { detail: { region: r } }));
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="region-select" className="text-sm text-muted-foreground whitespace-nowrap">
        {t('common.region', lang)}:
      </label>
      <select
        id="region-select"
        value={selected}
        onChange={e => handleChange(e.target.value as Region)}
        className="rounded-md border bg-background px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
      >
        {ALL_REGIONS.map(r => (
          <option key={r} value={r}>{regionLabel(r)}</option>
        ))}
      </select>
    </div>
  );
}
