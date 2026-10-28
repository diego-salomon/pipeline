import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateLeadDraft, type FieldErrors } from '../../domain'
import type { LeadDraft } from '../../domain/types'
import { pipeline } from '../../config/pipeline.config'
import { useLeadService } from '../app/ServiceContext'

const EMPTY = {
  organization: '',
  contactName: '',
  phone: '',
  email: '',
  product: '',
  quantity: '',
  estimatedValue: '',
}

type FormState = typeof EMPTY

export function NewLeadScreen() {
  const service = useLeadService()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const toDraft = (): LeadDraft => ({
    organization: form.organization,
    contactName: form.contactName,
    phone: form.phone,
    email: form.email,
    product: form.product,
    quantity: Number(form.quantity),
    estimatedValue: Number(form.estimatedValue),
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const draft = toDraft()
    const found = validateLeadDraft(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      const created = await service.create(draft)
      navigate(`/leads/${created.id}`)
    } catch (err) {
      setErrors({ organization: err instanceof Error ? err.message : 'Error al crear' })
      setSubmitting(false)
    }
  }

  const f = pipeline.fieldLabels

  return (
    <div className="mx-auto max-w-[38rem]">
      <h1 className="mb-4 text-2xl font-semibold">Nueva {pipeline.entity.singular}</h1>
      <form className="card grid gap-4 p-5" onSubmit={onSubmit} noValidate>
        <TextField label={f.organization} value={form.organization} onChange={set('organization')} error={errors.organization} autoFocus />
        <TextField label={f.contactName} value={form.contactName} onChange={set('contactName')} error={errors.contactName} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label={f.phone} value={form.phone} onChange={set('phone')} error={errors.phone} type="tel" />
          <TextField label={f.email} value={form.email} onChange={set('email')} error={errors.email} type="email" />
        </div>
        <TextField label={f.product} value={form.product} onChange={set('product')} error={errors.product} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label={f.quantity} value={form.quantity} onChange={set('quantity')} error={errors.quantity} type="number" inputMode="numeric" min="1" />
          <TextField label={f.estimatedValue} value={form.estimatedValue} onChange={set('estimatedValue')} error={errors.estimatedValue} type="number" inputMode="decimal" min="0" />
        </div>

        <div className="mt-1 flex justify-end gap-3">
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Creando…' : `Crear ${pipeline.entity.singular}`}
          </button>
        </div>
      </form>
    </div>
  )
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function TextField({ label, error, ...rest }: TextFieldProps) {
  const id = `field-${rest.name ?? label}`
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="input" aria-invalid={error ? true : undefined} {...rest} />
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
