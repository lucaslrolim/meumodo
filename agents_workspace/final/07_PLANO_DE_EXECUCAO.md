# Meu Modo — Plano de Execução da Implementação

**Status:** plano executável, pronto para decomposição por agentes
**Versão:** 1.0
**Data:** 26/07/2026
**Audiência:** agentes de IA (e humanos) que vão implementar o Meu Modo
**Resultado final:** aplicação funcional conforme os documentos de especificação,
deployada no Railway em produção.

---

## 1. Como usar este documento

Este plano é a ponte entre a arquitetura macro (`05_IMPLEMENTACAO_MACRO_FINAL.md`)
e o trabalho de implementação. Ele **não substitui** os documentos de
especificação: ele os organiza em uma sequência executável, fixa decisões
operacionais pendentes e define, para cada marco, tarefas com resultado
verificável e comandos de verificação.

Regras de trabalho para qualquer agente:

1. Leia primeiro `CONTEXT.md` (vocabulário canônico) e a ordem de precedência
   abaixo. Nunca implemente contra o vocabulário.
2. Pegue a próxima tarefa do marco aberto (seção 7). Uma tarefa = um resultado
   verificável. Não pule tarefas nem marcos sem justificativa registrada.
3. Não reabra tecnologia fixada (seção 3). Divergência exige spike + ADR.
4. Cada tarefa termina com o comando de verificação passando ou evidência
   equivalente anexada ao PR.
5. Todo epic criado a partir deste plano usa o cabeçalho obrigatório da seção
   13 de `05_IMPLEMENTACAO_MACRO_FINAL.md`.
6. O mock navegável `mock/meumodo_mock.html` é a referência visual e de
   microinterações. `04_WIREFRAME_FINAL.md` define fluxos, estados e alcance.
   Em conflito de fluxo, o wireframe vence; em conflito de aparência, o mock
   vence.

## 2. Fontes de verdade e ordem de precedência

1. `agents_workspace/final/01_PRD_FINAL.md` — produto, escopo, métricas.
2. `agents_workspace/final/04_WIREFRAME_FINAL.md` — fluxos, estados, telas.
3. `agents_workspace/final/03_DESIGN_SYSTEM_FINAL.md` — visual, acessibilidade,
   motion, tokens.
4. `agents_workspace/final/05_IMPLEMENTACAO_MACRO_FINAL.md` — arquitetura,
   serviços, critérios técnicos de saída (seção 12 é o checklist do MVP).
5. **Este documento** — sequência de execução e decisões operacionais.
6. `mock/meumodo_mock.html` — referência viva de UX (25 telas navegáveis,
   tokens já aplicados em CSS, copy de referência).
7. `agents_workspace/final/02_POSICIONAMENTO_E_BRAND_PAGE_FINAL.md` — voz e
   copy. Nunca escreva copy nova sem conferir este documento.
8. `agents_workspace/final/08_DESIGN_AGENTES_AGNO.md` — design dos agentes,
   Memória do Tutor e RAG no Agno (obrigatório para M5, M7 e M8).
9. `agents_workspace/final/09_ALGORITMO_SELECAO_AGENDAMENTO.md` — algoritmo
   proprietário de seleção (Equação de Prioridade de Estudo, EPE) +
   agendamento de cards: FSRS-6 como componente de memória, fatores do
   briefing, sinais LLM (obrigatório para M6 e M9).
10. Briefings, pesquisas e rascunhos em `agents_workspace/old/` são histórico;
    não são fontes de verdade sem conferência dos documentos finais.

## 3. Decisões fixadas

### 3.1 Vindas do documento 05 (não reabrir)

| Área | Decisão |
|---|---|
| Arquitetura | SOA por capacidade; módulos Python profundos; mesmo deploy no MVP |
| Backend | Python; contratos Pydantic versionados |
| Agentes | Agno (`Agent`, `Workflow`, `MemoryManager`; storage via `PostgresDb` em `db=`) |
| Modelo | DeepSeek V4 (`deepseek-v4-pro` para geração/tutor; `deepseek-v4-flash` para classificação/validação), thinking por tarefa |
| Banco | PostgreSQL 18, imagem própria pinada por digest com `pg_textsearch` + `pgvector` |
| Busca | BM25 (`pg_textsearch`) + vetor (`pgvector`) + expansão de grafo, fusão RRF |
| Grafo | adjacência no Postgres; NetworkX só em subgrafo delimitado |
| Parsing | LiteParse (pacote Python `liteparse`, OCR Tesseract `por` embutido) atrás de adapter |
| Áudio | ElevenLabs Scribe v2 (batch `scribe_v2`, realtime `scribe_v2_realtime`, TTS quando requerido) atrás de adapter |
| Cliente | PWA mobile-first, instalável, cliente fino |
| Deploy | Railway, monorepo, serviços `web` `api` `worker` `postgres-search` `materials`; tarefas agendadas via `[[crons]]` nativos no `worker` |

### 3.2 Decisões operacionais fixadas por este plano

Defaults executáveis. Mudança exige ADR curto; não exige spike novo.

