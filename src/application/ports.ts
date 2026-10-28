/**
 * The single backend seam.
 *
 * NOTE ON ASYNC: the brief sketches these methods synchronously
 * (`list(): Lead[]`). They are `Promise`-returning here so that one port can
 * serve BOTH the localStorage adapter (demo) and a real network backend
 * (Supabase) without the UI caring which is wired in. The method names and
 * contract are otherwise exactly as specified. The domain layer stays pure
 * and synchronous — only this I/O boundary is async.
 */

import type { Lead } from '../domain/types'

export interface LeadRepository {
  list(): Promise<Lead[]>
  get(id: string): Promise<Lead | undefined>
  save(lead: Lead): Promise<void>
  remove(id: string): Promise<boolean>
  resetToSeed(): Promise<void>
}

/** Returns an ISO 8601 timestamp for "now". */
export type Clock = () => string

/** Returns a fresh unique id. */
export type IdGenerator = () => string
