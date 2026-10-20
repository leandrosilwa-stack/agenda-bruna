-- Migração Planner JP + separação por planner (rode 1x)
alter table public.planner_eventos
  add column if not exists planner text not null default 'principal';

create index if not exists idx_planner_planner on public.planner_eventos(planner);

-- Eventos que já existiam ficam no planner principal
update public.planner_eventos set planner = 'principal' where planner is null;
