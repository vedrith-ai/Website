// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Daily Enrichment Engine  [V1.3]
//
// Provides:
//  • Deity of the day (based on Vara + Tithi + Nakshatra)
//  • Spiritual message (based on Nakshatra + Tithi quality)
//  • Auspicious colour / flower / number for the day
//
// All derived from classical sources:
//  Brahma Vaivarta Purana, Skanda Purana, regional Panchanga traditions.
//  No hardcoded English-only strings — all have Kannada equivalents.
// ─────────────────────────────────────────────────────────────────────────────

export interface DeityInfo {
  nameEn:        string
  nameKn:        string
  /** Why this deity is highlighted today */
  reasonEn:      string
  reasonKn:      string
  mantraEn:      string
  mantraKn?:     string
  /** Emoji / visual cue */
  symbol:        string
}

export interface SpiritualMessage {
  messageEn:  string
  messageKn:  string
  /** Brief source attribution */
  sourceEn:   string
  sourceKn:   string
}

export interface DailyAuspicious {
  colour:    { en: string; kn: string }
  flower:    { en: string; kn: string }
  number:    number
  direction: { en: string; kn: string }
}

// ── Vara (weekday) deity map ──────────────────────────────────────────────────
// Index 0=Sunday … 6=Saturday (same as JS Date.getDay())

const VARA_DEITIES: DeityInfo[] = [
  {
    nameEn:   'Surya (Sun God)',
    nameKn:   'ಸೂರ್ಯ',
    reasonEn: 'Sunday is ruled by the Sun — Aditya, the source of all life and light.',
    reasonKn: 'ಭಾನುವಾರ ಸೂರ್ಯ ದೇವರ ದಿನ — ಆದಿತ್ಯ, ಜೀವನ ಮತ್ತು ಪ್ರಕಾಶದ ಮೂಲ.',
    mantraEn: 'Om Suryaya Namaha',
    mantraKn: 'ಓಂ ಸೂರ್ಯಾಯ ನಮಃ',
    symbol:   '☀️',
  },
  {
    nameEn:   'Chandra (Moon God) & Shiva',
    nameKn:   'ಚಂದ್ರ & ಶಿವ',
    reasonEn: 'Monday is ruled by the Moon — Chandra, and is sacred to Shiva who wears the crescent.',
    reasonKn: 'ಸೋಮವಾರ ಚಂದ್ರ ದೇವರ ದಿನ. ಶಿವ ತನ್ನ ಜಟೆಯಲ್ಲಿ ಚಂದ್ರನನ್ನು ಧರಿಸಿರುತ್ತಾರೆ.',
    mantraEn: 'Om Namah Shivaya',
    mantraKn: 'ಓಂ ನಮಃ ಶಿವಾಯ',
    symbol:   '🌙',
  },
  {
    nameEn:   'Hanuman & Kuja (Mars)',
    nameKn:   'ಹನುಮಂತ & ಕುಜ',
    reasonEn: 'Tuesday is ruled by Mars — Kuja, and is auspicious for Hanuman worship.',
    reasonKn: 'ಮಂಗಳವಾರ ಕುಜ ಮತ್ತು ಹನುಮಂತ ದೇವರ ದಿನ.',
    mantraEn: 'Om Anjaneyaya Namaha',
    mantraKn: 'ಓಂ ಅಂಜನೇಯಾಯ ನಮಃ',
    symbol:   '🙏',
  },
  {
    nameEn:   'Vishnu & Budha (Mercury)',
    nameKn:   'ವಿಷ್ಣು & ಬುಧ',
    reasonEn: 'Wednesday is ruled by Mercury — Budha, and is sacred to Vishnu.',
    reasonKn: 'ಬುಧವಾರ ಬುಧ ಗ್ರಹ ಮತ್ತು ವಿಷ್ಣು ದೇವರ ದಿನ.',
    mantraEn: 'Om Namo Narayanaya',
    mantraKn: 'ಓಂ ನಮೋ ನಾರಾಯಣಾಯ',
    symbol:   '🪷',
  },
  {
    nameEn:   'Brihaspati (Jupiter) & Guru',
    nameKn:   'ಬೃಹಸ್ಪತಿ & ಗುರು',
    reasonEn: 'Thursday is ruled by Jupiter — Guru, the divine teacher and lord of wisdom.',
    reasonKn: 'ಗುರುವಾರ ಬೃಹಸ್ಪತಿ ಮತ್ತು ಗುರು ದೇವರ ದಿನ — ಜ್ಞಾನ ಮತ್ತು ಧರ್ಮದ ಅಧಿಪತಿ.',
    mantraEn: 'Om Gurave Namaha',
    mantraKn: 'ಓಂ ಗುರವೇ ನಮಃ',
    symbol:   '📿',
  },
  {
    nameEn:   'Lakshmi & Shukra (Venus)',
    nameKn:   'ಲಕ್ಷ್ಮಿ & ಶುಕ್ರ',
    reasonEn: 'Friday is ruled by Venus — Shukra, and is the most auspicious day for Lakshmi worship.',
    reasonKn: 'ಶುಕ್ರವಾರ ಶುಕ್ರ ಗ್ರಹ ಮತ್ತು ಲಕ್ಷ್ಮಿ ದೇವಿಯ ದಿನ — ಸಂಪದ ಮತ್ತು ಶ್ರೀಯ ದಿನ.',
    mantraEn: 'Om Shri Mahalakshmyai Namaha',
    mantraKn: 'ಓಂ ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮ್ಯೈ ನಮಃ',
    symbol:   '🌸',
  },
  {
    nameEn:   'Shani (Saturn) & Shiva',
    nameKn:   'ಶನಿ & ಶಿವ',
    reasonEn: 'Saturday is ruled by Saturn — Shani, the lord of karma and discipline.',
    reasonKn: 'ಶನಿವಾರ ಶನಿ ದೇವರ ದಿನ — ಕರ್ಮ ಮತ್ತು ಶಿಸ್ತಿನ ಅಧಿಪತಿ.',
    mantraEn: 'Om Sham Shanicharaya Namaha',
    mantraKn: 'ಓಂ ಶಂ ಶನಿಚರಾಯ ನಮಃ',
    symbol:   '⚖️',
  },
]

