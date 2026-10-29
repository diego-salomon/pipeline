/** Pure history-timeline logic. */

import type { CallRecordingAnalysis, HistoryEntry, HistoryKind } from './types'

export interface NewEntryInput {
  id: string
  kind: HistoryKind
  text: string
  /** ISO 8601 timestamp. */
  at: string
}

/**
 * Build a validated history entry. Text is trimmed and must not be empty
 * (notes in particular can't be blank).
 */
export function makeHistoryEntry(input: NewEntryInput): HistoryEntry {
  const text = input.text.trim()
  if (text.length === 0) {
    throw new Error('History entry text cannot be empty')
  }
  return { id: input.id, kind: input.kind, text, at: input.at }
}

export interface NewCallAnalysisInput {
  id: string
  /** ISO 8601 timestamp. */
  at: string
  call: CallRecordingAnalysis
}

/**
 * Build a validated `call-analysis` entry. The transcript must not be blank
 * (an empty transcript means nothing was recorded) and the entry's text is the
 * analysis summary, so it reads in the timeline like any other entry.
 */
export function makeCallAnalysisEntry(input: NewCallAnalysisInput): HistoryEntry {
  const transcript = input.call.transcript.trim()
  if (transcript.length === 0) {
    throw new Error('Call transcript cannot be empty')
  }
  const summary = input.call.analysis.summary.trim()
  if (summary.length === 0) {
    throw new Error('Call analysis summary cannot be empty')
  }
  return {
    id: input.id,
    kind: 'call-analysis',
    text: summary,
    at: input.at,
    call: { ...input.call, transcript, analysis: { ...input.call.analysis, summary } },
  }
}

/**
 * Sort ascending by timestamp. Entries with equal timestamps keep their
 * original relative order (stable), so same-millisecond inserts stay ordered.
 */
export function sortHistoryAsc(history: HistoryEntry[]): HistoryEntry[] {
  return history
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => {
      if (a.entry.at < b.entry.at) return -1
      if (a.entry.at > b.entry.at) return 1
      return a.index - b.index
    })
    .map(({ entry }) => entry)
}

/** Append an entry and keep the timeline in chronological order. */
export function appendHistory(history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  return sortHistoryAsc([...history, entry])
}

/** Timestamp of the most recent activity, or `null` when there is none. */
export function lastActivityAt(history: HistoryEntry[]): string | null {
  const sorted = sortHistoryAsc(history)
  const last = sorted[sorted.length - 1]
  return last ? last.at : null
}
