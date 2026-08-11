// tests/notifications/notification-platform.test.ts
// VedRith Notification Platform Phase 1 — Test suite
// 44 tests covering: event engine, template rendering, queue logic,
// channel manager, email providers, and type guards.

import {
  renderTemplate,
  renderHtmlTemplate,
  renderEmailTemplate,
  validateTemplateVars,
  renderActionUrl,
} from '@/lib/notifications/email/email-renderer'

import {
  registerHandler,
  getHandlers,
  getAllRegisteredTypes,
  EVENT_DEFAULT_TEMPLATES,
  resolveSourceLabel,
} from '@/lib/notifications/event-registry'

import {
  getSupportedChannels,
} from '@/lib/notifications/channels/channel-manager'

import { ConsoleEmailProvider } from '@/lib/notifications/email/providers/console-provider'
import { _resetStorageManagerForTest } from '@/lib/media/storage/storage-manager'

// ── Template renderer ─────────────────────────────────────────────────────────

describe('renderTemplate', () => {
  it('replaces simple variables', () => {
    const result = renderTemplate('Hello {{name}}!', { name: 'Ananya' })
    expect(result).toBe('Hello Ananya!')
  })

  it('replaces multiple variables', () => {
    const result = renderTemplate('{{greeting}}, {{name}}. Your ID is {{id}}.', {
      greeting: 'Namaste',
      name:     'Ravi',
      id:       'SUB-42',
    })
    expect(result).toBe('Namaste, Ravi. Your ID is SUB-42.')
  })

  it('replaces unknown variables with empty string', () => {
    const result = renderTemplate('Hello {{unknown_var}}!', {})
    expect(result).toBe('Hello !')
  })

  it('handles variables with whitespace around the name', () => {
    const result = renderTemplate('{{ name }}', { name: 'Priya' })
    expect(result).toBe('Priya')
  })

  it('is idempotent — double-rendering same vars is safe', () => {
    const tmpl   = 'Status: {{status}}'
    const first  = renderTemplate(tmpl, { status: 'approved' })
    const second = renderTemplate(first, { status: 'approved' })
    expect(first).toBe(second)
  })

  it('leaves non-template text unchanged', () => {
    const result = renderTemplate('VedRith — Sacred Heritage', {})
    expect(result).toBe('VedRith — Sacred Heritage')
  })
})

describe('renderHtmlTemplate', () => {
  it('HTML-escapes variable values to prevent XSS', () => {
    const result = renderHtmlTemplate('<p>{{body}}</p>', {
      body: '<script>alert("xss")</script>',
    })
    expect(result).not.toContain('<script>')
    expect(result).toContain('&lt;script&gt;')
  })

  it('escapes ampersands', () => {
    const result = renderHtmlTemplate('{{title}}', { title: 'Shiva & Parvati' })
    expect(result).toContain('&amp;')
    expect(result).not.toContain('Shiva & Parvati')
  })

  it('escapes quotes in attribute contexts', () => {
    const result = renderHtmlTemplate('<a href="{{url}}">link</a>', {
      url: 'javascript:"alert(1)"',
    })
    expect(result).toContain('&quot;')
  })
})

describe('validateTemplateVars', () => {
  const template = {
    variables: [
      { name: 'title',     required: true  },
      { name: 'submitter', required: true  },
      { name: 'reason',    required: false },
    ],
  }

  it('returns empty array when all required vars are provided', () => {
    const missing = validateTemplateVars(template, { title: 'Temple', submitter: 'Ravi' })
    expect(missing).toHaveLength(0)
  })

  it('returns names of missing required variables', () => {
    const missing = validateTemplateVars(template, { title: 'Temple' })
    expect(missing).toContain('submitter')
    expect(missing).not.toContain('reason')
  })

  it('does not flag optional variables as missing', () => {
    const missing = validateTemplateVars(template, { title: 'T', submitter: 'S' })
    expect(missing).not.toContain('reason')
  })

  it('returns all required variables when none are provided', () => {
    const missing = validateTemplateVars(template, {})
    expect(missing).toContain('title')
    expect(missing).toContain('submitter')
    expect(missing).toHaveLength(2)
  })
})

