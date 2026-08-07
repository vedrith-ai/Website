'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Share Card Generator  [V1.3]
//
// Full share card UI:
//   • Theme selector (traditional / modern / kannada)
//   • Format selector (square / story / landscape)
//   • Language selector (en / kn)
//   • Live preview
//   • Download / Share / Copy buttons
//
// Takes a PanchangaResult and builds ShareCardData internally via buildShareCardData.
// NO duplicate calculations — reuses engine output.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { PanchangaResult } from '@/lib/types/panchanga'
import type { ShareCardTheme, ShareCardFormat, ShareCardLang } from '@/lib/share/types'
import { buildShareCardData } from '@/lib/share/builder'
import { ShareCard }          from './ShareCard'
import { ShareButton }        from './ShareButton'

const CARD_ID = 'vedrith-share-card-preview'

// ── Selector chip ─────────────────────────────────────────────────────────────

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
        active
          ? 'bg-amber-500 text-black'
          : 'border border-border bg-muted/20 text-muted-foreground hover:bg-muted/50'
      }`}
    >
      {label}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface ShareCardGeneratorProps {
  result:     PanchangaResult
  /** If true, renders as an inline panel. Otherwise as a modal-ready card. */
  inline?:    boolean
  onClose?:   () => void
}

export function ShareCardGenerator({ result, inline = false, onClose }: ShareCardGeneratorProps) {
  const [theme,  setTheme]  = useState<ShareCardTheme>('traditional')
  const [format, setFormat] = useState<ShareCardFormat>('square')
  const [lang,   setLang]   = useState<ShareCardLang>(result.lang === 'kn' ? 'kn' : 'en')

  const cardData = buildShareCardData(result, { theme, format, lang })

  return (
    <div className={`flex flex-col gap-5 ${inline ? '' : 'p-5'}`}>

      {/* Header */}
      {!inline && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Share Today&apos;s Panchanga</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Customise and share your daily card</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Options row */}
      <div className="flex flex-wrap gap-4">

        {/* Theme */}
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Theme</p>
          <div className="flex gap-1.5">
            <Chip label="Traditional" active={theme === 'traditional'} onClick={() => setTheme('traditional')} />
            <Chip label="Modern"      active={theme === 'modern'}      onClick={() => setTheme('modern')} />
            <Chip label="Kannada"     active={theme === 'kannada'}     onClick={() => setTheme('kannada')} />
          </div>
        </div>

        {/* Format */}
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Format</p>
          <div className="flex gap-1.5">
            <Chip label="Square 1:1"    active={format === 'square'}    onClick={() => setFormat('square')} />
            <Chip label="Story 9:16"    active={format === 'story'}     onClick={() => setFormat('story')} />
            <Chip label="Landscape 2:1" active={format === 'landscape'} onClick={() => setFormat('landscape')} />
          </div>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Language</p>
          <div className="flex gap-1.5">
            <Chip label="English" active={lang === 'en'} onClick={() => setLang('en')} />
            <Chip label="ಕನ್ನಡ"   active={lang === 'kn'} onClick={() => setLang('kn')} />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className={`w-full mx-auto overflow-hidden rounded-xl border border-border/40 bg-muted/10 p-3 ${
        format === 'story'     ? 'max-w-[280px]'  :
        format === 'landscape' ? 'max-w-full'      : 'max-w-[360px]'
      }`}>
        <ShareCard data={cardData} id={CARD_ID} />
      </div>

      {/* Share actions */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Share</p>
        <ShareButton
          data={cardData}
          cardElementId={CARD_ID}
          onShare={(result) => {
            if (result.success) console.info('[ShareCard] shared via', result.action)
          }}
        />
      </div>

      {/* Info note */}
      <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
        For best image quality, use Download and then share from your photo gallery.
        The &ldquo;Share&rdquo; button uses native device sharing.
      </p>
    </div>
  )
}
