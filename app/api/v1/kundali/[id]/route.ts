export const runtime     = 'nodejs'
export const maxDuration = 30

import { type NextRequest, NextResponse } from 'next/server'
import { getKundaliRepository }     from '@/lib/db'
import type { ApiResponse }         from '@/lib/types/panchanga'
import type { KundaliChartRecord }  from '@/lib/types/kundali-chart'

function reqId() { return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}` }

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) return NextResponse.json({ success: false, error: { code: 'INVALID_QUERY', message: 'Chart id is required.' } } as ApiResponse<never>, { status: 400 })

  try {
    const record = await getKundaliRepository().getById(id)
    if (!record) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: `No chart found with id "${id}".` } } as ApiResponse<never>, { status: 404 })
    return NextResponse.json({ success: true, data: record, meta: { request_id: reqId(), computed_at: record.chart.computedAt, cache_hit: false } } as ApiResponse<KundaliChartRecord>, { status: 200, headers: { 'Cache-Control': 'private, max-age=3600' } })
  } catch (error) {
    console.error('[kundali/id]', error)
    return NextResponse.json({ success: false, error: { code: 'COMPUTATION_ERROR', message: 'An unexpected error occurred.' } } as ApiResponse<never>, { status: 500 })
  }
}
