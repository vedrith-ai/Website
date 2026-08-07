// GET /api/v1/rules/nakshatra?key=Rohini&lang=en&region=Karnataka
import { NextRequest, NextResponse } from 'next/server'
import { explainElement } from '@/lib/rules/explanation'
import { getRulesForElement, RULES_ENGINE_VERSION } from '@/lib/rules/engine'
import { parseRegion } from '@/lib/rules/regional'

export async function GET(request: NextRequest) {
  try {
    const p      = request.nextUrl.searchParams
    const key    = p.get('key')?.trim()
    const lang   = p.get('lang') === 'kn' ? 'kn' : 'en' as const
    const region = parseRegion(p.get('region'))
    const useAI  = p.get('ai') !== 'false'

    if (!key) {
      return NextResponse.json({
        success: false,
        error: { code: 'MISSING_KEY', message: 'key parameter required (e.g. ?key=Rohini)' }
      }, { status: 400 })
    }

    const result = await explainElement('nakshatra', key, { lang, useAI })
    if (!result) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Nakshatra "${key}" not found` }
      }, { status: 404 })
    }

    const applicableRules = getRulesForElement('nakshatra', key)

    return NextResponse.json({
      success: true,
      data: {
        key,
        explanation:  result.explanation,
        aiNarrative:  result.aiNarrative,
        aiUsed:       result.aiUsed,
        applicableRules: applicableRules.map(r => ({
          id: r.id, category: r.category, recommendation: r.recommendation,
          reason: lang === 'kn' ? r.reason.kn : r.reason.en,
          confidence: r.confidence, priority: r.priority,
        })),
        region,
      },
      meta: {
        request_id: crypto.randomUUID(), computed_at: new Date().toISOString(),
        cache_hit: false, rules_version: RULES_ENGINE_VERSION,
        engine: 'VedRith Traditional Rules Engine V1',
      },
    })
  } catch (err) {
    console.error('[/api/v1/rules/nakshatra]', err)
    return NextResponse.json({
      success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    }, { status: 500 })
  }
}
