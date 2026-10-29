/**
 * Live call-analysis adapter. Two steps behind one port:
 *   1. transcribe the recorded audio (e.g. a backend fronting Grabar Llamada
 *      or mlx-whisper),
 *   2. analyze the transcript with an LLM for coaching + next actions.
 *
 * Both endpoints are supplied by config (where they run is the open decision in
 * docs/ideas/grabar-llamada.md). Each returns JSON; the analysis response must
 * shape as `CallAnalysis`. Network/transport only — no domain logic here.
 */

import type { CallAnalysisProvider, CallContext, CallInput } from '../application/ports'
import type { CallAnalysis, CallRecordingAnalysis } from '../domain/types'

export interface LiveCallAnalysisConfig {
  /** Endpoint that accepts the audio and returns `{ transcript, durationSeconds? }`. */
  transcribeUrl: string
  /** Endpoint that accepts `{ transcript, context }` and returns a `CallAnalysis`. */
  analyzeUrl: string
  /** Optional bearer token for both endpoints. */
  token?: string
  /** Injectable for tests; defaults to global fetch. */
  fetchImpl?: typeof fetch
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { authorization: `Bearer ${token}` } : {}
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function toCallAnalysis(raw: unknown): CallAnalysis {
  const r = (raw ?? {}) as Record<string, unknown>
  return {
    summary: typeof r.summary === 'string' ? r.summary : '',
    improvements: toStringArray(r.improvements),
    followUps: toStringArray(r.followUps),
    offers: toStringArray(r.offers),
    nextSteps: toStringArray(r.nextSteps),
  }
}

export function createLiveCallAnalysisProvider(config: LiveCallAnalysisConfig): CallAnalysisProvider {
  const fetchImpl = config.fetchImpl ?? globalThis.fetch

  return {
    async analyzeCall(input: CallInput): Promise<CallRecordingAnalysis> {
      if (!input.audio) {
        throw new Error('No hay audio grabado para transcribir')
      }

      const form = new FormData()
      form.append('audio', input.audio, 'call.webm')
      const tRes = await fetchImpl(config.transcribeUrl, {
        method: 'POST',
        headers: authHeaders(config.token),
        body: form,
      })
      if (!tRes.ok) throw new Error(`Transcripción falló (${tRes.status})`)
      const tJson = (await tRes.json()) as { transcript?: unknown; durationSeconds?: unknown }
      const transcript = typeof tJson.transcript === 'string' ? tJson.transcript : ''
      const durationSeconds = typeof tJson.durationSeconds === 'number' ? tJson.durationSeconds : undefined

      const aRes = await fetchImpl(config.analyzeUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...authHeaders(config.token) },
        body: JSON.stringify({ transcript, context: input.context satisfies CallContext }),
      })
      if (!aRes.ok) throw new Error(`Análisis falló (${aRes.status})`)
      const analysis = toCallAnalysis(await aRes.json())

      return { transcript, durationSeconds, analysis }
    },
  }
}

/**
 * Build the live provider from Vite env, or `null` when the endpoints are not
 * configured — callers then fall back to the demo provider so the app still
 * runs. (`VITE_CALL_TRANSCRIBE_URL`, `VITE_CALL_ANALYZE_URL`, `VITE_CALL_TOKEN`.)
 */
export function liveCallAnalysisFromEnv(env: ImportMetaEnv): CallAnalysisProvider | null {
  const transcribeUrl = env.VITE_CALL_TRANSCRIBE_URL
  const analyzeUrl = env.VITE_CALL_ANALYZE_URL
  if (!transcribeUrl || !analyzeUrl) return null
  return createLiveCallAnalysisProvider({ transcribeUrl, analyzeUrl, token: env.VITE_CALL_TOKEN })
}
