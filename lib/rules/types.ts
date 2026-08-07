// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Traditional Rules Engine V1 — Core Types
//
// Every rule in the system is a first-class VedicRule object.
// The engine is purely data-driven — no logic lives inside React components.
//
// Architecture:
//   Astronomy Engine → Panchanga Engine → Knowledge Engine
//                                       → Traditional Rules Engine (THIS)
//                                           ↓ Recommendations Engine
//                                           ↓ Festival Engine
//                                           ↓ Future Muhurta Engine
// ─────────────────────────────────────────────────────────────────────────────

// ── Primitive aliases ─────────────────────────────────────────────────────────

export type Wildcard = '*'

export type ActivityCategory =
  | 'Marriage'
  | 'GruhaPravesha'
  | 'Aksharabhyasa'
  | 'Upanayana'
  | 'Annaprashana'
  | 'NamingCeremony'
  | 'VehiclePurchase'
  | 'BusinessOpening'
  | 'Travel'
  | 'LandPurchase'
  | 'BhoomiPooja'
  | 'TempleVisit'
  | 'NewInvestment'
  | 'MedicalProcedure'
  | 'Education'
  | 'SpiritualPractices'
  | 'General'

export type RuleSuitability = 'Suitable' | 'ModeratelySuitable' | 'Avoid'

export type RuleConfidence = 'high' | 'medium' | 'low'

export type RuleStatus = 'active' | 'draft' | 'deprecated'

export type PakshaType = 'Shukla' | 'Krishna' | '*'

export type SupportedLanguage = 'en' | 'kn'

export type RegionalProfile =
  | 'Karnataka'
  | 'Maharashtra'
  | 'TamilNadu'
  | 'AndhraTelangana'
  | 'Kerala'
  | 'NorthIndia'
  | 'All'

export type ClassicalSource =
  | 'MuhurtaChintamani'
  | 'DharmaSindhu'
  | 'NirnayaSindhu'
  | 'BrihatSamhita'
  | 'Kalaprakashika'
  | 'JatakaParijata'
  | 'HoraSara'
  | 'BrihatParasharaHoraShastra'
  | 'Skanda Purana'
  | 'VisnuPurana'
  | 'Regional'

// ── Scriptural reference ──────────────────────────────────────────────────────

export interface ScripturalReference {
  source:   ClassicalSource
  chapter?: string      // e.g. "Chapter 1", "Muhurta Kanda"
  verse?:   string      // e.g. "14-16"
  /** Plain-language summary of what the passage says — never verbatim copy */
  summary:  string
  language: SupportedLanguage
}

// ── Rule condition ────────────────────────────────────────────────────────────

export type ConditionOperator = 'includes' | 'excludes' | 'equals' | 'not-equals'

export interface RuleCondition {
  /** Which Panchanga element this condition applies to */
  element: 'tithi' | 'nakshatra' | 'yoga' | 'karana' | 'vara' | 'paksha' | 'masa'
  operator: ConditionOperator
  /** Values to match (string keys matching the element's name/key) */
  values: string[]
  /** Human-readable label for display */
  label: string
}

// ── Rule exception ────────────────────────────────────────────────────────────

export interface RuleException {
  /** Condition under which this rule's recommendation is overridden */
  condition: RuleCondition
  /** The overriding suitability when the exception matches */
  overrideSuitability: RuleSuitability
  reason: string
}

// ── Regional override ─────────────────────────────────────────────────────────

export interface RegionalOverride {
  region:          RegionalProfile
  /** If set, overrides the rule's base suitability for this region */
  suitability?:    RuleSuitability
  /** Additional or replacement reason text for this region */
  reason?:         string
  /** Additional scriptural refs specific to this region */
  refs?:           ScripturalReference[]
}

// ── Multi-language text ───────────────────────────────────────────────────────

export interface MultiLangText {
  en: string
  kn: string
}

// ── The core VedicRule ────────────────────────────────────────────────────────

export interface VedicRule {
  /** Unique stable rule identifier, e.g. "marriage-rohini-shukla-panchami" */
  id: string

  /** Semantic version of this rule */
  version: string   // e.g. "1.0.0"

  /** Activity or context this rule applies to */
  category: ActivityCategory

  /**
   * Panchanga element selectors.
   * '*' means "applies to all values of this element."
   * Arrays are OR conditions — any match triggers the rule.
   */
  applicableTithi:    string[] | Wildcard
  applicableNakshatra: string[] | Wildcard
  applicableYoga:     string[] | Wildcard
  applicableKarana:   string[] | Wildcard
  applicableVara:     string[] | Wildcard
  applicablePaksha:   PakshaType
  applicableMasa?:    string[] | Wildcard    // optional: lunar month filter

  /** Higher priority rules are evaluated first; ties broken by specificity */
  priority: number   // 1 = highest, 100 = lowest

  /** Fine-grained additional conditions (all must match) */
  conditions: RuleCondition[]

  /** Exceptions that can flip the suitability */
  exceptions: RuleException[]

  /** Base recommendation */
  recommendation: RuleSuitability

  /** Supporting Panchanga factors (always localized) */
  supportingFactors: MultiLangText[]

