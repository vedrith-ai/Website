/**
 * Extended tests — Vedic almanac correctness, utility coverage,
 * API validation logic, and i18n completeness checks.
 */

import { calculatePanchanga, NAKSHATRAS, YOGAS, VARAS, KARANAS, TITHIS } from '@/src/lib/panchanga/engine';
import { calculateKundali } from '@/src/lib/kundali/calculator';
import { t, ui } from '@/src/i18n/ui';
import { todayInTimezone, parseDate, addMinutes, toJulianDay } from '@/src/lib/utils/date';
import { regionFromState, regionLabel, ALL_REGIONS } from '@/src/lib/utils/region';
import { generateAdminToken, verifyAdminToken } from '@/src/lib/auth/hmac';
import { isSupabaseConfigured } from '@/src/lib/supabase/server';

const BASE = {
  date: '2025-08-19', latitude: 12.9716, longitude: 77.5946,
  timezone: 'Asia/Kolkata', region: 'KARNATAKA' as const,
};

// ── Panchanga — extended date coverage ───────────────────────────────────────

describe('Panchanga — extended date range', () => {
  const dates = [
    '2025-01-01','2025-03-25','2025-06-21','2025-09-15',
    '2025-10-20','2025-12-31','2026-01-14','2026-03-01',
  ];
  dates.forEach(date => {
    test(`calculates correctly for ${date}`, () => {
      const r = calculatePanchanga({ ...BASE, date });
      expect(VARAS).toContain(r.vara);
      expect(NAKSHATRAS).toContain(r.nakshatra);
      expect([...TITHIS]).toContain(r.tithi);
      expect(YOGAS).toContain(r.yoga);
      expect(KARANAS).toContain(r.karana);
      expect(r.abhijitMuhurta.durationMinutes).toBe(50);
    });
  });
});

// ── Panchanga — different locations ──────────────────────────────────────────

describe('Panchanga — location variations', () => {
  const locations = [
    { name: 'Mumbai',  latitude: 19.076,  longitude: 72.877  },
    { name: 'Delhi',   latitude: 28.613,  longitude: 77.209  },
    { name: 'Chennai', latitude: 13.082,  longitude: 80.270  },
    { name: 'Kolkata', latitude: 22.572,  longitude: 88.363  },
    { name: 'Kochi',   latitude: 9.939,   longitude: 76.267  },
  ];
  locations.forEach(({ name, latitude, longitude }) => {
    test(`${name}: sunrise < sunset`, () => {
      const r = calculatePanchanga({ ...BASE, latitude, longitude });
      const parseT = (s: string) => { const [h,m] = s.split(':').map(Number); return h*60+m; };
      expect(parseT(r.sunrise)).toBeLessThan(parseT(r.sunset));
    });
    test(`${name}: abhijit inside daylight`, () => {
      const r = calculatePanchanga({ ...BASE, latitude, longitude });
      const parseT = (s: string) => { const [h,m] = s.split(':').map(Number); return h*60+m; };
      expect(parseT(r.abhijitMuhurta.start)).toBeGreaterThanOrEqual(parseT(r.sunrise));
      expect(parseT(r.abhijitMuhurta.end)).toBeLessThanOrEqual(parseT(r.sunset) + 30);
    });
  });
});

// ── Kundali — multiple birth data ─────────────────────────────────────────────

