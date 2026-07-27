# 09 — Algoritmo de Seleção e Agendamento de Cards (refinado)

> Documento de design, pronto para implementação. Decide **o que mostrar**
> (seleção da sessão) e **quando cada card volta** (agendamento).
>
> **O algoritmo é proprietário.** O núcleo é a **Equação de Prioridade de
> Estudo (EPE)**, uma equação aditiva própria do Meu Modo, cujos fatores vêm
> do briefing (01_PRD §6, §8.4, §12, §15, RF-10/14/15). O FSRS-6 (Anki,
> via py-fsrs) entra apenas como **componente de temporização de memória** —
> ele alimenta UM fator da equação, não a estrutura dela. Sinais classificados
> por LLM alimentam outros fatores, nunca a decisão. Referência externa:
> github.com/ankitects/anki (scheduler em rslib + fsrs-rs) e
> open-spaced-repetition/py-fsrs.

---

## 1. As duas decisões

| Decisão | Dono | Quando |
|---|---|---|
| QUANDO um card volta (intervalo) | L1 FSRS-6 (componente), sempre | A cada Tentativa registrada |
| O QUE entra na sessão (seleção) | **L2 Equação de Prioridade de Estudo (EPE) — proprietária**, informada por L1 e L3 | Ao abrir a sessão |

A pergunta "mostrar ou não mostrar" é respondida pela **EPE**, que combina
nove fatores normalizados (§4.2). O FSRS contribui com **um** fator
(necessidade de memória, F_mem); o briefing contribui com os demais
(cobertura, erro, domínio, urgência, prontidão, remediação, fonte,
variedade); a LLM só **classifica evidências** (tipo de erro, evidência de
conceito) que alimentam fatores. Nenhum caminho permite à LLM agendar,
ponderar ou selecionar diretamente.

---

## 2. Princípios invioláveis (do briefing)

1. **Pedagogia nunca é decidida pela LLM sozinha.** LLM produz sinais
   (avaliação, tipo de erro); a equação determinística decide (PRD §6.9).
2. **Toda seleção é explicável.** Cada item do plano carrega `reason`
   legível derivada do fator dominante ("volta porque você errou ontem").
3. **Sessão tem fim.** Duração fechada (5–15 min); o plano cabe no tempo.
4. **Domínio antes de pontos.** Nenhuma métrica gamificada entra na
   equação (sem XP, streak, ranking) — e nenhuma antimétrica do PRD §15.4
   (cards/dia, tempo de tela) pode virar fator ou objetivo de calibração.
5. **Remediação antes de espaçamento.** Erro repetido gera apoio antes de
   intervalos maiores (PRD §6.6) — fator próprio, F_rem.
6. **Revisão honesta.** Urgência (prova sexta) muda PRIORIDADE de seleção,
   nunca o estado de memória. FSRS não "comprime" por estética.
7. **Sem revisão adiantada por padrão.** Card não vencido não entra como
   revisão — exceto modo urgência explícito (§6), sempre marcado.

---

## 3. Camada L1 — Modelo de memória (Anki → FSRS-6 via py-fsrs)

### 3.1 Estado por (aluno, card) — "Estado de Aprendizagem do Card"

Persistido em `learning.card_learning_state` como o `Card` serializado do
py-fsrs (`card.to_dict()` → jsonb) + campos de consulta:

```
card_learning_state(
  aluno_id, card_id,                 -- unique(aluno_id, card_id)
  fsrs_card     jsonb,               -- Card serializado (state, step, S, D, due, last_review)
  due_at        timestamptz,         -- desnormalizado p/ query
  state         text,                -- NEW | LEARNING | REVIEW | RELEARNING
  lapses        int, reps int,
  last_rating   text,
  updated_at    timestamptz
)
review_log(
  aluno_id, card_id, rating, reviewed_at,
  scheduled_days, elapsed_days, review_duration_ms, attempt_id
)
```

`review_log` é append-only — é a entrada futura do Optimizer (§3.5) e da
telemetria.

### 3.2 Scheduler (adapter `learning/scheduling/fsrs.py`)

```python
from datetime import timedelta
from fsrs import Scheduler, Card, Rating, ReviewLog

scheduler = Scheduler(
    desired_retention=0.9,                          # padrão Anki; não expor ao aluno
    learning_steps=[timedelta(minutes=1), timedelta(minutes=10)],
    relearning_steps=[timedelta(minutes=10)],
    maximum_interval=180,                           # ano escolar, não 100 anos
    enable_fuzzing=True,                            # evita aglomeração de due dates
)
```

