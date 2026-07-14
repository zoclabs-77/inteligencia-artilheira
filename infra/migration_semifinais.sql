-- ============================================================
-- INTELIGÊNCIA ARTILHEIRA — Semifinais (Semi-finals)
-- 5ª fase do mata-mata: jogos 101 e 102, com os quatro
-- semifinalistas confirmados nas quartas de final. Datas e sedes
-- oficiais FIFA. Carga idempotente.
-- ============================================================

insert into copa.partidas (id, fase, rodada, grupo, data_jogo, casa, fora, status, obs) values
  (101, 'semi', null, null, '2026-07-14', 'franca',    'espanha',   'agendada', 'semifinal (V97 x V98) — AT&T Stadium, Arlington'),
  (102, 'semi', null, null, '2026-07-15', 'inglaterra', 'argentina', 'agendada', 'semifinal (V99 x V100) — Atlanta Stadium')
on conflict (id) do update set
  fase = excluded.fase,
  data_jogo = excluded.data_jogo,
  casa = excluded.casa,
  fora = excluded.fora,
  status = excluded.status,
  obs = excluded.obs;
