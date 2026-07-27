"use client";

import { use, useEffect } from "react";
import { MmProgress } from "@/components/ui/mm-progress";
import { useExamStore } from "@/stores/exam-store";

const SESSIONS = [
  { label: "Hoje · 8 min", score: "10/12 ✓", tone: "brand" as const },
  { label: "Ontem · 10 min", score: "8/12", tone: "mut" as const },
  { label: "Segunda · 10 min", score: "7/12", tone: "mut" as const },
];

export default function ProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentExam, load } = useExamStore();

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  if (!currentExam) return null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-4 pb-2">
        <h1 className="font-heading font-extrabold text-[26px] text-mm-ink">Seu progresso 📈</h1>
        <p className="text-sm mt-1 text-mm-ink-2">
          Prova de {currentExam.subject} · {currentExam.examDate}
        </p>
      </div>
      <div className="px-5 flex flex-col gap-4 pb-8">
        <div className="rounded-2xl border border-mm-border bg-mm-surface p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-mm-mut mb-3">Conceitos</div>
          <div className="flex flex-col gap-3">
            {currentExam.concepts.map((c) => (
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-mm-ink">{c.name}</span>
                  <span
                    className={`text-xs font-bold ${
                      c.status === "steady"
                        ? "text-mm-brand-ink"
                        : c.status === "progressing"
                          ? "text-mm-warn-ink"
                          : "text-mm-ink-2"
                    }`}
                  >
                    {c.status === "starting" ? "começando" : c.status === "progressing" ? "caminhando" : "firme"}
                  </span>
                </div>
                <MmProgress
                  value={c.mastery}
                  tone={c.status === "steady" ? "brand" : c.status === "progressing" ? "warn" : "mut"}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 text-center">
            <div className="font-heading font-black text-[28px] text-mm-brand-ink">12</div>
            <div className="text-xs font-semibold mt-0.5 text-mm-ink-2">revisões feitas</div>
          </div>
          <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 text-center">
            <div className="font-heading font-black text-[28px] text-mm-ink">4</div>
            <div className="text-xs font-semibold mt-0.5 text-mm-ink-2">sessões de estudo</div>
          </div>
        </div>

        <div className="rounded-2xl border border-mm-border bg-mm-surface p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-mm-mut mb-3">Sessões</div>
          <div className="flex flex-col gap-2.5">
            {SESSIONS.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <span className="font-medium text-mm-ink">{s.label}</span>
                <span
                  className={`text-xs font-bold ${s.tone === "brand" ? "text-mm-brand-ink" : "text-mm-ink-2"}`}
                >
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 text-[13px] leading-relaxed text-center text-mm-ink-2">
          Sem ranking, sem comparação com ninguém.
          <br />O comparativo é com <b className="text-mm-ink">você de ontem</b>.
        </div>
      </div>
    </div>
  );
}
