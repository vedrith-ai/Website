// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/panchanga/daily
// Computes a complete daily Panchanga for the given date, location, and region
//
// MANDATORY: Node.js runtime only — ephemeris engine requires Node.js
// ─────────────────────────────────────────────────────────────────────────────

export const runtime    = 'nodejs'
export const maxDuration = 30

import { type NextRequest, NextResponse } from 'next/server'
import { computePanchanga }               from '@/lib/engines/panchanga'
import { parsePanchangaQuery }            from '@/lib/validators/panchanga-query'
import type { ApiResponse, PanchangaResult } from '@/lib/types/panchanga'

// ─────────────────────────────────────────────────────────────────────────────
// In-memory cache stub
// Replace with Vercel KV (Redis) in production as per Architecture §7 / §13
// Cache key: `panchanga:{date}:{region}:{latBucket}:{lngBucket}:{ayanamsha}:{lang}:{calendarSystem}`
// [V1.1] lang/calendarSystem added to the key — they affect displayName/masa
// output, so two requests differing only in these fields must NOT collide.
// ─────────────────────────────────────────────────────────────────────────────
const CACHE = new Map<string, { result: PanchangaResult; expiresAt: number }>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000   // 24 hours

function getCacheKey(
  date: string, region: string,
  lat: number, lng: number, ayanamsha: string,
  lang: string, calendarSystem: string   // [V1.1]
): string {
  // Bucket lat/lng to 0.5° for shared cache (Panchanga varies by area, not exact point)
  const latBucket = Math.round(lat  * 2) / 2
  const lngBucket = Math.round(lng  * 2) / 2
  return `panchanga:${date}:${region}:${latBucket}:${lngBucket}:${ayanamsha}:${lang}:${calendarSystem}`
}

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // ── 1. Parse query parameters ──────────────────────────────────────────
    const searchParams = request.nextUrl.searchParams
    const raw: Record<string, string | undefined> = {}
    searchParams.forEach((value, key) => { raw[key] = value })

    // ── 2. Validate ────────────────────────────────────────────────────────
    const parsed = parsePanchangaQuery(raw)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code:    'INVALID_QUERY',
          message: firstError.message,
          field:   firstError.path.join('.'),
        },
      }
      return NextResponse.json(response, { status: 422 })
    }

    const query = parsed.data

    // ── 3. Check cache ─────────────────────────────────────────────────────
    const cacheKey = getCacheKey(
      query.date, query.region, query.lat, query.lng, query.ayanamsha,
      query.lang, query.calendarSystem   // [V1.1]
    )
    const cached = CACHE.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      const response: ApiResponse<PanchangaResult> = {
        success: true,
        data:    cached.result,
        meta: { request_id: requestId, computed_at: cached.result.computedAt, cache_hit: true },
      }
      return NextResponse.json(response, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'X-Cache':       'HIT',
        },
      })
    }

    // ── 4. Compute Panchanga ───────────────────────────────────────────────
    const result = await computePanchanga(query)

    // ── 5. Store in cache ──────────────────────────────────────────────────
    CACHE.set(cacheKey, { result, expiresAt: Date.now() + CACHE_TTL_MS })

    // Prune cache if it grows too large (> 500 entries in serverless context)
    if (CACHE.size > 500) {
      const now = Date.now()
      for (const [key, val] of CACHE.entries()) {
        if (val.expiresAt <= now) CACHE.delete(key)
      }
    }

    // ── 6. Return response ─────────────────────────────────────────────────
    const response: ApiResponse<PanchangaResult> = {
      success: true,
      data:    result,
      meta: { request_id: requestId, computed_at: result.computedAt, cache_hit: false },
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Cache':       'MISS',
      },
    })

  } catch (error) {
    console.error('[panchanga/daily] Computation error:', error)

    const response: ApiResponse<never> = {
      success: false,
      error: {
        code:    'COMPUTATION_ERROR',
        message: 'An error occurred during Panchanga calculation. Please try again.',
      },
    }
    return NextResponse.json(response, { status: 500 })
  }
}
