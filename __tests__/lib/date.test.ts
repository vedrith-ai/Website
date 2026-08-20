import {
  todayInTimezone, parseDate, addMinutes, toJulianDay, formatTime, formatLongDate,
} from '@/src/lib/utils/date';

describe('todayInTimezone', () => {
  test('returns YYYY-MM-DD format',     () => expect(todayInTimezone('Asia/Kolkata')).toMatch(/^\d{4}-\d{2}-\d{2}$/));
  test('returns YYYY-MM-DD for UTC',    () => expect(todayInTimezone('UTC')).toMatch(/^\d{4}-\d{2}-\d{2}$/));
  test('works for US/Eastern',          () => expect(todayInTimezone('America/New_York')).toMatch(/^\d{4}-\d{2}-\d{2}$/));
});

describe('parseDate', () => {
  test('parses 2025-07-14 correctly', () => {
    const d = parseDate('2025-07-14');
    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(6);   // 0-indexed
    expect(d.getUTCDate()).toBe(14);
  });
  test('returns a Date instance', () => expect(parseDate('2025-01-01')).toBeInstanceOf(Date));
});

describe('addMinutes', () => {
  test('adds 50 minutes', () => {
    const d = new Date('2025-07-14T10:00:00Z');
    const r = addMinutes(d, 50);
    expect(r.getTime() - d.getTime()).toBe(50 * 60 * 1000);
  });
  test('adds 0 minutes returns same time', () => {
    const d = new Date('2025-07-14T10:00:00Z');
    expect(addMinutes(d, 0).getTime()).toBe(d.getTime());
  });
  test('handles negative minutes', () => {
    const d = new Date('2025-07-14T10:00:00Z');
    const r = addMinutes(d, -30);
    expect(d.getTime() - r.getTime()).toBe(30 * 60 * 1000);
  });
});

describe('toJulianDay', () => {
  test('J2000 epoch ≈ 2451545', () => {
    const d = new Date('2000-01-01T12:00:00Z');
    expect(toJulianDay(d)).toBeCloseTo(2451545, 0);
  });
  test('returns a number',        () => expect(typeof toJulianDay(new Date())).toBe('number'));
  test('increases over time',     () => {
    const d1 = parseDate('2025-01-01');
    const d2 = parseDate('2025-01-02');
    expect(toJulianDay(d2)).toBeGreaterThan(toJulianDay(d1));
  });
  test('consecutive days differ by ~1', () => {
    const d1 = parseDate('2025-06-01');
    const d2 = parseDate('2025-06-02');
    expect(toJulianDay(d2) - toJulianDay(d1)).toBeCloseTo(1, 1);
  });
});
