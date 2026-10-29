# Brief de diseño — Pipeline (puerta 1)

**Pieza:** interfaz de Pipeline (app React real). **Modo:** Operar.
**Primera pantalla de trabajo:** el Tablero. Fecha: 2026-10-29.

## Decisiones del brief

- **Carácter:** operar con carácter — herramienta seria y rápida, con personalidad, sin caer en CRM gris.
- **Nivel 1 (primeros 3 s):** *a quién seguir hoy* + dinero en juego, por encima de las columnas.
- **Usuario foco de la pantalla principal:** Rodrigo (vendedor, en el teléfono). La vista de gerenta queda a un toque.
- **Norte estético:** sobrio con foco (cualidades de Linear/Things): tipografía fuerte, poco color, mucha jerarquía. No copiamos nada.

## El brief en 5 viñetas

- **Intención:** que al abrir, Rodrigo sienta control — "sé exactamente qué hacer ahora" — en vez de la ansiedad del Excel.
- **Objetivo:** que se vaya habiendo hecho (o sabiendo) el siguiente seguimiento. Una acción, no una contemplación.
- **Quién/dónde:** vendedor B2B, en el teléfono, entre tareas, con poca atención y una mano. Mobile-first de verdad.
- **Verdad propia:** el competidor real es WhatsApp+Excel; Pipeline gana si en 3 segundos dice *a quién seguir y cuánto está en juego*, cosa que una hoja no hace.
- **Piso fijo:** accesible (AA), legible a 375 px, rápido, sin romper la lógica ni los tests que ya pasan.

## Inventario y jerarquía

| Elemento | Papel (qué hace por el objetivo) | Nivel |
|---|---|---|
| **Foco del día** (a quién seguir + en juego/ganado) | Responde "¿qué hago ahora?" y "¿cuánto está en juego?" | **1** |
| Nueva oportunidad (acción) | Meter algo nuevo sin fricción | 2 |
| Pipeline por etapas (columnas) | El mapa completo, para ubicarse | 2 |
| Tarjeta: organización · valor · última actividad · mover etapa | La unidad de trabajo y su avance | 2 |
| Producto / detalle en la tarjeta | Se consulta si interesa | 3 |
| Navegación, tema, chip Demo | Chrome: orientación, no protagonismo | 3 |
| Footer con tagline | En una herramienta, estorba más que ayuda | **Fuera** (reducir a mínimo) |

**Lo que cambia respecto a hoy:** el Tablero muestra hoy las columnas como protagonista; pasan a **nivel 2**. Arriba entra un **"Foco del día"**: las oportunidades abiertas más frías (las que llevan más sin actividad) con su valor, y los totales en juego/ganado. El pipeline por etapas sigue, debajo.

## Camino

Abre (gate demo) → **entra por el Foco del día** (a quién seguir hoy + cuánto hay) → baja al pipeline por etapas → abre una ficha → **acción** (mover etapa / registrar contacto / crear) → vuelve al tablero y el Foco del día ya refleja el avance (el cierre se diseña: que se note el progreso).

---

**¿Confirmas este brief y su jerarquía, o corriges algo** (sobre todo el nivel 1 y lo que mandé "fuera")? Con tu OK paso a la puerta 2: tres direcciones visuales para que elijas.
