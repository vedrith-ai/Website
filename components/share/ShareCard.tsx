'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Share Card Component  [V1.3]
//
// Renders a beautiful visual Panchanga share card.
// This component is designed to be:
//   1. Displayed in the UI (preview)
//   2. Captured as an image (via html-to-image or canvas)
//
// Themes: traditional | modern | kannada
// Formats: square | story | landscape
// ─────────────────────────────────────────────────────────────────────────────

import type { ShareCardData, ShareCardTheme } from '@/lib/share/types'

// ── Theme style maps ──────────────────────────────────────────────────────────

const THEME_STYLES: Record<ShareCardTheme, {
  bg:        string
  border:    string
  text:      string
  textMuted: string
  accent:    string
  accentBg:  string
  cardBg:    string
  divider:   string
  logo:      string
}> = {
  traditional: {
    bg:        'bg-[#0a0f1e]',
    border:    'border-[#C9A052]/30',
    text:      'text-[#F8F3EC]',
    textMuted: 'text-[#F8F3EC]/60',
    accent:    'text-[#C9A052]',
    accentBg:  'bg-[#C9A052]/10',
    cardBg:    'bg-[#1B2A4A]/50',
    divider:   'border-[#C9A052]/20',
    logo:      'text-[#C9A052]',
  },
  modern: {
    bg:        'bg-white',
    border:    'border-gray-200',
    text:      'text-gray-900',
    textMuted: 'text-gray-500',
    accent:    'text-amber-600',
    accentBg:  'bg-amber-50',
    cardBg:    'bg-gray-50',
    divider:   'border-gray-200',
    logo:      'text-amber-600',
  },
  kannada: {
    bg:        'bg-[#1a0a00]',
    border:    'border-[#E8C97A]/30',
    text:      'text-[#FFF8E7]',
    textMuted: 'text-[#FFF8E7]/60',
    accent:    'text-[#E8C97A]',
    accentBg:  'bg-[#E8C97A]/10',
    cardBg:    'bg-[#2D1800]/50',
    divider:   'border-[#E8C97A]/20',
    logo:      'text-[#E8C97A]',
  },
}

// ── Five Anga mini-card ───────────────────────────────────────────────────────

