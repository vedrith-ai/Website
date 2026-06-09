import Image from 'next/image'
import Link  from 'next/link'
import { SITE } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="min-h-screen hero-bg flex flex-col items-center justify-center px-4 text-center">

      {/* Logo */}
      <Image
        src="/images/logo-circular.png"
        alt={SITE.name}
        width={96}
        height={96}
        className="mb-10 opacity-90"
        priority
      />

      {/* Ornament */}
      <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold-600 mb-6">
        404 — Page Not Found
      </p>

      {/* Heading */}
      <h1 className="font-serif text-5xl md:text-6xl text-navy-900 font-light mb-6 leading-tight">
        This page was not<br />
        <span className="italic text-shimmer">written in the stars</span>
      </h1>

      {/* Body */}
      <p className="font-sans text-navy-700 text-lg max-w-md mb-12 leading-relaxed">
        The page you are looking for does not exist or has moved.
        Perhaps the cosmic alignment is directing you elsewhere.
      </p>

      {/* Divider ornament */}
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px w-16 bg-gold-500/40" />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 0L8.75 5.25L14 7L8.75 8.75L7 14L5.25 8.75L0 7L5.25 5.25L7 0Z" fill="#C9A052" />
        </svg>
        <div className="h-px w-16 bg-gold-500/40" />
      </div>

      {/* CTA */}
      <Link href="/" className="btn-gold">
        Return to VedRith
      </Link>

      {/* Footer note */}
      <p className="mt-16 font-sans text-xs text-navy-400 tracking-widest uppercase">
        {SITE.poweredBy}
      </p>
    </div>
  )
}
