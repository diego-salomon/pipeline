import { test, expect } from '@playwright/test'

// Full funnel: sign in → create lead → advance through every stage → close →
// confirm it cannot advance past the terminal stage. Runs against the demo
// (localStorage) build served by the Playwright webServer.

const STAGES = ['Nuevo contacto', 'Cotización enviada', 'En evaluación', 'Negociación', 'Pedido cerrado']

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/')
  // Gated routes redirect to the account page to sign in.
  await expect(page).toHaveURL(/\/admin$/)
  await page.getByLabel('Contraseña').fill('demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/$/)
}

test('create a lead, advance through the funnel, and stop at closed', async ({ page }) => {
  await signIn(page)

  // Create a new lead.
  await page.getByRole('link', { name: /nueva oportunidad/i }).click()
  await expect(page).toHaveURL(/\/leads\/new$/)

  await page.getByLabel('Organización').fill('Prueba E2E S.A.')
  await page.getByLabel('Nombre de contacto').fill('Marta Gómez')
  await page.getByLabel('Teléfono').fill('+58 412 555 9999')
  await page.getByLabel('Correo').fill('marta@pruebae2e.com')
  await page.getByLabel('Producto').fill('Lote de prueba')
  await page.getByLabel('Cantidad').fill('10')
  await page.getByLabel('Valor estimado').fill('5000')
  await page.getByRole('button', { name: /crear oportunidad/i }).click()

  // Land on the detail page in the first stage.
  await expect(page).toHaveURL(/\/leads\/[^/]+$/)
  const chip = page.getByTestId('stage-chip')
  await expect(chip).toHaveText(STAGES[0])

  const advanceButton = page.getByRole('button', { name: /mover a la siguiente etapa|cerrar venta/i })

  // Advance through each remaining stage.
  for (let i = 1; i < STAGES.length; i++) {
    await advanceButton.click()
    await expect(chip).toHaveText(STAGES[i])
  }

  // At the terminal stage: no advance control, and a clear "can't advance" note.
  await expect(advanceButton).toHaveCount(0)
  await expect(page.getByText(/no puede avanzar más/i)).toBeVisible()
})

test('validates the new-lead form', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: /nueva oportunidad/i }).click()
  await page.getByRole('button', { name: /crear oportunidad/i }).click()
  // Still on the form, with required-field errors shown.
  await expect(page).toHaveURL(/\/leads\/new$/)
  await expect(page.getByText('Requerido').first()).toBeVisible()
})

test('business page is public (no sign-in)', async ({ page }) => {
  await page.goto('/empresa')
  await expect(page).toHaveURL(/\/empresa$/)
  await expect(page.getByRole('heading', { name: 'Contacto' })).toBeVisible()
})
