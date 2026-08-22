/**
 * VedRith Kundali Calculator
 * Vedic birth chart (Janma Kundali) using whole-sign houses
 */

import type { KundaliRequest, KundaliResponse, PlanetPosition, HouseData } from '@/src/types';
import { toJulianDay, parseDate } from '@/src/lib/utils/date';

// ─── Constants ────────────────────────────────────────────────────────────────

const AYANAMSHA_J2000 = 23.85;
const AYANAMSHA_RATE  = 0.01396;

const RASHIS = [
  'mesha','vrishabha','mithuna','karka','simha','kanya',
  'tula','vrischika','dhanu','makara','kumbha','meena',
];

const NAKSHATRAS = [
  'ashwini','bharani','krittika','rohini','mrigashira','ardra',
  'punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni',
  'hasta','chitra','swati','vishakha','anuradha','jyeshtha',
  'mula','purva-ashadha','uttara-ashadha','shravana','dhanishtha',
  'shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati',
];

// Dasha years per planet (Vimshottari)
const DASHA_YEARS: Record<string, number> = {
  ketu:6, shukra:20, surya:6, chandra:10, mangala:7,
  rahu:18, guru:16, shani:19, budha:17,
};

// Dasha sequence
const DASHA_SEQUENCE = ['ketu','shukra','surya','chandra','mangala','rahu','guru','shani','budha'];

// Exaltation / debilitation rashis (0-based)
const EXALTATION:    Record<string, number> = {
  surya:0, chandra:1, mangala:9, budha:5, guru:3, shukra:11, shani:6, rahu:1, ketu:7,
};
const DEBILITATION:  Record<string, number> = {
  surya:6, chandra:7, mangala:3, budha:11, guru:9, shukra:5, shani:0, rahu:7, ketu:1,
};
const OWN_SIGN: Record<string, number[]> = {
  surya:[4], chandra:[3], mangala:[0,7], budha:[5,2], guru:[8,11], shukra:[1,6], shani:[9,10],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function normalize360(d: number): number { return ((d % 360) + 360) % 360; }

function getAyanamsha(jd: number): number {
  return AYANAMSHA_J2000 + AYANAMSHA_RATE * ((jd - 2451545) / 365.25);
}

function toSidereal(tropical: number, jd: number): number {
  return normalize360(tropical - getAyanamsha(jd));
}

// ─── Mean planetary longitudes (tropical) ────────────────────────────────────

function sunLongitude(T: number): number {
  const L0 = 280.46646 + 36000.76983 * T;
  const M  = 357.52911 + 35999.05029 * T;
  const C  = 1.914602 * Math.sin(M * Math.PI/180) + 0.019993 * Math.sin(2*M*Math.PI/180);
  return normalize360(L0 + C);
}

function moonLongitude(T: number): number {
  const L0 = 218.3164477 + 481267.88123421 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const D  = 297.8501921 + 445267.1114034 * T;
  const correction =
    6.288774 * Math.sin(Mp*Math.PI/180) +
    1.274027 * Math.sin((2*D - Mp)*Math.PI/180) +
    0.658314 * Math.sin(2*D*Math.PI/180);
  return normalize360(L0 + correction);
}

function planetLongitude(planet: string, T: number): number {
  // Mean longitudes — sufficient for natal charts
  const mean: Record<string, [number,number]> = {
    mangala:  [355.45332, 19140.30268],
    budha:    [252.25084, 149472.67411],
    guru:     [34.89491,  3034.74612],
    shukra:   [181.97980, 58517.81538],
    shani:    [50.07444,  1222.11379],
  };
  if (planet in mean) {
    const [l0, rate] = mean[planet];
    return normalize360(l0 + rate * T);
  }
  if (planet === 'surya')  return sunLongitude(T);
  if (planet === 'chandra') return moonLongitude(T);
  if (planet === 'rahu')   return normalize360(125.04452 - 1934.13626 * T);
  if (planet === 'ketu')   return normalize360(125.04452 - 1934.13626 * T + 180);
  return 0;
}

// ─── Ascendant calculation ────────────────────────────────────────────────────

function calcLagna(jd: number, lat: number, lon: number): number {
  const T     = (jd - 2451545) / 36525;
  const LST   = 100.4606184 + 36000.77004 * T + lon + 15 * ((jd - Math.floor(jd)) * 24 - 12);
  const obl   = 23.439291 - 0.013004 * T;
  const LSTrad = LST * Math.PI / 180;
  const oblRad = obl * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const tanAsc = Math.cos(LSTrad) / (-Math.sin(oblRad) * Math.tan(latRad) - Math.cos(oblRad) * Math.sin(LSTrad));
  let asc = Math.atan(tanAsc) * 180 / Math.PI;
  if (Math.cos(LSTrad) < 0) asc += 180;
  asc = normalize360(asc);
  return toSidereal(asc, jd);
}

// ─── Dignity ──────────────────────────────────────────────────────────────────

function getDignity(
  planet: string, rashiIdx: number
): 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' {
  if (EXALTATION[planet]   === rashiIdx) return 'exalted';
  if (DEBILITATION[planet] === rashiIdx) return 'debilitated';
  if (OWN_SIGN[planet]?.includes(rashiIdx)) return 'own';
  return 'neutral';
}

