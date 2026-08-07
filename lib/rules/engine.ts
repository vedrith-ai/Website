// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Traditional Rules Engine V1 — Evaluation Engine
//
// Pure evaluation logic. No side effects. No React. No external deps.
// Input: RuleEngineInputs  →  Output: ActivityEvaluation[]
//
// Design:
//   1. Build an in-memory index on first call (lazy, cached forever)
//   2. For each requested activity, collect all matching rules
//   3. Evaluate conditions + exceptions
//   4. Apply regional overrides
//   5. Score and aggregate → ActivityEvaluation
// ─────────────────────────────────────────────────────────────────────────────

import type {
  VedicRule,
  RuleEngineInputs,
  ActivityEvaluation,
  RuleEvaluationResult,
  RuleIndex,
  ActivityCategory,
  RuleSuitability,
  RuleCondition,
  PakshaType,
} from './types'
import { ACTIVITY_RULES } from './database/activity-rules'

// ── Scores per suitability ────────────────────────────────────────────────────
const SUITABILITY_SCORE: Record<RuleSuitability, number> = {
  Suitable:           2,
  ModeratelySuitable: 0,
  Avoid:             -2,
}

// ── Build the rule index (once, lazily) ──────────────────────────────────────

let _index: RuleIndex | null = null

function buildIndex(rules: VedicRule[]): RuleIndex {
  const byCategory  = new Map<ActivityCategory, VedicRule[]>()
  const byTithi     = new Map<string, VedicRule[]>()
  const byNakshatra = new Map<string, VedicRule[]>()
  const byYoga      = new Map<string, VedicRule[]>()
  const byVara      = new Map<string, VedicRule[]>()
  const all         = rules.filter(r => r.status === 'active')

  for (const rule of all) {
    // By category
    const cat = byCategory.get(rule.category) ?? []
    cat.push(rule)
    byCategory.set(rule.category, cat)

    // By tithi
    if (Array.isArray(rule.applicableTithi)) {
      for (const t of rule.applicableTithi) {
        const arr = byTithi.get(t) ?? []; arr.push(rule); byTithi.set(t, arr)
      }
    }

    // By nakshatra
    if (Array.isArray(rule.applicableNakshatra)) {
      for (const n of rule.applicableNakshatra) {
        const arr = byNakshatra.get(n) ?? []; arr.push(rule); byNakshatra.set(n, arr)
      }
    }

    // By yoga
    if (Array.isArray(rule.applicableYoga)) {
      for (const y of rule.applicableYoga) {
        const arr = byYoga.get(y) ?? []; arr.push(rule); byYoga.set(y, arr)
      }
    }

    // By vara
    if (Array.isArray(rule.applicableVara)) {
      for (const v of rule.applicableVara) {
        const arr = byVara.get(v) ?? []; arr.push(rule); byVara.set(v, arr)
      }
    }
  }

  // Sort each category list by priority
  for (const [cat, arr] of byCategory) {
    byCategory.set(cat, arr.sort((a, b) => a.priority - b.priority))
  }

  return { byCategory, byTithi, byNakshatra, byYoga, byVara, all }
}

function getIndex(): RuleIndex {
  if (!_index) _index = buildIndex(ACTIVITY_RULES)
  return _index
}

// ── Element matching ──────────────────────────────────────────────────────────

function matchesElement(
  ruleValue: string[] | '*',
  inputValue: string
): boolean {
  if (ruleValue === '*') return true
  return ruleValue.includes(inputValue)
}

function matchesPaksha(
  rulePaksha: PakshaType,
  inputPaksha: PakshaType
): boolean {
  if (rulePaksha === '*') return true
  return rulePaksha === inputPaksha
}

function matchesMasa(
  ruleMasa: string[] | '*' | undefined,
  inputMasa: string | undefined
): boolean {
  if (!ruleMasa || ruleMasa === '*') return true
  if (!inputMasa) return false
  return (ruleMasa as string[]).includes(inputMasa)
}

function matchesCondition(cond: RuleCondition, inputs: RuleEngineInputs): boolean {
  const inputValue = (() => {
    switch (cond.element) {
      case 'tithi':     return inputs.tithi
      case 'nakshatra': return inputs.nakshatra
      case 'yoga':      return inputs.yoga
      case 'karana':    return inputs.karana
      case 'vara':      return inputs.vara
      case 'paksha':    return inputs.tithiPaksha
      case 'masa':      return inputs.masa ?? ''
      default:          return ''
    }
  })()

  switch (cond.operator) {
    case 'includes':    return cond.values.includes(inputValue)
    case 'excludes':    return !cond.values.includes(inputValue)
    case 'equals':      return cond.values[0] === inputValue
    case 'not-equals':  return cond.values[0] !== inputValue
    default:            return false
  }
}

