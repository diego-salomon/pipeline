import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { canAdvance, isClosed, lastActivityAt } from '../../domain'
import type { Lead } from '../../domain/types'
import { pipeline } from '../../config/pipeline.config'
import { useLeadService } from '../app/ServiceContext'
import { useLeads } from '../app/useLeads'
import { formatMoney, formatRelative } from '../format'
import { stageColor, stageOrder } from '../stageMeta'
import { EmptyState, Icon, Spinner } from '../components/primitives'

const ARROW = 'M5 12h14 M13 6l6 6-6 6'

export function BoardScreen() {
  const service = useLeadService()
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
        description="Crea la primera para verla en el tablero."
        action={
          <Link to="/leads/new" className="btn btn--primary">
            Nueva {pipeline.entity.singular}
          </Link>
        }
      />
    )
  }

  const totalValue = leads.reduce((sum, l) => sum + l.estimatedValue, 0)
  const wonValue = leads.filter((l) => isClosed(stageOrder, l.stage)).reduce((s, l) => s + l.estimatedValue, 0)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tablero</h1>
          <p className="mt-1 text-muted">
            {leads.length} {leads.length === 1 ? pipeline.entity.singular : pipeline.entity.plural} ·{' '}
            {formatMoney(totalValue)} en total · {formatMoney(wonValue)} ganado
          </p>
        </div>
        <Link to="/leads/new" className="btn btn--primary">
          Nueva {pipeline.entity.singular}
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:overflow-x-auto md:pb-2">
        {pipeline.stages.map((stage) => {
          const inStage = leads.filter((l) => l.stage === stage.id)
          return (
            <section key={stage.id} className="md:w-72 md:flex-none">
              <header className="mb-2 flex items-center gap-2">
                <span className="chip__dot" style={{ background: stageColor(stage.id) }} />
                <h2 className="text-sm font-semibold">{stage.label}</h2>
                <span className="text-sm text-muted">{inStage.length}</span>
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
      className="card cursor-pointer p-3.5 transition-colors hover:border-brand/40"
      onClick={open}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open()
      }}
    >
      <div className="flex justify-between gap-2">
        <strong className="text-sm">{lead.organization}</strong>
        <span className="whitespace-nowrap font-bold">{formatMoney(lead.estimatedValue)}</span>
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
