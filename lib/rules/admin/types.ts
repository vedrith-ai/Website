// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Traditional Rules Engine V1 — Admin Types
//
// Architecture for future admin editing of rules without code changes.
// Rules can eventually be stored in a database (Supabase) and edited via
// an admin UI, with versioning and approval workflow.
//
// Current state: Types only — runtime rules are TypeScript constants.
// Future state: Rules loaded from Supabase, edited via admin panel.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  VedicRule,
  AuditEntry,
  ApprovalStatus,
  RegionalProfile,
  ActivityCategory,
  ClassicalSource,
} from '../types'

// ── Rule proposal (used when a scholar/expert proposes a rule change) ─────────

export interface RuleProposal {
  /** Unique proposal ID */
  proposalId:     string
  /** The rule being proposed (new or updated) */
  rule:           VedicRule
  /** Type of proposal */
  type:           'new' | 'update' | 'deprecate'
  /** If update, the ID of the rule being modified */
  targetRuleId?:  string
  /** Who submitted this proposal */
  submittedBy:    string
  submittedAt:    string
  /** Scholarly justification for this rule */
  justification:  string
  /** Classical references supporting this proposal */
  references:     Array<{
    source:  ClassicalSource
    chapter: string
    summary: string
  }>
  status:         ApprovalStatus
  /** Review notes from the approver */
  reviewNotes?:   string
  reviewedBy?:    string
  reviewedAt?:    string
}

// ── Rule version snapshot ─────────────────────────────────────────────────────

export interface RuleVersionSnapshot {
  /** The rule ID */
  ruleId:      string
  /** Semantic version */
  version:     string
  /** Full rule snapshot at this version */
  snapshot:    VedicRule
  /** When this version was created */
  createdAt:   string
  /** Why this version was created */
  changeReason: string
  /** Who made this change */
  changedBy:   string
}

// ── Audit log entry ───────────────────────────────────────────────────────────

export interface AdminAuditEntry extends AuditEntry {
  /** The rule that was affected */
  ruleId:     string
  /** IP address or session ID of the editor (for security audit) */
  sessionId?: string
  /** Old value snapshot for update/deprecate actions */
  previousValue?: Partial<VedicRule>
  /** New value applied */
  newValue?:  Partial<VedicRule>
}

// ── Rule search and filter ────────────────────────────────────────────────────

export interface RuleFilter {
  categories?:   ActivityCategory[]
  status?:       'active' | 'draft' | 'deprecated'
  confidence?:   'high' | 'medium' | 'low'
  region?:       RegionalProfile
  tithiKey?:     string
  nakshatraKey?: string
  yogaKey?:      string
  varaKey?:      string
  searchText?:   string   // Full-text search on reason, id
}

// ── Admin statistics ──────────────────────────────────────────────────────────

export interface RuleStats {
  totalRules:       number
  activeRules:      number
  draftRules:       number
  deprecatedRules:  number
  byCategory:       Record<ActivityCategory, number>
  byConfidence:     Record<'high' | 'medium' | 'low', number>
  pendingProposals: number
  lastUpdated:      string
}

// ── Future Supabase schema (documentation) ────────────────────────────────────

/**
 * When migrated to Supabase, the tables will be:
 *
 * TABLE vedic_rules
 *   id           TEXT PRIMARY KEY
 *   version      TEXT
 *   rule_data    JSONB        -- Full VedicRule object
 *   status       TEXT
 *   created_at   TIMESTAMPTZ
 *   updated_at   TIMESTAMPTZ
 *
 * TABLE rule_versions
 *   id           UUID PRIMARY KEY
 *   rule_id      TEXT REFERENCES vedic_rules(id)
 *   version      TEXT
 *   snapshot     JSONB
 *   changed_by   TEXT
 *   change_reason TEXT
 *   created_at   TIMESTAMPTZ
 *
 * TABLE rule_proposals
 *   id           UUID PRIMARY KEY
 *   rule_data    JSONB
 *   type         TEXT
 *   submitted_by TEXT
 *   submitted_at TIMESTAMPTZ
 *   status       TEXT
 *   reviewed_by  TEXT
 *   reviewed_at  TIMESTAMPTZ
 *
 * TABLE rule_audit_log
 *   id           UUID PRIMARY KEY
 *   rule_id      TEXT
 *   action       TEXT
 *   by           TEXT
 *   at           TIMESTAMPTZ
 *   diff         JSONB
 */

// ── Admin API response types ──────────────────────────────────────────────────

export interface AdminRuleListResponse {
  rules:     VedicRule[]
  total:     number
  page:      number
  pageSize:  number
  stats:     RuleStats
}

export interface AdminProposalListResponse {
  proposals: RuleProposal[]
  total:     number
  pending:   number
}

// ── Validation ────────────────────────────────────────────────────────────────

export interface ValidationError {
  field:   string
  message: string
}

export interface RuleValidationResult {
  valid:   boolean
  errors:  ValidationError[]
  warnings: ValidationError[]
}

/**
 * Validate a VedicRule object for completeness and consistency.
 * Used by the admin proposal system to ensure rule quality.
 */
export function validateRule(rule: Partial<VedicRule>): RuleValidationResult {
  const errors:   ValidationError[] = []
  const warnings: ValidationError[] = []

  if (!rule.id)                   errors.push({ field: 'id', message: 'Rule ID is required' })
  if (!rule.category)             errors.push({ field: 'category', message: 'Category is required' })
  if (!rule.recommendation)       errors.push({ field: 'recommendation', message: 'Recommendation is required' })
  if (!rule.reason?.en)           errors.push({ field: 'reason.en', message: 'English reason is required' })
  if (!rule.reason?.kn)           warnings.push({ field: 'reason.kn', message: 'Kannada reason recommended' })
  if (!rule.scripturalRefs?.length) warnings.push({ field: 'scripturalRefs', message: 'At least one scriptural reference recommended' })
  if (rule.priority === undefined)  errors.push({ field: 'priority', message: 'Priority is required (1=highest, 100=lowest)' })
  if (!rule.confidence)           errors.push({ field: 'confidence', message: 'Confidence level required (high/medium/low)' })

  // Check for duplicate ID (would be checked against DB in production)
  if (rule.id && !/^[a-z0-9-]+$/.test(rule.id)) {
    errors.push({ field: 'id', message: 'Rule ID must be lowercase alphanumeric with hyphens only' })
  }

  return { valid: errors.length === 0, errors, warnings }
}
