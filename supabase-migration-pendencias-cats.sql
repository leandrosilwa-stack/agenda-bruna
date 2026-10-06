-- Migração categorias editáveis (rode 1x)
create table if not exists public.pendencias_categorias (
  id int primary key,
  nome text not null unique,
  created_at timestamptz default now()
);
alter table public.pendencias_categorias enable row level security;
drop policy if exists "publico_total_pend_cats" on public.pendencias_categorias;
create policy "publico_total_pend_cats"
  on public.pendencias_categorias for all
  to anon, authenticated using (true) with check (true);

insert into public.pendencias_categorias (id, nome) values
  (1,'Prioridades'),
  (2,'Saúde & família'),
  (3,'Financeiro & burocracia'),
  (4,'Casa, compras & projetos'),
  (5,'Evento & planejamento')
on conflict (id) do update set nome = excluded.nome;
