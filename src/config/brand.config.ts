/**
 * ░░ WHITE-LABEL FILE 1 of 2 ░░
 *
 * Everything client-specific lives here and in `pipeline.config.ts`.
 * No client strings belong in components — pull them from this config.
 *
 * To rebrand: change the values below. Currency and dates are formatted
 * from `locale` + `currency`, so you never hardcode a currency symbol.
 */

export interface BrandSocial {
  /** Short label, e.g. "Instagram". */
  label: string
  url: string
}

export interface BrandContact {
  address: string
  city: string
  country: string
  phone: string
  email: string
  /** Full international number, digits only, for wa.me links. */
  whatsapp: string
  /** Free-text query used to build a Google Maps link, e.g. "Pipeline, Bogotá". */
  mapsQuery: string
}

export interface BrandPalette {
  /** Primary brand color (buttons, active states). Any valid CSS color. */
  primary: string
  /** Text/foreground color that sits on top of `primary`. */
  primaryContrast: string
  /** Secondary accent color. */
  accent: string
}

export interface BrandConfig {
  name: string
  tagline: string
  /** Logo URL, or null to render the name as a wordmark. */
  logoUrl: string | null
  /** BCP-47 locale used for all number/date formatting, e.g. "es-419". */
  locale: string
  /** ISO 4217 currency code used for all money formatting, e.g. "USD". */
  currency: string
  palette: BrandPalette
  contact: BrandContact
  socials: BrandSocial[]
}

export const brand: BrandConfig = {
  name: 'Pipeline',
  tagline: 'Tus ventas, de principio a cierre.',
  logoUrl: null,
  locale: 'es-419',
  currency: 'USD',
  palette: {
    primary: '#4f46e5',
    primaryContrast: '#ffffff',
    accent: '#0ea5e9',
  },
  contact: {
    address: 'Av. Principal 123, Piso 4',
    city: 'Ciudad',
    country: 'País',
    phone: '+00 000 000 0000',
    email: 'ventas@ejemplo.com',
    whatsapp: '0000000000',
    mapsQuery: 'Av. Principal 123',
  },
  socials: [
    { label: 'Instagram', url: 'https://instagram.com/' },
    { label: 'LinkedIn', url: 'https://linkedin.com/' },
  ],
}
