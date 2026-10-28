import type { BrandConfig } from '../../config/brand.config'

/** Inject the brand palette as CSS variables on <html>. */
export function applyBrandTheme(brand: BrandConfig): void {
  const root = document.documentElement.style
  root.setProperty('--brand', brand.palette.primary)
  root.setProperty('--brand-contrast', brand.palette.primaryContrast)
  root.setProperty('--accent', brand.palette.accent)
}

const THEME_KEY = 'pipeline:theme'
export type ThemeChoice = 'light' | 'dark' | 'system'

export function getStoredTheme(): ThemeChoice {
  try {
    const value = localStorage.getItem(THEME_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    // ignore
  }
  return 'system'
}

export function applyTheme(choice: ThemeChoice): void {
  const el = document.documentElement
  if (choice === 'system') {
    el.removeAttribute('data-theme')
  } else {
    el.setAttribute('data-theme', choice)
  }
  try {
    if (choice === 'system') localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, choice)
  } catch {
    // ignore
  }
}
