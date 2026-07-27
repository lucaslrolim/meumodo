"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, ArrowUp, X } from "@phosphor-icons/react/ssr";
import { toast } from "sonner";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { MmButton } from "@/components/ui/mm-button";
import { MmChip } from "@/components/ui/mm-chip";
import { ActionRail } from "@/components/session/action-rail";
import type { Card } from "@/types/domain";
import { success, pointsPop } from "@/lib/motion";

/** Correct/incorrect feedback sheet. Swipe-up-to-advance is layered on top
 * of the required tap target, never a substitute for it. On correct
 * answers, shows a floating points pop and a like counter for the card. */
export function FeedbackSheet({
  card,
  correct,
  skipped,
  pointsEarned = 0,
  open,
  onOpenChange,
  onNext,
  onExplainDifferently,
  onViewSource,
}: {
  card: Card;
  correct: boolean;
  skipped?: boolean;
  pointsEarned?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
  onExplainDifferently: () => void;
  onViewSource: () => void;
}) {
  const checkRef = useRef<HTMLSpanElement>(null);
  const pointsRef = useRef<HTMLSpanElement>(null);
  const touchYRef = useRef<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [likedCardId, setLikedCardId] = useState(card.id);

  if (card.id !== likedCardId) {
    setLikedCardId(card.id);
    setLiked(false);
  }

  useEffect(() => {
    if (!open || !correct) return;
    if (checkRef.current) success(checkRef.current);
    if (pointsRef.current && pointsEarned > 0) pointsPop(pointsRef.current);
  }, [open, correct, pointsEarned]);

  useEffect(() => {
    if (!open || !correct) return;
    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchYRef.current == null) return;
      const dy = touchYRef.current - (e.changedTouches[0]?.clientY ?? 0);
      if (dy > 70) onNext();
      touchYRef.current = null;
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 40) onNext();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
    };
  }, [open, correct, onNext]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="relative gap-0 bg-mm-surface pb-8">
        <div className="flex items-center justify-end border-b border-mm-border px-5 py-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="flex size-7 items-center justify-center text-mm-mut transition-transform active:scale-90"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="relative px-5 pt-4">
        {correct && pointsEarned > 0 && (
          <span
            ref={pointsRef}
            className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 font-heading font-black text-3xl text-mm-xp opacity-0 drop-shadow-[0_0_16px_var(--mm-xp-soft)]"
          >
            +{pointsEarned} ⚡
          </span>
        )}
        {correct ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <span
                ref={checkRef}
                className="flex size-11 items-center justify-center rounded-full bg-mm-brand text-mm-on-brand"
              >
                <CheckCircle size={24} weight="fill" />
              </span>
              <div className="font-heading font-extrabold text-[22px] text-mm-ink">
                Boa. {card.answer} {card.unit}
              </div>
            </div>
            <div className="font-mono text-sm leading-loose mb-3 text-mm-ink-2">
              {card.steps.map((step, i) => (
                <div key={i}>{step}</div>
              ))}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <MmChip onClick={onViewSource}>Ver na fonte</MmChip>
                <MmChip onClick={onExplainDifferently}>Explica de outro jeito</MmChip>
              </div>
              <div className="flex items-center justify-end">
                <ActionRail
                  liked={liked}
                  likeCount={card.likeBaseline + (liked ? 1 : 0)}
                  onLike={() => setLiked((v) => !v)}
                  onShare={() => toast("Link copiado! Manda pro seu grupo 🚀")}
                />
              </div>
            </div>
            <MmButton size="block" onClick={onNext}>
              Próximo
            </MmButton>
            <div className="flex flex-col items-center gap-0.5 mt-4 text-mm-mut text-[11px] font-heading font-bold">
              <ArrowUp size={16} weight="bold" />
              desliza pra próxima
            </div>
          </>
        ) : (
          <>
            <div className="font-heading font-extrabold text-[22px] mb-1 text-mm-ink">
              Quase. Olha este passo.
            </div>
            {skipped && (
              <div className="text-[13px] mb-3 text-mm-ink-2">
                Sem problema pular — mas confere o caminho:
              </div>
            )}
            <div className="rounded-2xl p-3.5 mb-3 font-mono text-sm leading-loose bg-mm-surface-alt text-mm-ink">
              {card.steps.map((step, i) => (
                <div key={i}>{step}</div>
              ))}
            </div>
            <div className="text-sm mb-4 text-mm-ink-2">
              Resposta certa:{" "}
              <b className="font-heading text-mm-ink">
                {card.answer} {card.unit}
              </b>
            </div>
            <div className="flex flex-col gap-2.5">
              <MmButton size="block" onClick={onNext}>
                Tentar uma parecida
              </MmButton>
              <MmButton variant="secondary" size="block" onClick={onExplainDifferently}>
                Ver explicação
              </MmButton>
            </div>
          </>
        )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
