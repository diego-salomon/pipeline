# Direcciones de diseño — Pipeline (puerta 2)

**Semilla del dado:** 762924 · **Modo:** Operar · Fecha: 2026-10-29
Las tres resuelven el **mismo** nivel 1 (Foco del día: a quién seguir hoy +
dinero en juego) de formas distintas. Ninguna cambia la jerarquía del brief.

Costumbres que quedan **fuera** (rubro y su contrario): azul corporativo con
tarjetas blancas redondeadas; casi-negro con acento ácido (dashboard de moda).
De Linear/Things se toman **cualidades** (jerarquía fuerte, poco color,
velocidad), no la piel.

---

## A — Kardex *(asignada · recomendada)*

**Tesis:** la cartera del vendedor era un tarjetero de fichas; la de hoy
sobresale. Cada ficha lleva una pestaña de color que es su etapa.

- **Estrategia de color:** Contenida (neutros cálidos + un acento verde).
- **Paleta:**
  - `#F5F1E8` papel hueso (ficha de cartón) — fondo
  - `#1E2A3A` tinta azul-negra (bolígrafo) — texto
  - `#CDC6B6` gris cartón — filetes/bordes de ficha
  - `#3E7D5A` verde kardex — acento (acción + pestaña)
  - `#B05A3C` óxido — traza de "frío/urgente", dosis mínima
- **Tipografía:** *Libre Franklin* (grotesca americana de oficina; recta pero
  humanista, seria sin ser fría, legible chica) para toda la UI; *Newsreader*
  (serif de lectura con números de peso) solo para las cifras de dinero, para
  que el monto "suene" a cifra que importa. Una disciplina, dos voces.
- **Primera pantalla:**
  ```
  Pipeline              [demo] ☾
  ───────────────────────────────
  HOY · sigue a estos 4
  ┌─[cotización]──────────────┐
  │ Grupo Andino    US$18.750 │
  │ sin tocar hace 3 días  ●  │
  └───────────────────────────┘
  ┌─[evaluación]──────────────┐
  │ Distribuidora…  US$14.400 │
  └───────────────────────────┘
  En juego US$75.200 · Ganado US$6.000
  ───────────────────────────────
  EMBUDO POR ETAPA  (nivel 2)
  Nuevo 2 · Cotización 2 · Eval 2…
  ```
  Resuelve el nivel 1: la franja "HOY" son las oportunidades abiertas más
  frías (ordenadas por última actividad) con su monto; el embudo por etapas
  baja a nivel 2.
- **Gesto firma:** la **pestaña de color del tarjetero** que sobresale del
  borde de cada ficha marcando su etapa. Al avanzar, la pestaña cambia de
  color y la ficha se desliza hacia el embudo de abajo.
- **Peso visual:** texto fuerte de organización + monto ancla arriba a la
  izquierda; pestañas de color como trazas, nunca como franjas.
- **Riesgo:** si las pestañas se multiplican o engordan, cae en "franja de
  color" (costumbre). Una pestaña por ficha, pocas, finas.

---

## B — Talonario

**Tesis:** vender deja comprobante; el historial son las copias al carbón y
cada avance se estampa con un sello.

- **Estrategia de color:** Choque (contrarios psicológicos azul–rojo).
- **Paleta:**
  - `#FBFAF7` copia en blanco — fondo
  - `#223A5E` azul carbón (papel calco) — texto/filetes
  - `#9E2B2B` rojo granate (numerador) — sello/folio, acento
  - `#8A8F98` gris segunda copia — secundario
  - `#CFE0D4` verde pálido (tercera hoja) — traza de confirmación
- **Tipografía:** *Archivo* (grotesca de rótulo, estrecha y recta, de
  formulario) para titulares y etiquetas; *Courier Prime* (máquina de escribir
  real) **solo** en los folios/números de comprobante. La monoespaciada se usa
  porque el objeto es un talonario numerado, no como disfraz "técnico".
- **Primera pantalla:**
  ```
  Pipeline                 N.º 0428
  ───────────────────────────────
  PARA HOY
  001  Grupo Andino    18.750 ▸
  002  Distribuidora    14.400 ▸
  ───────────────────────────────
  EN JUEGO             75.200
  GANADO                6.000
  ───────────────────────────────
  EMBUDO POR ETAPA …
  ```
  Nivel 1: "para hoy" como renglones de talonario + subtotal en juego.
- **Gesto firma:** el **sello de etapa** entintado que se estampa en la ficha
  al avanzar; folios numerados correlativos.
- **Peso visual:** filetes y numeración anclan; el rojo del sello es la única
  traza saturada.
- **Riesgo:** mono + numeración puede leerse "técnico de disfraz" si no se
  siente papel de verdad (grano, sello). Vive o muere en ese detalle.

---

## C — Libro mayor

**Tesis:** el día como un asiento contable — a quién seguir, con su monto,
cerrado por un doble filete y su total, como un balance.

- **Estrategia de color:** Análoga fría apagada + chispa complementaria.
- **Paleta:**
  - `#E7EDE4` papel registro (verde contable) — fondo
  - `#243028` verde pizarra oscuro — texto
  - `#9FB1A0` verde salvia — filetes
  - `#B8663F` terracota (sello de auditoría) — chispa, solo en el total
  - `#F3F1E9` crema — tarjeta
- **Tipografía:** *Source Serif 4* (serif de contraste moderado, números
  elegantes) para cifras y titulares; *Public Sans* (grotesca neutra de
  documento oficial) para etiquetas y UI. Cifras tabulares alineadas.
- **Primera pantalla:**
  ```
  Pipeline
  ───────────────────────────────
  POR SEGUIR HOY        │   MONTO
  Grupo Andino          │  18.750
  Distribuidora         │  14.400
  ══════════════════════╪════════
  EN JUEGO              │  75.200
  GANADO                │   6.000
  ───────────────────────────────
  Embudo por etapa …
  ```
  Nivel 1: el "mayor" del día, cerrado con doble filete y total.
- **Gesto firma:** el **doble filete contable** que cierra el total y la
  alineación tabular impecable de las cifras.
- **Peso visual:** la columna de montos a la derecha, alineada, ordena y pesa;
  verde apagado de fondo, lo oscuro abajo.
- **Riesgo:** puede enfriarse a "hoja de cálculo". La calidez tiene que venir
  de la serif y del filete terracota, no de decoración.

---

**Recomiendo A (Kardex):** es la que más le pertenece al oficio del vendedor,
resuelve el nivel 1 sin forzar y es la más sobria-con-carácter para el
teléfono. B arriesga más carácter; C es la más fría y "de números".

Puedes **elegir una, mezclar** ("la paleta de A con el gesto de C") o **pedir
otra tirada**. Al mezclar, una dirección manda y de la otra se toma una
disciplina, no su ropa.
