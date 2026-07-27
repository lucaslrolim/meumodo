"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { MmButton } from "@/components/ui/mm-button";
import { useExamStore } from "@/stores/exam-store";

export default function PhotoPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const addMaterial = useExamStore((s) => s.addMaterial);

  const usePhoto = async () => {
    await addMaterial({ type: "photo", name: "Foto do caderno" });
    router.push(`/exam/${id}/materials`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Ficou boa?" onBack={true} />
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="mx-2 rounded-xl bg-[#F5F2EA] border border-[#E7E1D2] p-5 text-[#33322E] -rotate-1">
          <div className="font-heading font-bold mb-2">Lista de exercícios — MRU</div>
          <div className="text-[13.5px] leading-relaxed">
            1) Um carro percorre 200 km em 4 horas. Qual a velocidade média?
            <br />
            2) Um trem a 90 km/h por 2 horas percorre que distância?
            <br />
            3) No MRU, a velocidade é __________.
          </div>
          <div className="mt-3 font-mono text-xs">v = ΔS / Δt</div>
        </div>
        <div className="text-center text-[12.5px] mt-4 text-mm-ink-2">Dá pra ler tudo? Então manda bala.</div>
      </div>
      <div className="px-6 pb-9 flex gap-3">
        <MmButton variant="secondary" className="flex-1" onClick={() => toast("Tira outra foto 📷")}>
          Tirar outra
        </MmButton>
        <MmButton className="flex-1" onClick={usePhoto}>
          Usar esta foto
        </MmButton>
      </div>
    </div>
  );
}
