import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAdminToken, verifyAdminToken, extractBearerToken } from '@/src/lib/auth/hmac';
import type { ApiResponse } from '@/src/types';

const loginSchema = z.object({
  token: z.string().min(1),
});

// POST /api/v1/admin/auth — login
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ sessionToken: string; expiresIn: number }>>> {
  try {
    const body   = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Token required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const ADMIN_TOKEN = process.env.VEDRITH_ADMIN_TOKEN ?? '';
    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Admin not configured', code: 'NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    // Constant-time comparison
    const a = Buffer.from(parsed.data.token.padEnd(128, '\0'));
    const b = Buffer.from(ADMIN_TOKEN.padEnd(128, '\0'));
    let diff = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) diff |= a[i] ^ b[i];
    if (diff !== 0 || parsed.data.token.length !== ADMIN_TOKEN.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const sessionToken = generateAdminToken(Date.now());
    return NextResponse.json({
      success: true,
      data: { sessionToken, expiresIn: 8 * 60 * 60 },
    });
  } catch (err) {
    console.error('[admin/auth POST]', err);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// GET /api/v1/admin/auth — verify session
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<{ valid: boolean }>>> {
  const bearer = extractBearerToken(req.headers.get('authorization'));
  if (!bearer) {
    return NextResponse.json(
      { success: false, error: 'No token', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
  const valid = verifyAdminToken(bearer);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired session', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
  return NextResponse.json({ success: true, data: { valid: true } });
}
