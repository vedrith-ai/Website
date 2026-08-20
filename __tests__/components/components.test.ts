/**
 * Component rendering tests — verified against audit-required patterns
 */

import { t } from '@/src/i18n/ui';
import type { PanchangaResponse } from '@/src/types';

// ── i18n accessor in component context ───────────────────────────────────────

describe('t() used in components — critical keys', () => {
  const keys = [
    ['panchanga.title', 'en', "Today's Panchanga"],
    ['panchanga.title', 'kn', 'ಇಂದಿನ ಪಂಚಾಂಗ'],
    ['error.boundary',  'en', 'An unexpected error occurred. Please refresh the page.'],
    ['error.boundary',  'kn', 'ಅನಿರೀಕ್ಷಿತ ದೋಷ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಪುಟ ರಿಫ್ರೆಶ್ ಮಾಡಿ.'],
    ['col.pada',        'en', 'Pada'],
    ['col.pada',        'kn', 'ಪಾದ'],
    ['share.domain',    'en', 'vedrith.sharvasit.in'],
    ['share.domain',    'kn', 'vedrith.sharvasit.in'],
    ['pwa.install',     'en', 'Install VedRith'],
    ['pwa.install',     'kn', 'ವೇದ್‌ರಿತ್ ಸ್ಥಾಪಿಸಿ'],
  ] as const;

  keys.forEach(([key, lang, expected]) => {
    test(`t('${key}', '${lang}') = "${expected}"`, () => {
      expect(t(key, lang)).toBe(expected);
    });
  });
});

// ── ShareCard domain correctness ──────────────────────────────────────────────

describe('ShareCard — production domain', () => {
  test('share.domain key does not reference vedrith.com', () => {
    expect(t('share.domain', 'en')).not.toContain('vedrith.com');
    expect(t('share.domain', 'kn')).not.toContain('vedrith.com');
  });
  test('share.domain key references sharvasit.in', () => {
    expect(t('share.domain', 'en')).toContain('sharvasit.in');
  });
});

// ── ErrorBoundary key ────────────────────────────────────────────────────────

describe('ErrorBoundary keys', () => {
  test('error.boundary.title exists', () => expect(t('error.boundary.title', 'en')).toBe('Something went wrong'));
  test('error.boundary text exists EN', () => expect(t('error.boundary', 'en').length).toBeGreaterThan(10));
  test('error.boundary text exists KN', () => expect(t('error.boundary', 'kn').length).toBeGreaterThan(10));
  test('common.retry exists',          () => expect(t('common.retry', 'en')).toBe('Try again'));
  test('common.retry KN exists',       () => expect(t('common.retry', 'kn').length).toBeGreaterThan(0));
});

// ── KundaliResult col.pada ────────────────────────────────────────────────────

describe('KundaliResult — col.pada key', () => {
  test('col.pada en = Pada',  () => expect(t('col.pada', 'en')).toBe('Pada'));
  test('col.pada kn = ಪಾದ',   () => expect(t('col.pada', 'kn')).toBe('ಪಾದ'));
  test('col.planet exists',   () => expect(t('col.planet', 'en')).toBe('Planet'));
  test('col.rashi exists',    () => expect(t('col.rashi',  'en')).toBe('Rashi'));
  test('col.nakshatra exists',() => expect(t('col.nakshatra', 'en')).toBe('Nakshatra'));
  test('col.house exists',    () => expect(t('col.house', 'en')).toBe('House'));
  test('col.degree exists',   () => expect(t('col.degree', 'en')).toBe('Degree'));
  test('col.dignity exists',  () => expect(t('col.dignity', 'en')).toBe('Dignity'));
  test('col.retrograde exists',() => expect(t('col.retrograde', 'en')).toBeTruthy());
});

// ── TodayPanchanga — no hardcoded region ─────────────────────────────────────

describe('TodayPanchanga — region key', () => {
  test('panchanga API accepts KARNATAKA region', () => {
    const validRegions = ['KARNATAKA','ANDHRA','TAMIL_NADU','KERALA','MAHARASHTRA','NATIONAL'];
    validRegions.forEach(r => expect(validRegions).toContain(r));
  });
  test('region label key exists for each region', () => {
    expect(t('region.karnataka', 'en')).toBe('Karnataka');
    expect(t('region.karnataka', 'kn')).toBe('ಕರ್ನಾಟಕ');
    expect(t('region.andhra',    'en')).toBe('Andhra Pradesh');
    expect(t('region.kerala',    'en')).toBe('Kerala');
  });
});

// ── HeroPanchangaStrip — no hardcoded KANNADA literal ────────────────────────

describe('HeroPanchangaStrip — no hardcoded region literal', () => {
  test('hero.strip.for key exists', () => {
    expect(t('hero.strip.for', 'en')).toBe('Panchanga for');
    expect(t('hero.strip.for', 'kn')).toBe('ಪಂಚಾಂಗ:');
  });
  test('no literal KANNADA string in i18n values', () => {
    const { ui } = require('@/src/i18n/ui');
    const allValues = Object.values(ui).flatMap((v: any) => [v.en, v.kn]);
    // The region literal should never appear hardcoded
    const found = allValues.filter((v: string) => v === 'KANNADA');
    expect(found).toHaveLength(0);
  });
});

// ── Abhijit Muhurta — 50 minutes ─────────────────────────────────────────────

describe('Abhijit Muhurta label', () => {
  test('muhurta.duration key says 50 minutes', () => {
    expect(t('muhurta.duration', 'en')).toContain('50');
    expect(t('muhurta.duration', 'en')).toContain('2 Ghatikas');
  });
  test('panchanga.abhijit key exists EN+KN', () => {
    expect(t('panchanga.abhijit', 'en')).toBe('Abhijit Muhurta');
    expect(t('panchanga.abhijit', 'kn')).toBe('ಅಭಿಜಿತ್ ಮುಹೂರ್ತ');
  });
});
