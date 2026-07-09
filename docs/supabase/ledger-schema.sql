-- K∧LINE Ledger / Mnemósine Ledger
-- Este SQL é ponte futura.
-- Não é ativado por este PR.
-- Não cria chat entre facetas.
-- Não transforma candidate em verdade final.

create table if not exists public.kaline_ledger_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  title text not null,
  content text not null,
  origin_facet text not null,
  target_facet text null,
  visibility text not null,
  status text not null,
  source text not null,
  tags text[] not null default '{}',
  related_sediment_id uuid null,
  related_garden_memory_id uuid null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz null,
  discarded_at timestamptz null,
  archived_at timestamptz null,

  constraint kaline_ledger_events_type_check check (
    type in (
      'decision',
      'handoff',
      'summary',
      'memory_candidate',
      'commercial_context',
      'care_context',
      'technical_context',
      'local_sync',
      'online_sync'
    )
  ),
  constraint kaline_ledger_events_origin_facet_check check (
    origin_facet in ('kaline')
  ),
  constraint kaline_ledger_events_target_facet_check check (
    target_facet is null or target_facet in ('kaline')
  ),
  constraint kaline_ledger_events_visibility_check check (
    visibility in ('private', 'facet_only', 'shared')
  ),
  constraint kaline_ledger_events_status_check check (
    status in ('draft', 'candidate', 'approved', 'discarded', 'archived')
  ),
  constraint kaline_ledger_events_source_check check (
    source in ('chat', 'manual', 'system', 'import')
  )
);

-- FK futura planejada, sem ativação neste SQL de ponte:
-- related_sediment_id poderá apontar para a tabela futura/real de sedimentos.
-- related_garden_memory_id poderá apontar para a tabela futura/real do Jardim.

alter table public.kaline_ledger_events enable row level security;

create policy "kaline_ledger_events_select_own"
  on public.kaline_ledger_events
  for select
  using (auth.uid() = user_id);

create policy "kaline_ledger_events_insert_own"
  on public.kaline_ledger_events
  for insert
  with check (auth.uid() = user_id);

create policy "kaline_ledger_events_update_own"
  on public.kaline_ledger_events
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "kaline_ledger_events_delete_own"
  on public.kaline_ledger_events
  for delete
  using (auth.uid() = user_id);
