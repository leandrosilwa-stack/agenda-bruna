-- ============================================
-- agenda BRUNA - Schema Supabase (Financeiro)
-- Como usar: Supabase Dashboard > SQL Editor > New query > colar tudo > Run
-- ============================================

-- 1) Tabelas
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null check (tipo in ('entrada','gasto')),
  created_at timestamptz default now(),
  unique (nome, tipo)
);

create table if not exists public.transacoes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('entrada','gasto')),
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  nome text not null,
  data date not null,
  valor numeric(12,2) not null check (valor > 0),
  fixa boolean not null default false,
  forma_pagamento text,
  observacao text,
  created_at timestamptz default now()
);

create index if not exists idx_transacoes_data on public.transacoes(data);
create index if not exists idx_transacoes_tipo on public.transacoes(tipo);
create index if not exists idx_transacoes_categoria on public.transacoes(categoria_id);

-- 2) RLS - app aberto sem login (qualquer pessoa com o link lê/escreve)
-- ATENÇÃO: isso deixa os dados públicos para quem tiver a anon key.
-- Quando quiser login, me avise que eu travo as policies por usuário.
alter table public.categorias enable row level security;
alter table public.transacoes enable row level security;

drop policy if exists "publico_total_categorias" on public.categorias;
create policy "publico_total_categorias"
  on public.categorias for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "publico_total_transacoes" on public.transacoes;
create policy "publico_total_transacoes"
  on public.transacoes for all
  to anon, authenticated
  using (true)
  with check (true);

-- 3) Categorias iniciais (pode ajustar os nomes)
insert into public.categorias (nome, tipo) values
  ('Salário','entrada'),
  ('Freelance','entrada'),
  ('Outros ganhos','entrada'),
  ('Moradia','gasto'),
  ('Mercado','gasto'),
  ('Saúde','gasto'),
  ('Transporte','gasto'),
  ('Educação','gasto'),
  ('Lazer','gasto'),
  ('Outros gastos','gasto')
on conflict (nome, tipo) do nothing;
