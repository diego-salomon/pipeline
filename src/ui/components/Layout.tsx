import type { CSSProperties } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { brand } from '../../config/brand.config'
import { useServices } from '../app/ServiceContext'
import { Logo } from './primitives'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { to: '/', label: 'Tablero', end: true },
  { to: '/leads/new', label: 'Nueva', end: false },
  { to: '/empresa', label: 'Empresa', end: false },
  { to: '/admin', label: 'Cuenta', end: false },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 px-0.5 py-2.5 text-sm font-semibold no-underline ${
    isActive ? '' : 'border-transparent text-muted'
  }`

// Active state styled with ink tokens so it stays legible in dark mode.
const navLinkStyle = ({ isActive }: { isActive: boolean }): CSSProperties =>
  isActive ? { color: 'var(--color-fg)', borderBottomColor: 'var(--color-brand-ink)' } : {}

export function Layout() {
  const { mode, storageWarning } = useServices()

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex min-h-14 w-full max-w-5xl flex-wrap items-center gap-4 px-4">
          <NavLink to="/" className="text-fg no-underline" aria-label={`${brand.name} — inicio`}>
            <Logo />
          </NavLink>

          {mode === 'demo' && (
            <span className="chip" title="Datos de ejemplo en tu navegador">
              <span className="chip__dot bg-accent" />
              Demo
            </span>
          )}

          <nav className="ml-auto flex items-center gap-4">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} style={navLinkStyle}>
                {item.label}
              </NavLink>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {storageWarning && (
        <div role="alert" className="mx-auto mt-3 w-full max-w-5xl px-4">
          <div className="card border-danger/40 p-3 text-fg">
            El almacenamiento del navegador está bloqueado. Los cambios durarán solo esta sesión.
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-5">
        <Outlet />
      </main>

      <footer className="border-t border-border text-muted">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap justify-between gap-2 px-4 py-4 text-sm">
          <span>
            {brand.name} · {brand.tagline}
          </span>
          <NavLink to="/empresa" className="text-muted">
            Información de la empresa
          </NavLink>
        </div>
      </footer>
    </div>
  )
}
