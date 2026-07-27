# 08 — Design dos Agentes, Memória e RAG no Agno

> Status: proposta verificada contra a documentação oficial do Agno
> (Context7 `/agno-agi/docs`, jul/2026).
> Audiência: agentes de IA implementando os milestones M5, M7 e M8 do plano
> `07_PLANO_DE_EXECUCAO.md`.
> Este documento detalha COMO o runtime Agno é usado. O QUE cada milestone
> entrega continua definido no plano 07; o produto, no PRD 01.

---

## 1. Princípios de design (não negociáveis)

1. **O domínio manda; o Agno serve.** Toda persistência pedagógica (Card,
   Tentativa, Estado de Aprendizagem, Domínio do Conceito, Trecho-Fonte) vive
   nos schemas do §5.1 do plano 07. O Agno persiste apenas o que é dele:
   sessões de agente, memórias do tutor, métricas de runs — em tabelas
   próprias nomeadas por nós (`PostgresDb(..._table=...)`).
2. **Determinístico antes de generativo.** Validação de ontologia, grafo,
   publicação de CardVersion, agendamento FSRS e cobrança são Python puro.
   Modelo só onde há linguagem: extrair, autorar, criticar, conversar,
   avaliar resposta aberta.
3. **Menor privilégio por perfil de tools.** Tutor lê; Autor rascunha; o
   ciclo publica. Implementado nativamente com `include_tools`/`exclude_tools`
   (§6).
4. **Nada de memória automática por run.** Memória do Tutor é escrita só em
   checkpoints, com instruções de captura restritivas, e é corrigível pelo
   aluno (§4).
5. **Fonte antes de fluência.** Toda resposta com origem GROUNDED exige ≥1
   citação válida de Trecho-Fonte, verificada por post-hook (§7).
6. **Contexto pedagógico nunca vem do LLM.** `ExecutionContext` (aluno_id,
   prova, escopo, modo) entra por `dependencies`/templates de instrução,
   nunca pelo texto do usuário (§6.3).
7. **Custo roteado.** `deepseek-v4-pro` para geração de cards e raciocínio
   do tutor; `deepseek-v4-flash` para extração de memória, classificadores e
   validadores (§3).

---

## 2. Topologia de agentes

| Componente | Tipo | Modelo | Quando roda |
|---|---|---|---|
| Extrator de conhecimento | Agno `Agent` (step de Workflow) | v4-flash | A08: Versão do Material confirmada → `KnowledgeDelta` |
| Autor de cards | Agno `Agent` (step de Workflow) | v4-pro | A08: gera `CardDraft`s por Conceito |
| Crítico de cards | Agno `Agent` (step de Workflow) | v4-flash | A08: checa ancoragem, atomicidade, tipo |
| Validador de ontologia | função Python (step) | — | A08: tipos/relações permitidas, DAG |
| Publicador | função Python (step) | — | A08: chama Cards API (CardVersion imutável) |
| Tutor do Card | Agno `Agent` | v4-pro | S04: sheet dentro da atividade |
| Chat do Tutor | Agno `Agent` | v4-pro | T00/T01: conversa com escopo |
| Avaliador de resposta aberta | Agno `Agent` (classificador) | v4-flash | S00: `AttemptResult` quando regra não basta |
| Extrator de Memória do Tutor | `MemoryManager` standalone | v4-flash | checkpoints (fim de sessão, concluir prova, conversa relevante) |
| Validadores de guarda-rail | Agno `Agent`s com `output_schema` | v4-flash | pre/post hooks do tutor |

Justificativas:
- **Um agente por papel, não por conversa.** Instâncias são stateless entre
  runs; o estado vive em `session_state`/DB. Isso permite `background=True`
  e retries sem vazar contexto entre alunos.
- **Tutor do Card e Chat do Tutor são o mesmo agente**, configurado por run
  (modo em `session_state` muda tools e instruções — §6.4). Os dois modos do
  CONTEXT.md diferem em peso de contexto e escopo, não em "personalidade".
