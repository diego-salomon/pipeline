# Informe de diseño — Pipeline (fase 6)

Medido en el navegador (axe externo bloqueado; sondeo propio del DOM:
contraste calculado, táctiles, overflow, fuentes) + revisión por lentes sobre
las capturas de v02. Fecha: 2026-10-29.

## Mediciones

- **Contraste (claro):** 0 fallos AA sobre el texto real del Tablero.
- **Fuentes:** Archivo + Courier Prime cargadas (sin fallback a system/Inter).
- **Overflow horizontal @390px:** no (scrollWidth = viewport). ✓ piso.
- **Overflow @1440:** el contenedor del embudo filtra su scroll al documento (P2).
- **Táctiles <44px:** solo la navegación (34px alto) y enlaces de texto; el
  resto (botones, inputs, renglones) ≥44px.

## Lentes

| Área | Nota 0-4 | Lo principal |
|---|---|---|
| Accesibilidad | 3 | AA en claro; el granate de **texto** falla contraste en **oscuro** |
| Interfaz | 3 | el nivel 1 ("Para hoy") compite con el título "Tablero" y el botón azul |
| Visual + dirección | 3 | 5 sellos con recuadro en columna pesan de más en la lista |
| Totalidad (Alexander) | 3 | conjunto coherente; subtotales bien integrados al bloque |
| Textos | 4 | lenguaje del gremio, claro ("sin tocar hace…", "en juego/ganado") |

**Proteger:** el "Para hoy" como talonario (folios + subtotales con filete) y
el sello único del detalle como gesto firma.

## Arreglos aplicados (v03)

1. **[P1] Oscuro — granate de texto.** Folios/sellos/etiquetas de etapa en
   granate `#9E2B2B` sobre panel oscuro daban ~1.9:1. → nueva
   `--color-accent-ink` = el acento en claro y `color-mix(accent 60%, white)`
   en oscuro; la usan `.folio`, `.stamp` y las etiquetas de etapa.
2. **[P1] Nivel 1 gana.** Quité el `h1 "Tablero"` (redundante con la nav) y el
   botón azul grande; "Para hoy" pasa a ser el `h1` y "Nueva" queda como botón
   discreto (ghost) en su cabecera. Lo primero que se ve es el foco del día.
3. **[P1] Sellos de la lista más sobrios.** En "Para hoy" la etapa va como
   etiqueta granate sin recuadro; el **recuadro-sello** se reserva al detalle
   (un solo sello, más potente).
4. **[P2] Navegación táctil.** Subí el alto de los enlaces de nav.

**Pendiente (P2, documentado, no aplicado):** contener el scroll del embudo
dentro del ancho en desktop (no afecta móvil, que es la escena).

**Dilemas para Diego:** ninguno choca con el contrato de dirección.
