import { describe, it, expect } from 'vitest'
import { appendHistory, lastActivityAt, makeCallAnalysisEntry, makeHistoryEntry, sortHistoryAsc } from '../history'
import type { CallRecordingAnalysis, HistoryEntry } from '../types'

const entry = (id: string, at: string): HistoryEntry => ({ id, kind: 'note', text: `n${id}`, at })

const call = (over: Partial<CallRecordingAnalysis> = {}): CallRecordingAnalysis => ({
  transcript: 'Vendedor: Hola.\nCliente: Lo vemos.',
  durationSeconds: 60,
  analysis: {
    summary: 'Interés con objeción de precio',
    improvements: ['Cuantificar el valor'],
    followUps: ['Precio'],
    offers: ['Descuento'],
    nextSteps: ['Enviar propuesta'],
  },
  ...over,
})

describe('history', () => {
  it('trims text and builds an entry', () => {
    const e = makeHistoryEntry({ id: '1', kind: 'note', text: '  hola  ', at: '2026-01-01T00:00:00.000Z' })
    expect(e.text).toBe('hola')
  })

  it('rejects empty text', () => {
    expect(() => makeHistoryEntry({ id: '1', kind: 'note', text: '   ', at: '2026-01-01T00:00:00.000Z' })).toThrow()
  })

  it('sorts ascending by timestamp', () => {
    const out = sortHistoryAsc([
      entry('b', '2026-01-02T00:00:00.000Z'),
      entry('a', '2026-01-01T00:00:00.000Z'),
      entry('c', '2026-01-03T00:00:00.000Z'),
    ])
    expect(out.map((e) => e.id)).toEqual(['a', 'b', 'c'])
  })

  it('keeps insertion order for equal timestamps (stable)', () => {
    const t = '2026-01-01T00:00:00.000Z'
    const out = sortHistoryAsc([entry('first', t), entry('second', t), entry('third', t)])
    expect(out.map((e) => e.id)).toEqual(['first', 'second', 'third'])
  })

  it('appends keeping chronological order', () => {
    const base = [entry('a', '2026-01-01T00:00:00.000Z'), entry('c', '2026-01-03T00:00:00.000Z')]
    const out = appendHistory(base, entry('b', '2026-01-02T00:00:00.000Z'))
    expect(out.map((e) => e.id)).toEqual(['a', 'b', 'c'])
  })

  it('builds a call-analysis entry with the summary as its text', () => {
    const e = makeCallAnalysisEntry({ id: '1', at: '2026-01-01T00:00:00.000Z', call: call() })
    expect(e.kind).toBe('call-analysis')
    expect(e.text).toBe('Interés con objeción de precio')
    expect(e.call?.transcript).toContain('Vendedor')
    expect(e.call?.analysis.nextSteps).toEqual(['Enviar propuesta'])
  })

  it('trims the transcript and summary of a call-analysis entry', () => {
    const e = makeCallAnalysisEntry({
      id: '1',
      at: '2026-01-01T00:00:00.000Z',
      call: call({ transcript: '  hola  ', analysis: { ...call().analysis, summary: '  resumen  ' } }),
    })
    expect(e.call?.transcript).toBe('hola')
    expect(e.text).toBe('resumen')
  })

  it('rejects an empty transcript', () => {
    expect(() =>
      makeCallAnalysisEntry({ id: '1', at: '2026-01-01T00:00:00.000Z', call: call({ transcript: '   ' }) }),
    ).toThrow()
  })

  it('rejects an empty analysis summary', () => {
    expect(() =>
      makeCallAnalysisEntry({
        id: '1',
        at: '2026-01-01T00:00:00.000Z',
        call: call({ analysis: { ...call().analysis, summary: '  ' } }),
      }),
    ).toThrow()
  })

  it('reports the latest activity timestamp', () => {
    expect(lastActivityAt([])).toBeNull()
    expect(
      lastActivityAt([entry('a', '2026-01-01T00:00:00.000Z'), entry('b', '2026-01-05T00:00:00.000Z')]),
    ).toBe('2026-01-05T00:00:00.000Z')
  })
})
