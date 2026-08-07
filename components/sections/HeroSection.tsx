import Image              from 'next/image'
import Link               from 'next/link'
import OrnamentDivider    from '@/components/ui/OrnamentDivider'
import { SITE, STATS }    from '@/lib/constants'
import { HeroPanchangaStrip } from './HeroPanchangaStrip'

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-bg"
      aria-label="Hero"
    >

      {/* ── Sacred geometry background ──────────────────────────────────── */}
      {/* Concentric mandala rings — absolutely positioned, CSS-only */}
      <div aria-hidden="true">
        {/* Ring 1 — innermost, brightest */}
        <div
          className="mandala-ring"
          style={{ width: '260px', height: '260px', opacity: 0.30 }}
        />
        {/* Ring 2 */}
        <div
          className="mandala-ring"
          style={{
            width: '440px', height: '440px', opacity: 0.18,
            animation: 'spin-slow 40s linear infinite',
            borderStyle: 'dashed',
          }}
        />
        {/* Ring 3 */}
        <div
          className="mandala-ring"
          style={{ width: '640px', height: '640px', opacity: 0.12 }}
        />
        {/* Ring 4 */}
        <div
          className="mandala-ring"
          style={{
            width: '860px', height: '860px', opacity: 0.08,
            animation: 'spin-reverse 55s linear infinite',
            borderStyle: 'dashed',
          }}
        />
        {/* Ring 5 — outermost */}
        <div
          className="mandala-ring"
          style={{ width: '1100px', height: '1100px', opacity: 0.04 }}
        />
      </div>

      {/* Floating Sanskrit symbols */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="absolute top-[18%] left-[12%] font-serif text-7xl text-gold-500/[0.07] animate-pulse-soft">
          ॐ
        </span>
        <span className="absolute top-[25%] right-[10%] font-serif text-5xl text-navy-900/[0.05]">
          ☽
        </span>
        <span className="absolute bottom-[30%] left-[8%] font-serif text-4xl text-gold-500/[0.06]">
          ✦
        </span>
        <span className="absolute bottom-[22%] right-[14%] font-serif text-6xl text-navy-900/[0.04]">
          ☀
        </span>
        <span className="absolute top-[60%] left-[16%] text-3xl text-gold-500/[0.05]">
          ✧
        </span>
        <span className="absolute top-[55%] right-[8%] font-serif text-3xl text-navy-900/[0.04]">
          ⊕
        </span>
      </div>

      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto pt-24 pb-12">

        {/* Full logo — floating animation */}
        <div
          className="mb-10 animate-float"
          style={{ filter: 'drop-shadow(0 20px 40px rgba(201,160,82,0.15))' }}
        >
          <Image
            src="/images/logo-full.png"
            alt={`${SITE.name} — ${SITE.tagline}`}
            width={280}
            height={350}
            className="w-44 sm:w-56 md:w-64 h-auto"
            priority
          />
        </div>

        {/* Eyebrow */}
        <p className="font-sans text-[0.65rem] tracking-[0.32em] uppercase text-gold-600 mb-5 animate-fade-up">
          {SITE.poweredBy}
        </p>

        {/* Main headline */}
        <h1
          className="font-serif font-light text-navy-900 mb-6 leading-[1.08] animate-fade-up-delay-1"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
        >
          Where Ancient Wisdom
          <br />
          <span className="text-shimmer italic">Meets Modern Precision</span>
        </h1>

        {/* Description */}
        <p className="font-sans text-navy-700 leading-relaxed mb-10 max-w-2xl animate-fade-up-delay-2"
           style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}>
          {SITE.description}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-up-delay-3">
          <a href="#today" className="btn-gold">
            View Today&apos;s Panchanga
          </a>
          <Link href="/kundali" className="btn-ghost">
            Generate Kundali
          </Link>
        </div>

        {/* [V1.3] Live Panchanga strip — shows today's key details */}
        <div className="mt-8 w-full animate-fade-up-delay-3">
          <HeroPanchangaStrip />
        </div>

        {/* Ornament divider before stats */}
        <OrnamentDivider className="mt-16 mb-10" width="lg" />

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 animate-fade-up-delay-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="font-serif text-gold-600"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300 }}
              >
                {stat.value}
              </span>
              <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-navy-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <a
        href="#features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group"
        aria-label="Scroll to features"
      >
        <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-navy-400 group-hover:text-gold-600 transition-colors">
          Discover
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-navy-400 group-hover:text-gold-600 transition-colors animate-scroll-bounce"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>

      {/* ── Bottom fade ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(248,243,236,0.4))',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
