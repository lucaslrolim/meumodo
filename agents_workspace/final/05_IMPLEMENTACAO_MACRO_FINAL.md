# Meu Modo — Implementação técnica macro

**Status:** versão final revisada para decomposição em epics e tarefas  
**Versão:** 2.2  
**Data da revisão arquitetural:** 26/07/2026  
**Mercado inicial:** Brasil  
**Escopo:** MVP validável com adolescentes, responsável e operação assistida  
**Documento central de produto:** `01_PRD_FINAL.md`

---

## 1. Objetivo deste documento

Este documento traduz o PRD em uma arquitetura e uma sequência técnica de alto
nível. Ele define serviços, módulos, interfaces, dependências, tecnologias
escolhidas, resultados verificáveis e critérios de saída. Não é uma lista de
tickets nem uma especificação linha a linha.

Cada macroetapa deve ser transformada depois em epics e tarefas pequenas para
agentes de implementação. A decomposição só começa quando as decisões e os
critérios de saída da macroetapa estiverem claros.

### 1.1 Decisões técnicas fixadas

| Área | Decisão |
|---|---|
| Estilo arquitetural | Service-Oriented Architecture, orientada a capacidades de negócio |
| Backend e domínio | Python; módulos profundos dentro de cada serviço |
| Plataforma de deploy | Railway, com monorepo e serviços separados por processo |
| Runtime de agentes | Agno, com `Agent`, `Workflow`, memória e conhecimento |
| Modelo principal | DeepSeek V4 Pro, identificador `deepseek-v4-pro` |
| Banco autoritativo | PostgreSQL 17 ou 18 |
| Recuperação | BM25 com `pg_textsearch` + `pgvector` + expansão de grafo |
| Grafo | nós e arestas no PostgreSQL; NetworkX para algoritmos sobre subgrafos delimitados |
| Parsing | LiteParse local, pacote Python `liteparse`, repositório `run-llama/liteparse` |
| Áudio | ElevenLabs como implementação inicial do serviço de áudio |
| Cliente | aplicação web responsiva e instalável como PWA |
| Contratos de IA | modelos Pydantic versionados e saídas estruturadas |

“ElevenLabs” é a interpretação técnica de “21xLabs” no requisito de áudio. Se
“21xLabs” nomear um serviço interno diferente, ele deverá implementar o mesmo
contrato de áudio; o domínio e os fluxos abaixo não mudam.

BM25 significa BM25 real, não apenas `ts_rank` do full-text nativo. A
implementação inicial é a extensão `pg_textsearch`, dentro do PostgreSQL. Se o
provedor escolhido não permitir a extensão, `pg_search` pode substituí-la
somente por ADR, revisão de licença e benchmark, atrás do mesmo adapter de
busca.

### 1.2 Ordem de precedência

Em caso de conflito:

1. `01_PRD_FINAL.md` define produto, escopo e métricas;
2. `04_WIREFRAME_FINAL.md` define fluxos, estados e alcance das telas;
3. `03_DESIGN_SYSTEM_FINAL.md` define comportamento visual e acessibilidade;
4. este documento define arquitetura e ordem de implementação;
5. rascunhos anteriores servem apenas como contexto histórico.

### 1.3 Decisões de escopo que não podem regredir

Áudio e voz fazem parte do MVP em três capacidades:

1. importar ou gravar áudio, inclusive mal gravado, como material da prova;
2. responder falando durante o estudo;
3. pedir ações e explicações por voz dentro da aplicação.

O Tutor faz parte do MVP em dois modos:

1. **Tutor do Card:** conversa dentro da atividade, com card, pergunta,
   tentativa e fontes atuais recebendo maior peso; pode recuperar outros
   conteúdos autorizados.
2. **Chat do Tutor:** conversa própria, com histórico, para perguntar sobre toda
   a base do aluno, uma prova, tema ou material selecionado.

Ambos aceitam texto e voz, compartilham memória pedagógica e diferenciam
conteúdo fundamentado nos materiais de conhecimento geral do modelo.

---

## 2. Princípios técnicos

1. **Uma fatia vertical antes da amplitude.** A primeira entrega funcional deve
   percorrer material → conteúdo conferido → exercício → resposta → feedback.
2. **A fonte é parte do dado.** Todo exercício gerado mantém referência ao
   trecho de origem; conteúdo sem fonte não entra automaticamente na sessão.
3. **IA propõe; regras validam.** Modelos não controlam sozinhos autorização,
   cobrança, exclusão, domínio curricular ou mudança de estado.
4. **Falha explícita é melhor que confiança falsa.** OCR, transcrição e geração
   exibem incerteza e oferecem correção.
5. **Privacidade por padrão.** Coletar o mínimo, restringir visibilidade, definir
   retenção e permitir exclusão.
6. **Operação observável.** Cada etapa assíncrona tem status, tentativa,
   duração, custo, erro e correlação.
7. **Serviços por capacidade, não por tabela.** Ingestão, conhecimento, cards,
   aprendizagem, tutor, identidade, cobrança e privacidade têm contratos
   próprios; não criar um serviço para cada entidade.
8. **Tecnologia escolhida não vaza para o domínio.** LiteParse, ElevenLabs,
   Agno, DeepSeek e pgvector entram por módulos e adaptadores.
9. **Agentes delimitados por workflows.** Agno orquestra raciocínio, memória e
   ferramentas, mas autorização, cobrança, ingestão, validação e atualização de
   estado continuam determinísticas.
10. **Postgres primeiro.** Estado relacional, ontologia, grafo, vetores, BM25,
    memória Agno e auditoria permanecem no Postgres enquanto os objetivos de
    escala forem atendidos.
11. **Módulos profundos.** Cada serviço expõe uma interface curta e esconde
    regras, persistência e fornecedores; testes atravessam a mesma interface
    usada pelos chamadores.

---

## 3. Topologia-alvo

```text
PWA aluno / web pública / responsável
                    │
             API Gateway / BFF
                    │
    ┌───────────────┼────────────────┐
    │               │                │
Identidade      Ingestão        Conhecimento
    │               │                │
Cobrança          Cards ───────── Ontologia
    │               │                │
Privacidade    Aprendizagem ─────── Tutor
    └───────────────┼────────────────┘
                    │
              PostgreSQL
       relacional + BM25 + pgvector
        grafo + memória do Agno
                    │
          armazenamento de objetos
                    │
            fila de trabalhos
     LiteParse | ElevenLabs | Agno/DeepSeek
```

### 3.1 Service-Oriented Architecture

Os blocos acima são **serviços orientados a capacidades**. Cada serviço possui:

- um contrato versionado;
- ownership de seus dados e invariantes;
- comandos e consultas explícitos;
- eventos de domínio publicados via outbox transacional;
- idempotência, autorização, telemetria e política de erro;
- um ou mais módulos Python internos.

No MVP, os serviços podem viver no mesmo monorepo, compartilhar o cluster
PostgreSQL e ser implantados como um único processo web mais trabalhadores.
Isso é uma decisão de implantação, não uma quebra da SOA. Um serviço só é
extraído para deploy independente quando carga, isolamento de falha, segurança
ou ritmo de mudança justificarem.

Não permitir:

- acesso direto de um serviço às tabelas privadas de outro;
- entidade distribuída com metade das regras em cada serviço;
- chamadas síncronas em cascata no caminho crítico;
- “microserviço” que só repassa parâmetros a outro.

### 3.2 Cliente do aluno

Responsável por:

- entrada por câmera, arquivo, microfone e texto;
- pré-visualização e correção antes do processamento;
- gravação com indicador de nível e duração;
- revisão de OCR e transcrição com marcação de baixa confiança;
- estudo, resposta escrita ou falada e comandos contextuais;
- estados offline, permissão negada, fila, erro e retomada;
- consentimento, preferências de acessibilidade e exclusão.

A escolha padrão é uma **Progressive Web App**:

- mobile-first, responsiva e instalável por Web App Manifest;
- shell cacheável por service worker;
- câmera, arquivos e microfone por APIs do navegador;
- upload retomável quando a plataforma permitir;
- nenhum material, áudio ou resposta sensível em cache offline por padrão;
- fallback explícito quando uma capacidade varia entre navegadores.

