# Histórico de decisões e arquivo — Meu Modo

Esta pasta preserva briefings, pesquisas, rascunhos e handoffs que já não são
fontes de verdade para a implementação atual, mas registram como o projeto
chegou às decisões consolidadas.

## Fontes atuais de verdade

- `../../CONTEXT.md` — vocabulário canônico do domínio.
- `../final/` — decisões consolidadas de produto, posicionamento, arquitetura,
  plano de execução, agentes e algoritmo.
- `../../mock/meumodo_mock.html` — referência viva de UX e microinterações.
- `../../web/` — implementação atual do protótipo.

## Linha do tempo registrada

1. **Briefing e tese inicial:** `BRIEFING_MeuModo.md` delimitou o problema,
   público, tom de voz, entidades e fluxos iniciais.
2. **Produto e estratégia:** `PRD_MeuModo.md` e
   `ESTRATEGIA_FINAL_MeuModo.md` detalharam o MVP, riscos, métricas e decisões
   de validação.
3. **Posicionamento e marca:** `POSICIONAMENTO_MeuModo.md`,
   `BRAND_MeuModo.md` e `tokens_meumodo.json` registraram a linguagem, o
   sistema visual e os valores de design.
4. **Exploração de UX:** `wireframe_meumodo.html` documentou a exploração de
   telas antes da referência viva em `mock/`.
5. **Pesquisa:** `research_results/` reúne as evidências usadas para orientar
   personalização, reforço pós-aula, atenção e agendamento.
6. **Handoff de implementação:** `DESIGN_OVERHAUL_HANDOFF.md` registra o
   estado e as regras do overhaul visual que já foram incorporados em `web/`.
7. **Consolidação:** os documentos em `../final/` substituem os rascunhos como
   referência operacional; os arquivos desta pasta permanecem somente para
   rastreabilidade e contexto.

## Regra de manutenção

Novos briefings, pesquisas e decisões superadas devem ser salvos aqui, com uma
entrada correspondente neste arquivo. Decisões vigentes devem ser atualizadas
em `../final/` ou em `../../CONTEXT.md`; não use um documento arquivado como
fonte de implementação sem conferir a versão consolidada.
