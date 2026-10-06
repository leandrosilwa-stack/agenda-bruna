-- Migração Planner (rode 1x no SQL Editor)
create table if not exists public.planner_eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  data date not null,
  status text not null default 'a_fazer' check (status in ('a_fazer','fazendo','feito')),
  prioridade text not null default 'media' check (prioridade in ('baixa','media','alta')),
  observacao text,
  created_at timestamptz default now()
);
create index if not exists idx_planner_data on public.planner_eventos(data);
create index if not exists idx_planner_status on public.planner_eventos(status);

alter table public.planner_eventos enable row level security;
drop policy if exists "publico_total_planner" on public.planner_eventos;
create policy "publico_total_planner"
  on public.planner_eventos for all
  to anon, authenticated
  using (true)
  with check (true);
