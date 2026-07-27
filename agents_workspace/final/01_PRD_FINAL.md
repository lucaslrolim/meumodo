# PRD Final — Meu Modo

**Status:** fonte canônica de produto  
**Versão:** 1.1  
**Data:** 26/07/2026  
**Mercado inicial:** Brasil  
**Responsável:** Founder / Product  

> Este documento substitui, para decisões de produto, os rascunhos em
> `agents_workspace/old/` (`PRD_MeuModo.md`, `BRIEFING_MeuModo.md` e
> `ESTRATEGIA_FINAL_MeuModo.md`). Os rascunhos permanecem
> como histórico. O posicionamento, o sistema visual, o wireframe e a implementação
> macro estão nos outros quatro documentos finais desta pasta.

## 1. Resumo executivo

O Meu Modo é um **tutor de estudo adaptativo pós-aula**. O aluno envia o material
da própria escola — foto do caderno, lista de exercícios, PDF ou áudio — e recebe
uma sessão curta de prática ativa, com exercícios ancorados na fonte, feedback
imediato e revisões programadas. O Tutor também pode ser usado durante um card
ou em um chat próprio para conversar sobre o conjunto de conteúdos disponível.

O produto não tenta substituir a escola nem resolver dever de casa. Seu ponto
de entrada principal continua sendo um momento específico:

> “Tenho prova chegando, tenho o material na mão e não sei como estudar isso.”

### Proposta central

**Transformar o material da prova do aluno em prática curta, guiada e adaptativa.**

### Mensagem 1 + 2

- **Mensagem principal:** seu material vira estudo de verdade.
- **Apoio 1:** focado na sua prova, não em conteúdo genérico.
- **Apoio 2:** sessões curtas, com o próximo passo já decidido.

### Loop de valor do MVP

1. O aluno cria uma prova.
2. Envia até três materiais por foto, PDF ou áudio.
3. Confere e corrige o texto extraído.
4. O sistema gera exercícios citando a fonte.
5. O aluno faz uma sessão curta com feedback imediato.
6. Quando precisa, conversa com o Tutor no card ou no chat geral.
7. O sistema agenda o que revisar e mostra progresso por tema.
8. Ao criar a segunda prova, o aluno pode enviar ao responsável um link de
   pagamento com prova de valor.

## 2. Visão, tese e limites

### 2.1 Visão

Fazer com que estudantes que travam diante do método tradicional tenham um
ponto de partida claro, uma carga de estudo sustentável e evidência concreta de
que conseguem aprender.

### 2.2 Tese

O material que o aluno já recebeu contém o recorte real da sua prova. A prática
de recuperação, o espaçamento, o feedback explicativo e a progressão por domínio
são mecanismos mais confiáveis do que releitura passiva. A IA torna possível
converter materiais individuais em prática estruturada, desde que a geração seja
restrita à fonte, validada e observável.

### 2.3 O que o produto é

- Um sistema de reforço pós-aula.
- Um gerador de prática ancorada no material do aluno.
- Um organizador de sessões curtas e revisões.
- Um registro longitudinal de domínio por conceito.
- Um tutor com dois modos: ajuda no card e chat sobre a base de conhecimento do
  aluno.

### 2.4 O que o produto não é

- Chatbot genérico sem contexto pedagógico, fonte ou memória do aluno.
- Resumidor de aula.
- Banco genérico de questões.
- Ferramenta para responder dever de casa ou facilitar cola.
- Produto clínico, diagnóstico ou terapêutico.
- Rede social de estudantes.
- Substituto de professor, escola ou acompanhamento profissional.

## 3. Público e recorte de lançamento

### 3.1 Usuário primário

Estudante brasileiro de **13 a 17 anos**, no Fundamental II ou Ensino Médio, que:

- tem uma prova próxima;
- possui material da escola;
- não sabe por onde começar;
- recorre a releitura, vídeo genérico ou estudo de última hora;
- prefere tarefas curtas e um próximo passo explícito;
- estuda inicialmente matemática, física ou química.

