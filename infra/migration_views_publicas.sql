-- Views espelho no schema public (exposto por padrão no PostgREST).
-- Evita o passo manual de expor o schema `copa` na API.
-- security_invoker: o RLS das tabelas copa.* vale através das views.

create or replace view public.copa_selecoes        with (security_invoker = true) as select * from copa.selecoes;
create or replace view public.copa_partidas        with (security_invoker = true) as select * from copa.partidas;
create or replace view public.copa_palpites        with (security_invoker = true) as select * from copa.palpites;
create or replace view public.copa_palpites_pontuados with (security_invoker = true) as select * from copa.palpites_pontuados;
create or replace view public.copa_classificacao   with (security_invoker = true) as select * from copa.classificacao;
create or replace view public.copa_placar_geral    with (security_invoker = true) as select * from copa.placar_geral;
create or replace view public.copa_zebras_micos    with (security_invoker = true) as select * from copa.zebras_micos;

grant select on public.copa_selecoes, public.copa_partidas, public.copa_palpites,
  public.copa_palpites_pontuados, public.copa_classificacao, public.copa_placar_geral,
  public.copa_zebras_micos to anon, authenticated;
