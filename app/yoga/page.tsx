import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'yoga.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="yoga.page.title"
      description="Auspicious and inauspicious Yoga combinations"
      current="/yoga"
    />
  );
}
