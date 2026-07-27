"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Microphone } from "@phosphor-icons/react/ssr";
import { AppHeader } from "@/components/layout/app-header";
import { MmButton } from "@/components/ui/mm-button";
import { MmChip, MmChipStatus } from "@/components/ui/mm-chip";
import { useExamStore } from "@/stores/exam-store";
import { useVoiceInput } from "@/lib/voice/use-voice-input";
import type { Subject } from "@/types/domain";

const SUBJECTS: Subject[] = ["Física", "Matemática", "Química"];

export default function NewExamPage() {
  const router = useRouter();
  const create = useExamStore((s) => s.create);
  const [subject, setSubject] = useState<Subject>("Física");
  const [title, setTitle] = useState("Cinemática");
  const [examDate, setExamDate] = useState("sexta-feira");
  const [confirming, setConfirming] = useState(false);
  const voice = useVoiceInput();

  const startVoice = () => {
    voice.start("Prova de física de cinemática, sexta.");
    setConfirming(true);
  };

  const applyVoice = () => {
    setSubject("Física");
    setTitle("Cinemática");
    setExamDate("sexta-feira");
    setConfirming(false);
    voice.reset();
  };

  const proceed = async () => {
    const exam = await create({ subject, title, examDate });
    router.push(`/exam/${exam.id}/materials`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Nova prova 🎯" onBack={true} />
      <div className="flex-1 px-6 pb-4 flex flex-col gap-6">
        <div>
          <div className="mb-2.5 text-xs font-bold uppercase tracking-wider text-mm-mut">
            Matéria
          </div>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <MmChip key={s} selected={subject === s} onClick={() => setSubject(s)}>
                {s}
              </MmChip>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-mm-mut">Nome da prova</span>
          <input
            name="examTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Cinemática, Funções…"
            className="min-h-12 rounded-xl border-[1.5px] border-mm-border bg-mm-surface-alt px-4 text-base text-mm-ink outline-none focus:border-mm-info-ink focus:ring-2 focus:ring-mm-info/30"
          />
        </label>

        <label className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-mm-mut">
            Quando é? <span className="normal-case tracking-normal font-normal">(opcional)</span>
          </span>
          <input
            name="examDate"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            placeholder="Ex.: sexta-feira"
            className="min-h-12 rounded-xl border-[1.5px] border-mm-border bg-mm-surface-alt px-4 text-base text-mm-ink outline-none focus:border-mm-info-ink focus:ring-2 focus:ring-mm-info/30"
          />
        </label>

        {!confirming ? (
          <button
            type="button"
            onClick={startVoice}
            className="flex items-center gap-4 rounded-2xl border-[1.5px] border-mm-border bg-mm-surface p-4 text-left"
          >
            <span
              className={`flex size-14 shrink-0 items-center justify-center rounded-full bg-mm-brand text-mm-on-brand shadow-[0_4px_0_#2e9e2e] ${
                voice.state === "listening" ? "animate-pulse" : ""
              }`}
            >
              <Microphone size={24} weight="bold" />
            </span>
            <span className="text-[13px] leading-snug text-mm-ink-2">
              Prefere falar? Toca e conta:
              <br />
              <span className="font-semibold text-mm-ink">
                “Prova de física de cinemática, sexta.”
              </span>
            </span>
          </button>
        ) : (
          <div className="rounded-2xl border-[1.5px] border-mm-brand-ink/40 bg-mm-surface p-4">
            <MmChipStatus tone="ok" className="mb-2">
              Entendi assim
            </MmChipStatus>
            <div className="font-heading font-bold text-[15px] text-mm-ink">
              {voice.state === "ready" ? "Prova de Física · Cinemática · sexta-feira" : "Ouvindo…"}
            </div>
            {voice.state === "ready" && (
              <div className="flex gap-2.5 mt-3">
                <MmButton size="sm" className="flex-1" onClick={applyVoice}>
                  Confirmar
                </MmButton>
                <MmButton variant="secondary" size="sm" className="flex-1" onClick={() => setConfirming(false)}>
                  Corrigir
                </MmButton>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-6 pb-9 pt-2">
        <MmButton size="block" onClick={proceed} disabled={!title.trim()}>
          Continuar
        </MmButton>
      </div>
    </div>
  );
}
