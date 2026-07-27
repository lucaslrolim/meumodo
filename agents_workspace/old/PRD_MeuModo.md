# PRD — Meu Modo

**Tutor individual de IA que transforma o material do próprio aluno em um sistema de estudo adaptativo baseado em flashcards evolutivos.**

Versão 0.4 · 26/07/2026 · Autor: Lucas Rolim (com refinamento de PM/edtech)

> **v0.4:** entidades Prova e Tema modeladas como domínio de primeira classe; OCR via Liteparse com etapa de edição pelo aluno; fluxo de falha na prova com ação de recuperação gratuita e trial estendido; task list para AI agents na Estratégia Final; aquisição via TikTok Ads + conteúdo viralizável do próprio app.

---

## 1. Visão e tese

Todo aluno do ensino básico recebe o mesmo material — a mesma aula para 40 pessoas, o mesmo vídeo para centenas de milhares, o mesmo livro escrito para outra época. Nenhum desses artefatos considera **como aquele aluno específico aprende**. Para alunos com TDAH ou dificuldades de atenção, esse descompasso é ainda mais cruel: a sensação de que "tem algo errado comigo" quando, na verdade, o formato é que está errado para eles.

**Tese do Meu Modo:** o material que o aluno já tem (aula gravada, slides, listas de exercícios) é a matéria-prima certa — o que falta é um motor que o converta em prática individualizada, espaçada e adaptativa. A ciência de aprendizagem já sabe o que funciona (retrieval practice, espaçamento, feedback imediato, mastery learning); a IA generativa finalmente torna viável aplicar isso ao material de *cada* aluno, e não a um currículo genérico.

**O apelo "focado na SUA prova" (lição do Responde Aí):** o Responde Aí construiu um negócio no ensino superior com a promessa "estude mais rápido e mande bem na prova" — resumos e exercícios resolvidos *focados na prova da sua faculdade*. O insight transposto para o básico: o aluno pode até achar um professor online que explica do jeito que ele gosta, mas esse professor **não sabe o que vai cair na prova dele**, nem como o professor dele explicou e gosta de cobrar. O material do próprio aluno carrega exatamente essa informação. O Meu Modo une as duas pontas: estuda **do jeito dele** E **focado no que vai cair de verdade**. É essa segunda ponta que dá urgência de compra — "aprender melhor" é abstrato; "passar na prova de quinta" é concreto.

**O que o Meu Modo NÃO é:** não é mais um banco de questões genérico, não é um chatbot de dúvidas, não é um resumidor de aulas. É um **tutor de memória e domínio**: ele decide o que você pratica, quando pratica e em que nível de dificuldade, e evolui junto com você.

### Por que agora

- RCTs recentes de tutoria por LLM em escala (MathMentor-GPT, 62 escolas, 14.892 alunos) mostram ganho de **+0,27 DP** em matemática, com efeito maior justamente para alunos de menor desempenho (**+0,41 DP**) — evidência de que IA bem desenhada funciona melhor para quem mais precisa.
- O algoritmo FSRS (open source, integrado ao Anki desde 2023) tornou o agendamento de revisão personalizável por aluno via dados, superando o SM-2 clássico em eficiência.
- Geração de flashcards por LLM atingiu qualidade comparável à humana quando restrita ao material-fonte e validada — o gargalo virou design de produto, não capacidade do modelo.
- O mercado edtech brasileiro é o maior da América Latina (~68% das 898 edtechs ativas da região), mas as plataformas adaptativas existentes (ex.: Geekie) são B2B2C via escola e centradas em currículo — nenhuma é centrada no material do aluno nem no nicho de atenção/TDAH.

---

## 2. O problema

### 2.1 A dor do aluno

| Situação hoje | Por que falha |
|---|---|
| Aula presencial / gravada | Feita para dezenas; ritmo único; sem prática ativa depois |
| Videoaula da internet | Feita para centenas de milhares; passiva; ilusão de competência ("assisti, logo aprendi") |
| Livro didático | Escrito anos atrás, para outra realidade; leitura passiva é a estratégia de menor utilidade comprovada |
| Slides do professor | Resumo do que foi dito, não instrumento de prática; releitura e marcação têm ganho mínimo |
| Reler / grifar / resumir sem guia | Classificadas como técnicas de baixa utilidade na literatura (Dunlosky et al.) |

O aluno com TDAH soma a isso: dificuldade de sustentar foco em sessões longas, sobrecarga com filas grandes de conteúdo, procrastinação por falta de ponto de início claro, e baixa tolerância a feedback demorado.

### 2.2 O que a ciência diz que funciona (e quase ninguém entrega)

Com base nos quatro levantamentos de evidência do workspace (`research_results/`):

1. **Retrieval practice (prática de recuperação)** — evidência forte; efeitos médios-grandes vs. reestudo em 200+ estudos; funciona do fundamental ao superior.
2. **Espaçamento + recuperação ("spaced retrieval")** — evidência forte; g ≈ 0,74 vs. prática massificada; o intervalo ótimo escala com o horizonte de retenção.
3. **Feedback imediato e explicativo** — evidência forte; recuperação sem feedback tem ganho bem menor.
4. **Mastery learning** — evidência forte; ES ≈ 0,67 com efeitos maiores para alunos de menor desempenho (d ≈ 0,96) — exatamente o público-alvo.
5. **Um conceito por card, resposta curta, recuperação ativa** — evidência moderada; princípios de design de card bem estabelecidos.
6. **Sessões curtas e microlearning para TDAH** — consenso + evidência moderada; tarefas breves, variadas, com feedback frequente e metas de baixo risco.
7. **Gamificação** — evidência pequena-moderada para motivação (g ≈ 0,26 em motivação intrínseca; efeitos maiores em autonomia/pertencimento); RCT de 8 semanas com 80 crianças com TDAH mostrou ganhos de atenção sustentada e desempenho com app gamificado.
8. **Evolução de dificuldade / dificuldades desejáveis** — evidência forte para o princípio (esforço na medida certa consolida mais), emergente para a implementação algorítmica fina.

**Gap honesto:** evidência direta de "flashcards + TDAH" é escassa (a literatura aponta isso explicitamente). Nossa aposta é a combinação de mecanismos individualmente comprovados, adaptados às recomendações para TDAH — e mediremos os resultados nós mesmos (ver §10).

---

## 3. Público e posicionamento

### 3.1 ICP do MVP

**Persona primária:** aluno de Fundamental II / Ensino Médio (12–17 anos) com TDAH diagnosticado ou dificuldades de atenção autopercebidas, estudando **matérias de ciências (matemática, física, química)** — mas o produto atende qualquer matéria desde o dia 1 (a ingestão e geração de cards são agnósticas de disciplina; o foco de ciências guia priorização de qualidade, prompts e validação).

**Decisor de uso vs. decisor de compra:** o **aluno é o decisor de uso** (engaja, sente valor, quer continuar) e o **pai é o decisor de compra** — mas o fluxo pode nascer de qualquer ponta. Dois caminhos que o produto precisa suportar bem:

