import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminToken, extractAdminToken } from '@/src/lib/auth/hmac';
import { createServiceClient, isSupabaseConfigured } from '@/src/lib/supabase/server';
import type { ApiResponse } from '@/src/types';

const schema = z.object({
  title:    z.string().min(1).max(200),
  body:     z.string().min(1).max(1000),
  lang:     z.enum(['en', 'kn', 'both']).default('both'),
  region:   z.enum(['KARNATAKA','ANDHRA','TAMIL_NADU','KERALA','MAHARASHTRA','NATIONAL']).optional(),
  schedule: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  const token = extractAdminToken(req);
  if (!token || !verifyAdminToken(token)) {
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
        { success: false, error: 'Invalid notification data', code: 'VALIDATION_ERROR' },
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
      .from('notifications')
      .insert({
        ...parsed.data,
        created_at: new Date().toISOString(),
        sent: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[admin/notify]', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create notification', code: 'DB_INSERT_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { id: data.id } });
  } catch (err) {
    console.error('[admin/notify POST]', err);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
