// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Content Constants  [RC1]
// Single source of truth for all page copy, navigation, and data.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name:        'VedRith',
  tagline:     'The Rhythm of Vedic Wisdom',
  poweredBy:   "Powered by Sharva's IT",
  description:
    "India's precision Vedic astrology platform — daily Panchanga, Vedic birth charts, Knowledge Base and Jyotisha Rules for 8 regional traditions, in English and Kannada.",
  url:         'https://vedrith.sharvasit.in',
  email:       'vedrithai@gmail.com',
  twitter:     '@vedrith',
  version:     'RC1',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Navigation — Part 5 (Header)
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Panchanga', labelKn: 'ಪಂಚಾಂಗ',   href: '/panchanga'  },
  { label: 'Kundali',   labelKn: 'ಕುಂಡಲಿ',    href: '/kundali'    },
  { label: 'Platform',  labelKn: 'ವೇದಿಕೆ',    href: '#platform'   },
  { label: 'Roadmap',   labelKn: 'ರೋಡ್‌ಮ್ಯಾಪ್', href: '#roadmap'   },
  { label: 'About',     labelKn: 'ನಮ್ಮ ಬಗ್ಗೆ',  href: '#about'      },
] as const

export const STATS = [
  { value: '2',    label: 'Languages (Live)'   },
  { value: '8+',   label: 'Regional Traditions' },
  { value: '6',    label: 'Live Modules'        },
  { value: 'RC1',  label: 'Release Candidate'  },
] as const

// ─────────────────────────────────────────────────────────────────────────────
// LIVE NOW modules — Part 2 (Homepage)
// ─────────────────────────────────────────────────────────────────────────────

export interface LiveModule {
  id:          string
  icon:        string
  title:       string
  titleKn:     string
  description: string
  descriptionKn: string
  href:        string
  status:      'LIVE' | 'COMING_SOON'
}