// ─── Dasha balance ────────────────────────────────────────────────────────────

function calcDashaBalance(moonLong: number, _jd: number): { planet: string; yearsRemaining: number } {
  const nakshatraIdx = Math.floor(moonLong / (360/27));
  const dashaLord    = DASHA_SEQUENCE[nakshatraIdx % 9];
  const dashaYears   = DASHA_YEARS[dashaLord];
  const posInNakshatra = (moonLong % (360/27)) / (360/27);
  const yearsRemaining = dashaYears * (1 - posInNakshatra);
  return { planet: dashaLord, yearsRemaining: Math.round(yearsRemaining * 10) / 10 };
}

// ─── Yoga detection ──────────────────────────────────────────────────────────

function detectYogas(planets: PlanetPosition[]): string[] {
  const yogas: string[] = [];
  const get = (name: string) => planets.find(p => p.planet === name);
  const sun  = get('surya');
  const moon = get('chandra');
  const guru = get('guru');

  // Gajakesari Yoga: Moon and Jupiter in kendras from each other
  if (moon && guru) {
    const diff = Math.abs(moon.rashiIndex - guru.rashiIndex);
    if ([0,3,6,9].includes(diff) || [0,3,6,9].includes(12-diff)) {
      yogas.push('Gajakesari Yoga');
    }
  }
  // Budha-Aditya Yoga: Mercury conjunct Sun
  const budha = get('budha');
  if (sun && budha && Math.abs(sun.rashiIndex - budha.rashiIndex) <= 1) {
    yogas.push('Budha-Aditya Yoga');
  }
  // Chandra-Mangal Yoga: Moon conjunct Mars
  const mangala = get('mangala');
  if (moon && mangala && moon.rashiIndex === mangala.rashiIndex) {
    yogas.push('Chandra-Mangal Yoga');
  }
  return yogas;
}

// ─── Main calculate function ──────────────────────────────────────────────────

export function calculateKundali(req: KundaliRequest): KundaliResponse {
  const [h, m] = req.tob.split(':').map(Number);
  const date   = parseDate(req.dob);
  date.setUTCHours(h - 5, m - 30, 0, 0); // convert IST to UTC approximately
  const jd = toJulianDay(date);
  const T  = (jd - 2451545) / 36525;

  // Lagna
  const lagnaLong  = calcLagna(jd, req.latitude, req.longitude);
  const lagnaIdx   = Math.floor(lagnaLong / 30);
  const lagnaRashi = RASHIS[lagnaIdx];

  // Moon for Nakshatra Lagna
  const moonLong     = toSidereal(moonLongitude(T), jd);
  const moonNakIdx   = Math.floor(moonLong / (360/27));
  const nakshatraLagna = NAKSHATRAS[moonNakIdx];

  // All planets
  const planetNames = ['surya','chandra','mangala','budha','guru','shukra','shani','rahu','ketu'];
  const planets: PlanetPosition[] = planetNames.map(name => {
    const tropLong  = planetLongitude(name, T);
    const sidLong   = toSidereal(tropLong, jd);
    const rashiIdx  = Math.floor(sidLong / 30);
    const degree    = sidLong % 30;
    const nakIdx    = Math.floor(sidLong / (360/27));
    const nakSpan   = 360/27;
    const pada      = Math.floor((sidLong % nakSpan) / (nakSpan/4)) + 1;
    const isRetro   = ['shani','guru','mangala','budha','shukra'].includes(name) && T > 0;
    const house     = ((rashiIdx - lagnaIdx + 12) % 12) + 1;
    return {
      planet:     name,
      longitude:  Math.round(sidLong * 100) / 100,
      rashi:      RASHIS[rashiIdx],
      rashiIndex: rashiIdx,
      nakshatra:  NAKSHATRAS[nakIdx % 27],
      pada:       Math.min(pada, 4),
      degree:     Math.round(degree * 100) / 100,
      isRetrograde: isRetro,
      house,
      dignity:    getDignity(name, rashiIdx),
    };
  });

  // Whole-sign houses
  const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => {
    const houseRashiIdx = (lagnaIdx + i) % 12;
    const planetsInHouse = planets
      .filter(p => p.house === i + 1)
      .map(p => p.planet);
    return {
      house:     i + 1,
      rashi:     RASHIS[houseRashiIdx],
      rashiIndex: houseRashiIdx,
      degree:    lagnaLong % 30,
      planets:   planetsInHouse,
    };
  });

  const dashaBalance = calcDashaBalance(moonLong, jd);
  const yogas        = detectYogas(planets);

  return {
    name:          req.name,
    dob:           req.dob,
    tob:           req.tob,
    pob:           req.pob,
    lagna:         lagnaRashi,
    lagnaIndex:    lagnaIdx,
    lagnaRashi,
    nakshatraLagna,
    planets,
    houses,
    dashaBalance,
    yogas,
  };
}
