# Meu Modo — Design Overhaul Handoff (TikTok core + Duolingo gamification + NG Cash GenZ)

## Mission

Finish the design overhaul of the Meu Modo web app (`web/`, Next.js 16 + React 19 + Tailwind 4 + shadcn + @phosphor-icons/react + GSAP + zustand, dev server port 3210). Brand canon lives in `agents_workspace/old/BRAND_MeuModo.md` + `agents_workspace/old/tokens_meumodo.json`. Domain vocabulary in `CONTEXT.md` (use it; never "flashcard", "chunk", "deck"). Voice: PT-BR informal ("bora", "tá certo"), native emoji only (📸⚡🔥❤️🎯💡🎤), never corporate emoji (📊📈💼🎓).

**Hard design rules (do not violate):**
- Heart pink `#FF2D55` (`--mm-heart`) is EXCLUSIVE to the like action.
- One accent color per viewport.
- Side-rail actions only on the answer view (question view keeps pista/tutor/fonte only).
- Chunky 3D button language (hard offset shadow) is the Duolingo signature — keep it.
- Mocked demo data is the project convention (streak = 7, xp = 340, gems = 26, student "Ana").

## Already implemented — DO NOT redo, build on top

1. **`web/src/app/globals.css`** — gamification tokens in `:root`: `--mm-xp #FFD700`, `--mm-xp-soft`, `--mm-streak #FF6B35`, `--mm-streak-soft`, `--mm-mastery #BF5AF2`, `--mm-mastery-soft`, `--mm-gem #64D2FF`, `--mm-heart #FF2D55`, `--mm-heart-soft`, `--mm-on-brand #0a2410`. `.mm-night` scope with the full dark product palette (canvas `#131f24`, surface `#1a2b32`, surface-alt `#233138`, ink `#f7f7f7`, border `#32464f`; `brand-d`/`brand-ink` flip to bright `#4ae54a` on dark). All tokens mapped in `@theme inline` → utilities like `text-mm-xp`, `bg-mm-streak-soft`, `text-mm-mastery`, `bg-mm-heart-soft`, `text-mm-on-brand` exist.
2. **`web/src/components/layout/night-scope.tsx`** — client component adding/removing `mm-night` on `document.body` (body-level so drawer/toast portals inherit). Mounted in `web/src/app/(app)/layout.tsx`. Public routes stay light.
3. **On-brand text fixes** — every `bg-mm-brand` fill now pairs with `text-mm-on-brand` (mm-button primary, tutor bubbles, mic buttons, modo-card logo, share chip, etc.).
4. **`web/src/components/game/game-header.tsx`** — Duolingo stat bar (Fire `text-mm-streak`, Lightning `text-mm-xp`, Gem `text-mm-gem` pills + avatar), mounted on `home/page.tsx` (props: streak=7 xp=340 gems=26, mocked).
5. **`web/src/components/ui/mm-progress.tsx`** — `tone` now `"brand" | "warn" | "mut" | "mastery"`; mastery fills with `var(--mm-mastery)`.
6. **`home/page.tsx`** — GameHeader + slimmer greeting; exam card has `border-mm-brand/50` + `shadow-[0_0_28px_var(--mm-brand-glow)]`; steady concepts use mastery tone + "firme 💜".
7. **`(public)/page.tsx` landing** — stays LIGHT; hero has 3 gamification chips; final CTA is a dark band (`bg-[#131f24]`).
8. **`home/story-row.tsx`** — rewritten: gradient rings (brand→info) + "ao vivo" badge for live stories, dark surface circles.
9. **`home/video-carousel.tsx`** — rewritten: TikTok-dark moody gradients (`#123B22→#1E6B33`, `#0E2A3D→#155E75`, `#2E1A47→#5B21B6`, `#3D1420→#9D174D`), white text, `from-black/70` bottom overlay, `border-white/10`.
10. **`session/feedback-sheet.tsx`** — points pop is now gold: `text-mm-xp` + `drop-shadow-[0_0_16px_var(--mm-xp-soft)]`, text `+{pointsEarned} ⚡`; like button liked state is `border-mm-heart/50 bg-mm-heart-soft text-mm-heart shadow-[0_0_18px_rgba(255,45,85,0.35)]`; new share button (`ShareNetwork`) → `toast("Link copiado! Manda pro seu grupo 🚀")`.
11. **`web/src/components/game/confetti.tsx`** — NEW GSAP confetti burst (28 pieces, brand gamification colors, respects `prefersReducedMotion`). Props: `{ fire: boolean }`. Imports `gsap, prefersReducedMotion` from `@/lib/motion`.

## Remaining work — implement exactly this

