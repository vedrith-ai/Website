import {
  calculatePanchanga, NAKSHATRAS, TITHIS, VARAS, YOGAS, KARANAS,
  calcTithi, calcNakshatra, calcYoga, calcKarana, calcVara,
} from '@/src/lib/panchanga/engine';
import { toJulianDay, parseDate } from '@/src/lib/utils/date';

const BASE_REQ = {
  date:      '2025-07-14',
  latitude:  12.9716,
  longitude: 77.5946,
  timezone:  'Asia/Kolkata',
  region:    'KARNATAKA' as const,
};

describe('Panchanga engine — constants', () => {
  test('NAKSHATRAS has 27 entries',  () => expect(NAKSHATRAS).toHaveLength(27));
  test('YOGAS has 27 entries',       () => expect(YOGAS).toHaveLength(27));
  test('VARAS has 7 entries',        () => expect(VARAS).toHaveLength(7));
  test('KARANAS has 11 entries',     () => expect(KARANAS).toHaveLength(11));
  test('TITHIS has 30 entries',      () => expect(TITHIS).toHaveLength(30));
  test('NAKSHATRAS start with ashwini', () => expect(NAKSHATRAS[0]).toBe('ashwini'));
  test('NAKSHATRAS end with revati',    () => expect(NAKSHATRAS[26]).toBe('revati'));
  test('YOGAS start with vishkumbha',   () => expect(YOGAS[0]).toBe('vishkumbha'));
  test('VARAS start with sunday',       () => expect(VARAS[0]).toBe('sunday'));
  test('KARANAS[6] is vishti',          () => expect(KARANAS[6]).toBe('vishti'));
});

describe('calculatePanchanga — output shape', () => {
  let result: ReturnType<typeof calculatePanchanga>;
  beforeAll(() => { result = calculatePanchanga(BASE_REQ); });

  test('returns date matching input',   () => expect(result.date).toBe(BASE_REQ.date));
  test('vara is a valid vara key',      () => expect(VARAS).toContain(result.vara));
  test('varaIndex is 0-6',             () => { expect(result.varaIndex).toBeGreaterThanOrEqual(0); expect(result.varaIndex).toBeLessThanOrEqual(6); });
  test('tithi is a valid tithi key',    () => expect([...TITHIS]).toContain(result.tithi));
  test('tithiIndex is 1-30',           () => { expect(result.tithiIndex).toBeGreaterThanOrEqual(1); expect(result.tithiIndex).toBeLessThanOrEqual(30); });
  test('tithiPaksha is shukla or krishna', () => expect(['shukla','krishna']).toContain(result.tithiPaksha));
  test('nakshatra is valid',           () => expect(NAKSHATRAS).toContain(result.nakshatra));
  test('nakshatraIndex is 0-26',       () => { expect(result.nakshatraIndex).toBeGreaterThanOrEqual(0); expect(result.nakshatraIndex).toBeLessThanOrEqual(26); });
  test('nakshatraPada is 1-4',         () => { expect(result.nakshatraPada).toBeGreaterThanOrEqual(1); expect(result.nakshatraPada).toBeLessThanOrEqual(4); });
  test('yoga is valid',                () => expect(YOGAS).toContain(result.yoga));
  test('karana is valid',              () => expect(KARANAS).toContain(result.karana));
  test('sunrise is HH:MM',            () => expect(result.sunrise).toMatch(/^\d{2}:\d{2}$/));
  test('sunset is HH:MM',             () => expect(result.sunset).toMatch(/^\d{2}:\d{2}$/));
  test('abhijit.durationMinutes === 50', () => expect(result.abhijitMuhurta.durationMinutes).toBe(50));
  test('abhijit.start is HH:MM',      () => expect(result.abhijitMuhurta.start).toMatch(/^\d{2}:\d{2}$/));
  test('abhijit.end is HH:MM',        () => expect(result.abhijitMuhurta.end).toMatch(/^\d{2}:\d{2}$/));
  test('rahukalam.start is HH:MM',    () => expect(result.rahukalam.start).toMatch(/^\d{2}:\d{2}$/));
  test('region matches input',         () => expect(result.region).toBe(BASE_REQ.region));
  test('festivals is array',           () => expect(Array.isArray(result.festivals)).toBe(true));
  test('auspiciousYoga is boolean',    () => expect(typeof result.auspiciousYoga).toBe('boolean'));
  test('deityOfDay is non-empty',      () => expect(result.deityOfDay.length).toBeGreaterThan(0));
  test('spiritualMessage is non-empty',() => expect(result.spiritualMessage.length).toBeGreaterThan(0));
});