O backend continua em Python. O cliente deve permanecer fino: regras de
domínio, autorização, seleção de cards e memória não são implementadas no
navegador. Um spike valida câmera, microfone, permissões, instalação e
limitações de Safari/iOS e Chrome/Android.

### 3.3 Web pública e área do responsável

Responsável por:

- landing page e páginas legais;
- abertura segura do link do responsável;
- explicação da oferta e do tratamento de dados;
- autorização quando aplicável;
- checkout, recibo, cancelamento e gestão básica da assinatura;
- visão resumida da conta, sem exposição desnecessária do conteúdo privado do
  adolescente.

### 3.4 API de aplicação

Camada autoritativa para:

- identidade, idade declarada, vínculo e consentimento;
- provas, materiais, conceitos, sessões e progresso;
- busca direta em cards e materiais;
- composição de contexto fundamentado sobre os dois corpora;
- geração, revisão, publicação e depreciação de cards;
- autorização de acesso a objetos e resultados;
- limites gratuitos, direito de uso e cobrança;
- roteamento de comandos contextuais;
- retenção, exportação e exclusão;
- emissão de eventos de domínio.

### 3.5 PostgreSQL e armazenamento de objetos

PostgreSQL é a fonte autoritativa de:

- contas, provas, materiais e permissões;
- ontologia, conceitos e arestas de grafo;
- cards, grupos, versões, linhagens e relações;
- sessões, tentativas, estado de memória do card e domínio do conceito;
- conteúdo confirmado, projeções BM25 e embeddings via `pgvector`;
- sessões, resumos e memórias gerenciadas pelo Agno;
- jobs, idempotência, outbox, eventos e auditoria.

Organizar inicialmente por schemas lógicos:

`identity`, `study`, `knowledge`, `learning`, `agent`, `billing`, `audit`.

Arquivos brutos, páginas renderizadas e áudio ficam inicialmente em um Railway
Storage Bucket privado e S3-compatible, com URLs temporárias. Conteúdo derivado
sempre aponta para o material, sua versão confirmada e o trecho de origem.
Como o Bucket não oferece hoje lifecycle configuration, object versioning e
SSE configurável pela aplicação, retenção e exclusão são jobs do domínio. Dados
brutos sensíveis exigem criptografia de aplicação antes do upload se a revisão
de segurança não obtiver evidência contratual suficiente de proteção em
repouso; se esse portão falhar, outro storage S3-compatible implementa o mesmo
adapter sem mudar o domínio.

As projeções de busca são separadas por corpus:

- `knowledge.card_search_document`: versão, enunciado, resposta, explicação,
  conceitos, relações, fontes e estado de publicação do card;
- `knowledge.material_search_document`: trecho confirmado, título, conceitos,
  página/bbox ou intervalo de tempo e material de origem.

Elas são atualizadas por eventos de domínio e consumidores idempotentes. Cards
depreciados permanecem auditáveis, mas são excluídos da recuperação padrão.
Cada projeção possui índice BM25 de `pg_textsearch`, embedding em `pgvector` e
campos de escopo necessários para filtrar antes de expor resultados.

`pgvector` e BM25 fazem parte da fundação, mas não substituem SQL. A recuperação
combina:

1. escopo e autorização por SQL;
2. filtros por prova, grupo, conceito, status, idioma e versão;
3. BM25 para termos exatos, fórmulas, aliases e vocabulário;
4. similaridade vetorial para intenção e proximidade semântica;
5. expansão controlada no grafo;
6. fusão por Reciprocal Rank Fusion ponderada;
7. reranking, deduplicação e orçamento de contexto.

Começar com busca vetorial exata no corpus pequeno. Introduzir HNSW somente após
benchmark de recall, latência e comportamento com filtros.

BM25 e vetor geram listas de candidatos em paralelo, com limites próprios. Os
scores brutos não são somados porque têm escalas diferentes; a fusão trabalha
com posições, aplica pesos conforme a intenção e preserva os componentes do
score para observabilidade. Busca por fórmula ou termo escolar favorece BM25;
pedido aproximado como “um material que fala mais ou menos disso” favorece
vetor, sem eliminar a lista lexical.

### 3.6 Fila e trabalhadores assíncronos

OCR, transcrição e geração podem exceder o tempo de uma requisição. Devem rodar
como trabalhos idempotentes, retomáveis e observáveis. O cliente acompanha um
estado estável:

`recebido → processando → precisa de revisão → pronto → falhou`

Cada transição registra motivo, versão do processador e correlação. Repetir um
trabalho não pode duplicar materiais, cards ou cobrança.

### 3.7 Serviço Tutor, Agno e gateway de modelos

O Agno é usado como runtime Python para:

- agentes com ferramentas e saída Pydantic;
- workflows determinísticos e retomáveis;
- sessões, resumos, memória e conhecimento;
- tracing e avaliações de comportamento.

| Necessidade | Primitiva |
|---|---|
| ingestão, geração e validação em etapas | `Workflow` |
| explicação, dica e pedido contextual | `Agent` tutor |
| autoria e crítica de cards em batch | agentes especializados dentro de um workflow |
| memória longitudinal não estruturada | `MemoryManager` + `PostgresDb` |
| conhecimento recuperável | ferramentas próprias de RAG e `Knowledge` escopado |

O modelo principal é DeepSeek V4 Pro (`deepseek-v4-pro`) pelo endpoint oficial
e configuração do Agno. O adaptador suporta thinking ligado ou desligado por
tarefa, preserva o contexto exigido entre tool calls e versiona modelo, esforço,
prompt e schema de saída.

Não usar a knowledge base ou memória do fornecedor de áudio como fonte de
verdade. ElevenLabs fornece capacidades de áudio; Agno e Postgres controlam
tutor, ferramentas, memória e conhecimento.

O gateway aplica limites de custo, timeouts, circuit breaker, política de
fallback, dados permitidos e logs sem conteúdo sensível por padrão.

### 3.8 Catálogo de serviços e módulos Python

| Serviço | Owns | Não owns |
|---|---|---|
| Identidade | usuário, perfil, idade, vínculo, consentimento, autorização | cards, pagamento |
| Ingestão | material, versão, job, parse/transcrição e segmentos | ontologia publicada |
| Conhecimento | ontologia, conceitos, relações, embeddings e recuperação | decisão pedagógica |
| Cards | grupos, cards, versões, relações, validação e evolução | estado individual do aluno |
| Aprendizagem | sessões, tentativas, FSRS e domínio por conceito | conteúdo do card |
| Tutor | dois modos de conversa, agentes Agno, mensagens, ferramentas, explicações, resumos e memórias | autorização e nota autoritativa |
| Cobrança | oferta, checkout, eventos de pagamento e entitlement | vínculo familiar |
| Privacidade | retenção, exportação, exclusão e prova de propagação | regras pedagógicas |

Estrutura orientativa:

```text
src/
  identity/
  ingestion/
    domain/
    application/
    adapters/liteparse.py
    adapters/elevenlabs.py
  knowledge/
    ontology/
    retrieval/
    graph/
  cards/
    generation/
    validation/
    evolution/
  learning/
    scheduling/
    mastery/
    sessions/
  tutor/
    agents/
    workflows/
    tools/
    memory/
  billing/
  privacy/
  platform/
    db/
    jobs/
    observability/
```

Cada diretório de serviço expõe uma única interface de aplicação. `adapters`
implementam seams externos; módulos de domínio não importam Agno, LiteParse,
ElevenLabs, SQLAlchemy, HTTP ou SDK de modelo.

### 3.9 API de Conhecimento e Cards e gateway de tools

Conhecimento e Cards expõem contratos consumíveis por dois caminhos:

```text
PWA / BFF / operação ───────────────┐
                                    ▼
                           API de aplicação
                     consultas + comandos tipados
                                    ▲
                                    │
Agentes Agno ── Toolkits ── clientes autenticados
                                    │
                                    ▼
                 Conhecimento / Cards / PostgreSQL
```

