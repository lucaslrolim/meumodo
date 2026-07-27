"use client";

import { useRouter } from "next/navigation";
import { useExamStore } from "@/stores/exam-store";
import { MmButton } from "@/components/ui/mm-button";

export default function SubscribePage() {
  const router = useRouter();
  const currentExam = useExamStore((s) => s.currentExam);

  return (
    <div className="flex-1 px-5 pt-14 flex flex-col items-center text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-mm-brand-soft text-4xl mb-4">
        ✓
      </div>
      <h1 className="font-heading font-extrabold text-[26px] leading-tight mb-2 text-mm-ink">
        Sua primeira prova
        <br />
        tá salva ✓
      </h1>
      <p className="text-[15px] leading-relaxed mb-5 max-w-[300px] text-mm-ink-2">
        Você pode continuar revisando ela pra sempre. Pra criar a{" "}
        <b className="text-mm-ink">próxima prova</b>, o Meu Modo pede um responsável.
      </p>

      <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 w-full mb-6">
        <div className="grid grid-cols-3 text-center">
          <Stat value={4} label="sessões" />
          <Stat value={currentExam?.concepts.length ?? 3} label="temas" />
          <Stat value={12} label="revisões" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        <MmButton size="block" onClick={() => router.push("/subscribe/guardian")}>
          Mandar pro responsável
        </MmButton>
        <MmButton variant="secondary" size="block" onClick={() => router.push("/home")}>
          Continuar revisando
        </MmButton>
        <div className="text-xs mt-1 text-mm-mut">Sem cobrança automática. O responsável decide.</div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-heading font-black text-2xl text-mm-brand-ink">{value}</div>
      <div className="text-[11px] font-semibold mt-0.5 text-mm-ink-2">{label}</div>
    </div>
  );
}
