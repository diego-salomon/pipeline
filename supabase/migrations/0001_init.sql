-- ─────────────────────────────────────────────────────────────────────────
-- Pipeline CRM — multi-tenant schema with Row-Level Security.
--
-- One deployment serves many clients. Every row carries a tenant_id and RLS
-- scopes all access to the tenants the signed-in user belongs to. There is no
-- public write surface: every policy targets the `authenticated` role.
--
-- Run in the Supabase SQL editor (or via the Supabase CLI migrations).
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ── Tenancy ────────────────────────────────────────────────────────────────
create table if not exists public.tenants (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  user_id    uuid not null references auth.users (id) on delete cascade,
  tenant_id  uuid not null references public.tenants (id) on delete cascade,
  role       text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (user_id, tenant_id)
);

create index if not exists memberships_user_idx on public.memberships (user_id);

-- ── Domain tables ──────────────────────────────────────────────────────────
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants (id) on delete cascade,
  organization    text not null,
  contact_name    text not null,
  phone           text not null,
  email           text not null,
  product         text not null,
  quantity        integer not null check (quantity > 0),
  estimated_value numeric(14, 2) not null default 0 check (estimated_value >= 0),
  -- Stage ids live in the app config (white-label); kept as free text here.
  stage           text not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists leads_tenant_idx on public.leads (tenant_id);

create table if not exists public.lead_history (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads (id) on delete cascade,
  tenant_id  uuid not null references public.tenants (id) on delete cascade,
  kind       text not null check (kind in ('note', 'call', 'email', 'visit', 'whatsapp', 'stage')),
  text       text not null,
  at         timestamptz not null default now()
);

create index if not exists lead_history_lead_idx on public.lead_history (lead_id);
create index if not exists lead_history_tenant_idx on public.lead_history (tenant_id);

-- ── Row-Level Security ─────────────────────────────────────────────────────
alter table public.tenants       enable row level security;
alter table public.memberships   enable row level security;
alter table public.leads         enable row level security;
alter table public.lead_history  enable row level security;

-- Users can read the tenants they belong to.
create policy "tenants: read own"
  on public.tenants for select to authenticated
  using (id in (select tenant_id from public.memberships where user_id = auth.uid()));

-- Users can read their own membership rows (also used by the policies below).
create policy "memberships: read own"
  on public.memberships for select to authenticated
  using (user_id = auth.uid());

-- Full access to leads within the user's tenants.
create policy "leads: tenant access"
  on public.leads for all to authenticated
  using (tenant_id in (select tenant_id from public.memberships where user_id = auth.uid()))
  with check (tenant_id in (select tenant_id from public.memberships where user_id = auth.uid()));

-- Full access to history within the user's tenants.
create policy "lead_history: tenant access"
  on public.lead_history for all to authenticated
  using (tenant_id in (select tenant_id from public.memberships where user_id = auth.uid()))
  with check (tenant_id in (select tenant_id from public.memberships where user_id = auth.uid()));

-- ── Bootstrap a tenant + member (run once, as an admin) ─────────────────────
-- Tenants and memberships are provisioned out-of-band (service role / admin),
-- never by the client. Example:
--
--   insert into public.tenants (name) values ('Mi Empresa') returning id;
--   -- then, with the new tenant id and a user id from auth.users:
--   insert into public.memberships (user_id, tenant_id, role)
--   values ('<auth-user-uuid>', '<tenant-uuid>', 'owner');

-- ── Optional: persist custom stages per client ──────────────────────────────
-- Stage definitions normally live in src/config/pipeline.config.ts. If a
-- client needs stages stored in the database instead, add:
--
--   create table public.pipeline_stages (
--     tenant_id uuid not null references public.tenants (id) on delete cascade,
--     id        text not null,
--     label     text not null,
--     position  integer not null,
--     primary key (tenant_id, id)
--   );
--   alter table public.pipeline_stages enable row level security;
--   create policy "pipeline_stages: tenant access"
--     on public.pipeline_stages for all to authenticated
--     using (tenant_id in (select tenant_id from public.memberships where user_id = auth.uid()))
--     with check (tenant_id in (select tenant_id from public.memberships where user_id = auth.uid()));
