# Estratégia Final — Meu Modo

**Documento de estratégia de produto** · 26/07/2026 · Mia (PM) + Lucas Rolim (Founder)

Este documento é a camada de decisão sobre o PRD. O PRD diz *o que* construir; este documento diz *em que ordem*, *quais entidades modelar* e *onde estão os riscos de produto*.

---

## 1. Entidades de domínio

O PRD modela Flashcard, Material e Aluno. Faltam duas entidades que definem o comportamento do produto.

### 1.1 Prova

É o motivo pelo qual o aluno abriu o app. A unidade de valor e a unidade de paywall.

```
Prova {
  id
  aluno_id
  titulo               // "Prova de Cinemática" ou livre ("Prova de Quinta")
  materia              // inferida ou declarada: matemática, física, etc.
  data                 // ISO date, opcional
  status               // ativa | concluída | arquivada
  nota_autoavaliacao   // 1-5, preenchido pelo aluno ao concluir
  materiais[]           // referências aos uploads associados
  conceitos[]           // nós do grafo cobertos
  criada_em
  concluida_em
}
```

Regras:
- **Criação**: ao fazer upload, o aluno associa o material a uma prova (nova ou existente). Se não houver prova ativa, uma é criada automaticamente.
- **Free tier**: 1 prova ativa. Ao tentar criar uma segunda prova, paywall.
- **Prova concluída**: cards continuam no ciclo espaçado. A vaga de prova ativa NÃO é liberada no free tier (evita loophole).
- **Múltiplas provas (pago)**: provas com data mais próxima têm prioridade na fila de estudo.
- **Feedback pós-prova**: ao marcar como concluída, o app pergunta "como foi?" (1-5). Esse dado alimenta a narrativa de evolução pessoal.

### 1.2 Tema

Uma prova cobre um ou mais temas. Tema é o recorte de conteúdo dentro de uma matéria: "Cinemática", "Função Quadrática", "Revolução Francesa". Diferente de Prova (que tem data e urgência), Tema é o agrupador conceitual.

```
Tema {
  id
  nome                 // "Cinemática"
  materia              // física
  conceitos[]          // nós do grafo
  provas[]             // provas que cobrem este tema
}
```

Regras:
- **Inferido na ingestão**: o pipeline extrai temas do material processado.
- **Acumulativo**: temas se repetem entre provas. "Cinemática" aparece na prova do 2º bimestre e na recuperação. O histórico do aluno no tema é mantido entre provas.
- **Barra de domínio**: o progresso visível é por tema ("você dominou 7 de 12 conceitos de Cinemática"), não por prova.
- **Navegação**: o aluno pode filtrar a fila por tema ("quero focar em Cinemática hoje").

---

## 2. Task list para AI Agents (MVP Core)

Ordem de implementação. Sem estimativas de tempo — AI agents executam na sequência.

### Bloco A — Fundação (implementar primeiro)

**A1. Projeto base**
- Scaffold do app mobile (React Native + Expo)
- Configuração de roteamento, tema escuro padrão, fonte
- Integração com Liteparse para OCR

**A2. Modelagem de dados**
- Schema Postgres: Prova, Tema, Material, Flashcard, Aluno
- Migrations
- pgvector para embeddings

**A3. Upload de materiais**
- Câmera integrada (foto de caderno/lista)
- Upload de PDF/slides
- Contador visível de materiais (0/3)
- Associação a uma Prova (nova ou existente)
- Guideline na tela: "Você pode enviar até 3 materiais"

**A4. Pipeline de OCR + extração**
- Liteparse para extração de texto de foto e PDF
- Exibição do resultado para o aluno com opção de editar
- Extração de conceitos e temas do texto

**A5. Geração de cards**
- LLM (modelo forte) gera cards a partir do texto extraído
- Schema: pergunta, resposta, explicação, fonte, tipo, conceitos
- Validação automática: respondível pela fonte? um conceito por card?
- Tempo alvo: < 3 minutos do upload até cards prontos

### Bloco B — Core Loop (implementar depois de A)

