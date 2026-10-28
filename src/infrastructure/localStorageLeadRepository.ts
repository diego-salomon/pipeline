/**
 * Demo repository: persists leads in localStorage, seeding on first run.
 * If storage is blocked (private browsing, disabled cookies), it transparently
 * falls back to an in-memory store for the session so the app still works.
 */

import type { LeadRepository } from '../application/ports'
import type { Lead } from '../domain/types'

const STORAGE_KEY = 'pipeline-crm:v1:leads'

export function isLocalStorageAvailable(storage: Storage | undefined = globalThis.localStorage): boolean {
  if (!storage) return false
  try {
    const probe = '__pipeline_probe__'
    storage.setItem(probe, '1')
    storage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export interface LocalStorageRepoOptions {
  seed: Lead[]
  storage?: Storage
}

export function createLocalStorageLeadRepository({
  seed,
  storage = globalThis.localStorage,
}: LocalStorageRepoOptions): LeadRepository {
  const available = isLocalStorageAvailable(storage)
  let memory: Lead[] = structuredClone(seed)

  function readAll(): Lead[] {
    if (!available) return structuredClone(memory)
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) {
      writeAll(seed)
      return structuredClone(seed)
    }
    try {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as Lead[]) : []
    } catch {
      return []
    }
  }

  function writeAll(leads: Lead[]): void {
    if (!available) {
      memory = structuredClone(leads)
      return
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(leads))
  }

  return {
    async list() {
      return readAll()
    },
    async get(id) {
      return readAll().find((l) => l.id === id)
    },
    async save(lead) {
      const all = readAll()
      const index = all.findIndex((l) => l.id === lead.id)
      if (index >= 0) all[index] = lead
      else all.push(lead)
      writeAll(all)
    },
    async remove(id) {
      const all = readAll()
      const next = all.filter((l) => l.id !== id)
      const removed = next.length !== all.length
      if (removed) writeAll(next)
      return removed
    },
    async resetToSeed() {
      writeAll(structuredClone(seed))
    },
  }
}
