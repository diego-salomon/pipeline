<div align="center">

# 🤝 Pipeline

### A white-label sales CRM: track leads through a configurable funnel, from your phone.

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vite.dev)
[![Tested](https://img.shields.io/badge/tested-Vitest_%2B_Playwright-729B1B?logo=playwright&logoColor=white&style=flat-square)](#architecture)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

### [▶  Try the live demo](https://diego-salomon.github.io/pipeline/)

<sub>Runs in your browser, no sign-up. At the demo gate, enter the password <code>demo</code>.</sub>

<br>

<img src="docs/assets/board.png" width="880" alt="The funnel: every lead laid out by stage, each card showing the amount in play, the stage, and how long since it was last touched." />

</div>

---

## What it does

A sales CRM you run from your phone. It keeps every lead on one board: how much money is in play, how much is won, which leads have gone cold, and where each one sits in the funnel. Add a lead, move it a stage at a time, and the totals update as you go. Pre-seeded with example data so you can click around right away.

Neutral Latin-American Spanish out of the box. Mobile-first, light and dark, WCAG AA.

<div align="center">
<br>
<img src="docs/assets/board-mobile.png" width="300" alt="The board on a phone: money in play and money won, the day's leads with their amounts, and the funnel below." />
<br><sub>Built for the phone</sub>
</div>

## White-label: two files

Everything client-specific lives in exactly two files. No client strings in components:

- [`src/config/brand.config.ts`](src/config/brand.config.ts): name, tagline, logo, palette, locale, currency, contact details, socials.
- [`src/config/pipeline.config.ts`](src/config/pipeline.config.ts): funnel stages, field labels, history-activity labels.

Currency and dates are formatted from `locale` and `currency`, so you never hardcode a symbol. Change the palette and both light and dark themes follow.

### The funnel

Stages are an ordered list. `nextStage()` advances one step; the last stage is terminal (closed) and cannot advance. The default funnel:

```
nuevo-contacto → cotización-enviada → en-evaluación → negociación → pedido-cerrado
```

Edit the list in `pipeline.config.ts` to fit any sales process.

## Quick start

```bash
pnpm install
pnpm dev
```

Open the app and sign in at the demo gate with the password `demo` (this is not real security, it just hides the demo). The board loads with example leads.

## Architecture

Clean, layered, dependencies point inward:

```
src/domain/          Pure, framework-free, fully unit-tested (stages, history, validation, lead ops)
src/application/     Use cases (LeadService) behind ONE repository port
src/infrastructure/  Adapters: in-browser storage, in-memory; clock, id, seed
src/ui/              React 19 + React Router 7 screens, design system, auth
```

The backend seam is a single port, [`LeadRepository`](src/application/ports.ts). The demo runs on an in-browser storage adapter; a remote adapter can sit behind the same port without touching the domain, application, or UI code.

---

<div align="center">
<sub>Built by <a href="https://github.com/diego-salomon">Diego Salomón</a>. · <a href="https://www.linkedin.com/in/diegosalomon">LinkedIn</a></sub>
</div>
