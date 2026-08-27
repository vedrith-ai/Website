import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildKundaliChart } from '@/lib/engines/kundali-chart';
import { getKundaliRepository } from '@/lib/db';

export const runtime='nodejs';
export const maxDuration=30;

const schema=z.object({
  name:z.string().min(1).max(120),
  gender:z.enum(['MALE','FEMALE','OTHER']).default('OTHER'),
  dob:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tob:z.string().regex(/^\d{2}:\d{2}$/),
  pob:z.string().min(1).max(160),
  latitude:z.number().min(-90).max(90),
  longitude:z.number().min(-180).max(180),
  timezone:z.string().min(1).default('Asia/Kolkata'),
  ayanamsha:z.enum(['LAHIRI','KP','RAMAN','TRUE_CHITRA']).default('LAHIRI'),
  houseSystem:z.enum(['WHOLE_SIGN','EQUAL','PLACIDUS']).default('WHOLE_SIGN'),
});

export async function POST(req:NextRequest){
  try{
    const raw=await req.json(); const parsed=schema.safeParse(raw);
    if(!parsed.success) return NextResponse.json({success:false,error:'Invalid request',code:'VALIDATION_ERROR'},{status:400});
    const v=parsed.data;
    const chart=await buildKundaliChart({
      name:v.name,gender:v.gender,dateOfBirth:v.dob,timeOfBirth:v.tob,
      timezone:v.timezone,latitude:v.latitude,longitude:v.longitude,placeName:v.pob,
      ayanamsha:v.ayanamsha,houseSystem:v.houseSystem
    });
    if(!chart.success) return NextResponse.json({success:false,error:chart.error,code:chart.error.code},{status:422});
    const stored=await getKundaliRepository().create(chart.data);
    return NextResponse.json({success:true,data:stored},{status:201});
  }catch(e){console.error('[kundali compatibility]',e);return NextResponse.json({success:false,error:'Calculation error',code:'INTERNAL_ERROR'},{status:500});}
}
