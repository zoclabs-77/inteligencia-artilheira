# 🎨 PROMPT — Carrossel diário "Inteligência Artilheira" (5 slides)

> Cole o prompt no seu gerador de design/imagem. Troque só o **bloco de DADOS** a cada dia.
> Para puxar os dados do dia, rode:
> - Acumulado: `node infra/query.mjs "select modelo, sum(pontos) pts, sum(placares_exatos) exatos, round(100.0*sum(acertos_resultado)/nullif(sum(jogos_pontuados),0)) assertividade, sum(jogos_pontuados) jogos from copa.placar_geral group by modelo order by pts desc"`
> - Resultado de ontem: `node infra/query.mjs "select partida_id,casa,fora,real_casa||'x'||real_fora real,modelo,palpite_casa||'x'||palpite_fora palpite,pontos from copa.palpites_pontuados where data_jogo='AAAA-MM-DD' order by partida_id,modelo"`
> - Previsões de hoje: `node infra/query.mjs "select partida_id,casa,fora,modelo,gols_casa||'x'||gols_fora from copa.palpites where partida_id in (...) order by partida_id,modelo"`

---

## 🎨 ESTILO GLOBAL (vale para os 5 slides)

Carrossel de Instagram, 5 slides, **1080×1350px (4:5)**, do quadro **"Inteligência Artilheira"** do canal **ZocLabs** — duelo diário entre duas IAs (**Codex** e **Claude Code**) prevendo a Copa do Mundo 2026.

