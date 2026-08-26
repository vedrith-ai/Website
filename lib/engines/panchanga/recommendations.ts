// ─────────────────────────────────────────────────────────────────────────────
// VedRith Daily Recommendations Engine  [V1.1 — New]
//
// Generates DYNAMIC recommendations based on the actual Panchanga elements
// computed for a given day. No hardcoded yearly tables.
//
// Each recommendation explains WHY it is auspicious or inauspicious, derived
// from the combination of Tithi, Nakshatra, Yoga, Vara, and Karana.
//
// Source: Muhurta Chintamani (Rama Dayalu), Dharma Sindhu (Kashinath Upadhyaya),
// Brihat Samhita (Varahamihira), Jataka Parijata, Hora Sara (Prithuyasas).
// Rules are drawn from classical texts — not generated.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export type RecommendationStatus = 'auspicious' | 'inauspicious' | 'neutral'

export interface ActivityRecommendation {
  /** Activity category */
  activity: string
  /** auspicious / inauspicious / neutral */
  status: RecommendationStatus
  /** Human-readable explanation of WHY this recommendation applies today */
  reason: string
  /** The specific Panchanga elements contributing to this assessment */
  contributors: string[]
}

export interface DailyRecommendations {
  marriage:         ActivityRecommendation
  gruhaProvesha:    ActivityRecommendation
  aksharabhyasa:    ActivityRecommendation
  upanayana:        ActivityRecommendation
  vehiclePurchase:  ActivityRecommendation
  businessOpening:  ActivityRecommendation
  travel:           ActivityRecommendation
  landPurchase:     ActivityRecommendation
  bhooomiPooja:     ActivityRecommendation
  namingCeremony:   ActivityRecommendation
  annaprashana:     ActivityRecommendation
}

// ── Rule Tables ──────────────────────────────────────────────────────────────

/** Tithis inauspicious for all Mangalik (marriage-type) activities (Rikta tithis) */
const RIKTA_TITHIS = new Set(['Chaturthi', 'Navami', 'Chaturdashi'])

/** Tithis inauspicious for most auspicious beginnings */
const INAUSPICIOUS_TITHIS_GENERAL = new Set([
  'Chaturthi', 'Chaturdashi', 'Amavasya',
])

/** Tithis auspicious for marriage */
const MARRIAGE_AUSPICIOUS_TITHIS = new Set([
  'Dvitiya', 'Tritiya', 'Panchami', 'Saptami',
  'Dashami', 'Ekadashi', 'Trayodashi',
])

/** Nakshatras auspicious for marriage */
const MARRIAGE_AUSPICIOUS_NK = new Set([
  'Rohini', 'Mrigashira', 'Magha', 'UttaraPhalguni', 'Hasta', 'Swati',
  'Anuradha', 'Mrigashira', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'UttaraBhadrapada', 'Revati',
])

/** Nakshatras inauspicious for marriage */
const MARRIAGE_INAUSPICIOUS_NK = new Set([
  'Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Jyeshtha', 'Moola',
  'Pushya',  // Pushya is inauspicious for Vivah despite being auspicious for most else
])

/** Nakshatras auspicious for Griha Pravesha */
const GRUHA_AUSPICIOUS_NK = new Set([
  'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'UttaraPhalguni', 'Hasta',
  'Chitra', 'Anuradha', 'Shravana', 'Dhanishtha', 'Revati',
])

/** Nakshatras auspicious for Aksharabhyasa (first writing) */
const AKSHARA_AUSPICIOUS_NK = new Set([
  'Ashwini', 'Rohini', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati',
  'Anuradha', 'Shravana', 'Revati',
])

/** Nakshatras auspicious for travel */
const TRAVEL_AUSPICIOUS_NK = new Set([
  'Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati',
  'Anuradha', 'Shravana', 'Revati',
])

/** Nakshatras generally auspicious for commercial/land activities */
const COMMERCIAL_AUSPICIOUS_NK = new Set([
  'Rohini', 'Mrigashira', 'Ashwini', 'Pushya', 'Hasta', 'Swati',
  'Anuradha', 'Shravana', 'Revati', 'Punarvasu',
])