// ── Rule matching ─────────────────────────────────────────────────────────────

function ruleMatchesInputs(rule: VedicRule, inputs: RuleEngineInputs): boolean {
  return (
    matchesElement(rule.applicableTithi,    inputs.tithi)    &&
    matchesElement(rule.applicableNakshatra, inputs.nakshatra) &&
    matchesElement(rule.applicableYoga,     inputs.yoga)     &&
    matchesElement(rule.applicableKarana,   inputs.karana)   &&
    matchesElement(rule.applicableVara,     inputs.vara)     &&
    matchesPaksha(rule.applicablePaksha,    inputs.tithiPaksha) &&
    matchesMasa(rule.applicableMasa,        inputs.masa)     &&
    // All explicit conditions must match
    rule.conditions.every(c => matchesCondition(c, inputs))
  )
}

// ── Aggregate confidence ──────────────────────────────────────────────────────

function aggregateConfidence(results: RuleEvaluationResult[]): 'high' | 'medium' | 'low' {
  if (results.length === 0) return 'low'
  const highCount   = results.filter(r => r.confidence === 'high').length
  const mediumCount = results.filter(r => r.confidence === 'medium').length
  if (highCount > mediumCount) return 'high'
  if (mediumCount > 0)         return 'medium'
  return 'low'
}

// ── Evaluate a single rule against inputs ────────────────────────────────────

function evaluateRule(
  rule: VedicRule,
  inputs: RuleEngineInputs
): RuleEvaluationResult {
  const lang   = inputs.lang
  const region = inputs.region ?? 'All'

  // Check for exceptions
  let finalSuitability = rule.recommendation
  let regionalNote: string | undefined

  for (const exc of rule.exceptions) {
    if (matchesCondition(exc.condition, inputs)) {
      finalSuitability = exc.overrideSuitability
      break
    }
  }

  // Apply regional override
  const regionalOverride = rule.regionalOverrides.find(
    o => o.region === region || o.region === 'All'
  )
  if (regionalOverride?.suitability) {
    finalSuitability = regionalOverride.suitability
    regionalNote     = regionalOverride.reason
  }

  return {
    ruleId:             rule.id,
    ruleVersion:        rule.version,
    category:           rule.category,
    recommendation:     finalSuitability,
    reason:             lang === 'kn' ? rule.reason.kn : rule.reason.en,
    supportingFactors:  rule.supportingFactors.map(f => lang === 'kn' ? f.kn : f.en),
    conflictingFactors: rule.conflictingFactors.map(f => lang === 'kn' ? f.kn : f.en),
    confidence:         rule.confidence,
    scripturalRefs:     rule.scripturalRefs.filter(r => r.language === lang || r.language === 'en'),
    regionalNote,
  }
}

// ── Activity labels ───────────────────────────────────────────────────────────

const ACTIVITY_LABELS: Record<ActivityCategory, string> = {
  Marriage:          'Marriage (Vivah)',
  GruhaPravesha:     'Griha Pravesha (Home Entry)',
  Aksharabhyasa:     'Aksharabhyasa (First Writing)',
  Upanayana:         'Upanayana (Sacred Thread)',
  Annaprashana:      'Annaprashana (First Solid Food)',
  NamingCeremony:    'Naming Ceremony (Namakarana)',
  VehiclePurchase:   'Vehicle Purchase',
  BusinessOpening:   'Business Opening',
  Travel:            'Travel (Yatra)',
  LandPurchase:      'Land Purchase',
  BhoomiPooja:       'Bhoomi Pooja (Ground Breaking)',
  TempleVisit:       'Temple Visit',
  NewInvestment:     'New Investment',
  MedicalProcedure:  'Medical Procedure',
  Education:         'Education (Vidyarambha)',
  SpiritualPractices:'Spiritual Practices',
  General:           'General Activities',
}

// ── Aggregate results for an activity ────────────────────────────────────────

