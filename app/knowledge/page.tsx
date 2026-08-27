import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'knowledge.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="knowledge.title"
      description="Deep-dive articles on Vedic concepts"
      current="/knowledge"
    />
  );
}
