// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Footer [RC1]
// SEO-friendly footer with full internal linking
// ─────────────────────────────────────────────────────────────────────────────

import Image           from 'next/image'
import Link            from 'next/link'
import OrnamentDivider from '@/components/ui/OrnamentDivider'
import { SITE }        from '@/lib/constants'

const PLATFORM_LINKS = [
  { label: 'Panchanga',         href: '/panchanga'      },
  { label: 'Kundali',           href: '/kundali'        },
  { label: 'Knowledge Base',    href: '/panchanga#knowledge' },
  { label: 'Rules Engine',      href: '/panchanga#rules'    },
  { label: 'Smart Search',      href: '/'               },
  { label: 'Notifications',     href: '/'               },
]

const COMPANY_LINKS = [
  { label: 'About VedRith',     href: '#about'          },
  { label: 'Roadmap',           href: '#roadmap'        },
  { label: 'FAQ',               href: '#faq'            },
  { label: 'Contact',           href: '#contact'        },
  { label: 'Privacy Policy',    href: '/privacy'        },
  { label: 'Terms of Use',      href: '/terms'          },
]

const KNOWLEDGE_LINKS = [
  { label: 'Nakshatra Guide',   href: '/panchanga' },
  { label: 'Tithi Calendar',    href: '/panchanga' },
  { label: 'Yoga & Karana',     href: '/panchanga' },
  { label: 'Festival Calendar', href: '/panchanga' },
  { label: 'Panchanga Basics',  href: '/panchanga' },
  { label: 'Kundali Guide',     href: '/kundali'   },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-cream-100" aria-label="Site footer">
      {/* ── Top ornament wave ──────────────────────────────────────────────── */}
      <div className="w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: '56px' }}>
          <path d="M0,56 C360,0 1080,0 1440,56 L1440,0 L0,0 Z" fill="#F8F3EC" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* ── Brand row ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-14">
          <Image src="/images/logo-icon.png" alt="VedRith" width={96} height={96} className="h-24 w-auto mb-6 opacity-90" />
          <h2 className="font-serif text-3xl font-light text-cream-100 mb-2">{SITE.name}</h2>
          <p className="font-sans text-[0.7rem] tracking-[0.25em] uppercase text-gold-500 mb-2">{SITE.tagline}</p>
          <p className="font-sans text-[0.65rem] text-cream-100/40 mb-6">India&apos;s precision Vedic astrology platform — English &amp; Kannada</p>
          <OrnamentDivider light width="sm" />
        </div>

        {/* ── Four-column links ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-14">

          {/* Platform */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-5">Platform</p>
            <ul className="flex flex-col gap-3" role="list">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-sans text-sm text-cream-100/55 hover:text-gold-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-5">Company</p>
            <ul className="flex flex-col gap-3" role="list">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-sans text-sm text-cream-100/55 hover:text-gold-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-5">Knowledge</p>
            <ul className="flex flex-col gap-3" role="list">
              {KNOWLEDGE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-sans text-sm text-cream-100/55 hover:text-gold-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages + Contact */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-5">Languages</p>
            <div className="flex flex-col gap-3 mb-6">
              <span className="inline-flex items-center gap-2 font-sans text-sm text-cream-100/70">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse inline-block" />
                English — Live
              </span>
              <span className="inline-flex items-center gap-2 font-sans text-sm text-cream-100/70">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse inline-block" />
                ಕನ್ನಡ — Live
              </span>
              <span className="font-sans text-xs text-cream-100/30 mt-1">More languages coming soon</span>
            </div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-3">Contact</p>
            <a href={`mailto:${SITE.email}`} className="font-sans text-sm text-cream-100/55 hover:text-gold-400 transition-colors duration-200 break-all">
              {SITE.email}
            </a>
          </div>
        </div>

        {/* ── Breadcrumb / Internal link bar ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mb-10">
          {[
            { label: 'Home',           href: '/'          },
            { label: 'Panchanga',      href: '/panchanga' },
            { label: 'Kundali',        href: '/kundali'   },
            { label: 'Knowledge',      href: '/panchanga' },
            { label: 'Rules',          href: '/panchanga' },
            { label: 'Roadmap',        href: '#roadmap'   },
            { label: 'Privacy',        href: '/privacy'   },
            { label: 'Terms',          href: '/terms'     },
            { label: 'About',          href: '#about'     },
            { label: 'Contact',        href: '#contact'   },
          ].map(link => (
            <Link key={link.label} href={link.href}
              className="font-sans text-[0.65rem] text-cream-100/25 hover:text-cream-100/50 transition-colors tracking-wide uppercase">
              {link.label}
            </Link>
          ))}
        </div>

        <OrnamentDivider light width="full" className="mb-10" />

        {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[0.7rem] text-cream-100/35 tracking-wide">
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <Link href="https://sharvasit.in" target="_blank" rel="noopener noreferrer">
            <p className="font-sans text-[0.7rem] text-cream-100/35 tracking-[0.15em] uppercase hover:text-cream-100/60 transition-colors">
              {SITE.poweredBy}
            </p>
          </Link>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-sans text-[0.7rem] text-cream-100/35 hover:text-cream-100/55 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="font-sans text-[0.7rem] text-cream-100/35 hover:text-cream-100/55 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
