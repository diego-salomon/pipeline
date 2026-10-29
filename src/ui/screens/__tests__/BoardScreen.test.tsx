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

describe('BoardScreen', () => {
  it('renders seeded leads', async () => {
    const service = makeService()
    await service.create(draft('Comercializadora Alfa'))
    await service.create(draft('Distribuidora Beta'))

    renderBoard(service)

    // Each open lead now shows in both "Para hoy" and the funnel column.
    expect((await screen.findAllByText('Comercializadora Alfa')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Distribuidora Beta').length).toBeGreaterThan(0)
  })

  it('advances a lead to the next stage column', async () => {
    const service = makeService()
    await service.create(draft('Comercializadora Alfa'))

    renderBoard(service)
    await screen.findAllByText('Comercializadora Alfa')

    const firstColumn = () => screen.getByTestId(`col-${stageOrder[0]}`)
    const secondColumn = () => screen.getByTestId(`col-${stageOrder[1]}`)

    // Before: the first column holds the lead; the second is empty.
    expect(within(firstColumn()).queryByText('Sin registros')).toBeNull()
    expect(within(secondColumn()).getByText('Sin registros')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /mover a la siguiente etapa/i }))

    // After: the lead left the first column (now empty) and the second filled.
    await waitFor(() => {
      expect(within(firstColumn()).getByText('Sin registros')).toBeInTheDocument()
      expect(within(secondColumn()).queryByText('Sin registros')).toBeNull()
    })
  })
})
