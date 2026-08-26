import type { LocationData } from '@/src/types';

export type { LocationData };

const STORAGE_KEY = 'vedrith:location';

export const FALLBACK_LOCATION: LocationData = {
  city:      'Bengaluru',
  state:     'Karnataka',
  country:   'India',
  latitude:  12.9716,
  longitude: 77.5946,
  timezone:  'Asia/Kolkata',
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

export function getStoredLocation(): (LocationData & { source: string }) | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.latitude && parsed?.longitude) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setStoredLocation(loc: LocationData & { source?: string }): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // Storage unavailable
  }
}

// ─── GPS detection ────────────────────────────────────────────────────────────

export async function detectGPS(): Promise<(LocationData & { source: 'gps' }) | null> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) return null;
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        city:      '',
        state:     '',
        country:   'India',
        latitude:  Math.round(pos.coords.latitude  * 10000) / 10000,
        longitude: Math.round(pos.coords.longitude * 10000) / 10000,
        timezone:  Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        source:    'gps',
      }),
      () => resolve(null),
      { timeout: 6000, maximumAge: 5 * 60 * 1000 }
    );
  });
}

// ─── IP / network location (via our own API — no third-party CSP needed) ─────

export async function detectIPLocation(): Promise<(LocationData & { source: 'ip' }) | null> {
  try {
    const res = await fetch('/api/v1/location', {
      signal: AbortSignal.timeout(5000),
      cache:  'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data?.latitude) return null;
    return { ...json.data, source: 'ip' as const };
  } catch {
    return null;
  }
}

// ─── Full resolution chain: GPS → IP → saved → fallback ──────────────────────

export async function resolveLocation(): Promise<LocationData & { source: string }> {
  // 1. Saved manual preference always wins.
  const saved = getStoredLocation();
  if (saved && saved.source === 'manual') return saved;

  // 2. Reuse the last detected device/network location before prompting again.
  if (saved && (saved.source === 'gps' || saved.source === 'ip')) return saved;

  // 3. GPS
  const gps = await detectGPS();
  if (gps) {
    setStoredLocation(gps);
    return gps;
  }

  // 4. IP / network location
  const ip = await detectIPLocation();
  if (ip) {
    setStoredLocation(ip);
    return ip;
  }

  // 5. Safe fallback
  return saved ?? { ...FALLBACK_LOCATION, source: 'fallback' };
}
