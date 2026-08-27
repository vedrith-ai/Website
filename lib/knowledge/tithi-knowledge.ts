// ─────────────────────────────────────────────────────────────────────────────
// VedRith Knowledge Base — Tithi  [V1.1 — Extended]
//
// 16 unique Tithi entries (30-tithi month reduces to 16 unique names:
// Pratipada–Chaturdashi shared by both Pakshas, Purnima for Shukla 15th,
// Amavasya for Krishna 15th).
//
// V1.1 additions: spiritualSignificance, mantra, fastingInfo, remedy
//
// Source: Dharma Sindhu (Kashinath Upadhyaya), Muhurta Chintamani (Rama Dayalu),
// Brihat Samhita (Varahamihira), Skanda Purana Muhurta Kanda.
// No AI generation. All content hand-authored from classical references.
// ─────────────────────────────────────────────────────────────────────────────

export interface TithiKnowledge {
  key:         string
  nameEn:      string
  nameKn:      string
  meaning:     string
  description: string
  deity:       string
  symbol:      string
  suitableActivities:  string[]
  avoidActivities:     string[]
  /** Spiritual significance and deeper teaching of this tithi */
  spiritualSignificance: string
  /** Traditional mantra or prayer associated with this tithi */
  mantra:      string
  /** Fasting observance (if any) associated with this tithi */
  fastingInfo: string
  /** Traditional remedy or observance to mitigate difficult aspects */
  remedy:      string
}