1. *Pai inicia*: pai descobre o produto ("meu filho não consegue estudar"), assina e traz o filho. Relatório para pais é feature de retenção do pagante.
2. *Aluno inicia* (provável dominante no growth viral): aluno vê no TikTok, usa grátis, bate no paywall e precisa de **um jeito trivial de pedir ao pai** — link de pagamento compartilhável (Pix/cartão) que o aluno manda no WhatsApp com uma tela que mostra ao pai o que o filho já fez no app ("Lucas estudou 4 sessões essa semana e consolidou 6 conceitos de física — R$ X/mês para continuar"). O momento do pedido é também o momento de provar valor ao pagante.

**Persona secundária (fase 2):** professor que sobe material da turma (canal B2B2C via escola — melhor distribuição, produto mais complexo; fica fora do MVP mas a modelagem de dados já prevê escopo professor/aluno).

### 3.2 Posicionamento

> Para o estudante que sente que "estudar não funciona do jeito que é", o Meu Modo é o tutor de IA que transforma o material dele em prática diária de 10–15 minutos, do jeito dele e **focado no que vai cair na prova dele** — diferente de bancos de questões e videoaulas genéricas, ele aprende com cada acerto e erro do aluno e evolui os exercícios como um professor particular evoluiria.

**Posicionamento de nicho (TDAH):** o produto é desenhado para quem não consegue focar, para quem "aprender não funciona do jeito tradicional". O design, a carga cognitiva, o tom e as sessões curtas são pensados para o perfil de atenção difusa — mas **o site e a comunicação com o aluno nunca mencionam TDAH**. A comunicação fala de "estudar do seu jeito", "para quem nunca se encaixou no método tradicional". A palavra TDAH aparece apenas em materiais para pais e em conteúdo de fundo (blog, comunidade), onde o termo tem valor de busca e identificação. O produto não diagnostica, não trata e não se posiciona como clínico — é um produto de estudo que funciona especialmente bem para quem tem dificuldade de atenção.

### 3.3 Concorrência e alternativas

| Alternativa | Limite |
|---|---|
| Anki puro | Fricção altíssima de criação de cards; UX hostil para adolescente; sem tutor, sem adaptação de conteúdo |
| Duolingo | Referência de engajamento, mas conteúdo próprio e fixo; não usa o material do aluno |
| Geekie / adaptativas BR | Centradas no currículo e vendidas à escola; não partem do material do aluno; sem foco TDAH |
| **Teachy** (ver §3.4) | Vendida à escola, alinhada à BNCC (currículo genérico, não o material do professor dele); tutor conversacional + gamificação de XP/ranking; sem motor de memória espaçada nem evolução de cards |
| Photomath / chatbots de dúvida | Resolvem a tarefa, não constroem retenção; risco de terceirizar o pensamento |
| Professor particular | R$ 80–200/h; não escala; qualidade variável |

Diferencial defensável ao longo do tempo: **a memória longitudinal do aluno** (histórico de erros, conceitos frágeis, formatos que funcionam para ele) + **o grafo de evolução de cards** — dados proprietários que melhoram o produto a cada interação e têm alto custo de troca.

### 3.4 Estudo de caso: Teachy (o concorrente mais próximo)

A Teachy é a referência brasileira mais adjacente ao que queremos: tutor de IA pedagógico + gamificação + reforço escolar, com ecossistema completo (professor, escola, aluno, família).

**O que eles fazem bem e devemos copiar (adaptado):**

- **Diagnóstico de comunicação afiado**: *"Existe uma diferença entre ter acesso à informação e aprender. Qualquer um consegue pesquisar no Google, colar no ChatGPT ou assistir um vídeo. O problema é que nenhuma dessas ferramentas sabe se o aluno entendeu."* É exatamente o nosso argumento, muito bem escrito — vale mirar esse nível de clareza no nosso copy.
- **Controle de complexidade pelo aluno**: "simplifique ou expanda" sob demanda. **Adotar no chat ancorado no card** — botões explícitos de "explica mais simples" / "vai mais fundo", em vez de esperar que o aluno saiba pedir. Para TDAH, reduzir o custo de formular o pedido é meia batalha.
- **Checagem de entendimento entre etapas**: a IA pergunta antes de avançar. É retrieval practice embutida na explicação — coerente com nossa tese e barato de implementar dentro do chat do card.
- **Guardrails pedagógicos explícitos**: "sem respostas que incentivem cola ou plágio", sem conteúdo fora de contexto. **Adotar como requisito do chat do card** — nosso tutor explica, não entrega resposta de dever de casa. Isso protege o produto de virar máquina de colar (risco reputacional sério com pais e escolas).
- **Visibilidade para a família** como feature de primeira classe — confirma nossa aposta no relatório para pais.
- **Variedade de formatos** (flashcards, mapas mentais, quizzes, simulados) para dar ao aluno o formato que ele gosta.

**Onde discordamos deliberadamente:**

| Teachy | Meu Modo |
|---|---|
| Vendida à escola, alinhada à **BNCC** | Ancorada no **material do professor dele** — o que vai cair na prova dele |
| Tutor **conversacional** como produto central | Tutor **de memória**: o core é o motor de espaçamento e evolução; conversa é apoio |
| Gamificação de **XP, níveis e ranking entre turmas** | Gamificação de **domínio e evolução pessoal**, sem ranking |
| Formatos variados como cardápio de engajamento | Formato escolhido pelo **algoritmo**, conforme o que funciona para aquele aluno |
| Público amplo via escola | Nicho de **atenção/TDAH**, direto ao aluno |

**Ranking é o ponto de divergência mais importante.** Ranking entre turmas funciona para o comprador escola (dado de gestão, competição saudável na média), mas é potencialmente tóxico para o nosso público: aluno com TDAH e histórico de fracasso escolar tende a ficar no fim do ranking e receber mais uma confirmação de que "não serve para isso" — o oposto do nosso objetivo de autoestima. Nossa comparação é sempre **com o próprio aluno de duas semanas atrás**.

**Leitura estratégica:** a Teachy vende para a escola e precisa ser genérica e neutra. Isso abre exatamente a brecha que ocupamos — hiperespecificidade (material do aluno) e nicho (atenção) são coisas que um produto de venda institucional dificilmente prioriza. Se eles descerem para B2C direto ao aluno com material próprio, aí temos concorrência frontal; até lá, competimos por posicionamento, não por feature.

---

## 4. Jobs to be done

1. *"Quando saio de uma aula que não entendi, quero transformar aquele material em algo que eu consiga estudar, para não acumular matéria."*
2. *"Quando tenho 15 minutos livres, quero saber exatamente o que estudar agora, para não gastar energia decidindo."*
3. *"Quando erro muito um assunto, quero que o estudo fique mais fácil primeiro e suba de nível comigo, para não desistir."*
4. *"Quando a prova se aproxima, quero estudar exatamente o que vai cair — do jeito que MEU professor cobra — para chegar seguro."*
5. *"Quando recebo material novo, quero jogar no meu repositório e confiar que o app vai usar na hora certa, para não perder nada."*
6. *(Pais)* *"Quero ver que meu filho está estudando de verdade e evoluindo, para justificar o investimento e reduzir a briga em casa."*

