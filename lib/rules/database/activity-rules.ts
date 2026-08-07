// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Traditional Rules Engine V1 — Activity Rule Database
//
// Every rule is a first-class VedicRule object with full classical metadata.
// Rules are immutable constants — no logic lives here, only data.
//
// Source: Muhurta Chintamani (Rama Dayalu), Dharma Sindhu (Kashinath Upadhyaya),
// Nirnaya Sindhu (Kamalakara Bhatta), Brihat Samhita (Varahamihira),
// Hora Sara (Prithuyasas), Kalaprakashika. Summaries only — no verbatim copying.
// ─────────────────────────────────────────────────────────────────────────────

import type { VedicRule } from '../types'

const NOW = '2026-07-20T00:00:00Z'

export const ACTIVITY_RULES: VedicRule[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // MARRIAGE RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'marriage-auspicious-nakshatras',
    version: '1.0.0',
    category: 'Marriage',
    applicableTithi:    '*',
    applicableNakshatra: ['Rohini','Mrigashira','Magha','UttaraPhalguni','Hasta','Swati',
                          'Anuradha','Mrigashira','Shravana','Dhanishtha','Shatabhisha',
                          'UttaraBhadrapada','Revati'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Nakshatra is listed among the premier marriage-auspicious Nakshatras in Muhurta Chintamani', kn: 'ನಕ್ಷತ್ರವು ವಿವಾಹಕ್ಕೆ ಅನುಕೂಲಕರವಾಗಿದೆ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'This Nakshatra is specifically listed as auspicious for Vivah (marriage ceremonies) in classical Muhurta texts. It provides stable, harmonious, and fertile energy for the commencement of marital life.',
      kn: 'ಈ ನಕ್ಷತ್ರವು ಮುಹೂರ್ತ ಗ್ರಂಥಗಳಲ್ಲಿ ವಿವಾಹಕ್ಕೆ ಶ್ರೇಷ್ಠವೆಂದು ಪ್ರಸಿದ್ಧವಾಗಿದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 5 — Vivaha', summary: 'Lists Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Shravana, Revati as premier Nakshatras for marriage ceremonies.', language: 'en' },
      { source: 'DharmaSindhu', chapter: 'Vivaha Prakarana', summary: 'Enumerates the same Nakshatra set with additional commentary on the qualities each imparts to the marital union.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'marriage-prohibited-nakshatras',
    version: '1.0.0',
    category: 'Marriage',
    applicableTithi:    '*',
    applicableNakshatra: ['Bharani','Krittika','Ardra','Ashlesha','Jyeshtha','Moola','Pushya'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'This Nakshatra is specifically prohibited for Vivah in Muhurta Chintamani', kn: 'ಈ ನಕ್ಷತ್ರವು ವಿವಾಹಕ್ಕೆ ನಿಷಿದ್ಧ' },
      { en: 'Pushya, though auspicious for most activities, is explicitly prohibited for marriage in classical texts', kn: 'ಪುಷ್ಯ ವಿವಾಹ ಮುಹೂರ್ತಕ್ಕೆ ನಿಷಿದ್ಧ' },
    ],
    reason: {
      en: 'This Nakshatra is explicitly prohibited for Vivah in Muhurta Chintamani and Dharma Sindhu. The presiding deity and energetic quality of this Nakshatra are considered inauspicious for beginning the marital relationship — they can introduce instability, separation, or hardship into the marriage.',
      kn: 'ಈ ನಕ್ಷತ್ರದಲ್ಲಿ ವಿವಾಹ ಮಾಡಿಕೊಳ್ಳುವುದು ಮುಹೂರ್ತ ಗ್ರಂಥಗಳಲ್ಲಿ ನಿಷಿದ್ಧ. ಇದು ದಾಂಪತ್ಯ ಜೀವನದಲ್ಲಿ ಕಷ್ಟ ತರಬಹುದು.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 5 — Vivaha', summary: 'Explicitly lists Bharani, Krittika, Ardra, Ashlesha, Jyeshtha, Moola as prohibited Nakshatras for Vivah due to their fierce (Ugra/Tikshna) and destructive qualities.', language: 'en' },
      { source: 'DharmaSindhu', chapter: 'Vivaha Prakarana', summary: 'Confirms the prohibition and adds that Pushya, despite being the king of auspicious Nakshatras for general activities, is specifically excluded from Vivah Nakshatras.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'marriage-auspicious-tithis',
    version: '1.0.0',
    category: 'Marriage',
    applicableTithi:    ['Dvitiya','Tritiya','Panchami','Saptami','Dashami','Ekadashi','Trayodashi'],
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'This Tithi is among the classical list of Vivah-auspicious Tithis', kn: 'ಈ ತಿಥಿ ವಿವಾಹಕ್ಕೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'This Tithi is listed among the auspicious Tithis for Vivah (Dvitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi). These Tithis carry harmonious, stable, and prosperous energy that supports the beginning of marital life.',
      kn: 'ಈ ತಿಥಿ ವಿವಾಹಕ್ಕೆ ಅನುಕೂಲ. ಇದು ದಾಂಪತ್ಯ ಜೀವನಕ್ಕೆ ಸ್ಥಿರತೆ ಮತ್ತು ಸಮೃದ್ಧಿ ತರುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 5', summary: 'Identifies the 7 auspicious Tithis for Vivah. These Tithis avoid the deficient (Rikta) quality of 4th, 9th, 14th and the transitional endings of Purnima and Amavasya.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'marriage-rikta-tithis',
    version: '1.0.0',
    category: 'Marriage',
    applicableTithi:    ['Chaturthi','Navami','Chaturdashi','Amavasya'],
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Rikta (deficient) or inauspicious Tithi for marriage', kn: 'ರಿಕ್ತ ತಿಥಿ — ವಿವಾಹಕ್ಕೆ ಅನುಕೂಲವಲ್ಲ' },
    ],
    reason: {
      en: 'This is a Rikta (deficient/empty) Tithi or specifically inauspicious for marriage. Chaturthi, Navami, Chaturdashi, and Amavasya are considered inauspicious for Vivah because their energetic qualities — Ganesha\'s obstacle energy, Durga\'s fierce energy, Shiva\'s dissolution energy, and the new moon\'s ancestral energy respectively — are not conducive to new marital beginnings.',
      kn: 'ಈ ತಿಥಿ ವಿವಾಹಕ್ಕೆ ನಿಷಿದ್ಧ. ರಿಕ್ತ ತಿಥಿಯ ಶಕ್ತಿ ವಿವಾಹ ಆರಂಭಕ್ಕೆ ಅನುಕೂಲವಲ್ಲ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 5 — Vivaha', summary: 'Prohibits Rikta Tithis (4th, 9th, 14th) and Amavasya for marriage as they carry deficient, fierce, or ancestral energy unsuitable for new auspicious beginnings.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'marriage-vara-auspicious',
    version: '1.0.0',
    category: 'Marriage',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Monday','Wednesday','Thursday','Friday'],
    applicablePaksha:   '*',
    priority: 20,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'This weekday is auspicious for marriage — its ruling planet promotes harmony and marital happiness', kn: 'ಈ ವಾರ ವಿವಾಹಕ್ಕೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Monday (Moon — domestic harmony), Wednesday (Mercury — intellectual compatibility), Thursday (Jupiter — wisdom and prosperity in marriage), and Friday (Venus — the planet of love and marital happiness) are the four weekdays considered most auspicious for Vivah in classical Muhurta tradition.',
      kn: 'ಸೋಮ, ಬುಧ, ಗುರು, ಮತ್ತು ಶುಕ್ರ ವಾರಗಳು ವಿವಾಹಕ್ಕೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ. ಈ ವಾರಗಳ ಅಧಿಪತಿ ಗ್ರಹಗಳು ದಾಂಪತ್ಯ ಜೀವನಕ್ಕೆ ಸಂತೋಷ ತರುತ್ತವೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 5', summary: 'Lists Monday, Wednesday, Thursday, and Friday as the four Varas suitable for Vivah, based on the benefic nature of their ruling planets.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'marriage-vara-inauspicious',
    version: '1.0.0',
    category: 'Marriage',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Tuesday','Saturday'],
    applicablePaksha:   '*',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Mars and Saturn weekdays increase discord and delay in marriage', kn: 'ಮಂಗಳ ಮತ್ತು ಶನಿ ವಾರ ವಿವಾಹಕ್ಕೆ ಅಡ್ಡಿ ತರುತ್ತದೆ' },
    ],
    reason: {
      en: 'Tuesday (Mars — conflict and aggression) and Saturday (Saturn — delay, restriction, and karmic burden) are generally avoided for marriage ceremonies. Their ruling planets introduce energies of conflict, separation, or prolonged difficulty into the marital relationship.',
      kn: 'ಮಂಗಳ ಮತ್ತು ಶನಿ ವಾರಗಳಲ್ಲಿ ವಿವಾಹ ಅಶಾಂತಿ, ವಿಳಂಬ ಮತ್ತು ಕಷ್ಟ ತರಬಹುದು.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 5', summary: 'Excludes Tuesday and Saturday from the list of Vivah-suitable Varas, citing the malefic influence of Mars and Saturn on conjugal harmony.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [
      { region: 'TamilNadu', reason: 'In Tamil tradition, Sunday is also sometimes avoided for Vivah.', suitability: 'Avoid' },
    ],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GRIHA PRAVESHA RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'gruha-pravesha-auspicious-nakshatras',
    version: '1.0.0',
    category: 'GruhaPravesha',
    applicableTithi:    '*',
    applicableNakshatra: ['Rohini','Mrigashira','Punarvasu','Pushya','UttaraPhalguni','Hasta',
                          'Chitra','Anuradha','Shravana','Dhanishtha','Revati'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   'Shukla',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Auspicious Nakshatra for home entry in Shukla Paksha', kn: 'ಶುಕ್ಲ ಪಕ್ಷ ಗೃಹ ಪ್ರವೇಶಕ್ಕೆ ಶ್ರೇಷ್ಠ ನಕ್ಷತ್ರ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'This Nakshatra is auspicious for Griha Pravesha (home entry ceremony) — it confers stability, prosperity, and long-term wellbeing to the household. The Shukla Paksha (waxing moon) condition ensures the lunar energy supports growth and flourishing in the new home.',
      kn: 'ಈ ನಕ್ಷತ್ರದಲ್ಲಿ ಶುಕ್ಲ ಪಕ್ಷದಲ್ಲಿ ಗೃಹ ಪ್ರವೇಶ ಮಾಡಿದರೆ ಮನೆಯಲ್ಲಿ ಸುಖ ಮತ್ತು ಸಮೃದ್ಧಿ ಉಂಟಾಗುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 7 — Griha Pravesha', summary: 'Lists the auspicious Nakshatras for home entry and mandates Shukla Paksha for Griha Pravesha to ensure the increasing lunar energy supports prosperity in the new home.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'gruha-pravesha-krishna-paksha',
    version: '1.0.0',
    category: 'GruhaPravesha',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   'Krishna',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Krishna Paksha (waning moon) is generally avoided for Griha Pravesha', kn: 'ಕೃಷ್ಣ ಪಕ್ಷದಲ್ಲಿ ಗೃಹ ಪ್ರವೇಶ ಅನುಕೂಲವಲ್ಲ' },
    ],
    reason: {
      en: 'Krishna Paksha (the waning fortnight) is generally avoided for Griha Pravesha because the decreasing lunar energy is inauspicious for beginning new household phases. The energy of the waning moon is associated with withdrawal and diminishment rather than growth and prosperity.',
      kn: 'ಕೃಷ್ಣ ಪಕ್ಷದಲ್ಲಿ ಚಂದ್ರ ಕ್ಷೀಣಿಸುತ್ತಿರುತ್ತಾನೆ. ಹೊಸ ಮನೆ ಪ್ರವೇಶಕ್ಕೆ ಇದು ಅಶುಭ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 7', summary: 'Mandates Shukla Paksha for Griha Pravesha, with the waning moon phase considered inauspicious for new household beginnings.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'gruha-pravesha-prohibited-nakshatras',
    version: '1.0.0',
    category: 'GruhaPravesha',
    applicableTithi:    '*',
    applicableNakshatra: ['Moola','Bharani','Ashlesha','Jyeshtha','Ardra'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Fierce (Ugra/Tikshna) Nakshatra — inauspicious for home entry', kn: 'ಉಗ್ರ ನಕ್ಷತ್ರ — ಗೃಹ ಪ್ರವೇಶಕ್ಕೆ ಅನುಕೂಲವಲ್ಲ' },
    ],
    reason: {
      en: 'Fierce (Ugra/Tikshna) Nakshatras are specifically avoided for Griha Pravesha because their destructive or uprooting energy is inauspicious for settling into a new home. Moola (the uprooter), Jyeshtha, and Ashlesha in particular are associated with instability in household matters.',
      kn: 'ಉಗ್ರ ನಕ್ಷತ್ರಗಳಲ್ಲಿ ಗೃಹ ಪ್ರವೇಶ ಮಾಡಿದರೆ ಮನೆಯಲ್ಲಿ ಅಶಾಂತಿ ಉಂಟಾಗಬಹುದು.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 7', summary: 'Prohibits Ugra and Tikshna Nakshatras for Griha Pravesha — especially Moola, due to its "uprooting" quality which is antithetical to settling into a new home.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AKSHARABHYASA (FIRST WRITING) RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'aksharabhyasa-mercury-vara',
    version: '1.0.0',
    category: 'Aksharabhyasa',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Wednesday'],
    applicablePaksha:   '*',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Wednesday (Mercury) is the premier day for educational beginnings', kn: 'ಬುಧವಾರ ವಿದ್ಯಾರಂಭಕ್ಕೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Wednesday is ruled by Mercury (Budha) — the planet of intelligence, writing, learning, and all forms of communication. It is the supreme day for Aksharabhyasa (the ceremony of first writing) as Budha directly governs literacy and intellectual development. Classical texts unanimously recommend Wednesday for all educational beginnings.',
      kn: 'ಬುಧವಾರ ಬುಧ ಗ್ರಹದ ದಿನ. ಬುಧನು ವಿದ್ಯಾ, ಬುದ್ಧಿ ಮತ್ತು ಲೇಖನದ ಅಧಿಪತಿ. ಅಕ್ಷರಾಭ್ಯಾಸಕ್ಕೆ ಬುಧವಾರ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 3 — Vidyarambha', summary: 'Specifically identifies Wednesday as the most auspicious Vara for Aksharabhyasa/Vidyarambha due to Mercury\'s direct rulership over all forms of learning and writing.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'aksharabhyasa-jupiter-vara',
    version: '1.0.0',
    category: 'Aksharabhyasa',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Thursday'],
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Thursday (Jupiter) blesses all educational beginnings with wisdom', kn: 'ಗುರುವಾರ ವಿದ್ಯಾರಂಭಕ್ಕೆ ಉತ್ತಮ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Thursday is ruled by Jupiter (Guru/Brihaspati) — the divine teacher of the cosmos. Brihaspati governs sacred knowledge, wisdom, philosophy, and the guru-shishya relationship. Beginning educational life on Thursday places the learner under Jupiter\'s direct blessing, ensuring academic success, wisdom, and a deep love for learning.',
      kn: 'ಗುರುವಾರ ಬೃಹಸ್ಪತಿಯ ದಿನ. ಗುರು ವಿದ್ಯೆ ಮತ್ತು ಜ್ಞಾನದ ಅಧಿಪತಿ. ಇಂದು ಅಕ್ಷರಾಭ್ಯಾಸ ಮಾಡಿದರೆ ವಿದ್ಯಾರ್ಥಿಯು ಜ್ಞಾನ ಮತ್ತು ಬುದ್ಧಿ ಪಡೆಯುತ್ತಾರೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 3', summary: 'Recommends Thursday as the second-best Vara for Aksharabhyasa, as Jupiter\'s blessing on educational beginnings ensures wisdom, devotion to learning, and academic achievement.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'aksharabhyasa-auspicious-nakshatras',
    version: '1.0.0',
    category: 'Aksharabhyasa',
    applicableTithi:    '*',
    applicableNakshatra: ['Ashwini','Rohini','Punarvasu','Pushya','Hasta','Chitra','Swati',
                          'Anuradha','Shravana','Revati','Mrigashira'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Quick, light, or soft Nakshatra — ideal for beginning education', kn: 'ಕ್ಷಿಪ್ರ/ಮೃದು ನಕ್ಷತ್ರ — ವಿದ್ಯಾರಂಭಕ್ಕೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'This Nakshatra is among the light (Kshipra), soft (Mridu), or fixed (Dhruva) Nakshatras that are classically recommended for Aksharabhyasa and Vidyarambha. These Nakshatras promote swift learning, retention of knowledge, and the development of intellect and communication skills in the child.',
      kn: 'ಈ ನಕ್ಷತ್ರ ಅಕ್ಷರಾಭ್ಯಾಸಕ್ಕೆ ಅನುಕೂಲ. ಇದು ಮಗುವಿನ ವಿದ್ಯಾ ಬುದ್ಧಿ ವಿಕಾಸಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 3 — Vidyarambha', summary: 'Recommends Kshipra (quick/light), Mridu (soft), and Sthira (fixed) Nakshatras for Vidyarambha, as these confer quick learning ability and stable intellectual development.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRAVEL RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'travel-auspicious-nakshatras',
    version: '1.0.0',
    category: 'Travel',
    applicableTithi:    '*',
    applicableNakshatra: ['Ashwini','Mrigashira','Punarvasu','Pushya','Hasta','Chitra','Swati',
                          'Anuradha','Shravana','Revati'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Classically recommended Nakshatra for beginning a journey', kn: 'ಪ್ರಯಾಣಕ್ಕೆ ಶ್ರೇಷ್ಠ ನಕ್ಷತ್ರ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'This Nakshatra is among those classically recommended for beginning journeys (Yatra). The Kshipra (quick/light) and Mridu (soft/gentle) Nakshatras support safe and swift travel, while Shravana (the listening Nakshatra) places the traveller under Vishnu\'s protection. Revati is especially auspicious as Pushan (the deity) specifically protects travellers and animals.',
      kn: 'ಈ ನಕ್ಷತ್ರ ಪ್ರಯಾಣ ಆರಂಭಕ್ಕೆ ಅತ್ಯಂತ ಅನುಕೂಲ. ಯಾತ್ರೆ ಸುರಕ್ಷಿತ ಮತ್ತು ಯಶಸ್ವಿ ಆಗುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 9 — Yatra', summary: 'Enumerates the travel-auspicious Nakshatras, emphasizing Kshipra and Mridu types for safe, swift journeys and Shravana/Revati for journeys requiring divine protection.', language: 'en' },
      { source: 'BrihatSamhita', chapter: 'Chapter 98 — Yatra Adhyaya', summary: 'Provides detailed guidelines for auspicious travel timing based on Nakshatra, Vara, and Tithi, with specific prescriptions for direction and purpose of journey.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'travel-inauspicious-nakshatras',
    version: '1.0.0',
    category: 'Travel',
    applicableTithi:    '*',
    applicableNakshatra: ['Bharani','Krittika','Ardra','Ashlesha','Jyeshtha','Moola'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Fierce (Ugra/Tikshna) Nakshatra — inauspicious for beginning a journey', kn: 'ಉಗ್ರ ನಕ್ಷತ್ರ — ಪ್ರಯಾಣಕ್ಕೆ ಅನುಕೂಲವಲ್ಲ' },
    ],
    reason: {
      en: 'Fierce (Ugra) and sharp (Tikshna) Nakshatras are avoided for beginning journeys in classical Muhurta tradition. Their energy of conflict, destruction, or turbulence can manifest as accidents, unexpected obstacles, theft, or illness during travel. Moola ("the uprooting" Nakshatra) in particular is avoided for journey starts.',
      kn: 'ಉಗ್ರ ನಕ್ಷತ್ರಗಳಲ್ಲಿ ಪ್ರಯಾಣ ಆರಂಭ ಮಾಡಿದರೆ ಅಪಘಾತ, ಅಡ್ಡಿ ಅಥವಾ ಕಳ್ಳತನ ಆಗಬಹುದು.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 9 — Yatra', summary: 'Explicitly prohibits Ugra and Tikshna Nakshatras for journey commencement, as their fierce energy is inauspicious for safe travel.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'travel-amavasya',
    version: '1.0.0',
    category: 'Travel',
    applicableTithi:    ['Amavasya'],
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Amavasya — new moon creates inauspicious conditions for travel beginnings', kn: 'ಅಮಾವಾಸ್ಯೆ — ಪ್ರಯಾಣಕ್ಕೆ ಅನುಕೂಲವಲ್ಲ' },
    ],
    reason: {
      en: 'Amavasya (new moon) is generally avoided for beginning important journeys. The new moon energy is turned inward and ancestral rather than outward and active — low visibility (especially in the evening) and the absence of lunar guidance make it traditionally inauspicious for starting long journeys.',
      kn: 'ಅಮಾವಾಸ್ಯೆಯಂದು ಪ್ರಯಾಣ ಆರಂಭ ಮಾಡಬಾರದು. ಚಂದ್ರನ ಶಕ್ತಿ ಕ್ಷೀಣಿಸಿರುವ ಈ ದಿನ ಪ್ರಯಾಣ ಅಶುಭ.',
    },
    confidence: 'medium',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 9', summary: 'Recommends against beginning journeys on Amavasya, citing the new moon\'s ancestral and inward-turning energy as unsuitable for outward travel endeavours.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BUSINESS OPENING RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'business-auspicious-vara',
    version: '1.0.0',
    category: 'BusinessOpening',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Wednesday','Thursday','Friday'],
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Mercury (trade), Jupiter (prosperity), Venus (abundance) — benefic weekdays for commerce', kn: 'ವ್ಯಾಪಾರಕ್ಕೆ ಉತ್ತಮ ವಾರ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Wednesday (Mercury — commerce, trade, intellect), Thursday (Jupiter — expansion, prosperity, dharmic business), and Friday (Venus — beauty, luxury goods, abundance) are the three most favoured weekdays for opening a new business. Their ruling planets directly govern commerce, prosperity, and the flow of wealth.',
      kn: 'ಬುಧ (ವ್ಯಾಪಾರ), ಗುರು (ಸಮೃದ್ಧಿ), ಶುಕ್ರ (ಐಶ್ವರ್ಯ) ವಾರಗಳಲ್ಲಿ ವ್ಯವಹಾರ ಆರಂಭ ಲಾಭದಾಯಕ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 10 — Vanijya', summary: 'Recommends Wednesday, Thursday, and Friday for commencing trade and business ventures, citing the commercial and prosperity-bestowing nature of Mercury, Jupiter, and Venus.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'business-inauspicious-yoga',
    version: '1.0.0',
    category: 'BusinessOpening',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     ['Vishkumbha','Atiganda','Shoola','Ganda','Vajra','Vyaghata','Parigha','Vaidhriti'],
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 8,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Inauspicious Yoga creates obstacles for new commercial ventures', kn: 'ಅಶುಭ ಯೋಗ — ವ್ಯಾಪಾರ ಆರಂಭಕ್ಕೆ ಅಡ್ಡಿ' },
    ],
    reason: {
      en: 'These Yogas are classified as inauspicious (Ashubha) in classical Muhurta texts and should be avoided for beginning major commercial ventures. Vishkumbha (obstruction), Shoola (thorny/painful), Ganda (knot/trouble), Vajra (thunderbolt of loss), and Vaidhriti (opposition) are among the worst Yogas for new beginnings in commerce.',
      kn: 'ಈ ಯೋಗಗಳಲ್ಲಿ ವ್ಯಾಪಾರ ಆರಂಭ ಮಾಡಿದರೆ ತೊಂದರೆ, ನಷ್ಟ ಮತ್ತು ಅಡ್ಡಿ ಉಂಟಾಗಬಹುದು.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 2 — Yoga Prakarana', summary: 'Classifies 11 Yogas as Ashubha (inauspicious) and recommends avoiding them for important new ventures including commercial openings.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // VEHICLE PURCHASE RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'vehicle-auspicious-vara',
    version: '1.0.0',
    category: 'VehiclePurchase',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Wednesday','Thursday','Friday','Monday'],
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Benefic weekday — ruling planet promotes safe, prosperous vehicle ownership', kn: 'ಶುಭ ವಾರ — ವಾಹನ ಖರೀದಿಗೆ ಅನುಕೂಲ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Benefic weekdays (Monday, Wednesday, Thursday, Friday) are recommended for vehicle purchase. Their ruling planets (Moon, Mercury, Jupiter, Venus) promote safe journeys, mechanical reliability, and prosperity connected to the vehicle. Saturn and Mars weekdays (Saturday, Tuesday) are generally avoided due to their association with accidents and mechanical failures.',
      kn: 'ಈ ವಾರಗಳಲ್ಲಿ ವಾಹನ ಖರೀದಿ ಮಾಡಿದರೆ ಸುರಕ್ಷಿತ ಮತ್ತು ಲಾಭದಾಯಕ ಆಗುತ್ತದೆ.',
    },
    confidence: 'medium',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 11 — Vahana Prashna', summary: 'Recommends benefic Varas for vehicle-related purchases and inaugurations, avoiding Saturn and Mars days due to their association with mechanical failures and road accidents.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // UPANAYANA (SACRED THREAD) RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'upanayana-jupiter-vara',
    version: '1.0.0',
    category: 'Upanayana',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Thursday'],
    applicablePaksha:   '*',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Thursday (Guru/Brihaspati) — the supreme day for sacred initiations', kn: 'ಗುರುವಾರ ಉಪನಯನಕ್ಕೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Thursday is ruled by Brihaspati (Jupiter) — the divine Guru of the celestial realm and presiding deity of the Upanayana Samskara. The sacred thread ceremony marks the boy\'s initiation into Vedic studentship (Brahmacharya). Performing Upanayana on Thursday places the student directly under Brihaspati\'s blessing for wisdom, devotion to study, and mastery of sacred knowledge.',
      kn: 'ಗುರುವಾರ ಬೃಹಸ್ಪತಿಯ ದಿನ. ಉಪನಯನ ಸಂಸ್ಕಾರದ ಅಧಿಪತಿ ಬೃಹಸ್ಪತಿ. ಗುರುವಾರ ಉಪನಯನ ಮಾಡಿದರೆ ವಿದ್ಯೆ ಮತ್ತು ಜ್ಞಾನ ಪ್ರಾಪ್ತಿ ಉಂಟಾಗುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'DharmaSindhu', chapter: 'Upanayana Prakarana', summary: 'Identifies Thursday as the most auspicious Vara for Upanayana due to Jupiter\'s direct rulership over Vedic knowledge, the guru-shishya relationship, and the Brahmacharya stage of life.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'upanayana-mars-saturn-avoid',
    version: '1.0.0',
    category: 'Upanayana',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Tuesday','Saturday'],
    applicablePaksha:   '*',
    priority: 5,
    conditions: [],
    exceptions: [],
    recommendation: 'Avoid',
    supportingFactors: [],
    conflictingFactors: [
      { en: 'Mars and Saturn weekdays are inauspicious for sacred initiations', kn: 'ಮಂಗಳ/ಶನಿ ವಾರ ಉಪನಯನಕ್ಕೆ ಅನುಕೂಲವಲ್ಲ' },
    ],
    reason: {
      en: 'Tuesday (Mars) and Saturday (Saturn) are specifically avoided for Upanayana in classical Grihyasutras and Muhurta texts. Mars introduces aggressive, warlike energy unsuitable for beginning the gentle brahmacharya stage, while Saturn\'s delaying and restricting energy is inauspicious for initiating the sacred student-teacher relationship.',
      kn: 'ಮಂಗಳ ಮತ್ತು ಶನಿ ವಾರ ಉಪನಯನ ಸಂಸ್ಕಾರಕ್ಕೆ ನಿಷಿದ್ಧ. ಇವು ಅಧ್ಯಯನ ಜೀವನಕ್ಕೆ ಕಷ್ಟ ತರಬಹುದು.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'DharmaSindhu', chapter: 'Upanayana Prakarana', summary: 'Prohibits Tuesday and Saturday for Upanayana, citing the malefic influence of Mars and Saturn on the sacred studentship (Brahmacharya) period.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LAND PURCHASE RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'land-purchase-fixed-nakshatras',
    version: '1.0.0',
    category: 'LandPurchase',
    applicableTithi:    '*',
    applicableNakshatra: ['Rohini','UttaraPhalguni','UttaraAshadha','UttaraBhadrapada'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Dhruva (fixed) Nakshatra — ideal for land and property transactions', kn: 'ಧ್ರುವ ನಕ್ಷತ್ರ — ಭೂಮಿ ಖರೀದಿಗೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'The four Dhruva (fixed/stable) Nakshatras — Rohini, Uttara Phalguni, Uttara Ashadha, and Uttara Bhadrapada — are classically ideal for land and property transactions. Their fixed, stable nature ensures permanence and security in real estate. Land purchased under these Nakshatras is traditionally said to bring lasting prosperity and to remain firmly in the family lineage.',
      kn: 'ಧ್ರುವ ನಕ್ಷತ್ರಗಳಲ್ಲಿ ಭೂಮಿ ಖರೀದಿ ಮಾಡಿದರೆ ಆಸ್ತಿ ಸ್ಥಿರ ಮತ್ತು ಸಮೃದ್ಧಿ ತರುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 13 — Sthira Karma', summary: 'Recommends Dhruva (fixed) Nakshatras for Sthira (stable/permanent) activities including land purchase, home construction, and long-term investments that require permanence.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MEDICAL PROCEDURE RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'medical-solar-vara',
    version: '1.0.0',
    category: 'MedicalProcedure',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Sunday','Wednesday','Thursday'],
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Sun (vitality), Mercury (medicine/healing), Jupiter (recovery) — auspicious days for medical procedures', kn: 'ವೈದ್ಯಕೀಯ ಕ್ರಿಯೆಗೆ ಶ್ರೇಷ್ಠ ವಾರ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Sunday (Sun — life force and health), Wednesday (Mercury — medicine and diagnostic intelligence), and Thursday (Jupiter — healing, recovery, and the body\'s self-correction mechanisms) are the three most auspicious weekdays for medical procedures and treatments. The Ashwini Kumaras (divine physicians) are invoked on these days for healing blessings.',
      kn: 'ಈ ವಾರಗಳಲ್ಲಿ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಆರಂಭ ಮಾಡಿದರೆ ಆರೋಗ್ಯ ಲಾಭ ಮತ್ತು ಶೀಘ್ರ ಗುಣ ಉಂಟಾಗುತ್ತದೆ.',
    },
    confidence: 'medium',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 14 — Aushadha Graha', summary: 'Recommends Sunday, Wednesday, and Thursday for beginning medical treatments, citing the healing properties associated with the Sun, Mercury, and Jupiter respectively.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SPIRITUAL PRACTICES RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'spiritual-purnima',
    version: '1.0.0',
    category: 'SpiritualPractices',
    applicableTithi:    ['Purnima'],
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Full moon amplifies all spiritual practices — Sattvic energy peaks', kn: 'ಹುಣ್ಣಿಮೆ — ಎಲ್ಲ ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆಗಳಿಗೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Purnima (full moon) is universally considered the most powerful day for spiritual practice. The Moon at complete fullness amplifies all Sattvic (pure) energy in the cosmos and in the practitioner\'s mind. Meditation, japa (mantra repetition), fasting, pilgrimage, and Guru worship are all most effective when performed on Purnima.',
      kn: 'ಹುಣ್ಣಿಮೆಯಂದು ಎಲ್ಲ ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆಗಳ ಫಲ ಹೆಚ್ಚಾಗುತ್ತದೆ. ಜಪ, ಧ್ಯಾನ, ಉಪವಾಸ ಎಲ್ಲವೂ ವಿಶೇಷ ಫಲ ನೀಡುತ್ತವೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'BrihatSamhita', chapter: 'Chapter 24', summary: 'Describes the full moon as maximally auspicious for all spiritual practices — the Moon\'s complete reflection of solar consciousness represents the mind\'s complete reflection of Brahman.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  {
    id: 'spiritual-ekadashi',
    version: '1.0.0',
    category: 'SpiritualPractices',
    applicableTithi:    ['Ekadashi'],
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Ekadashi — supreme day for Vishnu devotion and Sattvic spiritual practice', kn: 'ಏಕಾದಶಿ — ವಿಷ್ಣು ಭಕ್ತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮ ಸಾಧನೆಗೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Ekadashi (the 11th lunar day) is the most important recurring spiritual observance in the Vaishnava tradition. Beyond the 10 senses and the mind, the 11th represents the transcendent witness consciousness. Fasting on Ekadashi is said to be equivalent in merit to all forms of pilgrimage and Vedic sacrifice combined.',
      kn: 'ಏಕಾದಶಿ ವಿಷ್ಣು ಭಕ್ತರಿಗೆ ಪವಿತ್ರ ದಿನ. ಈ ದಿನ ಉಪವಾಸ, ಜಪ ಮತ್ತು ಧ್ಯಾನ ಮಾಡಿದರೆ ಮೋಕ್ಷ ಮಾರ್ಗ ಸಿಗುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'VisnuPurana', chapter: 'Ekadashi Mahatmya', summary: 'Extols the supreme merit of Ekadashi fasting, stating it purifies accumulated karma across many lifetimes and is the most accessible path to Vishnu\'s grace for devotees in all walks of life.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TEMPLE VISIT RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'temple-visit-auspicious-general',
    version: '1.0.0',
    category: 'TempleVisit',
    applicableTithi:    ['Purnima','Ekadashi','Saptami','Navami','Chaturdashi'],
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 20,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Special Tithi — temple energy peaks on these sacred lunar days', kn: 'ವಿಶೇಷ ತಿಥಿ — ದೇವಸ್ಥಾನ ಭೇಟಿಗೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'These Tithis are the most auspicious for temple worship as they correspond to major lunar milestones and specific deity energies: Purnima (full moon — Vishnu and Lakshmi), Ekadashi (Vishnu), Saptami (Surya), Navami (Durga in Navratri context), Chaturdashi (Shiva). Temple visits on these Tithis are said to multiply the spiritual merit of worship many-fold.',
      kn: 'ಈ ತಿಥಿಗಳಲ್ಲಿ ದೇವಸ್ಥಾನ ಭೇಟಿ ವಿಶೇಷ ಫಲ ನೀಡುತ್ತದೆ. ಪ್ರತಿ ತಿಥಿಯ ಅಧಿಪತಿ ದೇವರ ವಿಶೇಷ ಕೃಪೆ ಸಿಗುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'DharmaSindhu', chapter: 'Titha Mahatmya', summary: 'Specifies the most auspicious Tithis for temple worship, connecting each to the primary deity whose energy peaks on that lunar day.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW INVESTMENT RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'investment-shukla-paksha',
    version: '1.0.0',
    category: 'NewInvestment',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   'Shukla',
    priority: 20,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Shukla Paksha — waxing lunar energy supports growth and increase of wealth', kn: 'ಶುಕ್ಲ ಪಕ್ಷ — ಸಂಪತ್ತು ವೃದ್ಧಿಗೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Shukla Paksha (the waxing fortnight, from new moon to full moon) carries increasing lunar energy that supports growth, accumulation, and prosperity. New investments, savings plans, and financial beginnings during Shukla Paksha are traditionally said to grow and multiply just as the Moon grows in this fortnight.',
      kn: 'ಶುಕ್ಲ ಪಕ್ಷದಲ್ಲಿ ಚಂದ್ರ ವೃದ್ಧಿ ಆಗುತ್ತಾನೆ. ಹೊಸ ಹೂಡಿಕೆ ಮತ್ತು ಉಳಿತಾಯ ಈ ಸಮಯದಲ್ಲಿ ಲಾಭದಾಯಕ.',
    },
    confidence: 'medium',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 10 — Artha Prakarana', summary: 'Recommends Shukla Paksha for financial beginnings and new investments as the waxing lunar energy mirrors the desired growth of the investment.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NAMING CEREMONY RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'naming-auspicious-nakshatras',
    version: '1.0.0',
    category: 'NamingCeremony',
    applicableTithi:    '*',
    applicableNakshatra: ['Ashwini','Rohini','Punarvasu','Pushya','Hasta','Swati','Anuradha',
                          'Shravana','Revati','Mrigashira'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     '*',
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Auspicious Nakshatra for Namakarana — bestows wellbeing on the child', kn: 'ನಾಮಕರಣಕ್ಕೆ ಶ್ರೇಷ್ಠ ನಕ್ಷತ್ರ — ಮಗುವಿಗೆ ಶ್ರೇಯಸ್ಸು ಉಂಟಾಗುತ್ತದೆ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'These Nakshatras are listed as auspicious for Namakarana (the naming ceremony) in classical Grhyasutras and Muhurta texts. The gentle (Mridu), quick (Kshipra), and soft Nakshatras confer long life, health, intelligence, and prosperity on the child named during these Nakshatras. The name given during an auspicious Nakshatra carries the energy of that Nakshatra\'s deity throughout the child\'s life.',
      kn: 'ಈ ನಕ್ಷತ್ರಗಳಲ್ಲಿ ನಾಮಕರಣ ಮಾಡಿದ ಮಗು ಆಯುಷ್ಯ, ಆರೋಗ್ಯ ಮತ್ತು ಬುದ್ಧಿ ಪಡೆಯುತ್ತಾರೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'DharmaSindhu', chapter: 'Namakarana Prakarana', summary: 'Lists the auspicious Nakshatras for the naming ceremony, explaining that the Nakshatra\'s presiding deity imparts its qualities to the child through the sacred act of naming.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ANNAPRASHANA (FIRST SOLID FOOD) RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'annaprashana-auspicious',
    version: '1.0.0',
    category: 'Annaprashana',
    applicableTithi:    '*',
    applicableNakshatra: ['Rohini','Mrigashira','Pushya','Hasta','Chitra','Swati','Anuradha',
                          'Shravana','Revati','Punarvasu','Ashwini'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Wednesday','Thursday','Friday','Monday'],
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Auspicious Nakshatra and benefic weekday for Annaprashana', kn: 'ಅನ್ನ ಪ್ರಾಶನಕ್ಕೆ ಶ್ರೇಷ್ಠ ನಕ್ಷತ್ರ ಮತ್ತು ವಾರ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'The combination of an auspicious Nakshatra (particularly nourishing Nakshatras like Rohini, Pushya, and Hasta) with a benefic weekday creates the ideal conditions for Annaprashana (the first solid food ceremony). This ceremony marks a crucial milestone in the child\'s physical development, and an auspicious Muhurta ensures the child\'s lifelong relationship with food, health, and nourishment is harmonious and abundant.',
      kn: 'ಈ ನಕ್ಷತ್ರ ಮತ್ತು ವಾರ ಅನ್ನ ಪ್ರಾಶನಕ್ಕೆ ಅತ್ಯಂತ ಅನುಕೂಲ. ಮಗುವಿನ ಆರೋಗ್ಯ ಮತ್ತು ಪೋಷಣೆ ಶ್ರೇಷ್ಠ ಆಗುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'DharmaSindhu', chapter: 'Annaprashana Prakarana', summary: 'Specifies the auspicious Nakshatras for Annaprashana, emphasizing nourishing (Rohini, Pushya) and protective (Hasta, Anuradha) Nakshatras for the child\'s healthy physical development.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BHOOMI POOJA RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'bhoomi-pooja-auspicious',
    version: '1.0.0',
    category: 'BhoomiPooja',
    applicableTithi:    '*',
    applicableNakshatra: ['Rohini','Mrigashira','Hasta','Chitra','Swati','Anuradha','Pushya','Shravana'],
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Wednesday','Thursday','Friday'],
    applicablePaksha:   'Shukla',
    priority: 10,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Auspicious Nakshatra, benefic weekday, and Shukla Paksha for ground-breaking', kn: 'ಭೂಮಿ ಪೂಜೆಗೆ ಶ್ರೇಷ್ಠ ನಕ್ಷತ್ರ, ವಾರ ಮತ್ತು ಶುಕ್ಲ ಪಕ್ಷ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'The ideal Bhoomi Pooja (ground-breaking ceremony) combines an auspicious Nakshatra with a benefic weekday during Shukla Paksha. The waxing moon ensures the building project grows to completion; the auspicious Nakshatra provides stable, prosperous energy for the construction; and the benefic weekday (Mercury, Jupiter, or Venus) ensures smooth progress, good relationships with builders, and ultimate success.',
      kn: 'ಶ್ರೇಷ್ಠ ನಕ್ಷತ್ರ, ಉತ್ತಮ ವಾರ ಮತ್ತು ಶುಕ್ಲ ಪಕ್ಷದಲ್ಲಿ ಭೂಮಿ ಪೂಜೆ ಮಾಡಿದರೆ ನಿರ್ಮಾಣ ಕಾರ್ಯ ಸುಗಮ ಮತ್ತು ಯಶಸ್ವಿ ಆಗುತ್ತದೆ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 8 — Bhoomi Karma', summary: 'Provides detailed guidelines for Bhoomi Pooja, emphasizing the three conditions of auspicious Nakshatra, benefic Vara, and Shukla Paksha for the most successful ground-breaking ceremony.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EDUCATION RULES
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'education-mercury-jupiter',
    version: '1.0.0',
    category: 'Education',
    applicableTithi:    '*',
    applicableNakshatra: '*',
    applicableYoga:     '*',
    applicableKarana:   '*',
    applicableVara:     ['Wednesday','Thursday'],
    applicablePaksha:   '*',
    priority: 15,
    conditions: [],
    exceptions: [],
    recommendation: 'Suitable',
    supportingFactors: [
      { en: 'Mercury (intellect) and Jupiter (wisdom) weekdays are ideal for all educational pursuits', kn: 'ಬುಧ ಮತ್ತು ಗುರು ವಾರ ಶಿಕ್ಷಣಕ್ಕೆ ಶ್ರೇಷ್ಠ' },
    ],
    conflictingFactors: [],
    reason: {
      en: 'Wednesday (Mercury) and Thursday (Jupiter) are the dual pillars of educational auspiciousness in classical Jyotisha. Mercury governs Budhi (intellect), language, writing, mathematics, and all forms of worldly learning. Jupiter governs Jnana (wisdom), philosophy, spiritual knowledge, and the sacred guru-shishya transmission. Together, they cover all dimensions of education from practical skills to transcendent wisdom.',
      kn: 'ಬುಧ (ಬುದ್ಧಿ/ವಿದ್ಯಾ) ಮತ್ತು ಗುರು (ಜ್ಞಾನ/ಶಾಸ್ತ್ರ) ವಾರ ಎಲ್ಲ ಶಿಕ್ಷಣ ಕ್ರಿಯೆಗಳಿಗೆ ಉತ್ತಮ.',
    },
    confidence: 'high',
    scripturalRefs: [
      { source: 'MuhurtaChintamani', chapter: 'Chapter 3 — Vidyarambha', summary: 'Identifies Wednesday (Mercury) and Thursday (Jupiter) as the dual auspicious weekdays for all educational activities, covering both intellectual development and spiritual wisdom.', language: 'en' },
    ],
    langSupport: ['en', 'kn'],
    regionalOverrides: [],
    status: 'active',
    createdAt: NOW,
    updatedAt: NOW,
    approvedBy: 'VedRith Classical Review',
  },
]

/**
 * Get all active rules for a specific category.
 * Returns rules sorted by priority (ascending — lower number = higher priority).
 */
export function getRulesForCategory(category: string): VedicRule[] {
  return ACTIVITY_RULES
    .filter(r => r.category === category && r.status === 'active')
    .sort((a, b) => a.priority - b.priority)
}

/** Total count of rules in the database */
export const RULE_COUNT = ACTIVITY_RULES.length
