import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext'

const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? 'demo'
const SESSION_KEY = 'pipeline:demo-auth'

function initialStatus(): AuthStatus {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1' ? 'authenticated' : 'unauthenticated'
  } catch {
    return 'unauthenticated'
  }
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(initialStatus)

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      mode: 'demo',
      identityLabel: status === 'authenticated' ? 'Modo demo' : null,
      notice: null,
      async signIn({ password }) {
        if ((password ?? '') === DEMO_PASSWORD) {
          try {
            sessionStorage.setItem(SESSION_KEY, '1')
          } catch {
            // ignore
          }
          setStatus('authenticated')
          return { ok: true }
        }
        return { ok: false, error: 'Contraseña incorrecta' }
      },
      async signOut() {
        try {
          sessionStorage.removeItem(SESSION_KEY)
        } catch {
          // ignore
        }
        setStatus('unauthenticated')
      },
    }),
    [status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