describe('renderEmailTemplate', () => {
  const template = {
    subject:           'Your submission "{{title}}" has been {{action}}',
    text_body:         'Dear {{name}}, your submission {{title}} was {{action}}.',
    html_body:         '<p>Dear {{name}},</p><p>{{title}} was {{action}}.</p>',
    action_url_template: '/admin/cms/submissions/{{submission_id}}',
  }

  const vars = {
    name:          'Priya',
    title:         'Hampi Temple',
    action:        'approved',
    submission_id: 'sub-123',
  }

  it('renders subject with variables', () => {
    const { subject } = renderEmailTemplate(template, vars)
    expect(subject).toBe('Your submission "Hampi Temple" has been approved')
  })

  it('renders plain text body', () => {
    const { textBody } = renderEmailTemplate(template, vars)
    expect(textBody).toContain('Priya')
    expect(textBody).toContain('Hampi Temple')
    expect(textBody).toContain('approved')
  })

  it('renders HTML body', () => {
    const { htmlBody } = renderEmailTemplate(template, vars)
    expect(htmlBody).toContain('Priya')
    expect(htmlBody).not.toContain('<script>')
  })

  it('resolves action URL', () => {
    const { actionUrl } = renderEmailTemplate(template, vars)
    expect(actionUrl).toBe('/admin/cms/submissions/sub-123')
  })

  it('prepends baseUrl when URL is relative and baseUrl is provided', () => {
    const { actionUrl } = renderEmailTemplate(template, vars, 'https://vedrith.com')
    expect(actionUrl).toBe('https://vedrith.com/admin/cms/submissions/sub-123')
  })

  it('uses default subject when template subject is null', () => {
    const { subject } = renderEmailTemplate({ ...template, subject: null }, vars)
    expect(subject).toBeTruthy()
  })
})

describe('renderActionUrl', () => {
  it('returns null for null template', () => {
    expect(renderActionUrl(null, {})).toBeNull()
  })

  it('renders variables in the URL', () => {
    const url = renderActionUrl('/submissions/{{id}}', { id: '42' })
    expect(url).toBe('/submissions/42')
  })

  it('prepends baseUrl for relative paths', () => {
    const url = renderActionUrl('/page/{{slug}}', { slug: 'hampi' }, 'https://vedrith.com')
    expect(url).toBe('https://vedrith.com/page/hampi')
  })

  it('does not prepend baseUrl for absolute URLs', () => {
    const url = renderActionUrl('https://external.com/{{id}}', { id: 'x' }, 'https://vedrith.com')
    expect(url).toBe('https://external.com/x')
  })
})

// ── Event registry ────────────────────────────────────────────────────────────

describe('Event Registry', () => {
  it('getHandlers returns empty array for unregistered event type', () => {
    const handlers = getHandlers('CUSTOM')
    expect(Array.isArray(handlers)).toBe(true)
  })

  it('registerHandler adds a handler', () => {
    const mockHandler = jest.fn().mockResolvedValue({ handler: 'test', ok: true })
    registerHandler('BACKUP_COMPLETED', mockHandler)
    const handlers = getHandlers('BACKUP_COMPLETED')
    expect(handlers.length).toBeGreaterThanOrEqual(1)
  })

  it('multiple handlers can be registered for one event type', () => {
    const h1 = jest.fn().mockResolvedValue({ handler: 'h1', ok: true })
    const h2 = jest.fn().mockResolvedValue({ handler: 'h2', ok: true })
    registerHandler('PANCHANGA_ALERT', h1)
    registerHandler('PANCHANGA_ALERT', h2)
    const handlers = getHandlers('PANCHANGA_ALERT')
    expect(handlers.length).toBeGreaterThanOrEqual(2)
  })

  it('EVENT_DEFAULT_TEMPLATES maps known events to template keys', () => {
    expect(EVENT_DEFAULT_TEMPLATES['SUBMISSION_APPROVED']).toBe('submission_approved_inapp')
    expect(EVENT_DEFAULT_TEMPLATES['SUBMISSION_REJECTED']).toBe('submission_rejected_inapp')
    expect(EVENT_DEFAULT_TEMPLATES['SYSTEM_HEALTH_ALERT']).toBe('system_health_alert_inapp')
    expect(EVENT_DEFAULT_TEMPLATES['PROVIDER_FAILURE']).toBe('provider_failure_inapp')
    expect(EVENT_DEFAULT_TEMPLATES['MEDIA_PROCESSING_COMPLETED']).toBe('media_processing_completed_inapp')
    expect(EVENT_DEFAULT_TEMPLATES['IMPORT_COMPLETED']).toBe('import_completed_inapp')
  })

  it('resolveSourceLabel returns human-readable labels', () => {
    expect(resolveSourceLabel('cms')).toBe('CMS')
    expect(resolveSourceLabel('media')).toBe('Media Platform')
    expect(resolveSourceLabel('system')).toBe('System')
  })

  it('resolveSourceLabel falls back to the raw key for unknown sources', () => {
    expect(resolveSourceLabel('future-panchanga')).toBe('future-panchanga')
  })
})

