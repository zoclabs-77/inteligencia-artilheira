# Design editorial — Vídeo de fechamento da Rodada 1

## Objetivo

Criar um vídeo de 3 a 4 minutos que feche a primeira rodada do Inteligência Artilheira, mostre o desempenho de Claude Code e Codex, explique o aprendizado do experimento e apresente o novo formato diário da Rodada 2.

O vídeo deve equilibrar informação e entretenimento: números claros, comentários leves sobre erros e acertos e transparência sobre as mudanças feitas no método.

## Entregáveis

1. Uma documentação de apoio com os resultados, destaques, divergências e mudanças metodológicas.
2. Um roteiro completo de gravação, com falas, tempos aproximados e sugestões de tela.

Os dois arquivos ficarão em `roteiros/`.

## Estrutura narrativa

### 1. Gancho

Abrir pelo contraste: o Codex venceu a primeira rodada, mas as duas IAs descobriram que o maior adversário não era uma seleção — era o empate.

### 2. Placar da Rodada 1

Apresentar:

- Codex: 20 pontos, 3 placares exatos e 12 acertos de resultado.
- Claude Code: 17 pontos, 1 placar exato e 12 acertos de resultado.
- Baseline: 16 pontos, 1 placar exato e 13 acertos de resultado.

Explicar rapidamente a pontuação: 3 pontos para placar exato, 2 para resultado e saldo, 1 para apenas o resultado e 0 para erro.

### 3. Principais destaques

- Codex cravou México 2 x 0 África do Sul, Coreia do Sul 2 x 1 Tchéquia e Haiti 0 x 1 Escócia.
- Claude cravou Coreia do Sul 2 x 1 Tchéquia.
- A maior zebra foi Espanha 0 x 0 Cabo Verde. Os dois previram 3 x 0 para a Espanha; o Codex atribuiu 81% de confiança.
- Nove dos 24 jogos terminaram empatados, uma taxa de 37,5%.
- As IAs acertaram o resultado de 12 jogos cada, mas o Codex ganhou vantagem pelos placares exatos e pelos pontos de saldo.

### 4. Divergências da Rodada 1

Tratar o confronto direto como empate:

- Inglaterra x Croácia: Claude previu Inglaterra 2 x 1; Codex previu 1 x 1. O resultado foi Inglaterra 4 x 2. Vantagem do Claude.
- Gana x Panamá: Claude previu 1 x 1; Codex previu Gana 2 x 1. O resultado foi Gana 1 x 0. Vantagem do Codex.

No terceiro jogo em que os placares foram diferentes, Uzbequistão x Colômbia, os dois apontaram vitória colombiana. Portanto, não foi divergência de resultado.

### 5. Aprendizado e mudanças para a Rodada 2

Explicar duas mudanças principais:

1. Os palpites passam a ser feitos jogo a jogo por dia, e não para a rodada inteira. Assim, os modelos recebem resultados anteriores e notícias mais recentes.
2. O prompt passou a exigir triangulação entre contexto das pastas, ranking e histórico; confiança mais honesta; atenção real ao empate; e aprendizado com o padrão da competição.

Ressaltar o controle do experimento:

- O mesmo prompt continua sendo usado nos dois modelos.
- As fontes continuam limitadas às pastas do projeto.
- Não foi adicionado um simulador estatístico ou motor de apostas.
- Os palpites continuam registrados antes dos jogos.

### 6. Palpites de 18 de junho de 2026

Apresentar corretamente o grau de consenso:

- Tchéquia x África do Sul: ambos preveem vitória da Tchéquia por 1 x 0.
- Suíça x Bósnia: ambos preveem vitória da Suíça, mas Claude indica 1 x 0 e Codex 2 x 0.
- Canadá x Catar: ambos preveem Canadá 2 x 1.
- México x Coreia do Sul: primeira divergência da Rodada 2. Claude prevê 1 x 1; Codex prevê México 2 x 1.

Resumo editorial: dois placares idênticos, um consenso de vencedor com placares diferentes e uma divergência de resultado.

### 7. Encerramento

Convidar o público a escolher entre empate e vitória mexicana em México x Coreia do Sul. Informar que os resultados serão comparados depois dos jogos e que no dia seguinte haverá novos palpites.

## Linguagem e ritmo

- Tom próximo, transparente e levemente bem-humorado.
- Evitar jargão técnico sem explicação.
- Tratar os erros como parte do experimento, não como fracasso.
- Usar frases curtas e cortes frequentes.
- Mostrar na tela o dashboard, os cards dos jogos, os CSVs ou o prompt nos momentos correspondentes.

## Critérios de precisão

- Não dizer que os palpites de 18 de junho foram todos iguais.
- Não dizer que houve um vencedor nas divergências da Rodada 1: o confronto terminou 1 a 1.
- Distinguir placar exato, acerto do resultado e pontuação total.
- Usar “Claude Code” como nome completo na primeira menção; depois, “Claude” pode ser usado.
- Referir-se ao Codex e ao Claude como modelos ou IAs, sem atribuir conhecimento externo às pastas do experimento.
