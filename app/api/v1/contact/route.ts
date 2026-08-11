// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/contact
// Real server-side contact/enquiry endpoint with validation.
// Stores to Supabase when configured, otherwise logs + returns direct-email fallback.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { z }                          from 'zod'
import { rateLimit }                  from '@/lib/security/rate-limit'
import { isSupabaseConfigured, getSupabaseAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const ContactSchema = z.object({
  name:    z.string().min(1, 'Name is required').max(100).trim(),
  email:   z.string().email('Valid email required').max(200).toLowerCase().trim(),
  subject: z.string().max(100).trim().default('general'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000).trim(),
})

export async function POST(req: NextRequest) {
  // Rate limit: 5 submissions per 10 minutes per IP
  const rl = rateLimit(req, { limit: 5, window: 600 })
  if (rl) return rl

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { name, email, subject, message } = parsed.data

  // Spam signals: ignore but don't reveal
  const spamSignals = [
    message.length < 10,
    /http[s]?:\/\//i.test(message) && message.split('http').length > 3,
    /\b(casino|crypto|bitcoin|loan|pills|viagra)\b/i.test(message),
  ]
  if (spamSignals.filter(Boolean).length >= 2) {
    // Return 200 to avoid enumeration but do not store
    return NextResponse.json({ ok: true, ref: 'VR-' + Date.now().toString(36).toUpperCase() })
  }

  const ref = 'VR-' + Date.now().toString(36).toUpperCase()

  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdminClient()
      await admin.from('contact_enquiries').insert({
        ref,
        name,
        email,
        subject,
        message,
        submitted_at: new Date().toISOString(),
        ip_hash:      hashIP(req.headers.get('x-forwarded-for') ?? 'unknown'),
      })
    } catch (err) {
      // Log and fall through — don't fail the user if DB is down
      console.error('[VedRith] Contact insert failed:', err)
    }
  } else {
    // Development/no-Supabase: structured log only
    console.info('[VedRith] Contact enquiry received:', { ref, name, email, subject, ts: new Date().toISOString() })
  }

  return NextResponse.json({ ok: true, ref })
}

function hashIP(ip: string): string {
  let h = 5381
  for (let i = 0; i < ip.length; i++) h = ((h << 5) + h + ip.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}
