import { gregorianToJD } from '@/lib/engines/ephemeris/julian-day'
import { computeAscendant } from '@/lib/engines/kundali/ascendant'
import { computePlanetaryPositions } from '@/lib/engines/kundali/planetary-positions'
import { buildSouthIndianLayout, SOUTH_INDIAN_GRID_SIZE } from '@/lib/engines/kundali-chart/south-indian-layout'
import { buildNorthIndianLayout } from '@/lib/engines/kundali-chart/north-indian-layout'
import { buildHousePlacements, groupPlanetsByHouse } from '@/lib/engines/kundali-chart/house-placement'
import { buildKundaliChart } from '@/lib/engines/kundali-chart/chart-builder'
import { parseKundaliGenerateBody } from '@/lib/validators/kundali-generate-query'
import { InMemoryKundaliRepository } from '@/lib/db/in-memory-kundali-repository'
import { ALL_PLANETS } from '@/lib/types/kundali'
import type { KundaliFormInput } from '@/lib/types/kundali-chart'

const REF: KundaliFormInput = {
  name:'Ravi Kumar', gender:'MALE', dateOfBirth:'1990-08-09', timeOfBirth:'14:30',
  timezone:'Asia/Kolkata', latitude:12.9716, longitude:77.5946,
  placeName:'Bengaluru, Karnataka', ayanamsha:'LAHIRI', houseSystem:'WHOLE_SIGN',
}
const JD = gregorianToJD(1990,8,9,9.0)

// §1 South Indian Layout
describe('[V1] buildSouthIndianLayout', () => {
  const planets=computePlanetaryPositions(JD), asc=computeAscendant(JD,12.9716,77.5946)

  test('returns 12 cells', () => expect(buildSouthIndianLayout(asc.rashi,planets)).toHaveLength(12))
  test('all 12 rashis 0-11 present exactly once', () => {
    const r=buildSouthIndianLayout(asc.rashi,planets).map(c=>c.rashi).sort((a,b)=>a-b)
    expect(r).toEqual([0,1,2,3,4,5,6,7,8,9,10,11])
  })
  test('row/col within 0-3', () => {
    for(const c of buildSouthIndianLayout(asc.rashi,planets)){
      expect(c.row).toBeGreaterThanOrEqual(0); expect(c.row).toBeLessThan(SOUTH_INDIAN_GRID_SIZE)
      expect(c.col).toBeGreaterThanOrEqual(0); expect(c.col).toBeLessThan(SOUTH_INDIAN_GRID_SIZE)
    }
  })
  test('exactly one ascendant cell', () => expect(buildSouthIndianLayout(asc.rashi,planets).filter(c=>c.isAscendant)).toHaveLength(1))
  test('ascendant cell has houseNumber=1', () => expect(buildSouthIndianLayout(asc.rashi,planets).find(c=>c.isAscendant)!.houseNumber).toBe(1))
  test('house numbers 1-12 each once', () => {
    const h=buildSouthIndianLayout(asc.rashi,planets).map(c=>c.houseNumber).sort((a,b)=>a-b)
    expect(h).toEqual([1,2,3,4,5,6,7,8,9,10,11,12])
  })
  test('Aries at row0 col1', () => {
    const a=buildSouthIndianLayout(asc.rashi,planets).find(c=>c.rashi===0)!
    expect(a.row).toBe(0); expect(a.col).toBe(1)
  })
  test('total 9 planets across all cells', () => expect(buildSouthIndianLayout(asc.rashi,planets).reduce((s,c)=>s+c.planets.length,0)).toBe(9))
  test('each planet in exactly one cell', () => {
    const all=buildSouthIndianLayout(asc.rashi,planets).flatMap(c=>c.planets)
    expect(new Set(all).size).toBe(9); expect(all).toHaveLength(9)
  })
  test('planet rashi matches cell rashi', () => {
    for(const cell of buildSouthIndianLayout(asc.rashi,planets))
      for(const p of cell.planets) expect(planets[p].rashi).toBe(cell.rashi)
  })
})

