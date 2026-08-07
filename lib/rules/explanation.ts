// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Explanation Engine V1
//
// Generates structured explanations for all Panchanga elements:
//   Tithi, Nakshatra, Yoga, Karana, Vara, Paksha, Masa, Samvatsara
//
// Two-tier approach:
//   Tier 1: Static structured data from the Knowledge Engine (always available)
//   Tier 2: Optional AI narrative from OpenRouter (when configured)
//
// The static tier is always authoritative and production-safe.
// The AI tier adds richer contextual prose when the API key is available.
// ─────────────────────────────────────────────────────────────────────────────

import type { PanchangaElementType, ElementExplanation, SupportedLanguage } from './types'
import { getTithiKnowledge }     from '@/lib/knowledge/tithi-knowledge'
import { getNakshatraKnowledge } from '@/lib/knowledge/nakshatra-knowledge'
import { getVaraKnowledge } from '@/lib/knowledge/vara-knowledge'
import { getRulesForElement }    from './engine'
import {
  generateExplanation,
  SYSTEM_PROMPT_EXPLAINER,
  isOpenRouterConfigured,
} from './openrouter'

// ── Yoga knowledge (inline static data) ──────────────────────────────────────
// Maps yoga key → suitability classification per classical tradition

const YOGA_QUALITY: Record<string, 'Shubha' | 'Ashubha' | 'Mixed'> = {
  Vishkumbha:'Ashubha', Priti:'Shubha', Ayushman:'Shubha', Saubhagya:'Shubha',
  Shobhana:'Shubha', Atiganda:'Ashubha', Sukarma:'Shubha', Dhriti:'Shubha',
  Shoola:'Ashubha', Ganda:'Ashubha', Vriddhi:'Shubha', Dhruva:'Shubha',
  Vyaghata:'Ashubha', Harshana:'Shubha', Vajra:'Ashubha', Siddhi:'Shubha',
  Vyatipata:'Ashubha', Variyan:'Shubha', Parigha:'Ashubha', Shiva:'Shubha',
  Siddha:'Shubha', Sadhya:'Shubha', Shubha:'Shubha', Shukla:'Shubha',
  Brahma:'Shubha', Indra:'Mixed', Vaidhriti:'Ashubha',
}

const YOGA_DESCRIPTIONS: Record<string, string> = {
  Vishkumbha: 'The obstructer — creates delays and obstacles. Avoid new beginnings.',
  Priti:      'The loving — brings affection, harmony, and mutual happiness.',
  Ayushman:   'The long-lived — favourable for health, longevity, and vitality.',
  Saubhagya:  'The fortunate — brings good luck, prosperity, and auspicious events.',
  Shobhana:   'The radiant — beautiful, auspicious, and suitable for all positive activities.',
  Atiganda:   'The great obstacle — severe, creates danger and difficulty. Avoid.',
  Sukarma:    'Good deeds — favours virtuous acts, charitable works, and service.',
  Dhriti:     'Steadiness — excellent for perseverance, long-term projects, and patience.',
  Shoola:     'The thorn — painful, piercing energy. Inauspicious for new starts.',
  Ganda:      'The knot — creates entanglements and complications. Generally avoided.',
  Vriddhi:    'Growth — excellent for new ventures, investments, and expansion.',
  Dhruva:     'The fixed — ideal for permanent, stable activities: land, building, etc.',
  Vyaghata:   'The tiger — destructive force. Avoid important beginnings.',
  Harshana:   'Joy — brings happiness and enthusiasm to activities.',
  Vajra:      'The thunderbolt — harsh energy causing sudden disruptions. Avoid.',
  Siddhi:     'Achievement — the most auspicious Yoga; brings success to all endeavours.',
  Vyatipata:  'Calamity — highly inauspicious, associated with sudden misfortune.',
  Variyan:    'Excellent — very auspicious, supports prosperity and success.',
  Parigha:    'The gate bar — blocking energy. Avoid important beginnings.',
  Shiva:      'Auspicious — Shiva\'s grace brings blessings and spiritual merit.',
  Siddha:     'Accomplished — brings fulfilment and success, excellent for goals.',
  Sadhya:     'Achievable — what is started can be successfully completed.',
  Shubha:     'Auspicious — the naturally fortunate Yoga, excellent for all activities.',
  Shukla:     'Pure / bright — brings purity, clarity, and positive outcomes.',
  Brahma:     'The creator — excellent for creative, educational, and innovative work.',
  Indra:      'The king — powerful but mixed; success with effort and determination.',
  Vaidhriti:  'The supporter of existence — but inauspicious for beginnings; causes obstacles.',
}