function AngaCell({ label, value, accent = false, s }: {
  label:   string
  value:   string
  accent?: boolean
  s:       (typeof THEME_STYLES)[ShareCardTheme]
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
      accent ? `${s.accentBg} ${s.border}` : `${s.cardBg} ${s.divider}`
    }`}>
      <span className={`text-[9px] uppercase tracking-widest font-medium ${s.textMuted} mb-0.5`}>
        {label}
      </span>
      <span className={`text-xs font-semibold leading-tight text-center ${accent ? s.accent : s.text}`}>
        {value}
      </span>
    </div>
  )
}

// ── Time row ──────────────────────────────────────────────────────────────────

function TimeRow({ icon, label, value, s }: {
  icon:  string
  label: string
  value: string
  s:     (typeof THEME_STYLES)[ShareCardTheme]
}) {
  return (
    <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${s.cardBg}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <span className={`text-xs ${s.textMuted}`}>{label}</span>
      </div>
      <span className={`text-xs font-semibold tabular-nums ${s.text}`}>{value}</span>
    </div>
  )
}

// ── Decorative mandala ring element ──────────────────────────────────────────

function MandalaRing({ size, opacity, theme }: { size: number; opacity: number; theme: ShareCardTheme }) {
  const color = theme === 'modern' ? 'rgba(180,120,0,' : 'rgba(201,160,82,'
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        border: `1px solid ${color}${opacity})`,
      }}
    />
  )
}

// ── Square card (1080×1080 equivalent) ───────────────────────────────────────

function SquareCard({ data, s }: { data: ShareCardData; s: (typeof THEME_STYLES)[ShareCardTheme] }) {
  const isKn = data.lang === 'kn'

  return (
    <div className={`relative w-full aspect-square overflow-hidden rounded-2xl border-2 ${s.bg} ${s.border} flex flex-col`}
         data-share-card>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <MandalaRing size={320} opacity={0.06} theme={data.theme} />
        <MandalaRing size={220} opacity={0.10} theme={data.theme} />
        <MandalaRing size={140} opacity={0.15} theme={data.theme} />
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
             style={{ background: 'radial-gradient(circle, #C9A052 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between px-5 pt-4 pb-3 border-b ${s.divider}`}>
        <div>
          <p className={`text-[10px] tracking-[0.3em] uppercase font-medium ${s.accent}`}>
            VedRith
          </p>
          <p className={`text-[8px] ${s.textMuted} tracking-wider`}>
            {isKn ? 'ವೈದಿಕ ಜ್ಞಾನದ ಲಯ' : 'The Rhythm of Vedic Wisdom'}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-[10px] font-semibold ${s.accent}`}>{data.vara.nameKn}</p>
          <p className={`text-[8px] ${s.textMuted}`}>{data.dateDisplay.split(',').slice(1).join(',').trim()}</p>
        </div>
      </div>

      {/* Festival banner */}
      {data.festival && (
        <div className={`relative z-10 mx-4 mt-3 rounded-xl px-4 py-2 text-center ${s.accentBg} border ${s.border}`}>
          <p className={`text-[10px] tracking-[0.2em] uppercase ${s.accent} font-medium`}>
            {isKn ? 'ಹಬ್ಬ' : 'Festival'}
          </p>
          <p className={`text-sm font-semibold ${s.text} leading-tight`}>
            {isKn ? data.festival.nameKn : data.festival.nameEn}
          </p>
        </div>
      )}

      {/* Deity section */}
      <div className="relative z-10 text-center px-5 mt-3">
        <p className="text-3xl mb-0.5">{data.deity.symbol}</p>
        <p className={`text-[10px] tracking-[0.2em] uppercase ${s.textMuted} mb-0.5`}>
          {isKn ? 'ಇಂದಿನ ದೈವ' : 'Deity of the Day'}
        </p>
        <p className={`text-base font-semibold ${s.accent}`}>
          {isKn ? data.deity.nameKn : data.deity.nameEn}
        </p>
        <p className={`text-[11px] italic ${s.textMuted} mt-0.5`}>{data.deity.mantraEn}</p>
      </div>

      {/* Divider */}
      <div className={`mx-5 my-3 border-t ${s.divider}`} aria-hidden />

      {/* Five angas grid */}
      <div className="relative z-10 px-4 grid grid-cols-5 gap-1.5">
        <AngaCell label={isKn ? 'ತಿಥಿ' : 'Tithi'}     value={isKn ? data.tithi.nameKn : data.tithi.name}         accent s={s} />
        <AngaCell label={isKn ? 'ನಕ್ಷತ್ರ' : 'Nakshatra'} value={isKn ? data.nakshatra.nameKn : data.nakshatra.name} s={s} />
        <AngaCell label={isKn ? 'ಯೋಗ' : 'Yoga'}        value={isKn && data.yoga.nameKn ? data.yoga.nameKn : data.yoga.name} s={s} />
        <AngaCell label={isKn ? 'ಕರಣ' : 'Karana'}      value={isKn && data.karana.nameKn ? data.karana.nameKn : data.karana.name} s={s} />
        <AngaCell label={isKn ? 'ಮಾಸ' : 'Masa'}        value={isKn && data.masaKn ? data.masaKn : (data.masa ?? '')} s={s} />
      </div>

      {/* Times */}
      <div className="relative z-10 px-4 mt-2 space-y-1">
        <TimeRow icon="🌅" label={isKn ? 'ಸೂರ್ಯೋದಯ' : 'Sunrise'}    value={data.sunrise} s={s} />
        <TimeRow icon="🌇" label={isKn ? 'ಸೂರ್ಯಾಸ್ತ' : 'Sunset'}      value={data.sunset}  s={s} />
        <TimeRow icon="⚠️" label={isKn ? 'ರಾಹು ಕಾಲ' : 'Rahu Kalam'} value={`${data.rahuKalam.start} – ${data.rahuKalam.end}`} s={s} />
      </div>

      {/* Spiritual message */}
      <div className="relative z-10 px-5 mt-3 flex-1">
        <p className={`text-[9px] text-center italic leading-relaxed ${s.textMuted}`}>
          &ldquo;{isKn ? data.message.kn : data.message.en}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className={`relative z-10 mt-auto px-5 py-3 border-t ${s.divider} flex items-center justify-between`}>
        <p className={`text-[8px] ${s.textMuted}`}>{data.locationName}</p>
        <p className={`text-[8px] font-medium ${s.accent}`}>vedrith.com</p>
      </div>
    </div>
  )
}

// ── Landscape card (1200×630 equivalent) ─────────────────────────────────────

function LandscapeCard({ data, s }: { data: ShareCardData; s: (typeof THEME_STYLES)[ShareCardTheme] }) {
  const isKn = data.lang === 'kn'

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border-2 ${s.bg} ${s.border} flex`}
      style={{ aspectRatio: '1200/630' }}
      data-share-card
    >
      {/* Left panel — branding + deity */}
      <div className={`relative w-2/5 flex flex-col items-center justify-center p-6 border-r ${s.divider}`}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <MandalaRing size={240} opacity={0.08} theme={data.theme} />
          <MandalaRing size={160} opacity={0.12} theme={data.theme} />
        </div>
        <p className="text-4xl mb-2">{data.deity.symbol}</p>
        <p className={`text-[9px] tracking-[0.3em] uppercase ${s.accent} font-bold mb-1`}>VedRith</p>
        {data.festival && (
          <p className={`text-xs font-semibold text-center ${s.text} mb-1`}>
            {isKn ? data.festival.nameKn : data.festival.nameEn}
          </p>
        )}
        <p className={`text-sm font-semibold ${s.accent} text-center`}>
          {isKn ? data.deity.nameKn : data.deity.nameEn}
        </p>
        <p className={`text-[10px] italic ${s.textMuted} text-center mt-1`}>{data.deity.mantraEn}</p>
        <p className={`text-[9px] ${s.textMuted} mt-3`}>{data.locationName}</p>
      </div>

      {/* Right panel — panchanga data */}
      <div className="flex-1 flex flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className={`text-sm font-semibold ${s.text}`}>{data.vara.nameKn}</p>
            <p className={`text-[10px] ${s.textMuted}`}>{data.dateDisplay}</p>
          </div>
          <p className={`text-[9px] ${s.textMuted}`}>{isKn ? 'ಇಂದಿನ ಪಂಚಾಂಗ' : 'Today\'s Panchanga'}</p>
        </div>

        {/* Angas */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          <AngaCell label={isKn ? 'ತಿಥಿ' : 'Tithi'}     value={isKn ? data.tithi.nameKn : data.tithi.name}         accent s={s} />
          <AngaCell label={isKn ? 'ನಕ್ಷತ್ರ' : 'Nakshatra'} value={isKn ? data.nakshatra.nameKn : data.nakshatra.name} s={s} />
          <AngaCell label={isKn ? 'ಯೋಗ' : 'Yoga'}        value={isKn && data.yoga.nameKn ? data.yoga.nameKn : data.yoga.name} s={s} />
          <AngaCell label={isKn ? 'ಕರಣ' : 'Karana'}      value={isKn && data.karana.nameKn ? data.karana.nameKn : data.karana.name} s={s} />
          <AngaCell label={isKn ? 'ವಾರ' : 'Vara'}        value={isKn ? data.vara.nameKn : data.vara.name} s={s} />
        </div>

        {/* Times */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <TimeRow icon="🌅" label={isKn ? 'ಸೂರ್ಯೋದಯ' : 'Sunrise'}    value={data.sunrise} s={s} />
          <TimeRow icon="🌇" label={isKn ? 'ಸೂರ್ಯಾಸ್ತ' : 'Sunset'}      value={data.sunset}  s={s} />
          <TimeRow icon="⚠️" label={isKn ? 'ರಾಹು ಕಾಲ' : 'Rahu Kalam'} value={`${data.rahuKalam.start}`} s={s} />
        </div>

        {/* Message */}
        <p className={`text-[9px] italic ${s.textMuted} leading-relaxed flex-1`}>
          &ldquo;{isKn ? data.message.kn : data.message.en}&rdquo;
        </p>

        {/* Footer */}
        <div className={`pt-2 border-t ${s.divider} flex justify-between items-center`}>
          <p className={`text-[8px] ${s.textMuted}`}>{isKn ? 'ವೈದಿಕ ಜ್ಞಾನದ ಲಯ' : 'The Rhythm of Vedic Wisdom'}</p>
          <p className={`text-[8px] font-medium ${s.accent}`}>vedrith.com</p>
        </div>
      </div>
    </div>
  )
}

