"use client";

import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Fire, Lightning } from "@phosphor-icons/react/ssr";
import { useExamStore } from "@/stores/exam-store";
import { useSessionStore } from "@/stores/session-store";
import { MmButton } from "@/components/ui/mm-button";
import { MmProgress } from "@/components/ui/mm-progress";
import { Confetti } from "@/components/game/confetti";
import { celebrate } from "@/lib/motion";

export default function SessionSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentExam, load } = useExamStore();
  const { session, totalPoints } = useSessionStore();
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  useEffect(() => {
    if (currentExam?.id === id && !session) router.push(`/exam/${id}/ready`);
  }, [currentExam, session, id, router]);

  useEffect(() => {
    if (badgeRef.current) celebrate(badgeRef.current);
  }, []);

  if (!currentExam || !session) return null;

  const correctCount = session.attempts.filter((a) => a.correct).length;
  const toReview = session.attempts.filter((a) => !a.correct).length;

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto">
      <Confetti fire={correctCount > 0} />
      <div className="flex-1 flex flex-col justify-center px-7 py-8">
        <div className="text-center">
          <div
            ref={badgeRef}
            className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-mm-brand-soft text-mm-brand-ink shadow-[0_0_32px_var(--mm-brand-glow)]"
          >
            <CheckCircle size={32} weight="fill" />
          </div>
          <h1 className="font-heading font-extrabold text-[28px] text-mm-ink">Fechou por hoje 🎯</h1>
          <p className="text-sm mt-1.5 text-mm-ink-2">
            {session.durationMin} min · {currentExam.concepts.length} conceitos praticados
          </p>
          {totalPoints() > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-mm-xp-soft px-3.5 py-1.5 font-heading font-extrabold text-sm text-mm-xp">
                <Lightning size={14} weight="fill" /> +{totalPoints()} pontos
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-mm-streak-soft px-3.5 py-1.5 font-heading font-extrabold text-sm text-mm-streak">
                <Fire size={14} weight="fill" /> 7 dias seguidos
              </span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-mm-border bg-mm-surface p-5 mt-7 flex flex-col gap-3.5">
          <Row label="Acertos" value={correctCount} tone={correctCount > 0 ? "brand" : undefined} />
          <Row label="Pra revisar" value={toReview} tone={toReview > 0 ? "warn" : undefined} />
          <Row label="Volta na próxima sessão" value={`${toReview} conceito${toReview === 1 ? "" : "s"}`} />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {currentExam.concepts.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-[12.5px] mb-1.5">
                <span className="font-semibold text-mm-ink">{c.name}</span>
                <span className={c.status === "steady" ? "text-mm-mastery" : "text-mm-ink-2"}>
                  {c.status === "steady" ? "subiu ↑" : `${c.mastery}%`}
                </span>
              </div>
              <MmProgress
                value={c.mastery}
                tone={c.status === "starting" ? "mut" : c.status === "steady" ? "mastery" : "brand"}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push(`/share?variant=session&exam=${id}`)}
          className="flex items-center gap-3 rounded-2xl border-[1.5px] border-mm-brand-ink/40 bg-mm-surface p-3.5 mt-6 text-left transition-transform active:scale-[0.98]"
        >
          <span className="flex h-[78px] w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-mm-border bg-mm-canvas">
            <span className="font-heading font-black text-[9px] text-mm-brand-ink">{session.durationMin} min</span>
            <span className="text-center text-[6px] leading-tight text-mm-ink-2">
              {currentExam.concepts.length} conceitos
            </span>
          </span>
          <span className="flex-1">
            <span className="block font-heading font-bold text-[15px] text-mm-ink">
              Seu card da sessão tá pronto
            </span>
            <span className="block text-[12.5px] mt-0.5 text-mm-ink-2">
              Vídeo de 5s pro story. Sem suas respostas.
            </span>
          </span>
          <span className="text-lg text-mm-brand-ink" aria-hidden="true">›</span>
        </button>
      </div>
      <div className="px-7 pb-10 flex flex-col gap-3">
        <MmButton size="block" onClick={() => router.push("/home")}>
          Voltar pra home
        </MmButton>
        <MmButton variant="secondary" size="block" onClick={() => router.push("/tutor")}>
          Falar com o Tutor
        </MmButton>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string | number; tone?: "brand" | "warn" }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-mm-ink-2">{label}</span>
      <span
        className={`font-heading font-bold ${
          tone === "brand" ? "text-mm-brand-ink" : tone === "warn" ? "text-mm-warn-ink" : "text-mm-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
