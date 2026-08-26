export const runtime     = 'nodejs'
export const maxDuration = 30

import { type NextRequest, NextResponse } from 'next/server'
import { parseKundaliGenerateBody } from '@/lib/validators/kundali-generate-query'
import { buildKundaliChart }        from '@/lib/engines/kundali-chart'
import { getKundaliRepository }     from '@/lib/db'
import type { ApiResponse }         from '@/lib/types/panchanga'
import type { KundaliChartRecord }  from '@/lib/types/kundali-chart'

function reqId() { return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}` }

export async function POST(request: NextRequest) {
  const requestId = reqId()
  try {
    let rawBody: unknown
    try { rawBody = await request.json() }
    catch { return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } } as ApiResponse<never>, { status: 400 }) }

    const parsed = parseKundaliGenerateBody(rawBody)
    if (!parsed.success) {
      const e = parsed.error.errors[0]
      return NextResponse.json({ success: false, error: { code: 'INVALID_QUERY', message: e.message, field: e.path.join('.') } } as ApiResponse<never>, { status: 422 })
    }

    const chartResult = await buildKundaliChart(parsed.data)
    if (!chartResult.success) {
      return NextResponse.json({ success: false, error: { code: chartResult.error.code, message: chartResult.error.message, field: chartResult.error.field } } as ApiResponse<never>, { status: 422 })
    }

    const stored = await getKundaliRepository().create(chartResult.data)
    return NextResponse.json({ success: true, data: stored, meta: { request_id: requestId, computed_at: stored.chart.computedAt, cache_hit: false } } as ApiResponse<KundaliChartRecord>, { status: 201 })
  } catch (error) {
    console.error('[kundali/generate]', error)
    return NextResponse.json({ success: false, error: { code: 'COMPUTATION_ERROR', message: 'An unexpected error occurred.' } } as ApiResponse<never>, { status: 500 })
  }
}
