/**
 * Application service: use-cases that orchestrate the pure domain functions
 * and persist through the repository port. The UI only ever talks to this.
 */

import * as domain from '../domain'
import type { HistoryKind, Lead, LeadDraft, LeadFieldsPatch, StageId } from '../domain/types'
import type { CallAnalysisProvider, Clock, IdGenerator, LeadRepository } from './ports'

export interface LeadServiceDeps {
  repo: LeadRepository
  now: Clock
  id: IdGenerator
  /** Ordered funnel stage ids (from pipeline.config). */
  stageOrder: StageId[]
  /** Stage id → human label, used for auto-generated history entries. */
  stageLabel: (id: StageId) => string
  /** Transcribes + analyzes recorded calls (demo-simulated or live). */
  callAnalysis: CallAnalysisProvider
}

export interface LeadService {
  list(): Promise<Lead[]>
  get(id: string): Promise<Lead | undefined>
  create(draft: LeadDraft): Promise<Lead>
  advance(id: string): Promise<Lead>
  addNote(id: string, text: string): Promise<Lead>
  logContact(id: string, kind: HistoryKind, text: string): Promise<Lead>
  update(id: string, patch: LeadFieldsPatch): Promise<Lead>
  /** Record a sales call, transcribe + analyze it, and attach it to the history. */
  analyzeCall(id: string, audio?: Blob): Promise<Lead>
  remove(id: string): Promise<boolean>
  resetDemo(): Promise<void>
}

export function createLeadService(deps: LeadServiceDeps): LeadService {
  const { repo, now, id, stageOrder, stageLabel, callAnalysis } = deps

  async function requireLead(leadId: string): Promise<Lead> {
    const lead = await repo.get(leadId)
    if (!lead) throw new Error(`Lead not found: ${leadId}`)
    return lead
  }

  return {
    list: () => repo.list(),
    get: (leadId) => repo.get(leadId),

    async create(draft) {
      const lead = domain.createLead(draft, {
        id: id(),
        historyId: id(),
        now: now(),
        firstStage: domain.firstStage(stageOrder),
        labelFor: stageLabel,
      })
      await repo.save(lead)
      return lead
    },

    async advance(leadId) {
      const lead = await requireLead(leadId)
      const advanced = domain.advanceLead(lead, stageOrder, { id: id(), now: now(), labelFor: stageLabel })
      await repo.save(advanced)
      return advanced
    },

    async addNote(leadId, text) {
      const lead = await requireLead(leadId)
      const updated = domain.addNote(lead, text, { id: id(), now: now() })
      await repo.save(updated)
      return updated
    },

    async logContact(leadId, kind, text) {
      const lead = await requireLead(leadId)
      const updated = domain.logContact(lead, kind, text, { id: id(), now: now() })
      await repo.save(updated)
      return updated
    },

    async update(leadId, patch) {
      const lead = await requireLead(leadId)
      const updated = domain.updateLeadFields(lead, patch, now())
      await repo.save(updated)
      return updated
    },

    async analyzeCall(leadId, audio) {
      const lead = await requireLead(leadId)
      const call = await callAnalysis.analyzeCall({
        audio,
        context: {
          organization: lead.organization,
          contactName: lead.contactName,
          product: lead.product,
          stageLabel: stageLabel(lead.stage),
        },
      })
      const updated = domain.attachCallAnalysis(lead, call, { id: id(), now: now() })
      await repo.save(updated)
      return updated
    },

    remove: (leadId) => repo.remove(leadId),
    resetDemo: () => repo.resetToSeed(),
  }
}
