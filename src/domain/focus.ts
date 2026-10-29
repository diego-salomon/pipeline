/** "Foco del día": qué oportunidades piden seguimiento primero. */

import { lastActivityAt } from './history'
import { isClosed } from './stages'
import type { Lead, StageId } from './types'

/**
 * Oportunidades abiertas (no cerradas) ordenadas por la más "fría" primero:
 * la que lleva más tiempo sin actividad. Una sin actividad va antes que todas.
 */
export function openLeadsByColdest(leads: Lead[], order: StageId[]): Lead[] {
  return leads
    .filter((lead) => !isClosed(order, lead.stage))
    .sort((a, b) => {
      // '' (sin actividad) es menor que cualquier ISO, así que sube primero.
      const aa = lastActivityAt(a.history) ?? ''
      const bb = lastActivityAt(b.history) ?? ''
      if (aa < bb) return -1
      if (aa > bb) return 1
      return 0
    })
}
