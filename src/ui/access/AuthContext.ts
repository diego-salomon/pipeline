import { createContext, useContext } from 'react'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface SignInResult {
  ok: boolean
  error?: string
}

export interface AuthContextValue {
  status: AuthStatus
  mode: 'demo' | 'live'
  /** Label for the signed-in identity (e.g. email), or null. */
  identityLabel: string | null
  /** Async notice to surface to the user (e.g. "no tenant"), or null. */
  notice: string | null
  signIn(credentials: { password?: string; email?: string }): Promise<SignInResult>
  signOut(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an auth provider')
  return ctx
}
