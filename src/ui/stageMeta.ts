import type { CSSProperties } from 'react'
import { pipeline, stageOrder } from '../config/pipeline.config'
import type { StageDef } from '../config/pipeline.config'
import type { StageId } from '../domain/types'

export function stageDef(id: StageId): StageDef | undefined {
  return pipeline.stages.find((s) => s.id === id)
}

export function stageLabel(id: StageId): string {
  return stageDef(id)?.label ?? id
}

/** CSS color variable for a stage, mapped by its position in the funnel. */
export function stageColor(id: StageId): string {
  const index = stageOrder.indexOf(id)
  const slot = (index < 0 ? 0 : index) % 5
  return `var(--stage-${slot})`
}

/** Soft color-tinted pill style for a stage chip (legible in both themes). */
export function stageChipStyle(id: StageId): CSSProperties {
  const c = stageColor(id)
  return {
    background: `color-mix(in srgb, ${c} 20%, var(--color-surface))`,
    color: 'var(--color-fg)',
  }
}

export { stageOrder }