// ── Karana quality table ──────────────────────────────────────────────────────

const KARANA_DESCRIPTIONS: Record<string, string> = {
  Bava:      'The moving — generally auspicious for most activities.',
  Balava:    'The strong — supports physical activities and courage.',
  Kaulava:   'Of noble birth — auspicious for domestic and family activities.',
  Taitila:   'The sesame — auspicious for trade, commerce, and prosperity.',
  Garija:    'The elephant — stable, strong energy for important tasks.',
  Vanija:    'The merchant — supremely auspicious for commerce and business.',
  Vishti:    'The inauspicious — also called Bhadra; avoid important starts during Vishti.',
  Shakuni:   'The bird — mixed; useful for some specific activities.',
  Chatushpada: 'Four-footed — auspicious for activities related to animals and stability.',
  Naga:      'The serpent — mixed energy; connected to Naga worship.',
  Kimstughna: 'The remover of bad — removes obstacles and brings relief.',
}

// ── Paksha explanation ────────────────────────────────────────────────────────

const PAKSHA_INFO = {
  Shukla: {
    meaning:  'Bright/Waxing Fortnight',
    en: 'Shukla Paksha is the 15-day waxing period from new moon to full moon. The increasing lunar energy supports new beginnings, growth, expansion, and auspicious ceremonies. Most major Samskaras and new ventures prefer Shukla Paksha for its association with flourishing and abundance.',
    kn: 'ಶುಕ್ಲ ಪಕ್ಷ — ಅಮಾವಾಸ್ಯೆಯಿಂದ ಹುಣ್ಣಿಮೆಯ ವರೆಗಿನ 15 ದಿನಗಳ ಅವಧಿ. ಚಂದ್ರ ವೃದ್ಧಿ ಹೊಂದುವ ಈ ಕಾಲ ಹೊಸ ಕಾರ್ಯ, ವೃದ್ಧಿ ಮತ್ತು ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಉತ್ತಮ.',
  },
  Krishna: {
    meaning:  'Dark/Waning Fortnight',
    en: 'Krishna Paksha is the 15-day waning period from full moon to new moon. The decreasing lunar energy is suited for completion of tasks, ancestral rites, and activities that benefit from winding down rather than starting up. Some Sadhana practices are specifically done in Krishna Paksha.',
    kn: 'ಕೃಷ್ಣ ಪಕ್ಷ — ಹುಣ್ಣಿಮೆಯಿಂದ ಅಮಾವಾಸ್ಯೆಯ ವರೆಗಿನ 15 ದಿನಗಳ ಅವಧಿ. ಚಂದ್ರ ಕ್ಷೀಣಿಸುವ ಈ ಕಾಲ ಪಿತೃ ಕಾರ್ಯ, ಸಾಧನೆ ಮತ್ತು ಕಾರ್ಯ ಮುಕ್ತಾಯಕ್ಕೆ ಉತ್ತಮ.',
  },
}

// ── Static explanation builders ───────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildTithiExplanation(key: string, lang/*unused*/: SupportedLanguage): ElementExplanation | null {
  const k = getTithiKnowledge(key)
  if (!k) return null

  const applicableRules = getRulesForElement('tithi', key)

  return {
    element: 'tithi',
    key,
    name:      { en: k.nameEn,  kn: k.nameKn },
    meaning:   { en: k.meaning, kn: k.meaning },
    importance: {
      en: k.spiritualSignificance,
      kn: k.spiritualSignificance,
    },
    deity:     k.deity,
    mantra:    k.mantra,
    observances: [
      { en: k.fastingInfo, kn: k.fastingInfo },
      { en: k.remedy,      kn: k.remedy      },
    ],
    suitableActivities:   k.suitableActivities,
    unsuitableActivities: k.avoidActivities,
    scripturalRefs: applicableRules.flatMap(r => r.scripturalRefs),
    regionalNotes: {},
  }
}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildNakshatraExplanation(key: string, _lang: SupportedLanguage): ElementExplanation | null {
  const k = getNakshatraKnowledge(key)
  if (!k) return null

  const applicableRules = getRulesForElement('nakshatra', key)

  return {
    element: 'nakshatra',
    key,
    name:    { en: k.nameEn,     kn: k.nameKn },
    meaning: { en: k.meaning,    kn: k.meaning },
    importance: {
      en: `${k.description} Gana: ${k.gana}. Nature: ${k.nature}. Element: ${k.element}. Ruling planet: ${k.ruler}.`,
      kn: k.description,
    },
    deity:   k.deity,
    mantra:  k.mantra,
    observances: [],
    suitableActivities:   k.suitableActivities,
    unsuitableActivities: k.avoidActivities,
    scripturalRefs: applicableRules.flatMap(r => r.scripturalRefs),
    regionalNotes: {},
  }
}

