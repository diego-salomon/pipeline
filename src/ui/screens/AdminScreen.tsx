import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { brand } from '../../config/brand.config'
import { useAuth } from '../access/AuthContext'
import { useServices } from '../app/ServiceContext'

export function AdminScreen() {
  const { status } = useAuth()
  if (status === 'authenticated') return <AccountPanel />
  return <LoginForm />
}

function LoginForm() {
  const { mode, signIn, notice } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await signIn(mode === 'demo' ? { password } : { email, password })
    setBusy(false)
    if (result.ok) navigate(from, { replace: true })
    else setError(result.error ?? 'No se pudo iniciar sesión')
  }

  return (
    <div className="mx-auto mt-8 max-w-sm">
      <h1 className="mb-4 text-center text-2xl font-semibold">{brand.name}</h1>
      <form className="card grid gap-4 p-6" onSubmit={onSubmit}>
        {mode === 'live' && (
          <div>
            <label className="label" htmlFor="email">Correo</label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
          </div>
        )}
        <div>
          <label className="label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'live' ? 'current-password' : 'off'}
            autoFocus
            required
          />
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        {notice && <p className="text-sm text-muted">{notice}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
        {mode === 'demo' && (
          <p className="text-center text-xs text-muted">
            Esto <strong>no es seguridad real</strong>: solo una puerta para la demo.
          </p>
        )}
      </form>
    </div>
  )
}

function AccountPanel() {
  const { identityLabel, signOut, mode } = useAuth()
  const { resetAvailable, service } = useServices()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const reset = async () => {
    if (!service) return
    if (!window.confirm('¿Restaurar los datos de ejemplo? Se perderán los cambios de la demo.')) return
    setBusy(true)
    try {
      await service.resetDemo()
      navigate('/')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-[30rem]">
      <h1 className="mb-4 text-2xl font-semibold">Cuenta</h1>
      <div className="card grid gap-4 p-6">
        <div>
          <span className="label">Sesión</span>
          <p>
            {identityLabel ?? 'Conectado'} · modo {mode === 'demo' ? 'demo (localStorage)' : 'en vivo (Supabase)'}
          </p>
        </div>

        {resetAvailable && (
          <div>
            <span className="label">Datos de ejemplo</span>
            <button type="button" className="btn btn--ghost w-full" onClick={reset} disabled={busy}>
              {busy ? 'Restaurando…' : 'Reiniciar demo'}
            </button>
          </div>
        )}

        <button type="button" className="btn btn--danger w-full" onClick={() => void signOut()}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