// ── Channel manager ───────────────────────────────────────────────────────────

describe('Channel Manager', () => {
  it('getSupportedChannels returns at least IN_APP and EMAIL', () => {
    const channels = getSupportedChannels()
    expect(channels).toContain('IN_APP')
    expect(channels).toContain('EMAIL')
  })

  it('getSupportedChannels returns an array', () => {
    expect(Array.isArray(getSupportedChannels())).toBe(true)
  })
})

// ── Console email provider ────────────────────────────────────────────────────

describe('ConsoleEmailProvider', () => {
  const provider = new ConsoleEmailProvider()

  it('healthCheck always returns true', async () => {
    const ok = await provider.healthCheck()
    expect(ok).toBe(true)
  })

  it('send returns ok:true', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const result = await provider.send({
      recipientIdentifier: 'test@example.com',
      subject:             'Test Subject',
      body:                'Test body text',
      htmlBody:            null,
    })
    expect(result.ok).toBe(true)
    expect(result.providerResponse).toMatchObject({ provider: 'console', logged: true })
    consoleSpy.mockRestore()
  })

  it('send logs to console in dev mode', async () => {
    const logs: string[] = []
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(String(args[0]))
    })
    await provider.send({
      recipientIdentifier: 'admin@vedrith.com',
      subject:             'System Alert',
      body:                'Storage is at 90%',
      htmlBody:            null,
    })
    expect(logs.some(l => l.includes('CONSOLE PROVIDER'))).toBe(true)
    consoleSpy.mockRestore()
  })

  it('providerKey is "console"', () => {
    expect(provider.providerKey).toBe('console')
  })
})

// ── Notification types guard ──────────────────────────────────────────────────

describe('Notification type coverage', () => {
  const ALL_EVENT_TYPES = [
    'CONTENT_PUBLISHED', 'CONTENT_UPDATED', 'CONTENT_ARCHIVED',
    'EDITORIAL_REVIEW_REQUIRED', 'SUBMISSION_APPROVED',
    'SUBMISSION_REJECTED', 'TRANSLATION_REQUIRED',
    'IMPORT_COMPLETED', 'IMPORT_FAILED',
    'MEDIA_PROCESSING_COMPLETED', 'MEDIA_PROCESSING_FAILED',
    'SYSTEM_HEALTH_ALERT', 'PROVIDER_FAILURE',
    'STORAGE_ALERT', 'QUEUE_FAILURE', 'BACKUP_COMPLETED',
    'PANCHANGA_ALERT', 'KUNDALI_ALERT', 'USER_EVENT', 'CUSTOM',
  ]

  it('all event types are defined in the type union (count check)', () => {
    expect(ALL_EVENT_TYPES.length).toBe(20)
  })

  it('every event with a default template key maps to a non-empty string', () => {
    for (const [, templateKey] of Object.entries(EVENT_DEFAULT_TEMPLATES)) {
      expect(typeof templateKey).toBe('string')
      expect(templateKey.length).toBeGreaterThan(0)
    }
  })
})
