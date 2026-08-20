import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'hero.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="hero.title"
      description="Admin access — HMAC protected"
      current="/admin"
    />
  );
}