### 3.2 Coorte de 12 anos

Estudantes de 12 anos poderão participar apenas de beta acompanhado e iniciado
pelo responsável até que o fluxo de idade, consentimento e supervisão esteja
validado. Não fazem parte da aquisição direta inicial.

### 3.3 Buyer e papéis

- **Aluno:** decide experimentar e continuar usando.
- **Responsável:** autoriza quando aplicável, decide a compra e administra o
  pagamento.
- **Equipe interna:** monitora qualidade, segurança, custo e suporte.

Professor, escola e turma não são personas de produto no MVP.

### 3.4 Lente de atenção

O produto é desenhado para reduzir carga executiva: sessões breves, fila pronta,
feedback rápido, linguagem acolhedora e ausência de ranking. Isso beneficia
alunos com diferentes perfis de atenção sem coletar diagnóstico ou inferir TDAH.

**Guardrail:** TDAH não aparece na comunicação ao aluno e não é usado como claim
de eficácia. Conteúdo para responsáveis deve ser educacional e não clínico.

## 4. Problema e alternativas

### 4.1 Problema principal

O aluno recebe material, mas não recebe um processo de estudo. Quando a prova se
aproxima, precisa decidir sozinho o que é importante, como praticar e quando
revisar. A fricção de começar costuma ser maior do que a tarefa em si.

### 4.2 Alternativas atuais

| Alternativa | Limite para este job |
|---|---|
| Reler, grifar e resumir | Atividade passiva; pouca evidência de retenção |
| Videoaula genérica | Não conhece o material nem a cobrança do professor |
| Anki | Exige criar e manter cards; configuração e carga podem afastar adolescentes |
| Chatbot genérico | Pode entregar resposta sem construir retenção |
| Banco de questões | Pode não cobrir o recorte da prova |
| Professor particular | Alto custo e disponibilidade limitada |

### 4.3 Diferenciação

O Meu Modo combina quatro elementos:

1. material real do aluno;
2. contexto de uma prova específica;
3. sessão curta sem decisão inicial;
4. histórico de desempenho por conceito.

Nenhum claim de exclusividade de mercado deve ser publicado antes de pesquisa
competitiva própria.

## 5. Jobs to be done

1. **Começar:** “Quando tenho uma prova chegando, quero saber o que fazer agora,
   sem montar um plano sozinho.”
2. **Converter:** “Quando tenho slide, lista, caderno ou áudio da aula, quero
   transformar isso em prática, sem criar exercícios manualmente.”
3. **Entender:** “Quando erro, quero saber por quê e tentar de novo sem me sentir
   punido.”
4. **Revisar:** “Quando volto ao app, quero receber o que mais precisa de atenção.”
5. **Comprar:** “Quando meu filho pede para continuar, quero ver o que ele já fez
   antes de pagar.”

## 6. Princípios de produto

1. **Prática antes de consumo.** O aluno precisa tentar responder antes de ver a
   solução.
2. **Fonte antes de fluência.** Uma resposta elegante sem apoio no material é
   inválida.
3. **Feedback explica.** “Certo/errado” sozinho não basta.
4. **Sessão tem fim.** A fila nunca parece infinita.
5. **Domínio antes de pontos.** Progresso conceitual é mais importante que XP.
6. **Remediação antes de espaçamento.** Erros repetidos recebem apoio antes de
   intervalos maiores.
7. **Comparação só com o próprio aluno.** Sem ranking.
8. **Privacidade por padrão.** Coletar apenas o necessário, com proteção especial
   por se tratar de menores.
9. **Explicável antes de sofisticado.** Heurísticas simples e auditáveis no MVP.
10. **Custo é requisito de produto.** Cada prova gratuita tem custo máximo
    mensurável.

## 7. Escopo do MVP

### 7.1 Dentro do MVP