| Área | Decisão | Motivo |
|---|---|---|
| Linguagem/versão | Python 3.12, gerenciado com `uv` | velocidade e reprodutibilidade |
| Framework HTTP | FastAPI + Pydantic v2 (async) | casa com contratos Pydantic e SOA |
| ORM/migrations | SQLAlchemy 2 (async) + Alembic | padrão, migrações pre-deploy |
| Fila de trabalhos | Postgres como fila (`SELECT … FOR UPDATE SKIP LOCKED`) + worker contínuo | princípio "Postgres primeiro"; sem infra nova |
| Eventos | outbox transacional em `audit.outbox_event`, consumidores idempotentes | fixado no 05 |
| Web/PWA | Vite + React + TypeScript + Tailwind CSS + Radix/shadcn + Phosphor Icons | ecossistema maduro, tokens do DS viram theme Tailwind |
| Fontes web | Nunito (display), Inter (texto), JetBrains Mono (fórmulas) via fontsource | fixado no 03 |
| Auth do aluno (MVP) | sessão anônima assinada (cookie HttpOnly) + idade declarada; conta persistente criada no primeiro vínculo de responsável | o funil do PRD não tem cadastro antes da primeira prova |
| Auth do responsável | link de token curto + sessão própria | fixado no 05 |
| Pagamento | Stripe Checkout hospedado (assinatura em cartão; Pix avulso como recarga manual mensal) + webhooks; adapter `billing/adapters/stripe_payments.py` | Pix Automático indisponível p/ contas BR — ver §3.3 |
| FSRS | biblioteca `py-fsrs` (FSRS-6, MIT) embrulhada em `learning/scheduling/fsrs.py`, parâmetros por aluno persistidos | desvio documentado do 05 (FSRS-4.5→FSRS-6) — ver §3.3 |
| STT realtime | WebSocket do navegador → BFF → ElevenLabs realtime; fallback gravação→batch | mantém chave fora do cliente |
| TTS | fora do caminho crítico; só onde o wireframe pede resposta sonora | 05 permite |
| Região Railway | `us-east4-eqdc4a` (candidata; confirmar no spike S-01 com medição real do Brasil) | 05 §3.10 |
| Testes | pytest (unidade/integração/contrato/propriedade), Playwright (E2E PWA), `pytest-asyncio` | padrão do ecossistema |
| Lint/type | `ruff` + `mypy --strict` por serviço | contratos importam |
| CI | GitHub Actions: lint, type, testes, build, E2E headless, build das imagens | gate antes de deploy |
| Feature flags | tabela `audit.feature_flag` + leitura via BFF; rollout por coorte | fixado no 05 §11 |

### 3.3 Verificação externa (jul/2026)

Decisões de backend e IA checadas contra a documentação oficial vigente
(Context7 + fontes primárias). Fatos confirmados que viram restrição de
implementação:

- **DeepSeek V4**: `deepseek-v4-pro` confirmado (1M ctx, thinking ligado por
  padrão, JSON Output e Tool Calls). `deepseek-chat`/`deepseek-reasoner` foram
  depreciados em 2026-07-24. DeepSeek tem JSON mode, **sem** JSON Schema
  nativo: saída estruturada no Agno usa `output_schema` + `use_json_mode=True`,
  com validação Pydantic e retry no adapter. `deepseek-v4-flash` (~3× mais
  barato) é o default de classificação/validação; `v4-pro` fica para geração
  de cards e tutor (`MODEL_ID` / `MODEL_ID_CHEAP`).
- **Agno atual**: storage é `agno.db.postgres.PostgresDb` passado como `db=`
  ao `Agent`/`Workflow` (não `agno.storage`). Memória por checkpoint: o agente
  do tutor **não** usa `update_memory_on_run`; o `MemoryManager` é chamado
  explicitamente nos checkpoints definidos no M8.
- **pg_textsearch**: exige `shared_preload_libraries='pg_textsearch'` na
  imagem custom + restart. O operador `<@>` retorna BM25 negativo (menor =
  melhor); dentro de PL/pgSQL usar `to_bm25query()`. `text_config='portuguese'`
  disponível. Sem busca por frase — aceitável no MVP. PG17/18 suportados.
- **pgvector 0.8.x**: PG18 ok; iterative scan
  (`SET hnsw.iterative_scan=strict_order`) resolve filtros + HNSW. Mantida a
  decisão: exato primeiro, HNSW só pós-benchmark (spike S-08).
- **ElevenLabs Scribe v2**: batch com word timestamps, diarização e keyterm
  prompting (≤50 termos — glossário STEM por prova). Realtime via WSS com
  `language_code='pt'`, `no_verbatim` (limpa vícios de fala) e
  `filter_background_audio` (incompatível com timestamps — resolver no spike
  S-06). Zero-retention (`enable_logging=false`) é **enterprise-only**:
  retenção/exclusão na ElevenLabs é tratada por API + revisão de ToS no M11,
  não por toggle. Mantido o proxy BFF; token de uso único avaliado no spike.
- **LiteParse**: OCR embutido é Tesseract — a imagem Docker inclui `tessdata`
  `por` (`TESSDATA_PREFIX`). `lit is-complex` roteia páginas que precisam de
  OCR. Fallback de precisão: servidor OCR externo (EasyOCR/PaddleOCR) via
  `OCR_API_SPEC`, atrás do mesmo adapter. LibreOffice **fora** da imagem
  (MVP só foto/PDF/áudio).
- **FSRS**: `py-fsrs` (open-spaced-repetition, MIT, mantido) implementa
  FSRS-6 com 21 parâmetros, `desired_retention`, serialização JSON e
  otimizador. Substitui a implementação própria de FSRS-4.5: o adapter
  `learning/scheduling/fsrs.py` embrulha `Scheduler`/`Card`/`Rating`, mantém
  os testes de propriedade do M6 e persiste parâmetros por aluno. FSRS-6
  sucede o 4.5 — desvio registrado aqui; ADR curto no marco M6.
- **Stripe/Pix**: assinatura via Pix exige Pix Automático, indisponível para
  contas domiciliadas no BR (invite only). MVP: assinatura em cartão; Pix
  avulso (pagamento único) como recarga manual mensal, mesmo adapter. Conta
  não-BR implicaria IOF de 3,5% via Ebanx — fora do MVP. Decisão de
  entidade/conta registrada no spike S-09.
- **Railway**: `[[crons]]` nativos no `railway.toml` executam comandos na
  imagem do `worker` — o serviço `maintenance` é eliminado; retenção,
  reconciliação de pagamento e expurgo de áudio viram crons. Buckets
  S3-compatíveis expõem `BUCKET/REGION/ENDPOINT/ACCESS_KEY_ID/
  SECRET_ACCESS_KEY` por referência. O padrão pg_dump→S3 cobre o backup
  lógico externo criptografado.

## 4. Estrutura do monorepo

