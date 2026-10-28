/**
 * In-memory repository. Used in tests and as a predictable reference
 * implementation of the port. Every read/write is deep-cloned so callers can
 * never mutate stored state by reference.
 */

import type { LeadRepository } from '../application/ports'
import type { Lead } from '../domain/types'

export function createInMemoryLeadRepository(seed: Lead[] = []): LeadRepository {
  let store = new Map<string, Lead>()

  const load = (leads: Lead[]) => {
    store = new Map(leads.map((l) => [l.id, structuredClone(l)]))
  }

  load(seed)

  return {
    async list() {
      return [...store.values()].map((l) => structuredClone(l))
    },
    async get(id) {
      const lead = store.get(id)
      return lead ? structuredClone(lead) : undefined
    },
    async save(lead) {
      store.set(lead.id, structuredClone(lead))
    },
    async remove(id) {
      return store.delete(id)
    },
    async resetToSeed() {
      load(seed)
    },
  }
}
