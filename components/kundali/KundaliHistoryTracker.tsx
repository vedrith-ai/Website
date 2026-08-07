'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Invisible client component that records a Kundali view into localStorage.
// Rendered server-side but executes client-side — zero render output.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { addRecentKundali } from '@/lib/storage/preferences'

interface Props {
  id:     string
  name:   string
  dob:    string
  tob:    string
  pob:    string
  lagna?: string
}

export default function KundaliHistoryTracker({ id, name, dob, tob, pob, lagna }: Props) {
  useEffect(() => {
    addRecentKundali({ id, name, dob, tob, pob, lagna })
  }, [id, name, dob, tob, pob, lagna])

  return null
}
