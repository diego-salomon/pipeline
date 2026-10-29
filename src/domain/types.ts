/**
 * Core domain types. Pure data — no framework, no I/O.
 *
 * A `StageId` is just a string; the ordered list of valid stages lives in
 * `src/config/pipeline.config.ts` and is passed into the domain functions,
 * which keeps the domain free of any particular funnel.
 */

export type StageId = string

export type HistoryKind = 'note' | 'call' | 'email' | 'visit' | 'whatsapp' | 'stage' | 'call-analysis'

/**
 * Structured output of analyzing a recorded sales call. Pure data: the
 * transcript is kept verbatim (never summarized away) and the analysis is the
 * coaching the LLM derived from it.
 */
export interface CallAnalysis {
  /** One-line headline shown as the entry's text. */
  summary: string
  /** What the seller could improve in the conversation. */
  improvements: string[]
  /** Open points worth following up on. */
  followUps: string[]
  /** What is worth offering next. */
  offers: string[]
  /** Concrete next steps. */
  nextSteps: string[]
}

/** A transcribed + analyzed call, attached to a `call-analysis` history entry. */
export interface CallRecordingAnalysis {
  /** Full transcript, verbatim. */
  transcript: string
  analysis: CallAnalysis
  /** Length of the recorded audio in seconds, when known. */
  durationSeconds?: number
}

/** A single activity on a lead's timeline. */
export interface HistoryEntry {
  id: string
  kind: HistoryKind
  text: string
  /** ISO 8601 timestamp. */
  at: string
  /** Present only on `call-analysis` entries: the transcript + analysis. */
  call?: CallRecordingAnalysis
}

/** A lead moving through the sales funnel. */
export interface Lead {
  id: string
  organization: string
  contactName: string
  phone: string
  email: string
  product: string
  quantity: number
  /** Monetary amount; the currency is defined by the brand config. */
  estimatedValue: number
  stage: StageId
  history: HistoryEntry[]
  createdAt: string
  updatedAt: string
}

/** The fields a user supplies when creating a lead. */
export interface LeadDraft {
  organization: string
  contactName: string
  phone: string
  email: string
  product: string
  quantity: number
  estimatedValue: number
  /** Optional starting stage; defaults to the first configured stage. */
  stage?: StageId
}

/** A patch of editable lead fields (stage is changed through advance/close, not here). */
export type LeadFieldsPatch = Partial<Omit<Lead, 'id' | 'stage' | 'history' | 'createdAt' | 'updatedAt'>>
