// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Content Constants
// Single source of truth for all landing page copy and data
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name:        'VedRith',
  tagline:     'The Rhythm of Vedic Wisdom',
  poweredBy:   "Powered by Sharva's IT",
  description:
    "India's most precise Vedic astrology platform — delivering Panchanga, Kundali, Muhurta, Temple Directory, and devotional wisdom across all regional traditions, in your language.",
  url:         'https://vedrith.com',
  email:       'hello@vedrith.com',
  twitter:     '@vedrith',
} as const

export const NAV_LINKS = [
  { label: 'Features',  href: '#features'   },
  { label: 'About',     href: '#about'       },
  { label: 'Roadmap',   href: '#roadmap'     },
  { label: 'FAQ',       href: '#faq'         },
  { label: 'Contact',   href: '#contact'     },
] as const

export const STATS = [
  { value: '9',    label: 'Indian Languages'     },
  { value: '8+',   label: 'Regional Traditions'  },
  { value: '12+',  label: 'Spiritual Modules'    },
  { value: '100K', label: 'Users at Scale'       },
] as const

// ─────────────────────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────────────────────

export type FeatureTier = 'Free' | 'PRO' | 'Premium'

export interface Feature {
  id:          string
  iconPath:    string
  title:       string
  description: string
  tier:        FeatureTier
  status:      'live' | 'soon' | 'planned'
}

