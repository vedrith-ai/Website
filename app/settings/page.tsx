import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'settings.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="settings.title"
      description="Language, region and notification preferences"
      current="/settings"
    />
  );
}