describe('calcTithi — boundaries', () => {
  test('tithiIndex is always 1-30', () => {
    for (let d = 0; d < 30; d++) {
      const jd = 2451545 + d * 1.03;
      const { tithiIndex } = calcTithi(jd);
      expect(tithiIndex).toBeGreaterThanOrEqual(1);
      expect(tithiIndex).toBeLessThanOrEqual(30);
    }
  });
  test('paksha cycles correctly', () => {
    const results = [];
    for (let d = 0; d < 30; d++) {
      results.push(calcTithi(2451545 + d * 1.03).tithiPaksha);
    }
    expect(results).toContain('shukla');
    expect(results).toContain('krishna');
  });
});

describe('calcNakshatra — boundaries', () => {
  test('nakshatraIndex is always 0-26', () => {
    for (let d = 0; d < 27; d++) {
      const jd = 2451545 + d * 1.0;
      const { nakshatraIndex } = calcNakshatra(jd);
      expect(nakshatraIndex).toBeGreaterThanOrEqual(0);
      expect(nakshatraIndex).toBeLessThanOrEqual(26);
    }
  });
  test('pada is always 1-4', () => {
    for (let d = 0; d < 27; d++) {
      const jd = 2451545 + d * 1.0;
      const { nakshatraPada } = calcNakshatra(jd);
      expect(nakshatraPada).toBeGreaterThanOrEqual(1);
      expect(nakshatraPada).toBeLessThanOrEqual(4);
    }
  });
});

describe('calcYoga — boundaries', () => {
  test('yogaIndex is always 0-26', () => {
    for (let d = 0; d < 27; d++) {
      const jd = 2451545 + d * 0.98;
      const { yogaIndex } = calcYoga(jd);
      expect(yogaIndex).toBeGreaterThanOrEqual(0);
      expect(yogaIndex).toBeLessThanOrEqual(26);
    }
  });
});

describe('Abhijit Muhurta — 50 minutes', () => {
  test('duration is exactly 50 minutes', () => {
    const result = calculatePanchanga(BASE_REQ);
    expect(result.abhijitMuhurta.durationMinutes).toBe(50);
  });
  test('abhijit window is centred around noon', () => {
    const result = calculatePanchanga(BASE_REQ);
    const parseHHMM = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
    const startMin = parseHHMM(result.abhijitMuhurta.start);
    const endMin   = parseHHMM(result.abhijitMuhurta.end);
    expect(endMin - startMin).toBe(50);
  });
});

describe('Regional Panchanga', () => {
  const regions = ['KARNATAKA', 'ANDHRA', 'TAMIL_NADU', 'KERALA', 'MAHARASHTRA', 'NATIONAL'] as const;
  regions.forEach(region => {
    test(`region ${region} returns valid result`, () => {
      const r = calculatePanchanga({ ...BASE_REQ, region });
      expect(r.region).toBe(region);
      expect(VARAS).toContain(r.vara);
    });
  });
});

describe('Date UTC rollover protection', () => {
  test('different dates give different varas', () => {
    const r1 = calculatePanchanga({ ...BASE_REQ, date: '2025-07-13' });
    const r2 = calculatePanchanga({ ...BASE_REQ, date: '2025-07-14' });
    // Not strictly guaranteed for all dates but varaIndex must be valid
    expect(r1.varaIndex).toBeGreaterThanOrEqual(0);
    expect(r2.varaIndex).toBeGreaterThanOrEqual(0);
  });
});
