import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computePanchanga } from '@/lib/engines/panchanga';
import { parsePanchangaQuery } from '@/lib/validators/panchanga-query';

export const runtime='nodejs';
export const maxDuration=30;

const regionMap: Record<string,string> = {
  KARNATAKA:'KANNADA', ANDHRA:'TELUGU', TAMIL_NADU:'TAMIL', KERALA:'MALAYALAM',
  MAHARASHTRA:'MAHARASHTRIAN', NATIONAL:'NORTH_INDIAN',
};

const BodySchema=z.object({
  date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  latitude:z.number().min(-90).max(90),
  longitude:z.number().min(-180).max(180),
  timezone:z.string().min(1),
  region:z.string().default('KARNATAKA'),
  lang:z.enum(['en','kn']).default('en'),
  calendarSystem:z.enum(['AMANTA','PURNIMANTA']).default('AMANTA'),
});

function mapInput(raw: Record<string, unknown>) {
  const region=regionMap[raw.region] ?? raw.region ?? 'KANNADA';
  return {date:raw.date,lat:Number(raw.latitude??raw.lat),lng:Number(raw.longitude??raw.lng),timezone:raw.timezone,
    locationName:raw.locationName||'',region,ayanamsha:raw.ayanamsha||'LAHIRI',lang:raw.lang||'en',calendarSystem:raw.calendarSystem||'AMANTA'};
}

async function compute(raw: Record<string, unknown>) {
  const mappedSource = mapInput(raw)
  const mapped: Record<string, string | undefined> = {
    date: String(mappedSource.date ?? ''),
    lat: String(mappedSource.lat ?? ''),
    lng: String(mappedSource.lng ?? ''),
    timezone: String(mappedSource.timezone ?? ''),
    locationName: mappedSource.locationName ? String(mappedSource.locationName) : undefined,
    region: mappedSource.region ? String(mappedSource.region) : undefined,
    ayanamsha: mappedSource.ayanamsha ? String(mappedSource.ayanamsha) : undefined,
    lang: mappedSource.lang ? String(mappedSource.lang) : undefined,
    calendarSystem: mappedSource.calendarSystem ? String(mappedSource.calendarSystem) : undefined,
  }
  const parsed=parsePanchangaQuery(mapped);
  if(!parsed.success) return parsed;
  return {success:true as const,data:await computePanchanga(parsed.data)};
}

export async function POST(req:NextRequest){
  try{
    const raw=await req.json();
    const parsed=BodySchema.safeParse(raw);
    if(!parsed.success) return NextResponse.json({success:false,error:'Invalid request',code:'VALIDATION_ERROR'},{status:400});
    const out=await compute(parsed.data);
    if(!out.success) return NextResponse.json({success:false,error:{code:'INVALID_QUERY',message:out.error.errors[0].message}},{status:422});
    return NextResponse.json({success:true,data:out.data,meta:{request_id:`req_${Date.now().toString(36)}`,computed_at:out.data.computedAt,cache_hit:false}});
  }catch(e){console.error('[panchanga compatibility]',e);return NextResponse.json({success:false,error:'Calculation error',code:'INTERNAL_ERROR'},{status:500});}
}

export async function GET(req:NextRequest){
  try{
    const sp=req.nextUrl.searchParams;
    const raw=Object.fromEntries(sp.entries());
    const out=await compute(raw);
    if(!out.success) return NextResponse.json({success:false,error:{code:'INVALID_QUERY',message:out.error.errors[0].message}},{status:422});
    return NextResponse.json({success:true,data:out.data,meta:{request_id:`req_${Date.now().toString(36)}`,computed_at:out.data.computedAt,cache_hit:false}});
  }catch(e){console.error('[panchanga compatibility GET]',e);return NextResponse.json({success:false,error:'Calculation error',code:'INTERNAL_ERROR'},{status:500});}
}