describe('Kundali — multiple birth dates', () => {
  const births = [
    { dob:'1985-01-15', tob:'06:30', pob:'Delhi',    lat:28.613, lon:77.209 },
    { dob:'1990-06-21', tob:'12:00', pob:'Mumbai',   lat:19.076, lon:72.877 },
    { dob:'2000-12-31', tob:'23:45', pob:'Chennai',  lat:13.082, lon:80.270 },
    { dob:'1975-03-08', tob:'04:15', pob:'Kolkata',  lat:22.572, lon:88.363 },
  ];
  births.forEach(({ dob, tob, pob, lat, lon }) => {
    test(`${pob} ${dob}: valid lagna`, () => {
      const r = calculateKundali({ name:'Test', dob, tob, pob, latitude:lat, longitude:lon, timezone:'Asia/Kolkata' });
      expect(r.lagnaIndex).toBeGreaterThanOrEqual(0);
      expect(r.lagnaIndex).toBeLessThanOrEqual(11);
    });
    test(`${pob} ${dob}: 9 planets`, () => {
      const r = calculateKundali({ name:'Test', dob, tob, pob, latitude:lat, longitude:lon, timezone:'Asia/Kolkata' });
      expect(r.planets).toHaveLength(9);
    });
    test(`${pob} ${dob}: dashaBalance >= 0`, () => {
      const r = calculateKundali({ name:'Test', dob, tob, pob, latitude:lat, longitude:lon, timezone:'Asia/Kolkata' });
      expect(r.dashaBalance.yearsRemaining).toBeGreaterThanOrEqual(0);
    });
  });
});

// ── i18n — all 27 Yoga names have EN+KN ──────────────────────────────────────

describe('i18n — all Yoga names', () => {
  const yogas = [
    'vishkumbha','priti','ayushman','saubhagya','shobhana','atiganda',
    'sukarma','dhriti','shula','ganda','vriddhi','dhruva','vyaghata',
    'harshana','vajra','siddhi','vyatipata','variyana','parigha','shiva',
    'siddha','sadhya','shubha','shukla','brahma','mahendra','vaidhriti',
  ];
  yogas.forEach(y => {
    test(`yoga.${y} has EN`, () => expect(ui[`yoga.${y}`]?.en.length).toBeGreaterThan(0));
    test(`yoga.${y} has KN`, () => expect(ui[`yoga.${y}`]?.kn.length).toBeGreaterThan(0));
  });
});

// ── i18n — all 11 Karana names ────────────────────────────────────────────────

describe('i18n — all Karana names', () => {
  const karanas = ['bava','balava','kaulava','taitila','garaja','vanija','vishti','shakuni','chatushpada','nagava','kimstughna'];
  karanas.forEach(k => {
    test(`karana.${k} EN+KN`, () => {
      expect(ui[`karana.${k}`]?.en.length).toBeGreaterThan(0);
      expect(ui[`karana.${k}`]?.kn.length).toBeGreaterThan(0);
    });
  });
});

// ── i18n — all 7 Vara names ───────────────────────────────────────────────────

describe('i18n — all Vara names', () => {
  ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].forEach(v => {
    test(`vara.${v} has KN`, () => expect(ui[`vara.${v}`]?.kn.length).toBeGreaterThan(0));
  });
});

// ── Date utils — edge cases ───────────────────────────────────────────────────

describe('Date utils — edge cases', () => {
  test('Julian Day is monotonically increasing', () => {
    const d1 = parseDate('2025-12-31');
    const d2 = parseDate('2026-01-01');
    expect(toJulianDay(d2)).toBeGreaterThan(toJulianDay(d1));
  });
  test('addMinutes by 0 is idempotent', () => {
    const d = new Date();
    expect(addMinutes(d, 0).getTime()).toBe(d.getTime());
  });
  test('todayInTimezone returns valid date string for IST', () => {
    const dt = todayInTimezone('Asia/Kolkata');
    const [y, m, dd] = dt.split('-').map(Number);
    expect(y).toBeGreaterThan(2024);
    expect(m).toBeGreaterThanOrEqual(1);
    expect(m).toBeLessThanOrEqual(12);
    expect(dd).toBeGreaterThanOrEqual(1);
    expect(dd).toBeLessThanOrEqual(31);
  });
  test('parseDate produces midnight UTC', () => {
    const d = parseDate('2025-07-14');
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
  });
});

// ── Region utils — extended ───────────────────────────────────────────────────