- **Learning steps (1m, 10m):** card errado volta **na mesma sessão** (fim
  da fila) e, se necessário, na próxima — é o que sustenta a copy do S06:
  "1 conceito volta na próxima sessão."
- **Relearning (10m):** lapse de card REVIEW volta para RELEARNING com um
  passo único; depois retorna a REVIEW com intervalo recalculado pelo FSRS.
- **Fuzz ligado:** duas provas criadas no mesmo dia não vencem juntas
  para sempre.
- **maximum_interval=180d:** aluno de escola não precisa de intervalos
  maiores que um semestre+.

### 3.3 Mapeamento Tentativa → Rating (determinístico)

| Tentativa | Ajuda usada | Rating | Observação |
|---|---|---|---|
| CORRECT | nenhuma | **Good** | caminho padrão |
| CORRECT | pista / tutor / voz corrigida | **Hard** | acertou com suporte |
| PARTIAL | qualquer | **Hard** se usou pista, senão **Again** | |
| INCORRECT | qualquer | **Again** | conta lapse se state=REVIEW |
| SKIPPED ("Não sei") | — | **Again** | **não conta lapse**; marca `needs_intro` |

Regras: `SKIPPED` nunca gera lapse (o aluno declarou que não sabe — é
sinal de card introdutório, não de esquecimento). `help_used` vem da
Tentativa (pista aberta, tutor consultado antes de responder, resposta por
voz com correção). **Easy está desabilitado no MVP** — não há botão "fácil"
na UI e auto-detecção de facilidade é ruído; FSRS converge sem ele.

### 3.4 Agendamento

```python
def record_attempt(ctx, card_id, attempt, help_used, duration_ms) -> AttemptOutcome:
    state = repo.get_or_new(ctx.aluno_id, card_id)          # Card() se NEW
    rating = map_rating(attempt.result, help_used)
    card = Card.from_dict(state.fsrs_card) if state.fsrs_card else Card()
    card, review_log = scheduler.review_card(card, rating)
    repo.save(state.aluno_id, card_id, card, review_log, attempt)
    return AttemptOutcome(rating=rating.name, next_due_at=card.due, state=card.state)
```

Property tests obrigatórios (M6): CORRECT ⇒ `due` aumenta; INCORRECT ⇒
`due` ≤ amanhã; mesmo rating repetido ⇒ estabilidade cresce; SKIPPED não
incrementa `lapses`; fuzz mantém due dentro de ±5% do determinístico.

### 3.5 Otimização de parâmetros (pós-MVP)

py-fsrs expõe `Optimizer` sobre `review_log`. Anki exige volume antes de
otimizar; adotamos: **otimização por aluno somente após ≥200 reviews**,
em job assíncrono, com fallback silencioso aos 21 parâmetros default.
Antes disso, defaults FSRS-6. Nunca otimizar globalmente misturando alunos
(privacidade + heterogeneidade).

---

## 4. Camada L2 — Equação de Prioridade de Estudo (EPE, proprietária)

A EPE é uma equação aditiva própria do Meu Modo: cada card candidato recebe
um escore 0–~1.5 composto de **nove fatores normalizados 0–1**, todos
determinísticos e auditáveis. Nenhum fator é gamificado; nenhum fator é
calculado pela LLM. A equação inteira é função pura → testável sem IA.

### 4.1 Entradas

- Prova ativa: data, matéria, Grupos de Cards, cobertura por conceito,
  Relações de Conceitos (pré-requisitos).
- Candidatos: cards publicados e não depreciados da prova (qualquer state)
  + variantes REMEDIAL pendentes. Cards com Sinalização de qualidade aberta
  são **excluídos** (hard filter, RF-09/RF-17).
- Estado L1: `due_cards`, `R(t)`, `state`, `lapses` por card.
- Estado de aprendizagem agregado: `dominio(conceito)` (§7), tentativas
  recentes por conceito, `error_type` recente (L3), flags `needs_intro`.
- Duração alvo (5–15 min) → `n_itens = max(4, floor(duration_min * 60 / 55))`
  (55s/atividade, recalibrado por telemetria — D7).
- Config versionada `epe_weights` (§4.6).

### 4.2 Os nove fatores (0–1 cada)

