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

## 📥 Como ingerir os palpites (após o commit!)

A partir da rodada 2 os CSVs ficam **por dia**, em `rodadas/rodada_XX/AAAA-MM-DD/claude.csv` e `codex.csv`. Para ingerir o dia (já gera o baseline do dia junto):

```powershell
node ingerir_palpites.mjs rodada_02 2026-06-18
```

> Sem a data (`node ingerir_palpites.mjs rodada_01`) ele lê `rodadas/rodada_01/claude.csv|codex.csv` e gera o baseline da rodada toda — é o modo antigo, mantido para a rodada 1.

Ou peça ao Claude Code: *"Ingere os palpites de AAAA-MM-DD no Supabase"*.

## ⚪ Baseline "Palpiteiro Cego"

O `ingerir_palpites.mjs` **já gera o baseline** (favorito do ranking FIFA, 1x0) — do dia quando você passa a data, ou da rodada quando não passa. O SQL abaixo é só o **fallback manual** (para um dia específico, troque o filtro final por `p.data_jogo = '2026-06-18'`):

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

## 🎙️ Fluxo por dia (lembrete)

1. Sessão LIMPA no Claude Code (nesta pasta) → colar `PROMPT_MASTER.md` → "palpites de AAAA-MM-DD" (GRAVANDO a tela)
2. Mesmo no Codex
3. Conferir CSVs em `rodadas/rodada_XX/AAAA-MM-DD/` → `git commit` ANTES do apito (a prova!)
4. Ingerir palpites + baseline do dia: `node ingerir_palpites.mjs rodada_XX AAAA-MM-DD`
5. Short A no ar → jogos → routine pontua → Short B + dashboard