// §2 North Indian Layout
describe('[V1] buildNorthIndianLayout', () => {
  const planets=computePlanetaryPositions(JD), asc=computeAscendant(JD,12.9716,77.5946), S=300

  test('returns 12 slots', () => expect(buildNorthIndianLayout(asc.rashi,planets,S)).toHaveLength(12))
  test('slot numbers 1-12', () => {
    const n=buildNorthIndianLayout(asc.rashi,planets,S).map(s=>s.slot).sort((a,b)=>a-b)
    expect(n).toEqual([1,2,3,4,5,6,7,8,9,10,11,12])
  })
  test('slot 1 is ascendant', () => {
    const s1=buildNorthIndianLayout(asc.rashi,planets,S).find(s=>s.slot===1)!
    expect(s1.isAscendant).toBe(true); expect(s1.rashi).toBe(asc.rashi)
  })
  test('rashis progress clockwise from ascendant', () => {
    const slots=buildNorthIndianLayout(asc.rashi,planets,S).sort((a,b)=>a.slot-b.slot)
    for(let i=0;i<12;i++) expect(slots[i].rashi).toBe((asc.rashi+i)%12)
  })
  test('all points within [0,size]', () => {
    for(const s of buildNorthIndianLayout(asc.rashi,planets,S))
      for(const pt of s.points){expect(pt.x).toBeGreaterThanOrEqual(0);expect(pt.x).toBeLessThanOrEqual(S);expect(pt.y).toBeGreaterThanOrEqual(0);expect(pt.y).toBeLessThanOrEqual(S)}
  })
  test('pointsAttr is valid coordinate string', () => {
    for(const s of buildNorthIndianLayout(asc.rashi,planets,S)) expect(s.pointsAttr).toMatch(/[\d.,]+ [\d.,]+/)
  })
  test('total 9 planets across all slots', () => expect(buildNorthIndianLayout(asc.rashi,planets,S).reduce((s,sl)=>s+sl.planets.length,0)).toBe(9))
})

// §3 House Placements
describe('[V1] buildHousePlacements', () => {
  const planets=computePlanetaryPositions(JD), asc=computeAscendant(JD,12.9716,77.5946)
  const cusps=Array.from({length:12},(_,i)=>(asc.rashi*30+i*30)%360)

  test('all 9 planets have placement', () => {
    const p=buildHousePlacements(planets,cusps)
    for(const pId of ALL_PLANETS) expect(p).toHaveProperty(pId)
  })
  test('all house numbers in [1,12]', () => {
    for(const h of Object.values(buildHousePlacements(planets,cusps))){expect(h).toBeGreaterThanOrEqual(1);expect(h).toBeLessThanOrEqual(12)}
  })
  test('groupPlanetsByHouse returns 12 houses', () => expect(Object.keys(groupPlanetsByHouse(buildHousePlacements(planets,cusps)))).toHaveLength(12))
  test('total planets in groupPlanetsByHouse = 9', () => expect(Object.values(groupPlanetsByHouse(buildHousePlacements(planets,cusps))).reduce((s,ps)=>s+ps.length,0)).toBe(9))
  test('Whole Sign: planet house matches (rashi - ascRashi + 12) % 12 + 1', () => {
    const p=buildHousePlacements(planets,cusps)
    for(const pId of ALL_PLANETS) expect(p[pId]).toBe(((planets[pId].rashi-asc.rashi+12)%12)+1)
  })
  test('South Indian cell planets match house placements', () => {
    const p=buildHousePlacements(planets,cusps)
    for(const cell of buildSouthIndianLayout(asc.rashi,planets))
      for(const pId of cell.planets) expect(p[pId]).toBe(cell.houseNumber)
  })
})

