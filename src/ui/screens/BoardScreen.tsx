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
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Tablero</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>
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
              <header style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="chip__dot" style={{ background: stageColor(stage.id) }} />
                <h2 style={{ margin: 0, fontSize: '0.95rem' }}>{stage.label}</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{inStage.length}</span>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {inStage.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>Sin registros</p>
                )}
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

  return (
    <article
      className="card"
      style={{ padding: '0.875rem', cursor: 'pointer' }}
      onClick={() => navigate(`/leads/${lead.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/leads/${lead.id}`)
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <strong style={{ fontSize: '0.95rem' }}>{lead.organization}</strong>
        <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{formatMoney(lead.estimatedValue)}</span>
      </div>
      <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{lead.product}</p>
      <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        {activity ? `Última actividad ${formatRelative(activity)}` : 'Sin actividad'}
      </p>

      {advanceable ? (
        <button
          type="button"
          className="btn btn--ghost"
          style={{ marginTop: '0.75rem', width: '100%' }}
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
        <p style={{ marginTop: '0.75rem', marginBottom: 0, color: 'var(--stage-4)', fontWeight: 600, fontSize: '0.85rem' }}>
          ✓ Cerrada
        </p>
      ) : null}
    </article>
  )
}
