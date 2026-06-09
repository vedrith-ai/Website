interface OrnamentDividerProps {
  light?:     boolean
  className?: string
  width?:     'sm' | 'md' | 'lg' | 'full'
}

export default function OrnamentDivider({
  light     = false,
  className = '',
  width     = 'md',
}: OrnamentDividerProps) {
  const lineColor = light
    ? 'bg-gradient-to-r from-transparent via-gold-400/50 to-transparent'
    : 'bg-gradient-to-r from-transparent via-gold-500/50 to-transparent'

  const widthMap = {
    sm:   'max-w-[120px]',
    md:   'max-w-[240px]',
    lg:   'max-w-[420px]',
    full: 'max-w-full',
  }

  return (
    <div
      className={`flex items-center justify-center gap-3 ${widthMap[width]} mx-auto ${className}`}
      aria-hidden="true"
    >
      <div className={`h-px flex-1 ${lineColor}`} />

      {/* Three dot ornament */}
      <div className="flex items-center gap-1.5">
        <span
          className={`block w-1 h-1 rounded-full ${light ? 'bg-gold-400/60' : 'bg-gold-500/60'}`}
        />
        <span
          className={`block w-1.5 h-1.5 rounded-full ${light ? 'bg-gold-400' : 'bg-gold-500'}`}
        />
        <span
          className={`block w-1 h-1 rounded-full ${light ? 'bg-gold-400/60' : 'bg-gold-500/60'}`}
        />
      </div>

      <div className={`h-px flex-1 ${lineColor}`} />
    </div>
  )
}