// §4 Chart Builder
describe('[V1] buildKundaliChart', () => {
  test('returns success', async () => expect((await buildKundaliChart(REF)).success).toBe(true))
  test('id starts with kc_', async () => {
    const r=await buildKundaliChart(REF)
    if(!r.success)throw new Error()
    expect(r.data.id).toMatch(/^kc_/)
  })
  test('JD ≈ 2448112.875', async () => {
    const r=await buildKundaliChart(REF)
    if(!r.success)throw new Error()
    expect(r.data.chart.birthData.julianDay).toBeCloseTo(2448112.875,2)
  })
  test('all 9 planets present', async () => {
    const r=await buildKundaliChart(REF)
    if(!r.success)throw new Error()
    for(const p of ALL_PLANETS){expect(r.data.chart.planets[p].rashi).toBeGreaterThanOrEqual(0);expect(r.data.chart.planets[p].rashi).toBeLessThanOrEqual(11)}
  })
  test('house placements: all in [1,12]', async () => {
    const r=await buildKundaliChart(REF)
    if(!r.success)throw new Error()
    for(const h of Object.values(r.data.housePlacements)){expect(h).toBeGreaterThanOrEqual(1);expect(h).toBeLessThanOrEqual(12)}
  })
  test('birthTithi endTime is a Date (proves real computeTithi called)', async () => {
    const r=await buildKundaliChart(REF)
    if(!r.success)throw new Error()
    expect(r.data.birthTithi.endTime).toBeInstanceOf(Date)
  })
  test('invalid date returns INVALID_DATE without throwing', async () => {
    const r=await buildKundaliChart({...REF,dateOfBirth:'bad'})
    expect(r.success).toBe(false)
    if(r.success)throw new Error()
    expect(r.error.code).toBe('INVALID_DATE')
  })
  test('each call produces unique id', async () => {
    const [r1,r2]=await Promise.all([buildKundaliChart(REF),buildKundaliChart(REF)])
    if(!r1.success||!r2.success)throw new Error()
    expect(r1.data.id).not.toBe(r2.data.id)
  })
  test('chart planets match direct Foundation call (zero duplication proof)', async () => {
    const r=await buildKundaliChart(REF)
    if(!r.success)throw new Error()
    const direct=computePlanetaryPositions(r.data.chart.birthData.julianDay,'LAHIRI')
    expect(r.data.chart.planets.SUN.longitude).toBeCloseTo(direct.SUN.longitude,4)
    expect(r.data.chart.planets.MOON.rashi).toBe(direct.MOON.rashi)
  })
})

// §5 Validator
describe('[V1] parseKundaliGenerateBody', () => {
  const V={name:'Ravi',gender:'MALE',dateOfBirth:'1990-08-09',timeOfBirth:'14:30',timezone:'Asia/Kolkata',latitude:12.9716,longitude:77.5946,placeName:'Bengaluru'}
  test('valid body passes', () => expect(parseKundaliGenerateBody(V).success).toBe(true))
  test('missing name fails', () => expect(parseKundaliGenerateBody({...V,name:''}).success).toBe(false))
  test('invalid gender fails', () => expect(parseKundaliGenerateBody({...V,gender:'ROBOT'}).success).toBe(false))
  test('all genders accepted', () => { for(const g of ['MALE','FEMALE','OTHER']) expect(parseKundaliGenerateBody({...V,gender:g}).success).toBe(true) })
  test('invalid date fails', () => expect(parseKundaliGenerateBody({...V,dateOfBirth:'09-08-1990'}).success).toBe(false))
  test('invalid time fails', () => expect(parseKundaliGenerateBody({...V,timeOfBirth:'2:30 PM'}).success).toBe(false))
  test('latitude out of range fails', () => expect(parseKundaliGenerateBody({...V,latitude:91}).success).toBe(false))
  test('longitude out of range fails', () => expect(parseKundaliGenerateBody({...V,longitude:-181}).success).toBe(false))
  test('ayanamsha defaults to LAHIRI', () => { const r=parseKundaliGenerateBody(V); if(!r.success)throw new Error(); expect(r.data.ayanamsha).toBe('LAHIRI') })
  test('houseSystem defaults to WHOLE_SIGN', () => { const r=parseKundaliGenerateBody(V); if(!r.success)throw new Error(); expect(r.data.houseSystem).toBe('WHOLE_SIGN') })
  test('all 4 ayanamshas accepted', () => { for(const a of ['LAHIRI','KP','RAMAN','TRUE_CHITRA']) expect(parseKundaliGenerateBody({...V,ayanamsha:a}).success).toBe(true) })
  test('all 3 house systems accepted', () => { for(const h of ['WHOLE_SIGN','EQUAL','PLACIDUS']) expect(parseKundaliGenerateBody({...V,houseSystem:h}).success).toBe(true) })
})

