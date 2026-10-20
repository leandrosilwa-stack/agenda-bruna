-- Migração Farmácia (rode 1x no SQL Editor)
create table if not exists public.farmacia_meses (
  id uuid primary key default gen_random_uuid(),
  ano int not null check (ano between 2000 and 2100),
  mes int not null check (mes between 1 and 12),
  auxilio numeric(12,2) not null default 0,
  updated_at timestamptz default now(),
  unique (ano, mes)
);

create table if not exists public.farmacia_itens (
  id uuid primary key default gen_random_uuid(),
  ano int not null check (ano between 2000 and 2100),
  mes int not null check (mes between 1 and 12),
  categoria text not null check (categoria in ('convenio_particular','convenio_terceiros','consultas','farmacia')),
  descricao text not null,
  valor numeric(12,2) not null check (valor >= 0),
  data date,
  ordem int not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_farmacia_meses_ano on public.farmacia_meses(ano, mes);
create index if not exists idx_farmacia_itens_ano on public.farmacia_itens(ano, mes);
create index if not exists idx_farmacia_itens_cat on public.farmacia_itens(categoria);

alter table public.farmacia_meses enable row level security;
alter table public.farmacia_itens enable row level security;

drop policy if exists "publico_total_farmacia_meses" on public.farmacia_meses;
create policy "publico_total_farmacia_meses"
  on public.farmacia_meses for all
  to anon, authenticated using (true) with check (true);

drop policy if exists "publico_total_farmacia_itens" on public.farmacia_itens;
create policy "publico_total_farmacia_itens"
  on public.farmacia_itens for all
  to anon, authenticated using (true) with check (true);
