'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/index'
import { addRecentSearch, getRecentSearches } from '@/lib/storage/preferences'
import type { RecentSearch } from '@/lib/storage/preferences'

export type SearchCategory = 'nakshatra'|'tithi'|'rashi'|'graha'|'festival'|'muhurta'|'term'

export interface SearchResult {
  id: string; category: SearchCategory; nameEn: string; nameKn: string
  description: string; score: number; href: string; icon?: string
}

const CATALOG: SearchResult[] = [
  ...(['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Moola','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'] as const).map((n,i)=>({
    id:`nk-${i+1}`, category:'nakshatra' as SearchCategory, nameEn:n, nameKn:n, description:`Nakshatra ${i+1} of 27`, score:1, href:'/panchanga', icon:'⭐'
  })),
  ...(['Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima','Amavasya'] as const).map((n,i)=>({
    id:`ti-${i+1}`, category:'tithi' as SearchCategory, nameEn:n, nameKn:n, description:`Tithi ${i+1}`, score:1, href:'/panchanga', icon:'🌙'
  })),
  {id:'gr-1',category:'graha',nameEn:'Sun (Surya)',nameKn:'ಸೂರ್ಯ',description:'The Sun — Atma, life force',score:1,href:'/panchanga',icon:'☉'},
  {id:'gr-2',category:'graha',nameEn:'Moon (Chandra)',nameKn:'ಚಂದ್ರ',description:'The Moon — mind, emotion',score:1,href:'/panchanga',icon:'☽'},
  {id:'gr-3',category:'graha',nameEn:'Mars (Mangala)',nameKn:'ಕುಜ',description:'Mars — courage, energy',score:1,href:'/panchanga',icon:'♂'},
  {id:'gr-4',category:'graha',nameEn:'Mercury (Budha)',nameKn:'ಬುಧ',description:'Mercury — intellect, trade',score:1,href:'/panchanga',icon:'☿'},
  {id:'gr-5',category:'graha',nameEn:'Jupiter (Guru)',nameKn:'ಗುರು',description:'Jupiter — wisdom, dharma',score:1,href:'/panchanga',icon:'♃'},
  {id:'gr-6',category:'graha',nameEn:'Venus (Shukra)',nameKn:'ಶುಕ್ರ',description:'Venus — beauty, love',score:1,href:'/panchanga',icon:'♀'},
  {id:'gr-7',category:'graha',nameEn:'Saturn (Shani)',nameKn:'ಶನಿ',description:'Saturn — karma, discipline',score:1,href:'/panchanga',icon:'♄'},
  {id:'gr-8',category:'graha',nameEn:'Rahu',nameKn:'ರಾಹು',description:'North Node — karmic desire',score:1,href:'/panchanga',icon:'☊'},
  {id:'gr-9',category:'graha',nameEn:'Ketu',nameKn:'ಕೇತು',description:'South Node — liberation',score:1,href:'/panchanga',icon:'☋'},
]

function fuzzyScore(q: string, item: SearchResult): number {
  const ql = q.toLowerCase()
  if (item.nameEn.toLowerCase()===ql||item.nameKn===ql) return 1
  if (item.nameEn.toLowerCase().startsWith(ql)||item.nameKn.startsWith(ql)) return 0.9
  if (item.nameEn.toLowerCase().includes(ql)||item.nameKn.includes(ql)) return 0.7
  return 0
}

export function search(query: string, limit=8): SearchResult[] {
  if (query.length<2) return []
  return CATALOG.map(i=>({...i,score:fuzzyScore(query,i)})).filter(i=>i.score>0).sort((a,b)=>b.score-a.score).slice(0,limit)
}

export function SearchTrigger({ className='' }: { className?: string }) {
  const [open,setOpen] = useState(false)
  const {lang} = useTranslation()
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setOpen(true)}}
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h)
  },[])
  return (<>
    <button onClick={()=>setOpen(true)} aria-label="Search" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-cream-100/60 hover:text-cream-100 text-sm transition-colors ${className}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <span className="hidden sm:inline">{lang==='kn'?'ಹುಡುಕಿ…':'Search…'}</span>
      <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white/10">⌘K</kbd>
    </button>
    {open && <SearchModal onClose={()=>setOpen(false)} />}
  </>)
}