---

## 5. O produto — fluxos core

### 5.0 Interface e experiência: TikTok-like, vertical, gravável

A interface do Meu Modo é **mobile-first, vertical e imersiva**, inspirada no padrão de consumo que o adolescente já conhece: TikTok, Reels, Shorts. Não se trata de copiar entretenimento, mas de usar o formato que esse público já internalizou para reduzir a fricção de adoção.

- **Navegação por swipe vertical** entre cards na sessão de estudo, com feedback tátil e visual imediato.
- **Micro-interações densas**: cada card é uma tela cheia com pergunta, resposta, explicação e ações em camadas — não uma lista de texto.
- **Toda tela é gravável/exportável**: o progresso do aluno é naturalmente "compartilhável" — um card acertado gera um frame, uma sessão completada gera um clipe. Isso alimenta o loop de conteúdo do TikTok sem exigir que o aluno "crie" nada: o produto é a fábrica de conteúdo.
- **Sessão com ponto de parada claro e celebração**: ao fim de cada sessão, uma tela de resumo (conceitos consolidados, streak, progresso na prova) que é a tela natural de compartilhamento e também de encerramento — o aluno sai com sensação de progresso, não com fila infinita.
- **Upload de materiais integrado à câmera**: o fluxo "abrir câmera → capturar → confirmar" é familiar e rápido. O botão de upload é proeminente na home, com o contador visível de materiais restantes.

### 5.1 Repositório de materiais + ingestão

O aluno tem um **repositório vivo por matéria**: vai adicionando materiais ao longo do bimestre — **slides/PDFs**, **fotos de caderno/quadro/lista de exercícios** (formato dominante esperado no mobile), **áudio de aula**, **provas antigas**, **texto livre** ("a prova é sobre X"). Ele pode navegar e reabrir tudo que já enviou. Cada material novo realimenta o agente, que decide o que fazer com ele: criar cards novos, enriquecer cards existentes, atualizar o grafo de conceitos, ou só guardar como contexto (ex.: prova antiga vira sinal de *estilo de cobrança do professor*, não necessariamente cards).

**Upload múltiplo desde o dia 1**: o aluno pode (e deve) subir até 3 materiais para uma mesma prova — tipicamente o slide do professor, a lista de exercícios e a foto do caderno. O guideline é explícito no onboarding: "Você pode enviar até 3 materiais — o slide da aula, a lista de exercícios e uma foto do seu caderno". A contagem de materiais é visível durante o upload.

**Foto como canal primário de entrada (mobile-first):** o adolescente frequentemente não tem o PDF do slide — ele tira foto da projeção, do caderno do amigo, da lista impressa. A ingestão por foto (OCR) é, portanto, requisito de MVP, não nice-to-have. O fluxo é: abrir câmera → capturar → confirmar → processar. A qualidade do OCR é crítica para o "aha moment" — se a foto da lista não virar cards reconhecíveis, o produto falha na primeira interação.

Pipeline: OCR via Liteparse (fotos e PDFs) → **exibição do texto extraído para o aluno editar** (passo crítico: o aluno confere e corrige antes da geração, eliminando erros de OCR na fonte) → extração de conceitos, definições, exemplos resolvidos e relações → **ontologia + grafo de conceitos por matéria** (nós = conceitos tipados pela ontologia; arestas = pré-requisito/aplicação/equivalência) → embedding de tudo na base de conhecimento, com rastreabilidade à fonte. A ontologia é o que torna a evolução de cards eficiente: mutações e aposentadorias operam sobre conceitos formalizados, não sobre texto solto. Quando há múltiplos materiais para a mesma prova, a ontologia consolida conceitos de fontes diferentes em um grafo coerente — o slide define os conceitos, a lista revela o estilo de cobrança, a foto do caderno adiciona exemplos do professor.

Regras de produto:

- **Todo card cita a fonte** (slide 12, minuto 08:30 da aula). Isso combate alucinação, gera confiança e permite ao aluno voltar ao material original. A literatura de geração automática de questões mostra que a maior falha de LLMs é gerar perguntas não respondíveis pelo material — ancoragem na fonte é requisito, não nice-to-have.
- Ingestão deve ter **tempo até o primeiro card < 3 minutos** para slides/PDF (aula gravada pode processar em background com notificação). O "aha moment" do produto é ver o próprio material virar exercício.

### 5.2 Estrutura do flashcard (conforme diagrama de escopo)

```
Flashcard {
  id, grupo_id (deck/tema), materia
  pergunta                    // um conceito por card, resposta curta verificável
  resposta
  dica[]                      // gerada por IA sob demanda, personalizada pelo histórico
  explicacao                  // o "porquê", exibida após responder (feedback explicativo)
  comentarios[]               // anotações do aluno; texto ou áudio gravado
  metadados {
    conceitos[]               // nós do grafo de conceitos cobertos
    fonte { material_id, localizacao }   // citação obrigatória
    tipo                      // fato | conceito | aplicação | exemplo_com_erro | cloze
    nivel                     // 1..5 dentro da linhagem evolutiva
    embedding                 // para busca híbrida e seleção semântica
  }
  estado_memoria { dificuldade, estabilidade, recuperabilidade }  // FSRS
  linhagem { pai_id, geracao, motivo_evolucao }                    // grafo de evolução
  validade { max_exibicoes, status: ativo | aposentado | suspenso }
}
```

Decisões de design fundamentadas:

- **Um conceito por card, resposta curta** — permite sinal limpo de acerto/erro e agendamento preciso (evidência moderada-forte).
- **Tipos além de "fato":** cards de aplicação ("por quê/como"), exemplos resolvidos com passo faltando, e **exemplos com erro** ("ache o erro nesta resolução") — essenciais para física/química/matemática, onde recall puro transfere pouco. Worked examples têm g ≈ 0,43 em matemática; error analysis é a via comprovada para desfazer misconceptions.
- **Resposta em recuperação ativa** (digitar/falar antes de virar o card), não reconhecimento passivo — recuperação explícita supera "acho que sei".
- **Comentário gravável em áudio** — reduz fricção para TDAH (falar > digitar) e gera dado rico para o tutor.

### 5.2b Entidades de domínio: Prova e Tema

Além do Flashcard e do Material, duas entidades organizam a experiência do aluno:

**Prova** — é o motivo pelo qual o aluno abriu o app. A unidade de valor e de paywall.

```
Prova {
  id, aluno_id
  titulo               // "Prova de Cinemática" ou livre
  materia              // inferida ou declarada
  data                 // ISO date, opcional
  status               // ativa | concluída | arquivada
  nota_autoavaliacao   // 1-5, preenchido ao concluir
  materiais[]          // uploads associados
  conceitos[]          // nós do grafo cobertos
  criada_em, concluida_em
}
```

