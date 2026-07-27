"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { OcrEditor } from "@/components/material/ocr-editor";
import { TranscriptEditor } from "@/components/material/transcript-editor";
import { MmButton } from "@/components/ui/mm-button";
import { useExamStore } from "@/stores/exam-store";

const LIST_MRU_TEXT =
  "Lista de exercícios — MRU\n\n1) Um carro percorre 200 km em 4 horas. Qual a velocidade média?\n\n2) Um trem a 90 km/h por 2 homas percorre que distância?\n\n3) No MRU, a velocidade é constatne.\n\nv = ΔS / Δt";

const AUDIO_SEGMENTS = [
  { id: "t1", start: "00:00", end: "00:18", text: "Então, MRU é quando a velocidade não muda. O objeto anda sempre no mesmo ritmo." },
  { id: "t2", start: "00:18", end: "00:41", text: "A velocidade média é delta S sobre delta T. Distância dividida pelo tempo." },
  { id: "t3", start: "00:41", end: "01:02", text: "O gráfico S por T é uma reta inclinada.", lowConfidence: true },
];

export default function ReviewMaterialPage({
  params,
}: {
  params: Promise<{ id: string; materialId: string }>;
}) {
  const { id, materialId } = use(params);
  const router = useRouter();
  const { currentExam, load, confirmMaterial } = useExamStore();
  const [text, setText] = useState(LIST_MRU_TEXT);

  useEffect(() => {
    if (currentExam?.id !== id) load(id);
  }, [id, currentExam?.id, load]);

  if (!currentExam) return null;
  const material = currentExam.materials.find((m) => m.id === materialId);
  if (!material) return null;

  const goToNextReviewOrProcess = () => {
    const next = currentExam.materials.find((m) => m.id !== materialId && m.status !== "read");
    router.push(next ? `/exam/${id}/review/${next.id}` : `/exam/${id}/processing`);
  };

  const saveAndContinue = async () => {
    await confirmMaterial(materialId, material.type === "audio" ? AUDIO_SEGMENTS.map((s) => s.text).join(" ") : text);
    goToNextReviewOrProcess();
  };

  if (material.type === "audio") {
    return (
      <div className="flex flex-1 flex-col">
        <AppHeader title="Revisão do áudio 🎧" eyebrow={`${material.name} · 03:42`} onBack={true} />
        <div className="flex-1 px-6 pb-3 flex flex-col gap-3">
          <TranscriptEditor segments={AUDIO_SEGMENTS} />
        </div>
        <div className="px-6 pb-9">
          <MmButton size="block" onClick={saveAndContinue}>
            Salvar e gerar prática
          </MmButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader
        title="Confere o que a gente leu ✓"
        eyebrow={`${material.name}${material.pages ? ` · página 1 de ${material.pages}` : ""}`}
        onBack={true}
      />
      <div className="flex-1 px-6 pb-3">
        <OcrEditor
          title="Lista de exercícios — MRU"
          initialText={text}
          uncertainSpans={["homas", "constatne"]}
          onChange={setText}
        />
      </div>
      <div className="px-6 pb-9 flex gap-3">
        <MmButton
          variant="secondary"
          className="flex-1"
          onClick={async () => {
            await confirmMaterial(materialId, text);
            toast("Salvo ✓ Gera a prática quando quiser.");
            router.push(`/exam/${id}/materials`);
          }}
        >
          Só salvar
        </MmButton>
        <MmButton className="flex-1" onClick={saveAndContinue}>
          Salvar e continuar
        </MmButton>
      </div>
    </div>
  );
}