**B1. Sessão de estudo**
- Interface TikTok-like: swipe vertical entre cards, tela cheia
- Exibição: pergunta → aluno responde (digitar) → feedback (certo/errado) → explicação com fonte
- Botão de dica (gerada por LLM barato)
- FSRS básico (parâmetros default do Anki)
- Ao final da sessão: tela de resumo (cards respondidos, conceitos praticados)

**B2. Motor de seleção de cards**
- Fila priorizada por: urgência da prova → recuperabilidade FSRS → intercalação de temas
- Cap de carga diária: 15-20 cards por sessão default
- Modo "foco em tema específico"

**B3. Prova — gestão**
- Criar prova (com ou sem data)
- Associar materiais a prova
- Marcar prova como concluída
- Tela de feedback pós-prova (1-5 estrelas)
- Barra de progresso: conceitos dominados / total da prova

### Bloco C — Conversão (implementar depois de B)

**C1. Paywall**
- Tela de upgrade ao tentar criar segunda prova
- Mostra prova de valor: "Você estudou X conceitos em Y sessões"
- Opção de fechar e continuar revisando cards existentes

**C2. Link de pagamento compartilhável**
- Gerar link Pix/cartão para enviar ao pai via WhatsApp
- Página que o pai abre: progresso do filho + preço + checkout
- Sem necessidade de app ou cadastro do pai

**C3. Assinatura paga**
- Desbloqueio de múltiplas provas
- Acesso a features premium (chat ancorado, evolução avançada, etc. — fases seguintes)

### Bloco D — Métricas (paralelo a B e C)

**D1. Eventos de produto**
- upload_iniciado, upload_concluido, extracao_concluida, cards_gerados
- sessao_iniciada, sessao_concluida, card_respondido, card_sinalizado_ruim
- prova_criada, prova_concluida, prova_avaliada
- paywall_exibido, link_pagamento_gerado, pagamento_concluido

**D2. Dashboard interno**
- Funil: upload → cards gerados → primeira sessão → sessão 3 → paywall → pagamento
- Qualidade: % cards sinalizados como ruins, taxa de erro factual
- Retenção: D1, D7, D14

### Fora do MVP Core (fases seguintes)

- Chat ancorado no card
- Evolução de cards (linhagem, mutações)
- Gamificação (além de streak e barra de conceitos)
- Exportação TikTok de sessão
- Relatório para pais
- Áudio de aula
- Perfil de atenção inferido
- Múltiplos formatos de card (além de pergunta/resposta)
- Otimização de trilha sobre o grafo (§6.2b do PRD)

---

## 3. Fluxo de "falha na prova"

O cenário: aluno usa o Meu Modo, faz a prova, vai mal. O que o produto faz?

**Não fazer:**
- "Foi mal? Assine para melhorar!" — isso queima a confiança
- Ignorar o resultado e seguir como se nada tivesse acontecido
- Remover os cards da prova (punição implícita)

**Fazer:**

**Passo 1 — Tela de resultado pós-prova**

Quando o aluno avalia 1-2 estrelas, o tom muda:

> "Provas nem sempre mostram tudo que a gente aprendeu. Você consolidou 8 conceitos em 12 sessões — isso não some. O que caiu na prova que te pegou de surpresa?"

Opções:
- "Caiu coisa que não estudei"
- "As questões eram diferentes do que pratiquei"
- "Deu branco na hora"
- "Outro motivo" (campo livre)

**Passo 2 — Oferecer ação, não cobrança**

Com base na resposta:
- "Caiu coisa que não estudei" → "Tem o material novo dessa parte? Me manda que eu gero cards focados nisso." (abre upload, mesmo no free tier — é um one-time exception para reter o usuário)
- "As questões eram diferentes" → Oferecer cards de aplicação e exemplos-com-erro para aquele tema (se disponíveis) ou revisão guiada dos cards existentes
- "Deu branco" → Sugerir sessão de revisão rápida, sem pressão de acerto

**Passo 3 — Trial do plano pago**

