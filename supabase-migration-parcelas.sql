-- Migração parcelas cartão de crédito (rode 1x no SQL Editor)
alter table public.transacoes
  add column if not exists parcelas_total int check (parcelas_total is null or (parcelas_total >= 1 and parcelas_total <= 21)),
  add column if not exists parcela_numero int check (parcela_numero is null or (parcela_numero >= 1 and parcela_numero <= 21)),
  add column if not exists grupo_parcela uuid;

create index if not exists idx_transacoes_grupo on public.transacoes(grupo_parcela);
