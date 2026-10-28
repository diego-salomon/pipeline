/** Pure history-timeline logic. */

import type { HistoryEntry, HistoryKind } from './types'

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
