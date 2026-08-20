import { ui, t, getKeys, getMissingKeys } from '@/src/i18n/ui';

describe('i18n — key integrity', () => {
  test('ui object is defined',      () => expect(ui).toBeDefined());
  test('has at least 478 keys',     () => expect(Object.keys(ui).length).toBeGreaterThanOrEqual(478));
  test('getMissingKeys(kn) === 0',  () => expect(getMissingKeys('kn').length).toBe(0));
  test('getMissingKeys(en) === 0',  () => expect(getMissingKeys('en').length).toBe(0));
  test('no duplicate keys',         () => {
    const keys = getKeys();
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });
});

describe('i18n — t() accessor', () => {
  test('t() returns English for en',       () => expect(t('panchanga.title', 'en')).toBe("Today's Panchanga"));
  test('t() returns Kannada for kn',       () => expect(t('panchanga.title', 'kn')).toBe('ಇಂದಿನ ಪಂಚಾಂಗ'));
  test('t() returns key for missing key',  () => expect(t('this.key.does.not.exist', 'en')).toBe('this.key.does.not.exist'));
  test('t() defaults to en',               () => expect(t('panchanga.vara')).toBe('Vara (Weekday)'));
});

describe('i18n — critical keys present', () => {
  const REQUIRED = [
    'error.boundary',
    'col.pada',
    'panchanga.title',
    'panchanga.abhijit',
    'kundali.title',
    'nav.home',
    'nav.panchanga',
    'common.loading',
    'common.error',
    'vara.sunday','vara.monday','vara.tuesday','vara.wednesday','vara.thursday','vara.friday','vara.saturday',
    'nakshatra.ashwini','nakshatra.revati','nakshatra.pushya',
    'tithi.ekadashi','tithi.purnima','tithi.amavasya',
    'yoga.siddha','yoga.vishkumbha','yoga.vaidhriti',
    'karana.vishti','karana.bava',
    'rashi.mesha','rashi.meena',
    'graha.surya','graha.chandra','graha.rahu','graha.ketu',
    'share.domain',
    'pwa.install',
    'settings.title',
    'contact.title',
    'about.title',
    '404.title',
  ];

  REQUIRED.forEach(key => {
    test(`key "${key}" exists in EN`, () => expect(ui[key]?.en).toBeTruthy());
    test(`key "${key}" exists in KN`, () => expect(ui[key]?.kn).toBeTruthy());
  });
});

describe('i18n — nakshatra deity keys', () => {
  const nakshatras = [
    'ashwini','bharani','krittika','rohini','mrigashira','ardra',
    'punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni',
    'hasta','chitra','swati','vishakha','anuradha','jyeshtha',
    'mula','purva-ashadha','uttara-ashadha','shravana','dhanishtha',
    'shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati',
  ];
  nakshatras.forEach(n => {
    test(`nakshatra.${n} has EN+KN`, () => {
      expect(ui[`nakshatra.${n}`]?.en).toBeTruthy();
      expect(ui[`nakshatra.${n}`]?.kn).toBeTruthy();
    });
    test(`nakshatra.deity.${n} has EN+KN`, () => {
      expect(ui[`nakshatra.deity.${n}`]?.en).toBeTruthy();
      expect(ui[`nakshatra.deity.${n}`]?.kn).toBeTruthy();
    });
  });
});

describe('i18n — share domain key correct', () => {
  test('share.domain equals vedrith.sharvasit.in', () => {
    expect(ui['share.domain'].en).toBe('vedrith.sharvasit.in');
    expect(ui['share.domain'].kn).toBe('vedrith.sharvasit.in');
  });
  test('no references to vedrith.com', () => {
    const allValues = Object.values(ui).flatMap(v => [v.en, v.kn]);
    const found = allValues.filter(v => v.includes('vedrith.com'));
    expect(found).toHaveLength(0);
  });
});
