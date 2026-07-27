"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Microphone } from "@phosphor-icons/react/ssr";
import { useTutorStore } from "@/stores/tutor-store";
import { useExamStore } from "@/stores/exam-store";
import { MmChip } from "@/components/ui/mm-chip";
import type { TutorScope } from "@/types/domain";

const SUGGESTIONS = [
  { emoji: "🧮", text: "Me explica velocidade média com exemplo do meu material" },
  { emoji: "📉", text: "O que muda de MRU pra MRUV?" },
  { emoji: "🎯", text: "O que eu mais erro essa semana?" },
];

export default function TutorEntryPage() {
  const router = useRouter();
  const { conversations, list, create } = useTutorStore();
  const currentExam = useExamStore((s) => s.currentExam);
  const [scopeLabel, setScopeLabel] = useState("Tudo que enviei");

  useEffect(() => {
    list();
  }, [list]);

  const scopeFor = (label: string): TutorScope => {
    if (label === "Tudo que enviei") return { type: "everything" };
    if (currentExam && label === `Prova de ${currentExam.subject}`) return { type: "exam", examId: currentExam.id };
    return { type: "subject", subject: "Física" };
  };

  const openSuggestion = async (text: string) => {
    if (conversations[0]) {
      router.push(`/tutor/${conversations[0].id}`);
      return;
    }
    const conversation = await create(scopeFor(scopeLabel), text);
    router.push(`/tutor/${conversation.id}`);
  };

  const scopes = ["Tudo que enviei", currentExam ? `Prova de ${currentExam.subject}` : null, "MRU", "Lista_MRU.pdf"].filter(
    Boolean,
  ) as string[];

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-4 pb-2">
        <h1 className="font-heading font-extrabold text-[26px] text-mm-ink">Tutor 💬</h1>
        <p className="text-sm mt-1 text-mm-ink-2">
          Pergunta de boa. Ele responde com base no que você enviou.
        </p>
      </div>
      <div className="px-5 flex flex-col gap-4 pb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-mm-mut mb-2">Falar sobre</div>
          <div className="flex flex-wrap gap-2">
            {scopes.map((s) => (
              <MmChip key={s} selected={scopeLabel === s} onClick={() => setScopeLabel(s)}>
                {s}
              </MmChip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => openSuggestion(s.text)}
              className="flex items-center gap-3 rounded-2xl border border-mm-border bg-mm-surface p-4 text-left"
            >
              <span className="text-xl" aria-hidden="true">{s.emoji}</span>
              <span className="text-sm font-medium flex-1 text-mm-ink">{s.text}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-mm-border p-4">
          <Microphone size={20} className="text-mm-mut" />
          <span className="text-[13px] text-mm-ink-2">Prefere falar? Abre a conversa e toca no microfone.</span>
        </div>
      </div>
    </div>
  );
}
