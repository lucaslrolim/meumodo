"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MaterialPicker } from "@/components/material/material-picker";
import { MaterialList } from "@/components/material/material-list";
import { MmButton } from "@/components/ui/mm-button";
import { MmChipStatus } from "@/components/ui/mm-chip";
import { useExamStore } from "@/stores/exam-store";

export default function MaterialsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentExam, load, addMaterial } = useExamStore();

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  if (!currentExam) return null;
  const { materials, subject, title } = currentExam;
  const full = materials.length >= 3;

  const chooseFile = async () => {
    await addMaterial({ type: "pdf", name: "Lista_exercicios.pdf" });
  };
  const chooseAudio = async () => {
    await addMaterial({ type: "audio", name: "Aula_gravada.m4a" });
  };

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader
        title="Manda o material 📸"
        eyebrow={`${subject} · ${title}`}
        onBack={true}
        right={<MmChipStatus tone={full ? "ok" : "info"}>{materials.length} de 3</MmChipStatus>}
      />
      <div className="flex-1 px-6 pt-2 flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-mm-ink-2">
          Vale lista de exercícios, slide, anotação ou o áudio da aula.
        </p>

        {materials.length > 0 && <MaterialList materials={materials} />}

        {!full && (
          <MaterialPicker
            onPhoto={() => router.push(`/exam/${id}/materials/photo`)}
            onChooseFile={chooseFile}
            onRecordAudio={() => router.push(`/exam/${id}/materials/audio`)}
            onChooseAudio={chooseAudio}
          />
        )}

        <div className="flex gap-3 items-start rounded-2xl border-[1.5px] border-mm-border bg-mm-surface p-3.5">
          <span className="text-[15px]" aria-hidden="true">💡</span>
          <p className="text-[12.5px] leading-snug text-mm-ink-2">
            Áudio da aula rende ótimas questões. Pode mandar mesmo com barulho.
          </p>
        </div>
      </div>
      {materials.length > 0 && (
        <div className="px-6 pb-9 pt-2">
          <MmButton
            size="block"
            onClick={() => {
              const pending = materials.find((m) => m.status !== "read");
              router.push(pending ? `/exam/${id}/review/${pending.id}` : `/exam/${id}/processing`);
            }}
          >
            Continuar
          </MmButton>
        </div>
      )}
    </div>
  );
}
