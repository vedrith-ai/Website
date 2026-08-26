import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getKundaliRepository } from '@/lib/db';
import KundaliChartShell from '@/components/kundali/KundaliChartShell';

interface Props { params: Promise<{id:string}> }

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {id}=await params;
  const record=await getKundaliRepository().getById(id).catch(()=>null);
  return record
    ? {title:`${record.name} — Janma Kundali | VedRith`,description:`Vedic birth chart for ${record.name}.`,robots:{index:false,follow:false}}
    : {title:'Chart Not Found | VedRith'};
}

export default async function KundaliChartPage({params}:Props){
  const {id}=await params;
  let record=null;
  try{record=await getKundaliRepository().getById(id);}catch{}
  if(!record) notFound();
  return <KundaliChartShell record={record}/>;
}