- **Sem Teams do Agno no MVP.** Os fluxos são sequenciais ou single-agent;
  `Workflow` cobre a geração de cards. Teams ficam como ADR futuro se o
  crítico precisar de debate multi-perspectiva.

---

## 3. Roteamento de modelos

```python
from agno.models.deepseek import DeepSeek

PRO   = DeepSeek(id="deepseek-v4-pro")                    # tutor, autor
FLASH = DeepSeek(id="deepseek-v4-flash", use_thinking=False)  # classificadores, extratores
```

- Tutor e Autor usam `pro`: qualidade de explicação e geração ancorada é o
  produto. Thinking default-on aceito; latência absorvida por SSE/background.
- Flash com `use_thinking=False` para tarefas curtas e estruturadas
  (extração de memória, classificação de tentativa, validadores): ~3× mais
  barato (ver §3.3 do plano 07) e rápido.
- **Structured output:** DeepSeek tem JSON mode, não JSON Schema nativo ⇒
  sempre `output_schema=ModeloPydantic` + `use_json_mode=True` + validação
  Pydantic com 1 retry no nosso wrapper (já fixado no plano 07 §3.3).
- **Sem embeddings no DeepSeek** ⇒ embedder dedicado para a perna vetorial
  do RAG (§5.4), decidido em spike.

---

## 4. Memória do Tutor (o coração deste documento)

### 4.1 O que o domínio exige (CONTEXT.md)

> **Memória do Tutor**: observação longitudinal e corrigível usada para
> personalizar a **forma de ajudar** um aluno.

