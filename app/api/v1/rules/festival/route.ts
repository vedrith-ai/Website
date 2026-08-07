// GET /api/v1/rules/festival
// Returns festivals/vratas for a given Panchanga day using rule-based generation.
// No hardcoded dates — every festival is derived from Tithi, Nakshatra, Vara, Masa.
//
// Query params:
//   tithi        string  (required)
//   paksha       string  Shukla|Krishna (required)
//   nakshatra    string  (required)
//   vara         number  0=Sun … 6=Sat (required)
//   masa         string  lunar month (required)
//   lang         string  en|kn (default: en)
//   region       string  Karnataka|All|... (default: Karnataka)

import { NextRequest, NextResponse } from 'next/server'
import {
  generateFestivalsForDay,
  isEkadashi,
  isPradosha,
} from '@/lib/engines/festivals/index'
import type { FestivalContext, RegionalProfile } from '@/lib/engines/festivals/index'
import { parseRegion } from '@/lib/rules/regional'
import { RULES_ENGINE_VERSION } from '@/lib/rules/engine'

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams

    const tithi     = p.get('tithi')?.trim()
    const paksha    = p.get('paksha')?.trim()
    const nakshatra = p.get('nakshatra')?.trim()
    const varaStr   = p.get('vara')
    const masa      = p.get('masa')?.trim()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _lang     = p.get('lang') === 'kn' ? 'kn' : 'en'
    const region    = parseRegion(p.get('region')) as RegionalProfile

    // Validate required params
    if (!tithi)     return NextResponse.json({ success: false, error: { code: 'MISSING_PARAM', message: 'tithi is required' } }, { status: 400 })
    if (!paksha || !['Shukla','Krishna'].includes(paksha)) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_PARAM', message: 'paksha must be Shukla or Krishna' } }, { status: 400 })
    }
    if (!nakshatra) return NextResponse.json({ success: false, error: { code: 'MISSING_PARAM', message: 'nakshatra is required' } }, { status: 400 })
    if (!masa)      return NextResponse.json({ success: false, error: { code: 'MISSING_PARAM', message: 'masa (lunar month) is required' } }, { status: 400 })

    const weekday = varaStr !== null ? parseInt(varaStr, 10) : -1
    if (weekday < 0 || weekday > 6 || isNaN(weekday)) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_PARAM', message: 'vara must be 0 (Sunday) through 6 (Saturday)' } }, { status: 400 })
    }

    // Extract tithi number from key (Pratipada=1 … Chaturdashi=14, Purnima=15, Amavasya=15)
    const TITHI_NUMBERS: Record<string, number> = {
      Pratipada:1,Dvitiya:2,Tritiya:3,Chaturthi:4,Panchami:5,Shashthi:6,
      Saptami:7,Ashtami:8,Navami:9,Dashami:10,Ekadashi:11,Dwadashi:12,
      Trayodashi:13,Chaturdashi:14,Purnima:15,Amavasya:15,
    }
    const tithiNumber = TITHI_NUMBERS[tithi] ?? 0

    const ctx: FestivalContext = {
      lunarMonth:  masa,
      paksha:      paksha as 'Shukla' | 'Krishna',
      tithiNumber,
      tithiKey:    tithi,
      nakshatra,
      weekday,
      region,
    }

    const festivals = generateFestivalsForDay(ctx, region)

    // Build observance flags
    const flags = {
      isEkadashi:       isEkadashi({ tithiKey: tithi }),
      isPradosha:       isPradosha({ tithiKey: tithi }),
      isAmavasya:       tithi === 'Amavasya',
      isPurnima:        tithi === 'Purnima',
      isSankashtiChaturthi: paksha === 'Krishna' && tithi === 'Chaturthi',
    }

    return NextResponse.json({
      success: true,
      data: {
        context: { tithi, paksha, nakshatra, masa, weekday, region },
        festivals,
        festivalCount: festivals.length,
        observanceFlags: flags,
        attribution: {
          source: 'Rule-based generation. No hardcoded dates. Derived from Tithi, Nakshatra, Vara, and Masa combinations per Dharma Sindhu, Nirnaya Sindhu, and classical Panchanga tradition.',
          engine: 'VedRith Festival Engine V1',
        },
      },
      meta: {
        request_id:    crypto.randomUUID(),
        computed_at:   new Date().toISOString(),
        cache_hit:     false,
        rules_version: RULES_ENGINE_VERSION,
        engine:        'VedRith Traditional Rules Engine V1',
      },
    })
  } catch (err) {
    console.error('[/api/v1/rules/festival]', err)
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    }, { status: 500 })
  }
}
