import type { Region } from '@/src/types';

const REGION_STORAGE_KEY = 'vedrith:region';

const REGION_DEFAULTS: Record<string, Region> = {
  'Karnataka':      'KARNATAKA',
  'Andhra Pradesh': 'ANDHRA',
  'Telangana':      'ANDHRA',
  'Tamil Nadu':     'TAMIL_NADU',
  'Kerala':         'KERALA',
  'Maharashtra':    'MAHARASHTRA',
  'Goa':            'MAHARASHTRA',
};

export const ALL_REGIONS: Region[] = [
  'KARNATAKA',
  'ANDHRA',
  'TAMIL_NADU',
  'KERALA',
  'MAHARASHTRA',
  'NATIONAL',
];

/** Returns the user's selected region from localStorage, defaulting to KARNATAKA */
export function getRegionKey(): Region {
  if (typeof window === 'undefined') return 'KARNATAKA';
  try {
    const stored = window.localStorage.getItem(REGION_STORAGE_KEY);
    if (stored && ALL_REGIONS.includes(stored as Region)) {
      return stored as Region;
    }
  } catch {
    // localStorage unavailable
  }
  return 'KARNATAKA';
}

export function setRegionKey(region: Region): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(REGION_STORAGE_KEY, region);
  } catch {
    // localStorage unavailable
  }
}

export function regionFromState(state: string): Region {
  return REGION_DEFAULTS[state] ?? 'NATIONAL';
}

export function regionLabel(region: Region): string {
  const map: Record<Region, string> = {
    KARNATAKA:   'Karnataka',
    ANDHRA:      'Andhra Pradesh',
    TAMIL_NADU:  'Tamil Nadu',
    KERALA:      'Kerala',
    MAHARASHTRA: 'Maharashtra',
    NATIONAL:    'National (India)',
  };
  return map[region];
}
