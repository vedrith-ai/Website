import { generateAdminToken, verifyAdminToken, extractBearerToken } from '@/src/lib/auth/hmac';

// Inject test secret
beforeAll(() => {
  process.env.VEDRITH_ADMIN_TOKEN = 'test-secret-at-least-32-characters-long!!';
});
afterAll(() => { delete process.env.VEDRITH_ADMIN_TOKEN; });

describe('generateAdminToken', () => {
  test('returns a base64url string',     () => {
    const token = generateAdminToken();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);
  });
  test('different timestamps → different tokens', () => {
    const t1 = generateAdminToken(1000);
    const t2 = generateAdminToken(2000);
    expect(t1).not.toBe(t2);
  });
});

describe('verifyAdminToken', () => {
  test('valid fresh token verifies', () => {
    const token = generateAdminToken(Date.now());
    expect(verifyAdminToken(token)).toBe(true);
  });
  test('empty string fails',           () => expect(verifyAdminToken('')).toBe(false));
  test('garbage string fails',         () => expect(verifyAdminToken('not-a-token')).toBe(false));
  test('tampered token fails', () => {
    const token = generateAdminToken(Date.now());
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(verifyAdminToken(tampered)).toBe(false);
  });
  test('expired token fails', () => {
    // Token from 9 hours ago (beyond 8h TTL)
    const ts    = Date.now() - 9 * 60 * 60 * 1000;
    const token = generateAdminToken(ts);
    expect(verifyAdminToken(token)).toBe(false);
  });
});

describe('extractBearerToken', () => {
  test('extracts token from Bearer header', () => {
    expect(extractBearerToken('Bearer abc123')).toBe('abc123');
  });
  test('returns null for missing header',  () => expect(extractBearerToken(null)).toBeNull());
  test('returns null for non-Bearer',      () => expect(extractBearerToken('Basic abc')).toBeNull());
  test('returns null for empty Bearer',    () => expect(extractBearerToken('Bearer ')).toBeNull());
});
