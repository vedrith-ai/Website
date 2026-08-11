// app/admin/notifications/templates/[id]/page.tsx
import { Suspense }       from 'react'
import Link              from 'next/link'
import { TemplateEditor } from '@/components/notifications/admin'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ id: string }> }
export default async function TemplateDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Edit Template</h1>
          <p className="text-sm text-stone-500 mt-1">Modify template content, variables, and settings.</p>
        </div>
        <Link href="/admin/notifications/templates" className="text-sm text-stone-400 hover:text-amber-600">← Templates</Link>
      </div>
      <Suspense fallback={<div className="h-96 bg-stone-100 rounded-xl animate-pulse" />}>
        <TemplateEditor templateId={id} />
      </Suspense>
    </div>
  )
}
