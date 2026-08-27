import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculatePanchanga } from '@/src/lib/panchanga/engine';
import type { ApiResponse, PanchangaResponse } from '@/src/types';

const schema = z.object({
  date:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  latitude:  z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone:  z.string().min(1),
  region:    z.enum(['KARNATAKA','ANDHRA','TAMIL_NADU','KERALA','MAHARASHTRA','NATIONAL'])
              .default('KARNATAKA'),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<PanchangaResponse>>> {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    const result = calculatePanchanga(parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('[panchanga/route]', err);
    return NextResponse.json(
      { success: false, error: 'Calculation error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<PanchangaResponse>>> {
  const sp        = req.nextUrl.searchParams;
  const date      = sp.get('date');
  const latitude  = parseFloat(sp.get('latitude') ?? '');
  const longitude = parseFloat(sp.get('longitude') ?? '');
  const timezone  = sp.get('timezone') ?? 'Asia/Kolkata';
  const region    = sp.get('region') ?? 'KARNATAKA';

  const parsed = schema.safeParse({ date, latitude, longitude, timezone, region });
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid query params', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }
  try {
    const result = calculatePanchanga(parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('[panchanga/route GET]', err);
    return NextResponse.json(
      { success: false, error: 'Calculation error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
