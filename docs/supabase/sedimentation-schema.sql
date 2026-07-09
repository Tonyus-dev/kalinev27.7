-- PR 2 — Honest Sedimentation Storage Bridge
-- Este SQL é ponte futura. Não é ativado por este PR.
-- Supabase será persistência futura em nuvem; a implementação atual usa persistência local do dispositivo.

create table if not exists public.kaline_sediments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  text text not null,
  source text not null check (source in ('chat','manual','import')),
  status text not null check (status in ('pendente','revisado','arquivado')),
  facet text null check (facet in ('kaline')),
  tags text[] not null default '{}',
  origin jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kaline_garden_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  content text not null,
  category text not null check (category in ('kaline','usuario','ecossistema','preferencia')),
  tags text[] not null default '{}',
  importance int not null default 3 check (importance between 1 and 5),
  approved_at timestamptz not null default now(),
  next_review_at date null,
  archived boolean not null default false,
  derived_from_sediment_id uuid null references public.kaline_sediments(id)
);

alter table public.kaline_sediments enable row level security;
alter table public.kaline_garden_memories enable row level security;

create policy "kaline_sediments_select_own" on public.kaline_sediments for select using (auth.uid() = user_id);
create policy "kaline_sediments_insert_own" on public.kaline_sediments for insert with check (auth.uid() = user_id);
create policy "kaline_sediments_update_own" on public.kaline_sediments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "kaline_sediments_delete_own" on public.kaline_sediments for delete using (auth.uid() = user_id);

create policy "kaline_garden_select_own" on public.kaline_garden_memories for select using (auth.uid() = user_id);
create policy "kaline_garden_insert_own" on public.kaline_garden_memories for insert with check (auth.uid() = user_id);
create policy "kaline_garden_update_own" on public.kaline_garden_memories for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "kaline_garden_delete_own" on public.kaline_garden_memories for delete using (auth.uid() = user_id);
