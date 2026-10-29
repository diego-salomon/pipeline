/**
 * The single backend seam.
 *
 * NOTE ON ASYNC: the brief sketches these methods synchronously
 * (`list(): Lead[]`). They are `Promise`-returning here so that one port can
 * serve BOTH the localStorage adapter (demo) and a real network backend
 * (Supabase) without the UI caring which is wired in. The method names and
 * contract are otherwise exactly as specified. The domain layer stays pure
 * and synchronous — only this I/O boundary is async.
 */

import type { CallRecordingAnalysis, Lead } from '../domain/types'

export interface LeadRepository {
  list(): Promise<Lead[]>
  get(id: string): Promise<Lead | undefined>
  save(lead: Lead): Promise<void>
  remove(id: string): Promise<boolean>
  resetToSeed(): Promise<void>
}

/** Context passed to the analyzer so its coaching is grounded in the deal. */
export interface CallContext {
  organization: string
  contactName: string
  product: string
  stageLabel: string
}

/** A recorded call to transcribe + analyze. */
export interface CallInput {
  /**
   * The recorded audio. Optional: the demo adapter simulates without real
   * audio, and a live adapter may obtain audio through another channel.
   */
  audio?: Blob
  context: CallContext
}

/**
 * Transcribes a sales call and analyzes it for coaching + next actions. The
 * second I/O seam (alongside LeadRepository): a demo adapter simulates it, a
 * live adapter wires real transcription (e.g. Grabar Llamada / mlx-whisper) and
 * an LLM. The domain never depends on this — only the service does.
 */
export interface CallAnalysisProvider {
  analyzeCall(input: CallInput): Promise<CallRecordingAnalysis>
}

/** Returns an ISO 8601 timestamp for "now". */
export type Clock = () => string

/** Returns a fresh unique id. */
export type IdGenerator = () => string