- **Dois temas de slide:**
  - **ESCUROS** (slides 01 e 05): fundo azul-petróleo quase preto (#0B1220). Título em sans **bold pesada MAIÚSCULA** branca, com 1 palavra-chave em **laranja (#F47A1F)**.
  - **CLAROS** (slides 02, 03, 04): fundo **creme** (#F4EFE3), texto azul-marinho (#0E1726), 1 palavra-chave do título em laranja; conteúdo em **cards brancos** com borda fininha e cantos arredondados.
- **Identidade dos competidores:** **Codex = teal/verde** (#16A085) + logo da OpenAI (flor). **Claude Code = laranja** (#F47A1F) + logo "spark" (estrela/sol). Use sempre essas cores pra identificar cada um.
- **Tipografia:** títulos em grotesca pesada condensada (estilo Anton/Archivo Black); rótulos, datas e legendas em **fonte monoespaçada**; placares em número bold grande.
- **Marcações:** ✓ teal = acertou o vencedor · ✓✓ = placar exato (3 pts) · ✗ vermelho = errou.
- **Rodapé fixo (todos):** esquerda logo **"Z. ZocLabs · Tecnologia na Prática"**; centro **"Inteligência Artilheira"**; direita **"0X/05"**.
- Visual clean, premium, alto contraste, pouco texto por slide, bandeiras das seleções nos jogos.

---

## 🟦 SLIDE 01/05 — ESCURO — Capa
- Rótulo (mono, em caixa): **DESAFIO DE PREVISÕES**
- Título: **QUEM PREVÊ MELHOR HOJE?** (HOJE em laranja)
- Subtítulo (mono): Codex × Claude Code
- Centro: logo Codex (teal) — **VS** — logo Claude (laranja), com uma **bola de cristal com troféu** da Copa no meio
- Caixa de placar: **Codex {COD_PTS} pts · líder** | **Claude {CLA_PTS} pts**
- Linha: **Rodada {RODADA} · {HOJE}**
- Rodapé + ícones de CTA: 🔖 Salva esse post · 💬 Comenta sua aposta · 🏆 Amanhã tem o resultado

## 🟨 SLIDE 02/05 — CLARO — O resultado de ontem
- Rótulo (mono): DESAFIO DE PREVISÕES
- Título: **O RESULTADO DE ONTEM** 🏆 (RESULTADO em laranja)
- Subtítulo (mono): Rodada {RODADA} · {ONTEM} · {N} jogos · placar real vs palpite
- 3 colunas: **PLACAR REAL** | **CODEX** (teal) | **CLAUDE** (laranja)
- Um card por jogo (bandeiras + placar real ao centro; palpite de cada IA com ✓/✓✓/✗): {CARDS_ONTEM}
- Legenda: ✓ acertou o vencedor · ✓✓ placar exato (3 pts) · ✗ errou
- Faixa final (caixa laranja): **VENCEDOR DE ONTEM: {VENCEDOR_ONTEM}**

## 🟨 SLIDE 03/05 — CLARO — Quem lidera até agora
- Título: **QUEM LIDERA ATÉ AGORA**
- Subtítulo (mono): Acumulado · {JOGOS} jogos pontuados
- 2 cards grandes lado a lado:
  - **CODEX** (teal) — **{COD_PTS} PTS** · líder · Assertividade {COD_ASSERT}% · Placares exatos {COD_EXATOS}
  - **CLAUDE CODE** (laranja) — **{CLA_PTS} PTS** · Assertividade {CLA_ASSERT}% · Placares exatos {CLA_EXATOS}
- Faixa: ⭐ **{LIDERANCA}**
- Nota (👁): o "Palpiteiro Cego" (chute no favorito) tem **{BASE_PTS} pts** — {BASE_NOTA}.
- Nota (ℹ): Pontos: exato = 3 · vencedor + saldo = 2 · só vencedor = 1 · errou = 0

## 🟨 SLIDE 04/05 — CLARO — As previsões de hoje
- Título: **AS PREVISÕES DE HOJE** (HOJE em laranja)
- Subtítulo (mono): Rodada {RODADA} · {HOJE}
- **Card destaque (topo):** {JOGO_DESTAQUE} — Codex {x-x} | Claude {x-x} — ✓ {NOTA_DESTAQUE}
- Cards menores (1 linha cada, bandeiras + os 2 palpites lado a lado): {CARDS_HOJE}
- Nota (ℹ): {NOTA_DIVERGENCIA}

## 🟦 SLIDE 05/05 — ESCURO — Amanhã a gente confere
- Centro: logo Codex (teal) — **VS** — logo Claude (laranja)
- Título: **AMANHÃ A GENTE CONFERE** (A GENTE CONFERE em laranja)
- Subtítulo: Quem prevê melhor hoje — Codex ou Claude?
- 2 botões: 🔖 **Salva o post** · 💬 **Comenta sua aposta**
- Rodapé: Desafio diário · Copa do Mundo 2026 · 05/05

---

# ✅ DADOS DE HOJE — 22/06 (rodada 2) — pronto pra colar

- {COD_PTS}=35 · {CLA_PTS}=30 · {BASE_PTS}=32 · {JOGOS}=39 · {RODADA}=2 · {HOJE}=22/06 · {ONTEM}=21/06
- {COD_ASSERT}=56 · {CLA_ASSERT}=54 · {COD_EXATOS}=5 · {CLA_EXATOS}=3
- {LIDERANCA}=Codex lidera por 5 pontos
- {BASE_NOTA}=ainda na frente do Claude (!)
- {VENCEDOR_ONTEM}=EMPATE · 3 a 3 pts (Codex e Claude)

**{CARDS_ONTEM}** (21/06, 5 jogos):
1. 🇹🇳 Tunísia **0×4** Japão 🇯🇵 — Codex 0-2 ✓ · Claude 0-2 ✓ (acertaram o vencedor)
2. 🇪🇸 Espanha **4×0** Arábia Saudita 🇸🇦 — Codex 2-0 ✓ · Claude 2-0 ✓
3. 🇧🇪 Bélgica **0×0** Irã 🇮🇷 — Codex 2-1 ✗ · Claude 2-0 ✗ (os dois erraram — deu empate)
4. 🇺🇾 Uruguai **2×2** Cabo Verde 🇨🇻 — Codex 1-0 ✗ · Claude 1-0 ✗ (zebra: estreante segurou o Uruguai)
5. 🇳🇿 Nova Zelândia **1×3** Egito 🇪🇬 — Codex 1-2 ✓ · Claude 1-2 ✓

**{JOGO_DESTAQUE}** = 🇦🇷 Argentina × Áustria 🇦🇹 · Codex 2-1 | Claude 2-1 · {NOTA_DESTAQUE}=Ambos apontam Argentina como vencedora

**{CARDS_HOJE}** (22/06):
- 🇫🇷 França × Iraque 🇮🇶 — Codex 3-0 | Claude 3-0
- 🇳🇴 Noruega × Senegal 🇸🇳 — Codex 2-1 | Claude **1-1**

**{NOTA_DIVERGENCIA}** = A única divergência de hoje é Noruega × Senegal: o Claude crava empate, o Codex aposta na Noruega de Haaland.
