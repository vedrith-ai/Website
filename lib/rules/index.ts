// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Traditional Rules Engine V1 — Public API
//
// Single import surface for all Rules Engine exports.
//
// Usage:
//   import { evaluateRules, explainElement, getRegionalProfile } from '@/lib/rules'
// ─────────────────────────────────────────────────────────────────────────────

// Core types
export type {
  VedicRule,
  ActivityCategory,
  RuleEngineInputs,
  ActivityEvaluation,
  RuleEvaluationResult,
  ElementExplanation,
  ScripturalReference,
  RegionalProfile,
  RegionalOverride,
  RuleSuitability,
  RuleConfidence,
  RuleStatus,
  PanchangaElementType,
  SupportedLanguage,
  ClassicalSource,
  AuditEntry,
  MultiLangText,
  RulesApiResponse,
  RulesApiSuccess,
  RulesApiError,
  RulesApiMeta,
} from './types'

// Rule evaluation engine
export {
  evaluateRules,
  evaluateActivity,
  getRulesForElement,
  getAllRules,
  invalidateIndex,
  RULES_ENGINE_VERSION,
} from './engine'

// Explanation engine
export {
  explainElement,
  explainMultiple,
} from './explanation'
export type { ExplainResult, ExplanationOptions } from './explanation'

// Regional profiles
export {
  getRegionalProfile,
  getImplementedProfiles,
  getAllProfiles,
  parseRegion,
  REGIONAL_PROFILES,
} from './regional'
export type { RegionalConfig } from './regional'

// Admin types
export {
  validateRule,
} from './admin/types'
export type {
  RuleProposal,
  RuleVersionSnapshot,
  AdminAuditEntry,
  RuleFilter,
  RuleStats,
  AdminRuleListResponse,
  ValidationError,
  RuleValidationResult,
} from './admin/types'

// Rule database (for direct access if needed)
export { ACTIVITY_RULES, getRulesForCategory, RULE_COUNT } from './database/activity-rules'

// OpenRouter utilities
export { isOpenRouterConfigured } from './openrouter'
