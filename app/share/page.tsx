import type { Metadata } from 'next';
import SharePageClient from '@/components/share/SharePageClient';
export const metadata: Metadata={title:'Share Panchanga | VedRith',description:"Generate and download today's Panchanga as a JPG."};
export default function Page(){return <SharePageClient/>;}