export const FEATURES: Feature[] = [
  {
    id:          'panchanga',
    iconPath:    'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 2a8 8 0 1 1 0 16A8 8 0 0 1 12 4zm0 1L12 12l5 3',
    title:       'Panchanga',
    description: 'Daily Tithi, Nakshatra, Yoga, Karana and Vara for any Indian city. Supports 8 regional traditions including Telugu, Tamil, Kannada and Malayalam.',
    tier:        'Free',
    status:      'live',
  },
  {
    id:          'kundali',
    iconPath:    'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM4 12h16M12 4v16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7',
    title:       'Kundali Generation',
    description: 'Complete Vedic birth chart with planetary positions, Lagna, 12 house cusps, Vimshottari Dasha sequence, divisional charts (D9, D10), Yoga and Dosha detection.',
    tier:        'Free',
    status:      'live',
  },
  {
    id:          'muhurta',
    iconPath:    'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
    title:       'Muhurta Engine',
    description: 'AI-scored auspicious timing for marriage, griha pravesha, business launch, travel, and naming ceremonies. Weighted across Tithi, Nakshatra, Yoga and Lagna strength.',
    tier:        'PRO',
    status:      'live',
  },
  {
    id:          'temple',
    iconPath:    'M3 21h18M5 21V10l7-7 7 7v11M9 21v-6h6v6',
    title:       'Temple Directory',
    description: "Geo-search across 1,000+ verified temples. Daily pooja timings, annual festival calendar, deity profiles — all integrated with VedRith's Panchanga engine.",
    tier:        'Free',
    status:      'live',
  },
  {
    id:          'devotional',
    iconPath:    'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-4.97-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 12 6z',
    title:       'Devotional Content',
    description: 'Curated library of stotras, mantras, and vratas in original Sanskrit with transliteration and translation. Daily devotion plan personalised to your Panchanga.',
    tier:        'Free',
    status:      'live',
  },
  {
    id:          'family',
    iconPath:    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title:       'Family Dashboard',
    description: "Manage your entire family's spiritual calendar in one place. Birth charts for all members, tithi-based anniversaries, upcoming ceremonies, and Pitru Paksha reminders.",
    tier:        'Free',
    status:      'live',
  },
  {
    id:          'knowledge',
    iconPath:    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
    title:       'Knowledge Base',
    description: 'Every Nakshatra, Tithi, Yoga, and Dosha explains itself. Tap any result to see its classical meaning, deity, suitable activities, remedies, and mantra.',
    tier:        'Free',
    status:      'live',
  },
  {
    id:          'matchmaking',
    iconPath:    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    title:       'Matchmaking',
    description: 'Ashtakoot Guna Milan (36-point compatibility) with Mangal Dosha comparison, Nadi analysis, and comprehensive compatibility report. Coming in V2.',
    tier:        'Premium',
    status:      'soon',
  },
  {
    id:          'numerology',
    iconPath:    'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
    title:       'Numerology',
    description: 'Chaldean, Pythagorean, and Vedic numerology systems. Life Path, Destiny, Soul Urge, and Personality numbers with multi-script Indian name support. Coming in V2.5.',
    tier:        'PRO',
    status:      'planned',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap
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
    version:  'V1',
    label:    'Foundation',
    timeline: 'Coming Soon',
    status:   'building',
    features: [
      'Panchanga (8 regional traditions)',
      'Kundali with Dashas + Vargas',
      'Muhurta Engine',
      'Temple Directory',
      'Devotional Content',
      'Family Dashboard',
      'Knowledge Base',
      '9 Indian Languages',
    ],
  },
  {
    version:  'V1.5',
    label:    'Monetisation',
    timeline: 'Q4 2025',
    status:   'upcoming',
    features: [
      'Razorpay Integration',
      'PRO & PREMIUM Plans',
      'Monthly + Annual Billing',
      'Subscription Dashboard',
      'PDF Chart Reports',
      'Priority Computation',
    ],
  },
  {
    version:  'V2',
    label:    'Advanced Astrology',
    timeline: 'Q1 2026',
    status:   'planned',
    features: [
      'Matchmaking (Ashtakoot)',
      'Guna Milan (36-point)',
      'Mangal Dosha Check',
      'Numerology System',
      'Kundali API Access',
      'Advanced Shadbala',
    ],
  },
  {
    version:  'V2.5',
    label:    'Extended Features',
    timeline: 'Q2 2026',
    status:   'planned',
    features: [
      'Vedic Numerology',
      'Family Matchmaking',
      'Developer API',
      'Webhook Integrations',
      'White-label Options',
    ],
  },
  {
    version:  'V3',
    label:    'New Modalities',
    timeline: 'Q3 2026',
    status:   'future',
    features: [
      'Hasta Rekha (Palm Reading)',
      'Mukha Lakshana (Face Reading)',
      'AI-Powered Interpretation',
      'Image Analysis Engine',
      'Expanded Temple Network',
    ],
  },
  {
    version:  'V4',
    label:    'Voice & AI',
    timeline: 'Q4 2026+',
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
      'VedRith is a modern Vedic astrology platform built on classical Jyotiṣa principles with astronomical-grade precision. It delivers Panchanga, Kundali, Muhurta, Temple Directory, Devotional content, and a self-explaining Knowledge Base — in 9 Indian languages, across 8 regional traditions. It is powered by Sharva\'s IT.',
  },
  {
    question: 'Which regional Panchanga traditions does VedRith support?',
    answer:
      'VedRith supports Telugu, Tamil, Kannada, Malayalam, Gujarati, Maharashtrian, Bengali, and North Indian Panchanga traditions — each with region-specific Nakshatra names, month names, calendar epochs, and auspicious day rules. No other platform treats regional variation this faithfully.',
  },
  {
    question: 'How accurate are VedRith\'s calculations?',
    answer:
      'VedRith uses the Swiss Ephemeris (WASM build) — the same astronomical library used by professional planetarium software — for sub-arc-second planetary position accuracy. Ayanamsha options include Lahiri (the Indian Government standard), KP, Raman, and True Chitrapaksha. Every calculation follows classical Jyotiṣa rules without approximation.',
  },
  {
    question: 'What languages does VedRith support?',
    answer:
      'VedRith supports English, Hindi, Telugu, Tamil, Kannada, Malayalam, Gujarati, Marathi, and Bengali — with full Indic script rendering using Noto fonts. Astrological term names (Nakshatra, Tithi, Yoga) are shown in their canonical regional form, not just translated.',
  },
  {
    question: 'Is VedRith free to use?',
    answer:
      'Yes. VedRith has a generous free tier covering Panchanga, one Kundali chart, Temple Directory, Devotional Content, Family Dashboard, and the full Knowledge Base. PRO and PREMIUM plans (via Razorpay, launching V1.5) unlock multiple charts, Muhurta, PDF reports, Matchmaking, and Numerology.',
  },
  {
    question: 'When will VedRith launch?',
    answer:
      'VedRith V1 (Foundation) is currently in active development. Join the waitlist to receive early access before the public launch, priority support, and a discounted first-year PRO subscription.',
  },
  {
    question: 'Does VedRith support Kundali matching for marriage?',
    answer:
      'Yes, but in V2. The Matchmaking module will deliver full Ashtakoot Guna Milan (36-point compatibility scoring), Mangal Dosha cross-check with Dosha Samya analysis, and Nadi compatibility — with a detailed narrative report. It is architecturally complete and will be released as V2.',
  },
  {
    question: 'Who built VedRith?',
    answer:
      "VedRith is built and maintained by Sharva's IT — a technology company with deep expertise in Vedic computational systems. The platform is designed by practising Jyotiṣa scholars in collaboration with software architects, ensuring every calculation is both technically precise and classically faithful.",
  },
  {
    question: 'Can I use VedRith for my entire family?',
    answer:
      "Yes. The Family Dashboard (free tier) lets you create and manage birth profiles for every family member, track tithi-based death anniversaries (Shraddha dates), upcoming ceremonies, and Kula Devata festival dates — all in one spiritual calendar for your family.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Regional traditions shown in About section
// ─────────────────────────────────────────────────────────────────────────────

export const REGIONAL_TRADITIONS = [
  'Telugu', 'Tamil', 'Kannada', 'Malayalam',
  'Gujarati', 'Marathi', 'Bengali', 'North Indian',
] as const

export const SUPPORTED_LANGUAGES = [
  'English', 'हिंदी', 'తెలుగు', 'தமிழ்',
  'ಕನ್ನಡ', 'മലയാളം', 'ગુજરાતી', 'मराठी', 'বাংলা',
] as const
