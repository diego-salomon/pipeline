import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext'
import { ServiceProvider, type Services } from '../app/ServiceContext'
import { createLeadService, type LeadService } from '../../application/leadService'
import { createSupabaseLeadRepository } from '../../infrastructure/supabase/supabaseLeadRepository'
import { resolveTenantId } from '../../infrastructure/supabase/tenant'
import { systemClock } from '../../infrastructure/clock'
import { uuid } from '../../infrastructure/id'
import { pipeline, stageOrder } from '../../config/pipeline.config'

const stageLabel = (id: string) => pipeline.stages.find((s) => s.id === id)?.label ?? id

/**
 * Live-mode providers. Manages the Supabase session, resolves the user's
 * tenant, builds the tenant-scoped LeadService, and exposes both the auth and
 * service contexts. The service is non-null only once a session + tenant exist.
 */
export function LiveAuthProvider({ client, children }: { client: SupabaseClient; children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [service, setService] = useState<LeadService | null>(null)
  const [identityLabel, setIdentityLabel] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const buildForSession = useCallback(async () => {
    const tenantId = await resolveTenantId(client)
    if (!tenantId) {
      setService(null)
      setIdentityLabel(null)
      setNotice('Tu usuario no pertenece a ningún espacio de trabajo (tenant). Pide acceso a un administrador.')
      setStatus('unauthenticated')
      return
    }
    const repo = createSupabaseLeadRepository(client, tenantId)
    setService(createLeadService({ repo, now: systemClock, id: uuid, stageOrder, stageLabel }))
    const { data } = await client.auth.getUser()
    setIdentityLabel(data.user?.email ?? 'Cuenta')
    setNotice(null)
    setStatus('authenticated')
  }, [client])

  useEffect(() => {
    let active = true
    void client.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) void buildForSession()
      else setStatus('unauthenticated')
    })
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (session) {
        void buildForSession()
      } else {
        setService(null)
        setIdentityLabel(null)
        setStatus('unauthenticated')
      }
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [client, buildForSession])

  const auth = useMemo<AuthContextValue>(
    () => ({
      status,
      mode: 'live',
      identityLabel,
      notice,
      async signIn({ email, password }) {
        const { error } = await client.auth.signInWithPassword({
          email: email ?? '',
          password: password ?? '',
        })
        if (error) return { ok: false, error: error.message }
        return { ok: true }
      },
      async signOut() {
        await client.auth.signOut()
      },
    }),
    [client, status, identityLabel, notice],
  )

  const services = useMemo<Services>(
    () => ({ service, mode: 'live', resetAvailable: false, storageWarning: false }),
    [service],
  )

  return (
    <AuthContext.Provider value={auth}>
      <ServiceProvider value={services}>{children}</ServiceProvider>
    </AuthContext.Provider>
  )
}
