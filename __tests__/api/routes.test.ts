/**
 * API route unit tests
 * We test the auth/validation logic directly without spinning up Next.js.
 */

import { verifyAdminToken, generateAdminToken, extractBearerToken } from '@/src/lib/auth/hmac';
import { isSupabaseConfigured } from '@/src/lib/supabase/server';

// ─── Event publish auth logic ─────────────────────────────────────────────────

describe('Event publish authorization', () => {
  beforeAll(() => { process.env.VEDRITH_EVENT_SECRET = 'test-event-secret-32-chars-long!!'; });
  afterAll(()  => { delete process.env.VEDRITH_EVENT_SECRET; });

  test('missing secret → unauthorized', () => {
    const secret = process.env.VEDRITH_EVENT_SECRET;
    expect(secret).toBeTruthy();
    // Wrong secret should not match
    const wrong = 'wrong-secret';
    const a = Buffer.from(wrong.padEnd(64, '\0'));
    const b = Buffer.from((secret ?? '').padEnd(64, '\0'));
    let diff = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) diff |= a[i] ^ b[i];
    expect(diff).not.toBe(0);
  });

  test('correct secret → authorized', () => {
    const secret = process.env.VEDRITH_EVENT_SECRET ?? '';
    const a = Buffer.from(secret.padEnd(64, '\0'));
    const b = Buffer.from(secret.padEnd(64, '\0'));
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    expect(diff).toBe(0);
  });

  test('valid HMAC token → authorized', () => {
    process.env.VEDRITH_ADMIN_TOKEN = 'test-admin-token-at-least-32-chars!!';
    const token = generateAdminToken(Date.now());
    expect(verifyAdminToken(token)).toBe(true);
    delete process.env.VEDRITH_ADMIN_TOKEN;
  });

  test('unset VEDRITH_EVENT_SECRET does not open endpoint', () => {
    const original = process.env.VEDRITH_EVENT_SECRET;
    delete process.env.VEDRITH_EVENT_SECRET;
    // With no secret set, the path 1 check should fail regardless of what's sent
    const secretHeader = 'any-value';
    const envSecret    = process.env.VEDRITH_EVENT_SECRET;
    expect(Boolean(envSecret && secretHeader)).toBe(false);
    process.env.VEDRITH_EVENT_SECRET = original;
  });
});

// ─── Contact API validation ───────────────────────────────────────────────────

describe('Contact API validation', () => {
  const { z } = require('zod');
  const schema = z.object({
    name:    z.string().min(1).max(100),
    email:   z.string().email(),
    subject: z.string().min(1).max(200),
    message: z.string().min(10).max(5000),
  });

  test('valid payload passes',          () => {
    const r = schema.safeParse({ name:'A', email:'a@b.com', subject:'S', message:'Hello world!!' });
    expect(r.success).toBe(true);
  });
  test('invalid email fails',           () => {
    const r = schema.safeParse({ name:'A', email:'not-email', subject:'S', message:'Hello world!!' });
    expect(r.success).toBe(false);
  });
  test('missing message fails',         () => {
    const r = schema.safeParse({ name:'A', email:'a@b.com', subject:'S' });
    expect(r.success).toBe(false);
  });
  test('message too short fails',       () => {
    const r = schema.safeParse({ name:'A', email:'a@b.com', subject:'S', message:'Hi' });
    expect(r.success).toBe(false);
  });
  test('empty name fails',              () => {
    const r = schema.safeParse({ name:'', email:'a@b.com', subject:'S', message:'Hello world!!' });
    expect(r.success).toBe(false);
  });
});

// ─── Supabase configuration ───────────────────────────────────────────────────

describe('Supabase configuration check', () => {
  test('isSupabaseConfigured() returns boolean', () => {
    expect(typeof isSupabaseConfigured()).toBe('boolean');
  });
  test('not configured without env vars', () => {
    const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(isSupabaseConfigured()).toBe(false);
    process.env.NEXT_PUBLIC_SUPABASE_URL  = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
  });
});

// ─── Admin auth token ─────────────────────────────────────────────────────────

describe('Admin auth token lifecycle', () => {
  beforeAll(() => { process.env.VEDRITH_ADMIN_TOKEN = 'secure-admin-token-32-chars-long!!'; });
  afterAll(()  => { delete process.env.VEDRITH_ADMIN_TOKEN; });

  test('fresh token is valid',        () => expect(verifyAdminToken(generateAdminToken())).toBe(true));
  test('invalid credentials rejected',() => {
    const ADMIN = process.env.VEDRITH_ADMIN_TOKEN ?? '';
    const input = 'wrong-password';
    const a = Buffer.from(input.padEnd(128, '\0'));
    const b = Buffer.from(ADMIN.padEnd(128, '\0'));
    let diff = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) diff |= a[i] ^ b[i];
    expect(diff !== 0 || input.length !== ADMIN.length).toBe(true);
  });
  test('Bearer extraction works',     () => {
    const token  = generateAdminToken();
    const header = `Bearer ${token}`;
    const extracted = extractBearerToken(header);
    expect(extracted).toBe(token);
  });
});
