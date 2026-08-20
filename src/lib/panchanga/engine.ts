/**
 * VedRith Panchanga Engine
 * Vedic astronomical calculations for the five limbs of the day.
 * Uses mean planetary longitudes with simplified but accurate corrections.
 */

import type { PanchangaRequest, PanchangaResponse, Region } from '@/src/types';
import { toJulianDay, parseDate, formatTime, addMinutes } from '@/src/lib/utils/date';

// ─── Constants ───────────────────────────────────────────────────────────────

const AYANAMSHA_J2000 = 23.85; // Lahiri ayanamsha at J2000 (degrees)
const AYANAMSHA_RATE  = 0.01396; // degrees per year

// Nakshatra spans 13°20' = 13.3333... degrees each
const NAKSHATRA_SPAN = 360 / 27;

// Tithi spans 12° of elongation
const TITHI_SPAN = 12;

// Yoga spans 13°20' of sum(sun+moon)
const YOGA_SPAN = 360 / 27;

// ─── Nakshatra list ───────────────────────────────────────────────────────────

export const NAKSHATRAS = [
  'ashwini','bharani','krittika','rohini','mrigashira','ardra',
  'punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni',
  'hasta','chitra','swati','vishakha','anuradha','jyeshtha',
  'mula','purva-ashadha','uttara-ashadha','shravana','dhanishtha',
  'shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati',
] as const;

export const TITHIS = [
  'pratipada','dvitiya','tritiya','chaturthi','panchami','shashthi',
  'saptami','ashtami','navami','dashami','ekadashi','dvadashi',
  'trayodashi','chaturdashi','purnima',
  'pratipada','dvitiya','tritiya','chaturthi','panchami','shashthi',
  'saptami','ashtami','navami','dashami','ekadashi','dvadashi',
  'trayodashi','chaturdashi','amavasya',
] as const;

export const VARAS = [
  'sunday','monday','tuesday','wednesday','thursday','friday','saturday',
] as const;

export const YOGAS = [
  'vishkumbha','priti','ayushman','saubhagya','shobhana','atiganda',
  'sukarma','dhriti','shula','ganda','vriddhi','dhruva','vyaghata',
  'harshana','vajra','siddhi','vyatipata','variyana','parigha','shiva',
  'siddha','sadhya','shubha','shukla','brahma','mahendra','vaidhriti',
] as const;

export const KARANAS = [
  'bava','balava','kaulava','taitila','garaja','vanija','vishti',
  'shakuni','chatushpada','nagava','kimstughna',
] as const;

// ─── Ayanamsha ────────────────────────────────────────────────────────────────

function getAyanamsha(jd: number): number {
  const yearsSince2000 = (jd - 2451545.0) / 365.25;
  return AYANAMSHA_J2000 + AYANAMSHA_RATE * yearsSince2000;
}

// ─── Planetary longitudes (mean) ─────────────────────────────────────────────

function normalize360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function solarLongitude(jd: number): number {
  const T   = (jd - 2451545.0) / 36525;
  const L0  = 280.46646 + 36000.76983 * T;
  const M   = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = M * Math.PI / 180;
  const C   = (1.914602 - 0.004817 * T) * Math.sin(Mrad)
            + 0.019993 * Math.sin(2 * Mrad)
            + 0.000289 * Math.sin(3 * Mrad);
  const sunLong = L0 + C;
  return normalize360(sunLong);
}

function lunarLongitude(jd: number): number {
  const T  = (jd - 2451545.0) / 36525;
  const L0 = 218.3164477 + 481267.88123421 * T;
  const M  = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const D  = 297.8501921 + 445267.1114034 * T;
  const F  = 93.2720950  + 483202.0175233 * T;
  const Mrad  = M  * Math.PI / 180;
  const Mprad = Mp * Math.PI / 180;
  const Drad  = D  * Math.PI / 180;
  const Frad  = F  * Math.PI / 180;
  const correction =
    6.288774 * Math.sin(Mprad) +
    1.274027 * Math.sin(2 * Drad - Mprad) +
    0.658314 * Math.sin(2 * Drad) +
    0.213618 * Math.sin(2 * Mprad) -
    0.185116 * Math.sin(Mrad) -
    0.114332 * Math.sin(2 * Frad);
  return normalize360(L0 + correction);
}

// ─── Sidereal longitudes (subtract ayanamsha) ────────────────────────────────

function siderealSolar(jd: number): number {
  return normalize360(solarLongitude(jd) - getAyanamsha(jd));
}

function siderealLunar(jd: number): number {
  return normalize360(lunarLongitude(jd) - getAyanamsha(jd));
}

// ─── Five limbs ──────────────────────────────────────────────────────────────

