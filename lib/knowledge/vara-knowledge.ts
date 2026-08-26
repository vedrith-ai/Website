// ─────────────────────────────────────────────────────────────────────────────
// VedRith Knowledge Base — Vara (Weekday)  [V1.1 — New]
//
// Seven Vara entries with classical metadata.
//
// Source: Muhurta Chintamani (Rama Dayalu), Dharma Sindhu (Kashinath Upadhyaya),
// Brihat Samhita (Varahamihira XCVIII), Jyotisha Ratnakara.
// Cross-referenced with Kannada Panchanga (Parabhava Samvatsara 2026-27).
// ─────────────────────────────────────────────────────────────────────────────

export interface VaraKnowledge {
  key:         string   // English name
  nameEn:      string
  nameKn:      string
  meaning:     string
  planet:      string   // Ruling planet
  deity:       string   // Primary deity
  colour:      string
  metal:       string
  gem:         string
  description: string
  suitableActivities: string[]
  avoidActivities:    string[]
  spiritualSignificance: string
  mantra:      string
  fastingInfo: string
}

export const VARA_KNOWLEDGE: Record<string, VaraKnowledge> = {

  Sunday: {
    key: 'Sunday', nameEn: 'Sunday', nameKn: 'ಭಾನುವಾರ',
    meaning: 'Day of Bhanu (the Sun) — Ravi-vara in Sanskrit. The first and supreme day of the week, ruled by Surya.',
    planet: 'Sun (Surya)',
    deity: 'Surya (the Sun god) / Vishnu (as Aditya)',
    colour: 'Red / Saffron',
    metal: 'Gold',
    gem: 'Ruby (Manikya)',
    description: 'Sunday is ruled by the Sun (Surya) and carries solar energy — authority, vitality, confidence, and government. It is the day of kings, leaders, and those in positions of power. Sunday is auspicious for activities requiring the Sun\'s blessing: medical treatments, royal interactions, and Surya puja.',
    suitableActivities: [
      'Surya puja and solar worship — especially at sunrise',
      'Medical treatments and beginning health-related therapies',
      'Government and authority-related work',
      'Leadership activities and taking up positions of command',
      'Gold purchases and transactions',
      'Agricultural and outdoor work harnessing solar energy',
    ],
    avoidActivities: [
      'Travel on Sunday for some purposes (Dishashool consideration — south direction unfavourable)',
      'Starting activities that thrive in the dark or require secrecy',
    ],
    spiritualSignificance: 'Sunday (Aditya-vara) is the day when Surya\'s consciousness is most accessible. The Sun represents the Atman (the eternal self) in Vedic thought — self-luminous, unchanging, the source of all life and light. Performing Surya Namaskar, offering arghya (water oblation) at sunrise, and reciting the Aditya Hridayam on Sunday brings solar vitality and clears obstacles placed by the Sun (Rahu/Ketu effects).',
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (Om Hram Hrim Hraum Sah Suryaya Namah) — The bija mantra of Surya for Sundays.',
    fastingInfo: 'Ravi-vrat (Sunday fast): observed by Surya devotees from sunrise to sunset, eating only a single vegetarian meal (before sunset). Devotees wear red, offer red flowers, and perform Surya puja. Particularly observed on Sundays coinciding with Saptami tithi (Ravi Saptami).',
  },

  Monday: {
    key: 'Monday', nameEn: 'Monday', nameKn: 'ಸೋಮವಾರ',
    meaning: 'Day of Soma (the Moon) — Soma-vara in Sanskrit. The day of lunar energy, emotion, and Shiva worship.',
    planet: 'Moon (Chandra / Soma)',
    deity: 'Shiva (who wears the Moon on his forehead) / Chandra',
    colour: 'White / Silver',
    metal: 'Silver',
    gem: 'Pearl (Moti)',
    description: 'Monday is ruled by the Moon and associated with Shiva who wears the crescent Moon (Somashekhara). It is the most important day for Shiva worship, water-related activities, and matters of the mind, emotions, and intuition. Mondays are particularly auspicious for fasting dedicated to Shiva.',
    suitableActivities: [
      'Shiva puja and abhishekam — especially potent on Monday',
      'Activities related to water, oceans, and sacred rivers',
      'Medical treatments for mental health and emotional wellbeing',
      'Agriculture and irrigation-related work',
      'Beginning devotional practices and spiritual journeys',
      'Marriage-related activities in some traditions',
    ],
    avoidActivities: [
      'Activities requiring sharp focus without emotional sensitivity',
      'Harsh physical labour inconsistent with the Moon\'s gentle nature',
    ],
    spiritualSignificance: 'Monday (Soma-vara) honours the Moon as the mind of the cosmos. Just as the Moon reflects the Sun\'s light, the mind reflects cosmic consciousness — neither creating light nor darkness but faithfully showing what exists. Shiva wears the Moon to show that even the wildly fluctuating mind can be integrated and held in awareness. Monday\'s fasting and Shiva puja are said to grant emotional stability, purify the mind, and attract a worthy spouse.',
    mantra: 'ॐ नमः शिवाय (Om Namah Shivaya) — The Panchakshara, the quintessential mantra for Monday Shiva worship. Also: ॐ सों सोमाय नमः (Om Som Somaya Namah) for lunar energy.',
    fastingInfo: 'Soma-vrat (Monday fast): one of the most widely observed weekly fasts across India. Devotees fast from sunrise to sunset, breaking the fast with sattvic food in the evening after Shiva puja. Solah Somvar Vrat (16 consecutive Monday fasts) is especially popular for marriage and relationship blessings. Shravan Somvar (Mondays in the month of Shravana) are considered extraordinarily powerful.',
  },

  Tuesday: {
    key: 'Tuesday', nameEn: 'Tuesday', nameKn: 'ಮಂಗಳವಾರ',
    meaning: 'Day of Mangala (Mars) — Mangala-vara in Sanskrit. The day of courage, power, Hanuman, and dynamic action.',
    planet: 'Mars (Mangala / Kuja)',
    deity: 'Hanuman / Kartikeya / Bhumi Devi (Earth goddess)',
    colour: 'Red / Coral',
    metal: 'Copper',
    gem: 'Red Coral (Moonga)',
    description: 'Tuesday is ruled by Mars (Mangala — the auspicious) and is associated with courage, strength, protection from enemies, and dynamic action. Hanuman puja is most powerful on Tuesday (and Saturday). It is auspicious for all activities requiring strength, protection, and masculine vitality.',
    suitableActivities: [
      'Hanuman puja — supremely potent on Tuesday',
      'Activities requiring courage, strength, and protection',
      'Starting physical training, martial arts, or exercise regimens',
      'Administrative and executive decisions',
      'Activities related to land, property, and construction',
      'Kartikeya / Subramanya worship',
    ],
    avoidActivities: [
      'Marriage ceremonies in most traditions (Mars increases conflict energy)',
      'Purchase of vehicles (some traditions)',
      'Important financial agreements',
    ],
    spiritualSignificance: 'Tuesday (Mangala-vara) carries the energy of Bhoomi (the Earth) — Mangala is the son of Earth (Bhumiputra). The warrior energy of Mars, when properly channelled through Hanuman worship, becomes the energy of selfless divine service. Hanuman — the quintessential devotee — transforms raw Mars energy into supreme strength dedicated entirely to Rama (the Atman). Tuesday fasting and Hanuman puja are said to dissolve Mangal dosha (Mars affliction) in the birth chart.',
    mantra: 'ॐ हनुमते नमः (Om Hanumate Namah) — The Hanuman mantra for Tuesdays. Also: ॐ अं अंगारकाय नमः (Om Am Angarakaya Namah) — the Mars bija mantra.',
    fastingInfo: 'Mangala-vrat (Tuesday fast): observed for Hanuman or Mars propitiation. Devotees wear red, eat red-coloured foods only (or fast), and visit Hanuman temples. The fast is broken at sunset with one meal. Hanuman Chalisa recitation on Tuesdays is particularly recommended. 21 consecutive Tuesdays of fasting is a powerful vrat.',
  },

  Wednesday: {
    key: 'Wednesday', nameEn: 'Wednesday', nameKn: 'ಬುಧವಾರ',
    meaning: 'Day of Budha (Mercury) — Budha-vara in Sanskrit. The day of intelligence, communication, trade, and learning.',
    planet: 'Mercury (Budha)',
    deity: 'Vishnu (as the preserver of knowledge) / Budha (the planet)',
    colour: 'Green',
    metal: 'Bronze / Brass',
    gem: 'Emerald (Panna)',
    description: 'Wednesday is ruled by Mercury (Budha) and is associated with intelligence, communication, trade, commerce, writing, and all forms of learning. It is a broadly auspicious day for intellectual work, signing agreements, and education.',
    suitableActivities: [
      'Beginning education, study, and courses of learning',
      'Writing, publishing, and communication-related activities',
      'Trade, commerce, and business negotiations',
      'Signing contracts and agreements (Mercury rules contracts)',
      'Technology-related activities',
      'Visiting doctors and beginning treatments',
    ],
    avoidActivities: [
      'No strong traditional prohibitions on Wednesday',
      'Activities requiring purely emotional, non-rational engagement',
    ],
    spiritualSignificance: 'Wednesday (Budha-vara) carries the energy of Budha — the prince of the planets, son of the Moon and Tara. Mercury governs Budhi (intellect), vyapara (trade), and vakya (speech). In spiritual terms, Mercury represents the discriminating intelligence (Viveka) that distinguishes the real from the unreal. Vishnu is worshipped on Wednesday because his all-pervading knowledge and cosmic intelligence resonate with Mercury\'s qualities.',
    mantra: 'ॐ बुं बुधाय नमः (Om Bum Budhaya Namah) — The Mercury bija mantra for Wednesday worship. For Vishnu: ॐ नमो भगवते वासुदेवाय (Om Namo Bhagavate Vasudevaya).',
    fastingInfo: 'Budha-vrat (Wednesday fast): less commonly observed than other vara fasts. Those seeking Mercury\'s blessings — for education, commerce, and speech — may fast on Wednesdays. Green foods (moong dal, green leafy vegetables) are offered to Budha. Fast broken at sunset.',
  },

  Thursday: {
    key: 'Thursday', nameEn: 'Thursday', nameKn: 'ಗುರುವಾರ',
    meaning: 'Day of Guru (Jupiter) — Guru-vara in Sanskrit. The most auspicious weekday, day of the divine teacher.',
    planet: 'Jupiter (Guru / Brihaspati)',
    deity: 'Vishnu (Govinda) / Brihaspati (the Deva-Guru)',
    colour: 'Yellow / Gold',
    metal: 'Gold',
    gem: 'Yellow Sapphire (Pushparaag)',
    description: 'Thursday is ruled by Jupiter (Guru) and is universally regarded as the most auspicious day of the week. Associated with dharma, wisdom, spirituality, and the guru-shishya (teacher-student) relationship. Guru Puja on Thursday brings blessings of wisdom, prosperity, and spiritual growth.',
    suitableActivities: [
      'All major auspicious beginnings — Thursday is broadly the best weekday',
      'Guru Puja and worship of one\'s spiritual teacher',
      'Initiations and spiritual commencements (taking mantra, diksha)',
      'Educational beginnings — starting school, college, studies',
      'Charitable giving and philanthropy',
      'Visiting elders, teachers, and seeking their blessings',
      'Yellow items and gold purchases',
    ],
    avoidActivities: [
      'Washing or cutting hair (traditional prohibition in some regions)',
      'Shaving on Thursday (traditional)',
    ],
    spiritualSignificance: 'Thursday (Guru-vara) is the day of Brihaspati — the divine Guru of the gods. Guru represents the principle of expansion, wisdom, and the divine grace that leads the soul from ignorance to knowledge. Vishnu worship on Thursday (Satyanarayan Puja, Vishnu Sahasranama) is said to grant moksha-liberation blessings. The guru-tattva is at its most accessible on Thursday — making it ideal for connecting with one\'s teacher, lineage, and the accumulated wisdom of tradition.',
    mantra: 'ॐ गुं गुरवे नमः (Om Gum Gurave Namah) — The Jupiter/Guru bija mantra for Thursday. For Vishnu: ॐ नमो नारायणाय (Om Namo Narayanaya).',
    fastingInfo: 'Guru-vrat (Thursday fast): widely observed for Jupiter\'s blessings. Devotees wear yellow, eat yellow foods (yellow dal, banana, turmeric rice), offer yellow flowers to Vishnu/Guru, and recite Vishnu Sahasranama. The fast is broken by eating yellow-coloured food. 16 consecutive Thursday fasts (Solah Guruvar Vrat) is powerful for wisdom, marriage, and children.',
  },

  Friday: {
    key: 'Friday', nameEn: 'Friday', nameKn: 'ಶುಕ್ರವಾರ',
    meaning: 'Day of Shukra (Venus) — Shukra-vara in Sanskrit. The day of Lakshmi, beauty, love, and material abundance.',
    planet: 'Venus (Shukra)',
    deity: 'Lakshmi / Devi Parvati / Shukracharya (Guru of the Asuras)',
    colour: 'White / Light pink',
    metal: 'Silver',
    gem: 'Diamond (Heera)',
    description: 'Friday is ruled by Venus (Shukra) and is the day of Lakshmi — beauty, pleasure, arts, marriage, and material abundance. It is auspicious for all creative activities, relationship-related matters, and Devi worship. Santoshi Ma\'s vrat is observed on Fridays.',
    suitableActivities: [
      'Lakshmi puja and Devi worship — especially potent on Friday',
      'Marriage-related activities and relationship ceremonies',
      'Purchase of jewellery, silver, and beautiful objects',
      'Creative and artistic activities',
      'Business related to beauty, fashion, and arts',
      'Charitable giving to women',
    ],
    avoidActivities: [
      'Activities requiring extreme austerity or harsh discipline',
      'Cutting of trees or plants (Venus rules plant life)',
    ],
    spiritualSignificance: 'Friday (Shukra-vara) carries the energy of Shukra — the bright planet of Venus, named for Shukracharya the guru of the Asuras. Paradoxically, it is associated with Lakshmi and the divine feminine. Shukra in Vedic thought represents the creative principle (Shristi-shakti) — the generative, pleasurable energy that sustains life\'s continuation. Lakshmi worship on Fridays and the recitation of Shri Sukta invites abundance into all domains of life.',
    mantra: 'ॐ शुं शुक्राय नमः (Om Shum Shukraya Namah) — The Venus bija mantra for Friday. For Lakshmi: ॐ श्रीं महालक्ष्म्यै नमः (Om Shrim Mahalakshmyai Namah).',
    fastingInfo: 'Shukra-vrat (Friday fast): observed for Venus / Lakshmi blessings. Devotees wear white, eat white foods (white rice, milk, coconut), and offer white flowers to Lakshmi. Santoshi Ma vrat: observed on Fridays, devotees fast and offer jaggery and chickpeas, avoid sour foods on that day. 16 consecutive Friday fasts are powerful for Lakshmi\'s abundance.',
  },

  Saturday: {
    key: 'Saturday', nameEn: 'Saturday', nameKn: 'ಶನಿವಾರ',
    meaning: 'Day of Shani (Saturn) — Shani-vara in Sanskrit. The day of karma, justice, perseverance, and Hanuman\'s grace.',
    planet: 'Saturn (Shani)',
    deity: 'Shani (Saturn deity) / Hanuman / Bhairava (fierce Shiva)',
    colour: 'Black / Dark blue',
    metal: 'Iron / Steel',
    gem: 'Blue Sapphire (Neelam)',
    description: 'Saturday is ruled by Saturn (Shani) — the great karmic equaliser. It is simultaneously feared and revered. Shani represents discipline, justice, hard work, and the consequences of past actions. Proper propitiation of Shani on Saturday through service, oil donations, and Hanuman worship is considered essential for overcoming Sade Sati and other Saturn challenges.',
    suitableActivities: [
      'Shani puja and Saturn propitiation',
      'Hanuman puja — Hanuman protects from Shani\'s negative effects',
      'Service activities — feeding the poor, helping workers and labourers',
      'Oil-related activities (sesame oil donation is traditional Shani offering)',
      'Spiritual practices requiring discipline and long-term commitment',
      'Activities related to iron, steel, and machinery',
    ],
    avoidActivities: [
      'Major new ventures (Saturn energy can delay starts)',
      'Hair cutting on Saturday in some traditions',
      'Purchasing oil or black items in some regional traditions',
    ],
    spiritualSignificance: 'Saturday (Shani-vara) is the day when Saturn\'s consciousness teaches the deepest lessons of life. Shani is the son of Surya (Sun) — representing the shadow truth that must be faced when the light of consciousness turns inward. Saturn governs time, limitation, karma, and the inevitable consequences of actions across lifetimes. Shani-dev, though feared, is ultimately the most honest and just of all planetary deities — a strict guru who rewards perseverance and punishes shortcuts. Hanuman, through his selfless devotion, transcends even Saturn\'s power.',
    mantra: 'ॐ शं शनैश्चराय नमः (Om Sham Shanaischaraya Namah) — The Saturn bija mantra for Saturday. Also: ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः — the more extended Shani mantra. For Hanuman protection: ॐ हनुमते नमः (Om Hanumate Namah).',
    fastingInfo: 'Shani-vrat (Saturday fast): observed for Saturn propitiation and relief from Sade Sati / Saturn challenges. Devotees wear black or dark blue, fast from sunrise to sunset, offer sesame (til) and mustard oil to Shani idol, feed black sesame laddoos to crows and ants, and donate to workers and servants. Visiting Shani temples and performing pradakshina (circumambulation) 7 times is traditional.',
  },
}

/**
 * Lookup Vara knowledge by English weekday name.
 */
export function getVaraKnowledge(key: string): VaraKnowledge | null {
  return VARA_KNOWLEDGE[key] ?? null
}

/** Map from JS Date.getDay() (0=Sun) to Vara knowledge key */
export const WEEKDAY_INDEX_TO_VARA: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
}
