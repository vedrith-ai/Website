// ─────────────────────────────────────────────────────────────────────────────
// VedRith Knowledge Base — Karana
//
// 11 Karana entries: 7 Chara (movable) + 4 Sthira (fixed).
// Content is static, hand-authored from classical Muhurta references
// (Muhurta Chintamani, Brihat Samhita). No AI generation.
// ─────────────────────────────────────────────────────────────────────────────

export interface KaranaKnowledge {
  key:         string   // Matches karana.ts name output exactly
  nameEn:      string
  nameKn:      string
  isFixed:     boolean
  meaning:     string
  description: string
  deity:       string
  symbol:      string
  suitableActivities: string[]
  avoidActivities:    string[]
}

export const KARANA_KNOWLEDGE: Record<string, KaranaKnowledge> = {

  // ── 7 Chara (Movable) Karanas ─────────────────────────────────────────────

  Bava: {
    key: 'Bava', nameEn: 'Bava', nameKn: 'ಬವ', isFixed: false,
    meaning: 'The first of the movable Karanas — associated with steady, foundational beginnings.',
    description: 'Bava is generally considered auspicious (Shubha). It carries stable, supportive energy suitable for starting new activities that require a solid foundation.',
    deity: 'Indra',
    symbol: 'A firm foundation stone',
    suitableActivities: [
      'Starting new ventures',
      'Foundation-related activities',
      'General auspicious tasks',
    ],
    avoidActivities: [
      'Few restrictions — generally favourable',
    ],
  },

  Balava: {
    key: 'Balava', nameEn: 'Balava', nameKn: 'ಬಾಲವ', isFixed: false,
    meaning: 'Meaning "youthful strength" — associated with budding energy and early-stage growth.',
    description: 'Balava is generally considered auspicious (Shubha), carrying youthful, growing energy suitable for activities in their early, developing stages.',
    deity: 'Brahma',
    symbol: 'A young sapling',
    suitableActivities: [
      'Starting new ventures, especially those expected to grow',
      'Educational beginnings',
      'Activities involving young people or new initiatives',
    ],
    avoidActivities: [
      'Few restrictions — generally favourable',
    ],
  },

  Kaulava: {
    key: 'Kaulava', nameEn: 'Kaulava', nameKn: 'ಕೌಲವ', isFixed: false,
    meaning: 'Meaning "relating to family/lineage" — associated with familial and ancestral matters.',
    description: 'Kaulava is generally considered auspicious (Shubha), carrying energy related to family, lineage, and domestic harmony.',
    deity: 'Mitra (friendship/family bonds)',
    symbol: 'A family gathering',
    suitableActivities: [
      'Family-related ceremonies and gatherings',
      'Starting new ventures with family support',
      'Domestic activities',
    ],
    avoidActivities: [
      'Few restrictions — generally favourable',
    ],
  },

  Taitila: {
    key: 'Taitila', nameEn: 'Taitila', nameKn: 'ತೈತಿಲ', isFixed: false,
    meaning: 'Associated with oil and lubrication — symbolically representing smoothness and ease.',
    description: 'Taitila is generally considered auspicious (Shubha) to mixed. It carries energy associated with smoothing the path ahead, useful for activities that benefit from reduced friction.',
    deity: 'Aryaman',
    symbol: 'A vessel of oil',
    suitableActivities: [
      'Activities related to trade and commerce',
      'Smoothing over disputes or rough relations',
      'General tasks benefiting from ease of execution',
    ],
    avoidActivities: [
      'Few restrictions — generally favourable',
    ],
  },

  Garaja: {
    key: 'Garaja', nameEn: 'Garaja', nameKn: 'ಗರಜಿ', isFixed: false,
    meaning: 'Associated with thunder or roaring — carries bold, assertive energy.',
    description: 'Garaja is generally considered Mixed in influence. It carries assertive, attention-drawing energy — useful for activities requiring boldness, but can also indicate volatility.',
    deity: 'Vayu (associated with thunder/storm)',
    symbol: 'A roaring cloud',
    suitableActivities: [
      'Activities requiring bold announcements or assertiveness',
      'Activities related to communication and public speaking',
    ],
    avoidActivities: [
      'Activities requiring calm, quiet diplomacy',
      'Sensitive negotiations',
    ],
  },

  Vanija: {
    key: 'Vanija', nameEn: 'Vanija', nameKn: 'ವಣಿಜ', isFixed: false,
    meaning: 'Meaning "merchant" or "trade" — strongly associated with commerce and business.',
    description: 'Vanija is generally considered auspicious (Shubha), especially for commercial activities. It carries energy favourable for buying, selling, and all forms of trade.',
    deity: 'Lakshmi',
    symbol: 'A merchant\'s scale',
    suitableActivities: [
      'Starting business ventures',
      'Buying and selling — trade of all kinds',
      'Financial transactions',
    ],
    avoidActivities: [
      'Few restrictions for commercial activities',
      'Non-commercial spiritual undertakings may prefer other Karanas',
    ],
  },

  Vishti: {
    key: 'Vishti', nameEn: 'Vishti', nameKn: 'ವಿಷ್ಟಿ (ಭದ್ರಾ)', isFixed: false,
    meaning: 'Also known as "Bhadra" — meaning "auspicious" ironically, though traditionally regarded as the most challenging Karana for worldly activities.',
    description: 'Vishti (Bhadra) is classified as inauspicious (Ashubha) for most worldly activities, though paradoxically favourable for fierce, Tantric, or Shakti-oriented spiritual practices — hence the name "Bhadra" ("auspicious") in that specific context. For general purposes, it is treated with caution.',
    deity: 'Yama (in most contexts) / Kali (for Tantric practices)',
    symbol: 'A double-edged sword',
    suitableActivities: [
      'Fierce or protective spiritual practices (Tantric rituals, in appropriate traditions)',
      'Activities requiring confrontation of difficult truths',
      'Litigation in some traditions (mixed views — consult regional custom)',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Travel for important purposes',
      'Signing agreements',
    ],
  },

  // ── 4 Sthira (Fixed) Karanas ─────────────────────────────────────────────

  Shakuni: {
    key: 'Shakuni', nameEn: 'Shakuni', nameKn: 'ಶಕುನಿ', isFixed: true,
    meaning: 'Meaning "bird" — associated with omens and signs.',
    description: 'Shakuni is classified as inauspicious (Ashubha) for most direct undertakings, though it is traditionally associated with reading omens and signs. Caution is advised for important new beginnings.',
    deity: 'Garuda (the divine bird)',
    symbol: 'A bird in flight',
    suitableActivities: [
      'Observing omens and signs (traditional practice)',
      'Activities requiring careful observation before action',
      'Remedial rituals',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Important travel',
    ],
  },

  Chatushpada: {
    key: 'Chatushpada', nameEn: 'Chatushpada', nameKn: 'ಚತುಷ್ಪಾದ', isFixed: true,
    meaning: 'Meaning "four-footed" — associated with animals and grounded, material matters.',
    description: 'Chatushpada is classified as Mixed in influence. It carries energy associated with animals, livestock, and grounded material concerns. Considered favourable for matters relating to these areas, but generally avoided for major life ceremonies.',
    deity: 'Nandi (the bull, Shiva\'s mount)',
    symbol: 'A four-legged animal',
    suitableActivities: [
      'Activities related to livestock and animals',
      'Agricultural activities involving draft animals',
      'Grounded, practical material tasks',
    ],
    avoidActivities: [
      'Marriage ceremonies',
      'Starting significant new ventures',
      'Important spiritual initiations',
    ],
  },

  Naga: {
    key: 'Naga', nameEn: 'Naga', nameKn: 'ನಾಗ', isFixed: true,
    meaning: 'Meaning "serpent" — associated with hidden, latent, and transformative forces.',
    description: 'Naga is classified as inauspicious (Ashubha) for most direct new beginnings. It carries deep, hidden energy similar to a coiled serpent — powerful but requiring caution and respect.',
    deity: 'Nagas (serpent deities)',
    symbol: 'A coiled serpent',
    suitableActivities: [
      'Naga (serpent deity) worship and remedial rituals',
      'Activities involving introspection and inner work',
      'Research into hidden or underlying causes',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Travel and important agreements',
    ],
  },

  Kimstughna: {
    key: 'Kimstughna', nameEn: 'Kimstughna', nameKn: 'ಕಿಂಸ್ತುಘ್ನ', isFixed: true,
    meaning: 'Meaning "destroyer of sin/evil" — the first Karana of each lunar month, carrying purifying and protective energy.',
    description: 'Kimstughna is classified as auspicious (Shubha). As the Karana that occurs at the very start of each lunar month (during the latter part of Krishna Chaturdashi/Amavasya), it carries protective, purifying energy.',
    deity: 'Vishnu (in his protective aspect)',
    symbol: 'A protective shield',
    suitableActivities: [
      'Protective and purifying rituals',
      'Starting new ventures — generally favourable',
      'Remedial practices to remove negative influences',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },
}

/**
 * Lookup a Karana knowledge entry by its name (matches karana.ts output exactly).
 */
export function getKaranaKnowledge(key: string): KaranaKnowledge | null {
  return KARANA_KNOWLEDGE[key] ?? null
}
