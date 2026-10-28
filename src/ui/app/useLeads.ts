import { useCallback, useEffect, useState } from 'react'
import type { Lead } from '../../domain/types'
import { useLeadService } from './ServiceContext'

interface LeadsState {
  leads: Lead[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useLeads(): LeadsState {
  const service = useLeadService()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setLeads(await service.list())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [service])

  useEffect(() => {
    void reload()
  }, [reload])

  return { leads, loading, error, reload }
}

interface LeadState {
  lead: Lead | null
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useLead(id: string | undefined): LeadState {
  const service = useLeadService()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!id) {
      setLead(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      setLead((await service.get(id)) ?? null)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [service, id])

  useEffect(() => {
    void reload()
  }, [reload])

  return { lead, loading, error, reload }
}