```text
meumodo/
  CONTEXT.md
  agents_workspace/final/      # especificações vigentes (somente leitura p/ agentes)
  agents_workspace/old/        # briefings, pesquisas e decisões arquivadas
  mock/meumodo_mock.html       # referência viva de UX
  docs/
    adr/                       # ADRs curtos, numerados
    runbooks/
  deploy/
    railway/
      railway.toml             # topologia declarativa dos serviços
      postgres/Dockerfile      # imagem PG18 + pg_textsearch + pgvector
      postgres/init/           # migrations de extensões idempotentes
      web/Caddyfile            # serve o build estático do PWA
  apps/
    web/                       # PWA (Vite + React + TS)
      src/
        design-system/         # tokens do 03 como theme Tailwind + CSS vars
        components/            # Button, Card, Chip, Sheet, MicButton…
        screens/               # 1:1 com as telas do mock (P00…R00)
        flows/                 # navegação e máquina de estados de fluxo
        api/                   # cliente tipado do BFF (OpenAPI codegen)
        voice/                 # captura de mic, waveform, upload, realtime STT
      public/manifest.webmanifest
      public/sw.js
    api/                       # aplicação Python (mesma imagem p/ api e worker)
      pyproject.toml
      alembic/
      src/
        identity/              # usuário, idade, vínculo, consentimento, authorize
        ingestion/             # material, versão, job, parse, segmentos
          domain/
          application/
          adapters/liteparse_adapter.py
          adapters/elevenlabs_adapter.py
          adapters/storage_s3.py
        knowledge/             # ontologia, conceitos, relações
          ontology/
          retrieval/           # BM25 + pgvector + grafo + RRF
          graph/               # NetworkX em subgrafo delimitado
          projections/         # card_search_document, material_search_document
        cards/                 # grupos, cards, versões, relações, evolução
          generation/
          validation/
          evolution/
        learning/              # sessões, tentativas, FSRS, domínio
          scheduling/fsrs.py
          mastery/
          sessions/
        tutor/                 # dois modos, Agno, memória
          agents/
          workflows/
          tools/               # TutorRetrievalToolkit, CardAuthoringToolkit
          memory/
        billing/               # oferta, checkout, webhook, entitlement
          adapters/stripe_payments.py
        privacy/               # retenção, exportação, exclusão
        contracts/             # schemas Pydantic compartilhados (ver 5.2)
        platform/
          db/                  # engine, sessões, RLS helpers
          jobs/                # fila Postgres, worker loop, retry
          outbox/
          observability/       # logging, tracing, métricas, correlação
          config/              # settings por ambiente (pydantic-settings)
          http/                # FastAPI app, middlewares, auth, /health/*
      tests/
  e2e/                         # Playwright: caminhos do wireframe
```

Regras estruturais (do 05, reforçadas):

- `contracts/` é o único módulo importado por todos os serviços.
- Domínio nunca importa Agno, LiteParse, ElevenLabs, SQLAlchemy, HTTP ou SDK de
  modelo. Esses vivem em `adapters/`, `tools/`, `platform/`.
- Cada serviço expõe `application/` como única porta; chamadores (HTTP, Agno
  tools, workers) passam por ela com `ExecutionContext`.
- `api` e `worker` usam a mesma imagem com start commands diferentes.

## 5. Modelo de dados e contratos

### 5.1 Schemas lógicos e tabelas (Postgres)

Schemas fixados no 05: `identity`, `study`, `knowledge`, `learning`, `agent`,
`billing`, `audit`. Tabelas mínimas (todas com `id uuid pk`,
`created_at`, `updated_at`; chaves de idempotência onde houver mutação externa):

| Schema | Tabelas |
|---|---|
| `identity` | `app_user`, `student_profile`, `guardian_relationship`, `guardian_invite`, `consent_record` |
| `study` | `exam`, `material`, `material_version`, `source_segment` |
| `knowledge` | `ontology_type`, `concept`, `concept_alias`, `concept_relation`, `card_group`, `card`, `card_version`, `card_relation`, `card_lineage`, `card_search_document`, `material_search_document` |
| `learning` | `study_session`, `session_item`, `attempt`, `card_learning_state`, `concept_mastery`, `contextual_request` |
| `agent` | `tutor_conversation`, `tutor_message`, `tutor_memory`, `agent_run` (tracing), tabelas internas do Agno via `PostgresDb` |
| `billing` | `offer`, `entitlement`, `payment_link`, `payment_event` |
| `audit` | `audit_event`, `outbox_event`, `processing_job`, `idempotency_key`, `feature_flag` |

Invariantes estruturais (do 05 §4.4, viram constraints/testes):

- `card` publicado ⇒ tem `card_group`, `card_version` atual, conceito-alvo e
  ≥1 `source_segment`.
- `card_version` é imutável (sem `UPDATE`; revisão cria nova linha).
- `source_segment` referencia `material_version` + (`page`+`bbox` | intervalo
  de tempo) + `confidence` + `parser_version`.
- `tutor_conversation.mode IN ('CARD','GENERAL')` com escopo serializado.
- `tutor_message.origin IN ('GROUNDED','GENERAL_KNOWLEDGE')`; `GROUNDED` exige
  ao menos uma citação válida em `source_refs`.
- depreciação é `status` no `card`; nunca `DELETE`.
- toda tabela com dado de aluno carrega `student_id` (ou alcançável por FK) —
  base do isolamento e da exclusão em cascata lógica.

### 5.2 Contratos Pydantic canônicos (`apps/api/src/contracts/`)

Versionar por módulo (`v1.py` inicial). Lista mínima:

| Contrato | Conteúdo essencial |
|---|---|
| `ExecutionContext` | ator (humano/agente), `student_id`, permissões, `run_id`, `conversation_id`/`workflow_id`, `correlation_id`, idempotency key |
| `ParsedMaterial` | páginas/segmentos, texto, bbox, confiança, `parser_version`, opções de OCR |
| `TranscriptDraft` | segmentos com início/fim, texto, confiança, palavras-chave STEM |
| `KnowledgeDelta` | conceitos, aliases, relações propostas, fontes, confiança, versão do extrator |
| `CardDraft` | tipo (`SHORT_QA`, `SIMPLE_APPLICATION`, `MISSING_STEP`), enunciado, resposta, critérios de avaliação, conceito-alvo, `source_refs`, dica, explicação |
| `SearchHit` | conforme 05 §3.9 (corpus, ids, status, excerpt, `source_refs`, ranks bm25/vector, `fused_score`, conceitos, `relation_path`) |
| `GroundedContext` | itens citados ordenados por peso, orçamento de tokens, trace de recuperação |
| `TutorResponse` | texto, citações, `origin`, ações sugeridas, micro-questão opcional |
| `SessionPlan` | lista ordenada de `session_item`, duração-alvo, motivo por item ("por que este card") |
| `AttemptResult` | avaliação (`CORRECT`, `PARTIAL`, `INCORRECT`, `SKIPPED`), feedback, ajuda usada, latência |
| Eventos de domínio | `MaterialConfirmed`, `CardsPublished`, `AttemptRecorded`, `SessionClosed`, `EntitlementChanged`, `DeletionRequested`… (envelope: tipo, versão, payload, `correlation_id`) |

