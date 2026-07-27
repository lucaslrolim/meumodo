# Briefing — Meu Modo

**Produto:** Tutor individual de IA que transforma o material do próprio aluno (foto de slide, caderno, lista) em estudo adaptativo com flashcards evolutivos.

**Público:** Adolescente 12-17 anos, com dificuldade de atenção (TDAH implícito), que precisa passar na prova.

---

## Posicionamento

- "Pra quem estudar do jeito tradicional nunca funcionou"
- "Tem prova chegando? Cola aqui."
- Focado na SUA prova, com o SEU material, no SEU ritmo
- Sessões de 10 minutos, sem pressão
- "Não é você. É o método."

---

## Tom de voz (NG Cash-inspired)

- Informal, direto, gíria jovem brasileira
- "Cola aqui", "manda a foto", "de graça", "tá certo"
- Sem palavras corporativas ou keynote phrases
- Sem menção a TDAH na comunicação com aluno
- Pronome possessivo é o mais importante: "SEU", "SUA"

---

## Referências de marca

### Duolingo
- Gamificação: XP, streaks, gems, coroas, celebrações
- Tom amigável e encorajador ("Good job!", "You're on fire!")
- Owl mascot (Duo) como personalidade
- Cores vibrantes, shapes redondos, ilustrações

### TikTok
- Dark mode, imersivo, full-screen vertical
- Side buttons (like, comment, share, bookmark)
- Swipe vertical como navegação primária
- Stories/círculos no topo
- Conteúdo gerado pelo usuário como prova social

### NG Cash
- "Feito para a nova geração"
- Customização/identidade ("sua skin", "sua cara")
- Pix, WhatsApp, linguagem de jovem brasileiro
- Diminutivos afetivos ("cofrinho", "grana")
- Informal sem ser infantil

### Descomplica
- Plataforma edtech brasileira
- Aulas ao vivo, cronograma, correção de redação
- Comunidade de estudantes
- Dark mode com tons de roxo/magenta
- Linguagem acessível e motivacional

---

## Fluxo do produto (wireframe v3)

1. **Home**: Stories de alunos + carrossel de vídeos do produto + CTA "Começar de graça"
2. **Pré-estudo**: 3 perguntas guiadas + botão de voz único "fala tudo de uma vez"
3. **Upload**: 3 slots (slide, lista, caderno) + câmera
4. **Review OCR**: Texto extraído editável
5. **Processing**: Loading com progresso
6. **Study (direto, sem confirmação)**: Card TikTok-style
   - Pergunta: sem side buttons, só "Pedir ajuda" + "Colinha" embaixo
   - Resposta: side buttons (❤️ like, 📤 share) + "Me explica de outro jeito"
   - +10 XP pop animado
   - Swipe up = responder, swipe horizontal = próximo card
7. **Session complete**: Resumo + compartilhar progresso
8. **Paywall**: Prova de valor + link pagamento pro pai

---

## Decisões de produto

- Free tier = 1 prova (até 3 materiais)
- Cards mantidos pós-prova, paywall ao adicionar novo material
- OCR via Liteparse com edição pelo aluno
- FSRS como motor de espaçamento
- Modelos chineses (DeepSeek, Qwen) para custo
- TDAH: implícito no site, explícito no design e materiais para pais
- Preço: R$ 29,90/mês (a confirmar)

---

## Entidades

- **Prova**: data, matéria, status (ativa/concluída), materiais associados
- **Tema**: agrupador conceitual ("Cinemática"), persiste entre provas
- **Flashcard**: pergunta, resposta, dica, explicação, fonte, linhagem evolutiva

---

## Documentos no workspace

- `PRD_MeuModo.md` (v0.4)
- `ESTRATEGIA_FINAL_MeuModo.md`
- `POSICIONAMENTO_MeuModo.md`
- `wireframe_meumodo.html`
- `design_system_meumodo.html` (a refazer)
