# 🔧 Infra — Inteligência Artilheira

## Banco (Supabase — projeto `epiudtrblgeljjmogaho`, schema `copa`)

| Arquivo | O quê |
|---|---|
| `migration_copa.sql` | Schema, tabelas, views (pontuação 3/2/1/0, classificações, placar, zebras), RLS |
| `migration_views_publicas.sql` | Views espelho em `public` (API REST pública sem config manual) |
| `seed_copa.sql` | 48 seleções + 72 partidas da fase de grupos |
| `aplicar_sql.mjs` | Aplica um arquivo .sql no banco: `node aplicar_sql.mjs <arquivo.sql>` |
| `query.mjs` | Roda SQL avulso: `node query.mjs "select * from copa.placar_geral"` |
| `calendario.csv` | Fonte da verdade dos jogos (ids usados pelo PROMPT_MASTER) |

Credenciais: `ZocLabs/env.Supabase.txt` (NUNCA commitar — já está no .gitignore).

## 📥 Como ingerir os palpites de uma rodada (após o commit!)

Os CSVs ficam em `rodadas/rodada_XX/claude.csv` e `codex.csv`. Para ingerir, peça ao Claude Code:

> "Ingere os palpites da rodada X no Supabase"

Ou manualmente, gere os INSERTs a partir do CSV:

```sql
insert into copa.palpites (partida_id, modelo, gols_casa, gols_fora, prob_casa, prob_empate, prob_fora, confianca, justificativa)
values (6, 'claude', 2, 1, 55, 25, 20, 62, '...');
-- uma linha por jogo, modelo = claude | codex
```

## ⚪ Baseline "Palpiteiro Cego"

Após ingerir os palpites das IAs, rode o baseline da rodada (favorito do ranking FIFA vence por 1x0; se rankings empatarem em ±3 posições, 1x1):

```sql
insert into copa.palpites (partida_id, modelo, gols_casa, gols_fora, prob_casa, prob_empate, prob_fora, confianca, justificativa)
select p.id, 'baseline',
  case when sc.ranking_fifa <= sf.ranking_fifa then 1 else 0 end,
  case when sc.ranking_fifa <= sf.ranking_fifa then 0 else 1 end,
  case when sc.ranking_fifa <= sf.ranking_fifa then 100 else 0 end, 0,
  case when sc.ranking_fifa <= sf.ranking_fifa then 0 else 100 end,
  100, 'Sempre o favorito do ranking, 1x0.'
from copa.partidas p
join copa.selecoes sc on sc.slug = p.casa
join copa.selecoes sf on sf.slug = p.fora
where p.rodada = 1 and p.fase = 'grupos'   -- ajustar a rodada
on conflict (partida_id, modelo) do nothing;
```

## 🌐 Dashboard

- Código em `dashboard/` (Vite + React). Dev: `npm run dev` · Build: `npm run build`.
- Lê a API pública (`/rest/v1/copa_*`) com a publishable key — segura por design (RLS = só leitura).
- Deploy: Vercel (importar repo GitHub, framework Vite, sem env vars obrigatórias).

## 🤖 Routines ativas (Scheduled na sidebar)

- `copa-resultados` (7h05) — placares reais → banco + CSVs + RESUMO.md
- `copa-contexto` (7h30) — notícias dos times que jogam em 72h → NOTICIAS.md

## 🎙️ Fluxo da rodada (lembrete)

1. Sessão LIMPA no Claude Code (nesta pasta) → colar `PROMPT_MASTER.md` → "resultados da rodada X" (GRAVANDO a tela)
2. Mesmo no Codex
3. Conferir CSVs em `rodadas/rodada_XX/` → `git commit` (a prova!)
4. Ingerir palpites + baseline no banco (acima)
5. Short A no ar → jogos → routine pontua → Short B + dashboard
