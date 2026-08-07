// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Regional Profile System V1
//
// Regional profiles affect ONLY the traditional interpretation layer.
// Astronomical calculations (Panchanga Engine) are NEVER overridden.
//
// Default profile: Karnataka (Kannada Panchanga tradition)
//
// Design: Strategy pattern — each profile is a configuration object
// that the rule engine consults when applying regional overrides.
// ─────────────────────────────────────────────────────────────────────────────

import type { RegionalProfile } from './types'

export interface RegionalConfig {
  id:            RegionalProfile
  nameEn:        string
  nameLocal:     string
  description:   string
  defaultLang:   'en' | 'kn'
  /** Activities that have stronger emphasis in this region */
  emphasizedActivities: string[]
  /** Activities that are less observed in this region */
  deemphasizedActivities: string[]
  /** Regional festival specialties (e.g. Ugadi for Karnataka/AP, Pongal for TN) */
  specialFestivals: string[]
  /** Calendar system preference */
  calendarSystem: 'Chandramana' | 'Sauramana'
  /** Notes about regional Muhurta differences */
  muhurtaNotes:  string
  /** Whether this profile is fully implemented */
  implemented:   boolean
}

// ── Regional configurations ───────────────────────────────────────────────────

export const REGIONAL_PROFILES: Record<RegionalProfile, RegionalConfig> = {

  Karnataka: {
    id:          'Karnataka',
    nameEn:      'Karnataka (Kannada Tradition)',
    nameLocal:   'ಕರ್ನಾಟಕ (ಕನ್ನಡ ಪಂಚಾಂಗ ಪರಂಪರೆ)',
    description: 'The Kannada Panchanga tradition followed across Karnataka. Uses Chandramana (lunar) calendar with the Shaka era. Primary references: Mysuru Panchanga, Parabhava Samvatsara Panchanga (Gokarna tradition).',
    defaultLang: 'kn',
    emphasizedActivities: [
      'Gruha Pravesha',   // Very important in Kannada culture
      'Aksharabhyasa',    // Vidyarambha on Vijayadashami is a major Karnataka tradition
      'SpiritualPractices',
    ],
    deemphasizedActivities: [],
    specialFestivals: [
      'Ugadi',          // Karnataka New Year
      'Ganesha Chaturthi',
      'Navratri',
      'Vijayadashami',
      'Karthika Purnima',
      'Basava Jayanti',
      'Rajyotsava',
    ],
    calendarSystem: 'Chandramana',
    muhurtaNotes: 'Karnataka Panchangas traditionally follow the Drikganita (observational) system. Ayanamsha: Lahiri. The Gokarna Brahmana Panchanga is a primary reference for coastal Karnataka.',
    implemented: true,
  },

  Maharashtra: {
    id:          'Maharashtra',
    nameEn:      'Maharashtra (Marathi Tradition)',
    nameLocal:   'महाराष्ट्र (मराठी पंचांग परंपरा)',
    description: 'The Marathi Panchanga tradition. Uses Chandramana calendar with Shaka era. Primary reference: Deshpande Panchanga, Tilak Panchanga.',
    defaultLang: 'en',
    emphasizedActivities: [
      'GruhaPravesha',
      'BusinessOpening',
    ],
    deemphasizedActivities: [],
    specialFestivals: [
      'Gudi Padwa',     // Maharashtra New Year
      'Ganesh Chaturthi',
      'Gokul Ashtami',
      'Diwali',
      'Holi',
    ],
    calendarSystem: 'Chandramana',
    muhurtaNotes: 'Maharashtra follows similar Muhurta rules to Karnataka but has specific regional variations for Shraddha ceremonies and some marriage customs.',
    implemented: false,   // Future expansion
  },

  TamilNadu: {
    id:          'TamilNadu',
    nameEn:      'Tamil Nadu (Tamil Tradition)',
    nameLocal:   'தமிழ்நாடு (தமிழ் பஞ்சாங்க மரபு)',
    description: 'The Tamil Panchangam tradition. Uses Sauramana (solar) calendar with the Kollam era. Primary reference: Tamil Panchangam publications.',
    defaultLang: 'en',
    emphasizedActivities: [
      'Marriage',           // Tamil Muhurta is very detailed for Vivah
      'TempleVisit',        // Temple culture is central in Tamil tradition
      'SpiritualPractices',
    ],
    deemphasizedActivities: [],
    specialFestivals: [
      'Tamil New Year (Puthandu)',
      'Pongal',
      'Karthigai Deepam',
      'Skanda Shashthi',
      'Vaikunta Ekadashi',
    ],
    calendarSystem: 'Sauramana',
    muhurtaNotes: 'Tamil Panchangam uses the solar calendar; Muhurta computation for Tamil tradition differs in that the Tamil month (Chithirai, Vaikasi, etc.) is solar, not lunar. Some auspicious day rules differ from the northern tradition.',
    implemented: false,   // Future expansion
  },

  AndhraTelangana: {
    id:          'AndhraTelangana',
    nameEn:      'Andhra & Telangana (Telugu Tradition)',
    nameLocal:   'ఆంధ్రప్రదేశ్/తెలంగాణ (తెలుగు పంచాంగ సంప్రదాయం)',
    description: 'The Telugu Panchanga tradition, shared across Andhra Pradesh and Telangana. Uses Chandramana calendar.',
    defaultLang: 'en',
    emphasizedActivities: [
      'Marriage',
      'GruhaPravesha',
    ],
    deemphasizedActivities: [],
    specialFestivals: [
      'Ugadi',              // Telugu New Year
      'Dasara',
      'Bhogi',
      'Sankranti',
      'Bonalu',
    ],
    calendarSystem: 'Chandramana',
    muhurtaNotes: 'Telugu Panchanga follows essentially the same rules as Karnataka with minor regional variations in marriage and Griha Pravesha ceremonies.',
    implemented: false,   // Future expansion
  },

  Kerala: {
    id:          'Kerala',
    nameEn:      'Kerala (Malayalam Tradition)',
    nameLocal:   'കേരളം (മലയാളം പഞ്ചാംഗം)',
    description: 'The Kerala Panchangam tradition. Uses a mix of Sauramana and Chandramana systems. The Kollam era is used.',
    defaultLang: 'en',
    emphasizedActivities: [
      'Aksharabhyasa',
      'SpiritualPractices',
    ],
    deemphasizedActivities: [],
    specialFestivals: [
      'Vishu',              // Kerala New Year
      'Onam',
      'Thrissur Pooram',
      'Thiruvathira',
    ],
    calendarSystem: 'Sauramana',
    muhurtaNotes: 'Kerala follows the Parashurama Kshetra tradition with some unique astronomical conventions. The Kerala Panchangam has specific rules for Ashtamangalya and Prasna-based astrology.',
    implemented: false,   // Future expansion
  },

  NorthIndia: {
    id:          'NorthIndia',
    nameEn:      'North India (Hindi Belt Tradition)',
    nameLocal:   'उत्तर भारत (हिंदी पट्टी परंपरा)',
    description: 'The North Indian Panchanga tradition covering UP, Bihar, Rajasthan, MP, and related states. Uses Vikram Samvat calendar.',
    defaultLang: 'en',
    emphasizedActivities: [
      'Marriage',
      'Upanayana',
    ],
    deemphasizedActivities: [],
    specialFestivals: [
      'Navratri (both seasons)',
      'Ram Navami',
      'Janmashtami',
      'Chhath Puja',
      'Diwali',
      'Holi',
    ],
    calendarSystem: 'Chandramana',
    muhurtaNotes: 'North Indian tradition uses the Vikram Samvat year (which is 57 years ahead of the Gregorian year). Muhurta rules are broadly similar but there are specific variations for Solah Somvar Vrat and some regional marriage customs.',
    implemented: false,   // Future expansion
  },

  All: {
    id:          'All',
    nameEn:      'Pan-India (Universal)',
    nameLocal:   'सर्वभारतीय',
    description: 'Rules that apply universally across all regional traditions of Indian Panchanga.',
    defaultLang: 'en',
    emphasizedActivities: ['SpiritualPractices', 'TempleVisit'],
    deemphasizedActivities: [],
    specialFestivals: ['Diwali', 'Holi', 'Navratri', 'Dussehra'],
    calendarSystem: 'Chandramana',
    muhurtaNotes: 'The universal Muhurta rules from Muhurta Chintamani and Dharma Sindhu apply across all regional traditions.',
    implemented: true,
  },
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** Get a regional profile configuration. Defaults to Karnataka. */
export function getRegionalProfile(region: RegionalProfile = 'Karnataka'): RegionalConfig {
  return REGIONAL_PROFILES[region] ?? REGIONAL_PROFILES.Karnataka
}

/** List all implemented regional profiles */
export function getImplementedProfiles(): RegionalConfig[] {
  return Object.values(REGIONAL_PROFILES).filter(p => p.implemented)
}

/** List all profiles (including future ones) */
export function getAllProfiles(): RegionalConfig[] {
  return Object.values(REGIONAL_PROFILES)
}

/** Parse a region string from API params, with fallback to Karnataka */
export function parseRegion(input: unknown): RegionalProfile {
  const valid: RegionalProfile[] = [
    'Karnataka','Maharashtra','TamilNadu','AndhraTelangana','Kerala','NorthIndia','All'
  ]
  if (typeof input === 'string' && valid.includes(input as RegionalProfile)) {
    return input as RegionalProfile
  }
  return 'Karnataka'
}