| Fator | Definição | Fonte dos dados | Origem no briefing |
|---|---|---|---|
| **F_mem** necessidade de memória | LEARNING/RELEARNING vencido ⇒ 1.0. REVIEW vencido ⇒ 0.7 + 0.3·min(dias_atraso/7, 1). REVIEW não vencido ⇒ (1−R(t))·0.4 (só elegível no modo urgência). NEW ⇒ 0 | L1 FSRS | §12.1 "itens vencidos para revisão" |
| **F_cob** lacuna de cobertura | Conceito sem nenhuma tentativa ⇒ 1.0; cobertura parcial do Grupo ⇒ 0.6; coberto ⇒ 0.1 | Grupo de Cards / Tentativas | §12.2 "cobertura da prova mais próxima" |
| **F_err** evidência de erro | Taxa de erro das últimas 5 tentativas do conceito, ponderada por severidade do `error_type` (conceito 1.0 · unidade 0.7 · interpretação 0.6 · cálculo 0.5); +0.2 se `needs_intro` (cap 1.0) | Tentativas + L3 | §12.3 "conceitos com maior erro"; §8.4 |
| **F_dom** domínio invertido | 1 − `dominio(conceito)` (§7) | ConceptMastery | §6.5 domínio antes de pontos |
| **F_urg** urgência da prova | `1 / (1 + max(dias_ate_prova, 0)/2)` ⇒ hoje 1.0, véspera ≈0.67, 7 dias ≈0.22; prova sem data ⇒ 0.3 fixo | Prova.data | §12.2; RF-10 "urgência" |
| **F_dep** prontidão por pré-requisito | Todos pré-requisitos com domínio ≥0.5 ⇒ 1.0; parte ⇒ 0.5; algum <0.3 ⇒ 0.1 (card ainda não está pronto) | Ontologia | §11 grafo simples; ordem pedagógica |
| **F_rem** remediação pendente | Card é variante REMEDIAL de erro ⇒ 1.0; card com última Tentativa INCORRECT ⇒ 0.8; demais ⇒ 0 | L3 + Tentativas | §6.6 remediação antes de espaçamento; §8.4 |
| **F_fonte** confiança da fonte | Trecho-Fonte confirmado sem spans de baixa confiança ⇒ 1.0; com spans editados pelo aluno ⇒ 0.7 | Versão do Material | §6.2 fonte antes de fluência; §10.2 |
| **F_var** variedade (dinâmico) | Calculado durante o preenchimento: conceito ausente das últimas 2 escolhas ⇒ 1.0; presente 1× ⇒ 0.3; 2× ⇒ 0 (bloqueio duro) | Estado do plano em montagem | §12.4 "alternância moderada entre temas" |

### 4.3 A equação

```
EPE(card) = ( w_mem·F_mem + w_cob·F_cob + w_err·F_err + w_dom·F_dom
            + w_rem·F_rem + w_dep·F_dep + w_fonte·F_fonte )
            × (1 + w_urg·F_urg)
            × F_var
```

Pesos v1 (congelados para o MVP; base soma 1.0):

| Peso | Valor | Peso | Valor |
|---|---|---|---|
| w_mem | 0.30 | w_rem | 0.15 |
| w_cob | 0.20 | w_dep | 0.05 |
| w_err | 0.15 | w_fonte | 0.05 |
| w_dom | 0.10 | w_urg | 0.5 normal · **2.0 no modo urgência** |

Propriedades: card de memória vencida sempre pontua alto (F_mem≥0.7 ⇒
EPE_base ≥ 0.21 antes dos demais fatores) sem sufocar remediação e cobertura;
NEW só vence REVIEW vencida quando cobertura+erro+domínio somam mais que
0.30 — traduz exatamente a ordem do briefing §12 sem virar fila por baldes.

### 4.4 Seleção gananciosa + restrições duras

1. Calcula EPE de todos os candidatos; ordena desc.
2. Preenche o plano respeitando, nesta ordem:
   - **Novos ≤ 40%** da sessão;
   - **Nunca 3 cards seguidos do mesmo Conceito** (F_var zera o 3º);
   - **Nunca 2 cards do mesmo Trecho-Fonte** na mesma sessão ("bury siblings");
   - **Tempo:** soma de `est_seconds` ≤ duração alvo; estouro ⇒ corta cauda.
3. Se vencidos > capacidade: entram os de maior EPE e o plano **informa**
   ("ficaram X pra amanhã") — nunca estoura o tempo (PRD §6.4).
4. LEARNING/RELEARNING vencidos têm assento garantido: se o corte de tempo
   os remover, entram no lugar do NEW de menor EPE.

### 4.5 `reason` por item (obrigatório, 100% dos itens)

O `reason` nasce do **fator dominante** (maior contribuição wᵢ·Fᵢ):

