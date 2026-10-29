import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isClosed, lastActivityAt, openLeadsByColdest } from '../../domain'
import type { Lead } from '../../domain/types'
import { pipeline } from '../../config/pipeline.config'
import { useLeads } from '../app/useLeads'
import { formatMoney, formatRelative } from '../format'
import { stageChipStyle, stageColor, stageLabel, stageOrder } from '../stageMeta'
import { EmptyState, Spinner } from '../components/primitives'

const hero: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.9rem', lineHeight: 1.05 }

export function BoardScreen() {
  const navigate = useNavigate()
  const { leads, loading, error } = useLeads()

  if (loading) return <Spinner />
  if (error) return <EmptyState title="No se pudo cargar" description={error} />

  if (leads.length === 0) {
    return (
      <EmptyState
        title={`Aún no hay ${pipeline.entity.plural}`}
        description="Abre la primera para verla en el tablero."
        action={
          <Link to="/leads/new" className="btn btn--primary">
            Nueva {pipeline.entity.singular}
          </Link>
        }
      />
    )
  }

  const coldest = openLeadsByColdest(leads, stageOrder)
  const paraHoy = coldest.slice(0, 5)
  const enJuego = coldest.reduce((sum, l) => sum + l.estimatedValue, 0)
  const ganado = leads.filter((l) => isClosed(stageOrder, l.stage)).reduce((s, l) => s + l.estimatedValue, 0)

  return (
    <div className="grid gap-7">
      {/* Métricas hero. */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4" style={{ background: 'var(--color-accent)', borderColor: 'transparent' }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--color-on-accent)' }}>
            En juego
          </div>
          <div className="num mt-1.5" style={{ ...hero, color: 'var(--color-on-accent)' }}>
            {formatMoney(enJuego)}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm font-semibold text-muted">Ganado</div>
          <div className="num mt-1.5" style={hero}>
            {formatMoney(ganado)}
          </div>
        </div>
      </div>

      {/* Para hoy. */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl">Para hoy</h1>
            <p className="text-sm text-muted">Los más fríos primero</p>
          </div>
          <Link to="/leads/new" className="btn btn--primary">
            Nueva {pipeline.entity.singular}
          </Link>
        </div>
        <div className="card overflow-hidden">
          {paraHoy.map((lead, i) => {
            const activity = lastActivityAt(lead.history)
            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => navigate(`/leads/${lead.id}`)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-panel ${
                  i > 0 ? 'border-t border-border' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{lead.organization}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="stamp" style={stageChipStyle(lead.stage)}>
                      {stageLabel(lead.stage)}
                    </span>
                    <span className="text-xs text-muted">
                      {activity ? `sin tocar ${formatRelative(activity)}` : 'sin actividad'}
                    </span>
                  </div>
                </div>
                <span className="num whitespace-nowrap font-semibold" style={{ fontSize: '1.05rem' }}>
                  {formatMoney(lead.estimatedValue)}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Embudo por etapa. */}
      <section>
        <h2 className="mb-3 text-lg">Embudo por etapa</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:overflow-x-auto md:pb-2">
          {pipeline.stages.map((stage) => {
            const inStage = leads.filter((l) => l.stage === stage.id)
            return (
              <section key={stage.id} data-testid={`col-${stage.id}`} className="md:w-72 md:flex-none">
                <header className="mb-2 flex items-center gap-2">
                  <span className="chip__dot" style={{ background: stageColor(stage.id) }} />
                  <h3 className="text-sm font-semibold">{stage.label}</h3>
                  <span className="num text-sm text-muted">{inStage.length}</span>
                </header>
                <div className="flex flex-col gap-2.5">
                  {inStage.length === 0 && <p className="py-2 text-sm text-muted">Sin registros</p>}
                  {inStage.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function LeadCard({ lead }: { lead: Lead }) {
  const navigate = useNavigate()
  const activity = lastActivityAt(lead.history)
  const open = () => navigate(`/leads/${lead.id}`)
  return (
    <article
      className="card cursor-pointer p-4 transition-shadow hover:shadow-md"
      onClick={open}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open()
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <strong className="text-sm">{lead.organization}</strong>
        <span className="num whitespace-nowrap font-semibold">{formatMoney(lead.estimatedValue)}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{lead.product}</p>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="stamp" style={stageChipStyle(lead.stage)}>
          {stageLabel(lead.stage)}
        </span>
        <span className="text-xs text-muted">
          {activity ? formatRelative(activity) : 'sin actividad'}
        </span>
      </div>
    </article>
  )
}
