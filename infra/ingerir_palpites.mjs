// Ingere os palpites no Supabase (claude.csv + codex.csv) + baseline.
// Uso: node ingerir_palpites.mjs <rodada_XX> [AAAA-MM-DD]
//   - com data (cadência por dia, rodada 2+): lê rodadas/<rodada_XX>/<AAAA-MM-DD>/ e gera baseline só do dia
//   - sem data (compat. rodada 1): lê rodadas/<rodada_XX>/ e gera baseline da rodada toda
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const dir = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(dir, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const PASS = encodeURIComponent(env.SUPABASE_DB_PASSWORD);

const rodada = process.argv[2];
const dia = process.argv[3]; // opcional: AAAA-MM-DD (cadência por dia, a partir da rodada 2)
if (!rodada) { console.error('uso: node ingerir_palpites.mjs <rodada_XX> [AAAA-MM-DD]'); process.exit(1); }
const pasta = dia ? join(dir, '..', 'rodadas', rodada, dia) : join(dir, '..', 'rodadas', rodada);

// parser CSV simples com suporte a campo entre aspas
function parseCsv(texto) {
  const linhas = texto.trim().split(/\r?\n/);
  const cab = linhas[0].split(',');
  return linhas.slice(1).map((l) => {
    const campos = [];
    let cur = '', dentro = false;
    for (const ch of l) {
      if (ch === '"') dentro = !dentro;
      else if (ch === ',' && !dentro) { campos.push(cur); cur = ''; }
      else cur += ch;
    }
    campos.push(cur);
    return Object.fromEntries(cab.map((c, i) => [c.trim(), (campos[i] ?? '').trim()]));
  });
}

const c = new pg.Client({
  connectionString: `postgresql://postgres:${PASS}@db.epiudtrblgeljjmogaho.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000,
});
await c.connect();

let total = 0;
for (const modelo of ['claude', 'codex']) {
  const arq = join(pasta, `${modelo}.csv`);
  if (!existsSync(arq)) { console.log(`(sem ${modelo}.csv — pulando)`); continue; }
  for (const r of parseCsv(readFileSync(arq, 'utf8'))) {
    await c.query(
      `insert into copa.palpites (partida_id, modelo, gols_casa, gols_fora, prob_casa, prob_empate, prob_fora, confianca, justificativa)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       on conflict (partida_id, modelo) do nothing`,
      [+r.partida_id, modelo, +r.gols_casa, +r.gols_fora, +r.prob_casa, +r.prob_empate, +r.prob_fora, +r.confianca, r.justificativa]
    );
    total++;
  }
  console.log(`✅ ${modelo}: ingerido`);
}

// baseline "Palpiteiro Cego": favorito do ranking FIFA vence 1x0
// com data: gera só os jogos do dia; sem data: rodada inteira (compat. rodada 1)
const numRodada = parseInt(rodada.replace(/\D/g, ''), 10);
const filtroBaseline = dia ? 'p.data_jogo = $1::date' : "p.rodada = $1 and p.fase = 'grupos'";
const b = await c.query(
  `insert into copa.palpites (partida_id, modelo, gols_casa, gols_fora, prob_casa, prob_empate, prob_fora, confianca, justificativa)
   select p.id, 'baseline',
     case when sc.ranking_fifa <= sf.ranking_fifa then 1 else 0 end,
     case when sc.ranking_fifa <= sf.ranking_fifa then 0 else 1 end,
     case when sc.ranking_fifa <= sf.ranking_fifa then 100 else 0 end, 0,
     case when sc.ranking_fifa <= sf.ranking_fifa then 0 else 100 end,
     100, 'Sempre o favorito do ranking FIFA, 1x0.'
   from copa.partidas p
   join copa.selecoes sc on sc.slug = p.casa
   join copa.selecoes sf on sf.slug = p.fora
   where (${filtroBaseline})
     and exists (select 1 from copa.palpites pp where pp.partida_id = p.id and pp.modelo in ('claude','codex'))
   on conflict (partida_id, modelo) do nothing`,
  [dia ? dia : numRodada]
);
console.log(`✅ baseline: ${b.rowCount} palpites gerados`);

const conf = await c.query(`select modelo, count(*) n from copa.palpites group by modelo order by modelo`);
console.log('No banco:', conf.rows.map((r) => `${r.modelo}=${r.n}`).join(' · '));
await c.end();
