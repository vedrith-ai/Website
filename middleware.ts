// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Next.js Middleware  [RC1]
//
// Protects all /admin/* routes and /api/v1/admin/* routes.
// Reads an HttpOnly session cookie set by /api/admin/login — the
// VEDRITH_ADMIN_TOKEN is NEVER sent to the browser.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SESSION_COOKIE = 'vedrith_admin_session'

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/v1/admin')
}

function isLoginRoute(pathname: string): boolean {
  return pathname === '/api/admin/login' || pathname === '/api/admin/logout'
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Login/logout routes pass through (they create/destroy the session)
  if (isLoginRoute(pathname)) return NextResponse.next()

  // Not an admin route — pass through
  if (!isAdminRoute(pathname)) return NextResponse.next()

  // Check for valid session cookie
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)
  if (!session?.value) {
    // API routes → 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Admin authentication required. POST /api/admin/login with { token }.' },
        { status: 401 },
      )
    }
    // Admin UI pages → redirect to login page
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Session exists — verify it matches the expected token hash
  // (Token itself is not stored — only a hash is in the cookie)
  const adminToken = process.env.VEDRITH_ADMIN_TOKEN
  if (!adminToken) {
    return NextResponse.json(
      { error: 'Admin panel is not configured on this server.' },
      { status: 503 },
    )
  }

  // Simple validation: session value must match expected value
  // (In production with Supabase, replace with JWT claim check)
  if (session.value !== expectedSessionValue(adminToken)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid admin session.' }, { status: 403 })
    }
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

/** Derives a session identifier from the admin token. Not the token itself. */
function expectedSessionValue(token: string): string {
  // Simple deterministic hash — stable across restarts, not the raw token
  let h = 0
  for (let i = 0; i < token.length; i++) {
    h = ((h << 5) - h + token.charCodeAt(i)) | 0
  }
  return `vadmin_${Math.abs(h).toString(36)}`
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/v1/admin/:path*',
    '/api/admin/:path*',
  ],
}
