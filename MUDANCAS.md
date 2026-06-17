# 🔧 O que mudou na Inteligência Artilheira — v2

### Base do roteiro do vídeo · linguagem simples, pra qualquer um entender

> **Resumo de uma frase:** olhamos os erros da Rodada 1, descobrimos que as IAs são **cegas a empate**, e mudamos duas coisas pra elas acertarem mais — sem trair a regra de ouro do experimento.

---

## 1. O problema que a gente descobriu 🕵️

Depois de 20 jogos da Rodada 1, o placar estava: **Codex 17 · Claude 14**, com o "Palpiteiro Cego" (o chute burro no favorito) colado logo atrás. As IAs mal estavam batendo o chute mais idiota possível. Por quê?

Fomos olhar jogo a jogo:

| Dia | Jogos | Pontos (as 2 IAs juntas) | Empates de verdade |
|---|---|---|---|
| 11/06 | 2 | 10 🟢 | 0 |
| 12/06 | 2 | 2 | 1 |
| 13/06 | 3 | 5 | 2 |
| 14/06 | 5 | 4 | 1 |
| 15/06 | 4 | **0** 🔴 | **4** |
| 16/06 | 3 | 6 🟢 | 0 |
| 17/06 | 1 | 4 🟢 | 0 |

**O vilão tem nome: EMPATE.** Dos 20 jogos, **8 terminaram empatados (40%!)** — e as duas IAs quase **nunca** apostaram em empate. Resultado: tiraram **zero ponto nos 8 empates**.

O dia 15/06 foi o desastre perfeito: **4 jogos, 4 empates**, as duas IAs zeraram tudo. Era fácil olhar e pensar "elas estão piorando com o tempo". **Mentira:** nos dois dias seguintes (16 e 17/06) elas voltaram a acertar bem. O problema nunca foi "notícia velha" — foi **não respeitar o empate**.

---

## 2. Mudança nº 1 — Palpitar **dia a dia** (não a rodada inteira) 📅

**Antes:** a IA chutava os 24 jogos da rodada de uma vez, sem ver nenhum resultado.
**Agora:** ela palpita **só os jogos do próximo dia**.

Por que isso ajuda:
- 🧠 **Ela aprende com o que já aconteceu.** Antes de palpitar, lê os resultados que já saíram. Se a Copa está cheia de empate, ela percebe e se corrige sozinha. Antes, palpitando tudo junto, ela era cega — não via nada acontecer.
- 📰 **Notícia mais fresca:** lesão, escalação e suspensão de última hora entram na conta.

---

## 3. Mudança nº 2 — Um prompt mais esperto 🤖

Um amigo me mandou o prompt do agente de apostas dele, que vinha acertando muito. Peguei as ideias que fazem sentido pro nosso experimento e coloquei nas instruções das IAs. São **4 travas novas**:

1. **🔀 Consenso (não confiar numa fonte só).** Antes de cravar, a IA cruza três coisas: a leitura dela sobre o time, o **ranking da FIFA** e o histórico do confronto. Se os sinais brigam entre si, ela fica em cima do muro — em vez de cravar com cara de certeza.

2. **🎯 Confiança honesta.** A regra mais importante do amigo: *"se não tem dado suficiente, abaixa a confiança"*. Agora a IA não pode mais cravar "favorito ganha" só porque é favorito. Sem prova nas pastas, a confiança cai.

3. **🤝 Respeitar o empate.** A trava que ataca o erro nº 1. A IA agora calcula **quantos empates já rolaram** e trata empate como um resultado possível de verdade — principalmente em jogo parelho ou truncado.

4. **📚 Aprender com os erros.** A IA olha o padrão desta Copa (está empatada? tem goleada? favorito está tomando zebra?) e ajusta os palpites a isso.

> Tudo isso vale **igual pras duas IAs** (Claude e Codex usam o mesmo prompt). É comparação justa.

---

## 4. O que a gente **NÃO** mudou (de propósito) 🚫

O sistema do meu amigo é um **motor de apostas completo** (faz cálculo de probabilidade, simula 20 mil jogos, sugere quanto apostar). A gente **não** copiou isso. Motivo: o nosso experimento é uma pergunta limpa —

> **"Quanto mais contexto a IA recebe, mais ela acerta?"**

Se eu colocasse uma calculadora estatística pra fazer a conta, não seria mais a IA raciocinando — seria a calculadora. Então mantivemos o jogo puro: **a IA lê as pastas e decide sozinha.** As melhorias entraram como **instrução**, não como código que calcula por ela.

---

## 5. Como fica o fluxo novo (passo a passo) 🎬

1. As rotinas automáticas atualizam as notícias e os resultados todo dia de manhã.
2. Abro uma sessão **limpa** (gravando a tela), colo o prompt e peço: **"palpites de AAAA-MM-DD"**.
3. Faço o mesmo no Codex.
4. **Commito os palpites ANTES dos jogos** — o horário do git é a prova de honestidade.
5. Subo os palpites pro banco: `node infra/ingerir_palpites.mjs rodada_XX AAAA-MM-DD`.
6. Publico o Short dos palpites → os jogos acontecem → o placar atualiza sozinho → publico o Short do resultado.

---

## 6. Como vamos saber se funcionou ✅

Simples: comparar a **Rodada 1 (formato antigo)** com a **Rodada 2 em diante (formato novo)**.

- 📈 **Pontos por jogo subiram?**
- 🤝 **A cegueira a empate diminuiu?** (esse é o teste de verdade)
- 🏆 **As IAs abriram distância do Palpiteiro Cego?**

A Rodada 1 fica intacta de propósito: ela é o **"antes"**. A Rodada 2 é o **"depois"**. O vídeo conta exatamente essa virada.

---

**ZocLabs 🧪 — Tecnologia na prática.**
