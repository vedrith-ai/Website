// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Admin API Authorization  [RC1]
//
// Two-layer defence:
//   Layer 1: middleware.ts — blocks all /api/v1/admin/* at the edge
//   Layer 2: requireAdmin() — server-side re-check inside each route handler
//
// Both layers check the same HttpOnly session cookie.
// VEDRITH_ADMIN_TOKEN is NEVER sent to the client.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'vedrith_admin_session'

function sessionValue(token: string): string {
  let h = 0
  for (let i = 0; i < token.length; i++) h = ((h << 5) - h + token.charCodeAt(i)) | 0
  return `vadmin_${Math.abs(h).toString(36)}`
}

export type AdminAuthResult = { ok: true } | { ok: false; response: NextResponse }

export async function requireAdmin(req: NextRequest): Promise<AdminAuthResult> {
  const adminToken = process.env.VEDRITH_ADMIN_TOKEN
  if (!adminToken) {
    return { ok: false, response: NextResponse.json({ error: 'Admin panel not configured.' }, { status: 503 }) }
  }

  const session = req.cookies.get(COOKIE_NAME)?.value
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) }
  }

  if (session !== sessionValue(adminToken)) {
    return { ok: false, response: NextResponse.json({ error: 'Invalid session.' }, { status: 403 }) }
  }

  return { ok: true }
}
