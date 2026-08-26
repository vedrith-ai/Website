import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAdminToken, verifyAdminToken, extractAdminToken, ADMIN_SESSION_COOKIE } from '@/src/lib/auth/hmac';
import type { ApiResponse } from '@/src/types';

const loginSchema = z.object({ token: z.string().min(1) });

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 8 * 60 * 60,
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ expiresIn: number }>>> {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Token required', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const adminSecret = process.env.VEDRITH_ADMIN_TOKEN ?? '';
    if (!adminSecret) {
      return NextResponse.json({ success: false, error: 'Admin not configured', code: 'NOT_CONFIGURED' }, { status: 503 });
    }

    if (parsed.data.token.length !== adminSecret.length) {
      return NextResponse.json({ success: false, error: 'Invalid credentials', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const crypto = await import('node:crypto');
    const a = Buffer.from(parsed.data.token);
    const b = Buffer.from(adminSecret);
    if (!crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ success: false, error: 'Invalid credentials', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const sessionToken = generateAdminToken(Date.now());
    const response = NextResponse.json({ success: true, data: { expiresIn: 8 * 60 * 60 } });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, cookieOptions());
    return response;
  } catch (err) {
    console.error('[admin/auth POST]', err);
    return NextResponse.json({ success: false, error: 'Server error', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<{ valid: boolean }>>> {
  const token = extractAdminToken(req);
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ success: false, error: 'Invalid or expired session', code: 'UNAUTHORIZED' }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: { valid: true } });
}

export async function DELETE(): Promise<NextResponse<ApiResponse<{ loggedOut: boolean }>>> {
  const response = NextResponse.json({ success: true, data: { loggedOut: true } });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { ...cookieOptions(), maxAge: 0 });
  return response;
}
