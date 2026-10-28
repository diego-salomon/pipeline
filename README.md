# Pipeline

A generic, white-label sales CRM: track leads through a configurable funnel from your phone. The same code runs two ways, chosen by one env variable:

- **Demo mode** (default) — everything in the browser on `localStorage`, with seeded example data. For sales demos and portfolio use. No backend, no sign-up.
- **Live mode** — a real [Supabase](https://supabase.com) backend (Postgres + Auth + RLS), multi-tenant so one deployment can serve many clients.

Neutral Latin-American Spanish out of the box. Mobile-first, light + dark, WCAG AA.

## Quick start

```bash
pnpm install
pnpm dev
```

Open the app, and when the demo gate appears sign in with the password `demo` (this is **not** real security — it just hides the demo). The board loads with example leads.

## Run modes

Copy `.env.example` to `.env` and set `VITE_MODE`:

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_MODE` | `demo` | `demo` = localStorage, `live` = Supabase |
| `VITE_DEMO_PASSWORD` | `demo` | Demo gate password (demo mode) |
| `VITE_SUPABASE_URL` | — | Supabase project URL (live mode) |
| `VITE_SUPABASE_ANON_KEY` | — | Supabase anon key (live mode) |

## White-label: two files

Everything client-specific lives in exactly two files — no client strings in components:

- [`src/config/brand.config.ts`](src/config/brand.config.ts) — name, tagline, logo, palette, locale, currency, contact details, socials.
- [`src/config/pipeline.config.ts`](src/config/pipeline.config.ts) — funnel stages, field labels, history-activity labels.

Currency and dates are formatted from `locale` + `currency`, so you never hardcode a symbol. Change the palette and both light and dark themes follow.

### The funnel

Stages are an ordered list. `nextStage()` advances one step; the **last** stage is terminal (closed) and cannot advance. The default funnel:

```
nuevo-contacto → cotización-enviada → en-evaluación → negociación → pedido-cerrado
```

Edit the list in `pipeline.config.ts` to fit any sales process.

## Architecture

Clean, layered, dependencies point inward:

```
src/domain/          Pure, framework-free, fully unit-tested (stages, history, validation, lead ops)
src/application/     Use cases (LeadService) behind ONE repository port
src/infrastructure/  Adapters: localStorage, Supabase, in-memory; clock, id, seed
src/ui/              React 19 + React Router 7 screens, design system, auth
```

The backend seam is a single port, [`LeadRepository`](src/application/ports.ts), with two implementations wired in [`src/main.tsx`](src/main.tsx) by `VITE_MODE`. The port is `Promise`-based (the methods are `list/get/save/remove/resetToSeed`) so the same UI drives both the synchronous localStorage adapter and the remote Supabase adapter.

### Screens

- **Tablero** (`/`) — the pipeline as columns by stage (a stacked list on mobile); each card shows organization, value and last activity, with "Mover a la siguiente etapa".
- **Detalle** (`/leads/:id`) — editable fields, history timeline, add note, log simulated email/WhatsApp, advance/close, delete.
- **Nueva** (`/leads/new`) — validated creation form.
- **Cuenta** (`/admin`) — sign-in + account; reset demo (demo mode only).
- **Empresa** (`/empresa`) — public business page from `brand.config.ts`, no sign-in.

## Live mode (Supabase)

1. Create a Supabase project.
2. Run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) in the SQL editor. It creates `tenants`, `memberships`, `leads`, `lead_history`, enables **Row-Level Security**, and scopes every row to the signed-in user's tenant. There is no public write surface.
3. Provision a tenant + membership for your user (see the commented bootstrap at the bottom of the migration).
4. Set `VITE_MODE=live` and the Supabase env vars, then `pnpm dev`. Sign in with Supabase Auth.

Stage definitions stay in app config; a client that needs DB-persisted custom stages can use the optional `pipeline_stages` table sketched in the migration.

## Scripts

```bash
pnpm dev               # dev server
pnpm build             # typecheck + production build
pnpm test              # unit + integration tests (Vitest)
pnpm test:e2e:install  # one-time: download Chromium
pnpm test:e2e          # end-to-end (Playwright, desktop + 375px mobile)
pnpm lint              # ESLint (no-console is an error)
pnpm typecheck         # tsc --build
```

## Tech

React 19 · TypeScript (strict) · Vite 6 · React Router 7 · Tailwind CSS 4 · Vitest + Testing Library · Playwright · Supabase. Node 20+.
