'use client'

import { useState, useCallback } from 'react'
import Image          from 'next/image'
import SectionHeader  from '@/components/ui/SectionHeader'
import OrnamentDivider from '@/components/ui/OrnamentDivider'
import { SITE } from '@/lib/constants'

interface FormState {
  name:    string
  email:   string
  subject: string
  message: string
}

const INITIAL_FORM: FormState = {
  name:    '',
  email:   '',
  subject: '',
  message: '',
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactSection() {
  const [form,   setForm]   = useState<FormState>(INITIAL_FORM)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errors, setErrors] = useState<Partial<FormState>>({})

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = useCallback((data: FormState): Partial<FormState> => {
    const e: Partial<FormState> = {}
    if (!data.name.trim())    e.name    = 'Your name is required.'
    if (!data.email.trim())   e.email   = 'Your email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                              e.email   = 'Please enter a valid email address.'
    if (!data.message.trim()) e.message = 'A message is required.'
    return e
  }, [])

  // ── Input change handler ──────────────────────────────────────────────────
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setForm(prev  => ({ ...prev,  [name]: value }))
      setErrors(prev => ({ ...prev, [name]: undefined }))
    },
    []
  )

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const validationErrors = validate(form)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setStatus('submitting')

      // Simulated API call — replace with actual endpoint in production
      await new Promise(resolve => setTimeout(resolve, 1400))

      // In production: POST to /api/v1/contact or a form service
      setStatus('success')
      setForm(INITIAL_FORM)
    },
    [form, validate]
  )

  return (
    <section
      id="contact"
      className="relative bg-navy-950 py-28 lg:py-36 overflow-hidden"
      aria-label="Contact and Waitlist"
    >
      {/* Background grid dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,160,82,0.06) 1px, transparent 1px)',
          backgroundSize:  '48px 48px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
        style={{
          width:      '800px',
          height:     '500px',
          background: 'radial-gradient(ellipse, rgba(201,160,82,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ───────────────────────────────────────────── */}
        <SectionHeader
          light
          eyebrow="Join the Journey"
          title="Be First to Experience"
          titleItalic="VedRith"
          subtitle="Join the waitlist and receive early access, priority support, and a discounted first-year PRO subscription when we launch."
        />

        {/* ── Two-column layout ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Left: Info + Logo ────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/logo-icon.png"
                alt={SITE.name}
                width={140}
                height={140}
                className="w-28 h-auto opacity-90"
                style={{ filter: 'drop-shadow(0 12px 24px rgba(201,160,82,0.2))' }}
              />
            </div>

            <div>
              <h3 className="font-serif text-2xl text-cream-100 font-light mb-4 leading-snug">
                Early Access Waitlist
              </h3>
              <p className="font-sans text-cream-100/60 text-sm leading-relaxed">
                VedRith is in active development. Join the waitlist to be among
                the first to access the platform when V1 launches — with exclusive
                early-bird pricing on PRO and PREMIUM plans.
              </p>
            </div>

            <OrnamentDivider light width="sm" className="self-start" />

            {/* What you get */}
            <div className="flex flex-col gap-4">
              {[
                'Early access before public launch',
                'Discounted first-year PRO subscription',
                'Priority customer support',
                'Input into feature prioritisation',
                'Launch-day announcement',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <svg
                    width="16" height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="flex-shrink-0"
                  >
                    <circle cx="8" cy="8" r="7" stroke="rgba(201,160,82,0.4)" strokeWidth="1" />
                    <path
                      d="M5 8l2 2 4-4"
                      stroke="#C9A052"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-sans text-sm text-cream-100/65">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Email direct */}
            <div className="mt-2">
              <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-cream-100/30 mb-2">
                Direct email
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="font-sans text-sm text-gold-400 hover:text-gold-300 transition-colors"
              >
                {SITE.email}
              </a>
            </div>
          </div>

          {/* ── Right: Form ──────────────────────────────────────────────── */}
          <div>
            {status === 'success' ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center text-center py-16 px-8 border border-gold-500/25 bg-navy-900/50 rounded-sm">
                <div
                  className="w-16 h-16 rounded-full border border-gold-500/40 flex items-center justify-center mb-8"
                  aria-hidden="true"
                >
                  <svg
                    width="28" height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="#C9A052"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 14l6 6 12-12" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-cream-100 font-light mb-3">
                  You&apos;re on the list
                </h3>
                <p className="font-sans text-cream-100/60 text-sm leading-relaxed max-w-xs">
                  Thank you for joining the VedRith waitlist. We&apos;ll be in touch
                  before our official launch with early-access details.
                </p>
                <OrnamentDivider light width="sm" className="mt-8" />
                <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-gold-500/70 mt-6">
                  {SITE.poweredBy}
                </p>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                noValidate
                aria-label="Waitlist and contact form"
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="name"
                      className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      className="vedrith-input"
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p id="name-error" className="font-sans text-xs text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="vedrith-input"
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p id="email-error" className="font-sans text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="subject"
                    className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45"
                  >
                    I am interested in
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="vedrith-input"
                  >
                    <option value="">Select an option…</option>
                    <option value="waitlist">Joining the Waitlist</option>
                    <option value="early-access">Early Access Programme</option>
                    <option value="pro-plan">PRO Subscription</option>
                    <option value="premium-plan">Premium Subscription</option>
                    <option value="regional">Regional Panchanga Support</option>
                    <option value="enterprise">Enterprise / White-label</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about yourself or your question…"
                    className="vedrith-input resize-none"
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p id="message-error" className="font-sans text-xs text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`btn-gold mt-2 ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center gap-3">
                      <svg
                        className="animate-spin"
                        width="16" height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    'Join the Waitlist'
                  )}
                </button>

                <p className="font-sans text-[0.65rem] text-cream-100/25 text-center">
                  By submitting, you agree to be contacted about VedRith&apos;s launch.
                  No spam — ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