A API é a única porta para busca e ciclo de vida de cards. Tool não contém SQL,
não acessa repositório e não replica regra de domínio: ela adapta schema,
contexto da execução e resultado de uma operação da API para o Agno. Enquanto
os serviços estiverem no mesmo deploy, o transporte pode ser in-process; o
contrato, autorização, idempotência, tracing e auditoria permanecem idênticos
ao caminho HTTP.

Consultas mínimas:

- `search_cards(query, scope, filters, top_k)`;
- `search_materials(query, scope, filters, top_k)`;
- `retrieve_grounded_context(query, scope, corpora, budget)`;
- `get_card(card_id, version)`;
- `get_material_segment(segment_id)`.

Comandos mínimos:

- `generate_card_draft(objective, sources, constraints)`;
- `revise_card(card_id, expected_version, change_request, sources)`;
- `publish_card(card_id, expected_version)`;
- `deprecate_card(card_id, expected_version, reason, replacement_id)`.

Toda chamada recebe um `ExecutionContext` assinado com ator humano ou agente,
aluno, permissões, `run_id`, conversa/workflow e correlação. Toda mutação exige
chave de idempotência, versão esperada, motivo e fontes; passa pelas mesmas
validações determinísticas e registra auditoria. Revisar cria `CardVersion`
imutável. Depreciar muda estado e remove o card das buscas padrão, sem apagar
linhagem, tentativas ou fontes.

Os resultados de busca usam um contrato único:

```text
SearchHit {
  corpus, entity_id, version_id, status,
  title, excerpt, source_refs,
  bm25_rank, vector_rank, fused_score,
  matched_concepts, relation_path
}
```

O consumidor direto pode pedir uma busca só de cards ou materiais. O agente
pode fazer as duas consultas separadamente, comparar evidências e então pedir
`retrieve_grounded_context`, que federa os corpora e monta o contexto citado.
Nenhum resultado fora do escopo autorizado entra no conjunto de candidatos.

### 3.10 Topologia de deploy no Railway

O monorepo produz unidades de deploy separadas, mas continua com um único mapa
SOA e contratos compartilhados:

| Serviço Railway | Exposição | Processo e responsabilidade |
|---|---|---|
| `web` | domínio público | PWA e páginas públicas; artefato estático/cacheável |
| `api` | domínio público | BFF/API Python, autenticação, HTTP e streaming |
| `worker` | somente rede privada | ingestão, outbox, embeddings, geração, memória e jobs |
| `postgres-search` | somente rede privada | PostgreSQL 18, `pg_textsearch`, `pgvector`, schemas e grafo |
| `materials` | bucket privado | arquivos, áudio, páginas renderizadas e exports |
| `maintenance` | sem domínio; cron curto | retenção, reconciliação e verificações periódicas |

`api` e `worker` usam a mesma imagem de aplicação com start commands
diferentes. Os serviços lógicos de Identidade, Ingestão, Conhecimento, Cards,
Aprendizagem, Tutor, Cobrança e Privacidade são módulos dessa imagem; não
viram oito deploys no MVP.

Regras de Railway:

- somente `web` e `api` recebem domínio público;
- API, worker e banco usam DNS `*.railway.internal` e variáveis de referência;
- processos HTTP escutam o `PORT` injetado e em dual-stack;
- o navegador nunca tenta acessar domínio privado; passa pelo BFF;
- `worker` é processo contínuo; Railway Cron é usado apenas para tarefas curtas
  que terminam e toleram atraso, não para fila nem agendamento pedagógico;
- ambientes `development`, `staging` e `production` são projetos/ambientes
  isolados, com bancos, buckets, credenciais e private networks próprios;
- watch paths evitam rebuild de todos os serviços a cada mudança no monorepo;
- migrations backward-compatible rodam uma vez no pre-deploy, com advisory
  lock; falha impede promoção;
- `/health/live` verifica processo e `/health/ready` verifica dependências
  críticas; o healthcheck de deploy do Railway não substitui monitoramento
  contínuo;
- secrets ficam em Variables; nenhuma credencial entra em imagem, repositório
  ou variável pública do frontend.

O `postgres-search` não usa a imagem Postgres padrão do Railway, porque ela não
inclui as extensões exigidas. Produzir e fixar por digest uma imagem própria,
revisada e reproduzível com PostgreSQL 18, `pg_textsearch` e `pgvector`; montar
Railway Volume em `/var/lib/postgresql/data`; habilitar as extensões por
migration idempotente. Template comunitário com tag `latest` pode acelerar um
spike, mas não é artefato de produção.

Backups de volume são agendados e restauração é exercitada. Como o restore do
Railway fica no mesmo projeto/ambiente, produzir também backup lógico
criptografado para destino independente e testar recuperação limpa. Atualizar
a imagem do banco ou migrar região exige plano próprio: serviços com volume
podem ter downtime na troca.

Railway Bucket não é tratado como backup de si mesmo. Definir RPO/RTO dos
objetos e manter réplica criptografada em destino independente quando a perda
do bruto impedir a recuperação do aluno. Inventário, retenção e exclusão devem
abranger bucket e réplica; não conservar cópias além da finalidade só para
facilitar disaster recovery.

Hoje não há região Railway no Brasil. Para o beta, `us-east4-eqdc4a` é a
candidata inicial por proximidade, mas só é fixada após medir latência real a
partir do Brasil e revisar transferência internacional, suboperadores e
residência de dados. Web estática pode usar edge/CDN; API, worker, banco e
bucket permanecem co-localizados para evitar latência e transferência
desnecessárias.

---

## 4. Modelo de domínio mínimo

| Entidade | Responsabilidade |
|---|---|
| `User` | identidade técnica e estado da conta |
| `StudentProfile` | faixa etária, preferências e configuração de estudo |
| `GuardianRelationship` | vínculo, convite, autorização e estado do responsável |
| `ConsentRecord` | finalidade, versão do aviso, base/ato, data e revogação |
| `Exam` | prova, data, matérias, status e limite de oferta |
| `Material` | arquivo/áudio, tipo, proprietário, estado e retenção |
| `MaterialVersion` | conteúdo parseado/transcrito e confirmado pelo aluno |
| `SourceSegment` | página, bbox ou intervalo de tempo, texto e confiança |
| `OntologyType` | tipo permitido para nó ou relação, com schema e versão |
| `Concept` | unidade curricular canônica tipada pela ontologia |
| `ConceptRelation` | aresta entre conceitos, com tipo, fonte e confiança |
| `CardGroup` | objetivo pedagógico e agrupamento estável de cards relacionados |
| `Card` | atividade atômica, respondível e ancorada em fonte |
| `CardVersion` | conteúdo imutável de uma revisão publicada do card |
| `CardRelation` | hierarquia, variante, evolução, remediação ou subsunção |
| `StudySession` | plano ordenado de cards, começo, fim e resultado |
| `Attempt` | resposta, modalidade, avaliação, feedback e latência |
| `CardLearningState` | dificuldade, estabilidade, recuperabilidade e próxima revisão |
| `ConceptMastery` | evidência agregada de domínio por aluno e conceito |
| `ContextualRequest` | intenção, contexto, confirmação e resultado |
| `TutorConversation` | fio persistente, modo, escopo selecionado e estado |
| `TutorMessage` | mensagem, modalidade, origem, citações e uso do modelo |
| `TutorMemory` | observação longitudinal não estruturada gerenciada pelo Agno |
| `Entitlement` | prova gratuita, acesso pago e limites |
| `PaymentLink` | convite do responsável, validade, checkout e retorno |
| `ProcessingJob` | pipeline, tentativa, status, custo e erro |
| `AuditEvent` | ação sensível, ator, objeto e razão |

`StudyItem` deixa de ser o termo canônico. Onde o PRD ou o wireframe usar “item
de estudo”, a implementação deve mapear para `Card`.

### 4.1 Card, grupo e hierarquia

**Card** é a menor atividade que o aluno responde. Um card:

- trabalha um objetivo verificável;
- usa um dos três tipos do MVP;
- possui resposta e critérios de avaliação;
- cita pelo menos um `SourceSegment`;
- pertence a um `CardGroup`;
- é publicado por versão imutável.

**CardGroup** não é apenas uma pasta ou deck. Ele representa um objetivo
pedagógico estável e concentra:

- conceitos-alvo;
- prova/tema de origem;
- política de dificuldade;
- cards ativos e aposentados;
- cobertura e lacunas;
- regras de seleção do grupo.

**CardRelation** forma o grafo de cards. Tipos iniciais:

| Tipo | Semântica |
|---|---|
| `PREREQUISITE_OF` | o card origem prepara o card destino |
| `VARIANT_OF` | mesma habilidade em outra formulação ou contexto |
| `EVOLVES_FROM` | nova geração mais simples, difícil ou adequada |
| `REMEDIATES` | corrige erro/misconception exposto por outro card |
| `SUBSUMES` | evidência no card destino pode reduzir necessidade do origem |
| `SIBLING_OF` | cards paralelos sob o mesmo objetivo |

Evolução cria nova versão ou novo card; nunca sobrescreve silenciosamente o
histórico. A linhagem registra pai, geração, motivo, agente/modelo, prompt,
fontes, avaliação, estado de publicação e rollback.

### 4.2 Ontologia e grafo de conhecimento

A ontologia define o vocabulário permitido para organizar conhecimento. Tipos
de nó iniciais:

`Subject`, `Topic`, `Concept`, `Skill`, `Misconception`, `SourceSegment`,
`CardGroup`, `Card`.

Tipos de relação iniciais:

`PART_OF`, `PREREQUISITE_OF`, `APPLIES`, `EQUIVALENT_TO`, `EXEMPLIFIES`,
`CONTRADICTS`, `GROUNDED_IN`, `TARGETS`, `REMEDIATES`.

Regras:

- tipo, direção e cardinalidade são validados por schema versionado;
- toda relação derivada guarda origem, confiança e versão do extrator;
- aresta incerta não vira pré-requisito publicado sem regra ou revisão;
- conceitos equivalentes são consolidados sem perder aliases e fontes;
- ontologia curricular não se confunde com estado de aprendizagem do aluno;
- mudanças incompatíveis exigem migração e reindexação explícitas.

O Postgres guarda nós e arestas em tabelas de adjacência e oferece consultas
recursivas. NetworkX recebe somente um subgrafo autorizado e delimitado para:

- detectar ciclos indevidos em pré-requisitos;
- ordenar conceitos topologicamente;
- calcular ancestrais, descendentes e cobertura;
- propor redução transitiva;
- simular sequências de estudo.

NetworkX não é banco, cache autoritativo nem objeto global em memória.

### 4.3 Memória pedagógica

Há três camadas distintas:

1. **Estado estruturado:** tentativas, `CardLearningState`, `ConceptMastery`,
   uso de dica, latência, revisão e linhagem. Determinístico e consultável.
2. **Histórico resumido:** resumos de sessão e de conversas ancoradas em card.
3. **Memória do tutor:** observações úteis sobre preferências, formatos que
   funcionam, conceitos frágeis, misconceptions recorrentes e estilo do
   professor, gerenciadas pelo `MemoryManager` do Agno.

Usar `PostgresDb`, `user_id` e `session_id` do Agno. A extração de memória roda
em checkpoints — fim de sessão, conclusão de prova ou conversa relevante sobre
um card — e não a cada clique. Toda memória tem escopo, finalidade, origem,
confiança, data, política de retenção e possibilidade de correção/exclusão.

Memória Agno nunca altera diretamente domínio, nota, autorização, cobrança ou
`ConceptMastery`. Ela pode sugerir; um comando validado aplica a mudança.

### 4.4 Regras estruturais

- Todo `Card` publicado tem `CardGroup`, `CardVersion`, conceito-alvo e pelo
  menos um `SourceSegment`.
- Todo resultado de tutor que afirma conteúdo do material devolve citações.
- Nenhuma recuperação mistura alunos, mesmo quando conceitos são equivalentes.
- Uma tentativa falada guarda a transcrição necessária ao feedback; o áudio
  bruto segue política de retenção separada.
- Um pedido contextual sempre registra `Exam`, `StudySession` ou `Card`.
- Toda conversa registra modo `CARD` ou `GENERAL` e seu escopo de recuperação.
- Mensagem fundamentada em material guarda citações; conhecimento geral guarda
  origem explícita e não recebe citação falsa.
- Publicar `PREREQUISITE_OF` não pode introduzir ciclo no subgrafo curricular.
- Evolução preserva o card/versão anterior e permite rollback.
- Uma autorização revogada interrompe imediatamente novos tratamentos que
  dependam dela.
- Exclusão remove ou anonimiza derivados, índices e objetos, não só o usuário.

### 4.5 Interfaces principais dos serviços

| Serviço | Interface externa mínima | Resultado |
|---|---|---|
| Ingestão | `ingest_material`, `confirm_material_version` | `MaterialVersion` rastreável |
| Conhecimento | `apply_knowledge_delta`, `search_cards`, `search_materials`, `retrieve_grounded_context` | grafo, resultados ranqueados ou contexto citado |
| Cards | `draft_card_group`, `generate_card_draft`, `revise_card`, `publish_card`, `deprecate_card` | grupo, versões, estado e linhagem |
| Aprendizagem | `plan_session`, `record_attempt`, `close_session` | plano e atualização de estado |
| Tutor | `respond_in_card_context`, `respond_in_general_chat`, `classify_request` | resposta, mensagem e citações |
| Identidade | `authorize`, `link_guardian` | decisão de acesso auditável |
| Cobrança | `create_checkout`, `apply_payment_event` | entitlement idempotente |
| Privacidade | `request_deletion`, `execute_retention_policy` | relatório de propagação |

Chamadas entre serviços usam essas interfaces, não repositórios ou tabelas
internas. Eventos assíncronos usam outbox e consumidores idempotentes.

---

## 5. Fluxos técnicos críticos

### 5.1 Identidade, idade e responsável

1. Criar identidade mínima e registrar faixa etária declarada.
2. Aplicar política compatível com idade, finalidade e estado de autorização.
3. Gerar convite do responsável com token curto, de uso delimitado e expiração.
4. Registrar versão dos avisos e atos de consentimento/autorização.
5. Separar autorização de produto, comunicação e pagamento.
6. Bloquear o beta quando a combinação idade/estado não estiver autorizada.

**Saída verificável:** matriz de estados implementada, trilha de auditoria,
revogação testada e revisão jurídica concluída para o desenho do beta.

### 5.2 Entrada por foto e PDF

1. Validar tipo, tamanho, quantidade e risco do arquivo.
2. Remover metadados desnecessários e armazenar de forma privada.
3. Executar `liteparse.is_complex` ou equivalente para classificar páginas.
4. Processar com a biblioteca Python LiteParse, com OCR em `por` quando
   necessário, gerando JSON estruturado, texto/Markdown, screenshots e bbox.
5. Normalizar a saída do LiteParse para o contrato interno `ParsedMaterial`;
   nenhuma entidade de domínio recebe tipos próprios da biblioteca.
6. Criar `SourceSegment` com página, bbox, texto, confiança e versão do parser.
7. Destacar trechos incertos para correção.
8. Persistir `MaterialVersion` somente após confirmação do aluno.

LiteParse é o parser principal e local. O benchmark deve cobrir texto nativo,
foto de celular, PDF escaneado, fórmulas, tabelas, múltiplas colunas e
manuscrito. Documento complexo não autoriza conteúdo inventado: o fluxo pede
correção, outra captura ou revisão assistida.

**Saída verificável:** cada trecho pode ser rastreado até sua página/região e o
aluno consegue corrigir a extração; versão do LiteParse e opções de OCR ficam
registradas e reproduzíveis.

### 5.3 Entrada por áudio mal gravado

1. Capturar arquivo existente ou gravação dentro do app.
2. Exibir nível de entrada, duração e aviso de áudio inaudível sem impedir o
   envio.
3. Normalizar formato sem substituir o bruto; segmentar por tempo e
   voz/silêncio quando necessário.
4. Enviar ao adaptador ElevenLabs:
   - batch STT para material de aula;
   - realtime STT para resposta e pedido por voz;
   - `language_code` PT-BR/português quando suportado;
   - timestamps por palavra, diarização e keyterms de STEM quando aplicáveis.
