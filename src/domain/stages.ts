/**
 * Pure stage/funnel logic. The ordered list of stage ids is always passed in
 * (from `pipeline.config.ts`) so the domain never depends on a specific funnel.
 */

import type { StageId } from './types'

export function stageIndex(order: StageId[], stage: StageId): number {
  return order.indexOf(stage)
}

export function firstStage(order: StageId[]): StageId {
  const stage = order[0]
  if (stage === undefined) throw new Error('Pipeline has no stages configured')
  return stage
}

/** The terminal stage — the last in the funnel. A lead here cannot advance. */
export function closedStage(order: StageId[]): StageId {
  const stage = order[order.length - 1]
  if (stage === undefined) throw new Error('Pipeline has no stages configured')
  return stage
}

export function isClosed(order: StageId[], stage: StageId): boolean {
  return order.length > 0 && stageIndex(order, stage) === order.length - 1
}

export function canAdvance(order: StageId[], stage: StageId): boolean {
  const i = stageIndex(order, stage)
  return i >= 0 && i < order.length - 1
}

/** The next stage, or `null` if the lead is at (or beyond) the terminal stage. */
export function nextStage(order: StageId[], stage: StageId): StageId | null {
  const i = stageIndex(order, stage)
  if (i < 0 || i >= order.length - 1) return null
  return order[i + 1] ?? null
}
