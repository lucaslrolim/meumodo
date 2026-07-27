"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AudioRecorder } from "@/components/material/audio-recorder";
import { MmButton } from "@/components/ui/mm-button";
import { useExamStore } from "@/stores/exam-store";

export default function RecordAudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const addMaterial = useExamStore((s) => s.addMaterial);
  const [recording, setRecording] = useState(true);

  const cancel = () => {
    setRecording(false);
    router.push(`/exam/${id}/materials`);
  };

  const finish = async () => {
    setRecording(false);
    await addMaterial({ type: "audio", name: "Aula_gravada.m4a" });
    router.push(`/exam/${id}/materials`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Gravando a aula…" onBack={cancel} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-7">
        <AudioRecorder recording={recording} />
        <div className="flex gap-3 items-start rounded-2xl border-[1.5px] border-mm-border bg-mm-surface p-4">
          <span className="text-[15px]" aria-hidden="true">🎧</span>
          <p className="text-[13px] leading-snug text-mm-ink-2">
            Pode gravar mesmo com barulho. A gente destaca a voz do prof.
          </p>
        </div>
      </div>
      <div className="px-6 pb-9 flex gap-3">
        <MmButton variant="secondary" className="flex-1" onClick={cancel}>
          Cancelar
        </MmButton>
        <MmButton className="flex-1" onClick={finish}>
          Concluir
        </MmButton>
      </div>
    </div>
  );
}
