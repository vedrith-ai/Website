// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Share Card Builder  [V1.3]
//
// Converts a PanchangaResult (from the API) into ShareCardData
// without duplicating any calculations — reuses engine output directly.
// ─────────────────────────────────────────────────────────────────────────────

import type { ShareCardData, ShareCardTheme, ShareCardFormat, ShareCardLang } from './types'
import type { PanchangaResult } from '../types/panchanga'

// ── Kannada month names (for display) ────────────────────────────────────────

const PAKSHA_KN: Record<string, string> = {
  SHUKLA: 'ಶುಕ್ಲ',
  KRISHNA: 'ಕೃಷ್ಣ',
  Shukla: 'ಶುಕ್ಲ',
  Krishna: 'ಕೃಷ್ಣ',
}

// ── Build a share card data object from a PanchangaResult ────────────────────

export function buildShareCardData(
  result:       PanchangaResult,
  opts: {
    theme?:  ShareCardTheme
    format?: ShareCardFormat
    lang?:   ShareCardLang
  } = {}
): ShareCardData {
  const theme  = opts.theme  ?? 'traditional'
  const format = opts.format ?? 'square'
  const lang   = opts.lang   ?? (result.lang === 'kn' ? 'kn' : 'en')

  // ── Date display ───────────────────────────────────────────────────────────
  const dateObj = new Date(`${result.date}T12:00:00`)
  const dateDisplay = dateObj.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  // ── Primary festival (if any) ──────────────────────────────────────────────
  const primaryFestival = result.festivals?.[0]

  // ── Tithi Kannada name ─────────────────────────────────────────────────────
  const tithiNameKn  = result.tithi.nameLocal || result.tithi.name
  const pakshaKn     = PAKSHA_KN[result.tithi.paksha] ?? result.tithi.pakshaName

  return {
    date:         result.date,
    dateDisplay,
    locationName: result.location.name,

    tithi: {
      name:     result.tithi.name,
      nameKn:   tithiNameKn,
      paksha:   result.tithi.pakshaName ?? result.tithi.paksha,
      pakshaKn,
    },
    nakshatra: {
      name:   result.nakshatra.name,
      nameKn: result.nakshatra.nameLocal || result.nakshatra.name,
    },
    yoga: {
      name:   result.yoga.name,
      nameKn: result.yoga.displayName,
    },
    karana: {
      name:   result.karana.name,
      nameKn: result.karana.displayName,
    },
    vara: {
      name:   result.vara.name,
      nameKn: result.vara.nameLocal || result.vara.displayName || result.vara.name,
    },

    sunrise:   result.sunriseLocal,
    sunset:    result.sunsetLocal,
    moonrise:  result.moonriseLocal ?? undefined,

    rahuKalam: {
      start: result.rahuKalam.startLocal,
      end:   result.rahuKalam.endLocal,
    },

    masa:       result.masa?.current.name,
    masaKn:     result.masa?.current.displayName,
    samvatsara: result.samvatsara?.displayName || result.samvatsara?.name,

    festival: primaryFestival ? {
      nameEn: primaryFestival.nameEn,
      nameKn: primaryFestival.nameKn,
      deity:  primaryFestival.deity,
      type:   primaryFestival.type,
    } : undefined,

    deity: {
      nameEn:   result.dailyDeity.nameEn,
      nameKn:   result.dailyDeity.nameKn,
      mantraEn: result.dailyDeity.mantraEn,
      mantraKn: result.dailyDeity.mantraKn,
      symbol:   result.dailyDeity.symbol,
    },

    message: {
      en:       result.spiritualMessage.messageEn,
      kn:       result.spiritualMessage.messageKn,
      sourceEn: result.spiritualMessage.sourceEn,
      sourceKn: result.spiritualMessage.sourceKn,
    },

    auspicious: {
      colour:    result.dailyAuspicious.colour,
      number:    result.dailyAuspicious.number,
      direction: result.dailyAuspicious.direction,
    },

    theme,
    format,
    lang,
    generatedAt: new Date().toISOString(),
    brandName:   'VedRith',
    tagline:     lang === 'kn' ? 'ವೈದಿಕ ಜ್ಞಾನದ ಲಯ' : 'The Rhythm of Vedic Wisdom',
  }
}
