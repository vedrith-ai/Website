import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminToken, extractAdminToken } from '@/src/lib/auth/hmac';
import { createServiceClient, isSupabaseConfigured } from '@/src/lib/supabase/server';
import type { ApiResponse } from '@/src/types';

const schema = z.object({
  title:       z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category:    z.enum(['festival','muhurta','alert','general']),
  region:      z.enum(['KARNATAKA','ANDHRA','TAMIL_NADU','KERALA','MAHARASHTRA','NATIONAL']).optional(),
  lang:        z.enum(['en','kn']).optional(),
});

function isAuthorized(req: NextRequest): boolean {
  const EVENT_SECRET = process.env.VEDRITH_EVENT_SECRET;

  // Path 1 — Event secret header
  const secretHeader = req.headers.get('x-vedrith-event-secret');
  if (EVENT_SECRET && secretHeader) {
    // Constant-time comparison
    const a = Buffer.from(secretHeader.padEnd(64, '\0'));
    const b = Buffer.from(EVENT_SECRET.padEnd(64, '\0'));
    if (a.length === b.length) {
      let diff = 0;
      for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
      if (diff === 0) return true;
    }
  }

  // Path 2 — HMAC admin session token (HttpOnly cookie preferred; bearer accepted for compatibility)
  const token = extractAdminToken(req);
  if (token && verifyAdminToken(token)) return true;

  // Missing or invalid secret — never open
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid event data', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Storage unavailable', code: 'SERVICE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'DB connection failed', code: 'DB_ERROR' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...parsed.data,
        created_at: new Date().toISOString(),
        published:  true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[events/publish] Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to publish event', code: 'DB_INSERT_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { id: data.id } });
  } catch (err) {
    console.error('[events/publish/route]', err);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
