-- ============================================================
-- INTELIGÊNCIA ARTILHEIRA — schema `copa`
-- Projeto Supabase: epiudtrblgeljjmogaho
-- Aplicar 1x (idempotente onde possível). RLS: leitura pública
-- (dashboard via publishable key), escrita só via service_role.
-- ============================================================

create schema if not exists copa;

-- ---------- TABELAS ----------

create table if not exists copa.selecoes (
  id          serial primary key,
  slug        text unique not null,
  nome        text not null,
  grupo       char(1) not null,
  ranking_fifa int                -- aproximado (nov/2025); usado pelo baseline
);

create table if not exists copa.partidas (
  id          int primary key,                  -- = partida_id do calendario.csv
  fase        text not null default 'grupos',   -- grupos | 16avos | oitavas | quartas | semi | final ...
  rodada      int,                              -- 1..3 na fase de grupos
  grupo       char(1),
  data_jogo   date not null,
  casa        text not null references copa.selecoes(slug),
  fora        text not null references copa.selecoes(slug),
  gols_casa   int,
  gols_fora   int,
  status      text not null default 'agendada' check (status in ('agendada','encerrada','adiada')),
  obs         text
);

create table if not exists copa.palpites (
  id           serial primary key,
  partida_id   int not null references copa.partidas(id),
  modelo       text not null check (modelo in ('claude','codex','baseline')),
  gols_casa    int not null,
  gols_fora    int not null,
  prob_casa    int,
  prob_empate  int,
  prob_fora    int,
  confianca    int,
  justificativa text,
  criado_em    timestamptz not null default now(),
  unique (partida_id, modelo)
);

-- ---------- VIEWS ----------

-- Pontuação 3/2/1/0 por palpite
create or replace view copa.palpites_pontuados
with (security_invoker = true) as
select
  p.id, p.partida_id, p.modelo,
  p.gols_casa  as palpite_casa,
  p.gols_fora  as palpite_fora,
  p.prob_casa, p.prob_empate, p.prob_fora, p.confianca, p.justificativa, p.criado_em,
  m.fase, m.rodada, m.grupo, m.data_jogo, m.casa, m.fora,
  m.gols_casa as real_casa,
  m.gols_fora as real_fora,
  case
    when m.status <> 'encerrada' then null
    when p.gols_casa = m.gols_casa and p.gols_fora = m.gols_fora then 3
    when sign(p.gols_casa - p.gols_fora) = sign(m.gols_casa - m.gols_fora)
         and (p.gols_casa - p.gols_fora) = (m.gols_casa - m.gols_fora) then 2
    when sign(p.gols_casa - p.gols_fora) = sign(m.gols_casa - m.gols_fora) then 1
    else 0
  end as pontos
from copa.palpites p
join copa.partidas m on m.id = p.partida_id;

-- Resultados unificados: o real + o "mundo paralelo" de cada modelo
create or replace view copa.resultados_unificados
with (security_invoker = true) as
select 'real'::text as fonte, m.id, m.grupo, m.rodada, m.casa, m.fora, m.gols_casa, m.gols_fora
from copa.partidas m
where m.status = 'encerrada' and m.fase = 'grupos'
union all
select p.modelo as fonte, m.id, m.grupo, m.rodada, m.casa, m.fora, p.gols_casa, p.gols_fora
from copa.palpites p
join copa.partidas m on m.id = p.partida_id
where m.fase = 'grupos';

-- Classificação por grupo, por fonte (real | claude | codex | baseline)
create or replace view copa.classificacao
with (security_invoker = true) as
with linhas as (
  select fonte, grupo, casa as selecao, gols_casa as gp, gols_fora as gc from copa.resultados_unificados
  union all
  select fonte, grupo, fora, gols_fora, gols_casa from copa.resultados_unificados
)
select
  fonte, grupo, selecao,
  count(*)                                            as jogos,
  count(*) filter (where gp > gc)                     as vitorias,
  count(*) filter (where gp = gc)                     as empates,
  count(*) filter (where gp < gc)                     as derrotas,
  coalesce(sum(case when gp > gc then 3 when gp = gc then 1 else 0 end),0) as pontos,
  coalesce(sum(gp),0)                                 as gols_pro,
  coalesce(sum(gc),0)                                 as gols_contra,
  coalesce(sum(gp) - sum(gc),0)                       as saldo
from linhas
group by fonte, grupo, selecao;

-- Placar geral do experimento (por modelo e rodada)
create or replace view copa.placar_geral
with (security_invoker = true) as
select
  modelo,
  fase,
  rodada,
  count(*) filter (where pontos is not null)               as jogos_pontuados,
  coalesce(sum(pontos),0)                                  as pontos,
  count(*) filter (where pontos = 3)                       as placares_exatos,
  count(*) filter (where pontos >= 1)                      as acertos_resultado,
  round(avg(confianca) filter (where pontos is not null))  as confianca_media
from copa.palpites_pontuados
group by modelo, fase, rodada;

-- Zebras (acertou desconfiado) & Micos (errou confiante)
create or replace view copa.zebras_micos
with (security_invoker = true) as
select 'mico'::text as tipo, * from copa.palpites_pontuados where pontos = 0 and confianca >= 70
union all
select 'zebra'::text, * from copa.palpites_pontuados where pontos >= 1 and confianca <= 40;

-- ---------- SEGURANÇA (RLS) ----------
-- Padrão: deny-all. Leitura pública liberada por policy nomeada (dashboard
-- usa publishable key). Escrita: nenhuma policy => só service_role (bypassa RLS).

alter table copa.selecoes enable row level security;
alter table copa.partidas enable row level security;
alter table copa.palpites enable row level security;

drop policy if exists "leitura publica selecoes" on copa.selecoes;
create policy "leitura publica selecoes" on copa.selecoes for select to anon, authenticated using (true);

drop policy if exists "leitura publica partidas" on copa.partidas;
create policy "leitura publica partidas" on copa.partidas for select to anon, authenticated using (true);

drop policy if exists "leitura publica palpites" on copa.palpites;
create policy "leitura publica palpites" on copa.palpites for select to anon, authenticated using (true);

-- Grants p/ PostgREST enxergar o schema (lembrar de EXPOR `copa` em Settings → API)
grant usage on schema copa to anon, authenticated, service_role;
grant select on all tables in schema copa to anon, authenticated;
grant all on all tables in schema copa to service_role;
grant usage, select on all sequences in schema copa to service_role;
alter default privileges in schema copa grant select on tables to anon, authenticated;
alter default privileges in schema copa grant all on tables to service_role;
