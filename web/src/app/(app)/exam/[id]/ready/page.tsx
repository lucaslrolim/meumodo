"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShareNetwork } from "@phosphor-icons/react/ssr";
import { MmChip } from "@/components/ui/mm-chip";
import { MmButton } from "@/components/ui/mm-button";
import { useExamStore } from "@/stores/exam-store";

const DURATIONS = [5, 10, 15];

export default function PracticeReadyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentExam, load } = useExamStore();
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  if (!currentExam) return null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 flex flex-col justify-center px-7">
        <div className="text-center">
          <div className="text-4xl mb-1" aria-hidden="true">⚡</div>
          <h1 className="font-heading font-extrabold text-3xl text-mm-ink">Tá pronto!</h1>
          <p className="text-sm mt-1.5 text-mm-ink-2">
            Sua sessão de prática pra <b className="text-mm-ink">{currentExam.title}</b>.
          </p>
        </div>

        <div className="rounded-2xl border-[1.5px] border-mm-brand-ink/40 bg-mm-surface p-6 mt-7 text-center">
          <div className="font-heading font-black text-4xl text-mm-brand-ink">{duration} min</div>
          <div className="text-sm font-semibold mt-0.5 text-mm-ink">12 atividades</div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {currentExam.concepts.map((c) => (
              <span
                key={c.id}
                className="rounded-full border-[1.5px] border-mm-brand-ink bg-mm-brand-soft px-4 py-2 font-heading font-bold text-sm text-mm-brand-ink"
              >
                {c.name}
              </span>
            ))}
          </div>
          <div className="text-xs mt-4 text-mm-mut">
            Fontes: {currentExam.materials.map((m) => m.name).join(" · ")}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="text-[12.5px] mr-1 text-mm-ink-2">Duração:</span>
          {DURATIONS.map((d) => (
            <MmChip key={d} selected={duration === d} onClick={() => setDuration(d)}>
              {d}
            </MmChip>
          ))}
        </div>
      </div>
      <div className="px-7 pb-10 flex flex-col gap-3">
        <MmButton size="block" onClick={() => router.push(`/exam/${id}/session`)}>
          Começar sessão
        </MmButton>
        <button
          type="button"
          onClick={() => router.push(`/share?variant=transformation&exam=${id}`)}
          className="flex items-center justify-center gap-1.5 py-2 font-heading font-bold text-[13.5px] text-mm-brand-ink"
        >
          <ShareNetwork size={16} weight="bold" />
          Mostrar que virou 12 questões
        </button>
      </div>
    </div>
  );
}