### 5.3 Superfície HTTP do BFF (rotas `/v1`, espelho das interfaces 05 §4.5)

```text
POST   /v1/identity/session            # sessão anônima + idade declarada (P01)
GET    /v1/me                          # perfil, entitlement, flags
POST   /v1/exams                       # criar prova (A01); 409+paywall se limite
GET    /v1/exams                       # home (H00)
GET    /v1/exams/{id}                  # detalhe + progresso (H01 parcial)
POST   /v1/exams/{id}/conclude         # E00 (rating 1-5)
POST   /v1/exams/{id}/materials        # iniciar upload (URL assinada)
POST   /v1/materials/{id}/confirm      # confirma versão OCR/transcrição (A06/A07)
GET    /v1/materials/{id}/draft        # rascunho parseado p/ revisão
POST   /v1/exams/{id}/generate         # dispara workflow de geração (A08)
GET    /v1/exams/{id}/generation       # estado do pipeline (A08 polling)
POST   /v1/sessions                    # plan_session (A09 → S00)
GET    /v1/sessions/{id}               # estado da sessão
POST   /v1/sessions/{id}/attempts      # record_attempt (S00 texto/voz)
POST   /v1/sessions/{id}/close         # S06
GET    /v1/cards/{id}/source           # S05 (segmento + URL temporária)
POST   /v1/tutor/conversations         # abre conversa (modo CARD|GENERAL, escopo)
POST   /v1/tutor/conversations/{id}/messages  # texto ou transcrição de voz
GET    /v1/tutor/conversations/{id}    # histórico (T01)
GET    /v1/progress                    # H01 (conceitos, revisões, sessões)
POST   /v1/billing/guardian-links      # W01 (link do responsável)
GET    /v1/billing/guardian-links/{token}     # R00 (resumo mínimo)
POST   /v1/billing/checkout            # R00 → Stripe Checkout
POST   /v1/webhooks/payments           # Stripe (assinatura verificada)
GET    /health/live  /health/ready
```

Streaming/WebSocket: `WS /v1/voice/stt` (proxy autenticado p/ ElevenLabs
realtime) e SSE em `/v1/tutor/conversations/{id}/messages` para resposta do
tutor.

## 6. Mapeamento telas do mock → implementação

O mock (`mock/meumodo_mock.html`, servir com `python3 -m http.server` e abrir)
contém as 25 telas navegáveis com tokens e copy de referência. Cada tela vira
um componente de rota no PWA com o mesmo id:

| Mock | PWA route | Marco |
|---|---|---|
| P00 landing | `/` | M10 |
| P01 idade/privacidade | `/start` | M1 |
| A00 home vazia | `/home` (sem prova) | M2 |
| A01 nova prova | `/exams/new` | M2 (voz em M7) |
| A02 adicionar material | `/exams/{id}/materials/add` | M3/M4 |
| A03 preview foto | mesma rota, estado `preview` | M3 |
| A04 gravar áudio | estado `record` | M4 |
| A05 lista de materiais | `/exams/{id}/materials` | M3/M4 |
| A06 revisão OCR | `/materials/{id}/review` | M3 |
| A07 revisão transcrição | `/materials/{id}/review` (áudio) | M4 |
| A08 processando | `/exams/{id}/processing` | M5 |
| A09 prática pronta | `/exams/{id}/ready` | M5 |
| S00–S06 sessão | `/sessions/{id}` (+ sheets) | M6 (voz M7, tutor M8) |
| H00 home ativa | `/home` | M9 |
| H01 progresso | `/progress` | M9 |
| T00/T01 tutor | `/tutor`, `/tutor/{id}` | M8 |
| E00 concluir prova | `/exams/{id}/conclude` | M9 |
| W00/W01 paywall | `/paywall`, `/paywall/guardian` | M10 |
| R00 responsável | `/g/{token}` (web pública light) | M10 |

## 7. Sequência de execução (marcos)

Ordem obrigatória: cada marco depende do anterior, salvo indicação. Marcos são
fatias verticais sempre que possível — nada de "camada inteira sem tela".

### M0 — Scaffold, CI e deploy "hello" no Railway

**Objetivo:** qualquer commit na `main` sobe um esqueleto saudável em produção.

Tarefas:

1. Criar estrutura da seção 4 com `uv` workspace, `ruff`, `mypy`, `pytest`
   configurados; `make lint type test` verde com um teste trivial.
2. FastAPI mínimo em `platform/http`: `/health/live` e `/health/ready`
   (ready checa Postgres), escutando `PORT` injetado, dual-stack.
3. `deploy/railway/postgres/Dockerfile`: PostgreSQL 18 + `pg_textsearch` +
   `pgvector`, build reproduzível, pin por digest; migration idempotente que
   cria extensões e schemas da seção 5.1 vazios.
4. Serviços Railway `web` (estático "hello"), `api`, `worker` (loop vazio com
   heartbeat em log), `postgres-search` (volume em
    `/var/lib/postgresql/data`), `materials` (bucket privado); um `[[crons]]`
    de heartbeat no `worker` valida agendamentos. Ambientes `staging` e
    `production`. Watch paths por serviço.
5. Rede: só `web` e `api` com domínio público; `api`→`postgres-search` por
   `*.railway.internal`; Variables com referências (`DATABASE_URL` etc.).
6. Alembic no pre-deploy do `api`, com advisory lock; falha impede promoção.
7. CI (GitHub Actions): lint, type, unit, build das duas imagens; deploy
   automático em `staging` na `main`; promoção manual para `production`.

**Aceite:** `curl https://api.staging…/health/ready` → 200; `worker` loga
heartbeat; rebuild de `web` não rebuilda `api` (watch paths); rollback
exercitado uma vez e registrado em `docs/runbooks/rollback.md`.
**Verificação:** `railway status` + checklist acima anexado ao PR.

### M1 — Contratos, fundação de dados e identidade mínima

**Objetivo:** base transversal pronta; aluno passa pelo P01 e tem sessão.