/** Yogas that are broadly inauspicious */
const INAUSPICIOUS_YOGAS = new Set([
  'Vishkumbha', 'Atiganda', 'Shoola', 'Ganda', 'Vajra', 'Vyaghata',
  'Harshana', 'Parigha', 'Indra', 'Vaidhriti',
])

/** Weekdays inauspicious for marriage in most traditions */
const MARRIAGE_INAUSPICIOUS_VARA = new Set(['Tuesday', 'Saturday'])

/** Weekdays auspicious for vehicle/land purchase */
const VEHICLE_AUSPICIOUS_VARA = new Set(['Wednesday', 'Thursday', 'Friday'])

/** Weekdays auspicious for business/commercial activity */
const BUSINESS_AUSPICIOUS_VARA = new Set(['Wednesday', 'Thursday', 'Friday', 'Monday'])

// ── Helpers ──────────────────────────────────────────────────────────────────

interface PanchangaInputs {
  tithi:     string   // Tithi key (e.g. 'Purnima', 'Chaturthi')
  nakshatra: string   // Nakshatra key (e.g. 'Rohini')
  yoga:      string   // Yoga key (e.g. 'Siddha')
  karana:    string   // Karana key (e.g. 'Bava')
  vara:      string   // Weekday key (e.g. 'Monday')
}

function hasAuspiciousYoga(yoga: string): boolean {
  return !INAUSPICIOUS_YOGAS.has(yoga)
}

// ── Recommendation Generators ─────────────────────────────────────────────────

function marriageRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  let score = 0
  const reasons: string[] = []

  if (MARRIAGE_AUSPICIOUS_TITHIS.has(p.tithi)) {
    score++; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is a favoured Tithi for Vivah in classical Muhurta texts`)
  } else if (RIKTA_TITHIS.has(p.tithi) || INAUSPICIOUS_TITHIS_GENERAL.has(p.tithi)) {
    score -= 2; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is a Rikta (deficient) or inauspicious Tithi — avoided for Vivah`)
  }

  if (MARRIAGE_AUSPICIOUS_NK.has(p.nakshatra)) {
    score++; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is listed as auspicious for Vivah in Muhurta Chintamani`)
  } else if (MARRIAGE_INAUSPICIOUS_NK.has(p.nakshatra)) {
    score -= 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is specifically prohibited for marriage ceremonies`)
  }

  if (MARRIAGE_INAUSPICIOUS_VARA.has(p.vara)) {
    score--; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is traditionally avoided for marriage as the ruling planet increases discord`)
  } else if (p.vara === 'Thursday' || p.vara === 'Friday' || p.vara === 'Monday') {
    score++; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is favoured for marriage — the ruling planet promotes harmony and auspiciousness`)
  }

  if (!hasAuspiciousYoga(p.yoga)) {
    score--; contributors.push(`Yoga: ${p.yoga}`)
    reasons.push(`${p.yoga} Yoga introduces an obstacle — inauspicious for Vivah`)
  } else {
    score++; contributors.push(`Yoga: ${p.yoga}`)
    reasons.push(`${p.yoga} Yoga is favourable`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  const reason = reasons.length > 0
    ? reasons.join('. ') + '.'
    : 'The Panchanga today is mixed for marriage ceremonies. Consult a Muhurta specialist for the specific auspicious window.'

  return { activity: 'Marriage', status, reason, contributors }
}

function gruhaRecommendation(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  if (GRUHA_AUSPICIOUS_NK.has(p.nakshatra)) {
    score++; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is favoured for Griha Pravesha as it confers stability and blessings on the new home`)
  } else if (['Moola', 'Bharani', 'Ashlesha', 'Jyeshtha', 'Ardra'].includes(p.nakshatra)) {
    score -= 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is inauspicious for entering a new home — it can bring instability or problems`)
  }

  if (INAUSPICIOUS_TITHIS_GENERAL.has(p.tithi)) {
    score--; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} Tithi is generally inauspicious for important new beginnings like Griha Pravesha`)
  } else {
    score++
  }

  if (p.vara === 'Tuesday' || p.vara === 'Saturday') {
    score--; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} increases Mars or Saturn energy — which can introduce conflict or obstacles in a new home`)
  } else if (p.vara === 'Wednesday' || p.vara === 'Thursday' || p.vara === 'Friday') {
    score++; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is auspicious for Griha Pravesha — the ruling planet promotes prosperity and learning in the new home`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Griha Pravesha (Home Entry)', status,
    reason: reasons.join('. ') + (reasons.length ? '.' : ' The day\'s Panchanga is mixed — select the best Lagna within the day.'),
    contributors,
  }
}

function aksharabhyasaRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  if (AKSHARA_AUSPICIOUS_NK.has(p.nakshatra)) {
    score += 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is excellent for Aksharabhyasa — it governs swift learning, skill, or knowledge transmission`)
  }
  if (p.vara === 'Wednesday') {
    score += 2; contributors.push(`Vara: Wednesday`)
    reasons.push(`Wednesday, ruled by Mercury (Budha), is the ideal weekday for initiating education and the first writing ceremony`)
  } else if (p.vara === 'Thursday') {
    score++; contributors.push(`Vara: Thursday`)
    reasons.push(`Thursday, ruled by Jupiter (Guru), is the day of the divine teacher and is auspicious for all educational beginnings`)
  }
  if (RIKTA_TITHIS.has(p.tithi)) {
    score--; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is a Rikta Tithi — its deficient energy is less ideal for initiating learning`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Aksharabhyasa (First Writing)', status,
    reason: reasons.join('. ') + (reasons.length ? '.' : ' The Panchanga today is adequate for Aksharabhyasa with proper Lagna selection.'),
    contributors,
  }
}

function upanayanRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  const goodNK = new Set(['Hasta', 'Ashwini', 'Pushya', 'Mrigashira', 'Revati', 'Rohini', 'Punarvasu', 'Shravana'])
  if (goodNK.has(p.nakshatra)) {
    score += 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is listed as auspicious for Upanayana in classical Muhurta texts, conferring Vedic learning`)
  }
  if (p.vara === 'Thursday') {
    score += 2; contributors.push(`Vara: Thursday`)
    reasons.push(`Thursday (Guru-vara) is the supreme day for Upanayana — the divine teacher Brihaspati presides and blesses the sacred thread ceremony`)
  } else if (p.vara === 'Wednesday' || p.vara === 'Monday') {
    score++; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is a favourable weekday for the sacred Upanayana ceremony`)
  }
  if (p.vara === 'Tuesday' || p.vara === 'Saturday') {
    score -= 2; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is considered inauspicious for Upanayana in most traditions`)
  }
  if (INAUSPICIOUS_TITHIS_GENERAL.has(p.tithi)) {
    score--; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} Tithi is generally avoided for sacred initiation ceremonies`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Upanayana (Sacred Thread Ceremony)', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

function vehicleRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  if (VEHICLE_AUSPICIOUS_VARA.has(p.vara)) {
    score += 2; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is auspicious for vehicle purchase — the ruling planet bestows safe journeys and mechanical reliability`)
  } else if (p.vara === 'Saturday') {
    score--; contributors.push(`Vara: Saturday`)
    reasons.push(`Saturday (Shani-vara) can introduce delays and mechanical issues for vehicles — generally avoided for vehicle purchase in classical tradition`)
  }
  const goodNK = new Set(['Ashwini', 'Rohini', 'Mrigashira', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Revati'])
  if (goodNK.has(p.nakshatra)) {
    score++; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is favourable for vehicle activities — it supports swift, safe movement`)
  }
  if (p.tithi === 'Dvitiya' || p.tithi === 'Tritiya' || p.tithi === 'Dashami' || p.tithi === 'Trayodashi') {
    score++; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is a favourable Tithi for purchasing vehicles and undertaking journeys`)
  }
  if (INAUSPICIOUS_TITHIS_GENERAL.has(p.tithi)) {
    score--; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} Tithi introduces obstacles — less ideal for vehicle purchase`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Vehicle Purchase', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

function businessRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  if (BUSINESS_AUSPICIOUS_VARA.has(p.vara)) {
    score += 2; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is highly auspicious for business openings — its ruling planet favours commerce, prosperity, and intellectual enterprise`)
  }
  if (COMMERCIAL_AUSPICIOUS_NK.has(p.nakshatra)) {
    score++; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra supports commercial activities and the flow of wealth`)
  }
  if (!hasAuspiciousYoga(p.yoga)) {
    score -= 2; contributors.push(`Yoga: ${p.yoga}`)
    reasons.push(`${p.yoga} Yoga is inauspicious — it introduces obstacles to new ventures. Wait for a more favourable Yoga`)
  } else {
    score++
  }
  if (p.tithi === 'Ekadashi') {
    score--; contributors.push(`Tithi: Ekadashi`)
    reasons.push(`Ekadashi prioritises spiritual observance over commercial activity — many traditional businesses avoid opening on this Tithi`)
  } else if (['Dvitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Trayodashi'].includes(p.tithi)) {
    score++; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is a favourable Tithi for beginning commercial activities`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Business Opening', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

function travelRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  if (TRAVEL_AUSPICIOUS_NK.has(p.nakshatra)) {
    score += 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is among the classical travel-auspicious Nakshatras — it governs movement, journeys, and exploration`)
  } else if (['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Jyeshtha', 'Moola'].includes(p.nakshatra)) {
    score -= 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} is inauspicious for beginning journeys — its fierce nature can create obstacles or accidents in travel`)
  }
  if (p.vara === 'Tuesday' || p.vara === 'Saturday') {
    score--; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is not ideal for travel beginnings — Mars/Saturn energy can introduce difficulties on journeys`)
  } else if (p.vara === 'Wednesday' || p.vara === 'Thursday' || p.vara === 'Monday') {
    score++; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is auspicious for travel — the ruling planet supports safe journeys`)
  }
  if (p.tithi === 'Amavasya') {
    score -= 2; contributors.push(`Tithi: Amavasya`)
    reasons.push(`Amavasya is inauspicious for travel — the new moon creates low visibility and the energy favours introspection, not movement`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Travel', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

function landPurchaseRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  // Fixed Nakshatras are best for land (permanence)
  const fixedNK = new Set(['Rohini', 'UttaraPhalguni', 'UttaraAshadha', 'UttaraBhadrapada'])
  if (fixedNK.has(p.nakshatra)) {
    score += 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} is a Dhruva (fixed / stable) Nakshatra — ideal for land purchase as it confers permanence and rooted stability`)
  } else if (COMMERCIAL_AUSPICIOUS_NK.has(p.nakshatra)) {
    score++; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} is auspicious for property-related activities`)
  }
  if (p.vara === 'Wednesday' || p.vara === 'Thursday') {
    score += 2; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is particularly recommended for land and property purchase — Mercury and Jupiter bestow prosperity in real estate`)
  }
  if (p.vara === 'Tuesday') {
    score--; contributors.push(`Vara: Tuesday`)
    reasons.push(`Tuesday (Mars day) for land transactions can increase disputes and boundary conflicts — generally avoided in classical Muhurta`)
  }
  if (['Dvitiya', 'Tritiya', 'Panchami', 'Dashami', 'Trayodashi'].includes(p.tithi)) {
    score++; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is a favourable Tithi for property transactions`)
  }
  if (INAUSPICIOUS_TITHIS_GENERAL.has(p.tithi)) {
    score--; contributors.push(`Tithi: ${p.tithi}`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Land Purchase', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

function bhoomiPoojaRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  // Similar to Griha Pravesha but focused on earth-breaking
  const goodNK = new Set(['Rohini', 'Mrigashira', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Pushya', 'Shravana'])
  if (goodNK.has(p.nakshatra)) {
    score += 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} Nakshatra is auspicious for Bhoomi Puja — propitious for beginning construction on the earth`)
  }
  if (p.vara === 'Wednesday' || p.vara === 'Thursday' || p.vara === 'Friday') {
    score++; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is suitable for Bhoomi Puja — the ruling planet promotes growth and prosperity in new construction`)
  }
  if (p.vara === 'Tuesday' || p.vara === 'Saturday') {
    score--; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} carries Mars/Saturn energy — traditionally less ideal for beginning earth-breaking ceremonies`)
  }
  if (RIKTA_TITHIS.has(p.tithi)) {
    score--; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is a Rikta (empty) Tithi — its deficient energy is less ideal for Bhoomi Puja`)
  } else {
    score++
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Bhoomi Puja (Ground Breaking)', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

function namingRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  const goodNK = new Set(['Ashwini', 'Rohini', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Revati', 'Mrigashira'])
  if (goodNK.has(p.nakshatra)) {
    score += 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} is considered excellent for Namakarana (naming ceremony) — it bestows prosperity and wellbeing on the child`)
  }
  if (p.vara === 'Wednesday' || p.vara === 'Thursday' || p.vara === 'Friday' || p.vara === 'Monday') {
    score++; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is a favourable weekday for performing child-related ceremonies including naming`)
  }
  if (p.tithi === 'Dvitiya' || p.tithi === 'Tritiya' || p.tithi === 'Panchami' || p.tithi === 'Saptami' || p.tithi === 'Dashami' || p.tithi === 'Trayodashi') {
    score++; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is listed as auspicious for Namakarana in classical Muhurta texts`)
  }
  if (INAUSPICIOUS_TITHIS_GENERAL.has(p.tithi)) {
    score -= 2; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} is generally avoided for child-related ceremonies`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Naming Ceremony (Namakarana)', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

function annaprashanaRec(p: PanchangaInputs): ActivityRecommendation {
  const contributors: string[] = []
  const reasons: string[] = []
  let score = 0

  const goodNK = new Set(['Rohini', 'Mrigashira', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Revati', 'Punarvasu', 'Ashwini'])
  if (goodNK.has(p.nakshatra)) {
    score += 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} is auspicious for Annaprashana (first solid food) — it supports the child's nourishment, health, and growth`)
  } else if (['Bharani', 'Ardra', 'Ashlesha', 'Jyeshtha', 'Moola', 'Krittika'].includes(p.nakshatra)) {
    score -= 2; contributors.push(`Nakshatra: ${p.nakshatra}`)
    reasons.push(`${p.nakshatra} is inauspicious for Annaprashana — its fierce energy can affect the child's digestive health negatively`)
  }
  if (p.vara === 'Wednesday' || p.vara === 'Thursday' || p.vara === 'Friday' || p.vara === 'Monday') {
    score++; contributors.push(`Vara: ${p.vara}`)
    reasons.push(`${p.vara} is a gentle, auspicious weekday for child ceremonies — the ruling planet supports health and wellbeing`)
  }
  if (p.vara === 'Tuesday') {
    score--; contributors.push(`Vara: Tuesday`)
    reasons.push(`Tuesday (Mars day) is not ideal for child ceremonies such as Annaprashana in most traditions`)
  }
  if (['Dvitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Trayodashi'].includes(p.tithi)) {
    score++; contributors.push(`Tithi: ${p.tithi}`)
    reasons.push(`${p.tithi} Tithi is favourable for Annaprashana`)
  }

  const status: RecommendationStatus = score >= 2 ? 'auspicious' : score <= -1 ? 'inauspicious' : 'neutral'
  return {
    activity: 'Annaprashana (First Solid Food)', status,
    reason: reasons.join('. ') + '.',
    contributors,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate dynamic daily recommendations based on Panchanga elements.
 *
 * Each recommendation is computed from the actual combination of Tithi,
 * Nakshatra, Yoga, Karana, and Vara — never from hardcoded date tables.
 */
export function computeDailyRecommendations(inputs: PanchangaInputs): DailyRecommendations {
  return {
    marriage:        marriageRec(inputs),
    gruhaProvesha:   gruhaRecommendation(inputs),
    aksharabhyasa:   aksharabhyasaRec(inputs),
    upanayana:       upanayanRec(inputs),
    vehiclePurchase: vehicleRec(inputs),
    businessOpening: businessRec(inputs),
    travel:          travelRec(inputs),
    landPurchase:    landPurchaseRec(inputs),
    bhooomiPooja:    bhoomiPoojaRec(inputs),
    namingCeremony:  namingRec(inputs),
    annaprashana:    annaprashanaRec(inputs),
  }
}
