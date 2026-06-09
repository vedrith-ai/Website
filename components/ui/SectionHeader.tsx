interface SectionHeaderProps {
  eyebrow?:  string
  title:     string
  titleItalic?: string      // Optional italic suffix rendered on a new line
  subtitle?: string
  centered?: boolean
  light?:    boolean        // true = on dark (navy) background
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  titleItalic,
  subtitle,
  centered   = true,
  light      = false,
  className  = '',
}: SectionHeaderProps) {
  const alignClass    = centered ? 'text-center items-center' : 'text-left items-start'
  const eyebrowColor  = light ? 'text-gold-400'   : 'text-gold-600'
  const headingColor  = light ? 'text-cream-100'  : 'text-navy-900'
  const subtitleColor = light ? 'text-cream-200/70' : 'text-navy-700'
  const lineColor     = light ? 'bg-gold-400/50'  : 'bg-gold-500/50'

  return (
    <div className={`flex flex-col ${alignClass} mb-16 ${className}`}>

      {/* Eyebrow */}
      {eyebrow && (
        <p className={`font-sans text-[0.7rem] tracking-[0.28em] uppercase mb-5 ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}

      {/* Main heading */}
      <h2 className={`font-serif font-light leading-[1.1] ${headingColor}`}
          style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}>
        {title}
        {titleItalic && (
          <>
            <br />
            <em className="not-italic text-shimmer">{titleItalic}</em>
          </>
        )}
      </h2>

      {/* Gold star ornament */}
      <div className={`flex items-center gap-4 mt-6 ${centered ? 'justify-center' : ''}`}>
        <div className={`h-px w-14 ${lineColor}`} />
        <svg
          width="12" height="12"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 0L8.75 5.25L14 7L8.75 8.75L7 14L5.25 8.75L0 7L5.25 5.25L7 0Z"
            fill="#C9A052"
          />
        </svg>
        <div className={`h-px w-14 ${lineColor}`} />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className={`font-sans text-lg leading-relaxed mt-6 max-w-2xl ${centered ? 'mx-auto' : ''} ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
