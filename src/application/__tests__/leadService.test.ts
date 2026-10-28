import { describe, it, expect, beforeEach } from 'vitest'
import { createLeadService, type LeadService } from '../leadService'
import { createInMemoryLeadRepository } from '../../infrastructure/inMemoryLeadRepository'
import type { LeadDraft } from '../../domain/types'

const order = ['nuevo', 'cotizado', 'cerrado']

const draft: LeadDraft = {
  organization: 'Distribuidora Sur',
  contactName: 'Carla Ruiz',
  phone: '+54 11 5555 1234',
  email: 'carla@sur.com',
  product: 'Estanterías',
  quantity: 4,
  estimatedValue: 900,
}

function makeService(): LeadService {
  // Deterministic ids and clock.
  let n = 0
  let t = 0
  return createLeadService({
    repo: createInMemoryLeadRepository(),
    id: () => `id-${++n}`,
    now: () => `2026-01-01T00:00:${String(t++).padStart(2, '0')}.000Z`,
    stageOrder: order,
    stageLabel: (id) => id.toUpperCase(),
  })
}

describe('leadService', () => {
  let svc: LeadService
  beforeEach(() => {
    svc = makeService()
  })

  it('creates, lists and gets a lead', async () => {
    const created = await svc.create(draft)
    expect(await svc.list()).toHaveLength(1)
    const fetched = await svc.get(created.id)
    expect(fetched?.organization).toBe('Distribuidora Sur')
  })

  it('advances a lead through the funnel and blocks past closed', async () => {
    const lead = await svc.create(draft)
    const a = await svc.advance(lead.id)
    expect(a.stage).toBe('cotizado')
    const b = await svc.advance(lead.id)
    expect(b.stage).toBe('cerrado')
    await expect(svc.advance(lead.id)).rejects.toThrow()
  })

  it('adds notes and logs simulated contact, persisting them', async () => {
    const lead = await svc.create(draft)
    await svc.addNote(lead.id, 'Pidió descuento')
    await svc.logContact(lead.id, 'whatsapp', 'Cotización reenviada')
    const fresh = await svc.get(lead.id)
    const kinds = fresh?.history.map((h) => h.kind)
    expect(kinds).toContain('note')
    expect(kinds).toContain('whatsapp')
  })

  it('updates editable fields', async () => {
    const lead = await svc.create(draft)
    const updated = await svc.update(lead.id, { estimatedValue: 1500 })
    expect(updated.estimatedValue).toBe(1500)
    expect((await svc.get(lead.id))?.estimatedValue).toBe(1500)
  })

  it('removes a lead', async () => {
    const lead = await svc.create(draft)
    expect(await svc.remove(lead.id)).toBe(true)
    expect(await svc.get(lead.id)).toBeUndefined()
  })

  it('resets demo data to the seed', async () => {
    const seeded = createLeadService({
      repo: createInMemoryLeadRepository([
        { ...(await makeService().create(draft)), id: 'seed-1' },
      ]),
      id: () => 'x',
      now: () => 'now',
      stageOrder: order,
      stageLabel: (id) => id,
    })
    await seeded.remove('seed-1')
    expect(await seeded.list()).toHaveLength(0)
    await seeded.resetDemo()
    expect(await seeded.list()).toHaveLength(1)
  })

  it('throws when acting on a missing lead', async () => {
    await expect(svc.advance('ghost')).rejects.toThrow()
  })
})