| Fator dominante | kind | reason exemplo |
|---|---|---|
| F_mem (REVIEW) | REVIEW | "revisão agendada pra hoje" |
| F_mem (RELEARNING) | RELEARNING | "volta porque você errou na última" |
| F_rem | REMEDIAL | "uma parecida com a que você travou" |
| F_cob | NEW | "Velocidade média ainda sem prática" |
| F_err / F_dom | REVIEW/NEW | "pra reforçar o que mais te pegou" |
| F_urg (modo urgência) | URGENT | "reforço pré-prova" (somente §6) |

O plano persiste `reason` **e o breakdown dos fatores** por item
(auditoria + telemetria + futura calibração).

### 4.6 Versionamento e calibração (sem ML)

- Pesos vivem em `learning.algorithm_config` (`epe_weights`, JSON
  versionado) — canary + rollback como qualquer outra config (05§11).
- Toda mudança de peso exige: simulação de 14 dias no harness (§9.2) +
  cenários dourados + aprovação de produto.
- Calibração (M11): busca em grade sobre telemetria real, objetivo =
  proxy da north star (**retenção em reencontro espaçado**, PRD §15.1).
  **Antimétricas proibidas como objetivo** (cards/dia, tempo de tela,
  streak — PRD §15.4).
- PRD §7.2 veta RL/otimização de trilha no MVP: a EPE permanece linear,
  documentada e explicável.

### 4.7 Contrato

```python
def plan_session(ctx, exam_id, duration_min) -> SessionPlan:
    # items: [{card_id, card_version_id, kind, reason, factors, est_seconds}]
    # garantias: 4 ≤ len ≤ cap; reason presente; ≤40% NEW; F_var ok;
    # breakdown de fatores persistido; função pura (sem IA, sem I/O)
```

