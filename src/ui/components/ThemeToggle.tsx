import { useState } from 'react'
import { applyTheme, getStoredTheme } from '../theme/applyBrandTheme'
import { Icon } from './primitives'

const SUN =
  'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4'
const MOON = 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z'

function resolveInitial(): 'light' | 'dark' {
  const stored = getStoredTheme()
  if (stored !== 'system') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(resolveInitial)

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      style={{ minWidth: '2.75rem', padding: 0 }}
    >
      <Icon path={theme === 'dark' ? SUN : MOON} />
    </button>
  )
}
