import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { canAdvance, isClosed, lastActivityAt, openLeadsByColdest } from '../../domain'
import type { Lead } from '../../domain/types'
import { pipeline } from '../../config/pipeline.config'
import { useLeadService } from '../app/ServiceContext'
import { useLeads } from '../app/useLeads'
import { formatMoney, formatRelative } from '../format'
import { stageColor, stageLabel, stageOrder } from '../stageMeta'
import { EmptyState, Icon, Spinner } from '../components/primitives'

const ARROW = 'M5 12h14 M13 6l6 6-6 6'

export function BoardScreen() {
  const service = useLeadService()
  const navigate = useNavigate()
  const { leads, loading, error, reload } = useLeads()
  const [busyId, setBusyId] = useState<string | null>(null)

  const handleAdvance = async (lead: Lead) => {
    setBusyId(lead.id)
    try {
      await service.advance(lead.id)
      await reload()
    } finally {
      setBusyId(null)
    }
  }

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
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Tablero</h1>
        <Link to="/leads/new" className="btn btn--primary">
          Nueva {pipeline.entity.singular}
        </Link>
      </div>

      {/* Nivel 1 — Para hoy (talonario). */}
      <section className="card overflow-hidden">
        <header className="flex items-baseline justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wide">Para hoy</h2>
          <span className="text-xs text-muted">los más fríos primero</span>
        </header>
        <ol>
          {paraHoy.map((lead, i) => {
            const activity = lastActivityAt(lead.history)
            return (
              <li key={lead.id} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="block w-full px-4 py-3 text-left hover:bg-panel"
                >
                  <div className="flex items-center gap-3">
                    <span className="folio text-sm">{String(i + 1).padStart(3, '0')}</span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{lead.organization}</span>
                    <span className="num whitespace-nowrap font-bold">{formatMoney(lead.estimatedValue)}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-9">
                    <span className="stamp">{stageLabel(lead.stage)}</span>
                    <span className="text-xs text-muted">
                      {activity ? `sin tocar ${formatRelative(activity)}` : 'sin actividad'}
                    </span>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
        <div className="border-t-2 px-4 py-3" style={{ borderTopColor: 'var(--color-brand)' }}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-bold uppercase tracking-wide">En juego</span>
            <span className="num font-bold">{formatMoney(enJuego)}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-sm">
            <span className="uppercase tracking-wide text-muted">Ganado</span>
            <span className="num" style={{ color: 'var(--stage-4)' }}>
              {formatMoney(ganado)}
            </span>
          </div>
        </div>
      </section>

      {/* Nivel 2 — Embudo por etapa. */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Embudo por etapa</h2>
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
                    <LeadCard key={lead.id} lead={lead} busy={busyId === lead.id} onAdvance={() => handleAdvance(lead)} />
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

function LeadCard({ lead, busy, onAdvance }: { lead: Lead; busy: boolean; onAdvance: () => void }) {
  const navigate = useNavigate()
  const activity = lastActivityAt(lead.history)
  const closed = isClosed(stageOrder, lead.stage)
  const advanceable = canAdvance(stageOrder, lead.stage)
  const open = () => navigate(`/leads/${lead.id}`)

  return (
    <article
      className="card cursor-pointer p-3.5 transition-colors hover:border-[var(--color-brand)]"
      onClick={open}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open()
      }}
    >
      <div className="flex justify-between gap-2">
        <strong className="text-sm">{lead.organization}</strong>
        <span className="num whitespace-nowrap font-bold">{formatMoney(lead.estimatedValue)}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{lead.product}</p>
      <p className="mt-1.5 text-xs text-muted">
        {activity ? `Última actividad ${formatRelative(activity)}` : 'Sin actividad'}
      </p>

      {advanceable ? (
        <button
          type="button"
          className="btn btn--ghost mt-3 w-full"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation()
            onAdvance()
          }}
        >
          {busy ? 'Moviendo…' : 'Mover a la siguiente etapa'}
          {!busy && <Icon path={ARROW} size={16} />}
        </button>
      ) : closed ? (
        <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--stage-4)' }}>
          ✓ Cerrada
        </p>
      ) : null}
    </article>
  )
}