Planner é **função pura** sobre candidatos + config → testável sem banco
de IA. Fechamento S06 consome o plano para o resumo ("10 min · 3 conceitos
· 1 volta próxima sessão").

---

## 5. Camada L3 — Sinais via LLM (limitado e substituível)

Executa em `deepseek-v4-flash`, sempre com `output_schema`, sempre com
fallback determinístico (LLM fora do ar ⇒ sessão roda normal).

| Sinal | Quando | Efeito no algoritmo |
|---|---|---|
| **Avaliação de resposta aberta** → AttemptResult + `error_type` (cálculo/conceito/unidade/interpretação) | Cada tentativa aberta que a regra não resolve | Alimenta L1 (via rating) e L3.2 |
| **Evidência de conceito** (`concept_evidence`) | error_type=conceito | Pesa no Domínio do Conceito (§7) e alimenta F_err/F_dom da EPE |
| **Variante de remediação** | Aluno pede "parecida" ou INCORRECT repetido | Vira candidato REMEDIAL da próxima sessão |

**Nunca** pela LLM: `due_at`, rating, tamanho/composição da sessão,
desired_retention, criação de estado. Se o classificador falhar ou
discordar da regra de alta confiança (ex.: match numérico exato), a regra
vence e o caso vai para telemetria (`eval_disagreement`).

---

## 6. Modo urgência (prova amanhã/hoje)

- A EPE muda um único parâmetro: `w_urg` sobe de 0.5 para **2.0**; REVIEW
  **adiantada** (due futuro próximo, F_mem>0) torna-se elegível, marcada
  `kind=URGENT`, `reason="reforço pré-prova"`.
- O registro FSRS é honesto: `review_card` com o rating real da Tentativa —
  o scheduler trata como review normal (não há "cram mode" no estado).
- UI pode sugerir sessão de 15 min. Nunca repetir o mesmo card URGENT duas
  vezes no dia se o rating foi Good.

---

## 7. Domínio do Conceito (agregado, determinístico)

Por (aluno, conceito):

```
dominio(c) = média ponderada de R(t) dos cards ativos de c
             − penalidade_lapses_recentes
             − penalidade_evidencia_conceitual_aberta
```

- `R(t)` = retrievability estimada pelo FSRS de cada card (função de S e
  tempo desde última review — calculada pelo py-fsrs).
- Penalidades: lapses nos últimos 7 dias; evidência LLM de erro conceitual
  ainda não remediada.
- **Não é nota nem % de acerto.** Alimenta as barras do H01 e o
  `peso_conceito` do planner. Sem ranking, sem percentil, sem previsão de
  nota (proibido no briefing).

---

## 8. Rastreabilidade: o que é componente e o que é proprietário

**Componente Anki/FSRS (L1 — temporização de memória apenas):**

| Conceito Anki | Adaptação Meu Modo |
|---|---|
| FSRS-6 (21 parâmetros, S/D/R) | L1 via py-fsrs, defaults até 200 reviews |
| Learning steps 1m/10m | Reapresentação intra-sessão e inter-sessão |
| Lapse + relearning step 10m | RELEARNING; copy "volta na próxima sessão" |
| Desired retention 0.9 | Fixo, não exposto ao aluno |
| Fuzz | Ligado (±5%) |
| Maximum interval | 180 dias (ano escolar) |
| Bury siblings | Máx. 1 card por Trecho-Fonte por sessão |
| Leech (8 lapses) | **Card de atenção**: aparece em H01 + sugere Tutor |
| New cards/day | Novos ≤ 40% da sessão |
| Easy button | Desabilitado no MVP |
| Optimizer (fsrs-rs) | py-fsrs Optimizer, por aluno, pós-MVP |
| Cram/custom study | Modo urgência (§6), honesto no FSRS |

**Proprietário (L2 — não existe no Anki):**

| Elemento | Origem |
|---|---|
| Equação EPE (forma, fatores, pesos) | Meu Modo, do briefing §12 + princípios §6 |
| F_cob (lacuna de cobertura do Grupo de Cards) | §12.2 |
| F_err (erro ponderado por tipo via LLM) | §12.3 + §8.4 |
| F_dom (domínio invertido do conceito) | §6.5 |
| F_urg (rampa de urgência da prova, multiplicativa) | RF-10 |
| F_dep (prontidão por pré-requisito da Ontologia) | §11 |
| F_rem (remediação antes de espaçamento) | §6.6 |
| F_fonte (confiança da fonte confirmada) | §6.2 |
| `reason` derivada do fator dominante + breakdown persistido | §6.9 |
| Calibração por proxy da north star, antimétricas vetadas | §15 |

O Anki responde "quando a memória precisa rever". A EPE responde "o que
esta sessão deve conter para esta prova, este aluno, hoje". São perguntas
diferentes — por isso o algoritmo não é "Anki com regras extras".

---

## 9. Testes (M6/M9)

1. **Property tests FSRS** (§3.4).
2. **Simulação de 14 dias** com aluno sintético (mix de ratings):
   carga/dia ≤ capacidade; retenção simulada ≈ 0.9; zero dias sem plano.
3. **Fatores EPE:** teste unitário por fator (tabela de casos: vencido 7
   dias ⇒ F_mem=1.0; prova amanhã ⇒ F_urg=1.0; pré-requisito fraco ⇒
   F_dep=0.1; …) e monotonicidade documentada de cada um.
4. **Equação:** cenários dourados (aluno A: só vencidos; aluno B: prova
   amanhã + lacuna; aluno C: erro conceitual repetido) com plano esperado
   fixado em snapshot; mudança de peso sem atualizar snapshot ⇒ CI falha.
5. **Planner:** reason em 100% dos itens; ≤40% NEW; sem 3 seguidos do
   mesmo conceito; sem 2 do mesmo trecho; respeito ao tempo; breakdown de
   fatores persistido.
6. **Degradação:** classificador LLM desligado ⇒ sessão completa funciona
   (F_err cai para taxa de erro crua).
7. **Urgência:** prova amanhã ⇒ w_urg=2.0, URGENT marcado, due dates
   inalterados.

---

## 10. Decisões e aberturas

| # | Decisão | Status |
|---|---|---|
| D1 | FSRS-6 via py-fsrs; nunca reimplementar fórmula | fechado |
| D2 | Easy desabilitado no MVP | fechado |
| D3 | SKIPPED ⇒ Again sem lapse | fechado |
| D4 | desired_retention 0.9 fixo; máx 180d; fuzz on | fechado |
| D5 | Optimizer por aluno após ≥200 reviews (job) | pós-MVP |
| D6 | Leech ⇒ "card de atenção" no H01 + sugestão de Tutor | M9 |
| D7 | 55s/atividade → recalibrar com telemetria real | M11 |
| D8 | LLM nunca agenda, pondera ou seleciona; fallback determinístico sempre | fechado |
| D9 | **EPE proprietária**: 9 fatores, pesos v1 congelados (§4.3), versionados em `algorithm_config` | fechado |
| D10 | Calibração de pesos somente por proxy da north star; antimétricas vetadas (§4.6) | fechado |
| D11 | Valores iniciais dos pesos (0.30/0.20/0.15/0.10/0.15/0.05/0.05, w_urg 0.5→2.0) são hipótese a validar na simulação e no beta | aberto → M6/M11 |

---

*Algoritmo proprietário de seleção (EPE) + componente de agendamento
(FSRS-6) — pronto para implementação no M6 (L1+EPE+L3-avaliação) e
M9 (Domínio, leech). — Meu Modo, jul/2026.*
