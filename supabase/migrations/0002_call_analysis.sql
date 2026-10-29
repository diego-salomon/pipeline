-- ─────────────────────────────────────────────────────────────────────────
-- Pipeline CRM — call-analysis history entries.
--
-- Adds the `call-analysis` history kind (a transcribed + analyzed sales call)
-- and a `data` jsonb column to hold its structured payload (transcript +
-- analysis). Existing entries keep `data` null.
-- ─────────────────────────────────────────────────────────────────────────

-- Allow the new kind.
alter table public.lead_history
  drop constraint if exists lead_history_kind_check;

alter table public.lead_history
  add constraint lead_history_kind_check
  check (kind in ('note', 'call', 'email', 'visit', 'whatsapp', 'stage', 'call-analysis'));

-- Structured payload for `call-analysis` entries (transcript + analysis).
-- Null for every other kind.
alter table public.lead_history
  add column if not exists data jsonb;
