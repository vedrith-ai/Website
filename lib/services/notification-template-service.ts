// =============================================================================
// VedRith Notification Platform Phase 1 — Notification Template Service
// CRUD, preview, and versioning for notification templates.
// Editable from the CMS — integrates with the existing editorial studio.
// =============================================================================

import { getSupabaseAdminClient }      from '@/lib/supabase/admin'
import { renderEmailTemplate }         from '@/lib/notifications/email/email-renderer'
import type {
  NotificationTemplate,
  TemplateVariable,
  NotificationChannelType,
  NotificationEventType,
} from '@/lib/types/notifications'

// ── DB row mapper ─────────────────────────────────────────────────────────────

function mapDbTemplate(row: Record<string, unknown>): NotificationTemplate {
  return {
    id:                 row.id                   as string,
    templateKey:        row.template_key         as string,
    name:               row.name                 as string,
    description:        (row.description         as string) ?? null,
    channel:            row.channel              as NotificationChannelType,
    subject:            (row.subject             as string) ?? null,
    htmlBody:           (row.html_body           as string) ?? null,
    textBody:           row.text_body            as string,
    icon:               (row.icon               as string) ?? null,
    category:           (row.category            as string) ?? null,
    actionUrlTemplate:  (row.action_url_template as string) ?? null,
    variables:          (row.variables           as TemplateVariable[]) ?? [],
    examplePayload:     (row.example_payload     as Record<string, unknown>) ?? {},
    isActive:           row.is_active            as boolean,
    version:            row.version              as number,
    eventType:          (row.event_type          as NotificationEventType) ?? null,
    autoSend:           row.auto_send            as boolean,
    createdBy:          (row.created_by          as string) ?? null,
    createdAt:          row.created_at           as string,
    updatedAt:          row.updated_at           as string,
  }
}

// ── List ──────────────────────────────────────────────────────────────────────

export async function listTemplates(params: {
  channel?:  NotificationChannelType
  isActive?: boolean
  search?:   string
} = {}): Promise<NotificationTemplate[]> {
  const admin = getSupabaseAdminClient()
  let query = admin.from('notification_templates').select('*').order('name')

  if (params.channel  !== undefined) query = query.eq('channel', params.channel)
  if (params.isActive !== undefined) query = query.eq('is_active', params.isActive)
  if (params.search)                 query = query.ilike('name', `%${params.search}%`)

  const { data } = await query
  return (data ?? []).map(row => mapDbTemplate(row as Record<string, unknown>))
}

// ── Get by ID or key ──────────────────────────────────────────────────────────

export async function getTemplateById(id: string): Promise<NotificationTemplate | null> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin.from('notification_templates').select('*').eq('id', id).single()
  return data ? mapDbTemplate(data as Record<string, unknown>) : null
}

export async function getTemplateByKey(key: string): Promise<NotificationTemplate | null> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin
    .from('notification_templates')
    .select('*')
    .eq('template_key', key)
    .eq('is_active', true)
    .single()
  return data ? mapDbTemplate(data as Record<string, unknown>) : null
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createTemplate(params: {
  templateKey:       string
  name:              string
  description?:      string
  channel:           NotificationChannelType
  subject?:          string
  htmlBody?:         string
  textBody:          string
  icon?:             string
  category?:         string
  actionUrlTemplate?: string
  variables?:        TemplateVariable[]
  examplePayload?:   Record<string, unknown>
  eventType?:        NotificationEventType
  autoSend?:         boolean
  createdBy?:        string
}): Promise<NotificationTemplate> {
  const admin = getSupabaseAdminClient()
  const { data, error } = await admin
    .from('notification_templates')
    .insert({
      template_key:        params.templateKey,
      name:                params.name,
      description:         params.description      ?? null,
      channel:             params.channel,
      subject:             params.subject           ?? null,
      html_body:           params.htmlBody          ?? null,
      text_body:           params.textBody,
      icon:                params.icon              ?? null,
      category:            params.category          ?? null,
      action_url_template: params.actionUrlTemplate ?? null,
      variables:           params.variables         ?? [],
      example_payload:     params.examplePayload    ?? {},
      event_type:          params.eventType         ?? null,
      auto_send:           params.autoSend          ?? false,
      created_by:          params.createdBy         ?? null,
    })
    .select()
    .single()

  if (error || !data) throw new Error(`Failed to create template: ${error?.message}`)
  return mapDbTemplate(data as Record<string, unknown>)
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateTemplate(
  id:     string,
  params: Partial<{
    name:              string
    description:       string
    subject:           string
    htmlBody:          string
    textBody:          string
    icon:              string
    category:          string
    actionUrlTemplate: string
    variables:         TemplateVariable[]
    examplePayload:    Record<string, unknown>
    isActive:          boolean
    autoSend:          boolean
  }>,
): Promise<NotificationTemplate> {
  const admin = getSupabaseAdminClient()

  const updates: Record<string, unknown> = {}
  if (params.name              !== undefined) updates.name               = params.name
  if (params.description       !== undefined) updates.description        = params.description
  if (params.subject           !== undefined) updates.subject            = params.subject
  if (params.htmlBody          !== undefined) updates.html_body          = params.htmlBody
  if (params.textBody          !== undefined) updates.text_body          = params.textBody
  if (params.icon              !== undefined) updates.icon               = params.icon
  if (params.category          !== undefined) updates.category           = params.category
  if (params.actionUrlTemplate !== undefined) updates.action_url_template = params.actionUrlTemplate
  if (params.variables         !== undefined) updates.variables          = params.variables
  if (params.examplePayload    !== undefined) updates.example_payload    = params.examplePayload
  if (params.isActive          !== undefined) updates.is_active          = params.isActive
  if (params.autoSend          !== undefined) updates.auto_send          = params.autoSend

  // Increment version on content changes
  if (params.textBody || params.htmlBody || params.subject) {
    const { data: current } = await admin.from('notification_templates').select('version').eq('id', id).single()
    updates.version = ((current as { version: number } | null)?.version ?? 1) + 1
  }

  const { data, error } = await admin
    .from('notification_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) throw new Error(`Failed to update template: ${error?.message}`)
  return mapDbTemplate(data as Record<string, unknown>)
}

// ── Preview ───────────────────────────────────────────────────────────────────

export async function previewTemplate(
  id:   string,
  vars: Record<string, string> = {},
): Promise<{ subject: string | null; body: string; htmlBody: string | null; actionUrl: string | null }> {
  const tmpl = await getTemplateById(id)
  if (!tmpl) throw new Error('Template not found')

  // Merge example payload with provided vars
  const mergedVars: Record<string, string> = {}
  for (const [k, v] of Object.entries(tmpl.examplePayload)) {
    mergedVars[k] = String(v)
  }
  Object.assign(mergedVars, vars)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vedrith.com'
  const rendered = renderEmailTemplate(
    {
      subject:              tmpl.subject,
      text_body:            tmpl.textBody,
      html_body:            tmpl.htmlBody,
      action_url_template:  tmpl.actionUrlTemplate,
    },
    mergedVars,
    baseUrl,
  )
  return {
    subject:   rendered.subject ?? null,
    body:      rendered.textBody,
    htmlBody:  rendered.htmlBody,
    actionUrl: rendered.actionUrl,
  }
}
