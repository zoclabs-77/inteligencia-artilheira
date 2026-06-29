-- ============================================================
-- INTELIGÊNCIA ARTILHEIRA — 16 avos de final (Round of 32)
-- 2ª fase / 1º round do mata-mata: 16 jogos (ids 73–88).
-- Chaveamento oficial da Copa 2026 (Annex C) com os classificados
-- reais da base: 1º/2º de cada grupo + os 8 melhores terceiros
-- (3B, 3D, 3E, 3F, 3I, 3J, 3K, 3L). Idempotente.
-- ============================================================

-- Correção: o jogo 73 (já disputado) estava cadastrado como 'oitavas'.
-- A 2ª fase desta Copa (32 times) é '16avos' (oitavas = 3ª fase, 16 times).
update copa.partidas set fase = '16avos' where id = 73;

-- Demais jogos dos 16 avos (74–88) — agendados; placar entra por routine.
insert into copa.partidas (id, fase, rodada, grupo, data_jogo, casa, fora, status, obs) values
  (74, '16avos', null, null, '2026-06-29', 'alemanha',        'paraguai',   'agendada', '16 avos (1E x 3D)'),
  (75, '16avos', null, null, '2026-06-29', 'holanda',         'marrocos',   'agendada', '16 avos (1F x 2C)'),
  (76, '16avos', null, null, '2026-06-29', 'brasil',          'japao',      'agendada', '16 avos (1C x 2F)'),
  (77, '16avos', null, null, '2026-06-30', 'franca',          'suecia',     'agendada', '16 avos (1I x 3F)'),
  (78, '16avos', null, null, '2026-06-30', 'costa-do-marfim', 'noruega',    'agendada', '16 avos (2E x 2I)'),
  (79, '16avos', null, null, '2026-06-30', 'mexico',          'equador',    'agendada', '16 avos (1A x 3E)'),
  (80, '16avos', null, null, '2026-07-01', 'inglaterra',      'rd-congo',   'agendada', '16 avos (1L x 3K)'),
  (81, '16avos', null, null, '2026-07-01', 'eua',             'bosnia',     'agendada', '16 avos (1D x 3B)'),
  (82, '16avos', null, null, '2026-07-01', 'belgica',         'senegal',    'agendada', '16 avos (1G x 3I)'),
  (83, '16avos', null, null, '2026-07-02', 'portugal',        'croacia',    'agendada', '16 avos (2K x 2L)'),
  (84, '16avos', null, null, '2026-07-02', 'espanha',         'austria',    'agendada', '16 avos (1H x 2J)'),
  (85, '16avos', null, null, '2026-07-02', 'suica',           'argelia',    'agendada', '16 avos (1B x 3J)'),
  (86, '16avos', null, null, '2026-07-03', 'argentina',       'cabo-verde', 'agendada', '16 avos (1J x 2H)'),
  (87, '16avos', null, null, '2026-07-03', 'colombia',        'gana',       'agendada', '16 avos (1K x 3L)'),
  (88, '16avos', null, null, '2026-07-03', 'australia',       'egito',      'agendada', '16 avos (2D x 2G)')
on conflict (id) do update set
  fase = excluded.fase,
  data_jogo = excluded.data_jogo,
  casa = excluded.casa,
  fora = excluded.fora,
  obs = excluded.obs;