5. Detectar segmentos vazios, sobrepostos, ruidosos ou de baixa confiança.
6. Oferecer reprodução no ponto exato e edição do trecho.
7. Confirmar a versão transcrita antes de gerar exercícios.
8. Aplicar política curta e explícita ao áudio bruto.

O serviço de Áudio expõe uma interface própria:

```text
transcribe_material(audio_ref, hints) -> TranscriptDraft
stream_student_speech(stream, context) -> TranscriptEvents
synthesize(text, voice_policy) -> AudioResult
```

A implementação inicial é ElevenLabs (`scribe_v2`/realtime onde adequado).
Orquestração, intenção, conhecimento e memória permanecem no Tutor/Agno. TTS só
entra quando uma resposta sonora for requerida e sempre possui equivalente
visual.

O sistema deve degradar com honestidade: se não conseguir entender, informa
onde falhou e pede correção, nova gravação ou outro material. Nunca inventa o
trecho ausente.

**Saída verificável:** benchmark com gravações reais de celular, ruído,
professor distante, múltiplas vozes e termos de matemática/ciências; revisão
por timestamp funciona de ponta a ponta.

### 5.4 Geração e validação de conteúdo

1. O Workflow Agno recebe somente `MaterialVersion` confirmada.
2. Extrair um `KnowledgeDelta`: conceitos, aliases, relações e fontes.
3. Validar o delta contra a ontologia e aplicar no Postgres.
4. Criar ou atualizar `CardGroup` por objetivo pedagógico.
5. O agente autor gera candidatos com DeepSeek V4 Pro em saída Pydantic.
6. Gerar os três tipos iniciais de card:
   - pergunta/resposta curta;
   - aplicação simples;
   - etapa ausente de exemplo resolvido para STEM.
7. Um estágio crítico separado valida resposta, idioma, duplicação, nível,
   conceito, relação, citação e aderência à fonte.
8. Rejeitar ou colocar em revisão cards sem suporte suficiente.
9. Exibir amostra para correção antes da primeira sessão.
10. Publicar `CardVersion` imutável e registrar linhagem, prompt, modelo,
    esforço, schema, fontes e avaliações.

O workflow usa três conjuntos de tools, liberados por função:

| Perfil Agno | Tools | Poder |
|---|---|---|
| Tutor do Card / Chat do Tutor | busca em cards, materiais e contexto; leitura de card e fonte | somente leitura |
| Agente Autor de Cards | busca + `generate_card_draft` + `revise_card` | cria rascunho ou nova versão |
| Agente de Ciclo de Vida | busca + `publish_card` + `deprecate_card` | muda estado após validação |

O agente autor decide quais buscas fazer e pode iterar entre materiais, cards
semelhantes e lacunas do grupo antes de gerar ou revisar. O agente de ciclo de
vida só recebe tools de publicação/depreciação dentro de um workflow que já
tenha produzido validações, razão e versão esperada. O tutor conversacional não
ganha permissão de escrita por receber um pedido em linguagem natural; quando
precisar de um card novo, dispara o workflow de autoria com o contexto e as
fontes recuperadas.

**Saída verificável:** conjunto de avaliação mede aderência à fonte,
correção, clareza, dificuldade e taxa de rejeição, com revisão humana em
amostras.

### 5.5 Estudo e Tutor em dois modos

1. O serviço Aprendizagem monta sessão curta por prova, pré-requisitos,
   cobertura, `ConceptMastery`, `CardLearningState` e histórico.
2. Mostrar o `Card` e aceitar texto, alternativa ou voz conforme o tipo.
3. Para voz, transcrever e permitir correção rápida antes da avaliação quando a
   confiança for baixa.
4. Avaliar a tentativa por regras e, quando necessário, modelo delimitado.
5. Mostrar feedback, explicação e fonte; registrar evento e atualizar estados.
6. Classificar ações faladas ou escritas, por exemplo:
   - repetir;
   - explicar de outro jeito;
   - dar uma dica;
   - mostrar a fonte;
   - criar uma questão parecida com o card atual;
   - pular;
   - corrigir a transcrição.
7. Pedir confirmação para ações com perda de estado ou ambiguidade.
8. Permitir pergunta livre no Tutor do Card sem perder o estado da atividade.
9. Permitir conversa persistente no Chat do Tutor com contexto selecionável.
10. Recusar resposta pronta para avaliação em andamento e pedidos incompatíveis
    com segurança.

O Tutor não recebe acesso irrestrito ao banco. Seu `TutorRetrievalToolkit`
expõe:

- `get_current_card`;
- `search_cards`;
- `search_materials`;
- `retrieve_grounded_context`;
- `get_card_lineage`;
- `get_learning_snapshot`;
- `list_available_contexts`;
- `select_conversation_context`;
- `get_conversation_summary`;
- `record_contextual_request`;
- `propose_tutor_memory`.

As tools de busca chamam a API da seção 3.9 e retornam `SearchHit`; não retornam
linhas, embeddings ou SQL. Quando o aluno pede “ache um card sobre este tema”,
o agente chama `search_cards`. Quando pede “qual material fala mais ou menos
disso”, chama `search_materials`. Para explicar, formular questão ou comparar
fontes, pode chamar ambas e depois `retrieve_grounded_context`.

O `CardAuthoringToolkit`, usado apenas no workflow de conteúdo, acrescenta:

- `generate_card_draft`;
- `revise_card`;
- `publish_card`;
- `deprecate_card`.

Agno configura toolkits por agente com allowlist explícita. Hooks de execução
injetam `ExecutionContext`, validam escopo antes da chamada, registram duração,
parâmetros não sensíveis, IDs recuperados, decisão e resultado. Tools de
mutação não são executadas em paralelo sobre o mesmo card; usam
`expected_version`, idempotência e conflito otimista.

O **Tutor do Card** monta `GroundedContext` nesta ordem de peso:

1. card atual, pergunta, tentativa e fontes;
2. `CardGroup`, linhagem e conceitos-alvo;
3. prova e materiais relacionados;
4. restante da base autorizada;
5. memórias pedagógicas relevantes.

O **Chat do Tutor** monta contexto nesta ordem:

1. escopo escolhido: tudo, prova, tema ou material;
2. últimos turnos e resumo da conversa;
3. conceitos, cards e trechos mais relevantes;
4. snapshot e memórias pedagógicas permitidas;
5. conhecimento geral do modelo, apenas quando necessário e identificado.

Nos dois modos, a recuperação executa:

1. filtros obrigatórios de aluno, autorização, status e versão;
2. candidatos BM25 com `pg_textsearch` + candidatos semânticos com `pgvector`;
3. expansão limitada por ontologia e linhagem;
4. fusão RRF ponderada conforme corpus, intenção e modo do tutor;
5. reranking, deduplicação e orçamento de tokens;
6. retorno de conteúdo com citações, IDs de fonte e trace de recuperação.

O agente não percorre todos os cards nem recebe todo o histórico bruto.
Conversas longas usam janela recente + resumo versionado. O Chat do Tutor é
aberto para perguntas, mas não é desancorado: sempre registra escopo, origem da
resposta e guardrails aplicados.

Ao fechar sessão ou em checkpoint de conversa, o workflow:

1. consolida eventos determinísticos;
2. atualiza `CardLearningState` e `ConceptMastery`;
3. gera resumo de sessão;
4. executa `MemoryManager` somente no checkpoint;
5. valida e persiste memórias permitidas.

**Saída verificável:** matriz de intenções e falhas testada com sotaques,
fala rápida, ruído, comandos ambíguos, permissão negada e navegação apenas por
teclado/leitor de tela.

### 5.6 Domínio, evolução e agendamento

Começar com um algoritmo explicável:

- erro reduz domínio e antecipa revisão;
- acerto com ajuda vale menos que acerto autônomo;
- acerto repetido espaça o card;
- urgência da prova aumenta prioridade sem apagar lacunas;
- cards novos competem com revisões sob limites explícitos;
- pré-requisitos bloqueiam apenas quando há evidência suficiente;
- acerto em card que `SUBSUMES` outro pode reduzir revisão redundante;
- erro recorrente pode propor card `REMEDIATES` ou variante mais simples.