Tarefas:

1. `contracts/` com todos os schemas da seção 5.2 + testes de serialização e
   compatibilidade (round-trip).
2. Alembic: todas as tabelas da seção 5.1 com índices por `student_id` e FKs;
   migração aplica/verde em staging.
3. `platform/jobs`: fila Postgres com `SKIP LOCKED`, retry com backoff,
   `ProcessingJob` com `pipeline/attempt/status/cost/error/correlation_id`;
   teste de idempotência (reexecutar não duplica efeito).
4. `platform/outbox`: publicação transacional + consumidor de exemplo.
5. `identity`: `POST /v1/identity/session` (cookie HttpOnly assinado, idade
   declarada, política por faixa), `authorize` interno, `AuditEvent` de criação.
6. PWA: scaffold Vite, design tokens do 03 em `design-system/` (cores, radius,
   sombras chunky, tipografia Nunito/Inter/JetBrains), componentes base
   (`Button`, `Card`, `Chip`, `Sheet`, `IconBtn`, `MicBtn`, `Progress`,
   `BNav`) com stories/screenshots, tela P01 funcional contra a API, manifest
   + service worker instalável.

**Aceite:** fluxo P01 persiste idade e abre sessão; `mypy --strict` verde em
`identity` e `contracts`; isolamento: usuário A não lê nada de B (teste).
**Verificação:** `pytest apps/api -k identity` + Playwright `p01.spec.ts`.

### M2 — Prova e limite de oferta (sem materiais ainda)

**Objetivo:** A00 → A01 → prova criada; segunda prova bloqueia com W00.

Tarefas:

1. `study.exam` + `billing.entitlement` (prova gratuita: `free_exam_used`),
   `offer` seed; regra: 1ª prova grátis, 2ª exige `Entitlement` ativo.
2. `POST /v1/exams` com validação (matéria + nome obrigatórios, data opcional),
   `GET /v1/exams` (home agregada).
3. PWA: A00 (estado vazio), A01 (chips de matéria, nome, data), estados de
   erro e loading conforme DS; navegação por teclado e leitor de tela.
4. Resposta `409 EXAM_LIMIT` → tela W00 **estática** (sem link ainda; botão
   "Continuar revisando" volta para H00).
5. Telemetria: eventos `exam_created`, `exam_limit_hit` com `correlation_id`.

**Aceite:** criar prova → aparece na home; criar 2ª → W00; recarregar mantém
estado; a11y: fluxo completo só com teclado.
**Verificação:** `pytest -k exam` + Playwright `exam-limit.spec.ts`.

### M3 — Ingestão de foto e PDF com revisão (A02/A03/A05/A06)

**Objetivo:** material de imagem/PDF vira `MaterialVersion` confirmada e
`SourceSegment` rastreável.

Tarefas:

1. `adapters/storage_s3.py`: URL assinada de upload/download, validação de
   conteúdo (magic bytes), remoção de metadados, limite de tamanho/quantidade
   (3 materiais/prova, enforce no servidor).
2. `ingestion`: `ingest_material` → `ProcessingJob` → adapter LiteParse
   (`liteparse` Python pinado; `is_complex`; OCR `por`; saída JSON + bbox +
   screenshots) → normalização para `ParsedMaterial` → `SourceSegment`
   provisório. Estado: `recebido → processando → precisa de revisão → pronto
   → falhou`, com motivo e `parser_version`.
3. `GET /v1/materials/{id}/draft` + `POST .../confirm` (edição do aluno vira
   `MaterialVersion` confirmada; imutável depois).
4. PWA: A02 (4 entradas, contador n/3), A03 (preview), A05 (status por item,
   Continuar só com ≥1 confirmado), A06 (texto editável, trechos de baixa
   confiança com `warning-soft`, "Só salvar" e "Salvar e continuar").
5. Estados de falha honestos: arquivo inválido, página ilegível → pede nova
   captura; nunca inventar trecho.
6. Corpus de avaliação em `apps/api/tests/fixtures/corpus/` (foto de caderno,
   lista, slide, PDF escaneado, fórmula, tabela) + métrica de % marcado/
   corrigido.

**Aceite:** cada `SourceSegment` aponta para página+bbox do bruto; correção do
aluno persiste; reprocessar não duplica segmentos; benchmark do corpus
registrado em `docs/ocr-benchmark.md`.
**Verificação:** `pytest -k ingestion` + E2E `photo-to-review.spec.ts`.

### M4 — Ingestão de áudio (A04/A07)

**Objetivo:** áudio gravado ou enviado chega à mesma camada de `SourceSegment`.

Tarefas:

1. PWA: captura de microfone (MediaRecorder), indicador de nível, timer,
   aviso "pode gravar mesmo com barulho", permissão negada e fallback de
   upload de arquivo.
2. `adapters/elevenlabs_adapter.py` (batch STT): `language_code=pt`,
   timestamps por palavra, diarização quando disponível, keyterms STEM por
   prova; normalização para `TranscriptDraft`.
3. Segmentos vazios/ruidosos/baixa confiança marcados; player no ponto exato
   (URL assinada + seek por intervalo); edição por segmento; confirmar vira
   `MaterialVersion` de áudio + `SourceSegment` por intervalo de tempo.
4. Política de retenção do áudio bruto (flag de configuração; cron de expurgo
   no `worker`).
5. Benchmark com gravações reais (celular, ruído, voz distante, termos de
   física) em `docs/stt-benchmark.md`.

**Aceite:** A07 mostra timecodes, toca segmento, edita e salva; falha de STT
degrada com mensagem clara e retry; áudio bruto expira conforme política.
**Verificação:** `pytest -k audio` + E2E `audio-review.spec.ts`.

### M5 — Geração de cards e ontologia v1 (A08/A09)

**Objetivo:** de `MaterialVersion` confirmada a cards publicados com fonte.

Tarefas:

1. Ontologia v1: seeds de `ontology_type` (nós: `Subject`, `Topic`, `Concept`,
   `Skill`, `Misconception`; relações: `PART_OF`, `PREREQUISITE_OF`,
   `APPLIES`, `EQUIVALENT_TO`, `EXEMPLIFIES`, `CONTRADICTS`, `GROUNDED_IN`,
   `TARGETS`, `REMEDIATES`) com schema de validação e versionamento; STEM
   inicial para física/matemática/química do ensino médio.