export const LIVE_MODULES: LiveModule[] = [
  {
    id:          'panchanga',
    icon:        '📅',
    title:       'Panchanga',
    titleKn:     'ಪಂಚಾಂಗ',
    description: "Daily Tithi, Nakshatra, Yoga, Karana & Vara for any Indian city.",
    descriptionKn: "ಪ್ರತಿದಿನದ ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ ಮತ್ತು ವಾರ.",
    href:        '/panchanga',
    status:      'LIVE',
  },
  {
    id:          'kundali',
    icon:        '⭕',
    title:       'Kundali',
    titleKn:     'ಕುಂಡಲಿ',
    description: "Complete Vedic birth chart with planetary positions, Lagna, house placements and planetary dignities.",
    descriptionKn: "ಗ್ರಹ ಸ್ಥಾನ ಮತ್ತು ದಶಾ ಸಮೇತ ಜನ್ಮ ಕುಂಡಲಿ.",
    href:        '/kundali',
    status:      'LIVE',
  },
  {
    id:          'knowledge',
    icon:        '📖',
    title:       'Knowledge Base',
    titleKn:     'ಜ್ಞಾನ ಭಂಡಾರ',
    description: "Tap any Panchanga element to open its classical knowledge card — deity, meaning, suitable activities.",
    descriptionKn: "ಪಂಚಾಂಗದ ಯಾವುದೇ ಅಂಶವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ ಜ್ಞಾನ ಕಾರ್ಡ್ ತೆರೆಯಿರಿ.",
    href:        '/panchanga',
    status:      'LIVE',
  },
  {
    id:          'rules',
    icon:        '⚖️',
    title:       'Rules Engine',
    titleKn:     'ನಿಯಮ ಯಂತ್ರ',
    description: "Jyotisha-based activity recommendations shown in daily Panchanga — what to avoid and what to do today.",
    descriptionKn: "ದೈನಂದಿನ ಪಂಚಾಂಗದಲ್ಲಿ ಜ್ಯೋತಿಷ ಆಧಾರಿತ ಚಟುವಟಿಕೆ ಶಿಫಾರಸುಗಳು.",
    href:        '/panchanga',
    status:      'LIVE',
  },
  {
    id:          'search',
    icon:        '🔍',
    title:       'Smart Search',
    titleKn:     'ಸ್ಮಾರ್ಟ್ ಹುಡುಕಾಟ',
    description: "Search Nakshatras, Tithis, festivals and Vedic terms — press / or click the search icon in the header.",
    descriptionKn: "ನಕ್ಷತ್ರ, ತಿಥಿ, ಹಬ್ಬ ಮತ್ತು ವೈದಿಕ ಪದಗಳನ್ನು ಹುಡುಕಿ — ಹೆಡರ್‌ನಲ್ಲಿ ಹುಡುಕಾಟ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    href:        '/?search=1',
    status:      'LIVE',
  },
  {
    id:          'notifications',
    icon:        '🔔',
    title:       'Notifications',
    titleKn:     'ಸೂಚನೆಗಳು',
    description: "Festival alerts, Panchanga reminders & personal push notifications — architecture complete, launching with auth in V2.",
    descriptionKn: "ಹಬ್ಬ ಎಚ್ಚರಿಕೆ, ಪಂಚಾಂಗ ಜ್ಞಾಪನೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸೂಚನೆಗಳು — V2 ರಲ್ಲಿ ಬರುತ್ತದೆ.",
    href:        '/#roadmap',
    status:      'COMING_SOON',
  },
  {
    id:          'temple',
    icon:        '🛕',
    title:       'Temple Directory',
    titleKn:     'ದೇವಸ್ಥಾನ ನಿರ್ದೇಶಿಕೆ',
    description: "Geo-search across 1,000+ verified temples with daily timings.",
    descriptionKn: "1,000+ ದೇವಸ್ಥಾನಗಳ ಜಿಯೋ-ಹುಡುಕಾಟ ಮತ್ತು ದೈನಂದಿನ ಸಮಯ.",
    href:        '/#roadmap',
    status:      'COMING_SOON',
  },
  {
    id:          'devotional',
    icon:        '🙏',
    title:       'Devotional Library',
    titleKn:     'ಭಕ್ತಿ ಗ್ರಂಥಾಲಯ',
    description: "Stotras, mantras & vratas in Sanskrit with transliteration.",
    descriptionKn: "ಸ್ತೋತ್ರ, ಮಂತ್ರ ಮತ್ತು ವ್ರತಗಳು ಸಂಸ್ಕೃತದಲ್ಲಿ.",
    href:        '/#roadmap',
    status:      'COMING_SOON',
  },
  {
    id:          'family',
    icon:        '👨‍👩‍👧',
    title:       'Family Dashboard',
    titleKn:     'ಕುಟುಂಬ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    description: "Manage your entire family's spiritual calendar in one place.",
    descriptionKn: "ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಕುಟುಂಬ ಆಧ್ಯಾತ್ಮಿಕ ಕ್ಯಾಲೆಂಡರ್ ನಿರ್ವಹಿಸಿ.",
    href:        '/#roadmap',
    status:      'COMING_SOON',
  },
  {
    id:          'muhurta',
    icon:        '⏰',
    title:       'Muhurta Engine',
    titleKn:     'ಮುಹೂರ್ತ ಯಂತ್ರ',
    description: "Jyotisha-scored auspicious timing for ceremonies & milestones.",
    descriptionKn: "ಸಮಾರಂಭ ಮತ್ತು ಮಹತ್ವದ ಸಂದರ್ಭಗಳಿಗೆ ಮಂಗಳಕರ ಸಮಯ.",
    href:        '/#roadmap',
    status:      'COMING_SOON',
  },
  {
    id:          'matchmaking',
    icon:        '💞',
    title:       'Matchmaking',
    titleKn:     'ಮ್ಯಾಚ್‌ಮೇಕಿಂಗ್',
    description: "Ashtakoot Guna Milan — 36-point compatibility analysis.",
    descriptionKn: "ಅಷ್ಟಕೂಟ ಗುಣ ಮಿಲಾನ — 36 ಅಂಕ ಸಾಮರಸ್ಯ ವಿಶ್ಲೇಷಣೆ.",
    href:        '/#roadmap',
    status:      'COMING_SOON',
  },
  {
    id:          'numerology',
    icon:        '🔢',
    title:       'Numerology',
    titleKn:     'ಅಂಕ ಶಾಸ್ತ್ರ',
    description: "Vedic, Chaldean & Pythagorean numerology systems.",
    descriptionKn: "ವೈದಿಕ, ಚಾಲ್ಡಿಯನ್ ಮತ್ತು ಪೈಥಾಗರಿಯನ್ ಅಂಕ ವ್ಯವಸ್ಥೆ.",
    href:        '/#roadmap',
    status:      'COMING_SOON',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────────────────────

export type FeatureTier = 'Free'

export interface Feature {
  id:          string
  iconPath:    string
  title:       string
  description: string
  tier:        FeatureTier
  status:      'LIVE' | 'soon' | 'planned' | 'future'
  href?: string
}

export const FEATURES: Feature[] = [
  {
    id:          'panchanga',
    iconPath:    'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 2a8 8 0 1 1 0 16A8 8 0 0 1 12 4zm0 1L12 12l5 3',
    title:       'Panchanga',
    description: 'Daily Tithi, Nakshatra, Yoga, Karana and Vara for any Indian city. Supports 8 regional traditions including Telugu, Tamil, Kannada and Malayalam.',
    tier:        'Free',
    status:      'LIVE',
    href:        '/panchanga',
  },
  {
    id:          'kundali',
    iconPath:    'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM4 12h16M12 4v16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7',
    title:       'Kundali Generation',
    description: 'Complete Vedic birth chart with planetary positions, Lagna, 12 house cusps, house placements, planetary dignities, Rashi, and Nakshatra — in South and North Indian styles.',
    tier:        'Free',
    status:      'LIVE',
    href:        '/kundali',
  },
  {
    id:          'knowledge',
    iconPath:    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
    title:       'Knowledge Base',
    description: 'Every Nakshatra, Tithi, Yoga, and Karana explains itself. Tap any result to see its classical meaning, ruling deity, and suitable activities.',
    tier:        'Free',
    status:      'LIVE',
  },
  {
    id:          'muhurta',
    iconPath:    'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
    title:       'Muhurta Engine',
    description: 'Jyotisha-scored auspicious timing for marriage, griha pravesha, business launch, travel, and naming ceremonies. Weighted across Tithi, Nakshatra, Yoga and Lagna strength.',
    tier:        'Free',
    status:      'soon',
  },
  {
    id:          'temple',
    iconPath:    'M3 21h18M5 21V10l7-7 7 7v11M9 21v-6h6v6',
    title:       'Temple Directory',
    description: "Geo-search across verified temples with daily pooja timings and annual festival calendar, integrated with VedRith's Panchanga engine. Launching V2.",
    tier:        'Free',
    status:      'soon',
  },
  {
    id:          'devotional',
    iconPath:    'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-4.97-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 12 6z',
    title:       'Devotional Content',
    description: 'Curated library of stotras, mantras, and vratas in original Sanskrit with transliteration and translation. Daily devotion plan personalised to your Panchanga.',
    tier:        'Free',
    status:      'soon',
  },
  {
    id:          'family',
    iconPath:    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title:       'Family Dashboard',
    description: "Manage your entire family's spiritual calendar in one place. Birth charts for all members, tithi-based anniversaries, upcoming ceremonies, and Pitru Paksha reminders.",
    tier:        'Free',
    status:      'soon',
  },
  {
    id:          'matchmaking',
    iconPath:    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    title:       'Matchmaking',
    description: 'Ashtakoot Guna Milan (36-point compatibility) with Mangal Dosha comparison, Nadi analysis, and comprehensive compatibility report. Coming in V2.',
    tier:        'Free',
    status:      'soon',
  },
  {
    id:          'numerology',
    iconPath:    'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
    title:       'Numerology',
    description: 'Chaldean, Pythagorean, and Vedic numerology systems. Life Path, Destiny, Soul Urge, and Personality numbers with multi-script Indian name support. Coming in V2.5.',
    tier:        'Free',
    status:      'planned',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap — Part 3 (Remove Monetisation, update languages)
// ─────────────────────────────────────────────────────────────────────────────

export type RoadmapStatus = 'building' | 'upcoming' | 'planned' | 'future'

export interface RoadmapMilestone {
  version:   string
  label:     string
  timeline:  string
  status:    RoadmapStatus
  features:  string[]
}

export const ROADMAP: RoadmapMilestone[] = [
  {
    version:  'RC1',
    label:    'Release Candidate',
    timeline: 'Live Now',
    status:   'building',
    features: [
      'Panchanga (8 regional traditions)',
      'Kundali with planetary positions & charts',
      'Knowledge Base (27 Nakshatras)',
      'Rules Engine (Jyotisha)',
      'Notification Platform',
      'Smart Search',
      'Share Cards',
      'English + Kannada (Live)',
    ],
  },
  {
    version:  'V2',
    label:    'Advanced Astrology',
    timeline: 'H2 2026',
    status:   'upcoming',
    features: [
      'Matchmaking (Ashtakoot)',
      'Guna Milan (36-point)',
      'Mangal Dosha Check',
      'Temple Directory',
      'Devotional Content',
      'Family Dashboard',
    ],
  },
  {
    version:  'V2.5',
    label:    'Extended Features',
    timeline: 'Q4 2026',
    status:   'planned',
    features: [
      'Vedic Numerology',
      'Muhurta Engine',
      'Family Matchmaking',
      'Developer API',
      'Webhook Integrations',
    ],
  },
  {
    version:  'V3',
    label:    'Regional Expansion',
    timeline: 'Q4 2026',
    status:   'planned',
    features: [
      'Hindi, Tamil, Telugu (Live)',
      'Malayalam, Marathi (Live)',
      'Hasta Rekha (Palm Reading)',
      'Expanded Temple Network',
    ],
  },
  {
    version:  'V4',
    label:    'Voice & Expansion',
    timeline: '2027',
    status:   'future',
    features: [
      'Spiritual Voice Assistant',
      'Daily Audio Panchanga',
      'Multi-Language TTS',
      'Conversational Guidance',
      'Smart Muhurta Alerts',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer:   string
}

export const FAQS: FAQItem[] = [
  {
    question: 'What is VedRith?',
    answer:
      'VedRith is a modern Vedic astrology platform built on classical Jyotiṣa principles with astronomical-grade precision. It delivers Panchanga, Kundali, Knowledge Base, Rules Engine, and Notifications — in English and Kannada. Powered by Sharva\'s IT.',
  },
  {
    question: 'Which regional Panchanga traditions does VedRith support?',
    answer:
      'VedRith supports Telugu, Tamil, Kannada, Malayalam, Gujarati, Maharashtrian, Bengali, and North Indian Panchanga traditions — each with region-specific Nakshatra names, month names, calendar epochs, and auspicious day rules.',
  },
  {
    question: 'How accurate are VedRith\'s calculations?',
    answer:
      'Astronomical calculations powered by the VedRith Astronomy Engine — a custom-built celestial mechanics implementation (VSOP87/ELP2000-based) achieving < 0.01° solar and < 0.1° lunar position accuracy. Ayanamsha options include Lahiri (the Indian Government standard), KP, Raman, and True Chitrapaksha.',
  },
  {
    question: 'What languages does VedRith currently support?',
    answer:
      'English and Kannada (ಕನ್ನಡ) are fully live. The interface, labels, Nakshatra names, and Panchanga content all switch correctly. Hindi, Tamil, Telugu, Malayalam, Gujarati, Marathi, and Bengali are architecturally ready and will go live progressively from V3.',
  },
  {
    question: 'Is VedRith free to use?',
    answer:
      'Yes. VedRith\'s current release (RC1) is completely free — Panchanga, Kundali, Knowledge Base, Rules Engine, and Smart Search are all available to everyone with no login required.',
  },
  {
    question: 'When will Temple Directory and Matchmaking launch?',
    answer:
      'Temple Directory, Devotional Library, and Matchmaking (Ashtakoot Guna Milan) are planned for V2, targeting Q1 2026. The Muhurta Engine and Numerology are planned for V2.5.',
  },
  {
    question: 'Who built VedRith?',
    answer:
      "VedRith is built and maintained by Sharva's IT — a technology company with deep expertise in Vedic computational systems. The platform is designed by practising Jyotiṣa scholars in collaboration with software architects.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Regional traditions
// ─────────────────────────────────────────────────────────────────────────────

export const REGIONAL_TRADITIONS = [
  'Telugu', 'Tamil', 'Kannada', 'Malayalam',
  'Gujarati', 'Marathi', 'Bengali', 'North Indian',
] as const

// Part 3: Only English + Kannada shown as enabled
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English',   native: 'English', live: true  },
  { code: 'kn', name: 'Kannada',   native: 'ಕನ್ನಡ',   live: true  },
  { code: 'hi', name: 'Hindi',     native: 'हिंदी',   live: false },
  { code: 'ta', name: 'Tamil',     native: 'தமிழ்',   live: false },
  { code: 'te', name: 'Telugu',    native: 'తెలుగు',   live: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം',  live: false },
  { code: 'mr', name: 'Marathi',   native: 'मराठी',   live: false },
  { code: 'gu', name: 'Gujarati',  native: 'ગુજરાતી',  live: false },
  { code: 'bn', name: 'Bengali',   native: 'বাংলা',   live: false },
] as const
