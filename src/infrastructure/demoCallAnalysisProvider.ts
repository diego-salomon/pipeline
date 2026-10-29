/**
 * Demo call-analysis adapter: no real audio, no network. It fabricates a
 * plausible transcript and analysis grounded in the deal context, so the whole
 * "grabar → transcribir → analizar" flow is demoable offline. The live adapter
 * (demoCallAnalysisProvider's counterpart) wires real transcription + an LLM.
 */

import type { CallAnalysisProvider, CallContext, CallInput } from '../application/ports'
import type { CallRecordingAnalysis } from '../domain/types'

function simulate(context: CallContext): CallRecordingAnalysis {
  const { organization, contactName, product, stageLabel } = context
  const transcript = [
    `[00:00] Vendedor: Hola ${contactName}, gracias por tomar la llamada. ¿Cómo van con ${product}?`,
    `[00:14] ${contactName}: Bien, lo estamos evaluando. El precio nos parece un poco alto frente a otra propuesta.`,
    `[00:31] Vendedor: Entiendo. ¿Qué volumen manejarían este trimestre?`,
    `[00:45] ${contactName}: Unas 40 unidades, quizá más si el primer pedido sale bien.`,
    `[01:02] Vendedor: Perfecto. Puedo revisar un descuento por volumen y los tiempos de entrega.`,
    `[01:20] ${contactName}: Eso ayudaría. También necesitamos saber el soporte posventa.`,
    `[01:38] Vendedor: Claro, lo incluimos. ¿Les envío una propuesta ajustada esta semana?`,
    `[01:50] ${contactName}: Sí, mándala y la vemos internamente.`,
  ].join('\n')

  return {
    transcript,
    durationSeconds: 110,
    analysis: {
      summary: `Llamada con ${contactName} (${organization}) en etapa “${stageLabel}”: interés con objeción de precio.`,
      improvements: [
        'Cuantificar el valor antes de hablar de descuento (ROI por unidad, no solo precio).',
        'Confirmar el presupuesto y el decisor final, que no quedaron claros.',
      ],
      followUps: [
        `Objeción de precio frente a la propuesta de la competencia.`,
        'Requisito de soporte posventa que mencionó el cliente.',
      ],
      offers: [
        'Descuento por volumen a partir de 40 unidades.',
        'Plan de soporte posventa incluido en la propuesta.',
      ],
      nextSteps: [
        'Enviar propuesta ajustada esta semana.',
        'Agendar seguimiento para revisar la propuesta internamente.',
      ],
    },
  }
}

export interface DemoCallAnalysisOptions {
  /** Simulated processing delay in ms (UI realism). Default 900. */
  delayMs?: number
}

export function createDemoCallAnalysisProvider(options: DemoCallAnalysisOptions = {}): CallAnalysisProvider {
  const delayMs = options.delayMs ?? 900
  return {
    async analyzeCall(input: CallInput): Promise<CallRecordingAnalysis> {
      if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))
      return simulate(input.context)
    },
  }
}