2. Workflow Agno `content_generation`: `KnowledgeDelta` (extração) → validação
   ontológica determinística → `CardGroup` por objetivo → Agente Autor
   (DeepSeek V4 Pro, saída `CardDraft`) nos 3 tipos (`SHORT_QA`,
   `SIMPLE_APPLICATION`, `MISSING_STEP`) → estágio crítico separado (resposta,
   idioma, duplicação, nível, citação, aderência à fonte) → publicação de
   `CardVersion` imutável + `card_lineage` (prompt, modelo, esforço, schema,
   fontes, avaliação).
3. API de Cards: `generate_card_draft`, `revise_card`, `publish_card`,
   `deprecate_card` com `expected_version`, idempotência, auditoria; tools
   Agno por perfil (Tutor=leitura, Autor=draft/revise, Ciclo de
   vida=publish/deprecate).
4. `GET /v1/exams/{id}/generation` expõe passos reais do pipeline (materiais
   conferidos → temas encontrados → criando exercícios → conferindo fontes);
   A08 faz polling e permite sair e voltar.
5. A09: resumo (duração, nº de atividades, temas, fontes) + ajuste de duração.
6. Conjunto de avaliação de geração (aderente/não aderente) + taxa de rejeição
   medida; revisão humana em amostra documentada.

**Aceite:** a partir dos materiais do corpus, pipeline publica ≥8 cards válidos
com citação resolvível em ≤ orçamento definido; card sem suporte nunca é
publicado; depreciar remove de busca sem apagar linhagem.
**Verificação:** `pytest -k "cards or ontology"` + script `make eval-generation`
com relatório.

### M6 — Sessão de estudo completa (S00–S03, S05, S06)

**Objetivo:** o loop central funciona: plano → card → resposta → feedback com
fonte → próximo → fechamento.

Tarefas:

1. `learning`: `plan_session` (por prova: novos × revisões, cobertura de
   conceitos, urgência da data; retorna `SessionPlan` com motivo por item),
   `record_attempt`, `close_session`.
2. Avaliação de tentativa: regras por tipo de card (numérica com tolerância,
   MC exata, `MISSING_STEP` por rubrica) + classificador delimitado (DeepSeek,
   saída Pydantic) para resposta aberta; `AttemptResult` com feedback
   explicativo e passos.
3. FSRS via `py-fsrs` (FSRS-6) embrulhado em `learning/scheduling/fsrs.py`,
   **seguindo o doc 09 na íntegra** (scheduler com learning/relearning
   steps, mapeamento Tentativa→Rating da tabela §3.3 do doc 09, SKIPPED
   sem lapse, fuzz, máx 180d):
   `CardLearningState` atualizado por tentativa (ajuda pesa menos que acerto
   autônomo); planner `plan_session` como função pura implementando a
   **Equação de Prioridade de Estudo (EPE) proprietária** — 9 fatores, pesos
   versionados em `learning.algorithm_config`, `reason` derivada do fator
   dominante com breakdown persistido (doc 09 §4); `ConceptMastery` agrega
   evidências (doc 09 §7); testes de propriedade (erro
   antecipa revisão, acerto espaça, monotonicidade) + testes unitários dos
   9 fatores + golden snapshots de cenários + simulação de 14 dias (doc 09 §9).
4. PWA: S00 (header, progresso "n de 12", chip Fonte, pergunta, input,
   "Não sei" válido, rail pista/tutor/fonte), S01 pista, S02/S03 feedback
   (verde/âmbar, passos em JetBrains Mono, swipe-up/↑ como atalho só após
   feedback), S05 ver fonte (imagem da página com highlight do bbox ou player
   no timecode), S06 fechamento (tempo, acertos, o que volta; **sem
   XP/confete**).
5. Estados: sair e retomar sessão, perda de rede, erro de avaliação com retry.
6. Explicação "por que este card apareceu" persistida no `session_item`.

**Aceite:** sessão de 10 min ponta a ponta sem intervenção; fonte abre no
trecho exato; FSRS reagenda de forma explicável; E2E cobre acerto, erro,
"Não sei", pista e sair/voltar.
**Verificação:** `pytest -k learning` + E2E `session.spec.ts`.

### M7 — Voz como entrada de primeira classe

**Objetivo:** responder e comandar por voz na sessão e na criação da prova.

Tarefas:

1. `WS /v1/voice/stt`: proxy autenticado BFF → ElevenLabs realtime; eventos
   parciais/finais; fallback gravação→batch quando WS indisponível.
2. Sessão: "responder falando" (56px, timer, cancelar, transcrição visível
   antes de enviar; baixa confiança → correção rápida); comandos falados:
   "repete", "explica de outro jeito", "me dá uma dica", "mostra a fonte",
   "cria uma parecida", "pula" → `ContextualRequest` com confirmação quando
   houver perda de estado.
3. A01: preenchimento por voz com card "Entendi assim" para confirmar/editar.
4. Matriz de intenções × falhas (sotaque, fala rápida, ruído, ambíguo,
   permissão negada) testada e documentada.
5. Latência de voz medida e dentro do orçamento definido em M0/Fase 0.

**Aceite:** dá para fazer uma sessão inteira por voz; comando ambíguo pede
confirmação; transcrição nunca é enviada sem revisão quando incerta.
**Verificação:** `pytest -k voice` + E2E manual roteirizado (Safari/iOS +
Chrome/Android) com evidência em vídeo anexa.

### M8 — Tutor do Card e Chat do Tutor (S04, T00, T01)

**Objetivo:** os dois modos funcionam por texto e voz, com citações e memória.

Tarefas:

1. Projeções `card_search_document` e `material_search_document` (atualizadas
   por outbox, consumidores idempotentes) + índices `pg_textsearch` (config
   PT-BR) e `pgvector` (exato; HNSW só após benchmark).
2. `knowledge/retrieval`: `search_cards`, `search_materials` (BM25 ∥ vetor,
   filtro SQL de escopo antes de tudo), `retrieve_grounded_context` (expansão
   de grafo limitada, RRF ponderada, reranking, dedup, orçamento de tokens,
   citações + trace). Isolamento por aluno testado como propriedade.
