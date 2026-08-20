import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateKundali } from '@/src/lib/kundali/calculator';
import type { ApiResponse, KundaliResponse } from '@/src/types';

const schema = z.object({
  name:      z.string().min(1).max(100),
  dob:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tob:       z.string().regex(/^\d{2}:\d{2}$/),
  pob:       z.string().min(1).max(200),
  latitude:  z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone:  z.string().default('Asia/Kolkata'),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<KundaliResponse>>> {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    const result = calculateKundali(parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('[kundali/route]', err);
    return NextResponse.json(
      { success: false, error: 'Calculation error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