Regras:
- Criada automaticamente no primeiro upload, ou explicitamente pelo aluno
- Free tier: 1 prova ativa. Segunda prova → paywall
- Prova concluída: cards continuam no ciclo espaçado. Vaga NÃO é liberada no free tier
- Múltiplas provas (pago): prioridade na fila por data mais próxima
- Ao concluir: feedback "como foi?" (1-5) → alimenta narrativa de evolução

**Tema** — recorte conceitual dentro de uma matéria. "Cinemática", "Função Quadrática", "Revolução Francesa". Diferente de Prova (que tem data e urgência), Tema é o agrupador que persiste entre provas.

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
- Inferido na ingestão: o pipeline extrai temas do material
- Acumulativo: temas se repetem entre provas. O histórico do aluno no tema é mantido
- Barra de domínio: progresso visível é por tema ("7/12 conceitos de Cinemática"), não por prova
- Navegação: aluno pode filtrar a fila por tema ("quero focar em Cinemática hoje")

### 5.3 Sessão de estudo

O sistema **sugere por padrão** (abre o app → fila pronta), mas o aluno pode dirigir: *"tenho 30 minutos hoje e preciso estudar tal coisa"*, *"minha prova de física é dia 14"*, *"tenho três provas nessa semana"*. Objetivos com data viram **metas de estudo** de primeira classe no produto.

Fluxo: aluno abre o app → informa (ou o app assume) **quanto tempo tem**, **em que quer focar** e **quais provas/metas estão no horizonte** → o motor de seleção monta a fila da sessão → responde cards um a um com feedback imediato → fecha com micro-resumo de progresso ("você consolidou 3 conceitos hoje; faltam 5 para a prova de quinta").

Motor de seleção (busca híbrida na base + regras):

1. **Metas com data dominam**: com prova marcada, o alvo de retenção do FSRS é recalibrado para a data (intervalos comprimidos para "chegar lembrando na quinta"), a cobertura dos conceitos da prova vira prioridade, e múltiplas provas na semana disputam a fila por urgência × fragilidade. Sem meta ativa, o modo padrão é consolidação de longo prazo.
2. **Prioridade FSRS**: cards com recuperabilidade próxima do limiar (ponto ótimo de esforço).
3. **Restrição de tempo**: sessão dimensionada para o tempo declarado; para TDAH, default de **sessões de 5–15 min** com ponto de parada claro (evidência: sessões curtas com fim explícito sustentam adesão).
4. **Prompt de foco**: "quero focar em cinética" → busca semântica nos metadados filtra a fila.
5. **Insegurança declarada ou inferida**: conceitos com taxa de erro alta ou marcados pelo aluno ganham densidade de prática antes de voltar ao espaçamento (remediação → espaçamento, padrão validado em ITS).
6. **Intercalação**: mistura de temas dentro da matéria (interleaving melhora discriminação; evidência moderada), com dosagem conservadora para não frustrar.

Durante o card:

- **Botão de dica**: gera dica personalizada via IA usando o histórico do aluno (ex.: "lembra do card X que você acertou ontem? mesmo princípio"). Dica usada = sinal para o algoritmo (acerto com dica ≠ acerto limpo).
- **Feedback imediato e explicativo** ao responder, com a explicação e a fonte. Para erros, tag de misconception quando identificável.
- **Conversar com o tutor sobre o card**: o card não é só "virou, essa era a resposta" — o aluno pode abrir um chat *ancorado naquele card* e pedir para o tutor explicar de outro jeito, dar um exemplo, mostrar onde está no material. O chat é escopado (contexto = card + fonte + histórico do aluno naquele conceito), o que o mantém pedagógico e barato, e diferencia o produto de um "vira-card" seco. A conversa alimenta a memória do tutor e pode disparar evolução do card ou da dica.
  - **Botões de controle de complexidade** (inspirado na Teachy): "explica mais simples" / "vai mais fundo" / "me dá um exemplo" — o aluno regula o nível sem precisar formular o pedido, o que reduz custo cognitivo de iniciar (importante no perfil TDAH).
  - **Checagem de entendimento**: ao fim de uma explicação longa, o tutor faz uma micro-pergunta antes de encerrar — retrieval practice embutida na conversa, não só no card.
  - **Guardrails**: o tutor explica e conduz, mas não resolve a lista de exercícios do aluno nem entrega resposta de dever de casa; recusa conteúdo fora do escopo pedagógico. Requisito de produto, não de moderação genérica — vira máquina de colar é o modo mais rápido de perder a confiança dos pais.

### 5.3b Fluxo pós-prova: quando o aluno vai mal

O cenário de falha na prova é o momento de verdade do produto. Se o value prop é "passe na prova", a UX precisa tratar o resultado negativo sem perder o aluno.

**Não fazer:**
- Cobrar upgrade após resultado ruim ("foi mal? assine para melhorar")
- Ignorar o resultado e seguir como se nada tivesse acontecido

**Fluxo:**

1. **Tela de resultado**: quando o aluno marca a prova como concluída e avalia 1-2 estrelas, o tom é: *"Provas nem sempre mostram tudo que a gente aprendeu. Você consolidou X conceitos em Y sessões — isso não some. O que caiu na prova que te pegou de surpresa?"* Opções: "Caiu coisa que não estudei" / "As questões eram diferentes" / "Deu branco na hora" / "Outro motivo".

2. **Ação de recuperação**: com base na resposta, o app oferece uma ação gratuita (mesmo no free tier — exceção única para reter):
   - "Caiu coisa que não estudei" → abre upload de novo material para complementar
   - "As questões eram diferentes" → oferece cards de aplicação/exemplos-com-erro ou revisão guiada
   - "Deu branco" → sugere sessão de revisão rápida, sem pressão de acerto

3. **Trial do plano pago**: após a ação de recuperação, oferecer 7 dias grátis do plano pago. O tom é de continuidade, não de correção: *"Você já tem os cards. Quer testar as features extras para a próxima?"*

**Princípio:** o aluno que foi mal MAS percebeu que o produto ajudou parcialmente ("acertei cinemática, errei dinâmica que não deu tempo") é um potencial pagante mais forte que o aluno que foi bem sem atribuir ao produto. A falha parcial com atribuição clara de valor > sucesso total sem atribuição.

### 5.4 Evolução dos cards (o grafo genético)

Cada card pertence a uma **linhagem**. Um workflow de refinamento roda a cada N respostas (assíncrono, não no caminho crítico da sessão) e decide mutações:

| Situação | Mutação | Fundamento |
|---|---|---|
| Acertos consistentes no nível atual | Gerar variante nível+1 (mais difícil, mais transfer: aplicação, novo contexto) | Dificuldades desejáveis; mastery progression |
| Acerto de card avançado que subsume um básico | **Aposentar** o card básico (crédito implícito na linhagem) | Eficiência de fila; evita review inflado — dor clássica do Anki |
| Erros repetidos | Gerar variante mais simples OU variante com dica embutida; recuar na linhagem | Remediação antes de espaçar; scaffolding |
| Acerto com dica | Manter nível, reduzir dica gradualmente (fading) | Faded worked examples |
| Card maduro além da validade | Aposentar com "prova de vida" ocasional (revisão de manutenção rara) | Espaçamento de longo prazo |
| Aluno sinaliza card ruim/confuso | Regenerar com feedback; card original vira dado de treino de qualidade | Human-in-the-loop |
| Erro recorrente com padrão identificável | **Evoluir só a dica** (não o card): a próxima dica é gerada mirando o erro da última vez ("da última vez você esqueceu de converter a unidade") | Feedback dirigido a misconception |