3. `TutorRetrievalToolkit` (11 tools do 05 §5.5) e agentes Agno dos dois
   modos com DeepSeek V4 Pro; hooks injetam `ExecutionContext`, validam
   escopo e logam execução.
4. Tutor do Card (S04): sheet que preserva a atividade; `GroundedContext` na
   ordem de peso do 05; entradas rápidas + texto livre + voz; termina turno
   com micro-questão quando fizer sentido; "sinalizar questão" registra
   revisão operacional.
5. Chat do Tutor (T00/T01): conversa persistente, seletor de escopo (tudo /
   prova / tema / material), sugestões iniciais, janela recente + resumo
   versionado; "Criar card disso" dispara workflow de autoria com as fontes
   recuperadas (tutor nunca publica direto).
6. Separação de origem: resposta `GROUNDED` exige citação válida; conhecimento
   geral recebe rótulo "Além do seu material" e nunca citação falsa.
7. Memória: `PostgresDb` + `MemoryManager` só em checkpoints (fim de sessão,
   conclusão de prova, conversa relevante); `TutorMemory` com escopo,
   finalidade, confiança, retenção, correção/exclusão; memória nunca altera
   estado pedagógico diretamente.

**Aceite:** pergunta sobre o material responde com "Ver fonte" que abre o
trecho; pergunta fora do material sai rotulada; conversa retoma escopo e
histórico após reload; avaliação de RAG (recall@k, precisão de citação,
"sem resposta" quando falta suporte) passa do limiar definido.
**Verificação:** `pytest -k "retrieval or tutor"` + `make eval-rag` + E2E
`tutor.spec.ts`.

### M9 — Home ativa, progresso e conclusão de prova (H00, H01, E00)

Tarefas:

1. Agregação da home: prova ativa, atividades pra revisar (de FSRS), materiais
   n/3, mini-progresso por conceito, atalho Tutor.
2. H01: domínio por conceito (barras + status textual), revisões feitas,
   histórico de sessões; **sem ranking, percentil ou previsão de nota**;
   linha "O comparativo é com você de ontem."
3. E00: concluir prova com nota 1–5; nota baixa registra acolhimento (sem
   dark pattern) e sinaliza revisão operacional.
4. Checkpoint de memória no fechamento de sessão/prova (M8.7) e resumo de
   sessão persistido.

**Aceite:** home reflete FSRS real (revisões de ontem aparecem hoje); progresso
bate com tentativas; concluir prova atualiza estado e home.
**Verificação:** `pytest -k progress` + E2E `home-progress.spec.ts`.

### M10 — Landing, paywall e jornada do responsável (P00, W00, W01, R00)

Tarefas:

1. P00 light editorial conforme 02/03 (headline, passos 📸⚡🎯, assinatura
   "Seu material. Sua prova. Seu ritmo.", páginas legais e de privacidade).
2. W00 real: stats do uso (sessões, temas, revisões), primeira prova continua
   acessível, "Mandar pro responsável".
3. `billing`: `guardian_invite` (token curto, expiração, uso delimitado),
   W01 com listas "o que o responsável vê / não vê", compartilhar no WhatsApp
   e copiar link.
4. R00 (web pública light): convite privado, resumo mínimo, oferta e preço,
   política de dados, Stripe Checkout; anti-enumeração e expiração testadas.
5. Webhook Stripe com assinatura verificada → `payment_event` idempotente →
   `Entitlement` ativo (nunca depender do redirect); cancelamento, estorno,
   abandono e reconciliação (cron no `worker`). Assinatura em cartão; Pix
   avulso gera `Entitlement` com validade de 30 dias (§3.3).
6. Métricas do funil: convite criado → aberto → checkout → ativação.

**Aceite:** jornada gratuita íntegra após paywall; pagamento de teste ativa
2ª prova sem tocar no banco manualmente; replay de webhook não duplica
entitlement; cancelamento reverte no ciclo correto.
**Verificação:** `pytest -k billing` (inclui contrato Stripe com `stripe
mock`/sandbox) + E2E `guardian.spec.ts`.

### M11 — Hardening e beta controlado

Tarefas (cada uma vira epic próprio na reta final):

1. Privacidade: inventário por finalidade, retenção por tipo de dado, exclusão
   integral propagando a Postgres, objetos, índices, Agno e ElevenLabs, com
   relatório de propagação; teste automatizado de exclusão.
2. Segurança: threat model (upload, links, webhooks, prompt injection em
   materiais), rate limits, limites de custo por provedor, RLS como defesa
   adicional, revisão de secrets.
3. Observabilidade: dashboards (produto, custo, saúde), alertas com runbooks,
   painel de jobs/outbox, tracing Agno ponta a ponta.
4. Qualidade: suíte E2E de todos os caminhos do wireframe; testes de carga do
   caminho de estudo e checkout; a11y manual (teclado + leitor de tela) nas 25
   telas; rollback de app/modelo/prompt/ontologia exercitado.
5. Operação: backups de volume + backup lógico externo criptografado, restore
   testado; monitoramento externo; feature flags por coorte; canal de suporte
   com `correlation_id`.
6. Portões: revisão jurídica (LGPD + Lei 15.211/2025), aceite de região/
   transferência internacional, orçamentos de latência/custo validados.

**Aceite:** checklist da seção 12 do documento 05 inteiro com evidência
linkada; beta por coorte habilitado por flag.

## 8. Deploy no Railway (referência operacional)

### 8.1 Serviços

| Serviço | Fonte | Exposição | Start |
|---|---|---|---|
| `web` | `apps/web` (build Vite) + `deploy/railway/web/Caddyfile` | domínio público | `caddy run` (serve `dist/`, headers de segurança, fallback SPA) |
| `api` | `apps/api` (Dockerfile raiz do app Python) | domínio público | `uvicorn platform.http.app:app --host :: --port $PORT` |
| `worker` | mesma imagem do `api` | privado | `python -m platform.jobs.worker` |
| `postgres-search` | `deploy/railway/postgres/Dockerfile` (pin por digest) | privado + Volume em `/var/lib/postgresql/data` | padrão da imagem |
| `materials` | Railway Storage Bucket (S3-compatible, privado) | SDK | — |
| crons do `worker` | `[[crons]]` no `railway.toml` (imagem do `worker`) | privado | tarefas agendadas: retenção, reconciliação de pagamento, expurgo de áudio |

