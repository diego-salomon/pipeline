import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BoardScreen } from '../BoardScreen'
import { ServiceProvider } from '../../app/ServiceContext'
import { createLeadService, type LeadService } from '../../../application/leadService'
import { createInMemoryLeadRepository } from '../../../infrastructure/inMemoryLeadRepository'
import { pipeline, stageOrder } from '../../../config/pipeline.config'
import type { LeadDraft } from '../../../domain/types'

const stageLabel = (id: string) => pipeline.stages.find((s) => s.id === id)?.label ?? id

function makeService(): LeadService {
  let n = 0
  let t = 0
  return createLeadService({
    repo: createInMemoryLeadRepository(),
    id: () => `id-${++n}`,
    now: () => `2026-01-01T00:00:${String(t++).padStart(2, '0')}.000Z`,
    stageOrder,
    stageLabel,
  })
}

const draft = (organization: string): LeadDraft => ({
  organization,
  contactName: 'Contacto',
  phone: '+58 412 555 0000',
  email: 'contacto@ejemplo.com',
  product: 'Producto',
  quantity: 1,
  estimatedValue: 100,
})

function renderBoard(service: LeadService) {
  return render(
    <MemoryRouter>
      <ServiceProvider value={{ service, mode: 'demo', resetAvailable: true, storageWarning: false }}>
        <BoardScreen />
      </ServiceProvider>
    </MemoryRouter>,
  )
}

const FIRST = pipeline.stages[0].label
const SECOND = pipeline.stages[1].label

describe('BoardScreen', () => {
  it('renders seeded leads', async () => {
    const service = makeService()
    await service.create(draft('Comercializadora Alfa'))
    await service.create(draft('Distribuidora Beta'))

    renderBoard(service)

    expect(await screen.findByText('Comercializadora Alfa')).toBeInTheDocument()
    expect(screen.getByText('Distribuidora Beta')).toBeInTheDocument()
  })

  it('advances a lead to the next stage column', async () => {
    const service = makeService()
    await service.create(draft('Comercializadora Alfa'))

    renderBoard(service)
    await screen.findByText('Comercializadora Alfa')

    await userEvent.click(screen.getByRole('button', { name: /mover a la siguiente etapa/i }))

    await waitFor(() => {
      const section = screen.getByRole('heading', { name: SECOND }).closest('section')
      expect(section).not.toBeNull()
      expect(within(section as HTMLElement).getByText('Comercializadora Alfa')).toBeInTheDocument()
    })

    const firstSection = screen.getByRole('heading', { name: FIRST }).closest('section') as HTMLElement
    expect(within(firstSection).queryByText('Comercializadora Alfa')).toBeNull()
  })
})