A **validade** de um card é estimada, não fixa: função da estabilidade FSRS, da posição na linhagem (existe sucessor mais difícil dominado?) e da cobertura do conceito por outros cards ativos. Entender quando um card "venceu" é tão importante quanto criá-lo — fila enxuta é o produto.

Regras de segurança do sistema evolutivo:

- Mutação **nunca destrói** o card original (linhagem preservada; rollback possível).
- Taxa de mutação limitada por sessão — o aluno precisa de estabilidade percebida; um sistema que muda tudo o tempo todo destrói a sensação de progresso.
- Toda variante gerada passa pelos mesmos checks de qualidade da geração original (respondível pela fonte? resposta curta? um conceito?).

### 5.5 Memória do tutor

O tutor mantém memória longitudinal por aluno: desempenho por conceito (knowledge tracing), formatos que funcionam melhor para ele (ex.: acerta mais cards com imagem), padrões de sessão (hora do dia, duração sustentada), misconceptions recorrentes, preferências declaradas, estilo de cobrança do professor dele. Essa memória alimenta: seleção de cards, geração de dicas, tom das explicações, o chat ancorado no card e o relatório dos pais.

**Implementação: usar as abstrações nativas do Agno**, não construir do zero — `PostgresDb` como backend, *user memories* escopadas por `user_id` (persistem entre sessões), *session summaries* para o histórico de estudo, e `MemoryManager` com instruções próprias sobre o que capturar de um aluno ("conceitos frágeis, formatos que funcionam, gatilhos de desistência, estilo do professor"). Duas camadas distintas:

- **Memória estruturada** (nossa, em tabelas): estado FSRS, knowledge tracing, linhagens. Determinística, consultável, barata.
- **Memória do agente** (Agno): observações não estruturadas sobre o aluno, usadas para personalizar linguagem e didática.

Atenção a custo: o modo *agentic memory* do Agno pode multiplicar tokens por várias vezes quando há muitas memórias acumuladas. Default: extração automática em pontos definidos (fim de sessão, fim de conversa sobre card), não em toda interação.

### 5.6 Gamificação (adaptada a TDAH — não é Duolingo copiado)

O que importa para o público: recompensa imediata, novidade, metas pequenas e atingíveis, zero punição. **Objetivo explícito: melhorar a autoestima acadêmica do aluno** — o aluno com TDAH chega com histórico de fracasso e a crença de que "o problema sou eu". Todo mecanismo de recompensa existe para produzir evidência do contrário.

- **Micro-metas diárias** flexíveis ("1 sessão de 10 min"), não contagens de cards.
- **Streaks com proteção** (freeze automático, streak "gentil" que não zera do nada): para TDAH, streak punitivo vira fonte de vergonha e churn — o mecanismo do Duolingo precisa ser adaptado, não clonado.
- **Progresso visível por conceito** ("você dominou 7 de 12 conceitos de cinemática") — barra de domínio > XP abstrato, pois conecta esforço a resultado real (mastery é o motivador honesto).
- **Recompensas ao longo da sessão**, não só no fim — o tutor reconhece acerto de conceito difícil, recuperação de erro anterior, persistência. Reforço imediato é justamente o que funciona no perfil.
- **Narrativa de evolução pessoal**: "esse conceito você errava há 2 semanas e hoje acertou sozinho" — o dado longitudinal é o insumo mais poderoso de autoestima que temos, e nenhum concorrente tem.
- **Celebração de recuperação**: voltar depois de dias parado é celebrado, nunca culpabilizado.
- **Sem ranking entre alunos** — decisão deliberada e contrária ao padrão de mercado (a Teachy usa ranking entre turmas, que serve ao comprador escola). Para aluno com histórico de fracasso escolar, ranking é mais uma confirmação pública de que "não sirvo para isso". A única comparação que fazemos é com o próprio aluno no passado.
- **Formato como variável adaptativa, não cardápio**: em vez de oferecer flashcard/mapa mental/quiz/caça-palavras e deixar o aluno escolher (padrão da Teachy), o algoritmo aprende qual formato produz melhor retenção para *aquele* aluno e prioriza. Variedade existe para combater tédio e explorar o espaço, não como menu.
- Evidência: gamificação tem efeito pequeno-moderado em motivação (g ≈ 0,26) e RCT com crianças TDAH mostrou ganhos reais — mas o efeito em *competência* é o menor dos três; gamificação embala o motor, não o substitui.

---

## 6. Algoritmos e inteligência

### 6.1 Agendamento: FSRS como espinha dorsal

FSRS modela três variáveis por card — **dificuldade, estabilidade, recuperabilidade** — e ajusta intervalos com 19 parâmetros treináveis por aluno a partir do log de revisões. É superior ao SM-2 em simulações e benchmarks (mesma retenção com menos revisões), open source, e já validado em produção no Anki.

Posição honesta: não existe RCT publicado comparando FSRS vs. SM-2 em desfecho de aprendizagem humana — a superioridade é algorítmica/simulada. Adotamos FSRS pela plausibilidade + eficiência, e instrumentamos o produto para medir retenção real (nosso próprio dado vira evidência).

Extensões sobre o FSRS puro:

- **Acerto com dica** entra como grade intermediário (não é "good" limpo).
- **Aposentadoria por linhagem**: acerto em card avançado propaga crédito de estabilidade aos ancestrais.
- **Cap de carga diária** sensível ao perfil (TDAH: fila curta sempre; melhor 15 cards feitos que 60 planejados e abandonados — a literatura do Anki documenta burnout por fila como principal causa de abandono).

### 6.2 Modelo do aluno: knowledge tracing por conceito

FSRS agenda *cards*; o tutor precisa estimar domínio de *conceitos*. Camada de knowledge tracing (começar com BKT simples por nó do grafo de conceitos; evoluir para modelos com dificuldade de item se o dado justificar) alimentada por todas as respostas. É essa camada que responde "o que o aluno domina?" para: evolução de cards, relatório dos pais, e decisão de quando introduzir conteúdo novo vs. consolidar.

Referências de mercado: Duolingo usa half-life regression (ACL 2016) — modelo treinável de esquecimento por item — como base do Birdbrain; validação de que agendamento aprendido por dados funciona em escala de consumo.

### 6.2b Otimização da trilha (sequenciamento)

Existe literatura consolidada de **instructional sequencing / learning path optimization**: modelar a escolha do próximo item como MDP e otimizar por RL (DQN, PPO) sobre o estado de conhecimento do aluno. Revisões sistemáticas indicam que mais da metade das políticas induzidas por RL superam os baselines testados — mas exigem volume de dados e simulador de aluno confiável.

