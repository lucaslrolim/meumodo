"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatCircleDots, ChartBar, NotePencil, ArrowRight } from "@phosphor-icons/react/ssr";
import { useExamStore } from "@/stores/exam-store";
import { MmButton } from "@/components/ui/mm-button";
import { MmProgress } from "@/components/ui/mm-progress";
import { GameHeader } from "@/components/game/game-header";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeScreen />
    </Suspense>
  );
}

function HomeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentExam, loadActive } = useExamStore();
  const [ready, setReady] = useState(false);

  // Arriving from /entry means this is a genuine first run, so the seeded
  // demo exam must not short-circuit the empty state. Without this the
  // pre-first-use screen is unreachable: the mock always has an active exam.
  const firstRun = searchParams.get("novo") === "1";

  useEffect(() => {
    loadActive().finally(() => setReady(true));
  }, [loadActive]);

  if (!ready) return null;

  // Pre-first-use. No stats, no social, no locked-feature clutter — a single
  // decision on an otherwise empty page. The student has nothing yet, so the
  // screen asks for exactly one thing.
  if (!currentExam || firstRun) {
    return (
      <div className="flex flex-1 flex-col px-6">
        <div className="pt-12">
          <span className="font-heading font-extrabold text-sm tracking-tight text-mm-ink">meu modo</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <h1 className="font-heading font-extrabold text-[32px] leading-[1.08] tracking-tight text-mm-ink">
            Tem prova
            <br />
            chegando?
          </h1>
          <p className="text-[15px] leading-relaxed mt-3 text-mm-ink-2 max-w-[300px]">
            Manda a foto do slide, da lista ou do caderno. A gente monta sua prática.
          </p>

          <MmButton size="block" className="mt-8" onClick={() => router.push("/exam/new")}>
            <NotePencil size={19} weight="bold" />
            Criar minha primeira prova
          </MmButton>
          <div className="text-[13px] text-mm-mut mt-3">
            Leva 2 minutos. Até 3 materiais, sem cartão.
          </div>
        </div>
      </div>
    );
  }

  const confirmedMaterials = currentExam.materials.filter((m) => m.status === "read").length;

  // Returning student. Opens on the next activity, not on a dashboard:
  // one dominant decision, with everything else demoted to a quiet list.
  return (
    <div className="flex flex-1 flex-col">
      <GameHeader />

      <div className="px-6 pt-6 pb-2">
        <div className="text-[13px] font-semibold text-mm-mut">
          {currentExam.subject} · {currentExam.examDate}
        </div>
        <h1 className="font-heading font-extrabold text-[28px] leading-[1.1] tracking-tight mt-1 text-mm-ink">
          Bora revisar 3<br />
          atividades?
        </h1>
        <p className="text-[15px] leading-relaxed mt-2.5 text-mm-ink-2">
          São 8 minutos. Você para quando quiser.
        </p>
        <MmButton
          size="block"
          className="mt-6"
          onClick={() => router.push(`/exam/${currentExam.id}/session`)}
        >
          Continuar
          <ArrowRight size={19} weight="bold" />
        </MmButton>
      </div>

      <div className="mt-8 border-t border-mm-border">
        <RowLink
          icon={<ChatCircleDots size={20} weight="regular" />}
          label="Conversar com o Tutor"
          hint="Sobre qualquer material seu"
          onClick={() => router.push("/tutor")}
        />
        <RowLink
          icon={<ChartBar size={20} weight="regular" />}
          label="Seu progresso"
          hint={`${currentExam.concepts.length} conceitos · ${confirmedMaterials} materiais`}
          onClick={() => router.push(`/exam/${currentExam.id}/progress`)}
        />
      </div>

      <div className="px-6 pt-7 pb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-mm-mut mb-3">
          Como você tá
        </div>
        <div className="flex flex-col gap-3">
          {currentExam.concepts.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="font-semibold text-mm-ink">{c.name}</span>
                <span className={c.status === "steady" ? "font-bold text-mm-brand-ink" : "text-mm-mut"}>
                  {c.status === "starting" ? "começando" : c.status === "progressing" ? "caminhando" : "firme"}
                </span>
              </div>
              <MmProgress
                value={c.mastery}
                tone={c.status === "starting" ? "mut" : "brand"}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push(`/exam/${currentExam.id}/finish`)}
          className="mt-7 text-[13px] font-semibold text-mm-mut underline underline-offset-4"
        >
          Já fiz essa prova
        </button>
      </div>
    </div>
  );
}

function RowLink({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 border-b border-mm-border px-6 py-4 text-left transition-colors active:bg-mm-surface-alt"
    >
      <span className="shrink-0 text-mm-ink">{icon}</span>
      <span className="flex-1">
        <span className="block text-[15px] font-bold text-mm-ink">{label}</span>
        <span className="block text-[13px] text-mm-mut">{hint}</span>
      </span>
      <ArrowRight size={16} weight="bold" className="shrink-0 text-mm-mut" />
    </button>
  );
}
