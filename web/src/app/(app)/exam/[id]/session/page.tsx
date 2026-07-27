"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Microphone, FileText } from "@phosphor-icons/react/ssr";
import { useExamStore } from "@/stores/exam-store";
import { useSessionStore } from "@/stores/session-store";
import { useTutorStore } from "@/stores/tutor-store";
import { MmSegmentedProgress } from "@/components/ui/mm-progress";
import { MmButton } from "@/components/ui/mm-button";
import { QuestionStage } from "@/components/session/question-stage";
import { HintSheet } from "@/components/session/hint-sheet";
import { FeedbackSheet } from "@/components/session/feedback-sheet";
import { SourceOverlay } from "@/components/session/source-overlay";
import { CardTutorPanel } from "@/components/tutor/card-tutor-panel";
import { useVoiceInput } from "@/lib/voice/use-voice-input";
import { SafeArea } from "@/components/layout/safe-area";

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { sessionId, generatePractice, currentExam, load } = useExamStore();
  const {
    session,
    answered,
    load: loadSession,
    answer,
    next,
    currentCard,
    isComplete,
    lastPointsEarned,
    totalPoints,
  } = useSessionStore();
  const openCardTutor = useTutorStore((s) => s.openCardTutor);

  const [hintOpen, setHintOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [value, setValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [resetIndex, setResetIndex] = useState(session?.currentIndex);
  const [appliedTranscript, setAppliedTranscript] = useState<string | null>(null);
  const voice = useVoiceInput();

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  useEffect(() => {
    if (!sessionId && currentExam?.id === id) {
      generatePractice();
    } else if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, currentExam?.id, id, generatePractice, loadSession]);

  if (session && session.currentIndex !== resetIndex) {
    setResetIndex(session.currentIndex);
    setValue("");
    setSelectedOption(null);
    setAppliedTranscript(null);
  }

  const card = currentCard();

  useEffect(() => {
    voice.reset();
  }, [session?.currentIndex, voice.reset]);

  if (voice.state === "ready" && voice.transcript && voice.transcript !== appliedTranscript) {
    setAppliedTranscript(voice.transcript);
    setValue(voice.transcript);
  }

  useEffect(() => {
    if (session && isComplete()) router.push(`/exam/${id}/session/summary`);
  }, [session, isComplete, id, router]);

  if (!session || !card) return null;

  const total = session.cards.length;

  // Attribution names the document, not just a page number — "página 2" alone
  // is meaningless when three materials are attached to the exam.
  const material = currentExam?.materials.find((m) => m.id === card.source.materialId);
  const materialName = material?.name ?? "Material";
  const sourceLabel =
    card.source.location.type === "page"
      ? `${materialName} · p. ${card.source.location.page}`
      : `${materialName} · ${formatClock(card.source.location.startMs)}`;

  const submitAnswer = async (mode: "text" | "voice" | "choice" | "skip", val: string) => {
    if (answered) return;
    if (mode !== "skip" && !val.trim()) {
      toast('Manda uma resposta — ou toca em "Não sei".');
      return;
    }
    const ok = await answer({ mode, value: val });
    setCorrect(ok);
    setSkipped(mode === "skip");
    setFeedbackOpen(true);
  };

  const advance = () => {
    setFeedbackOpen(false);
    next();
  };

  const openTutor = () => {
    setHintOpen(false);
    openCardTutor({ type: "card", cardId: card.id, sessionId: session.id });
    setTutorOpen(true);
  };

  return (
    <div className="relative flex flex-1 flex-col min-h-0 overflow-hidden">
      <SafeArea edges={["top"]} className="relative z-20">
        <header className="flex items-center gap-3 px-5 pt-3 pb-2">
          <button
            type="button"
            onClick={() => router.push(`/home`)}
            aria-label="Sair da sessão"
            className="flex size-9 items-center justify-center rounded-full text-mm-ink"
          >
            <X size={20} weight="bold" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="font-heading font-bold text-[13px] text-mm-ink">
                {currentExam?.subject}
              </span>
              <span className="font-mono text-[11px] text-mm-mut">
                {session.currentIndex + 1} de {total}
              </span>
            </div>
            <MmSegmentedProgress total={total} current={session.currentIndex} />
          </div>
          {totalPoints() > 0 && (
            <span className="shrink-0 rounded-full bg-mm-xp-soft px-3 py-1 font-heading font-extrabold text-xs text-mm-xp">
              ⚡ {totalPoints()}
            </span>
          )}
        </header>
      </SafeArea>

      <QuestionStage card={card}>
        {card.type === "multipleChoice" ? (
          <div className="flex flex-col gap-2.5">
            {card.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedOption(option)}
                className={`flex items-center gap-3 rounded-xl border-[1.5px] px-4 py-4 text-left text-base font-medium transition-[transform,filter] active:scale-[0.98] active:brightness-95 ${
                  selectedOption === option
                    ? "border-mm-brand-ink bg-mm-brand-soft text-mm-ink"
                    : "border-mm-border bg-mm-surface-alt text-mm-ink"
                }`}
              >
                <span
                  className={`size-6 shrink-0 rounded-full border-2 ${
                    selectedOption === option ? "border-mm-brand-ink bg-mm-brand-ink" : "border-mm-border"
                  }`}
                />
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div>
            {/* One field, not a field plus a mystery button: the mic lives
                inside the input so "escrever" and "falar" read as two ways
                into the same answer, and the box is tall enough to look
                like it accepts a full sentence, not just a number. */}
            <div className="flex items-end gap-2 rounded-2xl border-[1.5px] border-mm-border bg-mm-canvas px-4 py-3 focus-within:border-mm-ink">
              <textarea
                name="answer"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Escreve sua resposta…"
                rows={2}
                aria-label="Sua resposta"
                className="min-h-[52px] w-full resize-none bg-transparent text-[17px] leading-snug text-mm-ink outline-none placeholder:text-mm-mut"
              />
              <button
                type="button"
                onClick={() => voice.start("50")}
                aria-label="Responder falando"
                className={`mb-0.5 flex size-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                  voice.state === "listening"
                    ? "bg-mm-heart text-white"
                    : "bg-mm-surface-alt text-mm-ink active:bg-mm-border"
                }`}
              >
                <Microphone size={21} weight="fill" />
              </button>
            </div>
            <div className="mt-2 px-1 text-[13px] text-mm-mut">
              {voice.state === "listening"
                ? "Tô ouvindo… pode falar 🎤"
                : "Escreve ou toca no microfone e fala — do seu jeito."}
            </div>
          </div>
        )}
      </QuestionStage>

      <div>
        <button
          type="button"
          onClick={() => setSourceOpen(true)}
          className="flex max-w-full items-center gap-1.5 px-6 pt-3 text-left text-[13px] text-mm-mut active:scale-[0.98] transition-transform"
        >
          <FileText size={14} weight="regular" className="shrink-0" />
          <span className="truncate">
            Saiu de <span className="font-semibold text-mm-ink-2">{sourceLabel}</span>
          </span>
        </button>
        <SafeArea edges={["bottom"]} className="px-6 pt-3">
          {/* Help is the thing a stuck student needs to find fastest, so it
              gets real weight and the brand's own voice ("cola aqui"), not
              a pair of thin grey outlines that read as disabled. */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setHintOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-mm-surface-alt py-3.5 font-heading font-bold text-[15px] text-mm-ink transition-transform active:scale-[0.97]"
            >
              <span className="text-lg leading-none" aria-hidden="true">👀</span>
              Cola aqui
            </button>
            <button
              type="button"
              onClick={openTutor}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-mm-surface-alt py-3.5 font-heading font-bold text-[15px] text-mm-ink transition-transform active:scale-[0.97]"
            >
              <span className="text-lg leading-none" aria-hidden="true">💬</span>
              Tô travado
            </button>
          </div>
          <div className="flex gap-3 pb-9">
            <MmButton variant="secondary" className="flex-1" onClick={() => submitAnswer("skip", "")}>
              Não sei
            </MmButton>
            <MmButton
              className="flex-1"
              onClick={() =>
                submitAnswer(
                  card.type === "multipleChoice" ? "choice" : "text",
                  card.type === "multipleChoice" ? selectedOption ?? "" : value,
                )
              }
            >
              Responder
            </MmButton>
          </div>
        </SafeArea>
      </div>

      <HintSheet card={card} open={hintOpen} onOpenChange={setHintOpen} onStillStuck={openTutor} />
      <FeedbackSheet
        card={card}
        correct={correct}
        skipped={skipped}
        pointsEarned={lastPointsEarned()}
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        onNext={advance}
        onExplainDifferently={openTutor}
        onViewSource={() => setSourceOpen(true)}
      />
      <CardTutorPanel card={card} open={tutorOpen} onOpenChange={setTutorOpen} />
      <SourceOverlay card={card} open={sourceOpen} onClose={() => setSourceOpen(false)} />
    </div>
  );
}

/** ms -> "m:ss", for audio-sourced cards. */
function formatClock(ms: number) {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