FSRS é a política inicial do `CardLearningState`; `ConceptMastery` agrega
evidências por conceito. Evolução roda de forma assíncrona e apenas propõe novas
versões/relações. Publicação exige as mesmas validações da geração inicial.
NetworkX pode ordenar o subgrafo de pré-requisitos e calcular cobertura, mas a
decisão final usa dados persistidos e regras explicáveis.

**Saída verificável:** simulações determinísticas, testes de propriedade e
explicação visível de “por que este card apareceu”.

### 5.7 Oferta, paywall e responsável

1. Conceder uma prova gratuita, com até três materiais, sem cartão.
2. Manter a revisão da primeira prova acessível após o limite.
3. Ao criar a segunda prova, explicar o limite antes do bloqueio.
4. Gerar link de responsável associado à oferta e com expiração.
5. Exibir preço, periodicidade, cancelamento e política de dados antes do
   checkout.
6. Receber eventos de pagamento de forma idempotente.
7. Atualizar `Entitlement` sem depender do redirecionamento do navegador.
8. Tratar falha, abandono, estorno e cancelamento.

**Saída verificável:** testes de contrato do provedor, replay de webhook,
checkout interrompido, duplicação e reconciliação.

### 5.8 Retenção, direitos e exclusão

1. Inventariar dados por finalidade e proprietário.
2. Definir retenção separada para arquivo bruto, áudio, transcrição, derivados,
   analytics e auditoria.
3. Oferecer exclusão no produto e canal assistido.
4. Propagar exclusão a objetos, derivados, índices, caches e fornecedores.
5. Comprovar conclusão ou registrar exceção legal.
6. Permitir revogação e atualização de avisos sem consentimento obscuro.

**Saída verificável:** teste automatizado de exclusão integral e relatório de
propagação por sistema.

---

## 6. Macroetapas de execução

### Fase 0 — Portões de produto, jurídico e qualidade

**Objetivo:** impedir que decisões irreversíveis sejam embutidas no código.

Entregáveis:

- matriz de idade, identidade, responsável, autorização e pagamento;
- registro das finalidades, dados, retenção e fornecedores;
- avaliação de impacto/risco adequada ao beta com menores;
- mapa SOA com ownership, contratos, comandos, consultas e eventos;
- schemas Pydantic de `ParsedMaterial`, `KnowledgeDelta`, `CardDraft`,
  `GroundedContext`, `TutorResponse` e eventos de aprendizagem;
- contratos internos de LiteParse, ElevenLabs, DeepSeek/Agno, pagamento e
  analytics;
- topologia Railway, região, transferência internacional, plano e orçamento;
- Dockerfiles/start commands, imagem pinada do PostgreSQL e matriz de extensões;
- ontologia v1 com tipos, relações, cardinalidade e política de versionamento;
- corpus de avaliação com foto, PDF e áudio realista em PT-BR;
- orçamento de latência e custo por prova;
- eventos e métricas do PRD;
- tokens de design sincronizados e fluxos críticos aprovados.

**Critério de saída:** riscos jurídicos e operacionais têm dono; contratos
impedem acesso cruzado a tabelas; corpus e métricas permitem validar as
tecnologias escolhidas.

### Fase 1 — Fundação e primeira fatia vertical

**Objetivo:** provar o núcleo do produto com um caminho estreito e observável.

Entregáveis:

- ambientes Railway, CI/CD, Variables, feature flags e migrações pre-deploy;
- serviços `web`, `api`, `worker`, `postgres-search`, `materials` e
  `maintenance` com rede/exposição corretas;
- estrutura Python por serviços e módulos, sem dependência circular;
- PWA instalável com câmera/microfone e política segura de cache;
- imagem pinada PostgreSQL 18 com volume, schemas, outbox, `pg_textsearch`,
  pgvector, backup e migrações;
- identidade mínima e política de acesso;
- prova, material, versão, segmento, conceito, grupo, card, sessão e tentativa;
- upload privado de uma página/imagem;
- LiteParse, correção, geração de poucos cards e sessão curta;
- feedback com fonte;
- tracing do Agno, logs, correlação e painel operacional básico.

**Critério de saída:** um usuário de teste conclui o fluxo ponta a ponta sem
edição manual de banco; uma falha pode ser localizada por correlação.

### Fase 2 — Ingestão multimodal obrigatória

**Objetivo:** cumprir o contrato de entrada do MVP.

Entregáveis:

- múltiplas imagens e PDF, respeitando o limite de três materiais;
- LiteParse Python pinado, OCR PT-BR, bbox, screenshots e detecção de
  complexidade;
- gravação e upload de áudio;
- adaptador ElevenLabs para batch e realtime STT;
- normalização, PT-BR, timestamps, diarização, keyterms e confiança;
- revisão sincronizada entre áudio e transcrição;
- tratamento de ruído, permissão, interrupção, retomada e reprocessamento;
- controles de retenção e exclusão dos brutos.

**Critério de saída:** foto, PDF e áudio chegam à mesma camada de
`SourceSegment`; nenhum tipo de entrada é um protótipo separado. O MVP não
avança ao beta sem áudio funcional.

### Fase 3 — Loop de aprendizagem e voz

**Objetivo:** entregar sessões úteis, adaptativas e acessíveis.

Entregáveis:

- pergunta/resposta curta, aplicação simples e etapa ausente de exemplo
  resolvido;
- ontologia, grafo de conceitos e grafo de cards persistidos no Postgres;
- `CardGroup`, versões, linhagem e workflow de evolução;
- projeções separadas e APIs diretas para busca de cards e materiais;
- RAG híbrido com filtro SQL, BM25, pgvector, expansão de grafo e citações;
- toolkits Agno de recuperação, autoria e ciclo de vida de cards;
- seleção por prova, pré-requisito, conceito e domínio;
- resposta por texto e voz;
- feedback, dica, fonte e explicação alternativa;
- Tutor Agno com ferramentas escopadas e DeepSeek V4 Pro;
- Tutor do Card com o card, a pergunta, a tentativa e a fonte atual como
  contexto de maior peso;
- Chat do Tutor com histórico persistente, seleção de escopo e acesso ao
  conhecimento autorizado do aluno;
- `PostgresDb`, resumo de sessão e `MemoryManager` em checkpoints;
- roteador de intenções faladas/escritas;
- FSRS por card e domínio por conceito;
- acessibilidade e estados do design system.

**Critério de saída:** sessões completas e os dois modos do tutor funcionam por
texto e voz; o Tutor do Card preserva o contexto da atividade e o Chat do Tutor
retoma uma conversa com seu escopo e histórico.

### Fase 4 — Conversão e jornada do responsável

**Objetivo:** validar disposição a pagar sem quebrar confiança.

Entregáveis:

- limite da primeira prova e paywall na segunda;
- link seguro do responsável;
- páginas de oferta, privacidade e suporte;
- checkout, webhooks, entitlement, cancelamento e reconciliação;
- métricas de convite, abertura, checkout e ativação.

**Critério de saída:** jornada gratuita continua íntegra; cobrança é
idempotente, clara e reversível; acesso não depende só do cliente.

### Fase 5 — Hardening e beta controlado

**Objetivo:** tornar o produto operável com usuários reais.

Entregáveis:

- suíte de regressão funcional e de IA;
- testes de segurança, abuso, carga e acessibilidade;
- alertas, runbooks, suporte e fila de revisão operacional;
- exclusão integral e resposta a incidentes;
- limites de custo, backpressure e fallback;
- rollout por feature flag e coorte.

**Critério de saída:** todos os critérios do PRD e da seção 12 deste documento
possuem evidência; erros conhecidos têm mitigação e dono.

### Fase 6 — Aprendizado pós-beta

Somente depois de dados confiáveis:

- recalibrar agenda e domínio;
- decidir expansão além de STEM;
- avaliar automações de suporte e novos tipos de card;
- testar preço e plano anual;
- avaliar pesquisa web controlada e novas ferramentas do tutor, sempre com
  origem explícita e autorização;
- priorizar integrações institucionais ou colaboração.

