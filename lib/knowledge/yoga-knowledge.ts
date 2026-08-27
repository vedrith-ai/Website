// ─────────────────────────────────────────────────────────────────────────────
// VedRith Knowledge Base — Yoga
//
// 27 Yoga entries (Sun + Moon sidereal sum, 13°20' each).
// Content is static, hand-authored from classical Muhurta references
// (Muhurta Chintamani, Brihat Samhita). No AI generation.
//
// NOTE ON "DEITY/PRESIDING INFLUENCE": Unlike Nakshatras, the 27 Yogas do not
// each have a single, universally-agreed presiding deity in classical texts.
// Where a specific deity association is well-attested, it is given; otherwise
// the "deity" field describes the presiding QUALITY/INFLUENCE that classical
// Muhurta texts associate with that Yoga (e.g. "Auspicious/benefic influence
// akin to Guru"), which is the honest and accurate representation.
// ─────────────────────────────────────────────────────────────────────────────

export interface YogaKnowledge {
  key:         string   // Matches YOGA_NAMES[].en in localization.ts
  nameEn:      string
  nameKn:      string
  meaning:     string
  description: string
  deity:       string   // Presiding deity or quality-influence (see note above)
  symbol:      string
  suitableActivities: string[]
  avoidActivities:    string[]
}

