'use client'

import { useState, useEffect, useCallback } from 'react'
import Image  from 'next/image'
import Link   from 'next/link'
import { NAV_LINKS } from '@/lib/constants'

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // ── Scroll listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)

      // Highlight active nav link based on scroll position
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''))
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Close mobile menu on resize ─────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ── Close mobile menu on nav click ──────────────────────────────────────────
  const handleNavClick = useCallback(() => {
    setMobileOpen(false)
  }, [])

  // ── Toggle body scroll when mobile menu open ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // ── Dynamic header classes ───────────────────────────────────────────────────
  const headerBg = scrolled
    ? 'bg-cream-100/92 backdrop-blur-md shadow-navy-sm border-b border-gold-500/15'
    : 'bg-transparent border-b border-transparent'

  const logoSrc = '/images/logo-horizontal.png'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ───────────────────────────────────────────────────── */}
            <Link
              href="/"
              className="relative flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
              aria-label="VedRith — Home"
            >
              {/* Desktop: horizontal logo */}
              <Image
                src={logoSrc}
                alt="VedRith — The Rhythm of Vedic Wisdom"
                width={240}
                height={60}
                className="hidden sm:block h-12 w-auto object-contain"
                priority
              />
              {/* Mobile: circular / icon logo */}
              <Image
                src="/images/logo-circular.png"
                alt="VedRith"
                width={44}
                height={44}
                className="block sm:hidden h-11 w-11 object-contain rounded-full"
                priority
              />
            </Link>

            {/* ── Desktop Navigation ─────────────────────────────────────── */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Primary navigation"
            >
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace('#', '')
                const isActive  = activeSection === sectionId
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`
                      relative px-4 py-2 font-sans text-[0.7rem] tracking-[0.2em] uppercase
                      transition-colors duration-200 rounded
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500
                      ${isActive
                        ? 'text-gold-600'
                        : 'text-navy-700 hover:text-gold-700'
                      }
                    `}
                  >
                    {link.label}
                    {/* Active underline */}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-4 right-4 h-px bg-gold-500/70" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* ── CTA + Mobile Toggle ────────────────────────────────────── */}
            <div className="flex items-center gap-3">
              {/* Join Waitlist — desktop */}
              <a
                href="#contact"
                className="hidden md:inline-flex btn-gold text-[0.7rem] px-6 py-2.5"
              >
                Join Waitlist
              </a>

              {/* Hamburger — mobile */}
              <button
                className="
                  md:hidden relative flex items-center justify-center
                  w-10 h-10 rounded focus:outline-none
                  focus-visible:ring-2 focus-visible:ring-gold-500
                "
                onClick={() => setMobileOpen(prev => !prev)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
                <div className="w-5 flex flex-col gap-[5px]" aria-hidden="true">
                  <span
                    className={`
                      block h-[1.5px] bg-navy-900 origin-center
                      transition-transform duration-300
                      ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}
                    `}
                  />
                  <span
                    className={`
                      block h-[1.5px] bg-navy-900
                      transition-opacity duration-300
                      ${mobileOpen ? 'opacity-0' : ''}
                    `}
                  />
                  <span
                    className={`
                      block h-[1.5px] bg-navy-900 origin-center
                      transition-transform duration-300
                      ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}
                    `}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ───────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`
          fixed inset-0 z-40 flex flex-col
          bg-navy-950 md:hidden
          transition-all duration-400 ease-in-out
          ${mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
        aria-hidden={!mobileOpen}
      >
        {/* Top bar in mobile overlay */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <Image
            src="/images/logo-icon.png"
            alt="VedRith"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-2 text-cream-100/60 hover:text-gold-400 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-6 pt-8 pb-6 gap-1 flex-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleNavClick}
              className={`
                font-serif text-4xl font-light text-cream-100
                py-3 border-b border-white/5
                hover:text-gold-400 transition-colors duration-200
                ${mobileOpen ? 'animate-fade-up' : ''}
              `}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile CTA */}
        <div className="px-6 pb-12">
          <a
            href="#contact"
            onClick={handleNavClick}
            className="btn-gold w-full justify-center"
          >
            Join the Waitlist
          </a>
          <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-cream-100/30 text-center mt-6">
            Powered by Sharva&apos;s IT
          </p>
        </div>
      </div>
    </>
  )
}