Após a ação de recuperação, oferecer 7 dias grátis do plano pago — não como "agora vai funcionar", mas como "você já tem os cards, quer testar as features extras para a próxima?". O tom é de continuidade, não de correção.

**Princípio:** o aluno que foi mal E percebeu que o produto ajudou (ex: "acertei as questões de cinemática, mas errei as de dinâmica que não deu tempo de estudar") é um potencial pagante mais forte que o aluno que foi bem e atribuiu à sorte. A falha parcial com atribuição clara de valor é melhor para conversão do que o sucesso total sem atribuição.

---

## 4. Aquisição: TikTok como canal primário

Dois canais, mesma plataforma:

### 4.1 TikTok Ads (tráfego pago)

- Anúncios mostrando o produto em uso: tela real de upload → cards gerados → sessão de swipe
- Segmentação: Brasil, 13-17 anos, interesse em estudo/enem/escola
- Criativo-âncora: "Sua prova é amanhã e você não estudou nada" (urgência) ou "Seu slide virou exercício em 2 minutos" (transformação)

### 4.2 Conteúdo orgânico viralizável (exportação do app)

- Toda tela de resumo de sessão gera um frame compartilhável
- Toda sessão completada gera um clipe exportável
- O app é a fábrica de conteúdo — o aluno não "cria" nada, só compartilha o que já aconteceu
- Conteúdo-âncora: "estudei cinemática em 12 minutos" com barra de progresso, streak, conceitos consolidados

### 4.3 Loop de sala de aula (canal secundário)

- Botão "compartilhar material com a turma" gera link
- Colega que clica cai no app com material pré-processado (cache hit)
- Cada colega ganha sua própria cota de "1 prova grátis"
- Efeito de rede: quanto mais alunos da mesma turma, mais rápido o processamento para o próximo

---

## 5. Decisões de produto fechadas

1. **OCR via Liteparse.** O aluno vê o resultado extraído e pode editar antes da geração de cards. Isso resolve o problema de qualidade do OCR com um passo de correção humana rápido.

2. **Prova e Tema são entidades de domínio.** Modeladas acima (§1). Implementar antes de qualquer feature de sessão.

3. **Paywall = segunda prova.** O aluno grátis tem 1 prova. Cards continuam disponíveis após conclusão. Paywall ao tentar criar nova prova.

4. **Falha na prova = one-time exception de upload + trial estendido.** Não cobrar após resultado negativo. Usar o momento como reengajamento.

5. **Interface TikTok-like.** Swipe vertical, tela cheia, micro-interações. Implementar desde o primeiro protótipo — é o diferencial de experiência, não camada de polish.

6. **FSRS com parâmetros default.** Sem personalização por aluno no MVP. A personalização vem depois, com dados.

---

## 6. Riscos de produto (os que importam)

| Risco | Por que importa | O que fazer |
|---|---|---|
| OCR de foto de caderno não extrai texto usável | Sem entrada, sem produto | Pipeline com Liteparse + edição manual do aluno. Se 80%+ das fotos produzem texto aproveitável após edição, segue. |
| Cards gerados não são úteis para a prova | Core value prop falso | Validação automática + feedback do aluno (sinalizar card ruim). Métrica: < 10% de cards sinalizados como ruins. |
| Aluno não sustenta sessões | Sem retenção, sem conversão | Sessões curtas (10 min), fila pronta, zero decisão. Streak com proteção. |
| Aluno usa como máquina de colar | Perda de confiança dos pais | Guardrails no chat (fase futura) e na geração de cards: perguntas de aplicação, não respostas diretas. |
| "1 prova grátis" cria loophole (cria prova fake, nunca paga) | Free tier vira sumidouro | Prova = materiais + data. Sem material processado, sem prova. Limite de 3 materiais por prova. |

---

## 7. O que NÃO está decidido (próximas conversas)

- Preço final da assinatura
- Nome definitivo do produto
- Stack de frontend (React Native + Expo é recomendação)
- Gateway de pagamento (Stripe BR, Mercado Pago, PagSeguro)
- Estratégia de conteúdo para TikTok (pauta do Lucas, não de produto)
