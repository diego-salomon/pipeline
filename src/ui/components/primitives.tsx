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
    <div role="status" className="flex items-center justify-center gap-2 py-8 text-muted">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--color-border)" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
        </path>
      </svg>
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="card p-8 text-center">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      {description && <p className="mb-4 text-muted">{description}</p>}
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
    return <img src={brand.logoUrl} alt={brand.name} className="h-7 w-auto" />
  }
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight">
      <span aria-hidden="true" className="inline-block h-6 w-6 rounded-[0.45rem] bg-brand" />
      {brand.name}
    </span>
  )
}
