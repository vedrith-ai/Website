import { getRegionKey, setRegionKey, regionFromState, regionLabel, ALL_REGIONS } from '@/src/lib/utils/region';
import type { Region } from '@/src/types';

// Mock localStorage for jsdom
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => localStorageMock.clear());

describe('ALL_REGIONS', () => {
  test('has 6 entries', () => expect(ALL_REGIONS).toHaveLength(6));
  test('includes KARNATAKA', () => expect(ALL_REGIONS).toContain('KARNATAKA'));
  test('includes NATIONAL',  () => expect(ALL_REGIONS).toContain('NATIONAL'));
});

describe('getRegionKey', () => {
  test('defaults to KARNATAKA when nothing stored', () => {
    expect(getRegionKey()).toBe('KARNATAKA');
  });
  test('returns stored region', () => {
    localStorage.setItem('vedrith:region', 'KERALA');
    expect(getRegionKey()).toBe('KERALA');
  });
  test('ignores invalid stored value', () => {
    localStorage.setItem('vedrith:region', 'INVALID_REGION');
    expect(getRegionKey()).toBe('KARNATAKA');
  });
  test('returns ANDHRA when stored', () => {
    localStorage.setItem('vedrith:region', 'ANDHRA');
    expect(getRegionKey()).toBe('ANDHRA');
  });
});

describe('setRegionKey', () => {
  test('sets region in localStorage', () => {
    setRegionKey('MAHARASHTRA');
    expect(localStorage.getItem('vedrith:region')).toBe('MAHARASHTRA');
  });
  test('overwrites previous value', () => {
    setRegionKey('KERALA');
    setRegionKey('TAMIL_NADU');
    expect(localStorage.getItem('vedrith:region')).toBe('TAMIL_NADU');
  });
});

describe('regionFromState', () => {
  test('Karnataka → KARNATAKA',      () => expect(regionFromState('Karnataka')).toBe('KARNATAKA'));
  test('Andhra Pradesh → ANDHRA',    () => expect(regionFromState('Andhra Pradesh')).toBe('ANDHRA'));
  test('Telangana → ANDHRA',         () => expect(regionFromState('Telangana')).toBe('ANDHRA'));
  test('Tamil Nadu → TAMIL_NADU',    () => expect(regionFromState('Tamil Nadu')).toBe('TAMIL_NADU'));
  test('Kerala → KERALA',            () => expect(regionFromState('Kerala')).toBe('KERALA'));
  test('Maharashtra → MAHARASHTRA',  () => expect(regionFromState('Maharashtra')).toBe('MAHARASHTRA'));
  test('Goa → MAHARASHTRA',          () => expect(regionFromState('Goa')).toBe('MAHARASHTRA'));
  test('unknown → NATIONAL',         () => expect(regionFromState('Uttarakhand')).toBe('NATIONAL'));
});

describe('regionLabel', () => {
  const cases: [Region, string][] = [
    ['KARNATAKA',   'Karnataka'],
    ['ANDHRA',      'Andhra Pradesh'],
    ['TAMIL_NADU',  'Tamil Nadu'],
    ['KERALA',      'Kerala'],
    ['MAHARASHTRA', 'Maharashtra'],
    ['NATIONAL',    'National (India)'],
  ];
  cases.forEach(([region, label]) => {
    test(`${region} → "${label}"`, () => expect(regionLabel(region)).toBe(label));
  });
});
