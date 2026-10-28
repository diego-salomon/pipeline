import { describe, it, expect } from 'vitest'
import { isValidDraft, validateLeadDraft } from '../validation'
import type { LeadDraft } from '../types'

const valid: LeadDraft = {
  organization: 'Comercializadora del Valle',
  contactName: 'Ana Pérez',
  phone: '+58 412 555 1234',
  email: 'ana@valle.com',
  product: 'Sillas ergonómicas',
  quantity: 10,
  estimatedValue: 2500,
}

describe('validateLeadDraft', () => {
  it('passes a complete draft', () => {
    expect(validateLeadDraft(valid)).toEqual({})
    expect(isValidDraft(valid)).toBe(true)
  })

  it('requires text fields', () => {
    const e = validateLeadDraft({ ...valid, organization: '  ', contactName: '', product: '' })
    expect(e.organization).toBeDefined()
    expect(e.contactName).toBeDefined()
    expect(e.product).toBeDefined()
  })

  it('validates email format', () => {
    expect(validateLeadDraft({ ...valid, email: 'not-an-email' }).email).toBeDefined()
    expect(validateLeadDraft({ ...valid, email: '' }).email).toBeDefined()
  })

  it('validates phone length', () => {
    expect(validateLeadDraft({ ...valid, phone: '123' }).phone).toBeDefined()
    expect(validateLeadDraft({ ...valid, phone: '+58 412 555 1234' }).phone).toBeUndefined()
  })

  it('requires a positive integer quantity', () => {
    expect(validateLeadDraft({ ...valid, quantity: 0 }).quantity).toBeDefined()
    expect(validateLeadDraft({ ...valid, quantity: -3 }).quantity).toBeDefined()
    expect(validateLeadDraft({ ...valid, quantity: 2.5 }).quantity).toBeDefined()
  })

  it('requires a non-negative estimated value', () => {
    expect(validateLeadDraft({ ...valid, estimatedValue: -1 }).estimatedValue).toBeDefined()
    expect(validateLeadDraft({ ...valid, estimatedValue: 0 }).estimatedValue).toBeUndefined()
  })
})