export const TITHI_KNOWLEDGE: Record<string, TithiKnowledge> = {

  Pratipada: {
    key: 'Pratipada', nameEn: 'Pratipada', nameKn: 'ಪಾಡ್ಯ',
    meaning: 'The first lunar day — the moment of new beginnings as the Moon starts a fresh phase, either waxing or waning.',
    description: 'Pratipada marks the start of a new fortnight (Paksha). It is associated with fresh starts, the planting of intentions, and the early stages of any undertaking. Its energy is considered tender and formative, requiring care rather than force.',
    deity: 'Agni (Fire deity)',
    symbol: 'A single rising flame',
    suitableActivities: [
      'Starting new ventures or projects with considered intent',
      'Beginning a course of study or new skill',
      'Sowing seeds / agricultural beginnings',
      'Worship of Agni and Brahma for clarity of purpose',
      'Performing first entry (Griha Pravesha) rites',
    ],
    avoidActivities: [
      'Signing major long-term contracts without further consideration',
      'Travel in inauspicious directions (Dishashool considerations apply)',
      'Aggressive or confrontational actions',
    ],
    spiritualSignificance: 'Pratipada is the seed of the lunar fortnight. Every cycle of manifestation begins here. Spiritually, it teaches that every new beginning carries the entire potential of what is to come — just as the seed contains the tree. On Shukla Pratipada, the moon is a thin crescent aligned with the sun, representing the union of solar consciousness and lunar reflection at the threshold of creation.',
    mantra: 'ॐ अग्नये नमः (Om Agnaye Namah) — Salutation to Agni, the purifier and initiator of new cycles.',
    fastingInfo: 'No widespread fasting on Pratipada in most traditions. On the first day of Chaitra Shukla Paksha (Ugadi / Gudi Padwa), it is the New Year and celebrated with prayers, not fasting.',
    remedy: 'Light a ghee lamp at sunrise and offer red flowers to Agni. Recite the Gayatri Mantra 108 times to establish clarity of purpose for the new cycle.',
  },

  Dvitiya: {
    key: 'Dvitiya', nameEn: 'Dvitiya', nameKn: 'ಬಿದಿಗೆ',
    meaning: 'The second lunar day — a day of stability following the initial momentum of Pratipada.',
    description: 'Dvitiya is considered a generally favourable tithi, associated with duality, partnership, and the interplay of complementary energies. It supports activities requiring cooperation and balance between two parties or forces.',
    deity: 'Brahma (the creator)',
    symbol: 'Two joined hands / the number 2',
    suitableActivities: [
      'Partnership agreements and joint ventures',
      'Marriage-related discussions and ceremonies',
      'Purchase of vehicles or property',
      'Starting educational pursuits',
      'Initiating diplomatic negotiations',
    ],
    avoidActivities: [
      'Solo high-risk ventures demanding complete independence',
      'Activities requiring isolation or long solitude',
    ],
    spiritualSignificance: 'Dvitiya embodies the principle of dvandva — sacred duality. The universe operates through pairs: light and dark, Shiva and Shakti, breath in and breath out. This tithi invites awareness of relationship as the foundation of creation. Brahma himself represents the duality of creator and creation, the dreamer and the dream.',
    mantra: 'ॐ ब्रह्मणे नमः (Om Brahmanye Namah) — Salutation to Brahma, the weaver of paired realities.',
    fastingInfo: 'Some traditions observe fasting on Bhadrapada Shukla Dvitiya for the Varaha Dvitiya observance, honouring the Varaha (boar) avatar of Vishnu.',
    remedy: 'Offer white flowers and rice to Brahma. Meditate on the quality of harmonious relationship in one\'s life and resolve any outstanding disagreements with honesty.',
  },

  Tritiya: {
    key: 'Tritiya', nameEn: 'Tritiya', nameKn: 'ತದಿಗೆ',
    meaning: 'The third lunar day — associated with valour, courage, and creative energy surging forward.',
    description: 'Tritiya is ruled by Vishnu in his protective aspect and Gauri in her nurturing form. It is considered auspicious for endeavours requiring courage and assertiveness. Akshaya Tritiya (Vaishakha Shukla Tritiya) is the most auspicious singular day in the entire Hindu calendar.',
    deity: 'Gauri / Vishnu (protective aspect)',
    symbol: 'A drawn bow / the number three representing past, present, future',
    suitableActivities: [
      'Starting business ventures — especially on Akshaya Tritiya',
      'Purchasing gold, silver, or valuable assets',
      'Acts of charity and philanthropic donation',
      'Beginning martial or competitive training',
      'Marriages (especially Akshaya Tritiya)',
    ],
    avoidActivities: [
      'Excessive risk-taking without sound preparation',
      'Confrontations likely to escalate without resolution',
    ],
    spiritualSignificance: 'Tritiya carries the energy of Vishnu\'s preservation — the force that sustains the middle path between creation and dissolution. Akshaya Tritiya is spiritually significant because Akshaya means "that which never diminishes" — whatever virtuous action, charity, or spiritual practice is performed on this day is said to bear undying fruit. The three of Tritiya represents the triad of dharma, artha, and kama in balance.',
    mantra: 'ॐ गौर्यै नमः (Om Gauryai Namah) — Salutation to Gauri, embodiment of auspiciousness and abundance.',
    fastingInfo: 'Akshaya Tritiya (Vaishakha Shukla Tritiya) is widely observed with Satyanarayan Puja rather than strict fasting. Some devotees fast and donate rice, sesame, and gold to Brahmins.',
    remedy: 'Offer yellow flowers and turmeric to Vishnu. Perform a small act of charity — feeding others or donating to the needy — to activate the Akshaya (inexhaustible) quality of this tithi.',
  },

  Chaturthi: {
    key: 'Chaturthi', nameEn: 'Chaturthi', nameKn: 'ಚೌತಿ',
    meaning: 'The fourth lunar day — dedicated to Lord Ganesha, the remover of obstacles.',
    description: 'Chaturthi is a Rikta (empty/deficient) tithi, generally considered challenging for new beginnings. However, it is highly auspicious for Ganesha worship. Sankashti Chaturthi (Krishna Paksha) and Vinayaka Chaturthi (Shukla Paksha) are monthly fasting observances beloved by millions.',
    deity: 'Ganesha (Vighnaharta — remover of obstacles)',
    symbol: 'Elephant\'s trunk / modaka (sweet dumpling)',
    suitableActivities: [
      'Worship of Ganesha for obstacle removal',
      'Fasting for Sankashti or Vinayaka Chaturthi',
      'Resolving disputes through mediation and patience',
      'Ganesh Chaturthi festival celebrations',
    ],
    avoidActivities: [
      'Starting major new ventures (Rikta tithi — energy is withheld)',
      'Travel for important purposes without prior Ganesha worship',
      'Marriage ceremonies in most traditions',
      'Viewing the moon on Bhadrapada Shukla Chaturthi (Ganesh Chaturthi night)',
    ],
    spiritualSignificance: 'Ganesha holds the number four in his cosmic role: he presides over the four directions, the four aims of life (Purusharthas), and the four stages of sound (Para, Pashyanti, Madhyama, Vaikhari). The "obstacle" quality of Chaturthi is purposeful — Ganesha teaches that true progress requires clearing what is unnecessary before new growth begins.',
    mantra: 'ॐ गणेशाय नमः (Om Ganeshaya Namah) — Salutation to Ganesha, the remover of obstacles and lord of beginnings.',
    fastingInfo: 'On Sankashti Chaturthi (Krishna Paksha Chaturthi), devotees fast the entire day and break the fast after sighting the moon at night. On Vinayaka Chaturthi (Shukla Paksha Chaturthi) of Bhadrapada masa, a 10-day festival commences with elaborate rituals.',
    remedy: 'Offer 21 modakas (sweet dumplings), durva grass, and red hibiscus to Ganesha. Recite the Ganesha Ashtakam or Atharvashirsha. Fast from sunrise to moonrise on Chaturthi for Sankashti.',
  },

  Panchami: {
    key: 'Panchami', nameEn: 'Panchami', nameKn: 'ಪಂಚಮಿ',
    meaning: 'The fifth lunar day — associated with the five elements, Nagas (serpent deities), and Saraswati.',
    description: 'Panchami is considered auspicious in most traditions, particularly for learning, creative arts, and Naga worship. Vasanta Panchami (Magha Shukla Panchami) celebrates the goddess Saraswati — the bestower of wisdom, music, and learning.',
    deity: 'Nagas / Saraswati / Subramanya (Karthikeya)',
    symbol: 'A coiled serpent / a veena / the lotus',
    suitableActivities: [
      'Beginning education and learning — especially on Vasanta Panchami',
      'Starting musical or artistic training',
      'Naga Panchami worship (Shravana Shukla Panchami)',
      'Initiating Ayurvedic treatments or herbal therapies',
      'Agriculture and planting of trees',
    ],
    avoidActivities: [
      'Digging earth or construction work on Naga Panchami',
      'Killing or harming snakes at any time',
    ],
    spiritualSignificance: 'The number five (pancha) is cosmically significant: five elements (earth, water, fire, air, space), five senses, five vital breaths (pranas), five sheaths of the self (koshas). Panchami invites awareness of the pentagonal structure of existence. Nagas represent the kundalini energy coiled at the base of the spine — worshipped on Naga Panchami to receive their protective blessings and prevent serpentine harm.',
    mantra: 'ॐ नमः शिवाय (Om Namah Shivaya) — The five-syllable Panchakshara Mantra of Shiva, honoring the five elements. For Saraswati: ॐ सरस्वत्यै नमः (Om Saraswatyai Namah).',
    fastingInfo: 'Vasanta Panchami (Magha Shukla Panchami): devotees fast or eat only once and spend the day in worship of Saraswati. Naga Panchami (Shravana Shukla Panchami): fasting observed, especially by women, who worship serpent deities for family protection.',
    remedy: 'Offer milk and turmeric paste to a serpent idol or image on Naga Panchami. Light a lamp near an anthill. Recite the Naga Gayatri: ॐ नवकुलाय विद्महे विषदन्ताय धीमहि तन्नो सर्पः प्रचोदयात्।',
  },

  Shashthi: {
    key: 'Shashthi', nameEn: 'Shashthi', nameKn: 'ಷಷ್ಠಿ',
    meaning: 'The sixth lunar day — associated with Kartikeya (Subramanya / Skanda) and the divine mother Shashthi Devi, protector of children.',
    description: 'Shashthi is generally a mixed tithi — auspicious for worship of Kartikeya, Skanda, and Devi Shashthi (who protects newborns and children), but requiring care for certain activities. Skanda Shashthi (Kartika Shukla Shashthi) is a major festival of 6 days.',
    deity: 'Kartikeya / Skanda / Shashthi Devi',
    symbol: 'The peacock (Kartikeya\'s vehicle) / a vel (spear)',
    suitableActivities: [
      'Worship of Kartikeya and Subramanya',
      'Prayers for health, protection, and victory over enemies',
      'Naming ceremonies for infants (Shashthi is the 6th day post-birth for the Shashthi ceremony)',
      'Kumara Sashti observances',
    ],
    avoidActivities: [
      'Starting major ventures requiring sustained energy (Mixed tithi)',
      'Frivolous activities without focus — Kartikeya demands disciplined purpose',
    ],
    spiritualSignificance: 'Six is the number of Ajna (the third eye chakra) and the six-pointed star of perfectly balanced elements. Kartikeya, born of Shiva\'s third eye, embodies pure consciousness manifested as cosmic warrior energy. Shashthi Devi represents the sixth divine manifestation of Shakti who governs the sixth day of a child\'s life — a liminal period where the soul is still adjusting to embodiment.',
    mantra: 'ॐ षण्मुखाय नमः (Om Shanmukhaya Namah) — Salutation to Kartikeya, the six-faced lord. Also: ॐ स्कन्दाय नमः (Om Skandaya Namah).',
    fastingInfo: 'Skanda Shashthi fasting observed across Tamil Nadu, Karnataka, and Andhra Pradesh for six days in Kartika masa. Devotees fast and pray at Murugan (Kartikeya) temples, culminating in Soora Samharam — the symbolic slaying of the demon Soorapadman.',
    remedy: 'Offer vel (a small spear symbol), peacock feathers, and red flowers to Kartikeya. Recite the Kandhar Sashti Kavacham for protection. For children\'s health, perform the Shashthi Puja with 6 types of fruit.',
  },

  Saptami: {
    key: 'Saptami', nameEn: 'Saptami', nameKn: 'ಸಪ್ತಮಿ',
    meaning: 'The seventh lunar day — associated with Surya (the Sun), considered highly auspicious for solar worship and health.',
    description: 'Saptami is one of the most consistently auspicious tithis, ruled by the Sun. It is associated with the seven planets, seven colours of light, and seven svaras (musical notes) — numbers that represent cosmic completeness. Ratha Saptami (Magha Shukla Saptami) is the annual solar birthday celebration.',
    deity: 'Surya (the Sun god)',
    symbol: 'A golden chariot / the solar disc',
    suitableActivities: [
      'Beginning important ventures — Saptami is broadly auspicious',
      'Worship of Surya (especially at sunrise on Saptami)',
      'Medical treatments — Saptami is traditionally considered auspicious for beginning therapies',
      'Agriculture and outdoor work under the sun',
      'Ratha Saptami solar festival',
    ],
    avoidActivities: [
      'Night activities preferring darkness — daytime is empowered',
      'Excessive expenditure without purpose',
    ],
    spiritualSignificance: 'Seven is the number of completeness across traditions: seven planets, seven notes, seven chakras, seven seas, seven rishis. Surya on Saptami represents life-giving light that illuminates all seven dimensions of existence simultaneously. The solar energy of this tithi is excellent for health, vitality, and clarity of mind. Ratha Saptami marks Surya turning his chariot northward (Uttarayana direction) — the sun at its most life-giving.',
    mantra: 'ॐ सूर्याय नमः (Om Suryaya Namah) — Salutation to the Sun. The Aditya Hridayam is traditionally recited on Saptami for health and vitality.',
    fastingInfo: 'Ratha Saptami (Magha Shukla Saptami): fasting from sunrise, bathing with arka leaves (Calotropis) placed on head and shoulders, offering arghya to Surya at sunrise. The fast is broken after Surya Puja.',
    remedy: 'At sunrise, offer water (arghya) to Surya through cupped hands, allowing sunlight to filter through the water stream. Recite the Surya Namaskar mantra and perform 12 rounds of Surya Namaskar yoga postures. Red or orange flowers are offered.',
  },

  Ashtami: {
    key: 'Ashtami', nameEn: 'Ashtami', nameKn: 'ಅಷ್ಟಮಿ',
    meaning: 'The eighth lunar day — sacred to Durga, Shiva, and Krishna (who was born on Krishna Paksha Ashtami).',
    description: 'Ashtami is a tithi of power and intensity. It carries Ugra (fierce) energy and is generally considered challenging for most auspicious activities, but supremely auspicious for worship of Durga (on the 8th of Navratri) and the birthday of Krishna (Janmashtami — Bhadrapada Krishna Ashtami).',
    deity: 'Durga / Krishna / Shiva',
    symbol: 'A fierce flame / a lotus in a hand / the eight-petalled mandala',
    suitableActivities: [
      'Worship of Durga, Kali, or Bhavani during Navratri Ashtami',
      'Janmashtami — Krishna birthday observance and devotion',
      'Intense tapas (austerities) and spiritual practices',
      'Performing Homa (fire sacrifice) for protection',
    ],
    avoidActivities: [
      'Marriage ceremonies in most traditions',
      'Starting major new ventures or journeys',
      'Construction or land transactions',
    ],
    spiritualSignificance: 'Eight represents the eight directions of space (ashta-disha), the eight Vasus (celestial deities), and the eight forms of Lakshmi (Ashta Lakshmi). Krishna was born at midnight on Ashtami to dissolve the ego\'s rigid structures — the eight directions of the finite self. Durga on Ashtami (Maha Ashtami) receives the fiercest worship, for she represents the divine power that must be this fierce to vanquish adharma.',
    mantra: 'ॐ दुर्गायै नमः (Om Durgayai Namah) — Salutation to Durga. For Janmashtami: ॐ क्लीं कृष्णाय गोविन्दाय गोपीजन-वल्लभाय स्वाहा।',
    fastingInfo: 'Janmashtami: complete fast until midnight when Krishna\'s birth is celebrated. Navratri Ashtami (Maha Ashtami): strict fasting, Kanya Puja (worship of nine young girls as Devi), and Homa. Masika Ashtami: monthly fasting observed by Durga devotees.',
    remedy: 'Offer blue or dark purple lotuses to Durga. Perform Durga Ashtami Puja with 8 offerings (shodashopachara). If facing intense difficulty, recite the Durga Saptashati (700 verses) on this tithi for powerful protection.',
  },

  Navami: {
    key: 'Navami', nameEn: 'Navami', nameKn: 'ನವಮಿ',
    meaning: 'The ninth lunar day — sacred to Devi (nine forms of Shakti), Rama, and associated with the nine planets.',
    description: 'Navami is generally considered an auspicious tithi, particularly for Devi worship during Navratri and the birthday of Rama (Chaitra Shukla Navami — Rama Navami). The nine forms of Devi (Navadurga) each receive special worship across the nine nights of Navratri.',
    deity: 'Navadurga / Rama / Durga',
    symbol: 'The navaratna (nine gems) / a bow and arrow',
    suitableActivities: [
      'Navratri Navami — worship of Siddhidatri (the ninth Durga)',
      'Rama Navami (Chaitra Shukla Navami) — Rama birthday puja',
      'Havan and fire ceremonies',
      'Beginning journeys with Devi\'s protection',
      'Kanya Puja and Haldi-Kumkuma for women',
    ],
    avoidActivities: [
      'Major financial decisions without proper consideration',
      'Starting agricultural work in some regional traditions',
    ],
    spiritualSignificance: 'Nine is the number of completion within the cycle of 1-9 — after nine, numbers begin again. The nine Navadurga represent the nine stages of the soul\'s purification through the feminine divine. Rama was born on Navami, symbolising the emergence of dharmic order (Maryada Purushottama) from the primordial ten (Dasaratha\'s kingdom) back into the nine-fold creation. The nine planets (Navagraha) bless seekers on this tithi.',
    mantra: 'ॐ दुं दुर्गायै नमः (Om Dum Durgayai Namah) — Beeja mantra of Durga, activating all nine Shakti forms. For Rama: ॐ श्री रामाय नमः (Om Shri Ramaya Namah).',
    fastingInfo: 'Navratri Navami: the final and culminating fast of Navratri. Devotees perform Kanya Puja (honouring 9 young girls) and distribute prasad. Rama Navami: fast from sunrise to noon, broken after Rama Puja and Ramayana recitation.',
    remedy: 'Offer nine types of flowers to the Navadurga. Light nine lamps in a circle and recite the nine names of Durga (Om Shailaputrye Namah, Om Brahmacharinyai Namah…). Donating nine types of grains to the needy is highly recommended.',
  },

  Dashami: {
    key: 'Dashami', nameEn: 'Dashami', nameKn: 'ದಶಮಿ',
    meaning: 'The tenth lunar day — associated with Dharmaraja (Yama), completion, and the culmination of important endeavours.',
    description: 'Dashami is considered a broadly auspicious tithi in most traditional texts, associated with completion and stability. Vijayadashami (Ashvina Shukla Dashami — Dussehra) is the most celebrated Dashami, marking Rama\'s victory over Ravana and Durga\'s triumph over Mahishasura.',
    deity: 'Dharmaraja (Yama) / Vishnu / Indra',
    symbol: 'A ten-petalled lotus / a crown / arrows of victory',
    suitableActivities: [
      'Completing ongoing major projects',
      'Vijayadashami: all new beginnings, Shastra Puja, Vidyarambha',
      'Entering new positions or taking oaths of office',
      'Purchasing property or vehicles',
      'Commencing long journeys (after auspicious muhurta)',
    ],
    avoidActivities: [
      'Leaving important tasks permanently unfinished',
    ],
    spiritualSignificance: 'Ten (Dasha) represents the completion of the first cycle of numbers and the threshold of a new order. Dashavatara — the ten avatars of Vishnu — maps the entire evolutionary journey from fish to human, from water to consciousness. Vijayadashami teaches that dharma always prevails, not because evil is weak, but because dharmic consciousness is invincible. Yama as Dharmaraja holds the ten directions of accountability.',
    mantra: 'ॐ विजयदशम्यै नमः (Om Vijayadashamyai Namah) — Salutation to the energy of Vijayadashami. General: ॐ धर्मराजाय नमः (Om Dharmarajaya Namah) for Yama\'s benevolent aspect.',
    fastingInfo: 'Vijayadashami itself is a celebration rather than a fast day — Shastra Puja, Vidyarambha (beginning of studies for children), and the burning of Ravana effigies are observed. Fasting is not standard for Dashami.',
    remedy: 'On Dashami, complete any unfinished acts of devotion or charity. Offer ten varieties of fruit or flowers. Recite the ten names of Vishnu (Dashavatar stotram). Performing Shastra Puja (worship of tools and instruments of one\'s profession) on Vijayadashami is especially powerful.',
  },

  Ekadashi: {
    key: 'Ekadashi', nameEn: 'Ekadashi', nameKn: 'ಏಕಾದಶಿ',
    meaning: 'The eleventh lunar day — the most significant tithi for Vishnu devotion and fasting in the Vaishnava tradition.',
    description: 'Ekadashi is universally considered one of the most auspicious and spiritually potent tithis. There are 24 Ekadashis per year (each with a specific name and festival), each dedicated to a different aspect of Vishnu. Fasting on Ekadashi is said to burn accumulated karma and purify the mind-body system.',
    deity: 'Vishnu / Hari',
    symbol: 'The Sudarshana Chakra (Vishnu\'s discus) / 11 petals',
    suitableActivities: [
      'Fasting and Vishnu worship — paramount auspicious activity',
      'Reading or reciting Vishnu Sahasranama and Bhagavata Purana',
      'Meditation, japa, and silent contemplation',
      'Charitable giving and donations to Vaishnava temples',
      'Staying awake through the night (Jagaran) in devotion',
    ],
    avoidActivities: [
      'Eating grains of any kind (wheat, rice, dal, etc.)',
      'Consuming alcohol or non-vegetarian food',
      'Sleep during daytime on Ekadashi',
      'Starting major worldly ventures (spiritual focus is paramount)',
    ],
    spiritualSignificance: 'Ekadashi (11) is beyond the ten senses (five jnana-indriyas + five karma-indriyas) and the mind — it represents the transcendent witness consciousness. Vishnu resides in Vaikuntha in the eleventh realm beyond the ten directions. Fasting on Ekadashi starves the senses so the witness (the 11th) can emerge. Classical texts state that observing Ekadashi fasting is equivalent in merit to performing Ashvamedha Yajna (horse sacrifice) — the highest Vedic ritual.',
    mantra: 'ॐ नमो भगवते वासुदेवाय (Om Namo Bhagavate Vasudevaya) — The 12-syllable Vaishnava Mantra. Also: Hare Krishna Maha Mantra for sustained japa.',
    fastingInfo: 'Complete fast from sunrise on Ekadashi to sunrise on Dwadashi (the next day). Grains are strictly prohibited. Permissible on Ekadashi: fruit, milk, nuts, sago, water chestnut flour, and sweet potato. The fast is broken on Dwadashi with paran (breaking fast) at an auspicious time before the Dwadashi tithi ends.',
    remedy: 'If unable to observe complete fast, partial fasting (eating only fruit and milk) still carries significant merit. Performing Tulsi Puja (worship of the holy basil plant, sacred to Vishnu) on each Ekadashi is recommended. Lighting 11 lamps (deepam) before Vishnu\'s image is a powerful observance.',
  },

  Dwadashi: {
    key: 'Dwadashi', nameEn: 'Dwadashi', nameKn: 'ದ್ವಾದಶಿ',
    meaning: 'The twelfth lunar day — associated with Vishnu, the breaking of the Ekadashi fast, and auspicious completions.',
    description: 'Dwadashi follows Ekadashi and carries Vishnu\'s abundant blessings. The Ekadashi fast is broken (paran) on Dwadashi, making it a day of holy completion. Vaikunta Ekadashi (Margashira Shukla Ekadashi) leads into the Vaikunta Dwadashi — when the gates of Vaikunta (Vishnu\'s abode) are said to be open for devotees.',
    deity: 'Vishnu (Keshava / Madhava form)',
    symbol: 'The lotus at Vishnu\'s feet / the conch (shankha)',
    suitableActivities: [
      'Breaking the Ekadashi fast (paran) at the designated auspicious time',
      'Vishnu Puja and Satyanarayan Puja',
      'Feeding Brahmins and the poor (particularly auspicious)',
      'Beginning charitable undertakings',
      'Performing Tulsi vivaha (marriage of Tulsi plant to Vishnu) in Kartika',
    ],
    avoidActivities: [
      'Delaying the Ekadashi fast-breaking beyond the prescribed paran window',
      'Any act of cruelty or dishonesty — purity is essential post-Ekadashi',
    ],
    spiritualSignificance: 'Dwadashi represents the twelve Adityas (solar deities), the twelve months, and the twelve names of the Sun (Surya Dwadasha Nama). In Vishnu\'s cosmology, twelve represents the full circle of dharmic time — 12 Jyotirlingas, 12 months, 12 signs of the zodiac. The breaking of fast on Dwadashi mirrors how realization (Ekadashi) must be integrated back into embodied life (Dwadashi) to be complete.',
    mantra: 'ॐ केशवाय नमः (Om Keshavaya Namah) — One of the twelve names of Vishnu honoured on Dwadashi. Reciting all twelve: Keshava, Narayana, Madhava, Govinda, Vishnu, Madhusudana, Trivikrama, Vamana, Shridhara, Hrishikesha, Padmanabha, Damodara.',
    fastingInfo: 'The Ekadashi vrat (fast) is broken on Dwadashi. This must be done at the auspicious paran time — typically after sunrise but before the Dwadashi tithi ends. Breaking the fast with sesame seeds, amla (gooseberry), or water from a conch shell is considered especially auspicious.',
    remedy: 'Offer Tulsi leaves to Vishnu. Feed sesame seeds (til) to birds. Donate food to those in need — Dwadashi is particularly powerful for anna-dana (gift of food), which is said to remove obstacles across multiple lifetimes.',
  },

  Trayodashi: {
    key: 'Trayodashi', nameEn: 'Trayodashi', nameKn: 'ತ್ರಯೋದಶಿ',
    meaning: 'The thirteenth lunar day — associated with Shiva, Kamadeva (the deity of love), and Pradosham worship.',
    description: 'Trayodashi carries the energy of auspicious transition and renewal. Pradosham — one of the most powerful Shiva worship periods — occurs on the 13th tithi of both Pakshas at dusk (the sandhya period). Dhanteras (Kartika Krishna Trayodashi) involves purchasing precious metals for Lakshmi\'s blessing.',
    deity: 'Shiva (especially at Pradosham) / Kamadeva / Yama',
    symbol: 'The crescent moon on Shiva\'s head / Shiva\'s trident (trishul)',
    suitableActivities: [
      'Pradosham worship of Shiva at dusk on Trayodashi',
      'Dhanteras (Kartika Krishna Trayodashi): purchasing gold and silver',
      'Shiva abhishekam (ritual bathing of Shivalinga)',
      'Beginning healing or health-related observances',
      'Activities related to transformation and new direction',
    ],
    avoidActivities: [
      'Neglecting the Pradosham dusk window if one wishes to worship Shiva',
      'Starting completely new ventures without due consideration',
    ],
    spiritualSignificance: 'Pradosha (from Sanskrit "proshita" meaning "expelled from" and "dosha" meaning "taint") refers to the twilight period on Trayodashi when Shiva dances in the sky, washing away sins. The 13th is beyond the 12 signs of zodiac — it represents the transcendent axis around which the 12 revolve (Shiva as 13th cosmic principle). Kamadeva (thirteenth energy) represents not just desire but the divine impulse toward unity.',
    mantra: 'ॐ नमः शिवाय (Om Namah Shivaya) — The supreme Panchakshara Mantra, especially potent during Pradosham. Reciting Shiva Mahimna Stotra or Shiva Tandava Stotram on Trayodashi evening brings Shiva\'s grace.',
    fastingInfo: 'Pradosham fast: observed on both Shukla and Krishna Trayodashi by devotees of Shiva. Fast from sunrise until after Pradosha Puja at dusk. The Pradosha Vrata includes a bath at dusk, visit to Shiva temple, and circumambulation of the Shivalinga. Saturn\'s Pradosham (Shani Pradosham, occurring when Trayodashi falls on Saturday) is particularly powerful.',
    remedy: 'For Shiva\'s grace on Trayodashi: offer bel (bilva) leaves, white flowers, and water to the Shivalinga. Recite the Maha Mrityunjaya Mantra 108 times. On Pradosham, performing Shiva abhisheka with milk, honey, and water while reciting Shiva Ashtakam clears accumulated doshas.',
  },

  Chaturdashi: {
    key: 'Chaturdashi', nameEn: 'Chaturdashi', nameKn: 'ಚತುರ್ದಶಿ',
    meaning: 'The fourteenth lunar day — associated with Shiva, Kali, and the powerful energy of the day before the full or new moon.',
    description: 'Chaturdashi is a tithi of intense, liminal energy — standing at the threshold before the climactic Purnima or Amavasya. Shiva Chaturdashi (especially Maha Shivaratri, Magha Krishna Chaturdashi) is the greatest Shiva festival. Narakasur Chaturdashi (Kartika Krishna Chaturdashi) precedes Diwali.',
    deity: 'Shiva (Mahakala) / Kali / Hanuman',
    symbol: 'Shiva\'s trishul (trident) / Kali\'s sword / the night before fullness',
    suitableActivities: [
      'Maha Shivaratri (Magha Krishna Chaturdashi) — all-night vigil and Shiva worship',
      'Narakasur Chaturdashi / Choti Diwali — oil bath before sunrise',
      'Tantra sadhana and advanced spiritual practices (for qualified practitioners)',
      'Deep meditation at night for insight',
    ],
    avoidActivities: [
      'Beginning new ventures (Chaturdashi has Ugra quality)',
      'Marriage ceremonies in most traditions',
      'Auspicious starts requiring stable energy',
    ],
    spiritualSignificance: 'Fourteen represents the fourteen worlds (Chaturdasha Bhuvana) and the fourteen Manus (cosmic managers of time). Maha Shivaratri ("the great night of Shiva") falls on Chaturdashi because it is the darkest night before the new moon in the coldest month — representing the moment when Shiva\'s consciousness is most intensely present, when the veils of illusion are thinnest. Staying awake all night on Maha Shivaratri symbolises the surrender of the ego\'s "sleep" (unconsciousness) to Shiva\'s unchanging light.',
    mantra: 'ॐ नमः शिवाय (Om Namah Shivaya) — Recited 1008 times throughout the night on Maha Shivaratri. The Maha Mrityunjaya Mantra is also central: ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्।',
    fastingInfo: 'Maha Shivaratri: complete fast (nirjala — without water, for advanced devotees) or partial fast (with fruit and milk) from sunrise. Shiva Puja is performed four times throughout the night (at each prahar). Fast broken at sunrise the next morning after Shiva puja. Monthly Shivaratri fasting on Krishna Chaturdashi is also observed by Shiva devotees.',
    remedy: 'Offer bel (bilva) leaves, dhatura flowers, sandalwood paste, and milk to Shiva on Chaturdashi. The offering of blue lotuses to Kali Devi on this tithi is said to grant fearlessness. Reciting the Kavacha of Shiva or the Mahakala Stotra provides protection from negative forces on this intense tithi.',
  },

  Purnima: {
    key: 'Purnima', nameEn: 'Purnima', nameKn: 'ಹುಣ್ಣಿಮೆ',
    meaning: 'The full moon day — the Moon at its fullest illumination, representing completeness, abundance, and heightened spiritual energy.',
    description: 'Purnima is one of the most significant tithis, marking the culmination of the Shukla Paksha. Many major festivals fall on Purnima: Guru Purnima (Ashadha), Buddha Purnima (Vaishakha), Holi (Phalguna), Raksha Bandhan (Shravana), Sharad Purnima (Ashvina). It is associated with Vishnu, Chandra (Moon), and the Goddess Lakshmi.',
    deity: 'Vishnu / Chandra (Moon) / Lakshmi',
    symbol: 'The full, radiant moon / a lotus fully bloomed',
    suitableActivities: [
      'Satyanarayan Puja and Vishnu worship',
      'Fasting and meditation for deepened spiritual clarity',
      'Charitable giving and acts of gratitude',
      'Guru Puja and paying reverence to teachers',
      'Ceremonies celebrating completion and abundance',
      'Holi (Phalguna Purnima): festival of colours and Holika Dahan',
    ],
    avoidActivities: [
      'Activities requiring emotional control if one is sensitive to lunar fluctuations',
      'Major surgeries (traditionally considered a time of increased sensitivity)',
      'Excessive anger or confrontation — the full moon amplifies emotional states',
    ],
    spiritualSignificance: 'Purnima represents the soul\'s fullest reflection of divine light — just as the full moon completely reflects the sun\'s light without a shadow of its own, the purified consciousness completely reflects Brahman. The Moon on Purnima is called Soma, the nectar of immortality in Vedic tradition. Guru Purnima teaches that the Guru is one who turns the disciple into a full moon — a complete reflector of the divine. The full moon also governs the tides of consciousness in all beings.',
    mantra: 'ॐ नमो भगवते वासुदेवाय (Om Namo Bhagavate Vasudevaya) for Vishnu. For the moon: ॐ सों सोमाय नमः (Om Som Somaya Namah). For Guru Purnima: गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः गुरुः साक्षात् परंब्रह्म तस्मै श्री गुरवे नमः।',
    fastingInfo: 'Many devotees observe a fast on Purnima, eating only once or keeping nirjala fast. Satyanarayan Vrat Katha is recited on Purnima evenings throughout the year. Guru Purnima: fasting from dawn, attending satsang with one\'s Guru, and performing pada-puja (worship of teacher\'s feet).',
    remedy: 'On Purnima, place a bowl of water (or milk) in moonlight to receive Chandra\'s blessings (lunar energized water/milk is consumed or used for bathing). Offer white flowers, white sweets, and camphor to the Moon. Performing Satyanarayan Puja on Purnima and feeding 16 Brahmins is a complete vrat with powerful results.',
  },

  Amavasya: {
    key: 'Amavasya', nameEn: 'Amavasya', nameKn: 'ಅಮಾವಾಸ್ಯೆ',
    meaning: 'The new moon day — the Moon is invisible, representing introspection, ancestral connection, and the end of a lunar cycle.',
    description: 'Amavasya marks the culmination of the Krishna Paksha and is strongly associated with honouring ancestors (Pitru Tarpana, Shraddha rites). Mahalaya Amavasya (Ashvina) is the most sacred ancestral offering day. Diwali falls on Kartika Amavasya.',
    deity: 'Pitrus (Ancestors) / Shiva / Kali',
    symbol: 'A dark, moonless sky / a lit diya in darkness / ancestral footprints',
    suitableActivities: [
      'Pitru Tarpana (ancestral water offerings) — essential on Amavasya',
      'Shraddha rites for departed family members',
      'Deep meditation and introspection — the inner light shines brightest in darkness',
      'Diwali Lakshmi Puja (Kartika Amavasya)',
      'Mahalaya Pitru Paksha observances',
      'Worship of Shiva, Kali, or any deity one is devoted to',
    ],
    avoidActivities: [
      'Starting major new ventures in most traditions (introspective, not initiatory)',
      'Travel for celebratory occasions',
      'Marriage ceremonies in the vast majority of regional traditions',
      'Entering a new home (Griha Pravesha)',
    ],
    spiritualSignificance: 'Amavasya is Amavasu — the dwelling place of ancestors. When there is no moon, the veil between the living and the departed is considered thinnest, making ancestral offerings (Tarpana) most effective. The darkness of Amavasya is not empty — it is the pregnant void (Shoonya) from which all light is born. Diwali on Amavasya teaches that the deepest darkness calls forth the most lights — the inner Lakshmi (consciousness) is awakened precisely when outer light is absent. Kali\'s worship on Amavasya honours the creative darkness that contains all potentials.',
    mantra: 'ॐ पितृभ्यः स्वाहा (Om Pitribhyah Svaha) — The ancestral offering mantra recited during Tarpana. Also: ॐ यं यमाय नमः (Om Yam Yamaya Namah) for Yama, lord of ancestors. For Diwali: ॐ महालक्ष्म्यै नमः (Om Mahalakshmyai Namah).',
    fastingInfo: 'Amavasya Vrat: many devotees fast on Amavasya and perform Pitru Puja and Tarpana before eating. The fast is dedicated to ancestors. Some traditions permit one meal of rice and sesame (til) mixed together — considered highly purifying and pleasing to ancestors. Mahalaya Amavasya (Sarva Pitru Amavasya) requires the most elaborate Shraddha observance.',
    remedy: 'Perform Tarpana (offering of water with sesame seeds and kusha grass) to departed ancestors while reciting their names, gotra, and relationship. Feed crows (considered messengers of ancestors in tradition), cows, and dogs on Amavasya — these three are said to be avenues through which ancestral beings receive nourishment. Light 14 lamps in the four directions to illuminate the path for departed souls.',
  },
}

/**
 * Lookup a Tithi knowledge entry by its localization key.
 */
export function getTithiKnowledge(key: string): TithiKnowledge | null {
  return TITHI_KNOWLEDGE[key] ?? null
}
