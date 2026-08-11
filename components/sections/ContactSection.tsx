'use client'
// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Contact Section  [RC1]
// Real server-side submission. No fake delays. No PRO/waitlist messaging.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback, type ChangeEvent, type FormEvent } from 'react'
import Image           from 'next/image'
import SectionHeader   from '@/components/ui/SectionHeader'
import OrnamentDivider from '@/components/ui/OrnamentDivider'
import { SITE }        from '@/lib/constants'
import { useTranslation } from '@/lib/i18n'

interface FormState { name: string; email: string; subject: string; message: string }
const INITIAL_FORM: FormState = { name: '', email: '', subject: '', message: '' }
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const SUBJECTS = {
  en: [
    { value: 'general',    label: 'General enquiry'         },
    { value: 'panchanga',  label: 'Panchanga / calculation' },
    { value: 'kundali',    label: 'Kundali / birth chart'   },
    { value: 'feedback',   label: 'Feedback / suggestion'   },
    { value: 'technical',  label: 'Technical issue'         },
    { value: 'regional',   label: 'Regional tradition'      },
    { value: 'other',      label: 'Other'                   },
  ],
  kn: [
    { value: 'general',    label: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆ'       },
    { value: 'panchanga',  label: 'ಪಂಚಾಂಗ / ಲೆಕ್ಕಾಚಾರ'   },
    { value: 'kundali',    label: 'ಕುಂಡಲಿ / ಜನ್ಮ ಚಾರ್ಟ್'  },
    { value: 'feedback',   label: 'ಅಭಿಪ್ರಾಯ / ಸಲಹೆ'        },
    { value: 'technical',  label: 'ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆ'        },
    { value: 'regional',   label: 'ಪ್ರಾದೇಶಿಕ ಸಂಪ್ರದಾಯ'    },
    { value: 'other',      label: 'ಇತರ'                     },
  ],
}

const TEXT = {
  eyebrow:   { en: 'Get in Touch',       kn: 'ಸಂಪರ್ಕಿಸಿ'             },
  title:     { en: 'Contact',            kn: 'ಸಂಪರ್ಕ'                 },
  titleItalic:{ en: 'VedRith',           kn: 'ವೇದ್ರಿತ್'               },
  subtitle:  { en: 'Questions about Panchanga, Kundali, or the platform? We read every message.',
               kn: 'ಪಂಚಾಂಗ, ಕುಂಡಲಿ ಅಥವಾ ವೇದಿಕೆಯ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ? ನಾವು ಪ್ರತಿ ಸಂದೇಶ ಓದುತ್ತೇವೆ.' },
  nameLbl:   { en: 'Full Name *',        kn: 'ಪೂರ್ಣ ಹೆಸರು *'         },
  emailLbl:  { en: 'Email Address *',    kn: 'ಇಮೇಲ್ ವಿಳಾಸ *'         },
  subjectLbl:{ en: 'Subject',            kn: 'ವಿಷಯ'                    },
  messageLbl:{ en: 'Message *',          kn: 'ಸಂದೇಶ *'                },
  submit:    { en: 'Send Message',       kn: 'ಸಂದೇಶ ಕಳುಹಿಸಿ'         },
  sending:   { en: 'Sending…',          kn: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…'     },
  successT:  { en: 'Message received',  kn: 'ಸಂದೇಶ ಸ್ವೀಕರಿಸಲಾಗಿದೆ'   },
  successD:  { en: "Thank you — we'll be in touch shortly.",
               kn: 'ಧನ್ಯವಾದ — ನಾವು ಶೀಘ್ರದಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.'   },
  errorMsg:  { en: 'Something went wrong. Please email us directly.',
               kn: 'ಏನೋ ತೊಂದರೆ ಆಗಿದೆ. ದಯವಿಟ್ಟು ನೇರ ಇಮೇಲ್ ಮಾಡಿ.'  },
  directLbl: { en: 'Email directly',    kn: 'ನೇರ ಇಮೇಲ್'              },
  refLbl:    { en: 'Reference',         kn: 'ಉಲ್ಲೇಖ'                  },
  namePH:    { en: 'Your name',         kn: 'ನಿಮ್ಮ ಹೆಸರು'             },
  emailPH:   { en: 'you@example.com',   kn: 'you@example.com'          },
  msgPH:     { en: 'Your message…',     kn: 'ನಿಮ್ಮ ಸಂದೇಶ…'            },
}

export default function ContactSection() {
  const { lang: rawLang } = useTranslation()
  const lang = rawLang === 'kn' ? 'kn' : 'en'

  const [form,   setForm]   = useState<FormState>(INITIAL_FORM)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [ref,    setRef]    = useState<string | null>(null)

  const validate = useCallback((d: FormState): Partial<FormState> => {
    const e: Partial<FormState> = {}
    if (!d.name.trim())    e.name    = lang === 'kn' ? 'ಹೆಸರು ಅಗತ್ಯ.' : 'Your name is required.'
    if (!d.email.trim())   e.email   = lang === 'kn' ? 'ಇಮೇಲ್ ಅಗತ್ಯ.' : 'Your email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
                           e.email   = lang === 'kn' ? 'ಮಾನ್ಯ ಇಮೇಲ್ ನಮೂದಿಸಿ.' : 'Please enter a valid email address.'
    if (!d.message.trim()) e.message = lang === 'kn' ? 'ಸಂದೇಶ ಅಗತ್ಯ.' : 'A message is required.'
    return e
  }, [lang])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(p  => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: undefined }))
  }, [])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    const ve = validate(form)
    if (Object.keys(ve).length) { setErrors(ve); return }
    setStatus('submitting')
    try {
      const res  = await fetch('/api/v1/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json() as { ok?: boolean; ref?: string; error?: string }
      if (res.ok && data.ok) {
        setStatus('success')
        setRef(data.ref ?? null)
        setForm(INITIAL_FORM)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [form, validate])

  return (
    <section id="contact" className="relative bg-navy-950 py-28 lg:py-36 overflow-hidden" aria-label="Contact">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(201,160,82,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader light
          eyebrow={TEXT.eyebrow[lang]} title={TEXT.title[lang]}
          titleItalic={TEXT.titleItalic[lang]} subtitle={TEXT.subtitle[lang]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-8">
            <Image src="/images/logo-icon.png" alt={SITE.name} width={112} height={112}
              className="w-28 h-auto opacity-90 mx-auto lg:mx-0"
              style={{ filter: 'drop-shadow(0 12px 24px rgba(201,160,82,0.2))' }} />
            <OrnamentDivider light width="sm" className="self-start" />
            <div>
              <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-cream-100/30 mb-2">
                {TEXT.directLbl[lang]}
              </p>
              <a href={`mailto:${SITE.email}`} className="font-sans text-sm text-gold-400 hover:text-gold-300 transition-colors">
                {SITE.email}
              </a>
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div className="flex flex-col items-center text-center py-16 px-8 border border-gold-500/25 bg-navy-900/50 rounded-sm">
                <div className="w-14 h-14 rounded-full border border-gold-500/40 flex items-center justify-center mb-6" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A052" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12l4 4 10-10" /></svg>
                </div>
                <h3 className="font-serif text-2xl text-cream-100 font-light mb-3">{TEXT.successT[lang]}</h3>
                <p className="font-sans text-cream-100/60 text-sm leading-relaxed max-w-xs">{TEXT.successD[lang]}</p>
                {ref && <p className="mt-4 font-sans text-xs text-cream-100/30">{TEXT.refLbl[lang]}: <span className="text-gold-500/60 font-mono">{ref}</span></p>}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate aria-label={TEXT.eyebrow[lang]}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cnt-name" className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45">{TEXT.nameLbl[lang]}</label>
                    <input id="cnt-name" name="name" type="text" value={form.name} onChange={handleChange}
                      placeholder={TEXT.namePH[lang]} autoComplete="name" className="vedrith-input"
                      aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ce-name' : undefined} />
                    {errors.name && <p id="ce-name" className="font-sans text-xs text-red-400">{errors.name}</p>}
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cnt-email" className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45">{TEXT.emailLbl[lang]}</label>
                    <input id="cnt-email" name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder={TEXT.emailPH[lang]} autoComplete="email" className="vedrith-input"
                      aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ce-email' : undefined} />
                    {errors.email && <p id="ce-email" className="font-sans text-xs text-red-400">{errors.email}</p>}
                  </div>
                </div>
                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cnt-subject" className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45">{TEXT.subjectLbl[lang]}</label>
                  <select id="cnt-subject" name="subject" value={form.subject} onChange={handleChange} className="vedrith-input">
                    <option value="">—</option>
                    {SUBJECTS[lang].map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cnt-message" className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream-100/45">{TEXT.messageLbl[lang]}</label>
                  <textarea id="cnt-message" name="message" rows={5} value={form.message} onChange={handleChange}
                    placeholder={TEXT.msgPH[lang]} className="vedrith-input resize-none"
                    aria-invalid={!!errors.message} aria-describedby={errors.message ? 'ce-msg' : undefined} />
                  {errors.message && <p id="ce-msg" className="font-sans text-xs text-red-400">{errors.message}</p>}
                </div>
                {status === 'error' && (
                  <p className="font-sans text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded px-3 py-2">
                    {TEXT.errorMsg[lang]} <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a>
                  </p>
                )}
                <button type="submit" disabled={status === 'submitting'}
                  className={`btn-gold mt-2 ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {status === 'submitting' ? TEXT.sending[lang] : TEXT.submit[lang]}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
