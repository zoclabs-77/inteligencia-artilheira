-- ============================================================
-- INTELIGÊNCIA ARTILHEIRA — Oitavas de final (Round of 16)
-- 3ª fase / 2º round do mata-mata: 8 jogos (ids 89–96).
-- Chaveamento oficial da Copa 2026 (Annex C) com os vencedores
-- reais dos 16 avos (jogos 73–88, fase encerrada). Empates dos
-- 16 avos resolvidos nos pênaltis: 74→Paraguai, 75→Marrocos,
-- 88→Egito. Datas/sedes oficiais FIFA (04–07/07). Idempotente.
-- ============================================================

insert into copa.partidas (id, fase, rodada, grupo, data_jogo, casa, fora, status, obs) values
  (89, 'oitavas', null, null, '2026-07-04', 'paraguai',  'franca',     'agendada', 'oitavas (V74 x V77)'),
  (90, 'oitavas', null, null, '2026-07-04', 'canada',    'marrocos',   'agendada', 'oitavas (V73 x V75)'),
  (91, 'oitavas', null, null, '2026-07-05', 'brasil',    'noruega',    'agendada', 'oitavas (V76 x V78) — East Rutherford/NY'),
  (92, 'oitavas', null, null, '2026-07-05', 'mexico',    'inglaterra', 'agendada', 'oitavas (V79 x V80) — Cidade do México (Azteca)'),
  (93, 'oitavas', null, null, '2026-07-06', 'portugal',  'espanha',    'agendada', 'oitavas (V83 x V84) — Arlington/TX'),
  (94, 'oitavas', null, null, '2026-07-06', 'eua',       'belgica',    'agendada', 'oitavas (V81 x V82) — Seattle'),
  (95, 'oitavas', null, null, '2026-07-07', 'argentina', 'egito',      'agendada', 'oitavas (V86 x V88) — Atlanta'),
  (96, 'oitavas', null, null, '2026-07-07', 'suica',     'colombia',   'agendada', 'oitavas (V85 x V87) — Vancouver')
on conflict (id) do update set
  fase = excluded.fase,
  data_jogo = excluded.data_jogo,
  casa = excluded.casa,
  fora = excluded.fora,
  obs = excluded.obs;
