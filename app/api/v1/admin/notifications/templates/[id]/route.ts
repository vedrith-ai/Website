import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/templates/[id]/route.ts
// GET  : template detail
// PATCH: update template + preview action

import { NextRequest, NextResponse }  from 'next/server'
import {
  getTemplateById,
  updateTemplate,
  previewTemplate,
} from '@/lib/services/notification-template-service'

export const dynamic = 'force-dynamic'
type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { id }   = await params
    const template = await getTemplateById(id)
    if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ template })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { id }   = await params
    const body     = await request.json() as Record<string, unknown>
    const action   = body.action as string | undefined

    // Preview mode — render without saving
    if (action === 'preview') {
      const vars    = (body.vars as Record<string, string>) ?? {}
      const preview = await previewTemplate(id, vars)
      return NextResponse.json({ preview })
    }

    const updated = await updateTemplate(id, {
      name:              body.name              as string | undefined,
      description:       body.description       as string | undefined,
      subject:           body.subject           as string | undefined,
      htmlBody:          body.htmlBody          as string | undefined,
      textBody:          body.textBody          as string | undefined,
      icon:              body.icon              as string | undefined,
      category:          body.category          as string | undefined,
      actionUrlTemplate: body.actionUrlTemplate as string | undefined,
      variables:         body.variables         as [] | undefined,
      examplePayload:    body.examplePayload    as Record<string, unknown> | undefined,
      isActive:          body.isActive          as boolean | undefined,
      autoSend:          body.autoSend          as boolean | undefined,
    })
    return NextResponse.json({ template: updated })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
