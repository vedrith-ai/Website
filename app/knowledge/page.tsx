import type { Metadata } from 'next'; import KnowledgePageClient from '@/components/knowledge/KnowledgePageClient';
export const metadata: Metadata={title:'Knowledge | VedRith',description:'Learn the Panchanga and Jyotisha concepts used by VedRith.'};
export default function Page(){return <KnowledgePageClient/>;}
