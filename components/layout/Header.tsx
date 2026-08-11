'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Header [RC1]
// Navigation + Search + Language + PWA + Notifications
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import Image  from 'next/image'
import Link   from 'next/link'
import { NAV_LINKS } from '@/lib/constants'
import { useTranslation, LanguageSwitcher } from '@/lib/i18n'
import { GlobalSearch }     from '@/components/search/GlobalSearch'

const APP_LINKS = [
  { label: 'Panchanga', labelKn: 'ಪಂಚಾಂಗ', href: '/panchanga' },
  { label: 'Kundali',   labelKn: 'ಕುಂಡಲಿ',  href: '/kundali'  },
]

export default function Header() {
  const [scrolled,      setScrolled]      = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [searchOpen,    setSearchOpen]    = useState(false)
  const { lang } = useTranslation()

  // ── Scroll listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Close mobile menu on resize ─────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ── Body scroll lock ─────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // ── Keyboard shortcut: / = search ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleNavClick = useCallback(() => setMobileOpen(false), [])

  const headerBg = scrolled
    ? 'bg-cream-100/92 backdrop-blur-md shadow-navy-sm border-b border-gold-500/15'
    : 'bg-transparent border-b border-transparent'

  return (
    <>
      {/* ── Search Overlay ──────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[200] bg-navy-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}>
          <div className="w-full max-w-2xl">
            <GlobalSearch onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link href="/" className="relative flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded" aria-label="VedRith — Home">
              <Image src="/images/logo-horizontal.png" alt="VedRith" width={240} height={60} className="hidden sm:block h-12 w-auto object-contain" priority />
              <Image src="/images/logo-circular.png"   alt="VedRith" width={44}  height={44} className="block sm:hidden h-11 w-11 object-contain rounded-full" priority />
            </Link>

            {/* ── Desktop Navigation ────────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Primary navigation">
              {/* App pages */}
              {APP_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-navy-700 hover:text-gold-700 transition-colors duration-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                  {lang === 'kn' ? link.labelKn : link.label}
                </Link>
              ))}
              {/* Section anchors */}
              {NAV_LINKS.filter(l => !l.href.startsWith('/')).map((link) => (
                <Link key={link.label} href={link.href}
                  className="px-3 py-2 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-navy-700 hover:text-gold-700 transition-colors duration-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                  {lang === 'kn' ? (link as unknown as { labelKn?: string }).labelKn ?? link.label : link.label}
                </Link>
              ))}
            </nav>

            {/* ── Right actions ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-navy-200/40 text-navy-700 hover:text-gold-700 hover:border-gold-500/40 transition-colors text-xs"
                aria-label="Search — Press / to open"
                title="Search (press /)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
                <span className="hidden lg:inline font-sans text-[0.65rem] tracking-widest uppercase">Search</span>
              </button>

              {/* Language switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>

              {/* CTA — desktop */}
              <Link href="/panchanga"
                className="hidden md:inline-flex btn-gold text-[0.7rem] px-5 py-2.5">
                {lang === 'kn' ? 'ಪಂಚಾಂಗ ನೋಡಿ' : 'View Panchanga'}
              </Link>

              {/* Hamburger — mobile */}
              <button
                className="md:hidden relative flex items-center justify-center w-10 h-10 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                onClick={() => setMobileOpen(prev => !prev)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <div className="w-5 flex flex-col gap-[5px]" aria-hidden="true">
                  <span className={`block h-[1.5px] bg-navy-900 origin-center transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                  <span className={`block h-[1.5px] bg-navy-900 transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-[1.5px] bg-navy-900 origin-center transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ──────────────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-navy-950 md:hidden transition-all duration-400 ease-in-out ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <Image src="/images/logo-icon.png" alt="VedRith" width={48} height={48} className="h-12 w-auto" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact dark />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-cream-100/60 hover:text-gold-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <nav className="flex flex-col px-6 pt-6 pb-4 gap-1 flex-1 overflow-y-auto" aria-label="Mobile navigation">
          {/* App links */}
          {APP_LINKS.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={handleNavClick}
              className={`font-serif text-3xl font-light text-gold-400 py-3 border-b border-white/5 hover:text-gold-300 transition-colors duration-200 ${mobileOpen ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}>
              {lang === 'kn' ? link.labelKn : link.label}
            </Link>
          ))}
          {/* Section anchors */}
          {NAV_LINKS.filter(l => !l.href.startsWith('/')).map((link, i) => (
            <Link key={link.label} href={link.href} onClick={handleNavClick}
              className={`font-serif text-3xl font-light text-cream-100 py-3 border-b border-white/5 hover:text-gold-400 transition-colors duration-200 ${mobileOpen ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: `${(APP_LINKS.length + i) * 60}ms` }}>
              {lang === 'kn' ? (link as unknown as { labelKn?: string }).labelKn ?? link.label : link.label}
            </Link>
          ))}
          {/* Mobile search */}
          <button onClick={() => { setMobileOpen(false); setSearchOpen(true) }}
            className="flex items-center gap-3 font-serif text-3xl font-light text-cream-100/60 py-3 border-b border-white/5 hover:text-gold-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
            Search
          </button>
        </nav>

        <div className="px-6 pb-12">
          <Link href="/panchanga" onClick={handleNavClick} className="btn-gold w-full justify-center block text-center">
            {lang === 'kn' ? 'ಇಂದಿನ ಪಂಚಾಂಗ ನೋಡಿ' : 'View Today\'s Panchanga'}
          </Link>
          <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-cream-100/30 text-center mt-6">
            Powered by Sharva&apos;s IT
          </p>
        </div>
      </div>
    </>
  )
}
