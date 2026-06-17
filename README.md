# ⚽🤖 Inteligência Artilheira
### O experimento do ZocLabs: Claude Code vs Codex prevendo a Copa do Mundo 2026

> **A pergunta:** quanto mais contexto a gente dá pra uma IA, mais ela acerta?
> **O laboratório:** a Copa do Mundo 2026 (48 seleções, 104 jogos, 11/jun–19/jul).

---

## 🎯 Como funciona

1. **Pastas de contexto** (`selecoes/`): cada seleção tem um `PERFIL.md` (história, elenco, estilo) e um `NOTICIAS.md` alimentado **diariamente por routine** (lesões, escalações, notícias com data e fonte).
2. **Antes de cada rodada**, os dois modelos recebem o **mesmo prompt** (`PROMPT_MASTER.md`) em **sessões limpas** e palpitam todos os jogos da rodada.
3. Os palpites são salvos em `rodadas/rodada_XX/` e **commitados ANTES dos jogos** (o timestamp do git é a prova pública de honestidade).
4. Os palpites vão pro **Supabase** (schema `copa`), os resultados reais entram por routine, e a pontuação calcula sozinha.
5. O **dashboard público** mostra o placar Claude × Codex × Baseline ao vivo.

## ⚖️ Regras do experimento (invioláveis)

| Regra | Por quê |
|---|---|
| **Sessão LIMPA por rodada**, nos dois modelos | Justiça: os dois partem do zero; a "memória" é o conteúdo das pastas — que é a tese do experimento (contexto explícito > memória de chat) |
| **Prompt idêntico** (`PROMPT_MASTER.md`) | Comparação justa |
| **Proibido buscar na web** durante o palpite | A IA só pode usar as pastas — senão o "mais contexto = mais acerto" fica contaminado |
| **Commit antes do apito** | Prova auditável com timestamp |
| Saída **somente CSV** no formato padrão | Sem prosa, sem desculpa, ingestão automática |

## 🏅 Pontuação

| Pontos | Critério |
|---|---|
| **3** | Placar exato |
| **2** | Vencedor/empate + diferença de gols correta |
| **1** | Só o vencedor/empate |
| **0** | Errou o resultado |

**Competidores:** 🟣 Claude Code · 🟢 Codex · ⚪ Baseline "Palpiteiro Cego" (sempre o favorito do ranking FIFA, 1x0 — a régua ingênua que as IAs precisam bater).

## 📁 Estrutura

```
selecoes/grupo_<a-l>/<pais>/PERFIL.md + NOTICIAS.md   ← contexto (routine alimenta)
rodadas/rodada_XX/AAAA-MM-DD/claude.csv · codex.csv   ← palpites por DIA (a partir da rodada 2)
rodadas/rodada_XX/resultados_reais.csv · RESUMO.md    ← resultados + resumo da rodada
roteiros/            ← roteiros dos shorts por rodada
infra/               ← migration + seed do Supabase (schema copa)
dashboard/           ← app React (repo próprio, deploy Vercel)
```

## 🔁 Fluxo operacional por DIA (o manual do Lucas)

> **Novidade da v2:** a partir da rodada 2 palpitamos **um dia de jogos por vez** (não a rodada inteira). Assim as IAs leem os resultados que já saíram e se autocorrigem, com notícias mais frescas. O porquê está em [`MUDANCAS.md`](MUDANCAS.md).

1. As routines já alimentaram `NOTICIAS.md` e o `resultados_reais.csv` ✅ (automático)
2. **Gravando a tela:** abrir sessão **limpa** no Claude Code → colar o `PROMPT_MASTER.md` → pedir: *"palpites de AAAA-MM-DD"* (o dia dos próximos jogos)
3. Repetir no Codex (mesma coisa, mesma ordem)
4. Conferir os CSVs salvos em `rodadas/rodada_XX/AAAA-MM-DD/` → `git commit` ANTES do apito (a prova!)
5. Ingerir os palpites do dia no Supabase: `node infra/ingerir_palpites.mjs rodada_XX AAAA-MM-DD` (detalhes no `infra/README`)
6. Publicar o **Short A** (palpites do dia) 🎬
7. Jogos acontecem → routine pontua sozinha
8. Publicar o **Short B** (resultado) 🎬 + dashboard atualizado no link da bio

## 🗓️ Copa 2026 — referência rápida

- **Fase de grupos:** 11–27/jun (3 rodadas) · **Mata-mata:** 32-avos a partir de 28/jun · **Final:** 19/jul (MetLife, NY)
- **Grupos:** A: México, África do Sul, Coreia do Sul, Tchéquia · B: Canadá, Bósnia, Catar, Suíça · **C: BRASIL, Marrocos, Haiti, Escócia** · D: EUA, Paraguai, Austrália, Turquia · E: Alemanha, Curaçao, Costa do Marfim, Equador · F: Holanda, Japão, Suécia, Tunísia · G: Bélgica, Egito, Irã, Nova Zelândia · H: Espanha, Cabo Verde, Arábia Saudita, Uruguai · I: França, Senegal, Iraque, Noruega · J: Argentina, Argélia, Áustria, Jordânia · K: Portugal, RD Congo, Uzbequistão, Colômbia · L: Inglaterra, Croácia, Gana, Panamá

---

**ZocLabs 🧪 — Tecnologia na prática.**