// ── Story card (9:16 portrait) ────────────────────────────────────────────────

function StoryCard({ data, s }: { data: ShareCardData; s: (typeof THEME_STYLES)[ShareCardTheme] }) {
  const isKn = data.lang === 'kn'

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border-2 ${s.bg} ${s.border} flex flex-col`}
      style={{ aspectRatio: '9/16' }}
      data-share-card
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <MandalaRing size={500} opacity={0.04} theme={data.theme} />
        <MandalaRing size={350} opacity={0.06} theme={data.theme} />
        <MandalaRing size={220} opacity={0.10} theme={data.theme} />
        <MandalaRing size={130} opacity={0.14} theme={data.theme} />
      </div>

      {/* Top header */}
      <div className={`relative z-10 flex items-center justify-between px-6 pt-8 pb-5 border-b ${s.divider}`}>
        <div>
          <p className={`text-sm tracking-[0.3em] uppercase font-bold ${s.accent}`}>VedRith</p>
          <p className={`text-[10px] ${s.textMuted}`}>{isKn ? 'ವೈದಿಕ ಜ್ಞಾನದ ಲಯ' : 'The Rhythm of Vedic Wisdom'}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${s.accent}`}>{data.vara.nameKn}</p>
          <p className={`text-[10px] ${s.textMuted}`}>{data.dateDisplay.split(',')[1]?.trim()}</p>
        </div>
      </div>

      {/* Festival */}
      {data.festival && (
        <div className={`relative z-10 mx-6 mt-5 rounded-2xl px-5 py-3 text-center ${s.accentBg} border ${s.border}`}>
          <p className={`text-[10px] tracking-[0.2em] uppercase ${s.accent} font-medium`}>{isKn ? 'ಹಬ್ಬ' : 'Festival'}</p>
          <p className={`text-lg font-semibold ${s.text} leading-tight`}>
            {isKn ? data.festival.nameKn : data.festival.nameEn}
          </p>
        </div>
      )}

      {/* Deity — centre-stage */}
      <div className="relative z-10 text-center px-6 mt-6">
        <p className="text-6xl mb-2">{data.deity.symbol}</p>
        <p className={`text-[11px] tracking-[0.2em] uppercase ${s.textMuted}`}>{isKn ? 'ಇಂದಿನ ದೈವ' : 'Deity of the Day'}</p>
        <p className={`text-2xl font-semibold ${s.accent} mt-1`}>
          {isKn ? data.deity.nameKn : data.deity.nameEn}
        </p>
        <p className={`text-sm italic ${s.textMuted} mt-1`}>{data.deity.mantraEn}</p>
      </div>

      <div className={`mx-6 my-5 border-t ${s.divider}`} aria-hidden />

      {/* Five angas */}
      <div className="relative z-10 px-5 grid grid-cols-5 gap-2">
        <AngaCell label={isKn ? 'ತಿಥಿ' : 'Tithi'}     value={isKn ? data.tithi.nameKn : data.tithi.name}         accent s={s} />
        <AngaCell label={isKn ? 'ನಕ್ಷತ್ರ' : 'Nakshatra'} value={isKn ? data.nakshatra.nameKn : data.nakshatra.name} s={s} />
        <AngaCell label={isKn ? 'ಯೋಗ' : 'Yoga'}        value={isKn && data.yoga.nameKn ? data.yoga.nameKn : data.yoga.name} s={s} />
        <AngaCell label={isKn ? 'ಕರಣ' : 'Karana'}      value={isKn && data.karana.nameKn ? data.karana.nameKn : data.karana.name} s={s} />
        <AngaCell label={isKn ? 'ಮಾಸ' : 'Masa'}        value={isKn && data.masaKn ? data.masaKn : (data.masa ?? '')} s={s} />
      </div>

      {/* Times */}
      <div className="relative z-10 px-5 mt-3 space-y-1.5">
        <TimeRow icon="🌅" label={isKn ? 'ಸೂರ್ಯೋದಯ' : 'Sunrise'}    value={data.sunrise} s={s} />
        <TimeRow icon="🌇" label={isKn ? 'ಸೂರ್ಯಾಸ್ತ' : 'Sunset'}      value={data.sunset}  s={s} />
        <TimeRow icon="⚠️" label={isKn ? 'ರಾಹು ಕಾಲ' : 'Rahu Kalam'} value={`${data.rahuKalam.start} – ${data.rahuKalam.end}`} s={s} />
      </div>

      {/* Auspicious */}
      <div className={`relative z-10 mx-6 mt-4 rounded-xl p-3 ${s.accentBg} border ${s.divider}`}>
        <div className="flex gap-4 justify-center text-center">
          <div>
            <p className={`text-[8px] uppercase tracking-wider ${s.textMuted}`}>{isKn ? 'ಬಣ್ಣ' : 'Colour'}</p>
            <p className={`text-xs font-semibold ${s.text}`}>{isKn ? data.auspicious.colour.kn : data.auspicious.colour.en}</p>
          </div>
          <div>
            <p className={`text-[8px] uppercase tracking-wider ${s.textMuted}`}>{isKn ? 'ಸಂಖ್ಯೆ' : 'Number'}</p>
            <p className={`text-xs font-semibold ${s.accent}`}>{data.auspicious.number}</p>
          </div>
          <div>
            <p className={`text-[8px] uppercase tracking-wider ${s.textMuted}`}>{isKn ? 'ದಿಕ್ಕು' : 'Direction'}</p>
            <p className={`text-xs font-semibold ${s.text}`}>{isKn ? data.auspicious.direction.kn : data.auspicious.direction.en}</p>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="relative z-10 px-6 mt-4 flex-1 flex items-center">
        <p className={`text-xs italic text-center leading-relaxed ${s.textMuted}`}>
          &ldquo;{isKn ? data.message.kn : data.message.en}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className={`relative z-10 mt-auto px-6 pb-8 pt-4 border-t ${s.divider} flex items-center justify-between`}>
        <p className={`text-[10px] ${s.textMuted}`}>{data.locationName}</p>
        <p className={`text-[10px] font-bold ${s.accent}`}>vedrith.com</p>
      </div>
    </div>
  )
}

// ── Main exported component ───────────────────────────────────────────────────

interface ShareCardProps {
  data:      ShareCardData
  className?: string
  id?:        string
}

export function ShareCard({ data, className = '', id }: ShareCardProps) {
  const s = THEME_STYLES[data.theme] ?? THEME_STYLES.traditional

  return (
    <div
      id={id}
      className={`w-full font-sans antialiased select-none ${className}`}
      aria-label={`VedRith Daily Panchanga card — ${data.dateDisplay}`}
    >
      {data.format === 'landscape' ? (
        <LandscapeCard data={data} s={s} />
      ) : data.format === 'story' ? (
        <StoryCard data={data} s={s} />
      ) : (
        <SquareCard data={data} s={s} />
      )}
    </div>
  )
}
