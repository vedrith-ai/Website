// ─────────────────────────────────────────────────────────────────────────────
// VedRith — In-Memory Rate Limiter  [RC1]
// Sliding-window rate limiter for public API routes.
// Replace with Redis/Upstash for multi-instance production deployments.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'

interface WindowEntry { count: number; resetAt: number }
const store = new Map<string, WindowEntry>()

export interface RateLimitOptions {
  limit:  number   // max requests per window
  window: number   // window size in seconds
}

/** Returns a 429 response if rate limit exceeded, null if OK. */
export function rateLimit(req: NextRequest, opts: RateLimitOptions): NextResponse | null {
  const key     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now     = Date.now()
  const resetAt = now + opts.window * 1_000
  const entry   = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt })
    return null
  }
  if (entry.count >= opts.limit) {
    return NextResponse.json(
      { error: 'Too many requests — please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1_000)) } },
    )
  }
  entry.count++
  return null
}
