import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { canAdvance, isClosed, LeadValidationError, nextStage } from '../../domain'
import type { HistoryKind, Lead } from '../../domain/types'
import { pipeline } from '../../config/pipeline.config'
import { useLeadService } from '../app/ServiceContext'
import { useLead } from '../app/useLeads'
import { formatDateTime, formatMoney } from '../format'
import { stageLabel, stageOrder } from '../stageMeta'
import { EmptyState, Icon, Spinner, StageStamp } from '../components/primitives'

const ARROW = 'M5 12h14 M13 6l6 6-6 6'
const TRASH = 'M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14'

const CONTACT_KINDS: HistoryKind[] = ['note', 'call', 'email', 'whatsapp', 'visit']
const SECTION_HEAD = 'text-sm font-bold uppercase tracking-wide'

type Service = ReturnType<typeof useLeadService>

export function LeadDetailScreen() {
  const { id } = useParams()
  const service = useLeadService()
  const navigate = useNavigate()
  const { lead, loading, error, reload } = useLead(id)

  if (loading) return <Spinner />
  if (error) return <EmptyState title="No se pudo cargar" description={error} />
  if (!lead) {
    return (
      <EmptyState
        title="No encontrada"
        description="Esta ficha no existe o fue eliminada."
        action={<Link to="/" className="btn btn--primary">Volver al tablero</Link>}
      />
    )
  }

  return <LeadDetail key={lead.id} lead={lead} service={service} reload={reload} onDeleted={() => navigate('/')} />
}

function LeadDetail({
  lead,
  service,
  reload,
  onDeleted,
}: {
  lead: Lead
  service: Service
  reload: () => Promise<void>
  onDeleted: () => void
}) {
  const advanceable = canAdvance(stageOrder, lead.stage)
  const closed = isClosed(stageOrder, lead.stage)
  const next = nextStage(stageOrder, lead.stage)
  const [busy, setBusy] = useState(false)

  const advance = async () => {
    setBusy(true)
    try {
      await service.advance(lead.id)
      await reload()
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`¿Eliminar "${lead.organization}"? Esta acción no se puede deshacer.`)) return
    setBusy(true)
    try {
      await service.remove(lead.id)
      onDeleted()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-5">
      <div>
        <Link to="/" className="text-sm text-muted no-underline">
          ← Tablero
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{lead.organization}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StageStamp stageId={lead.stage} tilt />
              <strong className="num text-lg">{formatMoney(lead.estimatedValue)}</strong>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {advanceable && (
              <button type="button" className="btn btn--primary" onClick={advance} disabled={busy}>
                {next && isClosed(stageOrder, next) ? 'Cerrar venta' : 'Mover a la siguiente etapa'}
                <Icon path={ARROW} size={16} />
              </button>
            )}
            <button type="button" className="btn btn--danger" onClick={remove} disabled={busy} aria-label="Eliminar">
              <Icon path={TRASH} size={16} />
            </button>
          </div>
        </div>
        {closed && (
          <p className="mt-3 font-semibold" style={{ color: 'var(--stage-4)' }}>
            ✓ {stageLabel(lead.stage)} — no puede avanzar más.
          </p>
        )}
      </div>

      <div className="grid items-start gap-5 md:grid-cols-2">
        <DetailsForm lead={lead} service={service} reload={reload} />
        <div className="grid gap-5">
          <HistoryComposer lead={lead} service={service} reload={reload} />
          <Timeline lead={lead} />
        </div>
      </div>
    </div>
  )
}

