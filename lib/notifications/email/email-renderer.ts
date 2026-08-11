// =============================================================================
// VedRith Notification Platform Phase 1 — Email Renderer
// Lightweight template renderer with {{variable}} substitution.
// Sanitises HTML to prevent XSS in email bodies.
// No external templating library dependency.
// =============================================================================

// ── Core renderer ─────────────────────────────────────────────────────────────

/**
 * Replace {{variable_name}} tokens in a template string.
 * Unknown variables are replaced with an empty string.
 * Variable values are HTML-escaped to prevent injection in HTML contexts.
 */
export function renderTemplate(
  template: string,
  vars:     Record<string, string>,
  escapeHtml = false,
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const value = vars[key.trim()] ?? ''
    return escapeHtml ? htmlEscape(value) : value
  })
}

export function renderHtmlTemplate(
  template: string,
  vars:     Record<string, string>,
): string {
  return renderTemplate(template, vars, true)
}

function htmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ── Validate required variables ───────────────────────────────────────────────

export function validateTemplateVars(
  template:  { variables: Array<{ name: string; required: boolean }> },
  provided:  Record<string, string>,
): string[] {
  return template.variables
    .filter(v => v.required && !provided[v.name])
    .map(v => v.name)
}

// ── Action URL renderer ───────────────────────────────────────────────────────

export function renderActionUrl(
  template: string | null,
  vars:     Record<string, string>,
  baseUrl?: string,
): string | null {
  if (!template) return null
  const rendered = renderTemplate(template, vars, false)
  if (rendered.startsWith('/') && baseUrl) {
    return `${baseUrl.replace(/\/$/, '')}${rendered}`
  }
  return rendered
}

// ── Full email render ─────────────────────────────────────────────────────────

export interface EmailRenderResult {
  subject:   string
  textBody:  string
  htmlBody:  string | null
  actionUrl: string | null
}

export function renderEmailTemplate(
  template: {
    subject:           string | null
    text_body:         string
    html_body?:        string | null
    action_url_template?: string | null
    variables?:        Array<{ name: string; required: boolean }>
  },
  vars:    Record<string, string>,
  baseUrl?: string,
): EmailRenderResult {
  return {
    subject:   template.subject
      ? renderTemplate(template.subject, vars)
      : (vars.subject ?? 'VedRith Notification'),
    textBody:  renderTemplate(template.text_body, vars),
    htmlBody:  template.html_body
      ? renderHtmlTemplate(template.html_body, vars)
      : null,
    actionUrl: renderActionUrl(
      template.action_url_template ?? null,
      vars,
      baseUrl,
    ),
  }
}