describe('Region utils — extended', () => {
  test('ALL_REGIONS contains exactly 6 regions', () => expect(ALL_REGIONS).toHaveLength(6));
  test('KARNATAKA label is Karnataka',            () => expect(regionLabel('KARNATAKA')).toBe('Karnataka'));
  test('NATIONAL label is National (India)',      () => expect(regionLabel('NATIONAL')).toBe('National (India)'));
  test('all regions have a label',               () => {
    ALL_REGIONS.forEach(r => expect(regionLabel(r).length).toBeGreaterThan(0));
  });
  test('unknown state falls back to NATIONAL',   () => expect(regionFromState('Manipur')).toBe('NATIONAL'));
  test('Goa maps to MAHARASHTRA',                () => expect(regionFromState('Goa')).toBe('MAHARASHTRA'));
});

// ── Auth — edge cases ─────────────────────────────────────────────────────────

describe('Auth — edge cases', () => {
  beforeAll(() => { process.env.VEDRITH_ADMIN_TOKEN = 'edge-test-token-at-least-32-chars!!'; });
  afterAll(()  => { delete process.env.VEDRITH_ADMIN_TOKEN; });

  test('tokens generated ms apart are different', () => {
    const t1 = generateAdminToken(Date.now());
    const t2 = generateAdminToken(Date.now() + 1);
    expect(t1).not.toBe(t2);
  });
  test('verifyAdminToken handles null-like input', () => {
    expect(verifyAdminToken('')).toBe(false);
    expect(verifyAdminToken('   ')).toBe(false);
  });
  test('base64url encoded token verifies', () => {
    const token = generateAdminToken(Date.now());
    expect(/^[A-Za-z0-9_-]+$/.test(token)).toBe(true);
    expect(verifyAdminToken(token)).toBe(true);
  });
});

// ── Supabase — configuration states ──────────────────────────────────────────

describe('Supabase — configuration states', () => {
  test('returns false with missing URL',  () => {
    const orig = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(isSupabaseConfigured()).toBe(false);
    process.env.NEXT_PUBLIC_SUPABASE_URL = orig;
  });
  test('returns false with missing KEY',  () => {
    const orig = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(isSupabaseConfigured()).toBe(false);
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = orig;
  });
  test('returns false with empty strings', () => {
    const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL      = '';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';
    expect(isSupabaseConfigured()).toBe(false);
    process.env.NEXT_PUBLIC_SUPABASE_URL      = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
  });
});

// ── Panchanga festivals ───────────────────────────────────────────────────────

describe('Panchanga — festival detection', () => {
  test('Jan 14 returns Sankranti',   () => expect(calculatePanchanga({ ...BASE, date: '2025-01-14' }).festivals).toContain('Makara Sankranti'));
  test('Aug 15 returns Independence',() => expect(calculatePanchanga({ ...BASE, date: '2025-08-15' }).festivals).toContain('Independence Day'));
  test('Oct 02 returns Gandhi',      () => expect(calculatePanchanga({ ...BASE, date: '2025-10-02' }).festivals).toContain('Gandhi Jayanti'));
  test('Dec 25 returns Christmas',   () => expect(calculatePanchanga({ ...BASE, date: '2025-12-25' }).festivals).toContain('Christmas'));
  test('normal date returns array',  () => expect(Array.isArray(calculatePanchanga({ ...BASE, date: '2025-04-10' }).festivals)).toBe(true));
});

// ── i18n — graha + rashi completeness ────────────────────────────────────────

describe('i18n — Graha completeness', () => {
  ['surya','chandra','mangala','budha','guru','shukra','shani','rahu','ketu'].forEach(g => {
    test(`graha.${g} has EN+KN`, () => {
      expect(ui[`graha.${g}`]?.en.length).toBeGreaterThan(0);
      expect(ui[`graha.${g}`]?.kn.length).toBeGreaterThan(0);
    });
  });
});

describe('i18n — Rashi completeness', () => {
  ['mesha','vrishabha','mithuna','karka','simha','kanya','tula','vrischika','dhanu','makara','kumbha','meena'].forEach(r => {
    test(`rashi.${r} has EN+KN`, () => {
      expect(ui[`rashi.${r}`]?.en.length).toBeGreaterThan(0);
      expect(ui[`rashi.${r}`]?.kn.length).toBeGreaterThan(0);
    });
  });
});