export function calcVara(jd: number, timezone: string): { vara: string; varaIndex: number } {
  const date    = new Date((jd - 2440587.5) * 86400000);
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' })
    .format(date);
  const map: Record<string, number> = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
  const idx = map[weekday] ?? 0;
  return { vara: VARAS[idx], varaIndex: idx };
}

export function calcTithi(jd: number): { tithi: string; tithiIndex: number; tithiPaksha: 'shukla' | 'krishna' } {
  const sun  = siderealSolar(jd);
  const moon = siderealLunar(jd);
  let elong  = normalize360(moon - sun);
  const rawIdx    = Math.floor(elong / TITHI_SPAN);
  const tithiIndex = (rawIdx % 30) + 1; // 1-30
  const paksha    = tithiIndex <= 15 ? 'shukla' : 'krishna';
  const tithiKey  = TITHIS[rawIdx % 30];
  return { tithi: tithiKey, tithiIndex, tithiPaksha: paksha };
}

export function calcNakshatra(jd: number): {
  nakshatra: string; nakshatraIndex: number; nakshatraPada: number
} {
  const moon = siderealLunar(jd);
  const rawIdx      = Math.floor(moon / NAKSHATRA_SPAN);
  const nakshatraIndex = rawIdx % 27;
  const remainder   = moon - rawIdx * NAKSHATRA_SPAN;
  const pada        = Math.floor(remainder / (NAKSHATRA_SPAN / 4)) + 1;
  return {
    nakshatra:      NAKSHATRAS[nakshatraIndex],
    nakshatraIndex,
    nakshatraPada: Math.min(pada, 4),
  };
}

export function calcYoga(jd: number): { yoga: string; yogaIndex: number } {
  const sun  = siderealSolar(jd);
  const moon = siderealLunar(jd);
  const sum  = normalize360(sun + moon);
  const idx  = Math.floor(sum / YOGA_SPAN) % 27;
  return { yoga: YOGAS[idx], yogaIndex: idx };
}

export function calcKarana(jd: number): { karana: string; karanaIndex: number } {
  const sun  = siderealSolar(jd);
  const moon = siderealLunar(jd);
  const elong = normalize360(moon - sun);
  const halfTithi = Math.floor(elong / 6) % 60;
  let karanaIndex: number;
  if (halfTithi === 0) {
    karanaIndex = 10; // Kimstughna (fixed)
  } else if (halfTithi >= 57) {
    karanaIndex = halfTithi - 57 + 7; // Shakuni, Chatushpada, Nagava
  } else {
    karanaIndex = ((halfTithi - 1) % 7);
  }
  return { karana: KARANAS[karanaIndex % 11], karanaIndex: karanaIndex % 11 };
}

// ─── Sunrise / Sunset (Meeus simplified) ─────────────────────────────────────

