/**
 * Live repository backed by Supabase (Postgres + RLS). All reads/writes are
 * scoped to the signed-in user's tenant by Row-Level Security; `tenantId` is
 * written onto new rows so they land in the right tenant.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { LeadRepository } from '../../application/ports'
import { toHistoryRows, toLead, toLeadRow, type HistoryRow, type LeadRow } from './mappers'

export function createSupabaseLeadRepository(
  client: SupabaseClient,
  tenantId: string,
): LeadRepository {
  return {
    async list() {
      const { data: leadRows, error } = await client
        .from('leads')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw new Error(error.message)

      const { data: historyRows, error: historyError } = await client
        .from('lead_history')
        .select('*')
      if (historyError) throw new Error(historyError.message)

      const byLead = new Map<string, HistoryRow[]>()
      for (const row of (historyRows ?? []) as HistoryRow[]) {
        const list = byLead.get(row.lead_id) ?? []
        list.push(row)
        byLead.set(row.lead_id, list)
      }

      return ((leadRows ?? []) as LeadRow[]).map((row) => toLead(row, byLead.get(row.id) ?? []))
    },

    async get(id) {
      const { data: row, error } = await client.from('leads').select('*').eq('id', id).maybeSingle()
      if (error) throw new Error(error.message)
      if (!row) return undefined

      const { data: historyRows, error: historyError } = await client
        .from('lead_history')
        .select('*')
        .eq('lead_id', id)
      if (historyError) throw new Error(historyError.message)

      return toLead(row as LeadRow, (historyRows ?? []) as HistoryRow[])
    },

    async save(lead) {
      const { error } = await client.from('leads').upsert(toLeadRow(lead, tenantId))
      if (error) throw new Error(error.message)

      // History entries are immutable and only ever grow, so upserting the
      // full set by primary key is idempotent and cheap for these volumes.
      const rows = toHistoryRows(lead, tenantId)
      if (rows.length > 0) {
        const { error: historyError } = await client.from('lead_history').upsert(rows)
        if (historyError) throw new Error(historyError.message)
      }
    },

    async remove(id) {
      // lead_history rows are removed by the ON DELETE CASCADE foreign key.
      const { error, count } = await client.from('leads').delete({ count: 'exact' }).eq('id', id)
      if (error) throw new Error(error.message)
      return (count ?? 0) > 0
    },

    async resetToSeed() {
      throw new Error('"Reiniciar demo" no está disponible en modo en vivo (live).')
    },
  }
}
