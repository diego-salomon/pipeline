import { createContext, useContext, type ReactNode } from 'react'
import type { LeadService } from '../../application/leadService'

export interface Services {
  /** Null only in live mode before sign-in completes. */
  service: LeadService | null
  mode: 'demo' | 'live'
  /** "Reset demo" is offered only in demo mode. */
  resetAvailable: boolean
  /** True when localStorage is blocked and demo data is memory-only. */
  storageWarning: boolean
}

const ServiceContext = createContext<Services | null>(null)

export function ServiceProvider({ value, children }: { value: Services; children: ReactNode }) {
  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
}

export function useServices(): Services {
  const ctx = useContext(ServiceContext)
  if (!ctx) throw new Error('useServices must be used within a ServiceProvider')
  return ctx
}

export function useLeadService(): LeadService {
  const { service } = useServices()
  if (!service) throw new Error('Lead service is not ready')
  return service
}
