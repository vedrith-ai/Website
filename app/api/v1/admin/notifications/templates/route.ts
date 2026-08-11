import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/templates/route.ts
// GET : list all templates
// POST: create new template

import { NextRequest, NextResponse }  from 'next/server'
import {
  listTemplates,
  createTemplate,
} from '@/lib/services/notification-template-service'
import type { NotificationChannelType } from '@/lib/types/notifications'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const templates = await listTemplates({
      channel:  searchParams.get('channel') as NotificationChannelType | null ?? undefined,
      isActive: searchParams.get('isActive') === 'false' ? false : true,
      search:   searchParams.get('search') ?? undefined,
    })
    return NextResponse.json({ templates, total: templates.length })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const body = await request.json() as Record<string, unknown>
    if (!body.templateKey || !body.name || !body.channel || !body.textBody) {
      return NextResponse.json(
        { error: 'Required: templateKey, name, channel, textBody' },
        { status: 400 },
      )
    }

    const template = await createTemplate({
      templateKey:        body.templateKey  as string,
      name:               body.name         as string,
      description:        body.description  as string | undefined,
      channel:            body.channel      as NotificationChannelType,
      subject:            body.subject      as string | undefined,
      htmlBody:           body.htmlBody     as string | undefined,
      textBody:           body.textBody     as string,
      icon:               body.icon         as string | undefined,
      category:           body.category     as string | undefined,
      actionUrlTemplate:  body.actionUrlTemplate as string | undefined,
      variables:          body.variables    as [] | undefined,
      examplePayload:     body.examplePayload as Record<string, unknown> | undefined,
      autoSend:           body.autoSend     as boolean | undefined,
      createdBy:          'admin',
    })
    return NextResponse.json({ template }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
