import type { ReactNode } from 'react'
import type { PanchangaResult } from '@/lib/types/panchanga'

interface Props {
  result: PanchangaResult
}

// ── Quality badge ─────────────────────────────────────────────────────────────
function QualityBadge({ quality }: { quality: 'SHUBHA' | 'ASHUBHA' | 'MIXED' }) {
  const styles = {
    SHUBHA:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    ASHUBHA: 'bg-red-500/10     text-red-400     border-red-500/25',
    MIXED:   'bg-gold-500/10    text-gold-400    border-gold-500/25',
  }
  const labels = { SHUBHA: 'Shubha', ASHUBHA: 'Ashubha', MIXED: 'Mixed' }
  return (
    <span className={`font-sans text-[0.58rem] tracking-[0.15em] uppercase px-2 py-0.5 border ${styles[quality]}`}>
      {labels[quality]}
    </span>
  )
}

// ── Time range display ────────────────────────────────────────────────────────
function TimeRangeRow({
  label,
  start,
  end,
  variant = 'warning',
}: {
  label:   string
  start:   string
  end:     string
  variant?: 'warning' | 'auspicious'
}) {
  const dotColor = variant === 'warning' ? 'bg-red-400' : 'bg-gold-400'
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-2.5">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} aria-hidden="true" />
        <span className="font-sans text-sm text-cream-100/70">{label}</span>
      </div>
      <span className="font-serif text-sm text-cream-100/90 font-light">
        {start} — {end}
      </span>
    </div>
  )
}

// ── Solar time row ────────────────────────────────────────────────────────────
function SolarRow({ icon, label, time }: { icon: string; label: string; time: string | null }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <span className="font-sans text-sm text-cream-100/70">{label}</span>
      </div>
      <span className="font-serif text-cream-100/90 font-light">
        {time ?? <span className="text-cream-100/30 text-xs">—</span>}
      </span>
    </div>
  )
}

