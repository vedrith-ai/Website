// ─────────────────────────────────────────────────────────────────────────────
// VedRith Festival Engine — Foundation  [V1.1 — Architecture]
//
// Rule-based festival / vrata generation. NO hardcoded dates.
// Every festival is derived from Panchanga conditions:
//   • Tithi number within Paksha
//   • Nakshatra
//   • Lunar month (Masa)
//   • Weekday (for some observances)
//
// Usage: generateFestivalsForDay(panchangaResult, 'Karnataka')
//
// Source: Dharma Sindhu (Kashinath Upadhyaya), Nirnaya Sindhu (Kamalakara),
// Brihat Samhita (Varahamihira), regional Panchanga traditions.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared Types ──────────────────────────────────────────────────────────────

export type RegionalProfile =
  | 'Karnataka'
  | 'Maharashtra'
  | 'TamilNadu'
  | 'AndhraTelangana'
  | 'Kerala'
  | 'NorthIndia'
  | 'All'

export interface FestivalMetadata {
  /** Canonical name in English */
  nameEn: string
  /** Kannada name (default profile) */
  nameKn: string
  /** One-sentence description */
  description: string
  /** Type of observance */
  type: 'Festival' | 'Vrata' | 'Ekadashi' | 'Pradosha' | 'Amavasya' | 'Pournima' | 'Sankranti' | 'Chaturthi'
  /** Tithi-based observance, Nakshatra-based, or both */
  basisType: 'Tithi' | 'Nakshatra' | 'Both' | 'Weekday+Tithi'
  /** Deity or tradition associated */
  deity: string
  /** Significance narrative */
  significance: string
  /** Fasting / observance instructions */
  observance: string
  /** Regions where this festival is observed */
  regions: RegionalProfile[]
}

export interface GeneratedFestival extends FestivalMetadata {
  /** This is a generated occurrence for a specific date — not a lookup */
  matchedOn: string   // e.g. "Kartika Shukla Ekadashi"
}

// ── Festival Rule Definition ──────────────────────────────────────────────────

interface FestivalRule {
  id: string
  metadata: FestivalMetadata
  /** Returns true if this festival occurs on the given Panchanga conditions */
  matches(ctx: FestivalContext): boolean
}

export interface FestivalContext {
  /** Lunar month name (English) e.g. 'Kartika', 'Bhadrapada' */
  lunarMonth: string
  /** Paksha: 'Shukla' or 'Krishna' */
  paksha: 'Shukla' | 'Krishna'
  /** Tithi number 1-15 */
  tithiNumber: number
  /** Tithi key e.g. 'Ekadashi', 'Purnima', 'Amavasya' */
  tithiKey: string
  /** Nakshatra key */
  nakshatra: string
  /** Weekday: 0=Sun … 6=Sat */
  weekday: number
  /** Regional profile to filter by */
  region: RegionalProfile
}

// ── Festival Rules Catalogue ──────────────────────────────────────────────────

