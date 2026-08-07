// GET /api/v1/rules/karana?key=Bava&lang=en
import { NextRequest, NextResponse } from 'next/server'
import { explainElement } from '@/lib/rules/explanation'
import { RULES_ENGINE_VERSION } from '@/lib/rules/engine'

export async function GET(request: NextRequest) {
  try {
    const p    = request.nextUrl.searchParams
    const key  = p.get('key')?.trim()
    const lang = p.get('lang') === 'kn' ? 'kn' : 'en' as const
    const useAI = p.get('ai') !== 'false'

    if (!key) {
      return NextResponse.json({
        success: false,
        error: { code: 'MISSING_KEY', message: 'key parameter required (e.g. ?key=Bava)' }
      }, { status: 400 })
    }

    const result = await explainElement('karana', key, { lang, useAI })
    if (!result) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Karana "${key}" not found in knowledge base` }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { key, explanation: result.explanation, aiNarrative: result.aiNarrative, aiUsed: result.aiUsed },
      meta: {
        request_id: crypto.randomUUID(), computed_at: new Date().toISOString(),
        cache_hit: false, rules_version: RULES_ENGINE_VERSION,
        engine: 'VedRith Traditional Rules Engine V1',
      },
    })
  } catch (err) {
    console.error('[/api/v1/rules/karana]', err)
    return NextResponse.json({
      success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    }, { status: 500 })
  }
}
