import { describe, it, expect } from 'vitest'
import { openLeadsByColdest } from '../focus'
import type { Lead } from '../types'

const order = ['nuevo', 'cotizado', 'cerrado']

function lead(id: string, stage: string, lastAt: string | null): Lead {
  return {
    id,
    organization: id,
    contactName: 'c',
    phone: '+58 412 555 0000',
    email: 'c@e.com',
    product: 'p',
    quantity: 1,
    estimatedValue: 100,
    stage,
    history: lastAt ? [{ id: `${id}-h`, kind: 'note', text: 'x', at: lastAt }] : [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: lastAt ?? '2026-01-01T00:00:00.000Z',
  }
}

describe('openLeadsByColdest', () => {
  it('excludes closed leads', () => {
    const out = openLeadsByColdest(
      [lead('a', 'nuevo', '2026-02-01T00:00:00.000Z'), lead('z', 'cerrado', '2026-02-02T00:00:00.000Z')],
      order,
    )
    expect(out.map((l) => l.id)).toEqual(['a'])
  })

  it('orders coldest (oldest activity) first', () => {
    const out = openLeadsByColdest(
      [
        lead('fresh', 'nuevo', '2026-03-01T00:00:00.000Z'),
        lead('cold', 'cotizado', '2026-01-01T00:00:00.000Z'),
        lead('mid', 'nuevo', '2026-02-01T00:00:00.000Z'),
      ],
      order,
    )
    expect(out.map((l) => l.id)).toEqual(['cold', 'mid', 'fresh'])
  })

  it('puts leads with no activity before any dated one', () => {
    const out = openLeadsByColdest(
      [lead('dated', 'nuevo', '2026-01-01T00:00:00.000Z'), lead('never', 'nuevo', null)],
      order,
    )
    expect(out[0].id).toBe('never')
  })
})
