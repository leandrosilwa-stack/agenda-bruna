-- ============================================
-- agenda BRUNA - Seed Farmácia (dados migrados do app local)
-- Rode DEPOIS de supabase-migration-farmacia.sql
-- ============================================
begin;
delete from public.farmacia_itens;
delete from public.farmacia_meses;

-- Ano 2026 : auxílios
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,1,2746.25) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,2,2746.25) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,3,2796.47) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,4,2943.24) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,5,2842.8) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,6,2842.8) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,7,2842.8) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,8,3800.72) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,9,4982.64) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,10,4982.64) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,11,4982.64) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();
insert into public.farmacia_meses (ano, mes, auxilio) values (2026,12,4982.64) on conflict (ano,mes) do update set auxilio=excluded.auxilio, updated_at=now();

-- Ano 2026 : convenio_particular
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,1,'convenio_particular','UNIMED',1041.47,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,2,'convenio_particular','UNIMED',1041.47,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,3,'convenio_particular','UNIMED',868.84,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,4,'convenio_particular','UNIMED',989.58,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,5,'convenio_particular','UNIMED',451.65,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,5,'convenio_particular','Coparticipação',537.93,'2026-10-20',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,6,'convenio_particular','UNIMED',451.65,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,6,'convenio_particular','Coparticipação',537.93,'2026-10-20',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,7,'convenio_particular','UNIMED',451.65,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,7,'convenio_particular','Coparticipação',537.93,'2026-10-20',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'convenio_particular','UNIMED',838.85,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'convenio_particular','Coparticipação',387.2,'2026-10-19',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'convenio_particular','UNIMED',486.11,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'convenio_particular','Coparticipação',387.85,'2026-10-19',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,10,'convenio_particular','UNIMED',486.11,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,11,'convenio_particular','UNIMED',486.11,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,12,'convenio_particular','UNIMED',486.11,'2026-08-28',1);

-- Ano 2026 : convenio_terceiros
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,1,'convenio_terceiros','ISEC',824.37,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,2,'convenio_terceiros','ISEC',824.37,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,3,'convenio_terceiros','ISEC',824.37,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,4,'convenio_terceiros','ISEC',870.85,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,5,'convenio_terceiros','ISEC',870.85,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,6,'convenio_terceiros','ISEC',870.85,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,7,'convenio_terceiros','ISEC',870.85,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'convenio_terceiros','ISEC',870.85,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'convenio_terceiros','ISEC',870.85,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,10,'convenio_terceiros','ISEC',870.85,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,11,'convenio_terceiros','ISEC',870.85,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,12,'convenio_terceiros','ISEC',870.85,'2026-08-28',1);

-- Ano 2026 : consultas
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'consultas','consulta clínico',250,'2026-09-26',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'consultas','consulta neuro',250,'2026-09-26',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'consultas','consulta psiq',300,'2026-09-26',3);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'consultas','Consulta Barbara',650,'2026-09-26',1);

-- Ano 2026 : farmacia
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,1,'farmacia','Farmácia',1176.96,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,2,'farmacia','Farmácia',1329.97,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,3,'farmacia','Farmácia',1002.4,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,4,'farmacia','Farmácia',1060.61,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,5,'farmacia','Farmácia',246.5,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,6,'farmacia','Farmácia',167.15,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,7,'farmacia','Farmácia',1466,'2026-08-28',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,7,'farmacia','cesar',46.35,'2026-10-19',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,7,'farmacia','cesar',110.78,'2026-10-19',3);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,7,'farmacia','cesar',164.14,'2026-10-19',4);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','CONPR:334655336 — VALOR: TERÇAS',34.99,'2026-08-27',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','Farmácia',50.99,'2026-08-28',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','Farmácia',69.6,'2026-08-28',3);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','pague menos',52.39,'2026-09-24',4);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','drogasil',34.99,'2026-09-24',5);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','Cesar',11.19,'2026-10-19',6);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','Cesar',276.54,'2026-10-19',7);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','cesar',29.89,'2026-10-19',8);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','cesar',161.08,'2026-10-19',9);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,8,'farmacia','cesar',192.95,'2026-10-19',10);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','pague menos',129.58,'2026-09-24',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','pague menos',34.23,'2026-09-24',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','drogasil',270.97,'2026-09-24',3);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','drogasil',73.93,'2026-09-24',4);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','pague menos',192.96,'2026-09-24',5);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','remédio Barbara',945.3,'2026-09-26',6);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','drogasil',50.64,'2026-09-30',7);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','César',133.94,'2026-10-19',8);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','César',110.8,'2026-10-19',9);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','cesar',160.16,'2026-10-19',10);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','cesar',116.09,'2026-10-19',11);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,9,'farmacia','cesar',85.22,'2026-10-19',12);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,10,'farmacia','cesar',9.68,'2026-10-19',1);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,10,'farmacia','cesar',109.13,'2026-10-19',2);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,10,'farmacia','barbara',1200,'2026-10-20',3);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,10,'farmacia','bruna',86.22,'2026-10-20',4);
insert into public.farmacia_itens (ano, mes, categoria, descricao, valor, data, ordem) values (2026,10,'farmacia','cesar',44.99,'2026-10-20',5);

commit;

-- Conferência (deve bater com o app local)
-- Itens esperados: 70 | Soma esperada: 33668.51
select count(*) as itens from public.farmacia_itens;
select count(*) as meses from public.farmacia_meses;
select round(sum(valor)::numeric, 2) as total_gasto from public.farmacia_itens;
select ano, mes, auxilio from public.farmacia_meses order by ano, mes;
