import type { ReactNode } from 'react'
import { brand } from '../../config/brand.config'
import { stageColor, stageLabel } from '../stageMeta'

/** Renders a 24×24 stroke icon from SVG path data (supports multiple subpaths). */
export function Icon({ path, size = 20, className }: { path: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', padding: '2rem 0', justifyContent: 'center' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border)" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
        </path>
      </svg>
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem' }}>{title}</h2>
      {description && <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)' }}>{description}</p>}
      {action}
    </div>
  )
}

export function StageChip({ stageId }: { stageId: string }) {
  return (
    <span className="chip" data-testid="stage-chip">
      <span className="chip__dot" style={{ background: stageColor(stageId) }} />
      {stageLabel(stageId)}
    </span>
  )
}

export function Logo() {
  if (brand.logoUrl) {
    return <img src={brand.logoUrl} alt={brand.name} style={{ height: '1.75rem', width: 'auto' }} />
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
      <span
        aria-hidden="true"
        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.45rem', background: 'var(--brand)', display: 'inline-block' }}
      />
      {brand.name}
    </span>
  )
}
