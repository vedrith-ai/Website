// ─────────────────────────────────────────────────────────────────────────────
// VedRith — CrossLinks [RC1 — Part 7: Internal Linking]
// SEO-friendly internal link hub shown on every page.
// Improves crawlability and connects related content.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'

interface CrossLinkGroup {
  heading:  string
  links:    { label: string; href: string; description: string }[]
}

const GROUPS: CrossLinkGroup[] = [
  {
    heading: 'Daily Panchanga',
    links: [
      { label: 'Today\'s Panchanga',   href: '/panchanga', description: 'Daily Tithi, Nakshatra, Yoga, Karana & Vara' },
      { label: 'Knowledge Base',       href: '/panchanga', description: 'Deep Jyotisha explanations for every element' },
      { label: 'Festival Calendar',    href: '/panchanga', description: 'Today\'s festivals and auspicious occasions' },
      { label: 'Rahu Kalam',           href: '/panchanga', description: 'Inauspicious time periods for the day' },
    ],
  },
  {
    heading: 'Kundali & Charts',
    links: [
      { label: 'Generate Kundali',     href: '/kundali',   description: 'Free Vedic birth chart with all planets' },
      { label: 'South Indian Chart',   href: '/kundali',   description: 'Classic South Indian style Kundali' },
      { label: 'North Indian Chart',   href: '/kundali',   description: 'Classic North Indian style Kundali' },
      
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Rules Engine',         href: '/panchanga', description: 'Jyotisha-backed auspicious activity guide' },
      { label: 'Smart Search',         href: '/',          description: 'Search Nakshatras, festivals & more' },
      { label: 'Share Cards',          href: '/panchanga', description: 'Share today\'s Panchanga with anyone' },
      { label: 'Notifications',        href: '/',          description: 'Festival & Panchanga reminder system' },
    ],
  },
]

export function CrossLinks({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Related pages"
      className={`py-12 px-4 bg-cream-50 border-t border-navy-100/30 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-navy-600/40 text-center mb-8">
          Explore VedRith
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {GROUPS.map(group => (
            <div key={group.heading}>
              <h3 className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-gold-600 mb-4">
                {group.heading}
              </h3>
              <ul className="space-y-3" role="list">
                {group.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="group flex flex-col gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded">
                      <span className="font-sans text-sm text-navy-800 group-hover:text-gold-700 transition-colors">
                        {link.label}
                      </span>
                      <span className="font-sans text-xs text-navy-600/50">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
