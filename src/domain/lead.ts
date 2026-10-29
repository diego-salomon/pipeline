/** Pure lead operations. Every function returns a new Lead; none mutate. */

import type { CallRecordingAnalysis, HistoryKind, Lead, LeadDraft, LeadFieldsPatch, StageId } from './types'
import { appendHistory, makeCallAnalysisEntry, makeHistoryEntry } from './history'
import { nextStage } from './stages'
import { LeadValidationError, validateLeadDraft } from './validation'

/** Resolve a stage id to its human label (supplied by the UI/config). */
export type LabelFor = (stage: StageId) => string

export interface CreateLeadDeps {
  id: string
  historyId: string
  now: string
  firstStage: StageId
  labelFor: LabelFor
}

export function createLead(draft: LeadDraft, deps: CreateLeadDeps): Lead {
  const errors = validateLeadDraft(draft)
  if (Object.keys(errors).length > 0) {
    throw new LeadValidationError(errors)
  }
  const stage = draft.stage ?? deps.firstStage
  const creationEntry = makeHistoryEntry({
    id: deps.historyId,
    kind: 'stage',
    at: deps.now,
    text: `Creada en “${deps.labelFor(stage)}”`,
  })
  return {
    id: deps.id,
    organization: draft.organization.trim(),
    contactName: draft.contactName.trim(),
    phone: draft.phone.trim(),
    email: draft.email.trim(),
    product: draft.product.trim(),
    quantity: draft.quantity,
    estimatedValue: draft.estimatedValue,
    stage,
    history: [creationEntry],
    createdAt: deps.now,
    updatedAt: deps.now,
  }
}

export interface AdvanceLeadDeps {
  id: string
  now: string
  labelFor: LabelFor
}

/** Advance one stage, auto-appending a `stage` history entry. Throws at the terminal stage. */
export function advanceLead(lead: Lead, order: StageId[], deps: AdvanceLeadDeps): Lead {
  const next = nextStage(order, lead.stage)
  if (next === null) {
    throw new Error('Lead is already at the final stage and cannot advance')
  }
  const entry = makeHistoryEntry({
    id: deps.id,
    kind: 'stage',
    at: deps.now,
    text: `Avanzó a “${deps.labelFor(next)}”`,
  })
  return {
    ...lead,
    stage: next,
    history: appendHistory(lead.history, entry),
    updatedAt: deps.now,
  }
}

export interface EntryDeps {
  id: string
  now: string
}

/** Add a free-text note. Throws if the text is empty. */
export function addNote(lead: Lead, text: string, deps: EntryDeps): Lead {
  const entry = makeHistoryEntry({ id: deps.id, kind: 'note', at: deps.now, text })
  return { ...lead, history: appendHistory(lead.history, entry), updatedAt: deps.now }
}

/**
 * Log a contact activity (call/email/visit/whatsapp). For "simulated" contact
 * (email/whatsapp) nothing is actually sent — this only records the timeline
 * entry. Throws if the text is empty.
 */
export function logContact(lead: Lead, kind: HistoryKind, text: string, deps: EntryDeps): Lead {
  const entry = makeHistoryEntry({ id: deps.id, kind, at: deps.now, text })
  return { ...lead, history: appendHistory(lead.history, entry), updatedAt: deps.now }
}

/**
 * Attach a transcribed + analyzed call to the timeline as a `call-analysis`
 * entry. The transcript and analysis are produced outside the domain (by the
 * call-analysis port); this only validates and records the result. Throws if
 * the transcript or the analysis summary is empty.
 */
export function attachCallAnalysis(lead: Lead, call: CallRecordingAnalysis, deps: EntryDeps): Lead {
  const entry = makeCallAnalysisEntry({ id: deps.id, at: deps.now, call })
  return { ...lead, history: appendHistory(lead.history, entry), updatedAt: deps.now }
}

/** Apply an editable-fields patch. Stage, history and ids are never touched here. */
export function updateLeadFields(lead: Lead, patch: LeadFieldsPatch, now: string): Lead {
  const next: Lead = { ...lead }

  if (patch.organization !== undefined) next.organization = patch.organization.trim()
  if (patch.contactName !== undefined) next.contactName = patch.contactName.trim()
  if (patch.phone !== undefined) next.phone = patch.phone.trim()
  if (patch.email !== undefined) next.email = patch.email.trim()
  if (patch.product !== undefined) next.product = patch.product.trim()

  if (patch.quantity !== undefined) {
    if (!Number.isInteger(patch.quantity) || patch.quantity <= 0) {
      throw new LeadValidationError({ quantity: 'Debe ser un entero mayor que 0' })
    }
    next.quantity = patch.quantity
  }

  if (patch.estimatedValue !== undefined) {
    if (!Number.isFinite(patch.estimatedValue) || patch.estimatedValue < 0) {
      throw new LeadValidationError({ estimatedValue: 'Debe ser 0 o mayor' })
    }
    next.estimatedValue = patch.estimatedValue
  }

  next.updatedAt = now
  return next
}
