import { createHmac, timingSafeEqual } from 'crypto';

const ADMIN_TOKEN = process.env.VEDRITH_ADMIN_TOKEN ?? '';
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

export function generateAdminToken(timestamp: number = Date.now()): string {
  if (!ADMIN_TOKEN) throw new Error('VEDRITH_ADMIN_TOKEN is not set');
  const payload = `admin:${timestamp}`;
  const sig = createHmac('sha256', ADMIN_TOKEN).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifyAdminToken(token: string): boolean {
  if (!ADMIN_TOKEN || !token) return false;
  try {
    const decoded  = Buffer.from(token, 'base64url').toString('utf8');
    const parts    = decoded.split(':');
    if (parts.length !== 3) return false;

    const [prefix, tsStr, receivedSig] = parts;
    if (prefix !== 'admin') return false;

    const ts = parseInt(tsStr, 10);
    if (isNaN(ts) || Date.now() - ts > SESSION_TTL) return false;

    const payload     = `admin:${tsStr}`;
    const expectedSig = createHmac('sha256', ADMIN_TOKEN).update(payload).digest('hex');
    const a = Buffer.from(receivedSig, 'hex');
    const b = Buffer.from(expectedSig, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim() || null;
}
