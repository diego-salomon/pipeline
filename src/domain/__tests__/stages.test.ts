import { describe, it, expect } from 'vitest'
import { canAdvance, closedStage, firstStage, isClosed, nextStage, stageIndex } from '../stages'

const order = ['a', 'b', 'c', 'd']

describe('stages', () => {
  it('finds the first and terminal stages', () => {
    expect(firstStage(order)).toBe('a')
    expect(closedStage(order)).toBe('d')
  })

  it('reports stage index', () => {
    expect(stageIndex(order, 'b')).toBe(1)
    expect(stageIndex(order, 'nope')).toBe(-1)
  })

  it('advances one step', () => {
    expect(nextStage(order, 'a')).toBe('b')
    expect(nextStage(order, 'c')).toBe('d')
  })

  it('cannot advance past the terminal stage', () => {
    expect(nextStage(order, 'd')).toBeNull()
    expect(canAdvance(order, 'd')).toBe(false)
    expect(isClosed(order, 'd')).toBe(true)
  })

  it('treats non-terminal stages as advanceable and not closed', () => {
    expect(canAdvance(order, 'a')).toBe(true)
    expect(isClosed(order, 'a')).toBe(false)
  })

  it('handles unknown stages safely', () => {
    expect(nextStage(order, 'ghost')).toBeNull()
    expect(canAdvance(order, 'ghost')).toBe(false)
    expect(isClosed(order, 'ghost')).toBe(false)
  })

  it('throws when the funnel is empty', () => {
    expect(() => firstStage([])).toThrow()
    expect(() => closedStage([])).toThrow()
  })
})