Esta fase não pode ser usada para empurrar áudio, voz, fonte, correção ou
privacidade para “depois”.

---

## 7. Spikes de configuração e limites

Os componentes da seção 1.1 estão escolhidos. Os spikes não reabrem a stack;
eles determinam configuração, limites, fallback e critérios de operação.

| Área fixada | O spike deve provar |
|---|---|
| Railway | monorepo, start commands, private network, healthchecks, Variables, pre-deploy, região, custo e rollback |
| Imagem PostgreSQL | build pinado, `shared_preload_libraries`, extensões, volume, upgrade, backup e restore |
| Railway Bucket | upload assinado, CORS, exclusão, retenção, criptografia, região e alternativa S3-compatible |
| PWA | câmera/microfone, instalação, acessibilidade e retomada em Safari/iOS e Chrome/Android |
| LiteParse | configuração para PT-BR, estrutura, matemática, tabelas, manuscrito, scans, latência e necessidade de correção |
| ElevenLabs | batch/realtime, ruído, sotaques, múltiplas vozes, timestamps, termos STEM, retenção e custo |
| Agno + DeepSeek V4 Pro | structured output, tool calls, thinking, latência, custo, cancelamento e tracing |
| Memória Agno | precisão, custo e retenção de extração somente em checkpoints |
| Ontologia | cobertura inicial, aliases, ciclos, relações incertas e migração de versão |
| BM25 no Postgres | instalação de `pg_textsearch`, PostgreSQL 17/18, configuração PT-BR, filtros, índice, backup, restore e suporte do provedor |
| RAG no Postgres | recall@k, citação correta, isolamento por aluno, BM25 + vetor + grafo, RRF e latência |
| API e tools de Cards | paridade entre consumo direto e Agno, allowlists, idempotência, conflito de versão, auditoria e depreciação |
| NetworkX | tamanho máximo do subgrafo, ciclo, ordenação e custo de materialização |
| Avaliação de resposta falada | tolerância semântica sem aceitar erro conceitual |
| Pagamento | checkout para responsável, Pix/cartão, webhooks, estorno e assinatura |
| Analytics | governança de dados de menores, consentimento e minimização |
| Retenção de áudio | necessidade operacional versus risco e custo |

Falhar um spike não autoriza troca silenciosa. O resultado deve indicar:
ajuste, restrição explícita, fallback atrás da mesma interface ou ADR para
revisão da decisão.

---

## 8. Segurança, privacidade e proteção de menores

Antes do beta:

- modelar ameaças para upload, links do responsável, autorização e pagamento;
- validar arquivos por conteúdo, não só extensão;
- usar criptografia em trânsito e repouso, isolamento por usuário e URLs
  temporárias;
- limitar tentativas, duração, tamanho e custo;
- impedir enumeração de contas e reutilização de convite;
- autenticar chamadas entre serviços e propagar identidade/escopo sem confiar
  em IDs enviados pelo cliente;
- aplicar isolamento por aluno também em BM25, pgvector, cache e ferramentas do
  agente; considerar RLS como defesa adicional, não única;
- manter logs de auditoria para atos sensíveis;
- não inserir materiais, áudios ou respostas em treino de terceiros por padrão;
- revisar contratos, localização, suboperadores e exclusão de fornecedores;
- configurar retenção de áudio/transcrição na ElevenLabs e comprovar exclusão;
- impedir que memórias Agno capturem segredo, dado desnecessário, diagnóstico
  inferido ou conteúdo integral do material;
- configurar privacidade mais protetiva por padrão;
- oferecer denúncia, suporte e resposta a incidente adequados à faixa etária;
- testar prompt injection contido nos materiais e respostas inseguras.

O desenho deve passar por revisão jurídica brasileira antes do beta. Como base
de trabalho, a LGPD exige atenção especial ao melhor interesse no tratamento de
dados de crianças e adolescentes, e a Lei nº 15.211/2025 acrescenta obrigações
específicas para produtos digitais acessíveis a esse público. Este documento
não substitui parecer jurídico.

---

## 9. Observabilidade, métricas e orçamento

### 9.1 Correlação

Toda jornada recebe identificadores de:

`request → exam → material → material version → job → source segment →
concept → card group → card/version → session → attempt → agent run`

Logs operacionais evitam conteúdo bruto; acesso excepcional é auditado.

### 9.2 Métricas técnicas mínimas

- sucesso e duração de upload por tipo;
- fila, tentativas e falhas por pipeline;
- tempo até transcrição e tempo até cards;
- percentual de LiteParse/STT marcado e corrigido;
- taxa de card rejeitado, editado, evoluído e revertido;
- precisão de citações, recall do RAG e contribuição BM25/vetor por estratégia;
- latência, zero-result e distribuição de uso de `search_cards` e
  `search_materials`;
- sucesso, conflito, rejeição e auditoria das tools de mutação de card;
- tamanho de contexto, chamadas de ferramenta e tokens por execução Agno;
- memórias propostas, aceitas, corrigidas, expiradas e excluídas;
- ciclos/relações inválidas e cobertura da ontologia;
- latência por serviço e evento pendente na outbox;
- latência de feedback e pedido por voz;
- falha por fornecedor/modelo/versão;
- custo por material, prova e aluno ativo;
- conclusão da exclusão;
- erro de pagamento e divergência de entitlement.

### 9.3 Orçamentos iniciais

Durante a Fase 0, definir e aprovar:

- tamanho e duração máximos por material;
- tempo-alvo e tempo-limite por estágio;
- custo máximo da primeira prova gratuita;
- disponibilidade necessária para estudo e checkout;
- erro tolerado antes de fallback ou pausa do rollout.

Os valores não devem ser inventados no documento; serão derivados de benchmark
e economia da oferta.

---

## 10. Estratégia de testes

### 10.1 Testes determinísticos

- unidade para regras de domínio, limites, autorização e roteamento;
- testes das interfaces externas de cada serviço;
- integração para Postgres, `pg_textsearch`, pgvector, objetos, fila, outbox e
  adaptadores;
- contrato para LiteParse, ElevenLabs, Agno/DeepSeek e pagamento;
- propriedades do grafo: direção válida, ausência de ciclo em pré-requisitos,
  linhagem preservada e rollback;
- isolamento de RAG por aluno, prova e permissão;
- contrato idêntico para API direta e tool Agno em busca, erro e autorização;
- propriedade das mutações de card: idempotência, versão esperada, linhagem,
  depreciação sem exclusão e impossibilidade de publicar sem validação;
- migração e compatibilidade de ontologia, Pydantic e eventos;
- ponta a ponta para todos os caminhos do wireframe;
- propriedade/idempotência para reprocessamento e webhooks;
- integração de deploy no Railway para private DNS, Variables, migração,
  healthcheck, worker contínuo e cron terminável;
- restauração do volume Postgres e recuperação por backup lógico independente;
- acessibilidade automatizada e manual.

### 10.2 Avaliação de IA

Manter conjuntos versionados e não contaminados para:

- OCR de slide, caderno, lista e PDF;
- áudio limpo, distante, ruidoso, interrompido e com termos STEM;
- geração aderente e não aderente à fonte;
- recuperação com citação correta e “nenhuma resposta” quando falta suporte;
- respostas corretas, parcialmente corretas e conceitualmente erradas;
- pedidos contextuais válidos, ambíguos, fora do escopo e adversariais.

Cada mudança de modelo, prompt, ferramenta, ontologia, estratégia de retrieval
ou schema roda avaliação antes do rollout. Métricas automáticas não substituem
amostragem humana.

### 10.3 Testes com pessoas

Beta moderado e consentido deve observar:

- compreensão do que enviar;
- capacidade de corrigir transcrição;
- confiança na fonte;
- uso de voz em ambiente real;
- confusão entre ajuda e resposta pronta;
- clareza do limite gratuito e da jornada do responsável;
- acessibilidade e sobrecarga cognitiva.

---

## 11. Operação e entrega

- Railway é a plataforma canônica de deploy;
- `railway.toml` ou `railway.json` e Dockerfiles ficam versionados no
  repositório; configuração manual relevante deve ser refletida em código;
- ambientes Railway separados, infraestrutura reproduzível e migração
  reversível;