function aggregateActivity(
  category: ActivityCategory,
  matchedRules: RuleEvaluationResult[],
  lang: 'en' | 'kn'
): ActivityEvaluation {
  let score = 0
  const supporting: string[] = []
  const conflicting: string[] = []

  for (const r of matchedRules) {
    score += SUITABILITY_SCORE[r.recommendation]
    supporting.push(...r.supportingFactors)
    conflicting.push(...r.conflictingFactors)
  }

  // Determine final suitability from score
  let recommendation: RuleSuitability
  if (score >= 2)       recommendation = 'Suitable'
  else if (score <= -2) recommendation = 'Avoid'
  else                  recommendation = 'ModeratelySuitable'

  // Take primary reason from the highest-priority (lowest priority number) matched rule
  const primaryReason = matchedRules[0]?.reason
    ?? (lang === 'kn'
      ? 'ಈ ದಿನ ಸಾಮಾನ್ಯ. ವಿಶೇಷ ನಿಯಮಗಳು ಅನ್ವಯಿಸುವುದಿಲ್ಲ.'
      : 'No specific classical rules match the current Panchanga for this activity. General auspiciousness applies.')

  // Deduplicate
  const uniqueSupporting  = [...new Set(supporting)]
  const uniqueConflicting = [...new Set(conflicting)]

  return {
    activity:           category,
    activityLabel:      ACTIVITY_LABELS[category] ?? category,
    recommendation,
    score,
    matchedRules,
    primaryReason,
    supportingFactors:  uniqueSupporting,
    conflictingFactors: uniqueConflicting,
    confidence:         aggregateConfidence(matchedRules),
    scripturalRefs:     matchedRules.flatMap(r => r.scripturalRefs),
  }
}

// ── Result cache (prevents re-evaluation of identical inputs) ─────────────────

const EVAL_CACHE = new Map<string, ActivityEvaluation[]>()
const CACHE_MAX  = 200

function makeCacheKey(inputs: RuleEngineInputs, categories: ActivityCategory[]): string {
  return JSON.stringify({
    t: inputs.tithi, p: inputs.tithiPaksha, n: inputs.nakshatra,
    y: inputs.yoga, k: inputs.karana, v: inputs.vara,
    m: inputs.masa, l: inputs.lang, r: inputs.region,
    c: categories.sort().join(','),
  })
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Evaluate Panchanga inputs against the Traditional Rules Engine.
 *
 * @param inputs     The Panchanga state for the day
 * @param categories Specific activities to evaluate (empty = all)
 * @returns          Array of ActivityEvaluation, sorted by category name
 */
export function evaluateRules(
  inputs: RuleEngineInputs,
  categories: ActivityCategory[] = []
): ActivityEvaluation[] {
  const key = makeCacheKey(inputs, categories)
  const hit = EVAL_CACHE.get(key)
  if (hit) return hit

  const index = getIndex()

  // Determine which categories to evaluate
  const targetCategories: ActivityCategory[] = categories.length > 0
    ? categories
    : [...new Set(ACTIVITY_RULES.map(r => r.category))]

  const results: ActivityEvaluation[] = []

  for (const category of targetCategories) {
    const categoryRules = (index.byCategory.get(category) ?? [])
      .filter(rule => ruleMatchesInputs(rule, inputs))

    const evaluated = categoryRules.map(rule => evaluateRule(rule, inputs))

    results.push(aggregateActivity(category, evaluated, inputs.lang))
  }

  // Sort alphabetically by label for consistent output
  results.sort((a, b) => a.activityLabel.localeCompare(b.activityLabel))

  // Cache (prune if too large)
  if (EVAL_CACHE.size >= CACHE_MAX) EVAL_CACHE.clear()
  EVAL_CACHE.set(key, results)

  return results
}

/**
 * Evaluate a single specific activity.
 */
export function evaluateActivity(
  inputs: RuleEngineInputs,
  category: ActivityCategory
): ActivityEvaluation {
  const results = evaluateRules(inputs, [category])
  return results[0] ?? aggregateActivity(category, [], inputs.lang)
}

/**
 * Get rules applicable to a specific Panchanga element value.
 * Used by the element-specific APIs (tithi, nakshatra, etc.).
 */
export function getRulesForElement(
  element: 'tithi' | 'nakshatra' | 'yoga' | 'karana' | 'vara',
  value:   string
): VedicRule[] {
  const index = getIndex()
  switch (element) {
    case 'tithi':     return index.byTithi.get(value)     ?? []
    case 'nakshatra': return index.byNakshatra.get(value) ?? []
    case 'yoga':      return index.byYoga.get(value)      ?? []
    case 'vara':      return index.byVara.get(value)      ?? []
    default:          return []
  }
}

/**
 * Get all active rules (for admin/listing endpoints).
 */
export function getAllRules(): VedicRule[] {
  return getIndex().all
}

/**
 * Invalidate the rule index (called after admin rule updates).
 */
export function invalidateIndex(): void {
  _index = null
  EVAL_CACHE.clear()
}

/** Engine version */
export const RULES_ENGINE_VERSION = '1.0.0'
