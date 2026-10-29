/**
 * ░░ WHITE-LABEL FILE 2 of 2 ░░
 *
 * The sales funnel and all field/activity labels. Change the stages to
 * match any sales process — the domain logic reads this list in order:
 * `nextStage()` advances one step and the LAST stage is terminal (closed).
 *
 * Stage `id`s are stored on leads, so avoid renaming an existing id once
 * you have live data (change the `label` instead).
 */

import type { HistoryKind, StageId } from '../domain/types'

export interface StageDef {
  id: StageId
  label: string
  /** Optional one-line hint shown in the UI. */
  description?: string
}

export interface HistoryKindDef {
  label: string
  /** Inline SVG path data (24×24 viewBox) for the timeline icon. */
  icon: string
}

export interface PipelineConfig {
  /** Ordered funnel. The last entry is the terminal "closed" stage. */
  stages: StageDef[]
  /** What one record is called, for headings and empty states. */
  entity: { singular: string; plural: string }
  /** Labels for each lead field. */
  fieldLabels: {
    organization: string
    contactName: string
    phone: string
    email: string
    product: string
    quantity: string
    estimatedValue: string
    stage: string
  }
  historyKinds: Record<HistoryKind, HistoryKindDef>
}

// Minimal 24×24 icon path set (Lucide-style), kept here so history kinds stay
// fully configurable alongside their labels.
const ICONS = {
  note: 'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z',
  call: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z',
  email: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 7l-10 6L2 7',
  visit: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  whatsapp: 'M12 2a10 10 0 0 0-8.6 15l-1.3 4 4.1-1.3A10 10 0 1 0 12 2Z M8.5 7.5c.3 0 .6.2.8.6l.7 1.5c.1.3 0 .6-.2.8l-.5.5c.6 1.1 1.5 2 2.6 2.6l.5-.5c.2-.2.5-.3.8-.2l1.5.7c.4.2.6.5.6.8 0 1.2-1 2.2-2.2 2a9 9 0 0 1-7.2-7.2c-.2-1.2.8-2.2 2-2.2Z',
  stage: 'M5 12h14 M13 6l6 6-6 6',
  'call-analysis': 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M5 11a7 7 0 0 0 14 0 M12 18v3',
} as const

export const pipeline: PipelineConfig = {
  stages: [
    { id: 'nuevo-contacto', label: 'Nuevo contacto', description: 'Prospecto recién registrado' },
    { id: 'cotización-enviada', label: 'Cotización enviada', description: 'Propuesta entregada' },
    { id: 'en-evaluación', label: 'En evaluación', description: 'El cliente está revisando' },
    { id: 'negociación', label: 'Negociación', description: 'Ajustando términos y precio' },
    { id: 'pedido-cerrado', label: 'Pedido cerrado', description: 'Venta ganada' },
  ],
  entity: { singular: 'oportunidad', plural: 'oportunidades' },
  fieldLabels: {
    organization: 'Organización',
    contactName: 'Nombre de contacto',
    phone: 'Teléfono',
    email: 'Correo',
    product: 'Producto',
    quantity: 'Cantidad',
    estimatedValue: 'Valor estimado',
    stage: 'Etapa',
  },
  historyKinds: {
    note: { label: 'Nota', icon: ICONS.note },
    call: { label: 'Llamada', icon: ICONS.call },
    email: { label: 'Correo', icon: ICONS.email },
    visit: { label: 'Visita', icon: ICONS.visit },
    whatsapp: { label: 'WhatsApp', icon: ICONS.whatsapp },
    stage: { label: 'Cambio de etapa', icon: ICONS.stage },
    'call-analysis': { label: 'Llamada analizada', icon: ICONS['call-analysis'] },
  },
}

/** Ordered stage ids — the canonical funnel sequence used by the domain. */
export const stageOrder: StageId[] = pipeline.stages.map((s) => s.id)
