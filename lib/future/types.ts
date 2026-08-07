// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Future Module Architecture  [V1.1 — Types Only]
//
// Interface contracts for all planned future modules.
// Build ONLY the interfaces here — zero implementation.
//
// When a module is ready to implement:
//   1. Create lib/engines/<module>/index.ts implementing the interface
//   2. Create app/api/v1/<module>/route.ts
//   3. Create components/<module>/ for UI
// ─────────────────────────────────────────────────────────────────────────────

import type { LanguageCode } from '../i18n/types'

// ── Report Generation ────────────────────────────────────────────────────────

export type ReportTheme = 'traditional' | 'modern' | 'premium'
export type ReportFormat = 'pdf' | 'jpg' | 'html'

export interface KundaliReportConfig {
  kundaliId:   string
  theme:       ReportTheme
  format:      ReportFormat
  lang:        LanguageCode
  /** Include sections */
  sections: {
    birthDetails:   boolean
    chart:          boolean
    planetaryTable: boolean
    dashaTable:     boolean
    yogaAnalysis:   boolean
    doshaAnalysis:  boolean
    remedies:       boolean
    predictions:    boolean
  }
}

/** Future: KundaliReport engine contract */
export interface IKundaliReportEngine {
  generate(config: KundaliReportConfig): Promise<{ url: string; expiresAt: Date }>
}

// ── Name Suggestion Engine ────────────────────────────────────────────────────

export interface NameSuggestionRequest {
  nakshatra:  number    // 1-based
  pada:       number    // 1-4
  gender:     'M' | 'F' | 'N'
  lang:       LanguageCode
  count?:     number    // how many names to suggest (default 10)
}

export interface NameSuggestion {
  name:     string
  syllable: string    // The starting syllable (based on nakshatra-pada)
  meaning:  string
  origin:   string
}

/** Future: Name Suggestion engine contract */
export interface INameSuggestionEngine {
  suggest(req: NameSuggestionRequest): NameSuggestion[]
}

// ── Dasha Engine ─────────────────────────────────────────────────────────────

export type DashaPlanet = 'KETU'|'VENUS'|'SUN'|'MOON'|'MARS'|'RAHU'|'JUPITER'|'SATURN'|'MERCURY'

export interface DashaPeriod {
  planet:    DashaPlanet
  startDate: Date
  endDate:   Date
  years:     number
  antardasha?: DashaPeriod[]
  pratyantardasha?: DashaPeriod[]
}

export interface VimshottariDasha {
  moonNakshatra: number
  moonNakshatraFraction: number
  mahadasha:     DashaPeriod[]
  currentMahadasha?: DashaPeriod
  currentAntardasha?: DashaPeriod
}

/** Future: Vimshottari Dasha engine contract */
export interface IDashaEngine {
  compute(moonLongitude: number, birthDate: Date): VimshottariDasha
  getCurrentPeriod(dasha: VimshottariDasha, asOf?: Date): { maha: DashaPeriod; antar?: DashaPeriod }
}

// ── Dosha Detection Engine ────────────────────────────────────────────────────

export type DoshaType = 'Mangal' | 'Nadi' | 'Bhakoot' | 'Gana' | 'Kuja' | 'Shani'

export interface DoshaResult {
  dosha:       DoshaType
  present:     boolean
  severity:    'mild' | 'moderate' | 'severe' | 'none'
  description: string
  remedies:    string[]
}

/** Future: Dosha engine contract — NOTE: interpretive, requires careful implementation */
export interface IDoshaEngine {
  analyzeMarriageCompatibility(
    kundali1: unknown,
    kundali2: unknown
  ): Record<DoshaType, DoshaResult>
}

// ── Yoga Detection Engine ─────────────────────────────────────────────────────

export interface YogaDetection {
  name:        string
  present:     boolean
  planets:     string[]
  houses:      number[]
  strength:    'strong' | 'moderate' | 'weak'
  description: string
}

/** Future: Yoga detection engine contract */
export interface IYogaDetectionEngine {
  detectRajayoga(kundali: unknown): YogaDetection[]
  detectDhanayoga(kundali: unknown): YogaDetection[]
  detectAllYogas(kundali: unknown): YogaDetection[]
}

// ── Temple Recommendation Engine ──────────────────────────────────────────────

export interface TempleRecommendation {
  deity:     string
  reason:    string    // Why this deity is recommended today
  temples?: Array<{
    name:    string
    city:    string
    lat:     number
    lng:     number
    distKm:  number
  }>
}

/** Future: Temple recommendation engine contract */
export interface ITempleEngine {
  recommendDeity(panchangaElements: {
    tithi: string
    nakshatra: string
    vara: string
  }): TempleRecommendation
  findNearbyTemples(deity: string, lat: number, lng: number): Promise<TempleRecommendation>
}

// ── Remedy Engine ────────────────────────────────────────────────────────────

export interface Remedy {
  type:        'mantra' | 'ritual' | 'gemstone' | 'charity' | 'fasting' | 'pilgrimage'
  description: string
  duration?:   string
  frequency?:  string
  deity?:      string
  source:      string
}

/** Future: Remedy engine contract — NOTE: must be clearly advisory only */
export interface IRemedyEngine {
  forPlanet(planet: string, lang: LanguageCode): Remedy[]
  forDosha(dosha: DoshaType, lang: LanguageCode): Remedy[]
}

// ── Marketplace Integration ──────────────────────────────────────────────────

export interface PremiumReport {
  id:          string
  title:       string
  description: string
  priceINR:    number
  pages:       number
  lang:        LanguageCode[]
  turnaround:  string    // e.g. "24 hours"
  type:        'kundali' | 'compatibility' | 'muhurta' | 'annual'
}

/** Future: Marketplace engine contract */
export interface IMarketplaceEngine {
  listProducts(): PremiumReport[]
  createOrder(reportId: string, kundaliId: string, lang: LanguageCode): Promise<{ orderId: string; paymentUrl: string }>
  getOrderStatus(orderId: string): Promise<{ status: 'pending' | 'processing' | 'delivered'; downloadUrl?: string }>
}

// ── Folder structure (documentation) ─────────────────────────────────────────
//
// When implementing future modules, follow this structure:
//
// lib/engines/
//   dasha/           — IDashaEngine implementation
//   dosha/           — IDoshaEngine implementation
//   yoga-detection/  — IYogaDetectionEngine implementation
//   names/           — INameSuggestionEngine implementation
//   remedies/        — IRemedyEngine implementation (clearly advisory)
//   temples/         — ITempleEngine implementation
//   reports/         — IKundaliReportEngine implementation
//
// app/api/v1/
//   dasha/route.ts
//   dosha/route.ts
//   yogas/route.ts
//   names/route.ts
//   remedies/route.ts
//   temples/route.ts
//   reports/route.ts
//   marketplace/route.ts
//
// components/
//   dasha/            — Dasha timeline UI
//   dosha/            — Dosha analysis UI
//   reports/          — Report generation UI
//   marketplace/      — Premium report marketplace UI