function SearchModal({ onClose }: { onClose:()=>void }) {
  const [query,setQuery]=useState(''); const [results,setResults]=useState<SearchResult[]>([])
  const [active,setActive]=useState(0); const inputRef=useRef<HTMLInputElement>(null)
  const [recentSearches,setRecentSearches]=useState<RecentSearch[]>([])
  const router=useRouter(); const {lang}=useTranslation()
  useEffect(()=>{inputRef.current?.focus(); setRecentSearches(getRecentSearches())},[])
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h)},[onClose])
  useEffect(()=>{document.body.style.overflow='hidden';return()=>{document.body.style.overflow=''}},[])
  const onQ=(q:string)=>{setQuery(q);setResults(search(q));setActive(0)}
  const toSearchType = (cat: SearchCategory): RecentSearch['type'] => {
    if (cat === 'festival') return 'festival'
    if (cat === 'muhurta')  return 'panchanga'
    return 'knowledge' // nakshatra, tithi, rashi, graha, term
  }
  const go=(href:string,term:string,cat: SearchCategory = 'nakshatra')=>{
    addRecentSearch(term, toSearchType(cat))
    router.push(href); onClose()
  }
  const onKD=(e:React.KeyboardEvent)=>{
    if(e.key==='ArrowDown'){e.preventDefault();setActive(a=>Math.min(a+1,results.length-1))}
    else if(e.key==='ArrowUp'){e.preventDefault();setActive(a=>Math.max(a-1,0))}
    else if(e.key==='Enter'&&results[active]) go(results[active].href, results[active].nameEn, results[active].category)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 pt-16 sm:pt-4" onClick={e=>{if(e.target===e.currentTarget)onClose()}} role="dialog" aria-modal>
      <div className="w-full max-w-xl bg-navy-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream-100/40 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input ref={inputRef} type="search" value={query} onChange={e=>onQ(e.target.value)} onKeyDown={onKD} placeholder={lang==='kn'?'ನಕ್ಷತ್ರ, ತಿಥಿ, ಗ್ರಹ ಹುಡುಕಿ…':'Search Nakshatra, Tithi, Graha…'} className="flex-1 bg-transparent text-sm text-cream-100 placeholder:text-cream-100/30 outline-none"/>
          <button onClick={onClose} className="text-cream-100/40 hover:text-cream-100 p-1">✕</button>
        </div>
        {results.length>0?(
          <ul className="max-h-80 overflow-y-auto" role="listbox">
            {results.map((r,i)=>(
              <li key={r.id} role="option" aria-selected={i===active}>
                <button onClick={()=>go(r.href,r.nameEn,r.category)} onMouseEnter={()=>setActive(i)} className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-white/[0.04] last:border-0 ${i===active?'bg-white/5':'hover:bg-white/[0.03]'}`}>
                  <span className="text-lg shrink-0" aria-hidden>{r.icon??'📌'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream-100">{lang==='kn'?r.nameKn:r.nameEn}</p>
                    <p className="text-xs text-cream-100/50 truncate">{r.description}</p>
                  </div>
                  <span className="text-cream-100/20 text-xs">→</span>
                </button>
              </li>
            ))}
          </ul>
        ):query.length>=2?(
          <p className="py-8 text-center text-cream-100/40 text-sm">No results for &ldquo;{query}&rdquo;</p>
        ):(
          <div className="py-6 px-4 space-y-4">
            {recentSearches.length > 0 && (
              <div>
                <p className="text-cream-100/30 text-xs mb-2 uppercase tracking-wider">Recent</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0,6).map(s=>(
                    <button key={s.query} onClick={()=>onQ(s.query)} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-cream-100/60 hover:border-white/20 hover:text-cream-100/90 transition-colors">
                      {s.query}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-cream-100/30 text-xs mb-2 uppercase tracking-wider">Quick search</p>
              <div className="flex flex-wrap gap-2">
                {['Rohini','Ekadashi','Guru','Diwali','Lagna','Rahu Kalam'].map(t=>(
                  <button key={t} onClick={()=>onQ(t)} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-cream-100/50 hover:border-white/20 hover:text-cream-100/80 transition-colors">{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="px-4 py-2 border-t border-white/[0.05] text-[10px] text-cream-100/25">↑↓ navigate · Enter open · Esc close</div>
      </div>
    </div>
  )
}

// ── Alias for Header import compatibility ────────────────────────────────────
export { SearchModal as GlobalSearch }
