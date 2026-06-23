import Image          from 'next/image'
import Link           from 'next/link'
import OrnamentDivider from '@/components/ui/OrnamentDivider'
import { SITE, NAV_LINKS, SUPPORTED_LANGUAGES } from '@/lib/constants'

const FEATURE_LINKS = [
  { label: 'Panchanga',        href: '/panchanga' },
  { label: 'Kundali',          href: '#features' },
  { label: 'Muhurta',          href: '#features' },
  { label: 'Temple Directory', href: '#features' },
  { label: 'Devotional',       href: '#features' },
  { label: 'Family Dashboard', href: '#features' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-navy-950 text-cream-100"
      aria-label="Site footer"
    >
      {/* ── Top ornament wave ──────────────────────────────────────────── */}
      <div className="w-full overflow-hidden leading-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 56"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: '56px' }}
        >
          <path
            d="M0,56 C360,0 1080,0 1440,56 L1440,0 L0,0 Z"
            fill="#F8F3EC"
          />
        </svg>
      </div>

      {/* ── Main footer content ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* Brand row */}
        <div className="flex flex-col items-center text-center mb-14">
          <Image
            src="/images/logo-icon.png"
            alt="VedRith"
            width={96}
            height={96}
            className="h-24 w-auto mb-6 opacity-90"
          />
          <h2 className="font-serif text-3xl font-light text-cream-100 mb-2">
            {SITE.name}
          </h2>
          <p className="font-sans text-[0.7rem] tracking-[0.25em] uppercase text-gold-500 mb-6">
            {SITE.tagline}
          </p>
          <OrnamentDivider light width="sm" />
        </div>

        {/* Three-column links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-14">

          {/* Navigation */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-5">
              Navigate
            </p>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream-100/55 hover:text-gold-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-5">
              Features
            </p>
            <ul className="flex flex-col gap-3" role="list">
              {FEATURE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream-100/55 hover:text-gold-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-gold-500 mb-5">
              Supported Languages
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <span
                  key={lang}
                  className="font-sans text-sm text-cream-100/55"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ornament divider */}
        <OrnamentDivider light width="full" className="mb-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[0.7rem] text-cream-100/35 tracking-wide">
            &copy; {year} {SITE.name}. All rights reserved.
          </p>

{/* Powered by Sharva's IT */}
<Link
  href="https://sharvasit.in"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block"
>
  <p className="font-sans text-[0.7rem] text-cream-100/35 tracking-[0.15em] uppercase hover:text-cream-100/60 transition-colors">
    {SITE.poweredBy}
  </p>
</Link>
          {/* Legal links placeholder */}
          <div className="flex gap-6">
            <span className="font-sans text-[0.7rem] text-cream-100/25 cursor-default">
              Privacy Policy
            </span>
            <span className="font-sans text-[0.7rem] text-cream-100/25 cursor-default">
              Terms of Use
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