- Landing page e entrada mobile-first.
- Fluxo de idade e identidade definido após validação jurídica.
- Criação de uma prova com matéria, título e data opcional.
- Uma prova gratuita com até três materiais.
- Entrada por câmera/galeria e PDF.
- Gravação e upload de áudio, inclusive gravações de aula com ruído.
- Transcrição revisável, com reprodução por trecho e indicação de baixa
  confiança.
- Voz como forma de preencher contexto, responder e pedir ações no fluxo atual.
- Tutor do Card, acessível durante a prática, com a questão atual como contexto
  de maior peso e acesso ao restante do conhecimento autorizado.
- Chat do Tutor como destino próprio, com histórico, texto e voz, para perguntar
  sobre qualquer conteúdo enviado e confirmado.
- Resposta do Chat do Tutor pode usar conhecimento geral do modelo quando
  necessário, mas deve distinguir claramente o que veio ou não dos materiais.
- Extração de texto e revisão editável pelo aluno.
- Geração de itens ancorados na fonte.
- Tipos de item:
  - pergunta e resposta curta;
  - aplicação simples;
  - passo faltante de exemplo resolvido.
- Validação automática e amostragem humana de qualidade.
- Sessões padrão de 10 minutos, ajustáveis entre 5 e 15 minutos.
- Resposta digitada, falada ou ação explícita “não sei”.
- Pedidos por voz no Tutor do Card, como “me dá uma dica”, “repete”, “explica de
  outro jeito”, “cria uma parecida” e perguntas livres sobre o contexto
  disponível.
- Perguntas livres por texto ou voz no Chat do Tutor.
- Dica, feedback explicativo e fonte.
- Agendamento FSRS com parâmetros padrão.
- Domínio simples por conceito, sem BKT sofisticado.
- Progresso por tema e resumo da sessão.
- Sinalização de item ruim.
- Paywall na tentativa de criar a segunda prova.
- Link privado para responsável com resumo mínimo e checkout.
- Telemetria de produto, aprendizado, qualidade e custo.
- Exclusão de conta, materiais e histórico conforme política validada.

### 7.2 Fora do MVP

- Chat social, público ou entre alunos.
- Tutor geral sem identidade, autorização, política de fonte ou guardrails.
- Pesquisa web autônoma sem indicação de origem e sem controle do aluno.
- Grafo de linhagem e mutação contínua de cards.
- Otimização de trilha por RL.
- Personalização individual dos parâmetros FSRS.
- Perfil de atenção inferido.
- Diagnóstico ou coleta de dado de saúde.
- XP, gems, likes, contagem social ou ranking.
- Feed, stories, comentários ou interação entre alunos.
- Compartilhamento de material ou deck.
- Exportação de vídeo para TikTok.
- Relatório semanal para responsáveis.
- Produto de professor, turma ou escola.
- Pesquisa web para enriquecer exercícios.
- Simulados completos.

### 7.3 Regra contra scope creep

Uma funcionalidade fora do MVP só entra antes do lançamento se:

1. remover um bloqueio do loop principal;
2. tiver hipótese e métrica explícitas;
3. não aumentar materialmente o risco de menores, conteúdo ou custo;
4. substituir outra funcionalidade de esforço equivalente.

## 8. Fluxos do produto

### 8.1 Aquisição e ativação

`Landing → começar grátis → idade/entrada permitida → criar prova → enviar material`

Não publicar “sem cadastro” até que o modelo de identidade e consentimento esteja
aprovado. “Sem cartão” pode ser usado se verdadeiro.

### 8.2 Ingestão

`Selecionar fonte → capturar/enviar/gravar → processar → revisar texto ou transcrição → confirmar`

Regras:

- até três materiais por prova;
- formatos iniciais: imagem, PDF e áudio;
- cada material mantém origem e localização;
- trechos de baixa confiança devem ser destacados;
- o aluno pode editar antes da geração;
- áudio mantém timecodes para reproduzir o trecho correspondente;
- falha de OCR oferece recaptura, edição manual ou remoção;
- falha de transcrição oferece reprodução, regravação, edição manual ou remoção;
- ruído, distância e fala sobreposta devem ser tratados como estados esperados,
  não como erro excepcional;