// ── One of the five Panchanga limb cards ───────────────────────────────────────
function LimbCard({
  label,
  name,
  nameLocal,
  displayName,   // [V1.1]
  isKannada,     // [V1.1]
  sub,
  endLocal,
  quality,
  extra,
}: {
  label:      string
  name:       string
  nameLocal?: string
  displayName?: string   // [V1.1] EN/KN localized name from knowledge base
  isKannada?: boolean    // [V1.1] true when result.lang === 'kn' — applies Kannada font
  sub?:       string
  endLocal:   string
  quality:    'SHUBHA' | 'ASHUBHA' | 'MIXED'
  extra?:     ReactNode
}) {
  const showLocal = nameLocal && nameLocal !== name
  // [V1.1] Only show displayName separately if it differs from both name and nameLocal
  // (avoids redundant display when lang='en', since displayName would equal name)
  const showDisplayName = displayName && displayName !== name && displayName !== nameLocal
  return (
    <div className="relative bg-navy-800/50 border border-white/[0.07] p-5 hover:border-gold-500/30 transition-colors">
      <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">{label}</p>
      <p className="font-serif text-2xl font-light text-cream-100 mb-0.5 leading-snug">{name}</p>
      {showLocal && (
        <p className="font-sans text-xs text-gold-400/70 mb-1">{nameLocal}</p>
      )}
      {showDisplayName && (
        <p className={`font-sans text-sm text-cream-100/80 mb-1 ${isKannada ? 'font-kannada' : ''}`}>
          {displayName}
        </p>
      )}
      {sub && <p className="font-sans text-xs text-cream-100/50 mb-2">{sub}</p>}
      {extra}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
        <span className="font-sans text-[0.65rem] text-cream-100/35">{tr('Ends ','ಮುಕ್ತಾಯ ')}{endLocal}</span>
        <QualityBadge quality={quality} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function PanchangaResult({ result }: Props) {
  const {
    date, location, region, ayanamsha, ayanamshaValue,
    sunriseLocal, sunsetLocal, moonriseLocal, moonsetLocal,
    tithi, nakshatra, yoga, karana, vara,
    masa, samvatsara, lang,                         // [V1.1]
    rahuKalam, gulikaKalam, yamaganda, abhijitMuhurta,
    julianDay,
  } = result

  const isKannada = lang === 'kn'   // [V1.1]

  const displayDate = new Date(date + 'T12:00:00').toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const PAKSHA_ICON = tithi.paksha === 'SHUKLA' ? '🌕' : '🌑'

  return (
    <div className="space-y-6">

      {/* ── Result header ─────────────────────────────────────────────────── */}
      <div className="bg-navy-900/80 border border-gold-500/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500 mb-1">
              Panchanga
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream-100 leading-snug">
              {displayDate}
            </h2>
            <p className="font-sans text-sm text-cream-100/50 mt-1">
              📍 {location.name || `${location.lat.toFixed(2)}°N, ${location.lng.toFixed(2)}°E`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:text-right">
            <span className="inline-block font-sans text-[0.6rem] tracking-[0.15em] uppercase px-2.5 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/25">
              {region.replace('_', ' ')}
            </span>
            <span className="inline-block font-sans text-[0.6rem] tracking-[0.15em] uppercase px-2.5 py-1 bg-navy-800/60 text-cream-100/50 border border-white/10">
              {ayanamsha} {ayanamshaValue.toFixed(2)}°
            </span>
          </div>
        </div>
      </div>

      {/* ── Five Panchanga Limbs ───────────────────────────────────────────── */}
      <div>
        <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-gold-500/60 mb-4">
          {tr('Pañcāṅga — Five Limbs','ಪಂಚಾಂಗ — ಐದು ಅಂಗಗಳು')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {/* Tithi */}
          <LimbCard
            label="Tithi"
            name={tithi.name}
            nameLocal={tithi.nameLocal}
            displayName={tithi.displayName}
            isKannada={isKannada}
            sub={`${tithi.pakshaName} ${tr('Paksha','ಪಕ್ಷ')} · ${tithi.completed}% ${tr('elapsed','ಕಳೆದುಹೋಗಿದೆ')}`}
            endLocal={tithi.endLocal}
            quality={tithi.quality}
            extra={
              <span className="inline-flex items-center gap-1 font-sans text-[0.65rem] text-cream-100/40">
                <span>{PAKSHA_ICON}</span>
                <span>{tithi.paksha === 'SHUKLA' ? tr('Waxing Moon','ಶುಕ್ಲ ಪಕ್ಷ') : tr('Waning Moon','ಕೃಷ್ಣ ಪಕ್ಷ')}</span>
              </span>
            }
          />

          {/* Nakshatra */}
          <LimbCard
            label="Nakshatra"
            name={nakshatra.name}
            nameLocal={nakshatra.nameLocal}
            displayName={nakshatra.displayName}
            isKannada={isKannada}
            sub={`${tr('Pada','ಪಾದ')} ${nakshatra.pada} · ${tr('Lord','ಅಧಿದೇವತೆ')} ${nakshatra.ruler}`}
            endLocal={nakshatra.endLocal}
            quality={nakshatra.quality}
            extra={
              <p className="font-sans text-[0.65rem] text-cream-100/40">
                {tr('Deity:','ಅಧಿದೇವತೆ:')} {nakshatra.deity}
              </p>
            }
          />

          {/* Yoga */}
          <LimbCard
            label="Yoga"
            name={yoga.name}
            displayName={yoga.displayName}
            isKannada={isKannada}
            endLocal={yoga.endLocal}
            quality={yoga.quality}
          />

          {/* Karana */}
          <LimbCard
            label="Karana"
            name={karana.name}
            displayName={karana.displayName}
            isKannada={isKannada}
            sub={karana.isFixed ? tr('Sthira (Fixed)','ಸ್ಥಿರ (ನಿಶ್ಚಲ)') : tr('Chara (Movable)','ಚರ (ಚಲಿಸುವ)')}
            endLocal={karana.endLocal}
            quality={karana.quality}
          />

          {/* Vara */}
          <div className="relative bg-navy-800/50 border border-white/[0.07] p-5 hover:border-gold-500/30 transition-colors sm:col-span-2 lg:col-span-1">
            <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">Vara</p>
            <p className="font-serif text-2xl font-light text-cream-100 mb-0.5">{vara.name}</p>
            {vara.nameLocal !== vara.name && (
              <p className="font-sans text-xs text-gold-400/70 mb-1">{vara.nameLocal}</p>
            )}
            {vara.displayName && vara.displayName !== vara.name && vara.displayName !== vara.nameLocal && (
              <p className={`font-sans text-sm text-cream-100/80 mb-1 ${isKannada ? 'font-kannada' : ''}`}>
                {vara.displayName}
              </p>
            )}
            <p className="font-sans text-xs text-cream-100/50">{tr('Lord:','ಅಧಿದೇವತೆ:')} {vara.ruler}</p>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-end">
              <QualityBadge quality={vara.quality} />
            </div>
          </div>
        </div>
      </div>

      {/* ── [V1.1] Traditional Calendar Context — Paksha / Masa / Samvatsara ── */}
      <div>
        <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-gold-500/60 mb-4">
          {tr('Traditional Calendar — Paksha · Masa · Samvatsara','ಸಾಂಪ್ರದಾಯಿಕ ಕ್ಯಾಲೆಂಡರ್ — ಪಕ್ಷ · ಮಾಸ · ಸಂವತ್ಸರ')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Paksha */}
          <div className="bg-navy-800/50 border border-white/[0.07] p-5">
            <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">Paksha</p>
            <p className="font-serif text-2xl font-light text-cream-100 mb-0.5 leading-snug">
              {tithi.pakshaName} Paksha
            </p>
            <p className="font-sans text-xs text-cream-100/50 mt-2">
              {tithi.paksha === 'SHUKLA' ? 'Waxing fortnight (New Moon → Full Moon)' : 'Waning fortnight (Full Moon → New Moon)'}
            </p>
          </div>

          {/* Masa */}
          <div className="bg-navy-800/50 border border-white/[0.07] p-5">
            <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">
              Masa ({masa.calendarSystem === 'AMANTA' ? 'Amanta' : 'Purnimanta'})
            </p>
            <p className="font-serif text-2xl font-light text-cream-100 mb-0.5 leading-snug">
              {masa.current.name}
            </p>
            {masa.current.displayName !== masa.current.name && (
              <p className={`font-sans text-sm text-cream-100/80 mb-1 ${isKannada ? 'font-kannada' : ''}`}>
                {masa.current.displayName}
              </p>
            )}
            {masa.amanta.index !== masa.purnimanta.index && (
              <p className="font-sans text-xs text-cream-100/40 mt-2">
                {masa.calendarSystem === 'AMANTA'
                  ? `Purnimanta equivalent: ${masa.purnimanta.name}`
                  : `Amanta equivalent: ${masa.amanta.name}`}
              </p>
            )}
          </div>

          {/* Samvatsara */}
          <div className="bg-navy-800/50 border border-white/[0.07] p-5">
            <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-gold-500/70 mb-2">
              Samvatsara
            </p>
            <p className="font-serif text-2xl font-light text-cream-100 mb-0.5 leading-snug">
              {samvatsara.name}
            </p>
            {samvatsara.displayName !== samvatsara.name && (
              <p className={`font-sans text-sm text-cream-100/80 mb-1 ${isKannada ? 'font-kannada' : ''}`}>
                {samvatsara.displayName}
              </p>
            )}
            <p className="font-sans text-xs text-cream-100/50 mt-2">
              Shaka {samvatsara.shakaYear} · Vikram {samvatsara.vikramYear}
            </p>
          </div>
        </div>
      </div>

      {/* ── Solar and Lunar Times ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Solar times */}
        <div className="bg-navy-900/60 border border-white/[0.07] p-5">
          <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-3">
            {tr('Solar Times','ಸೂರ್ಯ ಸಮಯಗಳು')}
          </p>
          <SolarRow icon="🌅" label="Sunrise"  time={sunriseLocal} />
          <SolarRow icon="🌇" label="Sunset"   time={sunsetLocal}  />
        </div>

        {/* Lunar times */}
        <div className="bg-navy-900/60 border border-white/[0.07] p-5">
          <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-3">
            {tr('Lunar Times','ಚಂದ್ರ ಸಮಯಗಳು')}
          </p>
          <SolarRow icon="🌕" label="Moonrise" time={moonriseLocal} />
          <SolarRow icon="🌑" label="Moonset"  time={moonsetLocal}  />
        </div>
      </div>

      {/* ── Inauspicious Periods ──────────────────────────────────────────── */}
      <div className="bg-navy-900/60 border border-red-500/10 p-5">
        <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-red-400/70 mb-3">
          {tr('Inauspicious Periods — Avoid for New Beginnings','ಅಶುಭ ಕಾಲ — ಹೊಸ ಆರಂಭಗಳಿಗೆ ತಪ್ಪಿಸಿ')}
        </p>
        <TimeRangeRow label="Rahu Kalam"   start={rahuKalam.startLocal}   end={rahuKalam.endLocal}   variant="warning" />
        <TimeRangeRow label="Gulika Kalam" start={gulikaKalam.startLocal} end={gulikaKalam.endLocal} variant="warning" />
        <TimeRangeRow label="Yamaganda"    start={yamaganda.startLocal}   end={yamaganda.endLocal}   variant="warning" />
      </div>

      {/* ── Abhijit Muhurta ────────────────────────────────────────────────── */}
      <div className="bg-navy-900/60 border border-gold-500/20 p-5">
        <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-3">
          {tr('Auspicious Period','ಶುಭ ಕಾಲ')}
        </p>
        <TimeRangeRow
          label="Abhijit Muhurta"
          start={abhijitMuhurta.startLocal}
          end={abhijitMuhurta.endLocal}
          variant="auspicious"
        />
        <p className="font-sans text-xs text-cream-100/30 mt-2">
          {tr('The most universally auspicious 48-minute window, centred on solar noon.','ಸೂರ್ಯ ಮಧ್ಯಾಹ್ನದ ಸುತ್ತಲಿನ ಅತ್ಯಂತ ಶುಭ 48 ನಿಮಿಷಗಳ ಕಾಲ.')}
        </p>
      </div>

      {/* ── Technical metadata ────────────────────────────────────────────── */}
      <p className="font-sans text-[0.6rem] text-cream-100/20 text-right">
        JD {julianDay} · {ayanamsha} {ayanamshaValue.toFixed(4)}° · Computed {new Date(result.computedAt).toLocaleTimeString()}
      </p>
    </div>
  )
}
