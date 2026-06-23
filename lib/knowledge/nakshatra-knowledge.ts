// ─────────────────────────────────────────────────────────────────────────────
// VedRith Knowledge Base — Nakshatra
//
// 27 Nakshatra entries with classical meaning, ruling deity, symbol, and
// suitable/avoid activities. Static, hand-authored from classical Jyotiṣa
// references (Brihat Samhita, Muhurta Chintamani, Jataka Parijata).
// No AI generation.
// ─────────────────────────────────────────────────────────────────────────────

export interface NakshatraKnowledge {
  key:         string   // Matches NAKSHATRA_NAMES[].en in localization.ts
  nameEn:      string
  nameKn:      string
  meaning:     string
  description: string
  deity:       string
  symbol:      string
  suitableActivities: string[]
  avoidActivities:    string[]
}

export const NAKSHATRA_KNOWLEDGE: Record<string, NakshatraKnowledge> = {

  Ashwini: {
    key: 'Ashwini', nameEn: 'Ashwini', nameKn: 'ಅಶ್ವಿನಿ',
    meaning: 'The first Nakshatra, meaning "horse-woman" — associated with speed, healing, and new beginnings.',
    description: 'Ruled by the Ashwini Kumaras, the divine physician-twins, this Nakshatra carries energy of swift action, healing, and pioneering spirit. Natives often show initiative and a desire to help others quickly.',
    deity: 'Ashwini Kumaras (divine healers)',
    symbol: "Horse's head",
    suitableActivities: [
      'Starting medical treatments or healing practices',
      'Beginning journeys, especially involving vehicles',
      'Quick decision-making tasks',
      'Sports and physical activities',
    ],
    avoidActivities: [
      'Slow, methodical tasks requiring patience',
      'Activities requiring long-term commitment without flexibility',
    ],
  },

  Bharani: {
    key: 'Bharani', nameEn: 'Bharani', nameKn: 'ಭರಣಿ',
    meaning: 'Meaning "the bearer" — associated with restraint, transformation, and the carrying of burdens (literal and karmic).',
    description: 'Ruled by Yama, the god of death and dharma, Bharani is linked to transformation, discipline, and the consequences of action. It carries a serious, restrictive energy traditionally reserved for endings rather than beginnings.',
    deity: 'Yama (god of death/dharma)',
    symbol: 'Yoni (womb) / a vessel carrying something away',
    suitableActivities: [
      'Concluding tasks and finishing what was started',
      'Disciplinary actions and setting boundaries',
      'Activities related to transformation or letting go',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Travel for joyous occasions',
    ],
  },

  Krittika: {
    key: 'Krittika', nameEn: 'Krittika', nameKn: 'ಕೃತ್ತಿಕಾ',
    meaning: 'Meaning "the cutters" — associated with fire, purification, and sharp, decisive action.',
    description: 'Ruled by Agni, the fire god, Krittika carries purifying and transformative energy. It is associated with cutting through obstacles, sharp intellect, and intense focus, but can also bring sudden, fiery outcomes.',
    deity: 'Agni (fire god)',
    symbol: 'A razor or flame',
    suitableActivities: [
      'Activities requiring sharp decision-making',
      'Purification rituals and fire ceremonies (Havan, Homa)',
      'Cutting ties with unhelpful situations',
      'Starting cooking-related or culinary ventures',
    ],
    avoidActivities: [
      'Activities requiring gentle, prolonged patience',
      'Avoid handling fire/sharp objects carelessly',
    ],
  },

  Rohini: {
    key: 'Rohini', nameEn: 'Rohini', nameKn: 'ರೋಹಿಣಿ',
    meaning: 'Meaning "the red one" or "the growing one" — considered the Moon\'s most beloved Nakshatra.',
    description: 'Ruled by Brahma (Prajapati, the creator) and presided over by the Moon, Rohini is associated with growth, fertility, beauty, and material abundance. It is one of the most auspicious Nakshatras for new ventures and creative endeavours.',
    deity: 'Brahma / Prajapati',
    symbol: 'An ox-cart or chariot',
    suitableActivities: [
      'Marriage and relationship ceremonies',
      'Starting agricultural activities (sowing, planting)',
      'Beginning creative and artistic projects',
      'Purchasing property or valuable assets',
      'Travel, especially southward',
    ],
    avoidActivities: [
      'Confrontational or argumentative undertakings',
      'Fire-related activities (some traditions advise caution)',
    ],
  },

  Mrigashira: {
    key: 'Mrigashira', nameEn: 'Mrigashira', nameKn: 'ಮೃಗಶಿರಾ',
    meaning: 'Meaning "deer\'s head" — associated with searching, curiosity, and gentle pursuit.',
    description: 'Ruled by Soma (the Moon deity) and presided over by Mars, this Nakshatra is linked to a searching, inquisitive nature — symbolised by a deer cautiously seeking. It favours exploration but can bring restlessness if unchecked.',
    deity: 'Soma / Chandra',
    symbol: "Deer's head",
    suitableActivities: [
      'Research and investigative work',
      'Travel for exploration or discovery',
      'Beginning a search (for a home, partner, or opportunity)',
      'Creative pursuits requiring sensitivity',
    ],
    avoidActivities: [
      'Decisions requiring firm, unwavering commitment',
      'Activities demanding singular focus without distraction',
    ],
  },

  Ardra: {
    key: 'Ardra', nameEn: 'Ardra', nameKn: 'ಆರ್ದ್ರಾ',
    meaning: 'Meaning "the moist one" — associated with storms, intensity, and transformative upheaval.',
    description: 'Ruled by Rudra (the fierce form of Shiva), Ardra carries intense, often turbulent energy — symbolised by storms that clear the air. It is associated with sudden change, emotional intensity, and breakthrough after difficulty.',
    deity: 'Rudra (fierce Shiva)',
    symbol: 'A teardrop or diamond',
    suitableActivities: [
      'Activities involving research, technology, or deep investigation',
      'Releasing pent-up emotions through appropriate outlets',
      'Tasks requiring intensity and transformation',
    ],
    avoidActivities: [
      'Starting new ventures (considered inauspicious by most traditions)',
      'Marriage ceremonies',
      'Travel — storms and turbulence are traditionally associated',
    ],
  },

  Punarvasu: {
    key: 'Punarvasu', nameEn: 'Punarvasu', nameKn: 'ಪುನರ್ವಸು',
    meaning: 'Meaning "return of the light" or "renewal" — associated with restoration, comfort, and a return to safety.',
    description: 'Ruled by Aditi, the mother goddess of cosmic order, Punarvasu represents renewal after hardship — like returning home after a long journey. It carries nurturing, restorative energy favourable for fresh starts following a difficult period.',
    deity: 'Aditi (mother of the gods)',
    symbol: 'A quiver of arrows / a house',
    suitableActivities: [
      'Returning to interrupted projects with renewed energy',
      'Moving to a new home',
      'Reconciliation and healing relationships',
      'Starting new ventures after a setback',
    ],
    avoidActivities: [
      'Permanent separations or endings',
      'Activities requiring aggressive, combative energy',
    ],
  },

  Pushya: {
    key: 'Pushya', nameEn: 'Pushya', nameKn: 'ಪುಷ್ಯ',
    meaning: 'Meaning "to nourish" or "flower" — considered one of the most auspicious Nakshatras overall.',
    description: 'Ruled by Brihaspati (Jupiter, the guru of the gods), Pushya carries nourishing, protective, and deeply auspicious energy. It is traditionally regarded as excellent for almost all positive undertakings, especially spiritual ones.',
    deity: 'Brihaspati (Jupiter)',
    symbol: "Cow's udder / a lotus flower",
    suitableActivities: [
      'Almost all auspicious activities — widely considered one of the best Nakshatras',
      'Religious ceremonies and spiritual initiations',
      'Starting education, especially in spiritual subjects',
      'Nurturing activities — caring for family, planting, feeding others',
    ],
    avoidActivities: [
      'Few restrictions — Pushya is broadly auspicious',
      'Some traditions avoid travel on Pushya in certain months',
    ],
  },

  Ashlesha: {
    key: 'Ashlesha', nameEn: 'Ashlesha', nameKn: 'ಆಶ್ಲೇಷಾ',
    meaning: 'Meaning "the embrace" or "entwining" — associated with serpents, hidden knowledge, and binding ties.',
    description: 'Ruled by the Sarpas (serpent deities), Ashlesha carries intense, penetrating, and sometimes secretive energy. It is associated with deep psychological insight but also with entanglements and hidden motives.',
    deity: 'Sarpas (Nagas/serpent deities)',
    symbol: 'A coiled serpent',
    suitableActivities: [
      'Research into hidden or occult subjects',
      'Activities requiring strategic, behind-the-scenes work',
      'Naga (serpent deity) worship for protection',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage and partnership agreements',
      'Important travel or relocations',
    ],
  },

  Magha: {
    key: 'Magha', nameEn: 'Magha', nameKn: 'ಮಘಾ',
    meaning: 'Meaning "the bountiful" or "great" — associated with royal power, ancestry, and authority.',
    description: 'Ruled by the Pitrus (ancestral spirits), Magha carries dignified, authoritative energy associated with leadership, legacy, and ancestral blessings. Natives often have a regal bearing and strong sense of tradition.',
    deity: 'Pitrus (Ancestors)',
    symbol: 'A royal throne / palanquin',
    suitableActivities: [
      'Ancestral rites and Pitru Tarpana',
      'Activities related to leadership, governance, or authority',
      'Ceremonies honouring family lineage and tradition',
    ],
    avoidActivities: [
      'Activities requiring humility or subordination over leadership',
      'Hasty decisions made without considering tradition or precedent',
    ],
  },

  'Purva Phalguni': {
    key: 'Purva Phalguni', nameEn: 'Purva Phalguni', nameKn: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ',
    meaning: 'Meaning "the former reddish one" — associated with pleasure, relaxation, and creative enjoyment.',
    description: 'Ruled by Bhaga, the god of fortune and enjoyment, this Nakshatra carries pleasant, sociable energy associated with relationships, romance, and creative pleasures. It favours activities of joy and celebration.',
    deity: 'Bhaga (god of fortune/enjoyment)',
    symbol: 'The front legs of a bed / a hammock',
    suitableActivities: [
      'Marriage and relationship ceremonies',
      'Creative arts — music, dance, performance',
      'Social gatherings and celebrations',
      'Activities related to rest, leisure, and enjoyment',
    ],
    avoidActivities: [
      'Activities requiring intense seriousness or austerity',
      'Important decisions requiring detachment from pleasure',
    ],
  },

  'Uttara Phalguni': {
    key: 'Uttara Phalguni', nameEn: 'Uttara Phalguni', nameKn: 'ಉತ್ತರ ಫಲ್ಗುಣಿ',
    meaning: 'Meaning "the latter reddish one" — associated with patronage, generosity, and beneficial partnerships.',
    description: 'Ruled by Aryaman, the god of patronage and contracts, Uttara Phalguni carries supportive, generous energy especially favourable for marriage, partnerships, and acts of mutual benefit.',
    deity: 'Aryaman (god of contracts/patronage)',
    symbol: 'The rear legs of a bed',
    suitableActivities: [
      'Marriage ceremonies — one of the most favoured Nakshatras for this',
      'Signing contracts and partnership agreements',
      'Acts of charity and generosity',
      'Starting new ventures with the support of others',
    ],
    avoidActivities: [
      'Solo undertakings that exclude collaboration',
      'Few other restrictions — broadly auspicious',
    ],
  },

  Hasta: {
    key: 'Hasta', nameEn: 'Hasta', nameKn: 'ಹಸ್ತ',
    meaning: 'Meaning "the hand" — associated with skill, craftsmanship, and dexterity.',
    description: 'Ruled by Savitar (an aspect of the Sun god associated with skillful creation), Hasta carries energy of precision, manual skill, and resourcefulness. It is favourable for any work involving the hands or detailed craftsmanship.',
    deity: 'Savitar (Sun aspect)',
    symbol: 'An open palm or hand',
    suitableActivities: [
      'Craftsmanship, art, and detailed manual work',
      'Starting business ventures, especially trade or commerce',
      'Learning new skills, particularly hands-on ones',
      'Healing practices involving touch (massage, physical therapy)',
    ],
    avoidActivities: [
      'Activities requiring you to relinquish control to others',
      'Few major restrictions — generally favourable',
    ],
  },

  Chitra: {
    key: 'Chitra', nameEn: 'Chitra', nameKn: 'ಚಿತ್ರಾ',
    meaning: 'Meaning "the brilliant one" or "bright" — associated with beauty, craftsmanship, and illusion.',
    description: 'Ruled by Tvashtar (Vishvakarma, the divine architect), Chitra carries energy of creativity, beauty, and design. It favours artistic and architectural pursuits but can also bring an element of illusion or appearances over substance.',
    deity: 'Tvashtar / Vishvakarma (divine architect)',
    symbol: 'A bright jewel or pearl',
    suitableActivities: [
      'Architecture, design, and construction beginnings',
      'Artistic and creative projects',
      'Purchasing jewellery or decorative items',
      'Activities related to personal appearance and presentation',
    ],
    avoidActivities: [
      'Decisions based purely on appearances without due diligence',
      'Marriage in some regional traditions (mixed views)',
    ],
  },

  Swati: {
    key: 'Swati', nameEn: 'Swati', nameKn: 'ಸ್ವಾತಿ',
    meaning: 'Meaning "the independent one" or "sword" — associated with self-reliance, movement, and flexibility.',
    description: 'Ruled by Vayu, the wind god, Swati carries energy of independence, adaptability, and movement — like a tree bending in the wind but not breaking. It favours travel, trade, and activities requiring flexibility.',
    deity: 'Vayu (wind god)',
    symbol: 'A young sprout swaying in the wind / coral',
    suitableActivities: [
      'Travel and movement-related activities',
      'Trade, business, and commerce',
      'Starting independent ventures',
      'Activities requiring adaptability and negotiation',
    ],
    avoidActivities: [
      'Activities requiring rigid, unchanging commitment',
      'Decisions made under pressure to remain inflexible',
    ],
  },

  Vishakha: {
    key: 'Vishakha', nameEn: 'Vishakha', nameKn: 'ವಿಶಾಖಾ',
    meaning: 'Meaning "forked" or "two-branched" — associated with purposeful achievement and dual goals.',
    description: 'Ruled jointly by Indra and Agni, Vishakha carries determined, goal-oriented energy, often pursuing more than one objective simultaneously. It favours ambitious undertakings requiring sustained effort.',
    deity: 'Indra-Agni',
    symbol: 'A decorated archway / triumphal gate',
    suitableActivities: [
      'Starting ambitious, goal-oriented projects',
      'Activities requiring sustained determination',
      'Celebrations marking achievement or triumph',
    ],
    avoidActivities: [
      'Activities requiring singular, undivided focus on one goal only',
      'Marriage in some traditions (mixed views — consult regional custom)',
    ],
  },

  Anuradha: {
    key: 'Anuradha', nameEn: 'Anuradha', nameKn: 'ಅನುರಾಧಾ',
    meaning: 'Meaning "following Radha" or "subsequent success" — associated with friendship, devotion, and cooperative success.',
    description: 'Ruled by Mitra, the god of friendship and partnerships, Anuradha carries warm, cooperative energy favourable for building alliances, friendships, and group endeavours that lead to mutual success.',
    deity: 'Mitra (god of friendship)',
    symbol: 'A lotus / a triumphal archway',
    suitableActivities: [
      'Building friendships and alliances',
      'Group projects and collaborative ventures',
      'Travel for diplomatic or relationship-building purposes',
      'Starting new ventures with partners',
    ],
    avoidActivities: [
      'Solo undertakings that exclude others',
      'Activities that could damage existing friendships',
    ],
  },

  Jyeshtha: {
    key: 'Jyeshtha', nameEn: 'Jyeshtha', nameKn: 'ಜ್ಯೇಷ್ಠಾ',
    meaning: 'Meaning "the eldest" or "senior-most" — associated with seniority, authority, and protective responsibility.',
    description: 'Ruled by Indra, the king of the gods, Jyeshtha carries authoritative, protective but sometimes burdensome energy — like the responsibility of being the eldest. It is traditionally considered challenging for new beginnings.',
    deity: 'Indra (king of the gods)',
    symbol: 'An earring / a closed umbrella',
    suitableActivities: [
      'Taking on leadership responsibilities (when unavoidable)',
      'Protective actions for family or community',
      'Resolving hierarchical disputes',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Travel for pleasure or new relationships',
    ],
  },

  Moola: {
    key: 'Moola', nameEn: 'Moola', nameKn: 'ಮೂಲ',
    meaning: 'Meaning "the root" — associated with foundations, investigation, and getting to the root of matters.',
    description: 'Ruled by Nirrti (Alakshmi), the goddess of destruction and dissolution, Moola carries intense, root-seeking energy. It is associated with uprooting old structures to reveal foundational truths — powerful but often disruptive.',
    deity: 'Nirrti / Alakshmi',
    symbol: 'A bundle of roots / a lion\'s tail',
    suitableActivities: [
      'Research to find root causes of problems',
      'Activities involving uprooting, demolition, or starting from foundations',
      'Spiritual practices focused on detachment',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Construction of permanent structures (some traditions)',
    ],
  },

  'Purva Ashadha': {
    key: 'Purva Ashadha', nameEn: 'Purva Ashadha', nameKn: 'ಪೂರ್ವಾಷಾಢ',
    meaning: 'Meaning "the former invincible one" — associated with early victory, purification, and declaration.',
    description: 'Ruled by Apah, the water deity, Purva Ashadha carries purifying, invigorating energy associated with cleansing and the initial stages of achieving victory or invincibility.',
    deity: 'Apah (water deity)',
    symbol: 'A fan or winnowing basket',
    suitableActivities: [
      'Activities involving water — travel by sea, purification rituals',
      'Starting ventures that require an early competitive edge',
      'Cleansing and purification practices',
    ],
    avoidActivities: [
      'Activities requiring patience for a slow build-up',
      'Marriage in some traditions (mixed views)',
    ],
  },

  'Uttara Ashadha': {
    key: 'Uttara Ashadha', nameEn: 'Uttara Ashadha', nameKn: 'ಉತ್ತರಾಷಾಢ',
    meaning: 'Meaning "the latter invincible one" — associated with lasting victory, permanent achievement, and universal support.',
    description: 'Ruled by the Vishvedevas (universal deities), Uttara Ashadha carries stable, enduring energy associated with permanent achievements and victories that, once won, are not easily lost.',
    deity: 'Vishvedevas (universal gods)',
    symbol: 'An elephant tusk / a small bed',
    suitableActivities: [
      'Activities aimed at long-term, permanent results',
      'Starting ventures meant to endure',
      'Marriage ceremonies — considered favourable in several traditions',
      'Foundation-laying for buildings',
    ],
    avoidActivities: [
      'Short-term, temporary undertakings expecting quick results',
      'Few other major restrictions — broadly favourable',
    ],
  },

  Shravana: {
    key: 'Shravana', nameEn: 'Shravana', nameKn: 'ಶ್ರವಣ',
    meaning: 'Meaning "hearing" or "listening" — associated with learning, wisdom, and connection through sound.',
    description: 'Ruled by Vishnu, Shravana carries receptive, learning-oriented energy. It favours activities related to listening, education, and the transmission of wisdom — and is considered auspicious overall.',
    deity: 'Vishnu',
    symbol: 'An ear / three footprints',
    suitableActivities: [
      'Education, especially listening-based learning (lectures, mantras)',
      'Worship of Vishnu',
      'Travel and communication-related ventures',
      'Starting new ventures — generally favourable',
    ],
    avoidActivities: [
      'Activities requiring you to ignore advice or counsel',
      'Few major restrictions — broadly auspicious',
    ],
  },

  Dhanishtha: {
    key: 'Dhanishtha', nameEn: 'Dhanishtha', nameKn: 'ಧನಿಷ್ಠಾ',
    meaning: 'Meaning "the wealthiest" or "most famous" — associated with prosperity, music, and rhythm.',
    description: 'Ruled by the Ashta Vasus (eight deities of material abundance), Dhanishtha carries energy of wealth, fame, and rhythmic, musical talent. It favours financial and material pursuits.',
    deity: 'Ashta Vasus (eight Vasu deities)',
    symbol: 'A drum (mridangam)',
    suitableActivities: [
      'Financial planning, investments, and wealth-building activities',
      'Music and rhythmic arts',
      'Activities related to fame or public recognition',
      'Group activities and community projects',
    ],
    avoidActivities: [
      'Activities requiring solitude or withdrawal from public life',
      'Marriage in some traditions (mixed views)',
    ],
  },

  Shatabhisha: {
    key: 'Shatabhisha', nameEn: 'Shatabhisha', nameKn: 'ಶತಭಿಷಾ',
    meaning: 'Meaning "a hundred healers" or "a hundred physicians" — associated with healing, secrecy, and vast knowledge.',
    description: 'Ruled by Varuna, the god of cosmic waters and law, Shatabhisha carries healing but somewhat reclusive energy. It is associated with deep, often unconventional knowledge, and is good for activities requiring discretion.',
    deity: 'Varuna (god of cosmic waters)',
    symbol: 'An empty circle / 100 stars/flowers',
    suitableActivities: [
      'Medical treatments, especially unconventional or alternative healing',
      'Research requiring secrecy or discretion',
      'Activities related to large groups (the "hundred" symbolism)',
    ],
    avoidActivities: [
      'Activities requiring complete openness and transparency',
      'Marriage in some traditions (mixed views)',
    ],
  },

  'Purva Bhadrapada': {
    key: 'Purva Bhadrapada', nameEn: 'Purva Bhadrapada', nameKn: 'ಪೂರ್ವಾಭಾದ್ರ',
    meaning: 'Meaning "the former auspicious feet" — associated with intensity, transformation, and spiritual fire.',
    description: 'Ruled by Aja Ekapada (a fierce one-footed form of Rudra/Shiva), this Nakshatra carries intense, transformative energy — often associated with spiritual austerity and the burning away of impurities.',
    deity: 'Aja Ekapada (fierce Rudra aspect)',
    symbol: 'A two-faced man / a funeral cot',
    suitableActivities: [
      'Spiritual austerities and transformative practices',
      'Activities requiring intense focus and sacrifice',
      'Research into esoteric or unconventional subjects',
    ],
    avoidActivities: [
      'Starting new ventures',
      'Marriage ceremonies',
      'Activities requiring calm, gentle energy',
    ],
  },

  'Uttara Bhadrapada': {
    key: 'Uttara Bhadrapada', nameEn: 'Uttara Bhadrapada', nameKn: 'ಉತ್ತರಾಭಾದ್ರ',
    meaning: 'Meaning "the latter auspicious feet" — associated with depth, wisdom, and tranquil restraint.',
    description: 'Ruled by Ahir Budhyana (a serpent deity of the depths), Uttara Bhadrapada carries calm, deep, and wise energy — a settling after the intensity of Purva Bhadrapada. It is considered favourable and stable.',
    deity: 'Ahir Budhyana (serpent of the deep)',
    symbol: 'A pair of legs in a bed / a serpent in water',
    suitableActivities: [
      'Activities requiring depth, patience, and wisdom',
      'Starting new ventures — generally favourable',
      'Spiritual study and contemplation',
      'Charitable and welfare-related activities',
    ],
    avoidActivities: [
      'Activities requiring rapid, impulsive action',
      'Few major restrictions — broadly favourable',
    ],
  },

  Revati: {
    key: 'Revati', nameEn: 'Revati', nameKn: 'ರೇವತಿ',
    meaning: 'Meaning "the wealthy one" or "prosperous" — the final Nakshatra, associated with completion, protection, and nourishment for the journey ahead.',
    description: 'Ruled by Pushan, the protector of travellers and nourisher of all beings, Revati carries gentle, completing energy — guiding one safely from one phase to the next. As the final Nakshatra, it represents the culmination before a new cycle begins.',
    deity: 'Pushan (protector/nourisher)',
    symbol: 'A fish / a drum',
    suitableActivities: [
      'Concluding projects successfully',
      'Travel — Pushan is the protector of journeys',
      'Activities related to nourishment — feeding others, caregiving',
      'Transitions — moving homes, changing roles',
    ],
    avoidActivities: [
      'Starting entirely new long-term ventures (better suited to "ending" energy)',
      'Few major restrictions — generally gentle and supportive',
    ],
  },
}

/**
 * Lookup a Nakshatra knowledge entry by its localization key (English name).
 */
export function getNakshatraKnowledge(key: string): NakshatraKnowledge | null {
  return NAKSHATRA_KNOWLEDGE[key] ?? null
}
