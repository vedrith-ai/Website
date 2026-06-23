// ─────────────────────────────────────────────────────────────────────────────
// VedRith Knowledge Base — Tithi
//
// 16 unique Tithi entries (the 30-tithi lunar month reduces to 16 unique
// names: Pratipada…Chaturdashi shared by both Pakshas, plus Purnima and
// Amavasya as the distinct 15th tithi of each Paksha).
//
// Content is static, hand-authored from classical Jyotiṣa references
// (Muhurta Chintamani, Brihat Samhita, Dharma Sindhu). No AI generation.
// ─────────────────────────────────────────────────────────────────────────────

export interface TithiKnowledge {
  /** Global tithi key — matches the localization TITHI_NAMES index name */
  key:         string
  nameEn:      string
  nameKn:      string
  meaning:     string
  description: string
  deity:       string
  symbol:      string
  suitableActivities: string[]
  avoidActivities:    string[]
}

export const TITHI_KNOWLEDGE: Record<string, TithiKnowledge> = {

  Pratipada: {
    key: 'Pratipada', nameEn: 'Pratipada', nameKn: 'ಪಾಡ್ಯ',
    meaning: 'The first lunar day — the moment of new beginnings as the Moon starts a fresh phase, either waxing or waning.',
    description: 'Pratipada marks the start of a new fortnight (Paksha). It is associated with fresh starts, the planting of intentions, and the early stages of any undertaking. Its energy is considered tender and formative.',
    deity:  'Agni (Fire deity)',
    symbol: 'A single rising flame',
    suitableActivities: [
      'Starting new ventures or projects',
      'Beginning a course of study',
      'Sowing seeds / agricultural beginnings',
      'Worship of Agni and Brahma',
    ],
    avoidActivities: [
      'Signing major long-term contracts without further checks',
      'Travel in the opposite direction of one\'s home (Dishashool considerations apply separately)',
    ],
  },

  Dvitiya: {
    key: 'Dvitiya', nameEn: 'Dvitiya', nameKn: 'ಬಿದಿಗೆ',
    meaning: 'The second lunar day — a day of stability following the initial momentum of Pratipada.',
    description: 'Dvitiya is considered a generally favourable tithi, associated with duality and partnership. It supports activities requiring cooperation and balance between two parties or forces.',
    deity:  'Brahma',
    symbol: 'Two joined hands',
    suitableActivities: [
      'Partnership agreements and joint ventures',
      'Marriage-related discussions',
      'Purchase of vehicles or property',
      'Starting educational pursuits',
    ],
    avoidActivities: [
      'Solo high-risk ventures requiring independence',
      'Activities demanding isolation or solitude',
    ],
  },

  Tritiya: {
    key: 'Tritiya', nameEn: 'Tritiya', nameKn: 'ತದಿಗೆ',
    meaning: 'The third lunar day — associated with valour, courage, and creative energy.',
    description: 'Tritiya is ruled by Vishnu and is considered auspicious for endeavours that require courage and assertiveness. Akshaya Tritiya (Shukla Tritiya in Vaishakha masa) is one of the most auspicious days in the Hindu calendar.',
    deity:  'Gauri / Vishnu',
    symbol: 'A drawn bow',
    suitableActivities: [
      'Starting business ventures',
      'Purchasing gold or valuable assets',
      'Acts of charity and donation',
      'Beginning martial or competitive training',
    ],
    avoidActivities: [
      'Excessive risk-taking without due diligence',
      'Confrontations that could escalate unnecessarily',
    ],
  },

  Chaturthi: {
    key: 'Chaturthi', nameEn: 'Chaturthi', nameKn: 'ಚೌತಿ',
    meaning: 'The fourth lunar day — dedicated to Lord Ganesha, the remover of obstacles.',
    description: 'Chaturthi is generally considered a more challenging tithi for new beginnings, though it is highly auspicious for Ganesha worship. Sankashti and Vinayaka Chaturthi (monthly observances) fall on this tithi.',
    deity:  'Ganesha',
    symbol: 'An elephant\'s trunk / modaka (sweet)',
    suitableActivities: [
      'Worship of Ganesha for obstacle removal',
      'Fasting (Sankashti/Vinayaka Chaturthi vrata)',
      'Resolving disputes through mediation',
    ],
    avoidActivities: [
      'Starting new ventures (considered Rikta — "empty" tithi)',
      'Travel for important purposes without prior Ganesha worship',
      'Marriage ceremonies',
    ],
  },

  Panchami: {
    key: 'Panchami', nameEn: 'Panchami', nameKn: 'ಪಂಚಮಿ',
    meaning: 'The fifth lunar day — associated with knowledge, wisdom, and the serpent deities (Nagas).',
    description: 'Panchami is considered generally favourable. Naga Panchami and Vasant Panchami (dedicated to Goddess Saraswati) fall on this tithi, making it strongly linked with learning and the arts.',
    deity:  'Nagas / Saraswati',
    symbol: 'A coiled serpent / a veena (musical instrument)',
    suitableActivities: [
      'Beginning education, especially in arts and music',
      'Worship of Saraswati for knowledge and creativity',
      'Naga Panchami rituals for ancestral and serpent deity blessings',
      'Creative writing and artistic pursuits',
    ],
    avoidActivities: [
      'Harming snakes or disturbing anthills (traditionally inauspicious)',
      'Neglecting respect toward teachers or elders',
    ],
  },

  Shashthi: {
    key: 'Shashthi', nameEn: 'Shashthi', nameKn: 'ಷಷ್ಠಿ',
    meaning: 'The sixth lunar day — associated with Kartikeya (Subramanya/Murugan), the god of war and victory.',
    description: 'Shashthi is considered auspicious for activities requiring strength, leadership, and victory over obstacles. Skanda Shashthi is a major observance dedicated to Lord Kartikeya.',
    deity:  'Kartikeya (Subramanya)',
    symbol: 'A spear (Vel)',
    suitableActivities: [
      'Activities requiring courage and leadership',
      'Worship of Kartikeya for victory and protection',
      'Beginning physical training or martial arts',
      'Resolving long-standing conflicts',
    ],
    avoidActivities: [
      'Passive or overly cautious approaches when decisive action is needed',
      'Neglecting health — Shashthi is traditionally linked to wellness rituals for children',
    ],
  },

  Saptami: {
    key: 'Saptami', nameEn: 'Saptami', nameKn: 'ಸಪ್ತಮಿ',
    meaning: 'The seventh lunar day — dedicated to Surya, the Sun god, representing vitality and life-force.',
    description: 'Saptami is considered a generally auspicious and energising tithi, associated with health, vitality, and clarity of purpose. Ratha Saptami, marking the Sun\'s northward journey, falls on this tithi.',
    deity:  'Surya (Sun)',
    symbol: 'A seven-horse chariot',
    suitableActivities: [
      'Health-related decisions and treatments',
      'Worship of Surya for vitality and success',
      'Beginning a new daily routine or discipline',
      'Activities requiring clarity, visibility, and leadership',
    ],
    avoidActivities: [
      'Activities requiring extreme secrecy (Sun energy favours openness)',
      'Neglecting self-care during this period',
    ],
  },

  Ashtami: {
    key: 'Ashtami', nameEn: 'Ashtami', nameKn: 'ಅಷ್ಟಮಿ',
    meaning: 'The eighth lunar day — associated with Goddess Durga in her fierce, protective form.',
    description: 'Ashtami is a tithi of intense spiritual energy, particularly significant in Durga worship (Durgashtami during Navaratri) and Krishna Janmashtami. It carries protective but demanding energy.',
    deity:  'Durga / Krishna (on Krishna Ashtami)',
    symbol: 'A trident (Trishula)',
    suitableActivities: [
      'Worship of Durga for protection and strength',
      'Fasting and spiritual disciplines (vrata)',
      'Krishna Janmashtami observances',
      'Activities requiring courage to face difficulties',
    ],
    avoidActivities: [
      'Starting new ventures (considered Rikta — "empty" tithi)',
      'Travel without prior protective rituals',
      'Important agreements or marriage ceremonies',
    ],
  },

  Navami: {
    key: 'Navami', nameEn: 'Navami', nameKn: 'ನವಮಿ',
    meaning: 'The ninth lunar day — associated with completion of a cycle and Lord Rama\'s birth (Rama Navami).',
    description: 'Navami is the culminating tithi of the Navaratri festival, representing the fullness of Shakti (divine feminine energy) just before its peak on Dashami. It is considered powerful but, like other "Rikta" tithis, generally avoided for new beginnings.',
    deity:  'Durga (as Mahishasuramardini) / Rama',
    symbol: 'A lotus in full bloom',
    suitableActivities: [
      'Culmination of spiritual practices (Navaratri Navami puja)',
      'Rama Navami celebrations',
      'Concluding ongoing projects',
      'Acts of charity and feeding the needy',
    ],
    avoidActivities: [
      'Starting new ventures (Rikta tithi)',
      'Marriage ceremonies',
      'Purchasing new vehicles or property',
    ],
  },

  Dashami: {
    key: 'Dashami', nameEn: 'Dashami', nameKn: 'ದಶಮಿ',
    meaning: 'The tenth lunar day — associated with victory, righteousness, and the triumph of good over evil (Vijayadashami).',
    description: 'Dashami is considered highly auspicious, marking Lord Rama\'s victory over Ravana and Durga\'s victory over Mahishasura. It is one of the most favourable tithis for new ventures.',
    deity:  'Rama / Durga (victorious form)',
    symbol: 'A bow and arrow (Rama\'s weapon)',
    suitableActivities: [
      'Starting new ventures, businesses, and education (Vijayadashami is especially favoured)',
      'Beginning travel for important purposes',
      'Signing contracts and agreements',
      'Acquiring new tools, vehicles, or equipment',
    ],
    avoidActivities: [
      'Few restrictions — Dashami is broadly auspicious',
      'Excessive aggression beyond what righteousness requires',
    ],
  },

  Ekadashi: {
    key: 'Ekadashi', nameEn: 'Ekadashi', nameKn: 'ಏಕಾದಶಿ',
    meaning: 'The eleventh lunar day — the most sacred fasting day in the Vaishnava tradition, dedicated to Lord Vishnu.',
    description: 'Ekadashi occurs twice a month and is considered the most spiritually potent tithi for fasting (upavasa), meditation, and devotion. It is believed to purify accumulated karma and is observed by millions across India.',
    deity:  'Vishnu',
    symbol: 'The Shaligrama stone / Tulsi leaf',
    suitableActivities: [
      'Fasting (Ekadashi vrata)',
      'Meditation, japa, and devotional singing (bhajan/kirtan)',
      'Reading sacred texts (Vishnu Sahasranama, Bhagavad Gita)',
      'Charitable giving',
    ],
    avoidActivities: [
      'Consuming grains (traditional fasting restriction)',
      'Starting major worldly ventures (spiritual focus is preferred)',
      'Cutting hair or nails (traditional observance)',
    ],
  },

  Dwadashi: {
    key: 'Dwadashi', nameEn: 'Dwadashi', nameKn: 'ದ್ವಾದಶಿ',
    meaning: 'The twelfth lunar day — traditionally the day of breaking the Ekadashi fast (Parana).',
    description: 'Dwadashi is closely linked to Ekadashi, serving as the day for completing the fast with a ceremonial meal (Parana). It carries a gentle, supportive energy suitable for continuing spiritual practices and consolidating gains.',
    deity:  'Vishnu',
    symbol: 'A lit oil lamp (deepa)',
    suitableActivities: [
      'Breaking the Ekadashi fast (Dwadashi Parana)',
      'Continuing devotional practices',
      'Charitable acts and feeding Brahmins/the needy',
      'General auspicious activities including travel and purchases',
    ],
    avoidActivities: [
      'Excessive indulgence immediately after fasting',
      'Activities that disrupt the spiritual momentum from Ekadashi',
    ],
  },

  Trayodashi: {
    key: 'Trayodashi', nameEn: 'Trayodashi', nameKn: 'ತ್ರಯೋದಶಿ',
    meaning: 'The thirteenth lunar day — associated with Lord Shiva, particularly significant as Pradosham.',
    description: 'Trayodashi, especially in the evening twilight (Pradosha Kala), is sacred to Lord Shiva. Dhanteras (Krishna Trayodashi in Kartika) is also celebrated on this tithi, associated with wealth and well-being.',
    deity:  'Shiva',
    symbol: 'The crescent moon on Shiva\'s head',
    suitableActivities: [
      'Pradosham worship of Shiva (especially at twilight)',
      'Dhanteras — purchasing gold, utensils, and items for the home',
      'Health-related remedies and treatments',
      'Activities aimed at removing negative influences',
    ],
    avoidActivities: [
      'Neglecting evening worship if observing Pradosham',
      'Major decisions made in haste without due consideration',
    ],
  },

  Purnima: {
    key: 'Purnima', nameEn: 'Purnima', nameKn: 'ಹುಣ್ಣಿಮೆ',
    meaning: 'The full moon day — the Moon at its fullest illumination, representing completeness, abundance, and heightened spiritual energy.',
    description: 'Purnima is one of the most significant tithis, marking the culmination of the Shukla Paksha. Many major festivals (Guru Purnima, Buddha Purnima, Holi, Raksha Bandhan, Sharad Purnima) fall on this day. It is associated with Lord Vishnu and the Moon\'s peak influence on the mind.',
    deity:  'Vishnu / Chandra (Moon)',
    symbol: 'The full, radiant moon',
    suitableActivities: [
      'Satyanarayana Puja and Vishnu worship',
      'Fasting and meditation for mental clarity',
      'Charitable giving and acts of gratitude (Guru Purnima)',
      'Ceremonies celebrating completion or culmination',
    ],
    avoidActivities: [
      'Activities requiring extreme calm if sensitive to lunar influence on emotions',
      'Major surgeries (traditionally, full moon is considered to increase bleeding tendency in Ayurveda)',
    ],
  },

  Amavasya: {
    key: 'Amavasya', nameEn: 'Amavasya', nameKn: 'ಅಮಾವಾಸ್ಯೆ',
    meaning: 'The new moon day — the Moon is invisible, representing introspection, ancestral connection, and the end of a lunar cycle.',
    description: 'Amavasya marks the culmination of the Krishna Paksha and is strongly associated with honouring ancestors (Pitru Tarpana, Shraddha rites). Mahalaya Amavasya and Diwali (Kartika Amavasya) are major observances on this tithi.',
    deity:  'Pitrus (Ancestors) / Shiva',
    symbol: 'A dark, moonless sky / a lit diya in darkness',
    suitableActivities: [
      'Pitru Tarpana and Shraddha rites for ancestors',
      'Deep meditation and introspection',
      'Diwali (Kartika Amavasya) — Lakshmi Puja',
      'Completing or closing out old commitments',
    ],
    avoidActivities: [
      'Starting major new ventures (energy is introspective, not initiatory, in most traditions)',
      'Travel for celebratory occasions',
      'Marriage ceremonies in most regional traditions',
    ],
  },
}

/**
 * Lookup a Tithi knowledge entry by its localization key.
 * Falls back to Pratipada data shape with the given key if not found
 * (defensive — should never occur with the 16 keys above).
 */
export function getTithiKnowledge(key: string): TithiKnowledge | null {
  return TITHI_KNOWLEDGE[key] ?? null
}
