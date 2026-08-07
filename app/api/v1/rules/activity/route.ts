// GET /api/v1/rules/activity
// POST /api/v1/rules/activity
//
// Evaluate Panchanga inputs against the Traditional Rules Engine
// and return activity recommendations with classical reasoning.
//
// Query / body params:
//   tithi        string  (required)
//   paksha       string  Shukla|Krishna (required)
//   nakshatra    string  (required)
//   yoga         string  (required)
//   karana       string  (required)
//   vara         string  weekday name (required)
//   masa         string  lunar month (optional)
//   lang         string  en|kn (default: en)
//   region       string  Karnataka|All|... (default: Karnataka)
//   activity     string  specific activity (optional — omit for all)
//   explain      boolean include explanations (default: false)

import { NextRequest, NextResponse } from 'next/server'
import { evaluateRules, evaluateActivity } from '@/lib/rules/engine'
import { parseRegion } from '@/lib/rules/regional'
import type { ActivityCategory, RuleEngineInputs, PakshaType, SupportedLanguage, RulesApiMeta } from '@/lib/rules/types'
import { RULES_ENGINE_VERSION } from '@/lib/rules/engine'

function makeMeta(cacheHit = false): RulesApiMeta {
  return {
    request_id:    crypto.randomUUID(),
    computed_at:   new Date().toISOString(),
    cache_hit:     cacheHit,
    rules_version: RULES_ENGINE_VERSION,
    engine:        'VedRith Traditional Rules Engine V1',
  }
}

function parseInputs(params: URLSearchParams | Record<string, string>): RuleEngineInputs | { error: string } {
  const get = (k: string) => (params instanceof URLSearchParams ? params.get(k) : params[k]) ?? ''

  const tithi     = get('tithi').trim()
  const paksha    = get('paksha').trim() as PakshaType
  const nakshatra = get('nakshatra').trim()
  const yoga      = get('yoga').trim()
  const karana    = get('karana').trim()
  const vara      = get('vara').trim()

  if (!tithi)     return { error: 'tithi is required' }
  if (!paksha || !['Shukla','Krishna'].includes(paksha)) return { error: 'paksha must be Shukla or Krishna' }
  if (!nakshatra) return { error: 'nakshatra is required' }
  if (!yoga)      return { error: 'yoga is required' }
  if (!karana)    return { error: 'karana is required' }
  if (!vara)      return { error: 'vara is required' }

  const lang   = get('lang') === 'kn' ? 'kn' : 'en' as SupportedLanguage
  const region = parseRegion(get('region') || 'Karnataka')
  const masa   = get('masa') || undefined

  return { tithi, tithiPaksha: paksha, nakshatra, yoga, karana, vara, masa, lang, region }
}

export async function GET(request: NextRequest) {
  try {
    const params  = request.nextUrl.searchParams
    const inputs  = parseInputs(params)

    if ('error' in inputs) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: inputs.error } },
        { status: 400 }
      )
    }

    const activityParam = params.get('activity')
    const results = activityParam
      ? [evaluateActivity(inputs, activityParam as ActivityCategory)]
      : evaluateRules(inputs)

    return NextResponse.json({
      success: true,
      data: {
        inputs: {
          tithi: inputs.tithi, paksha: inputs.tithiPaksha,
          nakshatra: inputs.nakshatra, yoga: inputs.yoga,
          karana: inputs.karana, vara: inputs.vara,
          lang: inputs.lang, region: inputs.region,
        },
        activities: results,
        summary: {
          suitable:           results.filter(r => r.recommendation === 'Suitable').length,
          moderatelySuitable: results.filter(r => r.recommendation === 'ModeratelySuitable').length,
          avoid:              results.filter(r => r.recommendation === 'Avoid').length,
        },
      },
      meta: makeMeta(),
    })
  } catch (err) {
    console.error('[/api/v1/rules/activity] Error:', err)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const inputs = parseInputs(body as Record<string, string>)

    if ('error' in inputs) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: inputs.error } },
        { status: 400 }
      )
    }

    const activities = body.activities as ActivityCategory[] | undefined
    const results = evaluateRules(inputs, activities ?? [])

    return NextResponse.json({
      success: true,
      data: { inputs, activities: results },
      meta:  makeMeta(),
    })
  } catch (err) {
    console.error('[/api/v1/rules/activity POST] Error:', err)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
