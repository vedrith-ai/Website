interface Props { size?: 'sm' | 'md' | 'lg'; label?: string }

const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export function LoadingSpinner({ size = 'md', label = 'Loading…' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status" aria-label={label}>
      <svg
        className={`${sizes[size]} animate-spin text-primary`}
        fill="none" viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span className="text-sm text-muted-foreground sr-only">{label}</span>
    </div>
  );
}