Regras (do 05 §3.10, viram checklist de PR de infra):

- só `web` e `api` têm domínio público; nada de TCP proxy público para Postgres;
- comunicação interna por `*.railway.internal` + Variables de referência;
- migrations no pre-deploy do `api`, backward-compatible, com advisory lock;
- `/health/live` (processo) e `/health/ready` (dependências) configurados como
  healthcheck de deploy + monitoramento externo independente;
- ambientes `staging` e `production` isolados (banco, bucket, credenciais,
  private network próprios); `development` local via `docker compose`
  (mesma imagem de Postgres) — `deploy/compose.yaml`;
- watch paths: `apps/web/**` → `web`; `apps/api/**` + `deploy/railway/postgres/**`
  → serviços Python/banco;
- secrets só em Variables; nunca em imagem, repo ou variável pública do frontend;
- região candidata `us-east4-eqdc4a` (fixar só após spike S-01).

### 8.2 Variables (mínimo)

```text
api/worker (inclui crons):
  DATABASE_URL (ref postgres-search)   STORAGE_ENDPOINT/KEY/SECRET (ref materials)
  DEEPSEEK_API_KEY                     ELEVENLABS_API_KEY
  STRIPE_SECRET_KEY  STRIPE_WEBHOOK_SECRET
  SESSION_SIGNING_KEY                  APP_ENV=staging|production
  MODEL_ID=deepseek-v4-pro  MODEL_ID_CHEAP=deepseek-v4-flash  COST_BUDGET_PER_EXAM_CENTS
web (build-time):
  VITE_API_BASE_URL (domínio público do api)
```

### 8.3 Backups e DR

Backup de volume agendado + backup lógico criptografado (`pg_dump`) para
destino independente; restore testado a cada marco de M3 em diante. Bucket não
é backup de si mesmo: réplica criptografada dos brutos enquanto a política de
retenção exigir, expurgada junto.

## 9. Spikes obrigatórios (antes ou no início do marco indicado)

| # | Spike | Prova | Quando |
|---|---|---|---|
| S-01 | Railway | topologia, private DNS, pre-deploy, região (latência real do BR), custo, rollback | M0 |
| S-02 | Imagem Postgres | build pinado PG18 + `pg_textsearch` + `pgvector`, volume, restore | M0 |
| S-03 | Bucket | upload assinado, CORS, exclusão, criptografia de aplicação se exigida | M3 |
| S-04 | PWA câmera/mic | Safari/iOS + Chrome/Android: permissões, instalação, retomada | M1 (revalidar em M4/M7) |
| S-05 | LiteParse PT-BR | corpus do M3: foto, scan, fórmula, tabela, manuscrito; latência | M3 |
| S-06 | ElevenLabs | batch + realtime, PT-BR ruidoso, timestamps, custo, retenção | M4/M7 |
| S-07 | Agno + DeepSeek | structured output Pydantic, tool calls, thinking on/off, tracing | M5 |
| S-08 | BM25+vetor+RRF | recall@k, latência, isolamento por aluno, config PT-BR | M8 |
| S-09 | Stripe BR | checkout Pix/cartão, webhooks, estorno, reconciliação | M10 |

Falhar um spike ⇒ ajuste, restrição explícita, fallback atrás da mesma
interface ou ADR. Nunca troca silenciosa.

## 10. Coordenação entre agentes

1. **Contratos compartilhados com dono único:** `contracts/`, migrações
   Alembic e `railway.toml` só mudam com um epic próprio e aviso no PR;
   dois agentes nunca editam o mesmo contrato em paralelo.
2. **Branches/PRs:** um marco pode ter vários PRs; cada PR fecha tarefas com o
   comando de verificação verde no CI. Sem commits diretos na `main`.
3. **Estados de erro e a11y são parte da tarefa**, não follow-up.
4. **Copy:** toda string visível segue `02_POSICIONAMENTO_E_BRAND_PAGE_FINAL.md`
   (PT-BR, sentence case, "você", contrações naturais, no máximo um emoji).
   Proibido inventar gamificação (XP, gems, streak, ranking) — ver banlist do 03.
5. **Telemetria obrigatória:** toda rota nova emite eventos com
   `correlation_id`; sem conteúdo sensível em log.
6. **Ao concluir um marco:** atualizar a tabela de status abaixo e abrir o
   próximo marco como epic com o cabeçalho do 05 §13.

### 10.1 Status dos marcos

| Marco | Estado | Evidência (PR/relatório) |
|---|---|---|
| M0 Scaffold + Railway | pendente | |
| M1 Contratos + identidade | pendente | |
| M2 Prova + limite | pendente | |
| M3 Ingestão foto/PDF | pendente | |
| M4 Ingestão áudio | pendente | |
| M5 Geração de cards | pendente | |
| M6 Sessão de estudo | pendente | |
| M7 Voz | pendente | |
| M8 Tutor (2 modos) | pendente | |
| M9 Home/progresso | pendente | |
| M10 Paywall/responsável | pendente | |
| M11 Hardening/beta | pendente | |

## 11. Definição de pronto (projeto)

O trabalho termina quando, **em produção no Railway**:

1. um aluno de teste conclui, sem intervenção manual: P01 → A01 → envia foto,
   PDF e áudio → revisa OCR e transcrição → A08/A09 → sessão de 10 min com
   acertos, erros, pista, fonte e voz → Tutor do Card e Chat com citações →
   revisões agendadas aparecem na home no dia seguinte;
2. a segunda prova bloqueia com W00, o link do responsável abre R00, um
   pagamento em sandbox ativa o acesso e a reconciliação confere;
3. a exclusão de uma conta propaga para banco, objetos, índices, Agno e
   ElevenLabs, com relatório;
4. os 28 critérios da seção 12 de `05_IMPLEMENTACAO_MACRO_FINAL.md` têm
   evidência linkada neste documento ou no PR correspondente;
5. rollback da aplicação, do modelo, de prompt, de ontologia e de adaptador foi
   exercitado em staging;
6. monitoramento, alertas, runbooks e canal de suporte estão ativos.

**Fora de escopo do MVP (não implementar):** XP/gamificação, ranking social,
feed, apps nativos, expansão além de STEM, pesquisa web do tutor, planos
anuais, integrações institucionais (05, Fase 6).