function buildYogaExplanation(key: string): ElementExplanation | null {
  const quality = YOGA_QUALITY[key] ?? 'Mixed'
  const desc    = YOGA_DESCRIPTIONS[key]
  if (!desc) return null

  return {
    element:  'yoga',
    key,
    name:     { en: key, kn: key },
    meaning:  { en: `${key} Yoga — ${quality}`, kn: `${key} ಯೋಗ — ${quality}` },
    importance: { en: desc, kn: desc },
    deity:   '',
    observances: [],
    suitableActivities:   quality === 'Shubha' ? ['All auspicious activities', 'New beginnings', 'Important ceremonies'] : [],
    unsuitableActivities: quality === 'Ashubha' ? ['New ventures', 'Marriage ceremonies', 'Important beginnings'] : [],
    scripturalRefs: [
      {
        source:  'MuhurtaChintamani',
        chapter: 'Chapter 2 — Yoga Prakarana',
        summary: `${key} is classified as ${quality} (${quality === 'Shubha' ? 'auspicious' : quality === 'Ashubha' ? 'inauspicious' : 'mixed'}) in classical Muhurta texts.`,
        language: 'en',
      },
    ],
    regionalNotes: {},
  }
}

function buildKaranaExplanation(key: string): ElementExplanation | null {
  const desc = KARANA_DESCRIPTIONS[key]
  if (!desc) return null

  const isVishti = key === 'Vishti'

  return {
    element: 'karana',
    key,
    name:     { en: key, kn: key },
    meaning:  { en: `${key} Karana`, kn: `${key} ಕರಣ` },
    importance: { en: desc, kn: desc },
    deity:   '',
    observances: isVishti ? [{ en: 'Avoid starting important activities during Vishti (Bhadra) Karana. This period is considered highly inauspicious for new beginnings in classical Muhurta.', kn: 'ವಿಷ್ಟಿ ಕರಣದಲ್ಲಿ ಮುಖ್ಯ ಕಾರ್ಯ ಆರಂಭ ಮಾಡಬಾರದು.' }] : [],
    suitableActivities:   isVishti ? [] : ['Activities consistent with the Karana\'s energy'],
    unsuitableActivities: isVishti ? ['All new beginnings', 'Marriage', 'Travel', 'Business opening'] : [],
    scripturalRefs: [
      {
        source:  'MuhurtaChintamani',
        chapter: 'Chapter 2 — Karana Prakarana',
        summary: `${key} Karana: ${desc}`,
        language: 'en',
      },
    ],
    regionalNotes: {},
  }
}

function buildVaraExplanation(key: string): ElementExplanation | null {
  const k = getVaraKnowledge(key)
  if (!k) return null

  return {
    element: 'vara',
    key,
    name:    { en: k.nameEn, kn: k.nameKn },
    meaning: { en: k.meaning, kn: k.meaning },
    importance: {
      en: `${k.description} Ruling planet: ${k.planet}. Deity: ${k.deity}. Gem: ${k.gem}. Metal: ${k.metal}.`,
      kn: k.description,
    },
    deity:   k.deity,
    mantra:  k.mantra,
    observances: [{ en: k.fastingInfo, kn: k.fastingInfo }],
    suitableActivities:   k.suitableActivities,
    unsuitableActivities: k.avoidActivities,
    scripturalRefs: [
      {
        source:  'MuhurtaChintamani',
        chapter: 'Chapter 1 — Vara Prakarana',
        summary: `${k.nameEn} is ruled by ${k.planet} and is auspicious for: ${k.suitableActivities.slice(0, 2).join(', ')}.`,
        language: 'en',
      },
    ],
    regionalNotes: {},
  }
}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildPakshaExplanation(paksha: 'Shukla' | 'Krishna', _lang: SupportedLanguage): ElementExplanation {
  const info = PAKSHA_INFO[paksha]
  return {
    element:  'paksha',
    key:      paksha,
    name:     { en: `${paksha} Paksha`, kn: `${paksha} ಪಕ್ಷ` },
    meaning:  { en: info.meaning, kn: info.meaning },
    importance: { en: info.en, kn: info.kn },
    deity:   paksha === 'Shukla' ? 'Vishnu / Lakshmi' : 'Shiva / Kali / Pitrus',
    observances: [],
    suitableActivities:   paksha === 'Shukla'
      ? ['Marriage ceremonies', 'Griha Pravesha', 'New ventures', 'Investments', 'Samskaras']
      : ['Ancestral rites (Shraddha)', 'Completion of tasks', 'Spiritual sadhana', 'Fasting'],
    unsuitableActivities: paksha === 'Krishna'
      ? ['Griha Pravesha', 'Major auspicious new beginnings']
      : [],
    scripturalRefs: [
      {
        source: 'MuhurtaChintamani',
        chapter: 'Chapter 1 — Paksha Nirupana',
        summary: `${paksha} Paksha provides ${paksha === 'Shukla' ? 'increasing lunar energy ideal for new auspicious beginnings' : 'decreasing lunar energy suited for ancestral rites and completion activities'}.`,
        language: 'en',
      },
    ],
    regionalNotes: {},
  }
}

