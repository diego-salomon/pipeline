# Idea: Grabar llamada → análisis de venta

> Propuesta de Diego (2026-10-29), a futuro. "Que sea una opción."

Integrar la herramienta **Grabar Llamada** en Pipeline para cerrar el ciclo de
una venta sin salir de la oportunidad:

1. Desde una oportunidad, **grabar** la llamada de ventas (en altavoz, el
   micrófono capta ambos lados).
2. Obtener la **transcripción completa** (sin resumen).
3. **Análisis automático** de la conversación: qué se puede mejorar en la
   venta, qué puntos conviene seguir, qué vale la pena ofrecer, próximos pasos.
4. Adjuntar transcripción + análisis al **historial** de la oportunidad como
   una entrada más (nueva `HistoryKind`, p. ej. `call-analysis`).

**Encaja con la arquitectura actual:** una nueva clase de entrada de historial
y un adaptador (transcripción + LLM) detrás de un puerto, igual que el
repositorio. En demo se puede simular; en live corre de verdad.

Pendiente de decidir: de dónde sale la transcripción (la herramienta Grabar
Llamada o mlx-whisper), y dónde corre el análisis.