function calcSunEvents(jd: number, lat: number, lon: number, timezone: string): {
  sunrise: string; sunset: string; transitJd: number
} {
  const T    = (jd - 2451545.0) / 36525;
  const L0   = 280.46646 + 36000.76983 * T;
  const M    = 357.52911 + 35999.05029 * T;
  const Mrad = M * Math.PI / 180;
  const C    = 1.914602 * Math.sin(Mrad) + 0.019993 * Math.sin(2 * Mrad);
  const sunLon  = L0 + C;
  const omega   = 125.04 - 1934.136 * T;
  const apparent = sunLon - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  const epsilon = 23.439291 - 0.013004 * T;
  const RA      = Math.atan2(
    Math.cos(epsilon * Math.PI / 180) * Math.sin(apparent * Math.PI / 180),
    Math.cos(apparent * Math.PI / 180)
  ) * 180 / Math.PI;
  const decl = Math.asin(
    Math.sin(epsilon * Math.PI / 180) * Math.sin(apparent * Math.PI / 180)
  ) * 180 / Math.PI;

  const latRad  = lat * Math.PI / 180;
  const declRad = decl * Math.PI / 180;
  const cosH    = (Math.sin(-0.8333 * Math.PI / 180) - Math.sin(latRad) * Math.sin(declRad))
                / (Math.cos(latRad) * Math.cos(declRad));

  if (cosH < -1 || cosH > 1) {
    // Polar day/night — fallback
    return { sunrise: '06:00', sunset: '18:00', transitJd: jd + 0.5 };
  }

  const H = Math.acos(cosH) * 180 / Math.PI;

  // Equation of time (minutes)
  const eot = 4 * (L0 - 0.0057183 - RA + 0 /* negligible terms */);

  const transitNoon = 12 - lon / 15 - eot / 60;
  const sunriseHr   = transitNoon - H / 15;
  const sunsetHr    = transitNoon + H / 15;

  const toHHMM = (hr: number): string => {
    const h = Math.floor(((hr % 24) + 24) % 24);
    const m = Math.floor(((hr % 1) + 1) % 1 * 60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  };

  const transitDate = new Date(jd * 86400000 - 2440587.5 * 86400000);
  transitDate.setUTCHours(Math.floor(transitNoon), Math.floor((transitNoon % 1) * 60), 0, 0);

  return {
    sunrise:   toHHMM(sunriseHr),
    sunset:    toHHMM(sunsetHr),
    transitJd: jd + transitNoon / 24,
  };
}

// ─── Abhijit Muhurta (50 minutes centred on solar noon) ──────────────────────

function calcAbhijit(sunriseStr: string, sunsetStr: string): { start: string; end: string; durationMinutes: number } {
  const parseHHMM = (s: string): number => {
    const [h, m] = s.split(':').map(Number);
    return h + m / 60;
  };
  const sr = parseHHMM(sunriseStr);
  const ss = parseHHMM(sunsetStr);
  const noon = (sr + ss) / 2;
  const toHHMM = (hr: number): string => {
    const h = Math.floor(((hr % 24) + 24) % 24);
    const m = Math.round(((hr % 1) + (hr < 0 ? 1 : 0)) * 60) % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  };
  return {
    start: toHHMM(noon - 25 / 60),
    end:   toHHMM(noon + 25 / 60),
    durationMinutes: 50,
  };
}

// ─── Rahu Kalam ──────────────────────────────────────────────────────────────

const RAHUKALAM_ORDER = [7, 1, 6, 4, 5, 3, 2]; // portion index by day (Sun=0)

function calcRahukalam(sunriseStr: string, sunsetStr: string, vara: number): { start: string; end: string } {
  const parseHHMM = (s: string): number => {
    const [h, m] = s.split(':').map(Number);
    return h + m / 60;
  };
  const toHHMM = (hr: number): string => {
    const h = Math.floor(hr);
    const m = Math.round((hr - h) * 60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  };
  const sr     = parseHHMM(sunriseStr);
  const ss     = parseHHMM(sunsetStr);
  const portion = (ss - sr) / 8;
  const idx    = RAHUKALAM_ORDER[vara] - 1;
  return {
    start: toHHMM(sr + idx * portion),
    end:   toHHMM(sr + (idx + 1) * portion),
  };
}

// ─── Festivals lookup ─────────────────────────────────────────────────────────

const FESTIVAL_DB: Record<string, string[]> = {
  '01-14': ['Makara Sankranti', 'Pongal'],
  '01-26': ['Republic Day'],
  '03-25': ['Ugadi'],
  '08-15': ['Independence Day'],
  '08-19': ['Ganesh Chaturthi'],
  '10-02': ['Gandhi Jayanti', 'Dasara'],
  '10-20': ['Diwali'],
  '11-14': ["Children's Day"],
  '12-25': ['Christmas'],
};

function getFestivals(dateStr: string): string[] {
  const mmdd = dateStr.slice(5); // MM-DD
  return FESTIVAL_DB[mmdd] ?? [];
}

// ─── Deity & message lookup ───────────────────────────────────────────────────

const NAKSHATRA_DEITY: Record<string, string> = {
  'ashwini': 'Ashwini Kumaras', 'bharani': 'Yama', 'krittika': 'Agni',
  'rohini': 'Brahma', 'mrigashira': 'Soma', 'ardra': 'Rudra',
  'punarvasu': 'Aditi', 'pushya': 'Brihaspati', 'ashlesha': 'Nagas',
  'magha': 'Pitrus', 'purva-phalguni': 'Bhaga', 'uttara-phalguni': 'Aryaman',
  'hasta': 'Savitar', 'chitra': 'Vishwakarma', 'swati': 'Vayu',
  'vishakha': 'Indra-Agni', 'anuradha': 'Mitra', 'jyeshtha': 'Indra',
  'mula': 'Nirrti', 'purva-ashadha': 'Apas', 'uttara-ashadha': 'Vishvedevas',
  'shravana': 'Vishnu', 'dhanishtha': 'Eight Vasus', 'shatabhisha': 'Varuna',
  'purva-bhadrapada': 'Aja Ekapada', 'uttara-bhadrapada': 'Ahirbudhnya', 'revati': 'Pushan',
};

const NAKSHATRA_MESSAGE: Record<string, string> = {
  'ashwini': 'A day of swift beginnings. Start new ventures with confidence.',
  'bharani': 'Balance karma today. Reflect on actions and their consequences.',
  'krittika': 'Inner fire is strong. Use discernment and courage.',
  'rohini': 'Nurture creativity and beauty. A day favourable for arts.',
  'mrigashira': 'Seek knowledge with curiosity. Gentle exploration brings rewards.',
  'ardra': 'Transformation is at work. Embrace change with resilience.',
  'punarvasu': 'Renewal and return. Revisit unfinished projects with fresh eyes.',
  'pushya': 'Nourishment flows. A blessed day for worship and charity.',
  'ashlesha': 'Wisdom through intuition. Trust your inner knowing.',
  'magha': 'Connect with ancestors. Honor tradition and lineage.',
  'purva-phalguni': 'Joy and creativity abound. Celebrate relationships.',
  'uttara-phalguni': 'Service to others brings fulfillment today.',
  'hasta': 'Skillful hands achieve much. Focus on craftsmanship.',
  'chitra': 'Beauty and artistry shine. Create something meaningful.',
  'swati': 'Flexibility and independence serve you well today.',
  'vishakha': 'Determination leads to triumph. Stay focused on goals.',
  'anuradha': 'Friendship and devotion are highlighted today.',
  'jyeshtha': 'Leadership is tested. Act with dignity and authority.',
  'mula': 'Seek the root of things. Let go of what no longer serves.',
  'purva-ashadha': 'Invincibility through inner strength. Purify intentions.',
  'uttara-ashadha': 'Victory through righteousness. Uphold dharma.',
  'shravana': 'Listen deeply. Wisdom comes through hearing and learning.',
  'dhanishtha': 'Prosperity and abundance are favored. Share generously.',
  'shatabhisha': 'Healing and mysticism are prominent. Seek inner truth.',
  'purva-bhadrapada': 'Two paths meet. Choose wisdom over impulse.',
  'uttara-bhadrapada': 'Depth and stability. Rest in timeless wisdom.',
  'revati': 'Completion and compassion. Wrap up with grace.',
};

// ─── Main calculate function ──────────────────────────────────────────────────

export function calculatePanchanga(req: PanchangaRequest): PanchangaResponse {
  const date     = parseDate(req.date);
  const jd       = toJulianDay(date);

  const { vara, varaIndex } = calcVara(jd, req.timezone);
  const { tithi, tithiIndex, tithiPaksha } = calcTithi(jd);
  const { nakshatra, nakshatraIndex, nakshatraPada } = calcNakshatra(jd);
  const { yoga, yogaIndex } = calcYoga(jd);
  const { karana, karanaIndex } = calcKarana(jd);

  const { sunrise, sunset } = calcSunEvents(jd, req.latitude, req.longitude, req.timezone);
  const abhijit  = calcAbhijit(sunrise, sunset);
  const rahukalam = calcRahukalam(sunrise, sunset, varaIndex);

  // Yamagandam: 1.5h before Rahu Kalam by tradition
  const parseHHMM = (s: string) => {
    const [h, m] = s.split(':').map(Number);
    return h + m / 60;
  };
  const toHHMM = (hr: number) => {
    const h = Math.floor(((hr % 24) + 24) % 24);
    const m = Math.round(((hr % 1) * 60));
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  };
  const rahuStart = parseHHMM(rahukalam.start);
  const yamagandam = { start: toHHMM(rahuStart - 1.5), end: toHHMM(rahuStart) };
  const gulikakalam = { start: toHHMM(rahuStart + 1.5), end: toHHMM(rahuStart + 3) };

  const auspiciousYogaNames = ['siddha','siddhi','shubha','shiva','brahma','vriddhi','dhruva','priti','saubhagya'];
  const inauspiciousYogaNames = ['vishkumbha','atiganda','shula','ganda','vyaghata','vajra','vyatipata','parigha','vaidhriti'];
  const auspiciousYoga = auspiciousYogaNames.includes(yoga);

  return {
    date:            req.date,
    vara,
    varaIndex,
    tithi,
    tithiIndex,
    tithiPaksha,
    tithiEndTime:    '23:59',
    nakshatra,
    nakshatraIndex,
    nakshatraPada,
    nakshatraEndTime:'23:59',
    yoga,
    yogaIndex,
    yogaEndTime:     '23:59',
    karana,
    karanaIndex,
    sunrise,
    sunset,
    moonrise:        toHHMM(parseHHMM(sunrise) + 0.8),
    moonset:         toHHMM(parseHHMM(sunset) + 1.2),
    abhijitMuhurta:  abhijit,
    rahukalam,
    yamagandam,
    gulikakalam,
    durmuhurtam:     [],
    auspiciousYoga,
    festivals:       getFestivals(req.date),
    deityOfDay:      NAKSHATRA_DEITY[nakshatra] ?? 'Brahma',
    spiritualMessage: NAKSHATRA_MESSAGE[nakshatra] ?? 'May this day bring peace and wisdom.',
    region:          req.region,
  };
}
