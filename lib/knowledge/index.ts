// ─────────────────────────────────────────────────────────────────────────────
// VedRith Knowledge Base — Public API
//
// Single import surface for:
//   - Localization (English/Kannada display names — extensible to more languages)
//   - Static knowledge entries for Tithi, Nakshatra, Yoga, Karana
//
// Usage:
//   import { getTithiKnowledge, pickName, TITHI_NAMES } from '@/lib/knowledge'
// ─────────────────────────────────────────────────────────────────────────────

export * from './localization'
export * from './tithi-knowledge'
export * from './nakshatra-knowledge'
export * from './yoga-knowledge'
export * from './karana-knowledge'