// ── AI enhancement layer ──────────────────────────────────────────────────────

async function enrichWithAI(
  explanation: ElementExplanation,
  lang: SupportedLanguage
): Promise<string> {
  const name     = lang === 'kn' ? explanation.name.kn     : explanation.name.en
  const meaning  = lang === 'kn' ? explanation.meaning.kn  : explanation.meaning.en
  const importTxt= lang === 'kn' ? explanation.importance.kn : explanation.importance.en

  const userPrompt = `${lang === 'kn' ? 'ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸಿ:' : 'Explain the following Panchanga element in simple English:'}

Element type: ${explanation.element}
Name: ${name}
Meaning: ${meaning}
Deity: ${explanation.deity}
Classical significance: ${importTxt.slice(0, 300)}

${lang === 'kn' ? 'ಸಂಕ್ಷಿಪ್ತ, ಸ್ಪಷ್ಟ ವಿವರಣೆ ನೀಡಿ. ಜ್ಯೋತಿಷ್ಯ ಭವಿಷ್ಯ ಹೇಳಬೇಡಿ.' : 'Write a brief contextual explanation. Do NOT make personal predictions or fate claims.'}`

  const fallback = importTxt   // Use static data as fallback

  const result = await generateExplanation(
    SYSTEM_PROMPT_EXPLAINER,
    userPrompt,
    fallback,
    300
  )

  return result.text
}

// ── Public API ─────────────────────────────────────────────────────────────────

export interface ExplanationOptions {
  lang:       SupportedLanguage
  useAI?:     boolean   // Default: true if OpenRouter is configured
}

export interface ExplainResult {
  explanation: ElementExplanation
  /** AI-generated contextual narrative (if AI enabled and configured) */
  aiNarrative: string | null
  aiUsed:      boolean
}

/**
 * Generate a full explanation for any Panchanga element.
 *
 * @param element   Which element type ('tithi', 'nakshatra', etc.)
 * @param key       The element's key (e.g. 'Rohini', 'Purnima', 'Monday')
 * @param options   Language and AI options
 */
export async function explainElement(
  element: PanchangaElementType,
  key:     string,
  options: ExplanationOptions
): Promise<ExplainResult | null> {
  const { lang, useAI = true } = options

  let explanation: ElementExplanation | null = null

  switch (element) {
    case 'tithi':     explanation = buildTithiExplanation(key, lang);     break
    case 'nakshatra': explanation = buildNakshatraExplanation(key, lang); break
    case 'yoga':      explanation = buildYogaExplanation(key);            break
    case 'karana':    explanation = buildKaranaExplanation(key);          break
    case 'vara':      explanation = buildVaraExplanation(key);            break
    case 'paksha': {
      if (key === 'Shukla' || key === 'Krishna') {
        explanation = buildPakshaExplanation(key, lang)
      }
      break
    }
    default: return null
  }

  if (!explanation) return null

  // Optional AI narrative
  let aiNarrative: string | null = null
  const aiEnabled = useAI && isOpenRouterConfigured()

  if (aiEnabled) {
    try {
      aiNarrative = await enrichWithAI(explanation, lang)
    } catch {
      aiNarrative = null   // Fail gracefully — static data is always available
    }
  }

  return { explanation, aiNarrative, aiUsed: !!aiNarrative }
}

/**
 * Batch explain multiple elements (used by the /rules/activity API).
 */
export async function explainMultiple(
  requests: Array<{ element: PanchangaElementType; key: string }>,
  options:  ExplanationOptions
): Promise<Record<string, ExplainResult>> {
  const results: Record<string, ExplainResult> = {}

  await Promise.allSettled(
    requests.map(async ({ element, key }) => {
      const result = await explainElement(element, key, options)
      if (result) results[`${element}:${key}`] = result
    })
  )

  return results
}
