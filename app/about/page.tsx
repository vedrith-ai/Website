import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'about.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="about.title"
      description="About VedRith and Sharva's IT"
      current="/about"
    />
  );
}
