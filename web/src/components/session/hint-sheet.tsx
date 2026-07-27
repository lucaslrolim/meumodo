"use client";

import { Lightbulb } from "@phosphor-icons/react/ssr";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { MmButton } from "@/components/ui/mm-button";
import type { Card } from "@/types/domain";

/** Bottom sheet showing the card's hint and formula. */
export function HintSheet({
  card,
  open,
  onOpenChange,
  onStillStuck,
}: {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStillStuck: () => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-mm-surface border-mm-border p-5 pb-8 gap-0">
        <div className="flex items-center gap-2.5 mb-3">
          <Lightbulb size={20} weight="bold" className="text-mm-warn-ink" />
          <span className="font-heading font-extrabold text-lg text-mm-ink">Pista</span>
        </div>
        <p className="text-[15px] leading-relaxed text-mm-ink">{card.hint}</p>
        {card.formula && (
          <div className="font-mono text-[15px] mt-4 rounded-xl border-[1.5px] border-mm-border bg-mm-canvas px-4 py-3 text-mm-info-ink">
            {card.formula}
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <MmButton variant="secondary" className="flex-1" onClick={onStillStuck}>
            Ainda travado
          </MmButton>
          <MmButton className="flex-1" onClick={() => onOpenChange(false)}>
            Já sei, responder
          </MmButton>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