export const YOGA_KNOWLEDGE: Record<string, YogaKnowledge> = {

  Vishkambha: {
    key: 'Vishkambha', nameEn: 'Vishkambha', nameKn: 'ವಿಷ್ಕಂಭ',
    meaning: 'Meaning "the prop" or "support that obstructs" — the first Yoga, carrying restrictive, obstacle-laden energy.',
    description: 'Vishkambha is classified as an inauspicious (Ashubha) Yoga. It is associated with delays and obstructions, particularly at the start of new endeavours. Patience and preparatory work are favoured over decisive action.',
    deity: 'Restrictive/obstructive influence (Ashubha)',
    symbol: 'A wooden prop or supporting beam',
    suitableActivities: [
      'Preparatory and planning work',
      'Removing obstacles in existing projects',
      'Defensive or protective measures',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Travel for important purposes',
      'Signing major agreements',
    ],
  },

  Priti: {
    key: 'Priti', nameEn: 'Priti', nameKn: 'ಪ್ರೀತಿ',
    meaning: 'Meaning "love" or "affection" — carries warm, harmonious, benefic energy.',
    description: 'Priti is classified as auspicious (Shubha). It supports relationships, joyful gatherings, and any activity benefiting from goodwill and cooperative spirit.',
    deity: 'Benefic, harmonising influence',
    symbol: 'Two hearts / clasped hands',
    suitableActivities: [
      'Marriage and relationship ceremonies',
      'Social gatherings and reconciliations',
      'Starting partnerships',
      'Artistic and romantic pursuits',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
      'Confrontational or adversarial undertakings',
    ],
  },

  Ayushman: {
    key: 'Ayushman', nameEn: 'Ayushman', nameKn: 'ಆಯುಷ್ಮಾನ್',
    meaning: 'Meaning "long-lived" or "possessing vitality" — associated with health, longevity, and sustained energy.',
    description: 'Ayushman is classified as auspicious (Shubha). It favours activities related to health, vitality, and endeavours intended to last and endure over time.',
    deity: 'Vitality/longevity-bestowing influence',
    symbol: 'A long, unbroken thread',
    suitableActivities: [
      'Health-related treatments and remedies',
      'Starting long-term projects',
      'Activities aimed at building stamina or resilience',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
      'Activities intended to be short-term or temporary may not benefit fully',
    ],
  },

  Saubhagya: {
    key: 'Saubhagya', nameEn: 'Saubhagya', nameKn: 'ಸೌಭಾಗ್ಯ',
    meaning: 'Meaning "good fortune" — carries auspicious, prosperity-bestowing energy.',
    description: 'Saubhagya is classified as auspicious (Shubha). It is associated with good luck, prosperity, and favourable outcomes, making it generally welcomed for important undertakings.',
    deity: 'Fortune-bestowing influence (akin to Lakshmi)',
    symbol: 'A vermillion mark (kumkum) / a lotus',
    suitableActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Financial activities and investments',
      'Housewarming (Griha Pravesha)',
    ],
    avoidActivities: [
      'Few restrictions — broadly auspicious',
    ],
  },

  Shobhana: {
    key: 'Shobhana', nameEn: 'Shobhana', nameKn: 'ಶೋಭನ',
    meaning: 'Meaning "beautiful" or "splendid" — carries graceful, auspicious energy.',
    description: 'Shobhana is classified as auspicious (Shubha). It favours activities related to beautification, celebration, and any endeavour benefiting from an elegant, well-presented outcome.',
    deity: 'Beneficial, beautifying influence',
    symbol: 'A decorated archway',
    suitableActivities: [
      'Decoration, design, and beautification projects',
      'Celebrations and festive occasions',
      'Starting new ventures — generally favourable',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Atiganda: {
    key: 'Atiganda', nameEn: 'Atiganda', nameKn: 'ಅತಿಗಂಡ',
    meaning: 'Meaning "great danger" or "severe obstacle" — carries intense, cautionary energy.',
    description: 'Atiganda is classified as inauspicious (Ashubha). Classical texts advise caution during this Yoga, particularly for activities involving risk, travel, or new commitments.',
    deity: 'Cautionary/obstructive influence (Ashubha)',
    symbol: 'A sharp blade or thorn',
    suitableActivities: [
      'Cautious review and risk assessment',
      'Defensive or protective preparations',
      'Postponing non-urgent decisions',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Travel, especially long-distance',
      'Risk-taking activities of any kind',
    ],
  },

  Sukarma: {
    key: 'Sukarma', nameEn: 'Sukarma', nameKn: 'ಸುಕರ್ಮ',
    meaning: 'Meaning "good deeds" or "righteous action" — carries virtuous, supportive energy.',
    description: 'Sukarma is classified as auspicious (Shubha). It favours activities rooted in good conduct, ethical action, and endeavours that benefit others.',
    deity: 'Virtue-supporting influence',
    symbol: 'An open book / a helping hand',
    suitableActivities: [
      'Charitable acts and community service',
      'Starting ethical business ventures',
      'Religious and spiritual ceremonies',
      'Educational pursuits',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Dhriti: {
    key: 'Dhriti', nameEn: 'Dhriti', nameKn: 'ಧೃತಿ',
    meaning: 'Meaning "steadfastness" or "fortitude" — carries stable, enduring energy.',
    description: 'Dhriti is classified as auspicious (Shubha). It favours activities requiring perseverance, stability, and a steady hand — particularly those intended to last.',
    deity: 'Stability-bestowing influence',
    symbol: 'A firmly planted pillar',
    suitableActivities: [
      'Foundation-laying for buildings',
      'Starting ventures requiring perseverance',
      'Activities related to commitment and discipline',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
      'Activities requiring rapid, frequent change',
    ],
  },

  Shula: {
    key: 'Shula', nameEn: 'Shula', nameKn: 'ಶೂಲ',
    meaning: 'Meaning "spear" or "piercing pain" — carries sharp, intense, cautionary energy.',
    description: 'Shula is classified as inauspicious (Ashubha). It is associated with sharp difficulties or "piercing" obstacles, and classical texts advise against initiating important matters during this Yoga.',
    deity: 'Sharp/piercing cautionary influence (Ashubha)',
    symbol: 'A trident or spear',
    suitableActivities: [
      'Activities requiring sharp focus on a single, well-understood task',
      'Medical procedures involving instruments (with appropriate professional guidance)',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Travel',
    ],
  },

  Ganda: {
    key: 'Ganda', nameEn: 'Ganda', nameKn: 'ಗಂಡ',
    meaning: 'Meaning "danger" or "obstacle" — carries challenging, restrictive energy.',
    description: 'Ganda is classified as inauspicious (Ashubha). Similar to Atiganda though generally considered less severe, it suggests obstacles that require careful navigation rather than direct confrontation.',
    deity: 'Obstacle-presenting influence (Ashubha)',
    symbol: 'A blocked pathway',
    suitableActivities: [
      'Reviewing and removing existing obstacles',
      'Cautious planning',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Important travel',
      'Signing agreements',
    ],
  },

  Vriddhi: {
    key: 'Vriddhi', nameEn: 'Vriddhi', nameKn: 'ವೃದ್ಧಿ',
    meaning: 'Meaning "growth" or "increase" — carries expansive, favourable energy.',
    description: 'Vriddhi is classified as auspicious (Shubha). It favours activities related to growth, expansion, and increase — whether material, intellectual, or spiritual.',
    deity: 'Growth/increase-bestowing influence',
    symbol: 'A sprouting seed',
    suitableActivities: [
      'Starting new ventures intended to grow',
      'Financial investments',
      'Educational beginnings',
      'Planting and agricultural activities',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
      'Activities intended to reduce or downsize',
    ],
  },

  Dhruva: {
    key: 'Dhruva', nameEn: 'Dhruva', nameKn: 'ಧ್ರುವ',
    meaning: 'Meaning "fixed" or "the pole star" — carries permanent, unwavering energy.',
    description: 'Dhruva is classified as auspicious (Shubha). Named after the fixed pole star, it favours activities intended to be permanent, stable, and enduring — ideal for foundational commitments.',
    deity: 'Permanence-bestowing influence',
    symbol: 'The pole star (Dhruva Nakshatra)',
    suitableActivities: [
      'Foundation-laying and construction',
      'Permanent commitments — marriage, long-term contracts',
      'Planting trees',
      'Establishing institutions',
    ],
    avoidActivities: [
      'Activities intended to be temporary or short-lived',
      'Few major restrictions otherwise',
    ],
  },

  Vyaghata: {
    key: 'Vyaghata', nameEn: 'Vyaghata', nameKn: 'ವ್ಯಾಘಾತ',
    meaning: 'Meaning "a striking blow" or "collision" — carries disruptive, cautionary energy.',
    description: 'Vyaghata is classified as inauspicious (Ashubha). It suggests sudden impacts or disruptions, and classical texts advise caution, particularly for travel and physical activities.',
    deity: 'Disruptive/colliding influence (Ashubha)',
    symbol: 'A clashing weapon',
    suitableActivities: [
      'Cautious, defensive preparations',
      'Activities requiring heightened awareness',
    ],
    avoidActivities: [
      'Travel, especially by vehicle',
      'Starting new ventures',
      'Physical activities involving risk of injury',
    ],
  },

  Harshana: {
    key: 'Harshana', nameEn: 'Harshana', nameKn: 'ಹರ್ಷಣ',
    meaning: 'Meaning "joy" or "delight" — carries cheerful, uplifting energy.',
    description: 'Harshana is classified as auspicious (Shubha). It favours joyful occasions, celebrations, and any activity that benefits from positive emotional energy.',
    deity: 'Joy-bestowing influence',
    symbol: 'A smiling face / blooming flowers',
    suitableActivities: [
      'Celebrations and festive occasions',
      'Starting new ventures with optimism',
      'Social gatherings',
      'Creative and artistic pursuits',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
      'Solemn or mourning-related activities',
    ],
  },

  Vajra: {
    key: 'Vajra', nameEn: 'Vajra', nameKn: 'ವಜ್ರ',
    meaning: 'Meaning "thunderbolt" or "diamond" — carries powerful, hard, dual-natured energy.',
    description: 'Vajra is classified as Mixed in influence. Like the thunderbolt of Indra, it carries great power that can be either constructive (breaking through obstacles) or destructive depending on application.',
    deity: 'Indra\'s thunderbolt — powerful dual influence',
    symbol: 'A diamond / a thunderbolt (vajra)',
    suitableActivities: [
      'Activities requiring decisive, powerful action',
      'Breaking through long-standing obstacles',
      'Activities related to diamonds, gems, or hard materials',
    ],
    avoidActivities: [
      'Activities requiring gentleness and subtlety',
      'Delicate negotiations',
    ],
  },

  Siddhi: {
    key: 'Siddhi', nameEn: 'Siddhi', nameKn: 'ಸಿದ್ಧಿ',
    meaning: 'Meaning "accomplishment" or "success" — one of the most auspicious Yogas.',
    description: 'Siddhi is classified as auspicious (Shubha) and is considered one of the most favourable Yogas overall, signifying the successful completion and fruition of endeavours.',
    deity: 'Accomplishment-bestowing influence',
    symbol: 'A completed mandala / a victory flag',
    suitableActivities: [
      'Starting new ventures — highly favoured',
      'Completing important projects',
      'Marriage and other major ceremonies',
      'Spiritual practices aimed at attainment',
    ],
    avoidActivities: [
      'Very few restrictions — among the most auspicious Yogas',
    ],
  },

  Vyatipata: {
    key: 'Vyatipata', nameEn: 'Vyatipata', nameKn: 'ವ್ಯತಿಪಾತ',
    meaning: 'Meaning "calamity" or "great misfortune" — one of the most inauspicious Yogas.',
    description: 'Vyatipata is classified as inauspicious (Ashubha) and is traditionally regarded as one of the more challenging Yogas, associated with sudden misfortune or downfall if important matters are initiated.',
    deity: 'Calamity-associated influence (Ashubha)',
    symbol: 'A falling object',
    suitableActivities: [
      'Protective and remedial rituals',
      'Cautious review of existing commitments',
    ],
    avoidActivities: [
      'Starting any new venture',
      'Travel',
      'Marriage and other major ceremonies',
      'Signing important documents',
    ],
  },

  Variyana: {
    key: 'Variyana', nameEn: 'Variyana', nameKn: 'ವರೀಯಾನ',
    meaning: 'Meaning "excellent" or "best" — carries superior, favourable energy.',
    description: 'Variyana is classified as auspicious (Shubha). It favours activities where excellence and superior outcomes are sought, supporting endeavours aimed at high quality.',
    deity: 'Excellence-bestowing influence',
    symbol: 'A garland of victory',
    suitableActivities: [
      'Starting new ventures aimed at high achievement',
      'Competitive activities',
      'Activities related to quality improvement',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Parigha: {
    key: 'Parigha', nameEn: 'Parigha', nameKn: 'ಪರಿಘ',
    meaning: 'Meaning "an iron club" or "barrier" — carries obstructive, defensive energy.',
    description: 'Parigha is classified as inauspicious (Ashubha). It suggests barriers and restrictions, similar in nature to a defensive wall — useful for protection but obstructive for new initiatives.',
    deity: 'Barrier/restriction-associated influence (Ashubha)',
    symbol: 'An iron club or barrier gate',
    suitableActivities: [
      'Defensive and protective measures',
      'Setting boundaries',
      'Securing existing assets',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Travel for new opportunities',
      'Expansion-related activities',
    ],
  },

  Shiva: {
    key: 'Shiva', nameEn: 'Shiva', nameKn: 'ಶಿವ',
    meaning: 'Meaning "auspicious" or "the benevolent one" — carries highly favourable, benedictory energy.',
    description: 'Shiva (the Yoga, distinct from the deity though sharing the name\'s auspicious meaning) is classified as auspicious (Shubha). It is associated with general well-being and blessed outcomes.',
    deity: 'Benedictory, auspicious influence',
    symbol: 'A blessing hand gesture (Abhaya Mudra)',
    suitableActivities: [
      'Starting new ventures',
      'Religious ceremonies and worship',
      'Marriage and other major life events',
    ],
    avoidActivities: [
      'Few restrictions — broadly auspicious',
    ],
  },

  Siddha: {
    key: 'Siddha', nameEn: 'Siddha', nameKn: 'ಸಿದ್ಧ',
    meaning: 'Meaning "accomplished" or "perfected" — carries fulfilling, successful energy.',
    description: 'Siddha is classified as auspicious (Shubha), closely related to Siddhi in meaning. It favours endeavours expected to reach successful, perfected completion.',
    deity: 'Fulfilment-bestowing influence',
    symbol: 'A completed yantra',
    suitableActivities: [
      'Starting new ventures',
      'Completing ongoing projects',
      'Spiritual practices and initiations',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Sadhya: {
    key: 'Sadhya', nameEn: 'Sadhya', nameKn: 'ಸಾಧ್ಯ',
    meaning: 'Meaning "achievable" or "to be accomplished" — carries supportive, goal-enabling energy.',
    description: 'Sadhya is classified as auspicious (Shubha). It supports activities aimed at achieving specific, well-defined goals, suggesting that effort during this Yoga is likely to bear fruit.',
    deity: 'Goal-enabling influence',
    symbol: 'A target or aim',
    suitableActivities: [
      'Starting goal-oriented projects',
      'Setting and pursuing specific objectives',
      'Educational and skill-building activities',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Shubha: {
    key: 'Shubha', nameEn: 'Shubha', nameKn: 'ಶುಭ',
    meaning: 'Meaning "auspicious" or "good" — carries universally favourable energy.',
    description: 'Shubha is classified as auspicious (Shubha) — its very name signifies general auspiciousness. It is broadly supportive of nearly all positive undertakings.',
    deity: 'General auspicious influence',
    symbol: 'A swastika or auspicious mark',
    suitableActivities: [
      'Starting new ventures of almost any kind',
      'Marriage and other ceremonies',
      'Travel',
    ],
    avoidActivities: [
      'Very few restrictions — among the most favourable Yogas',
    ],
  },

  Shukla: {
    key: 'Shukla', nameEn: 'Shukla', nameKn: 'ಶುಕ್ಲ',
    meaning: 'Meaning "bright" or "pure white" — carries clear, pure, favourable energy.',
    description: 'Shukla is classified as auspicious (Shubha). It is associated with clarity, purity, and brightness of outcome, favouring endeavours that benefit from a clean, untainted start.',
    deity: 'Purity/clarity-bestowing influence',
    symbol: 'A white lotus',
    suitableActivities: [
      'Starting new ventures',
      'Purification rituals',
      'Activities requiring clarity of intention',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Brahma: {
    key: 'Brahma', nameEn: 'Brahma', nameKn: 'ಬ್ರಹ್ಮ',
    meaning: 'Named after Brahma, the creator deity — carries creative, foundational energy.',
    description: 'Brahma is classified as auspicious (Shubha). It is associated with creation and new foundations, favouring activities related to beginnings of significant, often spiritual or intellectual, undertakings.',
    deity: 'Brahma (the creator)',
    symbol: 'The four-faced form of Brahma / a sacred lotus',
    suitableActivities: [
      'Starting new ventures, especially educational or spiritual',
      'Creative and intellectual pursuits',
      'Foundational ceremonies',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Mahendra: {
    key: 'Mahendra', nameEn: 'Mahendra', nameKn: 'ಮಹೇಂದ್ರ',
    meaning: 'Meaning "the great Indra" — carries powerful, authoritative, favourable energy.',
    description: 'Mahendra is classified as auspicious (Shubha). Named for the king of the gods, it favours activities related to leadership, authority, and matters requiring powerful backing.',
    deity: 'Indra (king of the gods) — in his greatest form',
    symbol: 'A royal crown / Indra\'s thunderbolt at rest',
    suitableActivities: [
      'Activities related to leadership and authority',
      'Starting new ventures requiring strong backing',
      'Ceremonies of investiture or appointment',
    ],
    avoidActivities: [
      'Few restrictions — broadly favourable',
    ],
  },

  Vaidhriti: {
    key: 'Vaidhriti', nameEn: 'Vaidhriti', nameKn: 'ವೈಧೃತಿ',
    meaning: 'Meaning "separation" or "discord" — the 27th and final Yoga, carrying disruptive, dissolving energy.',
    description: 'Vaidhriti is classified as inauspicious (Ashubha). As the final Yoga, it is associated with separation, discord, and dissolution — classical texts advise against initiating significant new matters.',
    deity: 'Separation/discord-associated influence (Ashubha)',
    symbol: 'A broken thread',
    suitableActivities: [
      'Concluding existing matters',
      'Activities related to separation when necessary (ending unhelpful situations)',
      'Protective and remedial rituals',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage and partnership ceremonies',
      'Travel',
      'Signing important agreements',
    ],
  },
}

/**
 * Lookup a Yoga knowledge entry by its localization key (English name).
 */
export function getYogaKnowledge(key: string): YogaKnowledge | null {
  return YOGA_KNOWLEDGE[key] ?? null
}
