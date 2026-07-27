"use client";

import { useEffect, useRef } from "react";
import type { Card } from "@/types/domain";
import { nextCard } from "@/lib/motion";

/** Full-bleed question: one activity per viewport, entering with a
 * "next card" motion beat as the session advances. Source attribution
 * lives outside this component, bottom-left above the CTA row. */
export function QuestionStage({ card, children }: { card: Card; children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stageRef.current) nextCard(stageRef.current);
  }, [card.id]);

  return (
    <div ref={stageRef} className="flex flex-1 flex-col justify-center px-6 pr-20 min-h-0">
      <div className="text-xs font-black uppercase tracking-wider text-mm-brand-ink mb-3">
        {card.concept}
      </div>
      <div
        className="font-heading font-extrabold text-[28px] leading-[1.12] text-mm-ink"
        style={{ letterSpacing: "-0.02em" }}
      >
        {card.question}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
