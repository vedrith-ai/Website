// ─────────────────────────────────────────────────────────────────────────────
// VedRith — OpenRouter Client  [V1]
//
// Provides AI-enhanced contextual explanations via OpenRouter free models.
// ALL astronomy and rule evaluation is done deterministically — OpenRouter
// is ONLY used to generate rich narrative explanations from structured data.
//
// Free model fallback chain (in order of preference):
//   1. meta-llama/llama-3.3-8b-instruct:free
//   2. google/gemma-3-9b-it:free
//   3. mistralai/mistral-7b-instruct:free
//   4. qwen/qwen3-8b:free
//   5. deepseek/deepseek-r1:free
//
// If ALL models fail → returns the static fallback text.
// ─────────────────────────────────────────────────────────────────────────────

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'

/** Free models in priority order */
const FREE_MODELS = [
  'meta-llama/llama-3.3-8b-instruct:free',
  'google/gemma-3-9b-it:free',
  'mistralai/mistral-7b-instruct:free',
  'qwen/qwen3-8b:free',
  'deepseek/deepseek-r1:free',
] as const

export type FreeModel = typeof FREE_MODELS[number]

export interface OpenRouterMessage {
  role:    'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterRequest {
  model:       string
  messages:    OpenRouterMessage[]
  max_tokens?: number
  temperature?: number
}

export interface OpenRouterResponse {
  id:      string
  choices: Array<{
    message: { role: string; content: string }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens:     number
    completion_tokens: number
    total_tokens:      number
  }
}

export interface AIExplanationResult {
  text:        string
  model:       string | null
  fromCache:   boolean
  fromFallback: boolean
}

// ── In-memory cache ───────────────────────────────────────────────────────────
// Key: SHA-like hash of the prompt; Value: { text, model, ts }
const _explanationCache = new Map<string, { text: string; model: string; ts: number }>()
const CACHE_TTL_MS = 60 * 60 * 1000   // 1 hour
const CACHE_MAX    = 500

function cacheKey(system: string, user: string): string {
  // Simple but stable key
  return `${system.slice(0, 60)}|||${user.slice(0, 100)}`
}

function pruneCache(): void {
  if (_explanationCache.size < CACHE_MAX) return
  const now = Date.now()
  for (const [k, v] of _explanationCache) {
    if (now - v.ts > CACHE_TTL_MS) _explanationCache.delete(k)
  }
  // If still too large, clear oldest 20%
  if (_explanationCache.size >= CACHE_MAX) {
    const entries = [..._explanationCache.entries()]
      .sort((a, b) => a[1].ts - b[1].ts)
    entries.slice(0, Math.floor(CACHE_MAX * 0.2)).forEach(([k]) => _explanationCache.delete(k))
  }
}

// ── Single model call ─────────────────────────────────────────────────────────

async function callModel(
  model: string,
  messages: OpenRouterMessage[],
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      'HTTP-Referer':  'https://vedrith.sharvasit.in',
      'X-Title':       'VedRith Panchanga',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens:  maxTokens,
      temperature: 0.3,   // Low temperature for consistent, accurate outputs
    } satisfies OpenRouterRequest),
    signal: AbortSignal.timeout(12_000),   // 12s timeout per model
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`OpenRouter ${model} returned ${res.status}: ${body.slice(0, 120)}`)
  }

  const data: OpenRouterResponse = await res.json()
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error(`Empty response from ${model}`)
  return content
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Generate an AI-enhanced contextual explanation with automatic model fallback.
 *
 * @param systemPrompt  The system instruction (defines role and output format)
 * @param userPrompt    The specific request containing structured Panchanga data
 * @param fallbackText  Static text returned if ALL models fail
 * @param maxTokens     Max tokens in response (default 400)
 */
export async function generateExplanation(
  systemPrompt: string,
  userPrompt:   string,
  fallbackText: string,
  maxTokens   = 400
): Promise<AIExplanationResult> {
  // Check cache first
  const key     = cacheKey(systemPrompt, userPrompt)
  const cached  = _explanationCache.get(key)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return { text: cached.text, model: cached.model, fromCache: true, fromFallback: false }
  }

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user',   content: userPrompt   },
  ]

  let lastError: Error | null = null

  for (const model of FREE_MODELS) {
    try {
      const text = await callModel(model, messages, maxTokens)

      // Cache the result
      pruneCache()
      _explanationCache.set(key, { text, model, ts: Date.now() })

      return { text, model, fromCache: false, fromFallback: false }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      // Try next model
      continue
    }
  }

  // All models failed — return static fallback
  console.error('[OpenRouter] All free models failed:', lastError?.message)
  return { text: fallbackText, model: null, fromCache: false, fromFallback: true }
}

/**
 * System prompt for Panchanga contextual explanations.
 * Instructs the model to act as a classical Vedic almanac explainer.
 */
export const SYSTEM_PROMPT_EXPLAINER = `You are VedRith, an expert in classical Vedic astrology and the Panchanga (Hindu almanac) tradition. You explain Panchanga elements in simple, respectful language accessible to modern readers.

Rules you MUST follow:
1. Be concise — maximum 3 short paragraphs
2. Never generate horoscope predictions, fate claims, or interpretive content about a specific person
3. Always explain WHY an element has the quality it does (cite the ruling deity, planetary ruler, or classical principle)
4. Mention one practical observance or suggestion connected to the element
5. Do NOT mention Swiss Ephemeris, software libraries, or technical calculation methods
6. Respond in the same language as the request (English or Kannada)
7. Return plain text only — no markdown, no bullet points, no headers`

/** Check if OpenRouter is configured (API key present) */
export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}
