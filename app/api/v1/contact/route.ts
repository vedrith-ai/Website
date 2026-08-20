import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient, isSupabaseConfigured } from '@/src/lib/supabase/server';
import type { ApiResponse } from '@/src/types';

const schema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const isProd = process.env.NODE_ENV === 'production';

    if (!isSupabaseConfigured()) {
      if (!isProd) {
        // Development: log and return success so devs can test forms
        console.warn('[contact] Supabase not configured — dev mode, logging only:', parsed.data);
        return NextResponse.json({ success: true, data: { id: 'dev-' + Date.now() } });
      }
      // Production: Supabase is required
      return NextResponse.json(
        { success: false, error: 'Message service unavailable', code: 'SERVICE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed', code: 'DB_ERROR' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name:    parsed.data.name,
        email:   parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        created_at: new Date().toISOString(),
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[contact] Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save message', code: 'DB_INSERT_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { id: data.id } });
  } catch (err) {
    console.error('[contact/route]', err);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
