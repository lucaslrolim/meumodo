# Meu Modo — Brand Guidelines

**Última atualização:** Julho 2026.  
**Fonte canônica:** este documento + `tokens_meumodo.json`.  
**Inspirações:** Duolingo (gamificação, tom, redondeza), TikTok (formato imersivo, dark-first, side actions), NG Cash (voz brasileira jovem, identidade/posse), Descomplica (contexto edtech BR, comunidade).

---

## 1. O nome e a marca

### Conceito

"Meu Modo" carrega dois significados que se sobrepõem exatamente onde o produto opera:

1. **"Do meu jeito"** — a promessa central: estudar como você aprende, não como mandam. Sessões curtas, sem pressão, no seu ritmo.
2. **"Meu modo de estudar"** — o hábito que o produto cria. Um modo. Um estado. Como "Modo Foco" ou "Modo Estudo".

A marca **não tem símbolo/logo definido ainda**. O wordmark é a prioridade. Um símbolo (mascote? ícone abstrato?) é fase 2.

### Variantes

| Variante | Uso |
|---|---|
| **Wordmark** | Default: header do app, landing page, link de pagamento |
| **Ícone** | App store, favicon |

### Regras

- Sempre "Meu Modo", nunca "meumodo", "MEU MODO", "MeuModo"
- No app: aparece na status bar, à esquerda
- Na landing page: centralizado, acima do hero
- Nunca usar em caixa alta ou com tracking alargado. É informal, não corporativo.

---

## 2. Tipografia

### Stack

| Role | Typeface | Weight | Uso |
|---|---|---|---|
| **Display** | Nunito | 700–800 | Hero da landing, celebrações in-app (+10 XP), números grandes |
| **Headline** | Nunito | 600–700 | Headlines de seção, títulos de card |
| **Body** | Inter | 400–500 | Texto corrido, perguntas de card, inputs, labels |
| **Eyebrow** | Inter | 600, `0.12em` uppercase | Labels acima de seções (raras no app, mais comuns na landing) |
| **Mono** | JetBrains Mono | 400 | Equações e fórmulas nos cards de exatas |

**Duas fontes, três vozes.** Nunito é a alma — a redondeza que remete ao Duolingo, amigável, sem ser infantil. Inter é o corpo — legível em tela, neutro, não compete. JetBrains Mono só aparece quando a matéria exige: física, química, matemática.

### Scale

`xs: 0.69rem` → `sm: 0.83rem` → `base: 1rem` → `md: 1.2rem` → `lg: 1.44rem` → `xl: 1.73rem` → `2xl: 2.07rem` → `3xl: 2.49rem` → `4xl: 3rem`

### Por que Nunito?

Duolingo usa DIN Round — uma fonte proprietária, arredondada, que faz o aprendizado parecer um jogo. Nunito é o equivalente livre: tem o mesmo caráter "soft" e friendly, pesos variados (200–1000), e funciona bem em dark mode. No app, Nunito aparece em celebrações (+10 XP, "Boa!"), headlines de sessão e títulos de card. No body, Inter mantém a legibilidade.

---

## 3. Cor

### Modo Dark (primário — sessão de estudo)

O app é dark-first. O fundo não é preto puro — é um tom quente e escuro (inspiração: Duolingo dark mode), que cansa menos os olhos em sessões longas. A interface desaparece; o card é o protagonista.

| Token | Hex | HSL | Uso |
|---|---|---|---|
| `bg-dark` | `#131F24` | `195 30% 11%` | Background da sessão de estudo |
| `bg-card` | `#1A2B32` | `198 32% 15%` | Cards de pergunta e resposta |
| `bg-card-alt` | `#233138` | `200 23% 18%` | Cards secundários, feedback, explicações |
| `text-primary` | `#F7F7F7` | `0 0% 97%` | Perguntas, headlines, respostas |
| `text-secondary` | `#A3A3A3` | `0 0% 64%` | Explicações, corpo de texto |
| `text-muted` | `#7A8A90` | `195 10% 52%` | Timestamps, fonte do card, labels |
| `border-dark` | `#3C4D55` | `198 17% 28%` | Bordas de card, separadores |

### Accent Principal — Verde Energia

