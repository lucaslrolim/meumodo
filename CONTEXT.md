# Meu Modo

Vocabulário canônico do domínio de aprendizagem do Meu Modo. Este arquivo
define os termos compartilhados; decisões de implementação pertencem à
documentação técnica.

## Material e conhecimento

**Material**:
Conteúdo enviado pelo aluno para preparar uma prova.
_Evitar_: documento, arquivo, fonte como sinônimos genéricos

**Versão do Material**:
Representação do material que foi extraída ou transcrita e confirmada pelo
aluno.
_Evitar_: OCR final, texto limpo

**Trecho-Fonte**:
Recorte rastreável de uma versão do material, localizado por página e região ou
por intervalo de tempo.
_Evitar_: chunk, pedaço

**Ontologia**:
Vocabulário versionado que define os tipos de conhecimento e as relações
permitidas entre eles.
_Evitar_: taxonomia, grafo

**Conceito**:
Unidade curricular canônica que pode ser ensinada, praticada e avaliada.
_Evitar_: tópico, tag

**Relação de Conceitos**:
Ligação tipada e direcionada entre conceitos, como pré-requisito, aplicação ou
equivalência.
_Evitar_: link, associação

## Cards e aprendizagem

**Grupo de Cards**:
Objetivo pedagógico estável que reúne cards relacionados, sua cobertura e suas
lacunas.
_Evitar_: deck, pasta, coleção

**Card**:
Atividade atômica, respondível e ancorada em pelo menos um trecho-fonte.
_Evitar_: flashcard, item de estudo, questão quando se referir à entidade

**Versão do Card**:
Conteúdo imutável de uma revisão publicada de um card.
_Evitar_: edição, estado atual

**Relação de Cards**:
Ligação tipada entre cards que expressa hierarquia, variante, evolução,
remediação ou subsunção.
_Evitar_: parentesco, link

**Linhagem do Card**:
Histórico preservado das versões e relações de evolução de um card.
_Evitar_: histórico de edição

**Depreciação do Card**:
Mudança explícita que impede novas seleções de um card sem apagar suas versões,
fontes, relações ou tentativas anteriores.
_Evitar_: exclusão do card, arquivamento, aposentadoria

**Tentativa**:
Resposta do aluno a um card, incluindo modalidade, avaliação, ajuda usada e
feedback.
_Evitar_: resposta quando se referir ao evento completo

**Estado de Aprendizagem do Card**:
Estimativa individual que orienta quando um card deve reaparecer.
_Evitar_: domínio do card, memória do card

**Domínio do Conceito**:
Estimativa agregada das evidências de aprendizagem de um aluno sobre um
conceito.
_Evitar_: progresso, nível

## Tutor

**Tutor do Card**:
Modo do tutor aberto dentro de uma atividade. O card, a pergunta, a tentativa e
a fonte atuais recebem o maior peso, sem impedir perguntas sobre outro conteúdo
autorizado do aluno.
_Evitar_: ajuda do card, dica automática, tutor limitado ao card

**Chat do Tutor**:
Espaço próprio de conversa em que o aluno pergunta sobre qualquer conteúdo
disponível em seu conhecimento autorizado e pode escolher um escopo mais
específico.
_Evitar_: chat aberto, chatbot geral, conversa social

**Conversa do Tutor**:
Linha persistente de mensagens em um dos dois modos do tutor, com escopo,
histórico e origem das respostas preservados.
_Evitar_: sessão de estudo, memória do tutor, histórico genérico

**Mensagem do Tutor**:
Interação escrita ou falada de uma conversa do tutor, com autoria, modalidade
e referências de origem quando aplicáveis.
_Evitar_: prompt, completion, resposta da IA

**Pedido Contextual**:
Pedido escrito ou falado que pede ao tutor uma ação ou explicação dentro do
escopo ativo da conversa.
_Evitar_: comando de voz, intenção solta

**Contexto Fundamentado**:
Conjunto mínimo de trechos, cards, relações e estado pedagógico recuperado com
citações para uma execução do tutor.
_Evitar_: prompt inteiro, memória completa

**Memória do Tutor**:
Observação longitudinal e corrigível usada para personalizar a forma de ajudar
um aluno.
_Evitar_: histórico de conversa, estado de aprendizagem