const FESTIVAL_RULES: FestivalRule[] = [

  // ── Ekadashi Rules (24 per year — each has a specific name) ──────────────

  {
    id: 'ekadashi-vaikunta',
    metadata: {
      nameEn: 'Vaikunta Ekadashi',
      nameKn: 'ವೈಕುಂಠ ಏಕಾದಶಿ',
      description: 'The most sacred Ekadashi of the year, occurring in Margashira Shukla Paksha.',
      type: 'Ekadashi',
      basisType: 'Tithi',
      deity: 'Vishnu (Vaikunthanatha)',
      significance: 'On Vaikunta Ekadashi, the gates of Vaikunta (Vishnu\'s celestial abode) are said to be open. Devotees who fast and remain awake this night are believed to attain liberation. The Vaikunta Dwara (gateway to the divine) is opened in major Vishnu temples across South India, with lakhs of devotees passing through.',
      observance: 'Complete fast from sunrise. Stay awake through the night (Jagaran). Recite Vishnu Sahasranama and Bhagavata Purana. Visit Vishnu temple and pass through the Vaikunta Dwara if possible. Break fast on Dwadashi at the prescribed paran time.',
      regions: ['Karnataka', 'TamilNadu', 'AndhraTelangana', 'All'],
    },
    matches: (ctx) => ctx.lunarMonth === 'Margashira' && ctx.paksha === 'Shukla' && ctx.tithiKey === 'Ekadashi',
  },

  {
    id: 'ekadashi-nirjala',
    metadata: {
      nameEn: 'Nirjala Ekadashi',
      nameKn: 'ನಿರ್ಜಲ ಏಕಾದಶಿ',
      description: 'The most austere Ekadashi in Jyeshtha Shukla Paksha — a complete fast without water.',
      type: 'Ekadashi',
      basisType: 'Tithi',
      deity: 'Vishnu (Hari)',
      significance: 'Nirjala means "without water." This Ekadashi is observed as the most intense of all 24 Ekadashis. Classical texts state that observing this single Ekadashi fast is equivalent in merit to all 24 Ekadashi fasts of the year combined. It occurs in the height of summer (Jyeshtha month), making it a feat of devotion and self-discipline.',
      observance: 'Complete fast without food or water from sunrise on Ekadashi to sunrise on Dwadashi. Recite Vishnu Sahasranama. On Dwadashi, perform paran (breaking the fast) by offering water and then drinking it. Distribute food, water, and cloth to the needy.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.lunarMonth === 'Jyeshtha' && ctx.paksha === 'Shukla' && ctx.tithiKey === 'Ekadashi',
  },

  {
    id: 'ekadashi-general',
    metadata: {
      nameEn: 'Ekadashi',
      nameKn: 'ಏಕಾದಶಿ',
      description: 'Monthly Ekadashi fasting — the most important recurring Vishnu observance.',
      type: 'Ekadashi',
      basisType: 'Tithi',
      deity: 'Vishnu / Hari',
      significance: 'Ekadashi (the 11th lunar day) is the most spiritually significant recurring observance in Vaishnava tradition. Fasting on Ekadashi is said to purify accumulated karma, sharpen the mind, and deepen devotion to Vishnu. There are 24 Ekadashis annually, each with a specific name and special significance.',
      observance: 'Fast from sunrise on Ekadashi to sunrise on Dwadashi. Grains prohibited. Permissible: fruit, milk, nuts, sago. Break fast (paran) on Dwadashi before the Dwadashi tithi ends.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.tithiKey === 'Ekadashi',
  },

  // ── Pradosha (13th tithi — both Pakshas) ─────────────────────────────────

  {
    id: 'pradosha-shani',
    metadata: {
      nameEn: 'Shani Pradosha',
      nameKn: 'ಶನಿ ಪ್ರದೋಷ',
      description: 'Pradosha occurring on Saturday — especially powerful for Shiva worship and Shani propitiation.',
      type: 'Pradosha',
      basisType: 'Weekday+Tithi',
      deity: 'Shiva (Someshwara) / Shani (Saturn)',
      significance: 'When Pradosha (Trayodashi at dusk) falls on a Saturday, it combines the cosmic energy of Shani (Saturn) with Shiva\'s all-dissolving grace. This is considered the most powerful Pradosha for relieving Sade Sati (Saturn\'s 7.5-year transit) and general Shani-related difficulties. Shiva\'s grace on Shani Pradosha is said to dissolve even the most deeply embedded karmic blocks.',
      observance: 'Fast from sunrise. At dusk (Pradosha time, approximately 90 minutes before to 45 minutes after sunset), perform Shiva Abhisheka with milk, water, honey. Recite Shiva Panchakshara 108 times. Offer sesame (til) to please Shani. Visit Shiva temple for evening Arati.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.tithiKey === 'Trayodashi' && ctx.weekday === 6,
  },

  {
    id: 'pradosha-soma',
    metadata: {
      nameEn: 'Soma Pradosha',
      nameKn: 'ಸೋಮ ಪ್ರದೋಷ',
      description: 'Pradosha occurring on Monday — especially powerful for Shiva and lunar energy.',
      type: 'Pradosha',
      basisType: 'Weekday+Tithi',
      deity: 'Shiva (Somashekhara) / Chandra (Moon)',
      significance: 'Soma Pradosha (Monday Pradosha) combines Chandra\'s (Moon\'s) nurturing energy with Shiva\'s Trayodashi grace. Shiva is Somashekhara — he who wears the Moon on his head — making Monday Pradosha a day of supreme moonlit Shiva consciousness. Fasting on this day is said to grant clarity of mind, peace of emotion, and success in relationship matters.',
      observance: 'Fast from sunrise. Perform Shiva Abhisheka during Pradosha time with milk and water. Recite Shiva Panchakshara and Chandra Gayatri. Offer white flowers and white sweets.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.tithiKey === 'Trayodashi' && ctx.weekday === 1,
  },

  {
    id: 'pradosha-general',
    metadata: {
      nameEn: 'Pradosha',
      nameKn: 'ಪ್ರದೋಷ',
      description: 'Monthly Shiva worship at the Trayodashi dusk — powerful for dissolving karmic obstacles.',
      type: 'Pradosha',
      basisType: 'Tithi',
      deity: 'Shiva (Mahashiva)',
      significance: 'Pradosha occurs twice monthly on Trayodashi (the 13th lunar day) of both Pakshas. During the Pradosha window (the 90-minute period around sunset on Trayodashi), Shiva is said to dance in the cosmos washing away the sins (dosha) of all who worship him. It is a monthly opportunity for spiritual purification and the renewal of Shiva\'s grace.',
      observance: 'Observe a daytime fast. At dusk (Pradosha window), perform Shiva Abhisheka, recite Om Namah Shivaya 108 times, offer bel leaves. Circumambulate the Shivalinga. Break fast after Puja.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.tithiKey === 'Trayodashi',
  },

  // ── Amavasya ──────────────────────────────────────────────────────────────

  {
    id: 'mahalaya-amavasya',
    metadata: {
      nameEn: 'Mahalaya Amavasya (Sarva Pitru Amavasya)',
      nameKn: 'ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆ',
      description: 'The most sacred Amavasya of the year for honouring all ancestors.',
      type: 'Amavasya',
      basisType: 'Tithi',
      deity: 'Pitrus (All Ancestors)',
      significance: 'Mahalaya Amavasya, falling in Ashvina Krishna Paksha, is the culminating day of the 16-day Pitru Paksha (fortnight of ancestors). On this day, the ancestors are believed to be most receptive to offerings. Tarpana performed on this day is said to reach all ancestors — even those whose names are unknown or who died without proper rites.',
      observance: 'Perform Tarpana (water offerings with sesame and kusha grass) in the names of all known and unknown ancestors. Feed crows, cows, and dogs — considered vessels through which ancestors receive nourishment. Donate food, cloth, and sesame to Brahmins. Observe a fast or eat only once.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.lunarMonth === 'Ashvina' && ctx.tithiKey === 'Amavasya',
  },

  {
    id: 'diwali-amavasya',
    metadata: {
      nameEn: 'Diwali — Lakshmi Puja',
      nameKn: 'ದೀಪಾವಳಿ — ಲಕ್ಷ್ಮೀ ಪೂಜೆ',
      description: 'The festival of lights — Lakshmi Puja on Kartika Amavasya.',
      type: 'Festival',
      basisType: 'Tithi',
      deity: 'Lakshmi / Kubera / Kali (in Bengal tradition)',
      significance: 'Diwali (Deepavali — "row of lamps") occurs on Kartika Amavasya. The new moon darkness is answered by a thousand lamps — symbolizing the triumph of light over darkness, knowledge over ignorance, good over evil. Lakshmi, the goddess of abundance, is said to visit homes lit with lamps on this night. Business communities perform Lakshmi-Kubera Puja for prosperity in the coming year.',
      observance: 'Light oil lamps throughout the home at dusk. Perform Lakshmi Puja with lotus flowers, red flowers, sweets, and a new account book (for businesses). Burst firecrackers to welcome Lakshmi and dispel negativity. Give sweets and gifts to family members.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.lunarMonth === 'Kartika' && ctx.tithiKey === 'Amavasya',
  },

  {
    id: 'amavasya-general',
    metadata: {
      nameEn: 'Amavasya (New Moon)',
      nameKn: 'ಅಮಾವಾಸ್ಯೆ',
      description: 'Monthly new moon — the day for ancestral offerings (Pitru Tarpana).',
      type: 'Amavasya',
      basisType: 'Tithi',
      deity: 'Pitrus (Ancestors)',
      significance: 'Every Amavasya is sacred for honouring departed ancestors. The veil between the living and the departed is thinnest on the new moon night, making Tarpana most effective. Monthly observance of Amavasya Tarpana ensures ancestral blessings, removal of Pitru Dosha effects, and smooth flow of family dharma.',
      observance: 'Perform Tarpana to departed family members. Offer sesame-mixed water while reciting ancestors\' names. Feed crows and cows. Light a lamp for the ancestors. Avoid starting new auspicious activities.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.tithiKey === 'Amavasya',
  },

  // ── Pournima ──────────────────────────────────────────────────────────────

  {
    id: 'guru-purnima',
    metadata: {
      nameEn: 'Guru Purnima',
      nameKn: 'ಗುರು ಪೂರ್ಣಿಮ',
      description: 'The full moon sacred to one\'s spiritual teacher — Ashadha Purnima.',
      type: 'Pournima',
      basisType: 'Tithi',
      deity: 'Guru-Tattva (the divine principle of the teacher) / Vyasa',
      significance: 'Guru Purnima (Ashadha Shukla Purnima) is the day for honouring one\'s spiritual teacher. Also called Vyasa Purnima — it commemorates the birth of Veda Vyasa, the sage who compiled the Vedas, 18 Puranas, and the Mahabharata. The full moon of Ashadha represents the fully-bloomed mind under the Guru\'s guidance.',
      observance: 'Visit one\'s Guru and perform Pada Puja (worship of the teacher\'s feet). Offer flowers, fruit, and sweets. Recite the Guru Stotra. If the physical Guru is not present, meditate on the Guru-Tattva and the lineage. Fast from sunrise, broken after Guru Puja.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.lunarMonth === 'Ashadha' && ctx.tithiKey === 'Purnima',
  },

  {
    id: 'sharad-purnima',
    metadata: {
      nameEn: 'Sharad Purnima (Kojagiri)',
      nameKn: 'ಶರದ್ ಪೂರ್ಣಿಮ',
      description: 'The most beautiful full moon of the year — when the moon\'s rays are said to carry nectar.',
      type: 'Pournima',
      basisType: 'Tithi',
      deity: 'Chandra (Moon) / Lakshmi',
      significance: 'Sharad Purnima (Ashvina Shukla Purnima) is considered the fullest, brightest, and most nectar-laden full moon of the year. Classical texts state that on this night, Chandra (the Moon) rains down Amrita (nectar of immortality) that can be collected by placing milk in moonlight overnight. Lakshmi is said to descend to earth asking "Ko Jagarti?" (Who is awake?) — those awake receive her blessing.',
      observance: 'Stay awake through the night. Place a bowl of milk or rice pudding (kheer) in moonlight to receive Chandra\'s nectar. Consume this moonlight-blessed food. Perform Lakshmi Puja. Dance, sing, and remain joyfully awake.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.lunarMonth === 'Ashvina' && ctx.tithiKey === 'Purnima',
  },

  {
    id: 'purnima-general',
    metadata: {
      nameEn: 'Purnima (Full Moon)',
      nameKn: 'ಹುಣ್ಣಿಮೆ',
      description: 'Monthly full moon — auspicious for Vishnu worship, charity, and spiritual practice.',
      type: 'Pournima',
      basisType: 'Tithi',
      deity: 'Vishnu / Chandra / Lakshmi',
      significance: 'Every Purnima is sacred — the Moon at complete fullness represents the soul\'s complete reflection of divine light. Monthly Satyanarayan Puja and Vishnu worship on Purnima is widely practised. Charitable giving on Purnima is considered especially meritorious.',
      observance: 'Perform Satyanarayan Puja or Vishnu Puja. Offer white flowers, white sweets, and camphor. Fast or eat once. Place water/milk in moonlight. Perform charitable giving.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.tithiKey === 'Purnima',
  },

  // ── Sankashti Chaturthi ──────────────────────────────────────────────────

  {
    id: 'sankashti-chaturthi',
    metadata: {
      nameEn: 'Sankashti Chaturthi',
      nameKn: 'ಸಂಕಷ್ಟ ಚತುರ್ಥಿ',
      description: 'Monthly Ganesha fasting on Krishna Paksha Chaturthi — for obstacle removal.',
      type: 'Chaturthi',
      basisType: 'Tithi',
      deity: 'Ganesha (Sankata Nashana — remover of afflictions)',
      significance: 'Sankashti means "deliverance from afflictions." Observed on the 4th lunar day of the waning fortnight (Krishna Chaturthi), this monthly fast to Ganesha is said to remove all obstacles (Vighnas) and grant relief from difficulties. The fast is broken after sighting the moon at night — Chandra, having learned wisdom from Ganesha, is considered auspicious on this night.',
      observance: 'Fast from sunrise. Perform Ganesha Puja with modakas, durva grass, and red flowers. In the evening, sight the moon after it rises and recite the Sankashti Stotra. Break the fast after sighting the moon.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.paksha === 'Krishna' && ctx.tithiKey === 'Chaturthi',
  },

  // ── Ganesh Chaturthi ─────────────────────────────────────────────────────

  {
    id: 'ganesh-chaturthi',
    metadata: {
      nameEn: 'Ganesh Chaturthi (Vinayaka Chaturthi)',
      nameKn: 'ಗಣೇಶ ಚತುರ್ಥಿ',
      description: 'The major 10-day Ganesha festival beginning on Bhadrapada Shukla Chaturthi.',
      type: 'Festival',
      basisType: 'Tithi',
      deity: 'Ganesha (Vinayaka / Vighnaharta)',
      significance: 'Ganesh Chaturthi (Bhadrapada Shukla Chaturthi) begins a 10-day celebration of Ganesha — the lord of new beginnings and remover of obstacles. Grand Ganesha idols are installed in homes and public spaces, with elaborate daily puja. On the 11th day (Ananta Chaturdashi), idols are immersed in water (Visarjan) symbolizing Ganesha\'s return to the cosmic ocean. A celebration of divine intelligence and auspicious commencement.',
      observance: 'Install a Ganesha idol. Offer 21 modakas, durva grass, red flowers, and coconut. Recite the Atharvashirsha and Ganesha Ashtakam. Do not view the moon on this night. Celebrate for 1, 3, 5, 7, or 11 days. Immerse the idol on the final day.',
      regions: ['Karnataka', 'Maharashtra', 'AndhraTelangana', 'All'],
    },
    matches: (ctx) => ctx.lunarMonth === 'Bhadrapada' && ctx.paksha === 'Shukla' && ctx.tithiKey === 'Chaturthi',
  },

  // ── Monthly Vratas ────────────────────────────────────────────────────────

  {
    id: 'shiva-ratri-monthly',
    metadata: {
      nameEn: 'Masika Shivaratri',
      nameKn: 'ಮಾಸಿಕ ಶಿವರಾತ್ರಿ',
      description: 'Monthly Shiva Ratri on Krishna Chaturdashi — monthly opportunity for Shiva\'s grace.',
      type: 'Vrata',
      basisType: 'Tithi',
      deity: 'Shiva (Mahakala / Bhairava)',
      significance: 'Every Krishna Chaturdashi is Masika (monthly) Shivaratri. Just as the annual Maha Shivaratri (Magha Krishna Chaturdashi) is the supreme Shiva night, each month\'s Chaturdashi is a smaller Shivaratri where Shiva\'s consciousness is particularly potent. Regular observance of monthly Shivaratri is said to progressively deepen one\'s connection with Shiva.',
      observance: 'Fast during the day. Perform Shiva Abhisheka at night with milk, water, and honey. Recite Om Namah Shivaya 108 times. Offer bel leaves. Stay awake for part of the night in meditation if possible.',
      regions: ['All'],
    },
    matches: (ctx) => ctx.paksha === 'Krishna' && ctx.tithiKey === 'Chaturdashi',
  },

  // ── Nakshatra-based observances ───────────────────────────────────────────

  {
    id: 'rohini-vrata',
    metadata: {
      nameEn: 'Rohini Vrata',
      nameKn: 'ರೋಹಿಣಿ ವ್ರತ',
      description: 'Monthly Rohini Nakshatra fast — observed for the prosperity and longevity of family.',
      type: 'Vrata',
      basisType: 'Nakshatra',
      deity: 'Prajapati / Chandra (Moon)',
      significance: 'Rohini is the Moon\'s own Nakshatra — his most beloved consort. When the Moon transits Rohini, it is considered particularly potent for prayers related to abundance, fertility, family prosperity, and marital happiness. The Rohini Vrata is observed monthly when the Moon is in Rohini.',
      observance: 'Observe a fast. Offer white flowers, white rice, and milk to Chandra. Recite Chandra Kavacham. Pray for family prosperity, marital harmony, and children\'s wellbeing.',
      regions: ['Karnataka', 'TamilNadu', 'All'],
    },
    matches: (ctx) => ctx.nakshatra === 'Rohini',
  },

]

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate all festivals / vratas applicable for a given day's Panchanga.
 *
 * Results are filtered by the specified regional profile.
 * More specific rules (named festivals) are returned before general ones.
 *
 * @param ctx     The Panchanga conditions for the day
 * @param region  Optional regional profile (defaults to 'All')
 */
export function generateFestivalsForDay(
  ctx: FestivalContext,
  region: RegionalProfile = 'All'
): GeneratedFestival[] {
  const results: GeneratedFestival[] = []
  const seenGeneral = new Set<string>()

  // Named/specific festivals first, then general catch-alls
  const specificFirst = [
    ...FESTIVAL_RULES.filter(r => !['ekadashi-general', 'pradosha-general', 'amavasya-general', 'purnima-general'].includes(r.id)),
    ...FESTIVAL_RULES.filter(r =>  ['ekadashi-general', 'pradosha-general', 'amavasya-general', 'purnima-general'].includes(r.id)),
  ]

  for (const rule of specificFirst) {
    if (!rule.matches(ctx)) continue

    // Regional filter
    const { regions } = rule.metadata
    if (region !== 'All' && !regions.includes('All') && !regions.includes(region)) continue

    // Skip general catch-all if a specific rule already matched the same tithi
    const isGeneral = ['ekadashi-general', 'pradosha-general', 'amavasya-general', 'purnima-general'].includes(rule.id)
    if (isGeneral && seenGeneral.has(rule.metadata.type)) continue

    if (!isGeneral) seenGeneral.add(rule.metadata.type)

    const matchedOn = [
      ctx.lunarMonth,
      ctx.paksha === 'Shukla' ? 'Shukla' : 'Krishna',
      ctx.tithiKey,
      ctx.nakshatra !== ctx.tithiKey ? `— ${ctx.nakshatra} Nakshatra` : '',
    ].filter(Boolean).join(' ')

    results.push({ ...rule.metadata, matchedOn })
  }

  return results
}

/**
 * Check if a given day has an Ekadashi observance.
 */
export function isEkadashi(ctx: Pick<FestivalContext, 'tithiKey'>): boolean {
  return ctx.tithiKey === 'Ekadashi'
}

/**
 * Check if a given day has a Pradosha observance.
 */
export function isPradosha(ctx: Pick<FestivalContext, 'tithiKey'>): boolean {
  return ctx.tithiKey === 'Trayodashi'
}
