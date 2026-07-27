"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MmButton } from "@/components/ui/mm-button";
import { useExamStore } from "@/stores/exam-store";

const LINES: Record<number, string> = {
  1: "De boa. A gente ajusta o próximo plano juntos.",
  2: "Faz parte. O que travou vira prática.",
  3: "Ok! Dá pra subir isso na próxima.",
  4: "Mandou bem! Bora manter o ritmo.",
  5: "Voou 🎯 Orgulho de você.",
};

export default function FinishExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentExam, load, finish } = useExamStore();
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  const showReassurance = rating !== null && rating <= 2;

  const finishExam = async () => {
    await finish(rating ?? 3);
    router.push("/subscribe");
  };

  return (
    <div className="flex-1 px-5 pt-16 flex flex-col items-center text-center">
      <div className="text-5xl mb-3" aria-hidden="true">🤞</div>
      <h1 className="font-heading font-extrabold text-[26px] leading-tight mb-2 text-mm-ink">
        Como foi a prova?
      </h1>
      <p className="text-[15px] leading-relaxed mb-8 max-w-[280px] text-mm-ink-2">
        Sem nota certa ou errada aqui. É só pra gente ajustar o que vem depois.
      </p>

      <div className="flex gap-2.5 mb-6">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`size-[52px] rounded-2xl font-heading font-black text-xl transition-all ${
              rating === n
                ? "scale-105 border-[1.5px] border-mm-brand-ink bg-mm-brand-soft text-mm-brand-ink"
                : "border-[1.5px] border-mm-border bg-mm-surface-alt text-mm-ink-2"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {rating !== null && (
        <div className="text-sm font-semibold mb-6 text-mm-brand-ink">{LINES[rating]}</div>
      )}

      {showReassurance && (
        <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 mb-6 text-left">
          <p className="text-sm leading-relaxed text-mm-ink">
            Essa prova não apaga o que você já aprendeu. O que travou agora vira prática pra próxima.
          </p>
        </div>
      )}

      <div className="w-full px-1 flex flex-col gap-3">
        <MmButton size="block" onClick={finishExam} disabled={rating === null}>
          Concluir prova
        </MmButton>
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="text-[13px] font-semibold text-mm-mut"
        >
          Ainda tô esperando o resultado
        </button>
      </div>
    </div>
  );
}