- materiais não são redistribuídos.

### 8.3 Geração

`Texto confirmado → extrair temas/conceitos → gerar candidatos → validar → publicar`

Todo item precisa:

- ser respondível pela fonte;
- cobrir um conceito principal;
- ter resposta verificável;
- citar material e localização;
- indicar tipo e nível;
- passar por filtros de segurança e qualidade.

### 8.4 Sessão

`Fila pronta → pergunta → resposta digitada ou falada → feedback → próximo item → resumo`

Regras:

- 10 minutos por padrão;
- uma atividade por viewport;
- botão é sempre a ação primária; gesto é atalho;
- swipe vertical avança somente após o feedback;
- não usar swipe horizontal no MVP;
- a dica é opcional e registrada;
- “não sei” é uma resposta válida, sem punição;
- o botão de voz permite responder, executar ações e conversar com o Tutor;
- a transcrição da resposta aparece antes do envio e pode ser corrigida;
- o Tutor do Card recupera primeiro o card atual, depois grupo/conceitos, prova
  e demais conteúdos autorizados;
- perguntas fora dos materiais recebem resposta educacional identificada como
  conhecimento geral, sem citação falsa;
- erros repetidos trazem item mais simples ou exemplo guiado;
- fim claro, sem fila infinita.

### 8.5 Tutor em dois modos

**Tutor do Card**

- aparece na questão, dica e feedback;
- mantém o card atual como contexto de maior peso;
- pode consultar outros cards, conceitos, materiais e memórias autorizadas;
- aceita perguntas livres por texto ou voz;
- preserva o estado da atividade quando abre e fecha;
- cita a fonte quando a resposta depende do material.

**Chat do Tutor**

- possui entrada própria na solução e histórico de conversa;
- permite selecionar contexto: tudo, prova, tema ou material;
- aceita texto e voz;
- pode conversar sobre qualquer conteúdo da base do aluno;
- pode recorrer a conhecimento geral do modelo, marcando essa origem;
- nunca apresenta conhecimento geral como se estivesse no material;
- pode levar o aluno a um card, fonte ou sessão relacionada.

Os dois modos compartilham identidade, memória pedagógica, conhecimento e
guardrails. Diferem na política de recuperação e na experiência de interface.

### 8.6 Pós-prova

O aluno marca a prova como concluída e responde “como foi?” em escala simples.
Notas baixas não acionam venda. O MVP oferece:

- acolhimento;
- seleção do principal motivo;
- revisão dos itens existentes;
- canal de feedback para identificar lacunas.

Novo upload gratuito excepcional e trial de sete dias permanecem hipóteses de
experimento, não regras do MVP.

### 8.7 Paywall e responsável

O paywall aparece ao criar a segunda prova. O aluno mantém acesso aos itens da
primeira prova.

O link do responsável:

- é privado, revogável, de uso limitado e sem material escolar;
- mostra apenas métricas necessárias;
- não expõe respostas, diagnóstico ou comparação;
- informa preço, cobrança e cancelamento;
- coleta o consentimento e os vínculos exigidos pelo modelo jurídico aprovado.

## 9. Requisitos funcionais

