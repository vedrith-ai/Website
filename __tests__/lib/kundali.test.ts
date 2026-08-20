import { calculateKundali } from '@/src/lib/kundali/calculator';
import type { KundaliRequest } from '@/src/types';

const BASE_REQ: KundaliRequest = {
  name:      'Test User',
  dob:       '1990-03-15',
  tob:       '10:30',
  pob:       'Bangalore, India',
  latitude:  12.9716,
  longitude: 77.5946,
  timezone:  'Asia/Kolkata',
};

const RASHIS = [
  'mesha','vrishabha','mithuna','karka','simha','kanya',
  'tula','vrischika','dhanu','makara','kumbha','meena',
];
const NAKSHATRAS_27 = [
  'ashwini','bharani','krittika','rohini','mrigashira','ardra',
  'punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni',
  'hasta','chitra','swati','vishakha','anuradha','jyeshtha',
  'mula','purva-ashadha','uttara-ashadha','shravana','dhanishtha',
  'shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati',
];
const PLANETS_9 = ['surya','chandra','mangala','budha','guru','shukra','shani','rahu','ketu'];
const DIGNITIES = ['exalted','own','friendly','neutral','enemy','debilitated'];

describe('calculateKundali — output shape', () => {
  let result: ReturnType<typeof calculateKundali>;
  beforeAll(() => { result = calculateKundali(BASE_REQ); });

  test('name matches input',            () => expect(result.name).toBe(BASE_REQ.name));
  test('dob matches input',             () => expect(result.dob).toBe(BASE_REQ.dob));
  test('tob matches input',             () => expect(result.tob).toBe(BASE_REQ.tob));
  test('pob matches input',             () => expect(result.pob).toBe(BASE_REQ.pob));
  test('lagna is a valid rashi',        () => expect(RASHIS).toContain(result.lagna));
  test('lagnaIndex is 0-11',            () => { expect(result.lagnaIndex).toBeGreaterThanOrEqual(0); expect(result.lagnaIndex).toBeLessThanOrEqual(11); });
  test('lagnaRashi matches lagna',      () => expect(result.lagnaRashi).toBe(result.lagna));
  test('nakshatraLagna is valid',       () => expect(NAKSHATRAS_27).toContain(result.nakshatraLagna));
  test('planets has 9 entries',         () => expect(result.planets).toHaveLength(9));
  test('houses has 12 entries',         () => expect(result.houses).toHaveLength(12));
  test('dashaBalance.planet is valid',  () => expect(PLANETS_9).toContain(result.dashaBalance.planet));
  test('dashaBalance.yearsRemaining >= 0', () => expect(result.dashaBalance.yearsRemaining).toBeGreaterThanOrEqual(0));
  test('yogas is an array',             () => expect(Array.isArray(result.yogas)).toBe(true));
});

describe('Planet positions', () => {
  let planets: ReturnType<typeof calculateKundali>['planets'];
  beforeAll(() => { planets = calculateKundali(BASE_REQ).planets; });

  test('all 9 planets present', () => {
    const names = planets.map(p => p.planet);
    PLANETS_9.forEach(p => expect(names).toContain(p));
  });

  PLANETS_9.forEach(name => {
    describe(`${name}`, () => {
      test('rashiIndex is 0-11', () => {
        const p = planets.find(pl => pl.planet === name)!;
        expect(p.rashiIndex).toBeGreaterThanOrEqual(0);
        expect(p.rashiIndex).toBeLessThanOrEqual(11);
      });
      test('rashi is valid', () => {
        const p = planets.find(pl => pl.planet === name)!;
        expect(RASHIS).toContain(p.rashi);
      });
      test('nakshatra is valid', () => {
        const p = planets.find(pl => pl.planet === name)!;
        expect(NAKSHATRAS_27).toContain(p.nakshatra);
      });
      test('pada is 1-4', () => {
        const p = planets.find(pl => pl.planet === name)!;
        expect(p.pada).toBeGreaterThanOrEqual(1);
        expect(p.pada).toBeLessThanOrEqual(4);
      });
      test('house is 1-12', () => {
        const p = planets.find(pl => pl.planet === name)!;
        expect(p.house).toBeGreaterThanOrEqual(1);
        expect(p.house).toBeLessThanOrEqual(12);
      });
      test('dignity is valid', () => {
        const p = planets.find(pl => pl.planet === name)!;
        expect(DIGNITIES).toContain(p.dignity);
      });
      test('isRetrograde is boolean', () => {
        const p = planets.find(pl => pl.planet === name)!;
        expect(typeof p.isRetrograde).toBe('boolean');
      });
    });
  });
});

describe('col.pada — correct key used', () => {
  test('pada field present on each planet', () => {
    const { planets } = calculateKundali(BASE_REQ);
    planets.forEach(p => {
      expect(p).toHaveProperty('pada');
      expect(typeof p.pada).toBe('number');
    });
  });
});

describe('Houses', () => {
  let houses: ReturnType<typeof calculateKundali>['houses'];
  beforeAll(() => { houses = calculateKundali(BASE_REQ).houses; });

  test('12 houses numbered 1-12', () => {
    houses.forEach((h, i) => expect(h.house).toBe(i + 1));
  });
  test('all house rashis valid', () => {
    houses.forEach(h => expect(RASHIS).toContain(h.rashi));
  });
  test('rashiIndex is 0-11 for each house', () => {
    houses.forEach(h => {
      expect(h.rashiIndex).toBeGreaterThanOrEqual(0);
      expect(h.rashiIndex).toBeLessThanOrEqual(11);
    });
  });
  test('planets in houses is array', () => {
    houses.forEach(h => expect(Array.isArray(h.planets)).toBe(true));
  });
});
