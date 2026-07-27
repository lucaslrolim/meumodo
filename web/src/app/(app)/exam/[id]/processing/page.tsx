"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "@phosphor-icons/react/ssr";
import { useExamStore } from "@/stores/exam-store";
import { reveal } from "@/lib/motion";

const STEPS = ["Materiais conferidos", "Temas encontrados", "Criando exercícios", "Conferindo fontes"];
const TOPICS = ["MRU", "Velocidade média", "Gráficos S×t"];

export default function ProcessingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentExam, load, generatePractice } = useExamStore();
  const [stepIndex, setStepIndex] = useState(0);
  const doneRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) reveal(rootRef.current.children);
  }, []);

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  useEffect(() => {
    if (doneRef.current) return;
    if (stepIndex < STEPS.length) {
      const t = setTimeout(() => setStepIndex((i) => i + 1), 1000);
      return () => clearTimeout(t);
    }
    if (currentExam?.id !== id) return;
    doneRef.current = true;
    generatePractice().then(() => router.push(`/exam/${id}/ready`));
  }, [stepIndex, currentExam?.id, id, generatePractice, router]);

  return (
    <div className="flex flex-1 flex-col">
      <div ref={rootRef} className="flex-1 flex flex-col justify-center px-8">
        <div className="font-heading font-extrabold text-2xl mb-8 text-mm-ink">
          Montando sua prática ⚙️
        </div>
        <div className="flex flex-col gap-5">
          {STEPS.map((label, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div
                key={label}
                className={`flex items-center gap-3.5 transition-opacity ${
                  done || active ? "opacity-100" : "opacity-40"
                }`}
              >
                <span className="w-6 flex justify-center">
                  {done ? (
                    <Check size={18} weight="bold" className="text-mm-brand-ink" />
                  ) : active ? (
                    <span className="size-4 rounded-full border-2 border-mm-border border-t-mm-brand-d animate-spin" />
                  ) : (
                    <span className="size-4" />
                  )}
                </span>
                <span className="text-[15px] font-semibold text-mm-ink">{label}</span>
              </div>
            );
          })}
        </div>
        {stepIndex >= 1 && (
          <div className="flex flex-wrap gap-2 mt-7">
            {TOPICS.map((t) => (
              <span
                key={t}
                className="rounded-full border-[1.5px] border-mm-brand-ink bg-mm-brand-soft px-4 py-2 font-heading font-bold text-sm text-mm-brand-ink"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="px-8 pb-12 text-center text-[13px] text-mm-mut">
        Pode sair da tela, a gente avisa quando ficar pronto.
      </div>
    </div>
  );
}
