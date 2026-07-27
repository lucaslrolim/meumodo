"use client";

import { MmButton } from "@/components/ui/mm-button";
import type { Card } from "@/types/domain";
import { AppHeader } from "@/components/layout/app-header";

/** Full-viewport overlay showing the exact source excerpt used to generate
 * the current card. */
export function SourceOverlay({
  card,
  open,
  onClose,
}: {
  card: Card;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-mm-canvas">
      <AppHeader
        title={
          card.source.location.type === "page"
            ? `Fonte · página ${card.source.location.page}`
            : "Fonte · trecho de áudio"
        }
        onBack={onClose}
      />
      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="rounded-xl bg-[#F5F2EA] border border-[#E7E1D2] p-5 text-[#33322E] -rotate-[0.4deg]">
          <div className="font-heading font-bold mb-2">Lista de exercícios — MRU</div>
          <div className="rounded bg-mm-brand-soft -mx-1 px-1 py-1 leading-relaxed">
            {card.source.text}{" "}
            <span className="font-mono text-xs">
              {card.formula} = {card.answer} {card.unit}
            </span>
          </div>
        </div>
        <div className="text-center text-[12.5px] mt-4 text-mm-ink-2">
          Trecho usado pra criar a questão.
        </div>
      </div>
      <div className="px-8 pb-10">
        <MmButton size="block" onClick={onClose}>
          Voltar pra questão
        </MmButton>
      </div>
    </div>
  );
}