function DetailsForm({ lead, service, reload }: { lead: Lead; service: Service; reload: () => Promise<void> }) {
  const [form, setForm] = useState(() => formFromLead(lead))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  useEffect(() => {
    setForm(formFromLead(lead))
  }, [lead])

  const f = pipeline.fieldLabels
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, [key]: e.target.value }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFieldError(null)
    try {
      await service.update(lead.id, {
        organization: form.organization,
        contactName: form.contactName,
        phone: form.phone,
        email: form.email,
        product: form.product,
        quantity: Number(form.quantity),
        estimatedValue: Number(form.estimatedValue),
      })
      await reload()
      setSaved(true)
    } catch (err) {
      setFieldError(err instanceof LeadValidationError ? Object.values(err.errors)[0] ?? 'Datos no válidos' : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card grid gap-3.5 p-5" onSubmit={save}>
      <h2 className={SECTION_HEAD}>Datos</h2>
      <Row label={f.organization} value={form.organization} onChange={set('organization')} />
      <Row label={f.contactName} value={form.contactName} onChange={set('contactName')} />
      <Row label={f.phone} value={form.phone} onChange={set('phone')} type="tel" />
      <Row label={f.email} value={form.email} onChange={set('email')} type="email" />
      <Row label={f.product} value={form.product} onChange={set('product')} />
      <div className="grid grid-cols-2 gap-3.5">
        <Row label={f.quantity} value={form.quantity} onChange={set('quantity')} type="number" min="1" />
        <Row label={f.estimatedValue} value={form.estimatedValue} onChange={set('estimatedValue')} type="number" min="0" />
      </div>
      {fieldError && <p className="field-error">{fieldError}</p>}
      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-xs text-muted">Guardado</span>}
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

function formFromLead(lead: Lead) {
  return {
    organization: lead.organization,
    contactName: lead.contactName,
    phone: lead.phone,
    email: lead.email,
    product: lead.product,
    quantity: String(lead.quantity),
    estimatedValue: String(lead.estimatedValue),
  }
}

function Row({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `edit-${label}`
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="input" {...rest} />
    </div>
  )
}

function HistoryComposer({ lead, service, reload }: { lead: Lead; service: Service; reload: () => Promise<void> }) {
  const [kind, setKind] = useState<HistoryKind>('note')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const simulated = kind === 'email' || kind === 'whatsapp'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true)
    try {
      if (kind === 'note') await service.addNote(lead.id, text)
      else await service.logContact(lead.id, kind, text)
      setText('')
      await reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card grid gap-3 p-5" onSubmit={submit}>
      <h2 className={SECTION_HEAD}>Agregar al historial</h2>
      <div>
        <label className="label" htmlFor="composer-kind">Tipo</label>
        <select id="composer-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as HistoryKind)}>
          {CONTACT_KINDS.map((k) => (
            <option key={k} value={k}>
              {pipeline.historyKinds[k].label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="composer-text">Detalle</label>
        <textarea
          id="composer-text"
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={simulated ? 'Se registra en el historial — no se envía nada.' : 'Escribe una nota…'}
        />
      </div>
      {simulated && <p className="text-xs text-muted">Contacto simulado: solo queda registrado en el historial.</p>}
      <div className="flex justify-end">
        <button type="submit" className="btn btn--primary" disabled={busy || !text.trim()}>
          {busy ? 'Guardando…' : 'Registrar'}
        </button>
      </div>
    </form>
  )
}

function Timeline({ lead }: { lead: Lead }) {
  const total = lead.history.length
  const entries = [...lead.history].reverse() // newest first
  return (
    <div className="card p-5">
      <h2 className={`mb-3 ${SECTION_HEAD}`}>Historial</h2>
      <ol>
        {entries.map((entry, i) => {
          const def = pipeline.historyKinds[entry.kind]
          const folio = String(total - i).padStart(3, '0')
          const isStage = entry.kind === 'stage'
          return (
            <li key={entry.id} className="border-b border-border py-2.5 last:border-b-0 last:pb-0">
              <div className="flex items-baseline gap-3">
                <span className="folio text-xs">{folio}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: isStage ? 'var(--color-accent)' : 'var(--color-muted)' }}
                    >
                      {def.label}
                    </span>
                    <time className="num text-xs text-muted" dateTime={entry.at}>
                      {formatDateTime(entry.at)}
                    </time>
                  </div>
                  <p className="mt-0.5 text-sm">{entry.text}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
