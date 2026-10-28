/** Row ⇄ domain mapping for the Supabase tables. */

import { sortHistoryAsc } from '../../domain/history'
import type { HistoryEntry, Lead } from '../../domain/types'

export interface LeadRow {
  id: string
  tenant_id: string
  organization: string
  contact_name: string
  phone: string
  email: string
  product: string
  quantity: number
  estimated_value: number
  stage: string
  created_at: string
  updated_at: string
}

export interface HistoryRow {
  id: string
  lead_id: string
  tenant_id: string
  kind: HistoryEntry['kind']
  text: string
  at: string
}

export function toLead(row: LeadRow, history: HistoryRow[]): Lead {
  return {
    id: row.id,
    organization: row.organization,
    contactName: row.contact_name,
    phone: row.phone,
    email: row.email,
    product: row.product,
    quantity: row.quantity,
    estimatedValue: Number(row.estimated_value),
    stage: row.stage,
    history: sortHistoryAsc(
      history.map((h) => ({ id: h.id, kind: h.kind, text: h.text, at: h.at })),
    ),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function toLeadRow(lead: Lead, tenantId: string): LeadRow {
  return {
    id: lead.id,
    tenant_id: tenantId,
    organization: lead.organization,
    contact_name: lead.contactName,
    phone: lead.phone,
    email: lead.email,
    product: lead.product,
    quantity: lead.quantity,
    estimated_value: lead.estimatedValue,
    stage: lead.stage,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
  }
}

export function toHistoryRows(lead: Lead, tenantId: string): HistoryRow[] {
  return lead.history.map((h) => ({
    id: h.id,
    lead_id: lead.id,
    tenant_id: tenantId,
    kind: h.kind,
    text: h.text,
    at: h.at,
  }))
}
