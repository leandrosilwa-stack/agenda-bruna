-- Migração Pendências (rode 1x no SQL Editor)
create table if not exists public.pendencias (
  id uuid primary key default gen_random_uuid(),
  categoria int not null check (categoria between 1 and 5),
  titulo text not null,
  concluida boolean not null default false,
  concluida_em timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_pendencias_cat on public.pendencias(categoria);
create index if not exists idx_pendencias_conc on public.pendencias(concluida);
create unique index if not exists uq_pend_cat_titulo on public.pendencias(categoria, titulo);

alter table public.pendencias enable row level security;
drop policy if exists "publico_total_pendencias" on public.pendencias;
create policy "publico_total_pendencias"
  on public.pendencias for all
  to anon, authenticated
  using (true)
  with check (true);

-- Seeds iniciais (só insere se ainda não existir igual)
-- Cat 1 - Prioridades
insert into public.pendencias (categoria, titulo) values
(1,'2 processos de meta pendentes + meta semanal de 7 processos'),
(1,'Preparação TJBA — oral 18/12'),
(1,'Laudo TJBA — 01 a 14/10'),
(1,'Psicotécnico TJBA — 18/10'),
(1,'Comprar passagem + hospedagem TJBA'),
(1,'Acompanhar resultado TJRN'),
(1,'Trabalhos do mestrado: 2 trabalhos curtos, template e projeto'),
(1,'Artigo da disciplina de segunda'),
(1,'Artigo da disciplina de quinta'),
(1,'Resultado pedido de bolsa de mestrado TJCE'),
(1,'Reconhecimento do mestrado — aguardar acreditação')
on conflict do nothing;

-- Cat 2 - Saúde & família
insert into public.pendencias (categoria, titulo) values
(2,'Vacinar João após recuperação + HPV'),
(2,'Mostrar exames US/calcitonina'),
(2,'Dieta + fórmulas Wallyson'),
(2,'Autorizações Unimed / endometriose'),
(2,'Infiltração joelho'),
(2,'Fisioterapia pélvica'),
(2,'Colonoscopia'),
(2,'Tratar dor nas costas'),
(2,'Urologista João'),
(2,'Exames tireoide nov/26 + retorno Dr. Hugo'),
(2,'Confissão João'),
(2,'Agendar Psiquiatra ou Neuro / avaliação neuropsicológica')
on conflict do nothing;

-- Cat 3 - Financeiro & burocracia
insert into public.pendencias (categoria, titulo) values
(3,'Aprender finanças + levantar consignados'),
(3,'Saber o teor da sentença'),
(3,'Tribunal Eclesiástico — Bruna/Lê'),
(3,'Vacina Tails'),
(3,'Carregar cartucho preto'),
(3,'Comprar produtos dermatológicos'),
(3,'Acompanhar resultado/andamento da bolsa'),
(3,'Acompanhar progressões atrasadas'),
(3,'Pedir 2ª via CIN — Bruna, Lê, João'),
(3,'Estacionamento PCD'),
(3,'Consultar CearáPrev Mamãe'),
(3,'Consultar processo Campinas')
on conflict do nothing;

-- Cat 4 - Casa, compras & projetos
insert into public.pendencias (categoria, titulo) values
(4,'Limpar ar-condicionado João'),
(4,'Vender na OLX: bike antiga João + elíptico mamãe'),
(4,'Roupas João: blusa UV, regata, short esporte'),
(4,'Bico sapatos / conserto roupas'),
(4,'Bike João'),
(4,'Cama João + cama casal'),
(4,'Móvel banheiro social'),
(4,'Cadeiras Lê/João'),
(4,'Mesa trabalho Bruna (1,10 x 0,50 x 0,74)'),
(4,'Molduras diplomas'),
(4,'Almofadas sala + prendedor cortina + capa sofá'),
(4,'Projetar móvel sala/cozinha'),
(4,'Renovar paredes / rodapés'),
(4,'Porta sala / borracha geladeira'),
(4,'Porta quarto casal → correr'),
(4,'Pintar quarto — Baleia Azul'),
(4,'Trocar tomadas varanda'),
(4,'Organizar armários / fotos / objetos pessoais'),
(4,'Limpar espelhos, micro-ondas, ventiladores'),
(4,'Impermeabilizar cadeiras jantar'),
(4,'Lavar carro quinzenal'),
(4,'Placa viagem Roma João + álbum Roma + película mesa')
on conflict do nothing;

-- Cat 5 - Evento & planejamento
insert into public.pendencias (categoria, titulo) values
(5,'Programar aniversário Bruna — 17/10'),
(5,'Programar aniversário João — 14/11'),
(5,'Réveillon'),
(5,'Guaramiranga'),
(5,'Cursos de inglês João + natação')
on conflict do nothing;
