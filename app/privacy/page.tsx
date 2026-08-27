import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'footer.privacy | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="footer.privacy"
      description="Privacy policy for VedRith"
      current="/privacy"
    />
  );
}