Referência direta ao Duolingo (#58CC02), mas ajustado para nosso contexto. O verde comunica: "você está evoluindo", "está certo", "continue". É a cor da gamificação positiva.

| Token | Hex | Uso |
|---|---|---|
| `accent` | `#4AE54A` | CTAs primários, acertos, checkmarks, progresso preenchido |
| `accent-hover` | `#3CC53C` | Hover state |
| `accent-soft` | `rgba(74,229,74,0.12)` | Backgrounds de badge, chip de acerto |
| `accent-glow` | `rgba(74,229,74,0.25)` | Glow de celebração, sombra de botão |

### Accent Secundário — Rosa Coração

Referência ao TikTok (#FF0050). O rosa é exclusivo para reações emocionais: like, coração, "gostei desse card".

| Token | Hex | Uso |
|---|---|---|
| `heart` | `#FF2D55` | Botão de like ativo, coração preenchido |
| `heart-soft` | `rgba(255,45,85,0.12)` | Background do badge de like |

### Paleta Semântica

| Token | Hex | Uso |
|---|---|---|
| `success` | `#4AE54A` | Acerto, check, conceito dominado |
| `warning` | `#FFD60A` | Atenção, card para revisar |
| `error` | `#FF453A` | Erro na resposta |
| `info` | `#64D2FF` | Dica, explicação, ajuda |

### Paleta de Gamificação

| Token | Hex | Uso |
|---|---|---|
| `xp-gold` | `#FFD700` | Pontos XP, celebração |
| `streak-fire` | `#FF6B35` | Streak de dias, "você está em chamas" |
| `mastery-purple` | `#BF5AF2` | Conceito dominado, barra de mastery completa |
| `gem-blue` | `#64D2FF` | Recompensa rara (fase 2) |

### Regra de uso de cor

- **Uma cor de destaque por viewport.** A sessão de estudo tem verde (acerto, progresso) como dominante. Se o aluno dá like, o rosa aparece pontualmente no botão — mas nunca compete com o verde na mesma tela.
- **Background sempre escuro na sessão.** A cor do app não é preto puro (#000) — é um off-black (#0D0D0D) com leve calor, para não cansar os olhos em sessões longas.
- **Bordas sutis.** #262626 é escuro o suficiente para estruturar sem distrair. A interface some; o card brilha.

### Modo Light (landing page, onboarding, relatório para pais)

O light mode é usado fora da sessão de estudo — momentos de leitura, decisão e clareza.

| Token | Hex | Uso |
|---|---|---|
| `bg-light` | `#FAFAF8` | Background |
| `text-dark` | `#171717` | Texto |
| `text-dark-sec` | `#737373` | Texto secundário |
| `border-light` | `#E5E5E5` | Bordas |

---

## 4. Motion

### Gramática de movimento

| Role | Uso | Valores |
|---|---|---|
| **Pop** | +10 XP ao acertar | `scale: 0.3 → 1.4 → 1, opacity: 1 → 0, 1.8s ease-out` |
| **Swipe** | Transição entre cards | `translateX, 300ms ease-out` |
| **Like** | Coração preenchido | `scale: 1 → 1.25 → 1, 200ms, cor muda para heart` |
| **Voice** | Botão de gravação | `pulse glow: expande 12px e fade, 1s loop` |
| **Progress** | Barra de domínio | `width transition, 600ms ease-out` |
| **Reveal** | Feedback de acerto/erro | `opacity: 0 → 1, y: 8px → 0, 300ms ease-out` |

### Haptics (iOS)

| Evento | Feedback |
|---|---|
| Acerto | `.light` + som curto de "ding" |
| Erro | `.heavy` + som curto de "buzz" |
| Like | `.soft` |
| Streak atingido | `.success` (tripla) + som de celebração |
| Sessão completa | `.success` (tripla) + animação de confete |

### `prefers-reduced-motion`

Respeitado. Sem animação de pop, sem glow. Apenas transições de opacidade.

---

## 5. Voz & Tom

### Cinco adjetivos

**Amigo. Curto. Brasileiro. Acolhedor. Dono.**

### Princípios

| Princípio | Explicação | Exemplo |
|---|---|---|
| **Amigo, não professor** | Fala como um colega que já passou por aquilo. Zero linguagem acadêmica ou corporativa. | "Cola aqui" > "Bem-vindo à plataforma" |
| **Curto, não explicativo** | Frases de 5-8 palavras. Scroll rápido. O app mostra; o texto só complementa. | "Tem prova chegando?" > "Prepare-se para sua avaliação com nosso sistema..." |
| **Brasileiro, não traduzido** | Gírias naturais: "colinha", "mandar bem", "de boa", "tá certo". Nada de "realizar upload" ou "efetuar login". | "Manda a foto" > "Faça o upload" |
| **Acolhedor, não clínico** | "Não é você, é o método" — valida a experiência sem diagnosticar. | "Pra quem estudar do jeito tradicional nunca funcionou" |
| **Dono, não genérico** | "SEU material", "SUA prova", "SEU ritmo". O possessivo é o mais importante. | "É o SEU material" > "Conteúdo personalizado" |

### Convenções

- **Case:** sentence case para todos os labels de UI. "Me explica de outro jeito", não "Me Explica de Outro Jeito".
- **Nome:** sempre "Meu Modo", nunca "meumodo" ou "MEU MODO".
- **Contração:** sempre contraído. "tá", "pra", "num". É oral, não escrito.
- **Pontuação:** ponto final só em parágrafos. Frases soltas (CTAs, labels) sem ponto.

### Não usar nunca

- ❌ "soluções", "plataforma", "ferramenta", "tecnologia", "inovador"
- ❌ "melhore seu desempenho", "aumente sua produtividade", "otimize seu aprendizado"
- ❌ "TDAH", "déficit de atenção", "diagnóstico", "tratamento" (na comunicação com aluno)
- ❌ "realize", "efetue", "utilize", "acesse" — verbos formais
- ❌ emojis corporativos: 📊, 📈, 💼, 🎓

### Usar sempre

- ✓ "colar", "mandar bem", "de boa", "tá certo", "bora"
- ✓ emojis nativos: 📸, ⚡, 🔥, ❤️, 🎯, 💡, 🎤
- ✓ verbos diretos: "manda", "coloca", "tira", "fala", "começa"

---

## 6. Interface — Regras de Layout

### Mobile-first, portrait only

- **Viewport base:** 375×812 (iPhone 14 Pro)
- **Padding horizontal:** 16px em todas as telas
- **Safe area:** 20px top (status bar), 20px bottom (home indicator)
- **Scroll:** vertical apenas. Swipe horizontal = navegação entre cards
- **Sem landscape. Sem tablet no MVP.**

### Estrutura de tela

Toda tela segue a mesma anatomia:

```
┌──────────────────────┐
│ Status bar (20px)    │  hora · nome da tela · ⚡
│ border-bottom dashed │
├──────────────────────┤
│                      │
│ Conteúdo da tela     │  padding: 16px horizontal
│                      │
│                      │
├──────────────────────┤
│ Ações / navegação    │  bottom actions
└──────────────────────┘
```

### Densidade

- **Máximo de 2 ações por tela.** Se houver 3+, priorizar.
- **Um card por vez na sessão de estudo.** Tela cheia, sem scroll.
- **Side buttons:** aparecem apenas na resposta, nunca na pergunta.

---

## 7. Componentes — Especificação

### Botões

**Primário (CTA):** background accent (#4AE54A), texto preto (#0D0D0D), border-radius 999px, padding 13px 28px, Nunito 700, 1rem. Sempre centralizado, sempre largura 100% do container.

**Secundário:** background bg-card-alt (#1F1F1F), texto text-primary (#F5F5F5), border 1px border-dark, border-radius 999px, padding 10px 20px, Inter 500, 0.9rem.

**Side button (TikTok):** background transparente, ícone 44px circular com bg-card-alt, label Inter 400 0.7rem abaixo. Ao pressionar: scale 1.1, 150ms.

**Voice button:** 64px circular, bg-card-alt, border 2px border-dark. Gravando: bg accent, border accent + pulse glow animation.

### Cards

**Pergunta:** bg-card (#1A2B32), border 1px border-dark, border-radius 16px, padding 20px 16px.
**Efeito de elevação:** `box-shadow: 0 2px 0 var(--border-dark)`. No hover: `box-shadow: 0 4px 0 var(--border-dark); transform: translateY(-2px)`. Inspiração Duolingo — o card "levanta" sutilmente, dando sensação de profundidade sem sombras pesadas.

**Resposta (acerto):** bg-card-alt (#233138), mesma estrutura, com faixa verde sutil no topo (2px accent).

**Resposta (erro):** mesma estrutura, com faixa vermelha (2px error).

### Progresso

**Barra:** 6px altura, bg-card-alt, border-radius 999px. Fill: accent, animado com width transition 600ms ease-out.

### Badges & Chips

**Badge:** padding 4px 12px, border-radius 999px, bg accent-soft, texto accent, Inter 600, 0.75rem.

**Chip:** padding 6px 14px, border-radius 999px, bg-card-alt, texto text-secondary, Inter 500, 0.8rem.

### Upload Slots

**Vazio:** 2px dashed border-dark, border-radius 12px, background transparente.

**Preenchido:** 2px solid accent, border-radius 12px, background accent-soft. Checkmark accent dentro.

---

## 8. Dos & Don'ts — Resumo

| Do | Don't |
|---|---|
| Usar verde (#4AE54A) para acertos, progresso, CTAs | Usar verde para erros, alertas ou texto corrido |
| Usar rosa (#FF2D55) exclusivamente para like/coração | Espalhar rosa em outros elementos |
| Fundo escuro (#0D0D0D) na sessão de estudo | Fundo preto puro (#000) ou gradientes |
| Nunito para celebrações e headlines | Nunito para body text ou labels |
| Inter para body, inputs, labels | Inter para headlines display |
| 16px padding horizontal em todas as telas | Variar padding por tela |
| Um card por vez na sessão | Scroll vertical durante a sessão |
| Voz de amigo: "manda a foto", "tá certo" | Voz corporativa: "faça o upload", "correto" |
| "Meu Modo" em sentence case | "meumodo", "MEU MODO", "MeuModo" |
| Side buttons só na resposta | Side buttons visíveis na pergunta |

---

## 9. Como usar este documento

1. **Antes de qualquer tela nova:** consultar §7 (Componentes) para reusar padrões existentes.
2. **Antes de qualquer texto novo:** passar pelo filtro §5 (Voz & Tom).
3. **Antes de qualquer cor nova:** verificar se já existe na paleta §3.
4. **Se um componente não existe:** criá-lo aqui primeiro, depois implementar.

O `tokens_meumodo.json` é a fonte canônica para valores de código (CSS variables, Tailwind config). Este BRAND.md é a fonte canônica para decisões de design.
