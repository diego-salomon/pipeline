/** Pure lead-draft validation. */

import type { LeadDraft } from './types'

export type FieldErrors = Partial<Record<keyof LeadDraft, string>>

export class LeadValidationError extends Error {
  readonly errors: FieldErrors
  constructor(errors: FieldErrors) {
    super('Lead draft is invalid')
    this.name = 'LeadValidationError'
    this.errors = errors
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_MIN_DIGITS = 7

export function validateLeadDraft(draft: LeadDraft): FieldErrors {
  const errors: FieldErrors = {}

  if (!draft.organization?.trim()) errors.organization = 'Requerido'
  if (!draft.contactName?.trim()) errors.contactName = 'Requerido'
  if (!draft.product?.trim()) errors.product = 'Requerido'

  const phone = draft.phone?.trim() ?? ''
  if (!phone) {
    errors.phone = 'Requerido'
  } else if (phone.replace(/\D/g, '').length < PHONE_MIN_DIGITS) {
    errors.phone = 'Teléfono no válido'
  }

  const email = draft.email?.trim() ?? ''
  if (!email) {
    errors.email = 'Requerido'
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Correo no válido'
  }

  if (!Number.isInteger(draft.quantity) || draft.quantity <= 0) {
    errors.quantity = 'Debe ser un entero mayor que 0'
  }

  if (!Number.isFinite(draft.estimatedValue) || draft.estimatedValue < 0) {
    errors.estimatedValue = 'Debe ser 0 o mayor'
  }

  return errors
}

export function isValidDraft(draft: LeadDraft): boolean {
  return Object.keys(validateLeadDraft(draft)).length === 0
}