### Task 1 — Finish session summary page (PARTIALLY DONE, must complete)

File: `web/src/app/(app)/exam/[id]/session/summary/page.tsx`

Current state: the import edit was already applied — the file now imports `CheckCircle, Fire, Lightning` from phosphor, plus `Confetti` from `@/components/game/confetti`, but **Fire, Lightning and Confetti are not used yet** (lint will fail on unused imports). Apply these body edits:

a) Root container — make it relative and mount Confetti as first child:

```tsx
<div className="relative flex flex-1 flex-col overflow-y-auto">
  <Confetti fire={correctCount > 0} />
```

b) Badge — add green glow to the existing badge div: append `shadow-[0_0_32px_var(--mm-brand-glow)]` to its className.

c) Points chip — replace the single warn-toned chip with a Duo-style stat pair (streak mocked at 7, same convention as GameHeader):

```tsx
{totalPoints() > 0 && (
  <div className="mt-3 flex items-center justify-center gap-2">
    <span className="inline-flex items-center gap-1 rounded-full bg-mm-xp-soft px-3.5 py-1.5 font-heading font-extrabold text-sm text-mm-xp">
      <Lightning size={14} weight="fill" /> +{totalPoints()} pontos
    </span>
    <span className="inline-flex items-center gap-1 rounded-full bg-mm-streak-soft px-3.5 py-1.5 font-heading font-extrabold text-sm text-mm-streak">
      <Fire size={14} weight="fill" /> 7 dias seguidos
    </span>
  </div>
)}
```

d) Concept rows — steady concepts go mastery-purple. In the concepts map, change the status span and MmProgress:

```tsx
<span className={c.status === "steady" ? "text-mm-mastery" : "text-mm-ink-2"}>
  {c.status === "steady" ? "subiu ↑" : `${c.mastery}%`}
</span>
<MmProgress
  value={c.mastery}
  tone={c.status === "starting" ? "mut" : c.status === "steady" ? "mastery" : "brand"}
/>
```

### Task 2 — Session page points chip → XP gold

File: `web/src/app/(app)/exam/[id]/session/page.tsx`. Read it first. The header has a ⚡ points chip; if it uses `bg-mm-warn-soft`/`text-mm-warn-ink`, change to `bg-mm-xp-soft`/`text-mm-xp`. Also scan for any hardcoded light-theme hexes or `bg-white` and convert to mm tokens. The green/blue glow blobs (`bg-mm-brand/…`, `bg-mm-info/…` at low opacity) are fine on dark — leave them.

### Task 3 — Spot-check shared chrome for light-theme leftovers

Read `web/src/components/layout/bottom-nav.tsx` and `web/src/components/layout/app-header.tsx`. They are var-driven and should flip dark automatically (active nav item uses `text-mm-brand-ink` which flips to bright green — correct). Only fix hardcoded colors if found. Then grep the whole app group for hardcoded hexes and fix any stragglers:

```bash
grep -rnE "#[0-9a-fA-F]{3,8}\b" web/src/app/\(app\) web/src/components --include="*.tsx" | grep -v "0_0_\|rgba\|#131f24\|#f7f7f7"
```

(The landing's dark band and shadow rgba()s are intentional — skip those.)

### Task 4 — Lint + build

```bash
cd web && npm run lint && npm run build
```

Fix any TS/lint errors (unused imports, missing deps). Do not weaken lint config to pass.

### Task 5 — Browser verification at 375×812 (mobile viewport)

With the dev server on port 3210, verify each route and confirm: dark palette applied (`#131f24` canvas), no white flashes, readable contrast, gamification colors in the right places (gold XP, fire streak, purple mastery, pink ONLY on like). Routes:

- `/` (landing — must stay LIGHT, dark CTA band at bottom)
- `/home` (GameHeader, glowing exam card, stories with live rings, dark video cards)
- `/exam/new`, `/exam/exam-1/materials`, `/exam/exam-1/ready` (dark, var-driven)
- `/exam/exam-1/session` — answer a card correctly: FeedbackSheet shows gold `+10 ⚡` pop, pink heart like button (tap it → burst + glow), share button toast
- `/exam/exam-1/session/summary` — confetti fires, XP + streak chips, steady concepts purple
- `/tutor`, `/subscribe` (dark, var-driven)

Max 2 screenshots per screen; batch DOM assertions into single `evaluate_script` calls.

## Done criteria

- Build + lint clean.
- All app routes render dark-first; landing stays light.
- Gamification palette visible: gold XP pops/chips, fire streak, purple mastery, gem blue in header; pink heart exclusively on the like action.
- No flow/route changes — this was a design overhaul only.
