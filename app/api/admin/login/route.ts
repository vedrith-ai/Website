import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME    = 'vedrith_admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 8

function sessionValue(token: string): string {
  let h = 0
  for (let i = 0; i < token.length; i++) h = ((h << 5) - h + token.charCodeAt(i)) | 0
  return `vadmin_${Math.abs(h).toString(36)}`
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    for (let i = 0; i < b.length; i++) void (a.charCodeAt(i % a.length) ^ b.charCodeAt(i))
    return false
  }
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function POST(req: NextRequest) {
  const adminToken = process.env.VEDRITH_ADMIN_TOKEN
  if (!adminToken) {
    return NextResponse.json({ error: 'Admin panel not configured.' }, { status: 503 })
  }
  let body: { token?: string }
  try { body = await req.json() as { token?: string } }
  catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }

  const provided = body.token ?? ''
  if (!timingSafeEqual(provided, adminToken)) {
    await new Promise(r => setTimeout(r, 200 + Math.random() * 100))
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 403 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, sessionValue(adminToken), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  })
  return response
}