- catálogo de serviços com owner, contrato, SLO e dependências;
- monorepo com imagens compartilhadas e processos `web`, `api`, `worker` e
  `maintenance`, preservando isolamento lógico;
- extração para deploy independente somente com ADR e evidência operacional;
- compatibilidade retroativa de eventos durante rollout;
- outbox monitorada, consumidor idempotente e dead-letter recuperável;
- dados sintéticos fora de produção;
- feature flags por coorte e capacidade;
- rollout canário de modelo, prompt, ontologia, retrieval e adaptadores;
- fila de reprocessamento e compensação;
- dashboards para produto, custo e saúde;
- alertas com runbooks e responsável;
- backup de volume, backup lógico externo, restauração e teste periódico;
- monitoramento contínuo externo aos healthchecks de promoção do Railway;
- alertas para volume, conexões, índice BM25, fila, worker e cron ignorado;
- imagem de banco fixada por digest e janela explícita para upgrade;
- nenhum TCP proxy público para Postgres em produção, salvo manutenção
  temporária, auditada e removida ao final;
- inventário de dependências e atualização de segurança;
- canal de suporte ligado ao identificador de correlação, sem pedir ao usuário
  que envie material sensível novamente.

---

## 12. Critérios técnicos de saída do MVP

O MVP está pronto para beta apenas quando:

1. foto, PDF e áudio entram, podem ser revisados e produzem fontes rastreáveis;
2. áudio ruim falha de modo localizado e corrigível;
3. o aluno responde por texto e voz;
4. Tutor do Card e Chat do Tutor funcionam por texto e voz, com histórico e
   escopo coerentes;
5. o Tutor do Card prioriza atividade, tentativa e fonte atuais sem impedir
   recuperação de outro conteúdo autorizado;
6. o Chat do Tutor retoma conversas, permite escolher o escopo e distingue
   conteúdo fundamentado nos materiais de conhecimento geral do modelo;
7. os três tipos de card passam pelo conjunto de avaliação;
8. sessão, feedback, fonte e agendamento funcionam de ponta a ponta;
9. LiteParse produz `MaterialVersion` corrigível com bbox/página reproduzível;
10. ElevenLabs passa o benchmark batch/realtime de PT-BR e áudio ruidoso;
11. ontologia rejeita relações inválidas e ciclo de pré-requisito;
12. `CardGroup`, linhagem, evolução, depreciação e rollback são auditáveis;
13. `search_cards` e `search_materials` retornam resultados úteis e isolados
    tanto pela API direta quanto por tools Agno;
14. BM25 com `pg_textsearch` e vetor com `pgvector` passam o benchmark separado
    e combinado por RRF;
15. RAG no Postgres retorna contexto isolado e citado dentro do orçamento;
16. tools geram, revisam, publicam e depreciam cards sem contornar autorização,
    validação, versionamento ou auditoria;
17. Agno + DeepSeek V4 Pro executam tools/structured output com tracing;
18. checkpoint de memória não altera estado pedagógico sem comando validado;
19. uma prova gratuita e o bloqueio da segunda respeitam o PRD;
20. responsável, autorização e pagamento passam pela matriz aprovada;
21. exclusão propaga a Postgres, objetos, índices, Agno e ElevenLabs;
22. acessibilidade crítica é validada manualmente na PWA;
23. latência, erro e custo estão dentro dos orçamentos definidos;
24. segurança, privacidade, jurídico e operação registram aceite para a coorte;
25. métricas do funil e qualidade chegam aos painéis sem conteúdo sensível;
26. rollback de aplicação, modelo, prompt, ontologia e adaptador foi exercitado;
27. o ambiente de produção Railway é reproduzível, usa somente API/web públicos,
    restaura banco e objetos, mantém workers ativos e possui monitoramento
    contínuo;
28. região, transferência internacional e proteção dos arquivos no storage
    receberam aceite jurídico e de segurança para o beta brasileiro.

---

## 13. Contrato para decomposição por agentes

Cada macroetapa deve virar um epic com o seguinte cabeçalho:

```text
Objetivo de produto:
Resultado observável:
Dentro do escopo:
Fora do escopo:
Dependências:
Contratos afetados:
Dados e migrações:
Riscos de privacidade/segurança:
Estados de UX:
Telemetria:
Critérios de aceite:
Testes obrigatórios:
Plano de rollout e rollback:
Evidências para concluir:
```

Depois, as tarefas devem:

- ter um único resultado verificável;
- declarar arquivos/módulos sob responsabilidade;
- apontar o requisito e a tela correspondentes;
- separar mudança de contrato, migração, implementação e teste quando houver
  dependência;
- não reabrir tecnologia fixada sem resultado de spike e ADR;
- nomear o serviço SOA e a interface externa afetada;
- impedir acesso direto a tabela privada de outro serviço;
- incluir estados de erro e acessibilidade, não só caminho feliz;
- terminar com comando ou evidência de verificação;
- impedir que dois agentes editem o mesmo contrato compartilhado sem
  coordenação.

### 13.1 Ordem recomendada para a decomposição

1. decisões e contratos da Fase 0;
2. fundação transversal;
3. contratos SOA, schemas Pydantic e outbox;
4. fatia vertical mínima;
5. ingestão LiteParse de foto/PDF;
6. ingestão ElevenLabs de áudio e revisão;
7. ontologia, conceitos e relações;
8. grupos, cards, versões, validação e evolução;
9. projeções BM25, API de busca e RAG híbrido no Postgres;
10. APIs e toolkits de autoria e ciclo de vida de cards;
11. Tutor Agno, DeepSeek V4 Pro e memória;
12. estudo, voz, domínio e agendamento;
13. responsável, oferta e pagamento;
14. hardening, operação e beta.

Essa ordem expressa dependências de implementação; não reduz o escopo do MVP.
Em particular, áudio e voz são requisitos de saída, não melhorias posteriores.

---

## 14. Referências oficiais

### 14.1 Tecnologia

- [LiteParse — repositório oficial](https://github.com/run-llama/liteparse)
- [Agno SDK — introdução](https://docs.agno.com/sdk/introduction)
- [Agno `PostgresDb`](https://docs.agno.com/reference/storage/postgres)
- [Agno — memória de agente](https://docs.agno.com/memory/agent/overview)
- [Agno — conhecimento e Agentic RAG](https://docs.agno.com/knowledge/agents/overview)
- [Agno — tools e toolkits](https://docs.agno.com/tools/overview)
- [DeepSeek — modelos e identificadores](https://api-docs.deepseek.com/quick_start/pricing)
- [ElevenLabs — Speech to Text](https://elevenlabs.io/docs/overview/capabilities/speech-to-text)
- [`pg_textsearch` — BM25 no PostgreSQL](https://github.com/timescale/pg_textsearch)
- [ParadeDB `pg_search` — alternativa BM25](https://docs.paradedb.com/documentation/full-text/overview)
- [pgvector — busca vetorial e híbrida no Postgres](https://github.com/pgvector/pgvector)
- [PostgreSQL — consultas recursivas](https://www.postgresql.org/docs/current/queries-with.html)
- [NetworkX — algoritmos de DAG](https://networkx.org/documentation/stable/reference/algorithms/dag.html)
- [Railway — deploy de monorepo](https://docs.railway.com/deployments/monorepo)
- [Railway — private networking](https://docs.railway.com/private-networking)
- [Railway — PostgreSQL e extensões](https://docs.railway.com/databases/postgresql)
- [Railway — Storage Buckets](https://docs.railway.com/storage-buckets)
- [Railway — pre-deploy](https://docs.railway.com/deployments/pre-deploy-command)
- [Railway — healthchecks](https://docs.railway.com/deployments/healthchecks)
- [Railway — backups de volume](https://docs.railway.com/volumes/backups)
- [Railway — regiões](https://docs.railway.com/deployments/regions)

### 14.2 Normas e proteção de menores

- [Lei Geral de Proteção de Dados Pessoais — Lei nº
  13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Estatuto Digital da Criança e do Adolescente — Lei nº
  15.211/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm)
- [Enunciado da ANPD sobre tratamento de dados de crianças e
  adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes)