| ID | Requisito | Critério de aceite macro |
|---|---|---|
| RF-01 | Criar prova | Título e matéria obrigatórios; data opcional |
| RF-02 | Limitar prova gratuita | Uma prova com até três materiais |
| RF-03 | Capturar/enviar material | Imagem e PDF em dispositivos suportados |
| RF-04 | Gravar/enviar áudio | Captura e arquivo de áudio em dispositivos suportados |
| RF-05 | Extrair texto/transcrever | Resultado ligado ao arquivo, página ou timecode |
| RF-06 | Revisar extração | Aluno edita e confirma antes da geração |
| RF-07 | Gerar prática | Itens estruturados nos três tipos do MVP |
| RF-08 | Citar fonte | Todo item aponta para trecho/localização/timecode |
| RF-09 | Validar item | Itens inválidos não entram na sessão |
| RF-10 | Montar sessão | Fila limitada por tempo, urgência e revisão |
| RF-11 | Responder item | Texto, voz ou “não sei” antes da solução |
| RF-12 | Interpretar fala no Tutor | Ação ou pergunta livre transcrita, com confirmação quando ambígua |
| RF-13 | Dar feedback | Correção, explicação curta e fonte |
| RF-14 | Oferecer dica | Uso registrado e considerado na avaliação |
| RF-15 | Agendar revisão | Estado FSRS atualizado por interação |
| RF-16 | Mostrar progresso | Tema, conceitos praticados e próximos passos |
| RF-17 | Sinalizar item | Um toque e motivo opcional |
| RF-18 | Concluir prova | Autoavaliação e feedback pós-prova |
| RF-19 | Aplicar paywall | Apenas na segunda prova, sem bloquear revisão anterior |
| RF-20 | Compartilhar pagamento | Link privado e revogável para responsável |
| RF-21 | Excluir dados | Fluxo acessível para apagar conta e conteúdo |
| RF-22 | Instrumentar eventos | Funil, qualidade, aprendizado, custo e conversão |
| RF-23 | Usar Tutor do Card | Conversa preserva atividade e pondera o card atual acima dos demais contextos |
| RF-24 | Usar Chat do Tutor | Chat próprio com histórico, seletor de contexto, texto, voz e citações |
| RF-25 | Distinguir origem | Resposta diferencia material enviado de conhecimento geral do modelo |

## 10. Requisitos não funcionais

### 10.1 Desempenho

- Primeiro item pronto: meta de produto **até 3 minutos** para imagem/PDF dentro
  dos limites suportados; áudio terá SLO proporcional à duração e processamento
  em background. Comunicar “em poucos minutos” somente nos formatos em que o
  percentil 95 estiver validado.
- Feedback de sessão sem nova geração: percepção de resposta imediata.
- Processamento assíncrono, idempotente e retomável.
- Estado visível para fila, progresso, falha e nova tentativa.

### 10.2 Qualidade de conteúdo

- 100% dos itens com fonte.
- Avaliação offline com conjunto dourado por disciplina.
- Amostragem humana antes de ampliar tráfego.
- Versionamento de prompt, modelo, validador e item.
- Rollback de lotes defeituosos.

### 10.3 Segurança e privacidade

- Criptografia em trânsito e em repouso.
- Separação entre material bruto, texto extraído e dados analíticos.
- Acesso mínimo por função.
- Links de responsável com escopo, expiração e revogação.
- Logs sem conteúdo escolar ou respostas em texto livre.
- Política de retenção por classe de dado.
- Avaliação de impacto e revisão jurídica antes do beta público.
- Fornecedores de IA e armazenamento avaliados para transferência internacional,
  uso de dados para treinamento e exclusão.

### 10.4 Acessibilidade

- WCAG 2.2 AA como alvo.
- Alvos de toque de pelo menos 44 × 44 px.
- Fluxo completo sem depender de gesto.
- Labels acessíveis e foco visível.
- Texto ampliável sem perda de função.
- Feedback nunca dependente apenas de cor, som ou vibração.
- `prefers-reduced-motion` respeitado.

### 10.5 Confiabilidade e custo

- Reprocessamentos não geram cobranças duplicadas.
- Limites de uso e orçamento por prova gratuita.
- Fallback entre modelos quando aprovado.
- Alertas para taxa de erro, fila, latência e custo.
- Degradação segura: material permanece editável mesmo se a geração falhar.

## 11. Modelo de domínio conceitual