// ── Spiritual messages by Nakshatra ───────────────────────────────────────────

const NAKSHATRA_MESSAGES: Record<string, SpiritualMessage> = {
  Ashvini:    { messageEn: 'Begin with courage. The Ashvini Kumars bless all new beginnings with healing energy today.', messageKn: 'ಧೈರ್ಯದಿಂದ ಆರಂಭಿಸಿ. ಅಶ್ವಿನಿ ಕುಮಾರರು ಇಂದು ಎಲ್ಲ ಹೊಸ ಪ್ರಾರಂಭಗಳನ್ನು ಆಶೀರ್ವದಿಸುತ್ತಾರೆ.', sourceEn: 'Ashvini Nakshatra — ruled by Ashvini Kumars', sourceKn: 'ಅಶ್ವಿನಿ ನಕ್ಷತ್ರ — ಅಶ್ವಿನಿ ಕುಮಾರರು' },
  Bharani:    { messageEn: 'Embrace transformation. Yama\'s energy today helps release what no longer serves your growth.', messageKn: 'ಬದಲಾವಣೆಯನ್ನು ಸ್ವೀಕರಿಸಿ. ಯಮ ದೇವರ ಶಕ್ತಿ ಇಂದು ಹಳೆಯದನ್ನು ಬಿಟ್ಟುಬಿಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.', sourceEn: 'Bharani Nakshatra — ruled by Yama', sourceKn: 'ಭರಣಿ ನಕ್ಷತ್ರ — ಯಮ ದೇವರು' },
  Krittika:   { messageEn: 'Burn away impurities with Agni\'s fire. Today holds the energy of purification and clarity.', messageKn: 'ಅಗ್ನಿಯ ಬೆಂಕಿಯಿಂದ ಕಲ್ಮಷಗಳನ್ನು ಸುಡಿ. ಇಂದು ಶುದ್ಧೀಕರಣ ಮತ್ತು ಸ್ಪಷ್ಟತೆಯ ಶಕ್ತಿ ಇದೆ.', sourceEn: 'Krittika Nakshatra — ruled by Agni', sourceKn: 'ಕೃತ್ತಿಕಾ ನಕ್ಷತ್ರ — ಅಗ್ನಿ ದೇವರು' },
  Rohini:     { messageEn: 'Nurture beauty and abundance. The Moon\'s beloved Rohini blesses growth, creativity, and love today.', messageKn: 'ಸೌಂದರ್ಯ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ಪೋಷಿಸಿ. ಚಂದ್ರನ ಪ್ರೀತಿಯ ರೋಹಿಣಿ ಇಂದು ಬೆಳವಣಿಗೆ, ಸೃಜನಶೀಲತೆ ಮತ್ತು ಪ್ರೀತಿಯನ್ನು ಆಶೀರ್ವದಿಸುತ್ತಾಳೆ.', sourceEn: 'Rohini Nakshatra — ruled by Chandra', sourceKn: 'ರೋಹಿಣಿ ನಕ್ಷತ್ರ — ಚಂದ್ರ' },
  Mrigashira: { messageEn: 'Seek with an open heart. Soma\'s gentle energy guides beautiful seeking and discovery today.', messageKn: 'ತೆರೆದ ಮನಸ್ಸಿನಿಂದ ಹುಡುಕಿ. ಸೋಮನ ಮೃದು ಶಕ್ತಿ ಇಂದು ಸುಂದರ ಹುಡುಕಾಟ ಮತ್ತು ಅನ್ವೇಷಣೆಯನ್ನು ಮಾರ್ಗದರ್ಶನ ಮಾಡುತ್ತದೆ.', sourceEn: 'Mrigashira Nakshatra — ruled by Soma', sourceKn: 'ಮೃಗಶಿರ ನಕ್ಷತ್ರ — ಸೋಮ' },
  Ardra:      { messageEn: 'Welcome the storm that clears. Rudra\'s transformative tempest brings renewal after dissolution.', messageKn: 'ಶುದ್ಧಗೊಳಿಸುವ ಚಂಡಮಾರುತವನ್ನು ಸ್ವಾಗತಿಸಿ. ರುದ್ರನ ರೂಪಾಂತರ ಬಿರುಗಾಳಿ ವಿಸರ್ಜನೆಯ ನಂತರ ನವೀಕರಣ ತರುತ್ತದೆ.', sourceEn: 'Ardra Nakshatra — ruled by Rudra', sourceKn: 'ಆರ್ದ್ರಾ ನಕ್ಷತ್ರ — ರುದ್ರ' },
  Punarvasu:  { messageEn: 'Return to abundance. Aditi\'s boundless grace restores what was lost and brings light home.', messageKn: 'ಸಮೃದ್ಧಿಗೆ ಮರಳಿ. ಅದಿತಿಯ ಅಸೀಮ ಅನುಗ್ರಹ ಕಳೆದುಹೋದದ್ದನ್ನು ಮರಳಿ ತರುತ್ತದೆ.', sourceEn: 'Punarvasu Nakshatra — ruled by Aditi', sourceKn: 'ಪುನರ್ವಸು ನಕ್ಷತ್ರ — ಅದಿತಿ' },
  Pushya:     { messageEn: 'Receive divine nourishment. Brihaspati blesses wisdom, devotion, and spiritual learning today.', messageKn: 'ದೈವಿಕ ಪೋಷಣೆಯನ್ನು ಸ್ವೀಕರಿಸಿ. ಬೃಹಸ್ಪತಿ ಇಂದು ಜ್ಞಾನ, ಭಕ್ತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಕಲಿಕೆಯನ್ನು ಆಶೀರ್ವದಿಸುತ್ತಾರೆ.', sourceEn: 'Pushya Nakshatra — ruled by Brihaspati', sourceKn: 'ಪುಷ್ಯ ನಕ್ಷತ್ರ — ಬೃಹಸ್ಪತಿ' },
  Ashlesha:   { messageEn: 'Honour the serpent\'s wisdom. Sarpa\'s energy brings deep insight, healing, and kundalini awakening.', messageKn: 'ಸರ್ಪದ ಜ್ಞಾನವನ್ನು ಗೌರವಿಸಿ. ಸರ್ಪ ಶಕ್ತಿ ಆಳವಾದ ಒಳನೋಟ, ಗುಣಪಡಿಸುವಿಕೆ ಮತ್ತು ಕುಂಡಲಿನಿ ಜಾಗೃತಿ ತರುತ್ತದೆ.', sourceEn: 'Ashlesha Nakshatra — ruled by Sarpa', sourceKn: 'ಆಶ್ಲೇಷಾ ನಕ್ಷತ್ರ — ಸರ್ಪ' },
  Magha:      { messageEn: 'Honor your ancestors. The Pitrs gather today with blessings of lineage, dignity, and strength.', messageKn: 'ನಿಮ್ಮ ಪೂರ್ವಜರನ್ನು ಗೌರವಿಸಿ. ಪಿತೃಗಳು ಇಂದು ವಂಶ, ಗೌರವ ಮತ್ತು ಶಕ್ತಿಯ ಆಶೀರ್ವಾದದೊಂದಿಗೆ ಒಟ್ಟುಗೂಡುತ್ತಾರೆ.', sourceEn: 'Magha Nakshatra — ruled by Pitrs (Ancestors)', sourceKn: 'ಮಘಾ ನಕ್ಷತ್ರ — ಪಿತೃಗಳು' },
  Purva_Phalguni: { messageEn: 'Enjoy the beauty of creation. Bhaga blesses artistic expression, pleasure, and joyful union today.', messageKn: 'ಸೃಷ್ಟಿಯ ಸೌಂದರ್ಯವನ್ನು ಆನಂದಿಸಿ. ಭಗ ಇಂದು ಕಲಾತ್ಮಕ ಅಭಿವ್ಯಕ್ತಿ, ಆನಂದ ಮತ್ತು ಸಂತೋಷದ ಒಕ್ಕೂಟವನ್ನು ಆಶೀರ್ವದಿಸುತ್ತಾರೆ.', sourceEn: 'Purva Phalguni — ruled by Bhaga', sourceKn: 'ಪೂರ್ವ ಫಲ್ಗುನಿ — ಭಗ' },
  Uttara_Phalguni: { messageEn: 'Build lasting bonds. Aryaman blesses contracts, friendships, and righteous social connections.', messageKn: 'ಶಾಶ್ವತ ಬಂಧಗಳನ್ನು ನಿರ್ಮಿಸಿ. ಅರ್ಯಮನ್ ಒಪ್ಪಂದಗಳು, ಸ್ನೇಹಗಳು ಮತ್ತು ಧಾರ್ಮಿಕ ಸಂಬಂಧಗಳನ್ನು ಆಶೀರ್ವದಿಸುತ್ತಾರೆ.', sourceEn: 'Uttara Phalguni — ruled by Aryaman', sourceKn: 'ಉತ್ತರ ಫಲ್ಗುನಿ — ಅರ್ಯಮನ್' },
  Hasta:      { messageEn: 'Act with skilled hands. Savitar\'s radiant creativity blesses craftsmanship and healing today.', messageKn: 'ಕುಶಲ ಕೈಗಳಿಂದ ಕಾರ್ಯ ಮಾಡಿ. ಸವಿತರ್ ಇಂದು ಕುಶಲಕರ್ಮ ಮತ್ತು ಗುಣಪಡಿಸುವಿಕೆಯನ್ನು ಆಶೀರ್ವದಿಸುತ್ತಾರೆ.', sourceEn: 'Hasta Nakshatra — ruled by Savitar', sourceKn: 'ಹಸ್ತ ನಕ್ಷತ್ರ — ಸವಿತರ್' },
  Chitra:     { messageEn: 'Create with brilliance. Vishvakarma\'s divine artistry blesses beauty, architecture, and innovation.', messageKn: 'ಪ್ರತಿಭೆಯಿಂದ ಸೃಷ್ಟಿಸಿ. ವಿಶ್ವಕರ್ಮರ ದೈವಿಕ ಕಲಾಕೌಶಲ ಸೌಂದರ್ಯ, ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ನಾವೀನ್ಯತೆಯನ್ನು ಆಶೀರ್ವದಿಸುತ್ತದೆ.', sourceEn: 'Chitra Nakshatra — ruled by Vishvakarma', sourceKn: 'ಚಿತ್ರಾ ನಕ್ಷತ್ರ — ವಿಶ್ವಕರ್ಮ' },
  Svati:      { messageEn: 'Move like the wind. Vayu\'s expansive freedom encourages independence, trade, and clear communication.', messageKn: 'ಗಾಳಿಯಂತೆ ಚಲಿಸಿ. ವಾಯುವಿನ ವಿಸ್ತಾರ ಸ್ವಾತಂತ್ರ್ಯ ಸ್ವಾಯತ್ತತೆ, ವ್ಯಾಪಾರ ಮತ್ತು ಸ್ಪಷ್ಟ ಸಂವಹನವನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುತ್ತದೆ.', sourceEn: 'Svati Nakshatra — ruled by Vayu', sourceKn: 'ಸ್ವಾತಿ ನಕ್ಷತ್ರ — ವಾಯು' },
  Vishakha:   { messageEn: 'Pursue your sacred purpose. Indra-Agni\'s dual power ignites goal-oriented focus and righteous ambition.', messageKn: 'ನಿಮ್ಮ ಪವಿತ್ರ ಉದ್ದೇಶವನ್ನು ಅನ್ವೇಷಿಸಿ. ಇಂದ್ರ-ಅಗ್ನಿಯ ದ್ವಂದ್ವ ಶಕ್ತಿ ಗುರಿ-ಕೇಂದ್ರಿತ ಗಮನ ಮತ್ತು ಧಾರ್ಮಿಕ ಮಹತ್ವಾಕಾಂಕ್ಷೆಯನ್ನು ಹೊತ್ತಿಸುತ್ತದೆ.', sourceEn: 'Vishakha Nakshatra — ruled by Indra-Agni', sourceKn: 'ವಿಶಾಖಾ ನಕ್ಷತ್ರ — ಇಂದ್ರ-ಅಗ್ನಿ' },
  Anuradha:   { messageEn: 'Nurture devotion and friendship. Mitra\'s gentle covenant blesses loyal relationships and spiritual community.', messageKn: 'ಭಕ್ತಿ ಮತ್ತು ಸ್ನೇಹವನ್ನು ಪೋಷಿಸಿ. ಮಿತ್ರರ ಮೃದು ಒಡಂಬಡಿಕೆ ನಿಷ್ಠಾವಂತ ಸಂಬಂಧಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಸಮುದಾಯವನ್ನು ಆಶೀರ್ವದಿಸುತ್ತದೆ.', sourceEn: 'Anuradha Nakshatra — ruled by Mitra', sourceKn: 'ಅನುರಾಧಾ ನಕ್ಷತ್ರ — ಮಿತ್ರ' },
  Jyeshtha:   { messageEn: 'Lead with wisdom. Indra\'s royal sovereignty blesses courage, leadership, and protection of the righteous.', messageKn: 'ಜ್ಞಾನದಿಂದ ಮುನ್ನಡೆಯಿರಿ. ಇಂದ್ರನ ರಾಜ ಸಾರ್ವಭೌಮತ್ವ ಧೈರ್ಯ, ನಾಯಕತ್ವ ಮತ್ತು ಧಾರ್ಮಿಕರ ರಕ್ಷಣೆಯನ್ನು ಆಶೀರ್ವದಿಸುತ್ತದೆ.', sourceEn: 'Jyeshtha Nakshatra — ruled by Indra', sourceKn: 'ಜ್ಯೇಷ್ಠಾ ನಕ್ಷತ್ರ — ಇಂದ್ರ' },
  Mula:       { messageEn: 'Go to the root. Nirriti\'s energy dissolves illusions and reveals the ultimate truth beneath appearances.', messageKn: 'ಬೇರಿಗೆ ಹೋಗಿ. ನಿಋತಿಯ ಶಕ್ತಿ ಭ್ರಮೆಗಳನ್ನು ಕರಗಿಸುತ್ತದೆ ಮತ್ತು ಗೋಚರಿಕೆಯ ಕೆಳಗಿನ ಅಂತಿಮ ಸತ್ಯವನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತದೆ.', sourceEn: 'Mula Nakshatra — ruled by Nirriti', sourceKn: 'ಮೂಲ ನಕ್ಷತ್ರ — ನಿಋತಿ' },
  Purva_Ashadha: { messageEn: 'Invoke purification. Apas (water goddess) blesses emotional clarity, cleansing, and spiritual renewal.', messageKn: 'ಶುದ್ಧೀಕರಣವನ್ನು ಆಹ್ವಾನಿಸಿ. ಅಪಸ್ (ನೀರಿನ ದೇವಿ) ಭಾವನಾತ್ಮಕ ಸ್ಪಷ್ಟತೆ, ಶುದ್ಧೀಕರಣ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ನವೀಕರಣವನ್ನು ಆಶೀರ್ವದಿಸುತ್ತಾಳೆ.', sourceEn: 'Purva Ashadha — ruled by Apas', sourceKn: 'ಪೂರ್ವಾಷಾಢ — ಅಪಸ್' },
  Uttara_Ashadha: { messageEn: 'Achieve your highest. The Vishvadevas inspire universal victory, righteousness, and lasting triumph.', messageKn: 'ನಿಮ್ಮ ಅತ್ಯುನ್ನತವನ್ನು ಸಾಧಿಸಿ. ವಿಶ್ವದೇವಾಗಳು ಸಾರ್ವತ್ರಿಕ ವಿಜಯ, ಧಾರ್ಮಿಕತೆ ಮತ್ತು ಶಾಶ್ವತ ವಿಜಯವನ್ನು ಪ್ರೇರೇಪಿಸುತ್ತಾರೆ.', sourceEn: 'Uttara Ashadha — ruled by Vishvadevas', sourceKn: 'ಉತ್ತರಾಷಾಢ — ವಿಶ್ವದೇವಾಗಳು' },
  Shravana:   { messageEn: 'Listen deeply. Vishnu\'s omniscient ear urges attentive learning, sacred study, and divine hearing.', messageKn: 'ಆಳವಾಗಿ ಕೇಳಿ. ವಿಷ್ಣುವಿನ ಸರ್ವಜ್ಞ ಕಿವಿ ಗಮನಶೀಲ ಕಲಿಕೆ, ಪವಿತ್ರ ಅಧ್ಯಯನ ಮತ್ತು ದೈವಿಕ ಶ್ರವಣವನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುತ್ತದೆ.', sourceEn: 'Shravana Nakshatra — ruled by Vishnu', sourceKn: 'ಶ್ರವಣ ನಕ್ಷತ್ರ — ವಿಷ್ಣು' },
  Dhanishtha: { messageEn: 'Dance with cosmic rhythm. The Ashtavasus shower prosperity, abundance, and joyful celebration today.', messageKn: 'ಕಾಸ್ಮಿಕ್ ಲಯದೊಂದಿಗೆ ನೃತ್ಯ ಮಾಡಿ. ಅಷ್ಟವಸುಗಳು ಇಂದು ಸಮೃದ್ಧಿ, ಸಂಪದ ಮತ್ತು ಸಂತೋಷದ ಆಚರಣೆಯನ್ನು ಶವರ್ ಮಾಡುತ್ತಾರೆ.', sourceEn: 'Dhanishtha Nakshatra — ruled by Ashtavasus', sourceKn: 'ಧನಿಷ್ಠಾ ನಕ್ಷತ್ರ — ಅಷ್ಟವಸುಗಳು' },
  Shatabhisha: { messageEn: 'Seek the hidden cure. Varuna\'s cosmic laws govern healing, truth, and the mysteries of the infinite.', messageKn: 'ಗುಪ್ತ ಚಿಕಿತ್ಸೆಯನ್ನು ಹುಡುಕಿ. ವರುಣನ ಕಾಸ್ಮಿಕ್ ನಿಯಮಗಳು ಗುಣಪಡಿಸುವಿಕೆ, ಸತ್ಯ ಮತ್ತು ಅನಂತದ ರಹಸ್ಯಗಳನ್ನು ಆಳಿಸುತ್ತವೆ.', sourceEn: 'Shatabhisha Nakshatra — ruled by Varuna', sourceKn: 'ಶತಭಿಷ ನಕ್ಷತ್ರ — ವರುಣ' },
  Purva_Bhadrapada: { messageEn: 'Ignite righteous passion. Aja Ekapada\'s single-footed fire burns away impurities and lights the path.', messageKn: 'ಧಾರ್ಮಿಕ ಉತ್ಸಾಹವನ್ನು ಹೊತ್ತಿಸಿ. ಅಜ ಏಕಪಾದ ಅಶುದ್ಧಿಗಳನ್ನು ಸುಡುತ್ತಾನೆ ಮತ್ತು ಮಾರ್ಗವನ್ನು ಬೆಳಗಿಸುತ್ತಾನೆ.', sourceEn: 'Purva Bhadrapada — ruled by Aja Ekapada', sourceKn: 'ಪೂರ್ವ ಭಾದ್ರಪದ — ಅಜ ಏಕಪಾದ' },
  Uttara_Bhadrapada: { messageEn: 'Rest in the depths. Ahir Budhnya\'s serpentine wisdom nurtures contemplation, stability, and moksha.', messageKn: 'ಆಳದಲ್ಲಿ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ. ಅಹಿರ್ ಬುಧ್ನ್ಯನ ಸರ್ಪ ಜ್ಞಾನ ಚಿಂತನೆ, ಸ್ಥಿರತೆ ಮತ್ತು ಮೋಕ್ಷವನ್ನು ಪೋಷಿಸುತ್ತದೆ.', sourceEn: 'Uttara Bhadrapada — ruled by Ahir Budhnya', sourceKn: 'ಉತ್ತರ ಭಾದ್ರಪದ — ಅಹಿರ್ ಬುಧ್ನ್ಯ' },
  Revati:     { messageEn: 'Trust the journey\'s end. Pushan guides safe arrival, nourishes travellers, and shepherds souls home.', messageKn: 'ಯಾತ್ರೆಯ ಅಂತ್ಯವನ್ನು ನಂಬಿ. ಪೂಷನ್ ಸುರಕ್ಷಿತ ಆಗಮನವನ್ನು ಮಾರ್ಗದರ್ಶನ ಮಾಡುತ್ತಾನೆ, ಪ್ರಯಾಣಿಕರನ್ನು ಪೋಷಿಸುತ್ತಾನೆ.', sourceEn: 'Revati Nakshatra — ruled by Pushan', sourceKn: 'ರೇವತಿ ನಕ್ಷತ್ರ — ಪೂಷನ್' },
}