Postura de produto (ordem de maturidade, não tudo de uma vez):

1. **v1 — heurística explicável**: FSRS + knowledge tracing + regras de urgência/pré-requisito do grafo. Depurável, previsível, funciona com pouco dado, e o aluno entende o "porquê" da fila.
2. **v2 — otimização sobre o grafo**: ordenação respeitando pré-requisitos da ontologia e maximizando ganho esperado de domínio por minuto de estudo, dado o horizonte da prova.
3. **v3 — política aprendida (RL)**: só quando houver dado suficiente e um simulador de aluno validado. Riscos reais: recompensa mal especificada otimiza engajamento em vez de aprendizado, e política opaca é impossível de explicar a um pai.

### 6.3 Geração de cards: pipeline com validação

1. Modelo forte (tier "pro") gera candidatos a cards a partir do material, com structured output (schema §5.2), **restrito ao conteúdo-fonte**.
2. Checks automáticos: respondível pela fonte? um conceito? resposta curta e verificável? cobertura balanceada dos conceitos (não só trivia)? distratores plausíveis quando MCQ?
3. Cards reprovados são descartados ou regenerados; taxa de reprovação é métrica de qualidade do pipeline.
4. Aluno pode sinalizar card ruim (1 toque) — feedback loop humano.

Fundamento: estudos de AQG mostram que ~metade das questões de LLM sem restrição não são respondíveis pelo material-fonte; com ancoragem e validação, qualidade chega a nível humano. O gargalo é o pipeline de validação, e ele é nosso diferencial de qualidade.

### 6.4 Arquitetura técnica (resumo — spec detalhada em doc separado quando priorizada)

- **Framework Agno**, com Teams de agentes especialistas: *professor* (didática/explicações e chat ancorado no card), *psicopedagogo* (adaptação TDAH, tom, carga, autoestima), *especialista em questões* (geração/validação/evolução de cards).
- **Memória via abstrações do Agno** (`PostgresDb`, user memories, session summaries, `MemoryManager`) — ver §5.5.
- **Ingestão**: OCR/parsing por bibliotecas dedicadas (não LLM para extração bruta — custo e determinismo), com chamada de modelo leve só para estruturar o que o OCR entregou; transcrição de áudio por serviço de STT.
- **Modelos em dois tiers com estratégia de custo agressiva**: 
  - **Runtime de sessão**: modelos rápidos e baratos para dicas, feedback, chat e seleção de cards. Prioridade: latência baixa (< 2s) e custo mínimo. Candidatos: DeepSeek-V3, Qwen3, Gemini Flash — modelos chineses e de tier gratuito que são 10-50x mais baratos que GPT-4/Claude com qualidade comparável em tasks estruturadas.
  - **Geração/evolução de cards (batch)**: modelo forte só para criação e mutação de cards, execução assíncrona, cacheável. Candidatos: Claude Sonnet, GPT-4o, DeepSeek-R1.
  - **Disciplina de custo desde o dia 1**: edtech B2C morre por custo de inferência. Todo card gerado no free tier tem custo direto — é literalmente o subsídio de aquisição. Modelos chineses são a alavanca que torna o free tier economicamente viável sem degradar a experiência.
- **Postgres** para estado FSRS, knowledge tracing, linhagens e memória do agente; **pgvector** para busca híbrida nos metadados/embeddings dos cards e da base de conhecimento; ontologia de conceitos como camada de modelagem sobre o grafo.
- **Workflow assíncrono de refinamento** disparado a cada N respostas (mutações de linhagem, evolução de dicas, retreino de parâmetros FSRS, atualização de knowledge tracing) — fora do caminho crítico da sessão.
- **Tools**: pesquisa web (enriquecer questões com contextos atuais — sempre marcadas como "além do material"), code tools (gráficos e contas para física/química/matemática), structured outputs em todo output de card.
- Inspiração de arquitetura de agente: agno-agi/dash.

---

## 7. Escopo do MVP

### 7.1 Dentro

1. **Fluxo de entrada simplificado**: "tenho prova amanhã" → tema/matéria → upload de até 3 materiais (slides, foto da lista, foto do caderno) → geração de cards → sessão de estudo. Sem onboarding complexo, sem cadastro de perfil — o perfil de atenção é inferido por comportamento nas primeiras sessões. O "aha moment" é ver o próprio material virar exercício em < 5 minutos.
2. **Repositório de materiais**: upload de PDF/slides, foto de lista/caderno (OCR — requisito MVP, não nice-to-have), áudio de aula (transcrição em background), navegação no que já foi enviado. Upload múltiplo (até 3) com contador visível e guideline claro.
3. Geração de grupos de flashcards com citação de fonte, pipeline de validação, tipos: fato, conceito, cloze, aplicação simples.
4. Sessão de estudo com FSRS, **tempo declarado e meta com data (prova)**, dica por IA, feedback explicativo imediato. Interface TikTok-like: swipe vertical entre cards, tela cheia, feedback tátil.
5. **Chat ancorado no card** — pedir explicação ao tutor sobre aquele card específico.
6. Evolução v1: simplificar após erros, dificultar após acertos, aposentar por maturidade, **evoluir a dica com base no último erro**.
7. Gamificação mínima: meta diária flexível, streak com proteção, barra de domínio por conceito, narrativa de evolução pessoal.
8. **Free tier viral + paywall por prova** (§7.3): 1 prova grátis (até 3 materiais), cards mantidos pós-prova, paywall ao tentar adicionar novos materiais, **link de pagamento compartilhável para o pai**.
9. Relatório semanal para pais (e-mail/WhatsApp): tempo de estudo, conceitos consolidados, conceitos frágeis.
10. **Toda tela é gravável/exportável**: frames de progresso e resumos de sessão compartilháveis para alimentar o loop de crescimento no TikTok.

### 7.2 Fora (e por quê)

