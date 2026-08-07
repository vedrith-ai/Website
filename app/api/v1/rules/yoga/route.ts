// GET /api/v1/rules/yoga?key=Siddha&lang=en
import { NextRequest, NextResponse } from 'next/server'
import { explainElement } from '@/lib/rules/explanation'
import { getRulesForElement, RULES_ENGINE_VERSION } from '@/lib/rules/engine'

export async function GET(request: NextRequest) {
  try {
    const p    = request.nextUrl.searchParams
    const key  = p.get('key')?.trim()
    const lang = p.get('lang') === 'kn' ? 'kn' : 'en' as const
    const useAI = p.get('ai') !== 'false'

    if (!key) {
      return NextResponse.json({
        success: false,
        error: { code: 'MISSING_KEY', message: 'key parameter required (e.g. ?key=Siddha)' }
      }, { status: 400 })
    }

    const result = await explainElement('yoga', key, { lang, useAI })
    if (!result) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Yoga "${key}" not found` }
      }, { status: 404 })
    }

    const applicableRules = getRulesForElement('yoga', key)

    return NextResponse.json({
      success: true,
      data: {
        key,
        explanation:  result.explanation,
        aiNarrative:  result.aiNarrative,
        aiUsed:       result.aiUsed,
        applicableRules: applicableRules.map(r => ({
          id: r.id, category: r.category, recommendation: r.recommendation,
          reason: lang === 'kn' ? r.reason.kn : r.reason.en, confidence: r.confidence,
        })),
      },
      meta: {
        request_id: crypto.randomUUID(), computed_at: new Date().toISOString(),
        cache_hit: false, rules_version: RULES_ENGINE_VERSION,
        engine: 'VedRith Traditional Rules Engine V1',
      },
    })
  } catch (err) {
    console.error('[/api/v1/rules/yoga]', err)
    return NextResponse.json({
      success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    }, { status: 500 })
  }
}
