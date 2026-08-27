import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'share.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="share.title"
      description="Share today's Panchanga as a beautiful image card"
      current="/share"
    />
  );
}