Implicações duras:
- **Corrigível** ⇒ CRUD explícito, visível e editável pelo aluno/responsável.
- **Forma de ajudar, não pedagogia** ⇒ memória nunca altera agendamento FSRS,
  seleção de cards nem avaliação; só instruções do tutor (ex.: "prefere
  exemplos de futebol", "trava em fração → explicar com pizza antes").
- **Menor de idade** ⇒ captura mínima; nunca nome real, diagnóstico,
  conteúdo de material, segredos (doc 05 §8).

### 4.2 Pattern escolhido: checkpoint-only

**Rejeitados** (verificados na doc do Agno):
- `update_memory_on_run=True` — grava a cada run: custo, latência e
  superfície de erro incompatíveis com tutor para menores.
- `enable_agentic_memory=True` — o próprio agente decide o que gravar via
  tools: controle insuficiente; viola o princípio 4.

**Escolhido:** `MemoryManager` standalone chamado pelo nosso código em 3
checkpoints: fim de sessão de estudo, conclusão de prova, e conversa do
tutor marcada como relevante.

```python
from agno.db.postgres import PostgresDb
from agno.memory.manager import MemoryManager

agno_db = PostgresDb(
    db_url=settings.database_url_psycopg,          # driver postgresql+psycopg
    session_table="agent.tutor_session",
    memory_table="agent.tutor_memory",
    metrics_table="agent.run_metrics",
)

memory_manager = MemoryManager(
    model=FLASH,                                    # extração barata
    db=agno_db,
    memory_capture_instructions="""
Extraia APENAS observações sobre COMO ajudar melhor este aluno:
preferências de explicação, exemplos que funcionam, dificuldades recorrentes
de forma (não de conteúdo pedagógico), ritmo.
NUNCA armazene: nomes, dados pessoais, diagnósticos, conteúdo de materiais,
respostas de prova, segredos. Se nada útil, retorne vazio.
Cada memória deve ser uma frase curta, acionável, em português.
""",
)
```

Escrita no checkpoint (ex.: fim de sessão):

```python
memory_manager.create_user_memories(
    messages=session_messages,          # [Message...] da sessão
    user_id=str(ctx.aluno_id),          # SEMPRE — isolamento por aluno
)
```

> ⚠️ **Tenant isolation:** todo método de memória exige `user_id`. Sem ele,
> o Agno compartilha memórias entre usuários. `user_id = aluno_id` é
> obrigatório em TODAS as chamadas — coberto por teste de contrato.

### 4.3 Correção pelo aluno (CRUD)

BFF expõe (rotas já no plano 07 §5.3, módulo tutor):

| Rota BFF | Implementação Agno |
|---|---|
| `GET /v1/tutor/memory` | `memory_manager.get_user_memories(user_id=aluno_id)` |
| `PATCH /v1/tutor/memory/{id}` | `replace_user_memory(memory_id, UserMemory(memory=novo_texto, topics=[...]), user_id=aluno_id)` |
| `DELETE /v1/tutor/memory/{id}` | `delete_user_memory(user_id=aluno_id, memory_id=id)` |

Sem auto-edição pelo agente. Toda mutação gera evento em `audit.domain_event`.

### 4.4 Leitura: nós injetamos, não o Agno

Como `update_memory_on_run` fica desligado, memórias **não entram
automaticamente** no prompt. No fluxo de Contexto Fundamentado (§5), nosso
serviço de retrieval lê `get_user_memories(user_id)` e inclui as 3–5 mais
relevantes no bloco "perfil de ajuda" do `GroundedContext`, com `memory_id`
para rastreio. Vantagens: orçamento de tokens explícito, citação/trace
uniforme, e a memória nunca altera retrieval pedagógico (princípio 4.1).

### 4.5 Resumos de sessão (continuidade da Conversa do Tutor)

Distinto de Memória do Tutor. Para o Chat do Tutor (T01), habilitar
`enable_session_summaries=True` no agente: o Agno mantém `session.summary`
daquela conversa, dando continuidade entre mensagens espaçadas sem custo de
histórico completo. Leitura via `agent.get_session(session_id).summary`.
Sessão do Agno é por **Conversa do Tutor** (`session_id = conversa_id`), não
por aluno.

---

## 5. RAG / Contexto Fundamentado

### 5.1 Decisão: `knowledge_retriever` custom, não `Knowledge` pronto

O Agno oferece `Knowledge(vector_db=PgVector(..., search_type="hybrid",
reranker=...))` + `Agent(knowledge=..., search_knowledge=True)` e filtros por
metadata. Conveniente, mas inadequado ao nosso retrieval (doc 05 §3):

| Nossa exigência | `Knowledge` pronto |
|---|---|
| BM25 via **pg_textsearch** (`text_config='portuguese'`, `<@>`, WAND) | hybrid usa FTS do pgvector, não pg_textsearch |
| Expansão por **grafo de conceitos** (NetworkX, subgrafo limitado) | não existe |
| Filtro de escopo **SQL primeiro** (aluno/prova/tema/material) | metadata filters pós-busca |
| Citação = **Trecho-Fonte** com página+bbox / timecode | chunk genérico |
| RRF + reranker + orçamento de tokens + trace | opaco |

**Escolhido:** manter o *comportamento* de busca agêntica do Agno
(`search_knowledge=True`, o agente decide quando buscar) injetando nosso
pipeline como função:

```python
agent = Agent(
    ...,
    search_knowledge=True,
    knowledge_retriever=retrieve_grounded_context,  # nosso serviço §5.2
)
```

`retrieve_grounded_context(query, num_documents, filters, **kwargs) ->
list[dict]` chama o módulo `knowledge/retrieval` do plano 07 (M8): filtro
SQL de escopo → BM25 ∥ vetor → expansão por grafo → RRF → rerank → orçamento
de tokens → hits com citação de Trecho-Fonte + trace. O formato `filters`
seguirá o shape de metadata filters do Agno (`{"exam_id": ..., "concept": ...}`)
para manter a interface idiomática.

### 5.2 O que o retriever devolve

Cada item: `{content, source_id, exam_id, concept, page|timecode, bbox,
score, retrieval_trace}` — suficiente para o post-hook de citação (§7.2) e
para a UI "Ver fonte" (S05). O conteúdo bruto do Trecho-Fonte nunca inclui
material fora do escopo autorizado do aluno.

### 5.3 Ordem de fundamentação (Tutor do Card)

Nas `instructions` do tutor, com prioridade explícita (do PRD/doc 05):
card atual → pergunta → tentativa → fonte do card → demais conteúdo
autorizado do aluno (via retriever). O modo CARD já injeta card/tentativa/
fonte via `session_state` (§6.4) — o retriever cobre o "demais".

### 5.4 Embedder (spike)

DeepSeek não tem API de embeddings. Candidatos para a perna vetorial
(decisão no spike S-08 do plano 07):

| Candidato | Notas |
|---|---|
| `OpenAIEmbedder(id="text-embedding-3-small")` | referência na doc Agno; custo baixo; tráfego externo extra |
| Voyage / Gemini embed | qualidade multilíngue PT-BR; avaliar custo |
| Local BGE (`SentenceTransformerEmbedder`) | zero custo marginal; pesa no worker; PT-BR razoável |

Critérios do spike: recall@k no nosso conjunto de avaliação, custo/prova,
latência, e conformidade (não treinar com dados do aluno — doc 05 §8).
Reranker (dentro do nosso pipeline): `CohereReranker("rerank-multilingual-v3.0")`
ou BGE local — mesmo spike.

---

## 6. Ferramentas (tools)

### 6.1 Toolkit único, perfis por inclusão

As 11 tools de `05§5.5` (search_cards, search_materials, retrieve_grounded_context,
get_card, get_source_segment, list_concepts, get_concept_relations,
get_learning_state, draft_card_revision, flag_card, request_similar_card,
record_tutor_note) viram métodos de um `TutorRetrievalToolkit(Toolkit)`.
Perfis nativos do Agno:

```python
TUTOR_TOOLS  = TutorRetrievalToolkit(include_tools=[...somente leitura...])
AUTHOR_TOOLS = TutorRetrievalToolkit(include_tools=[...leitura + draft...])
CYCLE_TOOLS  = TutorRetrievalToolkit(include_tools=[...publish...])  # serviço interno
```

Tutor nunca publica (CONTEXT.md: "Criar card disso" dispara o workflow de
autoria; a publicação passa pelo ciclo de validação — plano 07 M8).

### 6.2 Auditoria de mutação: `tool_hooks`

```python
async def audit_tool_hook(run_context: RunContext, arguments: dict):
    log.audit(tool=run_context.tool_name, args=arguments,
              aluno_id=run_context.dependencies["ctx"].aluno_id)

Agent(..., tool_hooks=[audit_tool_hook])
```

Cobre a métrica "auditoria de mutações por tools" de doc 05 §9.

### 6.3 ExecutionContext via `dependencies`

```python
agent.arun(
    pedido,
    dependencies={"ctx": execution_context},   # construído no BFF
    session_id=str(conversa_id),
    session_state=session_state,
    user_id=str(ctx.aluno_id),
)
```

Tools leem `run_context.dependencies["ctx"]` — aluno, prova, escopo e limites
de custo **nunca** vêm do texto do LLM. Dependências podem ser callables
(carregamento preguiçoso de estado de aprendizagem).

### 6.4 Dois modos, um agente: tools dinâmicas + instruções templadas

```python
def tutor_tools(session_state):
    base = [search_materials, retrieve_grounded_context, get_source_segment]
    if session_state.get("mode") == "CARD":
        return base + [get_card, request_similar_card, flag_card]
    return base + [list_concepts, draft_card_revision]

Agent(
    model=PRO,
    tools=tutor_tools, cache_callables=False,   # reavalia por run
    instructions=[
        "Você é o tutor de estudos do Meu Modo (PT-BR, frases curtas, 'você').",
        "Modo atual: {mode}. Prova: {exam_name}.",
        # modo CARD injeta card/question/attempt/fonte com peso máximo
        "Se modo=CARD, priorize o card {card_id} e a fonte citada.",
        "Respostas com base no material citam a fonte; fora dele, diga que é conhecimento geral.",
    ],
)
```

`{mode}`, `{exam_name}`, `{card_id}` interpolam de `session_state` — o BFF
abre S04 com `session_state={"mode": "CARD", "card_id": ..., ...}` e T01 com
`{"mode": "GENERAL", "scope": ...}`. O estado da atividade (questão,
tentativa) é preservado porque a sessão da conversa é separada da sessão de
estudo — voltar da sheet restaura o card intacto (S04).

### 6.5 Histórico

`add_history_to_context=True, num_history_runs=5` no Chat do Tutor;
Tutor do Card usa `num_history_runs=2` (foco na atividade). Continuidade
longa via session summary (§4.5), não via histórico inflado.

---

## 7. Guarda-rails

### 7.1 Pre-hooks

```python
from agno.guardrails import PromptInjectionGuardrail
from agno.exceptions import InputCheckError, CheckTrigger

pre_hooks=[
    PromptInjectionGuardrail(),          # built-in: injeção no texto do aluno
    material_injection_check,            # custom: injeção vinda de OCR/transcrição
    scope_check,                         # off-topic fora do escopo autorizado
]
```

- **Injeção por material** (doc 05 §8): trechos de material são marcados como
  dados não-confiáveis no GroundedContext; o hook roda um classificador flash
  (`output_schema={is_instruction: bool, reason: str}`) quando o pedido do
  aluno referencia conteúdo que parece conter comandos.
- **Menor de idade:** validador flash com `output_schema` tipo
  `{is_safe: bool, is_on_topic: bool, reason: str}`; falha ⇒ `InputCheckError`
  com mensagem PT-BR acolhedora ("Esse assunto tá fora da sua prova. Bora
  voltar pro MRU?") — nunca página de erro.

### 7.2 Post-hooks

```python
def citation_check(run_output: RunOutput) -> None:
    parsed = run_output.parsed            # TutorResponse (output_schema)
    if parsed.origin == "GROUNDED" and not valid_citations(parsed.citations):
        raise OutputCheckError(
            "GROUNDED sem citação válida",
            check_trigger=CheckTrigger.OUTPUT_NOT_ALLOWED,
        )
```

- `TutorResponse.output_schema`: `{reply: str, origin: GROUNDED|GENERAL,
  citations: [TrechoFonteRef...], micro_question: str|None}`.
- Falha na citação ⇒ regenerar com `GENERAL` ("Além do seu material") em vez
  de bloquear — regra do PRD implementada no handler do erro.
- Segundo post-hook de tom (flash, barato): proíbe ranking, XP, promessas de
  nota e termos banidos do doc 02.

---

## 8. Workflow de geração de cards (A08)

```python
content_generation = Workflow(
    name="content_generation",
    steps=[
        Step(name="extract",  agent=extractor_agent),     # KnowledgeDelta (flash)
        Step(name="validate", executor=validate_ontology), # python puro
        Step(name="author",   agent=author_agent),         # CardDrafts (pro)
        Step(name="critic",   agent=critic_agent),         # rejeita/ajusta (flash)
        Step(name="publish",  executor=publish_cards),     # python → Cards API
    ],
    db=PostgresDb(db_url=..., session_table="agent.workflow_session"),
)
```

- `validate_ontology(step_input)` lê `step_input.previous_step_content`
  (KnowledgeDelta) e devolve `StepOutput(content=..., success=False)` se
  violar tipos/DAG — falha mata o workflow e o job é retryable (plano 07 M5).
- `publish_cards` usa `step_input.additional_data` (ExecutionContext) e
  chama a Cards API com `expected_version` — CardVersion imutável + linhagem.
- Execução: `await content_generation.arun(..., background=True)`; o worker
  faz polling com `aget_run_output(run_id, session_id)` até
  `RunStatus.completed|error`, atualizando os steps reais da tela A08
  (materiais conferidos → temas encontrados → criando exercícios →
  conferindo fontes) e alimentando o polling do front.
- Métricas por run (tokens, duração, modelo) persistidas em
  `agent.run_metrics` e copiadas para `audit` com correlation_id — base do
  custo por prova (doc 05 §9).

---

## 9. Sessões e estado (mapa)

| Sessão Agno | `session_id` | Conteúdo | Persistência |
|---|---|---|---|
| Conversa do Tutor (T01) | `conversa_id` | histórico, resumo (§4.5), escopo | `agent.tutor_session` |
| Tutor do Card (S04) | `tutorsessão_id` por atividade | card/tentativa/fonte em `session_state` | `agent.tutor_session` |
| Workflow de geração | `job_id` (A08) | steps, saídas | `agent.workflow_session` |

A sessão de **estudo** (S00–S06) NÃO é sessão Agno — é domínio
(`learning.study_session`), resumida para o tutor via `dependencies`.

---

## 10. Observabilidade

- `PostgresDb(metrics_table="agent.run_metrics")`: tokens, TTFT, duração,
  modelo por run; `agent.get_session_metrics()` agrega por conversa.
- `debug_mode=True`/`debug_level=2` só em staging (vaza conteúdo em log).
- Todo run recebe `metadata={"correlation_id": ..., "exam_id": ...}` —
  cadeia de correlação de doc 05 §9 mantida de ponta a ponta.
- Dashboards (M11): tokens/run por papel, custo por prova, taxa de rejeição
  do crítico, precisão de citação (post-hook), recall do retrieval.

---

## 11. Configuração por milestone (checklist)

**M5 (geração de cards):** PostgresDb + tabelas `agent.*`; agents extractor/
author/critic com `output_schema` + `use_json_mode` + retry; Workflow §8
com steps reais; métricas → audit; eval suite de geração (rejeição do
crítico como métrica).

**M7 (voz):** tutor recebe transcrição confirmada como input — nenhuma
mudança de arquitetura; comandos falados ("repete", "dica") viram
`ContextualRequest` antes do agente (roteador determinístico no BFF).

**M8 (tutor + RAG):** `knowledge_retriever` custom (§5); Toolkit + perfis
(§6.1) + `tool_hooks` (§6.2); dependencies + tools dinâmicas (§6.3/6.4);
pre/post hooks (§7); MemoryManager checkpoint-only (§4) + rotas de correção;
session summaries (§4.5); "Criar card disso" → workflow de autoria (tutor
não publica).

---

## 12. Decisões e desvios registrados

| # | Decisão | Motivo | Status |
|---|---|---|---|
| D1 | `knowledge_retriever` custom em vez de `Knowledge`+PgVector | BM25 pg_textsearch, grafo, Trecho-Fonte, escopo SQL (§5.1) | fechado |
| D2 | Memória checkpoint-only via `MemoryManager` standalone | controle, custo, correção pelo aluno, menores (§4.2) | fechado |
| D3 | Sem `update_memory_on_run` / `enable_agentic_memory` | idem | fechado |
| D4 | Um agente tutor, dois modos via `session_state` | simplicidade; CONTEXT.md separa por peso de contexto | fechado |
| D5 | Sem AgentOS/Teams no MVP | BFF próprio já existe; fluxos single-agent | fechado |
| D6 | Embedder externo (DeepSeek não tem embeddings) | spike S-08: OpenAI vs Voyage/Gemini vs BGE local | aberto |
| D7 | Reranker no nosso pipeline (Cohere multi ou BGE) | idem | aberto |
| D8 | Flash para extratores/validadores/classificadores | custo ~3× menor, latência; pro para tutor/autor | fechado |
| D9 | Falha de citação ⇒ rebaixar para GENERAL, não bloquear | regra do PRD ("Além do seu material") | fechado |

---

## 13. Referências verificadas (Context7 `/agno-agi/docs`)

`agent/agent.md` (parâmetros, hooks, background, métricas) ·
`memory/*` (MemoryManager, UserMemory, instruções de captura) ·
`knowledge/*` (Knowledge, PgVector, SearchType, rerankers,
knowledge_retriever) · `tools/*` (Toolkit, include/exclude, Function strict,
tool_hooks, RunContext) · `workflows/*` (Step, StepInput/StepOutput,
dependencies, session_state) · `guardrails/*` (PromptInjectionGuardrail,
InputCheckError/OutputCheckError, CheckTrigger) · `db/postgres`
(PostgresDb, tabelas customizadas) · `models/deepseek` (id, use_thinking).