// Default message if nakshatra not found
const DEFAULT_MESSAGE: SpiritualMessage = {
  messageEn:  'Today holds divine potential. Align with the cosmic rhythm through gratitude, presence, and sacred intention.',
  messageKn:  'ಇಂದು ದೈವಿಕ ಸಾಮರ್ಥ್ಯ ಹೊಂದಿದೆ. ಕೃತಜ್ಞತೆ, ಉಪಸ್ಥಿತಿ ಮತ್ತು ಪವಿತ್ರ ಉದ್ದೇಶದ ಮೂಲಕ ಕಾಸ್ಮಿಕ್ ಲಯದೊಂದಿಗೆ ಹೊಂದಿಸಿಕೊಳ್ಳಿ.',
  sourceEn:   'VedRith Daily Wisdom',
  sourceKn:   'ವೇದ ರಿತ ದೈನಿಕ ಜ್ಞಾನ',
}

// ── Auspicious colours / flowers by Vara ─────────────────────────────────────

const VARA_AUSPICIOUS: DailyAuspicious[] = [
  { colour: { en: 'Red', kn: 'ಕೆಂಪು' }, flower: { en: 'Lotus', kn: 'ತಾಮರೆ' },      number: 1, direction: { en: 'East', kn: 'ಪೂರ್ವ' } },
  { colour: { en: 'White', kn: 'ಬಿಳಿ' }, flower: { en: 'Jasmine', kn: 'ಮಲ್ಲಿಗೆ' },  number: 2, direction: { en: 'North', kn: 'ಉತ್ತರ' } },
  { colour: { en: 'Pink', kn: 'ಗುಲಾಬಿ' }, flower: { en: 'Hibiscus', kn: 'ದಾಸವಾಳ' }, number: 9, direction: { en: 'South', kn: 'ದಕ್ಷಿಣ' } },
  { colour: { en: 'Green', kn: 'ಹಸಿರು' }, flower: { en: 'Tulsi', kn: 'ತುಳಸಿ' },     number: 5, direction: { en: 'North', kn: 'ಉತ್ತರ' } },
  { colour: { en: 'Yellow', kn: 'ಹಳದಿ' }, flower: { en: 'Marigold', kn: 'ಚೆಂಡು' },  number: 3, direction: { en: 'East', kn: 'ಪೂರ್ವ' } },
  { colour: { en: 'Pink', kn: 'ಗುಲಾಬಿ' }, flower: { en: 'Rose', kn: 'ಗುಲಾಬಿ' },    number: 6, direction: { en: 'South East', kn: 'ಆಗ್ನೇಯ' } },
  { colour: { en: 'Blue', kn: 'ನೀಲಿ' },   flower: { en: 'Neelakamala', kn: 'ನೀಲ ಕಮಲ' }, number: 8, direction: { en: 'West', kn: 'ಪಶ್ಚಿಮ' } },
]

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get the deity of the day based on weekday (primary) and nakshatra (secondary).
 * @param weekday  0=Sunday … 6=Saturday
 */
export function getDailyDeity(weekday: number): DeityInfo {
  return VARA_DEITIES[weekday] ?? VARA_DEITIES[0]
}

/**
 * Get the spiritual message for today based on the Nakshatra.
 * @param nakshatraName  English name of the nakshatra (from the engine output)
 */
export function getDailySpiritualMessage(nakshatraName: string): SpiritualMessage {
  // Normalise name — engine may return "Purva Phalguni" or "Purva_Phalguni"
  const key = nakshatraName.replace(/\s+/g, '_')
  return NAKSHATRA_MESSAGES[key] ?? NAKSHATRA_MESSAGES[nakshatraName] ?? DEFAULT_MESSAGE
}

/**
 * Get today's auspicious colour, flower, number and direction based on weekday.
 * @param weekday  0=Sunday … 6=Saturday
 */
export function getDailyAuspicious(weekday: number): DailyAuspicious {
  return VARA_AUSPICIOUS[weekday] ?? VARA_AUSPICIOUS[0]
}
