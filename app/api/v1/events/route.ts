import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, extractAdminToken } from '@/src/lib/auth/hmac';
import { createServiceClient, isSupabaseConfigured } from '@/src/lib/supabase/server';
// Public GET — returns published events
export async function GET(req: NextRequest): Promise<NextResponse> {
  const adminToken = extractAdminToken(req);
  const isAdmin  = adminToken ? verifyAdminToken(adminToken) : false;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, data: [] });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'DB unavailable', code: 'DB_ERROR' },
      { status: 503 }
    );
  }

  let query = supabase
    .from('events')
    .select('id, title, description, date, category, region, lang, published, created_at')
    .order('date', { ascending: true })
    .limit(50);

  // Non-admin sees only published events
  if (!isAdmin) query = query.eq('published', true);

  const { data, error } = await query;

  if (error) {
    console.error('[events GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events', code: 'DB_ERROR' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: data ?? [] });
}
