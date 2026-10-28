import { describe, it, expect } from 'vitest'
import { addNote, advanceLead, createLead, logContact, updateLeadFields } from '../lead'
import { LeadValidationError } from '../validation'
import type { LeadDraft } from '../types'

const order = ['nuevo', 'cotizado', 'cerrado']
const labelFor = (s: string) => s.toUpperCase()

const draft: LeadDraft = {
  organization: 'Grupo Andino',
  contactName: 'Luis Mora',
  phone: '+57 300 123 4567',
  email: 'luis@andino.co',
  product: 'Escritorios',
  quantity: 5,
  estimatedValue: 1800,
}

function makeLead() {
  return createLead(draft, { id: 'lead-1', historyId: 'h0', now: '2026-01-01T10:00:00.000Z', firstStage: 'nuevo', labelFor })
}

describe('createLead', () => {
  it('creates a lead in the first stage with a creation history entry', () => {
    const lead = makeLead()
    expect(lead.stage).toBe('nuevo')
    expect(lead.organization).toBe('Grupo Andino')
    expect(lead.history).toHaveLength(1)
    expect(lead.history[0].kind).toBe('stage')
    expect(lead.createdAt).toBe('2026-01-01T10:00:00.000Z')
  })

  it('rejects an invalid draft', () => {
    expect(() =>
      createLead({ ...draft, email: 'bad' }, { id: 'x', historyId: 'h', now: 'now', firstStage: 'nuevo', labelFor }),
    ).toThrow(LeadValidationError)
  })
})

describe('advanceLead', () => {
  it('advances one stage and appends a stage entry', () => {
    const lead = makeLead()
    const advanced = advanceLead(lead, order, { id: 'h1', now: '2026-01-02T10:00:00.000Z', labelFor })
    expect(advanced.stage).toBe('cotizado')
    expect(advanced.history).toHaveLength(2)
    expect(advanced.history[1].kind).toBe('stage')
    expect(advanced.updatedAt).toBe('2026-01-02T10:00:00.000Z')
    // original lead is untouched (immutability)
    expect(lead.stage).toBe('nuevo')
  })

  it('cannot advance past the terminal stage', () => {
    let lead = makeLead()
    lead = advanceLead(lead, order, { id: 'h1', now: '2026-01-02T10:00:00.000Z', labelFor })
    lead = advanceLead(lead, order, { id: 'h2', now: '2026-01-03T10:00:00.000Z', labelFor })
    expect(lead.stage).toBe('cerrado')
    expect(() => advanceLead(lead, order, { id: 'h3', now: '2026-01-04T10:00:00.000Z', labelFor })).toThrow()
  })
})

describe('addNote / logContact', () => {
  it('appends a note', () => {
    const lead = addNote(makeLead(), 'Llamar el lunes', { id: 'n1', now: '2026-01-02T00:00:00.000Z' })
    expect(lead.history.at(-1)?.kind).toBe('note')
    expect(lead.history.at(-1)?.text).toBe('Llamar el lunes')
  })

  it('rejects an empty note', () => {
    expect(() => addNote(makeLead(), '   ', { id: 'n1', now: 'now' })).toThrow()
  })

  it('logs a simulated whatsapp contact', () => {
    const lead = logContact(makeLead(), 'whatsapp', 'Cotización enviada por WhatsApp', { id: 'w1', now: '2026-01-02T00:00:00.000Z' })
    expect(lead.history.at(-1)?.kind).toBe('whatsapp')
  })
})

describe('updateLeadFields', () => {
  it('updates editable fields and bumps updatedAt, leaving stage and history alone', () => {
    const lead = makeLead()
    const updated = updateLeadFields(lead, { organization: 'Nuevo Nombre', quantity: 12 }, '2026-02-01T00:00:00.000Z')
    expect(updated.organization).toBe('Nuevo Nombre')
    expect(updated.quantity).toBe(12)
    expect(updated.stage).toBe(lead.stage)
    expect(updated.history).toBe(lead.history)
    expect(updated.updatedAt).toBe('2026-02-01T00:00:00.000Z')
  })

  it('rejects an invalid quantity', () => {
    expect(() => updateLeadFields(makeLead(), { quantity: 0 }, 'now')).toThrow(LeadValidationError)
  })
})
