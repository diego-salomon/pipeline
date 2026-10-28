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

function navLinkStyle({ isActive }: { isActive: boolean }): React.CSSProperties {
  return {
    padding: '0.4rem 0.2rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: isActive ? 'var(--brand)' : 'var(--text-muted)',
    borderBottom: isActive ? '2px solid var(--brand)' : '2px solid transparent',
    textDecoration: 'none',
  }
}

export function Layout() {
  const { mode, storageWarning } = useServices()

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="mx-auto w-full max-w-5xl px-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem', minHeight: '3.5rem', flexWrap: 'wrap' }}>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'var(--text)' }} aria-label={`${brand.name} — inicio`}>
            <Logo />
          </NavLink>

          {mode === 'demo' && (
            <span className="chip" title="Datos de ejemplo en tu navegador">
              <span className="chip__dot" style={{ background: 'var(--accent)' }} />
              Demo
            </span>
          )}

          <nav style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} style={navLinkStyle}>
                {item.label}
              </NavLink>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {storageWarning && (
        <div
          role="alert"
          className="mx-auto w-full max-w-5xl px-4"
          style={{ marginTop: '0.75rem' }}
        >
          <div className="card" style={{ padding: '0.75rem 1rem', borderColor: 'color-mix(in srgb, var(--danger) 40%, var(--border))', color: 'var(--text)' }}>
            El almacenamiento del navegador está bloqueado. Los cambios durarán solo esta sesión.
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl px-4" style={{ flex: 1, padding: '1.25rem 1rem 3rem' }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        <div className="mx-auto w-full max-w-5xl px-4" style={{ padding: '1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>
            {brand.name} · {brand.tagline}
          </span>
          <NavLink to="/empresa" style={{ color: 'var(--text-muted)' }}>
            Información de la empresa
          </NavLink>
        </div>
      </footer>
    </div>
  )
}