| Entidade | Responsabilidade |
|---|---|
| UsuárioAluno | Identidade, faixa etária, preferências permitidas |
| Responsável | Vínculo, consentimento quando aplicável, pagamento |
| EstadoConsentimento | Base, versão, data, escopo e revogação |
| Prova | Unidade de urgência, valor e paywall |
| Material | Arquivo, tipo, origem, status e retenção |
| TrechoFonte | Texto confirmado e página ou timecode no material |
| Tema | Agrupador persistente dentro de matéria |
| Conceito | Unidade de domínio e progresso |
| ItemPratica | Pergunta, resposta, explicação, tipo e fonte |
| EstadoMemoria | Dificuldade, estabilidade e recuperabilidade |
| SessaoEstudo | Fila, duração, respostas e resumo |
| Resposta | Tentativa, dica, avaliação e latência |
| SinalizacaoQualidade | Item, motivo e resolução |
| LinkResponsavel | Token, escopo, validade e status |
| Assinatura | Plano, status e provedor de pagamento |
| EventoProduto | Evento versionado sem conteúdo sensível desnecessário |

`Tema` e `Conceito` podem começar simples. Grafo de pré-requisitos e knowledge
tracing avançado só entram após sinal de necessidade e dados suficientes.

## 12. Lógica de seleção do MVP

A fila usa heurística explicável:

1. itens vencidos para revisão;
2. cobertura da prova mais próxima;
3. conceitos com maior erro;
4. alternância moderada entre temas;
5. limite pelo tempo da sessão.

FSRS agenda itens. Um escore simples por conceito resume desempenho; não alegar
que o algoritmo “descobriu como o aluno aprende”.

## 13. Monetização

### 13.1 Modelo

- Primeira prova: grátis, até três materiais.
- Revisão dessa prova: continua disponível.
- Segunda prova: requer assinatura.
- Pagamento: iniciado pelo link compartilhado com o responsável.

### 13.2 Preço

`R$ 29,90/mês` é hipótese, não decisão. O preço final depende de:

- disposição a pagar no Wizard of Oz;
- custo por prova e aluno ativo;
- conversão do responsável;
- comparação com alternativas;
- impostos, taxas e chargeback.

### 13.3 Princípios

- Não bloquear o que já foi criado.
- Não vender logo após um resultado ruim.
- Não usar urgência enganosa.
- Não expor desempenho detalhado para pressionar o responsável.

## 14. Go-to-market inicial

### 14.1 Canal

TikTok pode ser canal de descoberta, mas não deve ser tratado como distribuição
garantida. No Brasil, a plataforma restringe personalização de anúncios para
usuários de 13 a 17 anos; plano de mídia precisa considerar alcance e segmentação
limitados.

### 14.2 Criativos

- demonstração real: material → texto → prática;
- situação concreta de prova;
- linguagem não clínica;
- sem depoimentos, métricas ou nomes inventados;
- autorização específica para qualquer imagem ou fala de menor.

### 14.3 Loop permitido no MVP

Somente compartilhamento de progresso sanitizado e link do responsável. Feed,
stories, materiais de turma e artefatos de estudo públicos ficam fora.

## 15. Métricas

### 15.1 North star

**Conceitos retidos por aluno ativo por semana.**

Definição inicial de conceito retido: pelo menos duas recuperações corretas,
separadas por sete dias ou mais, com ao menos uma sem dica. A definição deve ser
versionada e reavaliada.

### 15.2 Funil

| Etapa | Métrica |
|---|---|
| Aquisição | visita → início |
| Ativação | início → material confirmado |
| Aha | material confirmado → primeiro item respondido |
| Primeira entrega | upload → sessão concluída em 24 h |
| Retenção | D7, D14 e retorno para revisão vencida |
| Aprendizado | acerto em reencontro espaçado |
| Qualidade | item ruim, item inválido, correção de OCR |
| Conversão | paywall → link → checkout iniciado → pagamento |
| Economia | custo por prova gratuita e por aluno ativo |

### 15.3 Metas de validação

