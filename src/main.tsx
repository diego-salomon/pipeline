import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { brand } from './config/brand.config'
import { pipeline, stageOrder } from './config/pipeline.config'
import { applyBrandTheme, applyTheme, getStoredTheme } from './ui/theme/applyBrandTheme'
import { createLeadService } from './application/leadService'
import { createLocalStorageLeadRepository, isLocalStorageAvailable } from './infrastructure/localStorageLeadRepository'
import { demoSeed } from './infrastructure/seed'
import { systemClock } from './infrastructure/clock'
import { uuid } from './infrastructure/id'
import { createSupabaseClient } from './infrastructure/supabase/client'
import { DemoAuthProvider } from './ui/access/DemoAuthProvider'
import { LiveAuthProvider } from './ui/access/LiveAuthProvider'
import { ServiceProvider } from './ui/app/ServiceContext'

const stageLabel = (id: string) => pipeline.stages.find((s) => s.id === id)?.label ?? id
const mode = import.meta.env.VITE_MODE === 'live' ? 'live' : 'demo'

// Apply branding + theme before first paint.
applyBrandTheme(brand)
applyTheme(getStoredTheme())
document.title = brand.name

function ConfigError() {
  return (
    <div style={{ maxWidth: '32rem', margin: '4rem auto', padding: '0 1rem' }}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <h1 style={{ marginTop: 0, fontSize: '1.2rem' }}>Falta configurar Supabase</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          El modo en vivo (VITE_MODE=live) requiere <code>VITE_SUPABASE_URL</code> y{' '}
          <code>VITE_SUPABASE_ANON_KEY</code>. Revisa tu archivo <code>.env</code> (ver <code>.env.example</code>).
        </p>
      </div>
    </div>
  )
}

function Root(): ReactNode {
  if (mode === 'live') {
    const url = import.meta.env.VITE_SUPABASE_URL ?? ''
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
    if (!url || !key) return <ConfigError />
    const client = createSupabaseClient(url, key)
    return (
      <LiveAuthProvider client={client}>
        <App />
      </LiveAuthProvider>
    )
  }

  // Demo mode (default): localStorage + seeded example data.
  const storageWarning = !isLocalStorageAvailable()
  const repo = createLocalStorageLeadRepository({ seed: demoSeed() })
  const service = createLeadService({ repo, now: systemClock, id: uuid, stageOrder, stageLabel })
  return (
    <DemoAuthProvider>
      <ServiceProvider value={{ service, mode: 'demo', resetAvailable: true, storageWarning }}>
        <App />
      </ServiceProvider>
    </DemoAuthProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