  /** Conflicting Panchanga factors */
  conflictingFactors: MultiLangText[]

  /** Primary reason text */
  reason: MultiLangText

  /** Confidence of this rule based on classical consensus */
  confidence: RuleConfidence

  /** Classical scriptural references (summaries only, no verbatim copying) */
  scripturalRefs: ScripturalReference[]

  /** Language support for this rule */
  langSupport: SupportedLanguage[]

  /** Regional overrides */
  regionalOverrides: RegionalOverride[]

  /** Admin workflow */
  status:     RuleStatus
  createdAt:  string    // ISO date
  updatedAt:  string    // ISO date
  approvedBy?: string   // Author / reviewer identifier
  auditLog?:  AuditEntry[]
}

// ── Rule evaluation result ────────────────────────────────────────────────────

export interface RuleEvaluationResult {
  /** Which rule was applied */
  ruleId:            string
  ruleVersion:       string
  category:          ActivityCategory
  recommendation:    RuleSuitability
  reason:            string   // in requested language
  supportingFactors: string[]
  conflictingFactors: string[]
  confidence:        RuleConfidence
  scripturalRefs:    ScripturalReference[]
  regionalNote?:     string   // if a regional override applied
}

export interface ActivityEvaluation {
  activity:       ActivityCategory
  activityLabel:  string
  recommendation: RuleSuitability
  /** Aggregated score: positive = more auspicious, negative = avoid */
  score:          number
  /** All rules that matched for this evaluation */
  matchedRules:   RuleEvaluationResult[]
  /** Primary reason (from highest-priority matched rule) */
  primaryReason:  string
  /** All supporting Panchanga factors across matched rules */
  supportingFactors: string[]
  /** All conflicting Panchanga factors across matched rules */
  conflictingFactors: string[]
  /** Overall confidence based on matched rules */
  confidence:     RuleConfidence
  scripturalRefs: ScripturalReference[]
}

// ── Panchanga inputs for rule evaluation ─────────────────────────────────────

export interface RuleEngineInputs {
  tithi:     string   // key e.g. 'Purnima'
  tithiPaksha: PakshaType
  nakshatra: string   // key e.g. 'Rohini'
  yoga:      string   // key e.g. 'Siddha'
  karana:    string   // key e.g. 'Bava'
  vara:      string   // key e.g. 'Monday'
  masa?:     string   // key e.g. 'Kartika'
  lang:      SupportedLanguage
  region?:   RegionalProfile
}

// ── Element explanation ───────────────────────────────────────────────────────

export type PanchangaElementType =
  | 'tithi'
  | 'nakshatra'
  | 'yoga'
  | 'karana'
  | 'vara'
  | 'paksha'
  | 'masa'
  | 'samvatsara'

export interface ElementExplanation {
  element:      PanchangaElementType
  key:          string
  name:         MultiLangText
  meaning:      MultiLangText
  importance:   MultiLangText
  deity:        string
  mantra?:      string
  observances:  MultiLangText[]
  suitableActivities:  string[]
  unsuitableActivities: string[]
  scripturalRefs: ScripturalReference[]
  regionalNotes?: Partial<Record<RegionalProfile, string>>
  /** Placeholder for future TTS audio URL */
  audioUrl?:    string
}

// ── Admin types ───────────────────────────────────────────────────────────────

export type AuditAction = 'created' | 'updated' | 'approved' | 'deprecated' | 'restored'

export interface AuditEntry {
  action:    AuditAction
  by:        string
  at:        string   // ISO
  comment?:  string
  diff?:     Record<string, unknown>
}

export interface RuleVersionSnapshot {
  ruleId:    string
  version:   string
  snapshot:  VedicRule
  archivedAt: string
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalWorkflow {
  ruleId:         string
  proposedChange: Partial<VedicRule>
  submittedBy:    string
  submittedAt:    string
  status:         ApprovalStatus
  reviewedBy?:    string
  reviewedAt?:    string
  comment?:       string
}

// ── Rule database index (for fast lookup) ────────────────────────────────────

export interface RuleIndex {
  /** Rules indexed by category */
  byCategory: Map<ActivityCategory, VedicRule[]>
  /** Rules indexed by tithi key */
  byTithi:    Map<string, VedicRule[]>
  /** Rules indexed by nakshatra key */
  byNakshatra: Map<string, VedicRule[]>
  /** Rules indexed by yoga key */
  byYoga:     Map<string, VedicRule[]>
  /** Rules indexed by vara key */
  byVara:     Map<string, VedicRule[]>
  /** All active rules flat */
  all:        VedicRule[]
}

// ── API response types ────────────────────────────────────────────────────────

export interface RulesApiMeta {
  request_id:    string
  computed_at:   string
  cache_hit:     boolean
  rules_version: string   // e.g. "1.0.0"
  engine:        'VedRith Traditional Rules Engine V1'
}

export interface RulesApiSuccess<T> {
  success: true
  data:    T
  meta:    RulesApiMeta
}

export interface RulesApiError {
  success: false
  error: {
    code:    string
    message: string
    field?:  string
  }
}

export type RulesApiResponse<T> = RulesApiSuccess<T> | RulesApiError