**Wizard of Oz**

- 10–15 famílias.
- 50% dos alunos completam três sessões por semana na terceira semana.
- 70% avaliam os itens como úteis para a prova.
- 80% dos materiais suportados chegam a texto aproveitável após correção.

**MVP beta**

- mediana de tempo até primeiro item respondido < 5 minutos;
- upload confirmado → sessão concluída em 24 h > 60%;
- itens sinalizados como ruins < 10% no início, com tendência decrescente;
- pelo menos 25% dos alunos no paywall geram link para o responsável;
- custo de IA e processamento < 15% do ticket projetado no cenário pago.

Metas D30 e conversão final serão definidas após baseline real.

### 15.4 Antimétricas

- cards respondidos por dia;
- tempo total de tela;
- streak máximo;
- número de notificações abertas;
- quantidade de conteúdo gerado.

Essas métricas não podem ser objetivos de otimização isolados.

## 16. Riscos e mitigação

| Risco | Sinal | Mitigação / gate |
|---|---|---|
| OCR ruim em foto real | muita edição ou abandono | WoZ com fotos reais; recaptura; limiar de confiança |
| Áudio ruidoso ou fala sobreposta | transcrição inutilizável | benchmark com gravações ruins; timecode; edição; regravação |
| Item não serve para a prova | sinalização e baixo reencontro | fonte, validação, conjunto dourado, amostragem |
| Recall insuficiente em STEM | acerto de fatos sem resolver aplicação | item de aplicação e passo faltante já no MVP |
| Sessão longa ou confusa | abandono antes do terceiro item | fila curta, uma ação primária, fim claro |
| Custo do grátis | custo por prova acima do teto | batch, cache privado permitido, limites, roteamento |
| Produto vira cola | pedidos de resposta pronta | dois modos de tutor com guardrails, tentativa antes da solução, fonte e recusa de avaliação ativa |
| Claim de TDAH | percepção clínica ou regulatória | linguagem não clínica; sem dado de saúde |
| Tratamento de dados de menores | bloqueio jurídico ou incidente | privacy by design, RIPD, fluxo validado, minimização |
| Material de terceiros | compartilhamento indevido | uso privado; sem deck/material compartilhável |
| TikTok não entrega aquisição | CAC ou alcance inviável | orgânico, creator tests e canais alternativos |
| Responsável não converte | links sem pagamento | pesquisa de preço, página clara, prova de valor mínima |

## 17. Compliance e proteção de menores

Este PRD não substitui parecer jurídico. Antes de beta público:

1. mapear dados, finalidades, bases legais, operadores e transferências;
2. definir faixas etárias e mecanismos apropriados;
3. produzir avaliação de impacto e registro de riscos;
4. validar consentimento, vínculo e supervisão do responsável;
5. publicar avisos em linguagem simples para aluno e responsável;
6. definir retenção, exportação, correção e exclusão;
7. configurar privacidade máxima por padrão;
8. revisar fornecedores, publicidade, notificações e pagamento;
9. criar resposta a incidente e canal de direitos;
10. testar abuso, enumeração de links e exposição de desempenho.

A LGPD exige melhor interesse no tratamento de dados de crianças e adolescentes.
O ECA Digital (Lei 15.211/2025), em vigor desde 17/03/2026, acrescenta deveres de
proteção por padrão, gestão de risco, experiências adequadas à idade e
supervisão parental para serviços direcionados ou de acesso provável por esse
público.

## 18. Plano de validação

### Fase 0 — Wizard of Oz

Validar manualmente:

- vontade de enviar material;
- qualidade de fotos e PDFs reais;
- edição do OCR;
- utilidade dos três tipos de item;
- duração de sessão;
- retorno para revisão;
- entendimento e disposição a pagar do responsável.

**Saída:** evidência dos gates do §15.3 e decisão de continuar, ajustar ou parar.

### Fase 1 — MVP beta fechado

