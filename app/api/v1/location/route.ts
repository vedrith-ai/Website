import { NextRequest, NextResponse } from 'next/server';
import type { LocationData } from '@/src/types';

/**
 * /api/v1/location
 * Server-side IP geolocation using Vercel's automatic geo headers.
 * No third-party network calls — all via Vercel Edge infrastructure.
 * Falls back to null so the client can use its own fallback chain.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Vercel injects these headers automatically on Edge Network
  const lat      = req.headers.get('x-vercel-ip-latitude');
  const lon      = req.headers.get('x-vercel-ip-longitude');
  const city     = req.headers.get('x-vercel-ip-city')        ?? '';
  const region   = req.headers.get('x-vercel-ip-country-region') ?? '';
  const country  = req.headers.get('x-vercel-ip-country')    ?? 'IN';
  const timezone = req.headers.get('x-vercel-ip-timezone')   ?? 'Asia/Kolkata';

  if (lat && lon) {
    const data: LocationData & { source: string } = {
      city:      decodeURIComponent(city),
      state:     decodeURIComponent(region),
      country:   country === 'IN' ? 'India' : country,
      latitude:  parseFloat(lat),
      longitude: parseFloat(lon),
      timezone,
      source:    'ip',
    };
    return NextResponse.json({ success: true, data }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  // Local dev or headers unavailable — return null so client uses fallback
  return NextResponse.json({ success: true, data: null }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