// §6 Repository
describe('[V1] InMemoryKundaliRepository', () => {
  test('create then getById returns same record', async () => {
    const repo=new InMemoryKundaliRepository()
    const r=await buildKundaliChart(REF); if(!r.success)throw new Error()
    const stored=await repo.create(r.data)
    const got=await repo.getById(stored.id)
    expect(got).not.toBeNull(); expect(got!.name).toBe('Ravi Kumar')
  })
  test('getById returns null for unknown id', async () => expect(await new InMemoryKundaliRepository().getById('nope')).toBeNull())
  test('two charts stored independently', async () => {
    const repo=new InMemoryKundaliRepository()
    const [r1,r2]=await Promise.all([buildKundaliChart(REF),buildKundaliChart({...REF,name:'Priya',gender:'FEMALE'})])
    if(!r1.success||!r2.success)throw new Error()
    await repo.create(r1.data); await repo.create(r2.data)
    expect((await repo.getById(r1.data.id))!.name).toBe('Ravi Kumar')
    expect((await repo.getById(r2.data.id))!.name).toBe('Priya')
  })
})

// §7 Reference Validation
describe('[V1] Reference chart — Bengaluru 1990-08-09 14:30 IST', () => {
  let cr: Awaited<ReturnType<typeof buildKundaliChart>>
  beforeAll(async()=>{ cr=await buildKundaliChart(REF) })

  test('generates successfully', () => expect(cr.success).toBe(true))
  test('Lahiri ayanamsha ≈ 23.65° for Aug 1990', () => {
    if(!cr.success)throw new Error()
    expect(cr.data.chart.ayanamshaValue).toBeGreaterThan(23.5); expect(cr.data.chart.ayanamshaValue).toBeLessThan(23.9)
  })
  test('Sun sidereal in Cancer (rashi 3) for Aug 9 1990', () => {
    if(!cr.success)throw new Error()
    expect(cr.data.chart.planets.SUN.rashi).toBe(3)
  })
  test('Moon nakshatra in [1,27]', () => {
    if(!cr.success)throw new Error()
    expect(cr.data.chart.planets.MOON.nakshatra).toBeGreaterThanOrEqual(1); expect(cr.data.chart.planets.MOON.nakshatra).toBeLessThanOrEqual(27)
  })
  test('South Indian Sun cell rashi matches SUN.rashi', () => {
    if(!cr.success)throw new Error()
    const cells=buildSouthIndianLayout(cr.data.chart.ascendant.rashi,cr.data.chart.planets)
    expect(cells.find(c=>c.planets.includes('SUN'))!.rashi).toBe(cr.data.chart.planets.SUN.rashi)
  })
  test('North Indian slot 1 rashi = ascendant rashi', () => {
    if(!cr.success)throw new Error()
    const slots=buildNorthIndianLayout(cr.data.chart.ascendant.rashi,cr.data.chart.planets)
    expect(slots.find(s=>s.slot===1)!.rashi).toBe(cr.data.chart.ascendant.rashi)
  })
  test('house placements consistent with South Indian layout', () => {
    if(!cr.success)throw new Error()
    const p=buildHousePlacements(cr.data.chart.planets,cr.data.chart.houseCusps.cusps)
    for(const cell of buildSouthIndianLayout(cr.data.chart.ascendant.rashi,cr.data.chart.planets))
      for(const pId of cell.planets) expect(p[pId]).toBe(cell.houseNumber)
  })
  test('birthTithi/Yoga/Karana have valid quality', () => {
    if(!cr.success)throw new Error()
    const Q=['SHUBHA','ASHUBHA','MIXED']
    expect(Q).toContain(cr.data.birthTithi.quality); expect(Q).toContain(cr.data.birthYoga.quality); expect(Q).toContain(cr.data.birthKarana.quality)
  })
  test('createdAt === updatedAt (freshly created)', () => {
    if(!cr.success)throw new Error()
    expect(cr.data.createdAt).toBe(cr.data.updatedAt)
  })
})