Construir o loop completo com poucos usuários, telemetria e operação assistida.
Sem aquisição paga em escala.

**Saída:** qualidade, segurança, custo e retenção suficientes para beta aberto.

### Fase 2 — MVP aberto controlado

Adicionar checkout real, ampliar aquisição e testar preço. Manter revisão humana
por amostra e limites de uso.

### Pós-MVP

Priorizar por evidência:

1. remediação e tipos de item mais ricos;
2. relatório do responsável;
3. personalização avançada;
4. pesquisa web controlada e outras ferramentas do Tutor;
5. produto professor/turma, apenas com sinal real.

## 19. Decisões fechadas

- Categoria: tutor de estudo adaptativo pós-aula.
- Recorte inicial: 13–17 anos, STEM secundário, Brasil.
- Entrada: imagem, PDF e áudio; gravação no app.
- Voz: contexto, resposta, ações e conversa nos dois modos do Tutor.
- Unidade de valor e paywall: prova.
- Gratuito: uma prova, até três materiais.
- Core: OCR revisável, prática com fonte, feedback, revisão e progresso.
- Sessão: 10 minutos por padrão; botão principal e swipe vertical como atalho.
- Progresso: por tema/conceito, sem ranking.
- Tutor do Card e Chat do Tutor com histórico: dentro do MVP.
- Chat social, pesquisa web autônoma, exportação e linhagem contínua: fora do
  MVP.
- TDAH: lente de design, não dado, claim ou diagnóstico.
- Materiais: privados e não compartilháveis.
- Preço: hipótese.
- Privacidade e fluxo de menores: gate bloqueante antes do beta.

## 20. Decisões abertas e donos

| Decisão | Dono | Prazo/gate |
|---|---|---|
| Nome após busca de marca e domínio | Founder/Legal | antes da identidade pública |
| Fluxo de idade, consentimento e supervisão | Product/Legal/Privacy | antes do beta |
| Política de retenção | Privacy/Engineering | antes de dados reais |
| Plataforma cliente | Engineering/Product | arquitetura da Fase 1 |
| Provedor de OCR | Engineering | spike com materiais reais |
| Provedor de STT e estratégia para áudio ruim | Engineering/ML | spike com gravações reais |
| Provedor(es) de modelo | Engineering/ML | benchmark de qualidade/custo |
| Gateway de pagamento | Business/Engineering | antes do MVP aberto |
| Preço | Founder/Product | após WoZ |
| Limite de arquivo e páginas | Engineering/Product | spike de custo |
| Limite de duração e tamanho de áudio | Engineering/Product | spike de custo e latência |
| Definição final de domínio | Product/Data | após baseline de revisão |

## 21. Evidência e honestidade de claims

**Forte no workspace:** recuperação ativa, espaçamento, feedback, mastery,
exercícios curtos e estruturados.

**Moderado/contextual:** tutoria por IA constrangida, interleaving, cards
conceituais, suportes para atenção.

**Hipótese:** superioridade educacional do FSRS sobre SM-2, gamificação
específica para TDAH, adaptação automática de “estilo de aprendizagem”, eficácia
igual em todas as matérias.

Regra editorial: nunca converter uma hipótese de produto em fato de marketing.

## 22. Referências

### Evidência interna

- `research_results/Evidence-Based Post-Class Learning Interventions  A Literature Review.md`
- `research_results/Personalized Learning and Instructional Adaptations in K–12  A Graduate-Level Evidence Review.md`
- `research_results/Personalized Learning in K–12  Evidence for Children and Adolescents, with a Focus on ADHD and Attention Difficulties.md`
- `research_results/Scientific Evidence on Anki as a Personalized Learning System.md`

### Regulação e canal

- [LGPD — Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [ECA Digital — Lei 15.211/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm)
- [ANPD — tratamento de dados de crianças e adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes)
- [TikTok Ads — proteção de menores](https://ads.tiktok.com/help/article/protecting-minors-on-tiktok-advertising-initiatives)
