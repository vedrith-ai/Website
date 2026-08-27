import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'muhurta.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="muhurta.title"
      description="Find auspicious times for important events"
      current="/muhurta"
    />
  );
}
