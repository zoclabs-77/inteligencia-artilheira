-- ============================================================
-- INTELIGÊNCIA ARTILHEIRA — Quartas de final (Quarter-finals)
-- 4ª fase do mata-mata: 4 jogos (ids 97–100), chaveamento oficial
-- da Copa 2026 (Annex C, numeração FIFA):
--   M97 = V89 x V90 | M98 = V93 x V94 | M99 = V91 x V92 | M100 = V95 x V96
-- Nesta carga entram SÓ os 2 confrontos já decididos pelos resultados
-- reais das oitavas (jogos 89–92 encerrados):
--   V89=França, V90=Marrocos, V91=Noruega, V92=Inglaterra.
-- M98 (V93 x V94) e M100 (V95 x V96) dependem das oitavas 93–96 (ainda
-- não disputadas) e serão inseridos quando os vencedores forem conhecidos
-- — mesmo critério usado nas oitavas (partidas.casa/fora são NOT NULL e
-- referenciam selecoes.slug, logo não aceitam "a definir").
-- Datas/sedes: estimativa da janela das quartas (09–11/07), a confirmar
-- (sem acesso à fonte oficial nesta sessão). Idempotente.
-- ============================================================

insert into copa.partidas (id, fase, rodada, grupo, data_jogo, casa, fora, status, obs) values
  (97, 'quartas', null, null, '2026-07-09', 'franca',  'marrocos',   'agendada', 'quartas (V89 x V90) — sede/data oficial a confirmar'),
  (99, 'quartas', null, null, '2026-07-10', 'noruega', 'inglaterra', 'agendada', 'quartas (V91 x V92) — sede/data oficial a confirmar')
on conflict (id) do update set
  fase = excluded.fase,
  data_jogo = excluded.data_jogo,
  casa = excluded.casa,
  fora = excluded.fora,
  obs = excluded.obs;
