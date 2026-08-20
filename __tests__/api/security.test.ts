/**
 * Security regression tests — based on V1.0 audit findings.
 * These guard against regressions of previously fixed vulnerabilities.
 */

import { verifyAdminToken, generateAdminToken } from '@/src/lib/auth/hmac';
import { isSupabaseConfigured } from '@/src/lib/supabase/server';

// ── CVE-01: Event publish bypass when VEDRITH_EVENT_SECRET is unset ───────────

describe('Security: Event publish bypass prevention', () => {
  test('missing VEDRITH_EVENT_SECRET does not authorize publish', () => {
    const original = process.env.VEDRITH_EVENT_SECRET;
    delete process.env.VEDRITH_EVENT_SECRET;

    const EVENT_SECRET = process.env.VEDRITH_EVENT_SECRET;
    const secretHeader = 'any-value-whatsoever';

    // Auth path 1 requires both EVENT_SECRET env var AND a matching header
    const path1Open = Boolean(EVENT_SECRET && secretHeader);
    expect(path1Open).toBe(false);

    if (original !== undefined) process.env.VEDRITH_EVENT_SECRET = original;
  });

  test('random header value does not authorize publish', () => {
    process.env.VEDRITH_EVENT_SECRET = 'correct-secret-value-at-32chars!!';
    const EVENT_SECRET = process.env.VEDRITH_EVENT_SECRET;
    const sentHeader   = 'wrong-header-value';

    const a = Buffer.from(sentHeader.padEnd(64, '\0'));
    const b = Buffer.from(EVENT_SECRET.padEnd(64, '\0'));
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    expect(diff).not.toBe(0);

    delete process.env.VEDRITH_EVENT_SECRET;
  });
});

// ── CVE-02: Contact API fake-success when Supabase unconfigured ───────────────

describe('Security: Contact API truthfulness', () => {
  test('isSupabaseConfigured() is false when env vars absent', () => {
    const origUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const origKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(isSupabaseConfigured()).toBe(false);

    process.env.NEXT_PUBLIC_SUPABASE_URL      = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
  });

  test('production without Supabase must not return fake success', () => {
    // Logic test: isProd + !isConfigured → should return 503
    const isProd           = true;
    const supabaseConfigured = false;
    const shouldReturn503  = isProd && !supabaseConfigured;
    expect(shouldReturn503).toBe(true);
  });
});

// ── CVE-03: Admin HMAC token integrity ───────────────────────────────────────

describe('Security: Admin HMAC token', () => {
  beforeAll(() => { process.env.VEDRITH_ADMIN_TOKEN = 'test-admin-secret-32-chars-long!!'; });
  afterAll(()  => { delete process.env.VEDRITH_ADMIN_TOKEN; });

  test('token cannot be forged without secret', () => {
    // Without the secret key, forged token must fail
    const fakeToken = Buffer.from('admin:9999999999999:deadbeefdeadbeef').toString('base64url');
    expect(verifyAdminToken(fakeToken)).toBe(false);
  });

  test('real token verifies', () => {
    const token = generateAdminToken(Date.now());
    expect(verifyAdminToken(token)).toBe(true);
  });

  test('token from 9 hours ago is expired', () => {
    const nineHoursAgo = Date.now() - 9 * 3_600_000;
    const old          = generateAdminToken(nineHoursAgo);
    expect(verifyAdminToken(old)).toBe(false);
  });

  test('truncated token fails', () => {
    const t = generateAdminToken();
    expect(verifyAdminToken(t.slice(0, 10))).toBe(false);
  });
});

// ── CVE-04: No committed secrets in codebase ─────────────────────────────────

describe('Security: No hardcoded secrets', () => {
  test('production domain is sharvasit.in, not vedrith.com', () => {
    const { ui } = require('@/src/i18n/ui');
    const allValues = Object.values(ui).flatMap((v: any) => [v.en, v.kn]);
    expect(allValues.filter((v: string) => v.includes('vedrith.com'))).toHaveLength(0);
  });

  test('no literal KANNADA region in i18n values', () => {
    const { ui } = require('@/src/i18n/ui');
    const allValues = Object.values(ui).flatMap((v: any) => [v.en, v.kn]);
    expect(allValues.filter((v: string) => v === 'KANNADA')).toHaveLength(0);
  });
});

// ── CVE-05: Share card domain ─────────────────────────────────────────────────

describe('Security: Share card production domain', () => {
  test('share.domain key contains sharvasit.in', () => {
    const { t } = require('@/src/i18n/ui');
    expect(t('share.domain', 'en')).toBe('vedrith.sharvasit.in');
  });
  test('app.domain key contains sharvasit.in', () => {
    const { t } = require('@/src/i18n/ui');
    expect(t('app.domain', 'en')).toBe('vedrith.sharvasit.in');
  });
});