- **Escopo professor/turma com produto próprio** — fora do MVP. Mas *não bloqueamos* o professor: se ele quiser usar, usa com login de aluno e sobe o material da aula dele — é sinal barato de demanda B2B2C, sem construir nada. Instrumentar para detectar esse uso.
- **Chat livre e irrestrito com o tutor** (fora do contexto de um card) — vira chatbot de dúvidas genérico, custa caro e dilui a tese. O chat existe, mas sempre ancorado em um card.
- **Marketplace/compartilhamento de decks** — contradiz a tese da individualização no curto prazo.
- **Geração de simulados/provas** — candidato forte para fase 2 (job #4), mas exige banco validado maior.
- **LearningMachine/refinamento agentic contínuo em runtime** — começa como workflow batch determinístico; sofisticação algorítmica só depois de sinal de retenção.

### 7.3 Monetização e growth: free tier viralizável

Premissa: o produto precisa nascer para viralizar — vídeo no TikTok, aluno baixa, sobe o material, vê o próprio slide virar exercício. O momento "uau" tem que acontecer **antes de qualquer cadastro de pagamento**.

**Modelo: paywall por prova, não por tempo, card ou material individual.**

- **Grátis: 1 prova completa (até 3 materiais).** O aluno sobe o slide, a lista de exercícios e a foto do caderno — tudo que tem para aquela prova. Estuda, faz a prova. O valor foi entregue.
- **A partir da segunda prova (novos materiais): assinatura.** Ao tentar subir material para outra prova, o paywall aparece com a prova de valor do que ele já fez ("Você estudou 8 conceitos e fez 12 sessões — continue para a prova de história, R$X/mês").
- **Pós-prova grátis: os cards continuam disponíveis.** A fila de revisão espaçada mantém os conceitos vivos — isso é produto (retenção de longo prazo) e é retenção de usuário (ele volta para revisar). O paywall está em *adicionar novos materiais*, não em continuar estudando o que já foi gerado.
- Por que "prova" como unidade, e não "material": o aluno típico tem múltiplos arquivos para uma mesma prova (slides + lista + foto do caderno). Limitar a 1 material quebra a experiência antes de entregar valor. Limitar a 1 prova (até 3 materiais) permite uma experiência completa e previsível em custo.
- Por que até 3 materiais: é o suficiente para cobrir o caso comum (slide do professor + lista de exercícios + anotações/foto) sem abrir para abuso. O guideline é claro desde o onboarding: "Você pode enviar até 3 materiais para esta prova — o slide da aula, a lista de exercícios e uma foto do seu caderno".
- Cuidado: paywall pré-prova pode gerar rejeição se cair no pior momento. Aviso antecipado: "Seu plano grátis cobre a prova de quinta. Para a prova de história da semana que vem, assine."

**Ponte para o pagante:** ao bater o paywall, o aluno gera um **link de pagamento compartilhável** (Pix/cartão) para mandar ao pai no WhatsApp. A página que o pai abre mostra o que o filho já fez (sessões, conceitos consolidados, matérias) antes de pedir o cartão — pedido de compra com prova de valor embutida. Um clique, sem app, sem cadastro do pai.

**Loops de crescimento a instrumentar:**

- *Loop de conteúdo (TikTok)*: o "antes e depois" de um slide virando card é conteúdo naturalmente compartilhável — o aluno pode exportar um clipe da própria sessão.
- *Loop de sala de aula*: o aluno tem colegas com o mesmo material e a mesma prova. Testar convite ("mandar o material da prova pro grupo") — cuidado para não virar compartilhamento de deck genérico, que fere a tese; a individualização se mantém porque cada aluno tem histórico próprio.
- *Loop pré-prova*: pico sazonal de aquisição em época de provas; o app deve capturar a data e reengajar no ciclo seguinte.

### 7.4 Riscos de compliance (bloqueantes, tratar no MVP)

- **LGPD + menores de idade**: consentimento parental obrigatório para tratamento de dados de crianças/adolescentes; dados educacionais e de saúde autopercebida (TDAH) são sensíveis. **Tensão com o free tier viral resolvida:** o onboarding gratuito não coleta dado sensível — não pergunta TDAH, não exige diagnóstico. O perfil de atenção é inferido por comportamento. O consentimento parental formalizado entra no fluxo de pagamento, que é onde o responsável aparece de qualquer forma. Se o aluno nunca pagar, o dado tratado é exclusivamente educacional (material de estudo + desempenho em cards), sem dado de saúde.
- **Material de terceiros**: o aluno sobe slides do professor e páginas de livro. Uso é privado, individual e transformativo (estudo pessoal), mas **não pode haver redistribuição** — reforça a decisão de não fazer marketplace de decks, e exige termos claros.
- **Posicionamento não-clínico**: o produto apoia estudo de pessoas com TDAH; não diagnostica nem trata. Toda comunicação deve evitar claims terapêuticos.

---

## 8. Métricas

**North star: conceitos consolidados por aluno por semana** (conceito consolidado = domínio estimado acima do limiar com retenção verificada em revisão espaçada ≥ 7 dias). É a métrica que une aprendizado real e engajamento — engajamento sem consolidação é teatro; consolidação exige engajamento.

| Camada | Métrica | Guardrail/meta inicial |
|---|---|---|
| Ativação | Tempo até primeiro card respondido | < 5 min do upload |
| Ativação | % uploads que geram sessão completada em 24h | > 60% |
| Engajamento | Sessões/semana; duração mediana | 4+/sem; 8–15 min |
| Retenção produto | D7 / D30 | benchmarks consumer: 40% / 20% |
| Aprendizado | Retenção de conceito em revisão ≥ 7 dias | > 80% |
| Aprendizado | Delta de acerto 1ª tentativa vs. reencontro espaçado | positivo e crescente |
| Qualidade | % cards sinalizados como ruins | < 5% |
| Qualidade | Taxa de reprovação no pipeline de validação (monitorar tendência) | estável/decrescente |
| Growth | % alunos que geram link de pagamento ao bater paywall | > 30% |
| Growth | % links gerados que convertem em pagamento do pai | > 25% |
| Negócio | Conversão free→pago; churn mensal do pagante | definir após beta |
| Custo | Custo de inferência por aluno ativo/mês | < 15% do ticket |
| Custo | Custo por material processado (grátis) | teto absoluto — é o subsídio do free tier |

Antimétrica vigiada: **cards respondidos/dia**. Maximizá-la incentiva fila inflada e burnout — o erro clássico do Anki que o produto existe para corrigir.

---

## 9. Desafios que faço à tese (chapéu de PM/empreendedor)

1. **Flashcards têm teto em ciências.** A evidência mostra que spaced retrieval tem efeito menor em domínios de raciocínio multi-etapas (g ≈ 0,28 em matemática vs. ~0,74 geral; testing effect em matemática com IC cruzando zero). Recall puro não ensina a resolver problema de física. **Mitigação já no design:** tipos de card de aplicação, worked examples com passos faltando e exemplos-com-erro — o "card" do Meu Modo precisa ser mais próximo de um micro-exercício adaptativo do que de um flashcard clássico. Se o produto virar "Anki com IA", perde para a dor real.
2. **Adolescente não compra "estudar mais".** O usuário sente a dor na véspera da prova; o comportamento diário é o que o produto exige. Apostas: (a) sessões curtíssimas com fila pronta (eliminar o custo de decisão, que é a maior barreira no TDAH); (b) o pai como comprador e reforçador; (c) o pico de motivação pré-prova como momento de aquisição ("suba o material da prova de quinta"), convertendo depois para hábito — o gancho do Responde Aí ("mande bem na prova") é a porta; o hábito espaçado é a casa.
3. **Upload é fricção, mas foto é o caminho.** O aluno frequentemente não tem PDF — ele tira foto da projeção, do caderno, da lista impressa. A ingestão por foto (OCR) é, portanto, requisito de MVP, não plano B. O desafio real é a qualidade do OCR: se a foto da lista não virar cards reconhecíveis, o "aha moment" morre. Validar no WoZ com fotos reais de caderno de adolescente (ilegíveis, tortas, com sombra) é tão importante quanto validar a disposição de upload.
4. **Custo de servir.** Geração + evolução de cards com modelo forte por aluno individual é caro. Disciplina: batch, cache, tier barato no runtime, e monitorar custo/aluno como métrica de primeira classe (§8).
5. **"Nicho TDAH" vs. "todos".** Foco de design em TDAH com comunicação aberta a todos é a jogada certa (design para o extremo beneficia a média — curb-cut effect), mas exige cuidado: o site e a comunicação com o aluno **nunca mencionam TDAH** (fala de "estudar do seu jeito", "para quem não se encaixa no método tradicional"); a palavra TDAH aparece só em materiais para pais e conteúdo de fundo. Risco: não estigmatizar (o adolescente não quer um "app de TDAH") nem diluir a ponto de virar genérico.
6. **Evidência TDAH+flashcards é uma aposta.** Não há RCT direto. Somos nós que vamos gerar esse dado — o que é risco e ativo: um estudo próprio bem instrumentado (mesmo quasi-experimental) vira arma de marketing, defesa científica e, no futuro, porta para escolas e planos de saúde.
7. **Tensão entre "focado na prova" e "aprendizado duradouro".** Vender "mande bem na prova de quinta" e entregar espaçamento de longo prazo pode virar contradição: o ótimo para a prova (cramming dirigido) nem sempre é o ótimo para reter. Posição: com prova marcada, o motor otimiza para a data, mas nunca abandona a linhagem — depois da prova os conceitos voltam ao ciclo espaçado. Comunicar isso como benefício ("você não vai esquecer tudo depois da prova"), que é exatamente a dor de quem só decora.
8. **Free tier viral é caro e atrai quem nunca vai pagar.** Processar até 3 materiais com modelo forte de graça tem custo real e o TikTok traz volume sem qualificação. Mitigações: teto rígido de custo por material grátis (3 materiais = custo previsível e limitado), geração em batch, cache por material similar (vários alunos da mesma escola sobem o mesmo slide — o custo marginal do segundo aluno com o mesmo material é zero), e modelos chineses baratos para o runtime. A unidade "1 prova" é mais generosa que "1 material", mas também mais previsível em custo.

## 10. Roadmap de validação

**Fase 0 — Wizard of Oz (2–4 semanas).** 10–15 famílias (recrutar em comunidades de pais TDAH). Aluno manda material por WhatsApp — especialmente **fotos reais de caderno e lista** (testar OCR com letra de adolescente, foto torta, sombra); geramos cards com pipeline semi-manual; sessões via link. Valida: disposição de upload de foto, qualidade percebida dos cards, adesão a sessões curtas, disposição de pagamento dos pais após a primeira prova. Critério de avanço: ≥50% dos alunos completam 3+ sessões/semana na semana 3 E ≥70% avaliam os cards como "úteis para a prova".

**Fase 1 — MVP (8–12 semanas).** Escopo §7.1, com free tier e link de pagamento desde o dia 1 (o funil de compra é hipótese a validar, não detalhe de implementação). Beta aberto pequeno + primeiros testes de conteúdo orgânico. Critérios: D30 ≥ 15%, retenção de conceito ≥ 75%, ≥25% dos alunos que batem o paywall geram link para o pai.

**Fase 2 — Motor completo.** Evolução v2 (exemplos-com-erro, fading de dica), simulados pré-prova, parâmetros FSRS por aluno, otimização de trilha sobre o grafo (§6.2b v2), relatório rico para pais, loops de crescimento.

**Fase 3 — Distribuição.** Produto de professor/turma (se o sinal do uso "professor com login de aluno" confirmar), estudo de eficácia formal, parcerias com clínicas/associações de TDAH.

---

## 11. Referências

**Do workspace (`research_results/`):** Scientific Evidence on Anki as a Personalized Learning System; Personalized Learning in K–12 (foco TDAH); Personalized Learning and Instructional Adaptations in K–12; Evidence-Based Post-Class Learning Interventions.

**Complementares:**

- FSRS — algoritmo e benchmarks: [open-spaced-repetition/free-spaced-repetition-scheduler](https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler) · [Benchmark (Expertium)](https://expertium.github.io/Benchmark.html) · [Visão para educadores](https://www.pedagogypath.com/fsrs-spaced-repetition-for-educators)
- Duolingo, half-life regression: [Settles & Meeder, ACL 2016](https://research.duolingo.com/papers/settles.acl16.pdf) · [repo](https://github.com/duolingo/halflife-regression) · [Adaptive Forgetting Curves](https://arxiv.org/pdf/2004.11327)
- Knowledge tracing: [BKT overview](https://www.emergentmind.com/topics/bayesian-knowledge-tracing) · [pyBKT](https://arxiv.org/pdf/2105.00385) · [KT com dificuldade de item via LLM](https://www.nature.com/articles/s41598-025-96540-3)
- Flashcards/questões geradas por LLM: [Enhancing Student Learning with LLM-Generated Retrieval Practice](https://arxiv.org/pdf/2507.05629) · [SmartFlash — automação vs. agência](https://arxiv.org/pdf/2602.14431) · [LLMs para cards de spaced repetition](https://www.alexejgossmann.com/LLMs-for-spaced-repetition/)
- Gamificação e TDAH: [RCT 8 semanas, app gamificado, 80 crianças com TDAH](https://www.researchgate.net/publication/398584473) · [Game-based rewards p/ engajamento infantil (trial em andamento)](https://clinicaltrials.gov/study/NCT07509489)
- Otimização de trilha / instructional sequencing: [Deep RL Framework for Instructional Sequencing](https://www.researchgate.net/publication/350195871_A_Deep_Reinforcement_Learning_Framework_for_Instructional_Sequencing) · [Target-oriented teaching path planning (PPO)](https://www.mdpi.com/2076-3417/12/18/9376) · [DQN para trilhas personalizadas](https://dl.acm.org/doi/10.1145/3766557.3766593) · [CRNN + Transformer + RL para trilhas](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0331491)
- Agno (memória, agentes): [docs](https://github.com/agno-agi/docs) — `PostgresDb`, user memories, session summaries, `MemoryManager`, boas práticas de custo em agentic memory
- Referência de posicionamento: [Responde Aí](https://www.respondeai.com.br/) — "Estude mais rápido. Guia com resumos, provas antigas e exercícios resolvidos passo a passo, **focados na prova da sua faculdade**" · [perfil da empresa](https://app.dealroom.co/companies/responde_ai)
- Concorrente adjacente: Teachy — [Tutor de IA](https://www.teachy.com.br/pt-BR/ai-tutor) · [Gamificação](https://www.teachy.com.br/pt-BR/gamification) · [Reforço escolar](https://www.teachy.com.br/pt-BR/tutoring)
- Mercado BR: [Edtechs brasileiras 2026 (Layers)](https://lp.layers.education/edtechs-brasileiras-2026/) · [Panorama edtechs no Brasil](https://pactoalegre.poa.br/mercado-das-edtechs-no-brasil/)

*As afirmações de efeito (tamanhos de efeito, resultados de RCTs) estão detalhadas e referenciadas nos quatro documentos do workspace; este PRD as usa como fundamento de decisão de produto.*
