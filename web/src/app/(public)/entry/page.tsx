"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "@phosphor-icons/react/ssr";
import { MmButton } from "@/components/ui/mm-button";
import { MmChip } from "@/components/ui/mm-chip";

const AGES = ["13", "14", "15", "16", "17", "18+"];

export default function EntryPage() {
  const router = useRouter();
  const [age, setAge] = useState("17");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-mm-canvas">
      <div className="flex-1 flex flex-col justify-center px-7">
        <div className="text-3xl mb-2" aria-hidden="true">🙌</div>
        <h1 className="font-heading font-extrabold text-[28px] leading-tight text-mm-ink">
          Antes de começar,
          <br />
          quantos anos você tem?
        </h1>
        <div className="flex flex-wrap gap-2.5 mt-7">
          {AGES.map((a) => (
            <MmChip key={a} selected={age === a} onClick={() => setAge(a)}>
              {a}
            </MmChip>
          ))}
        </div>
        <div className="rounded-2xl border-[1.5px] border-mm-border bg-mm-surface p-4 mt-8 flex gap-3">
          <Lock size={18} weight="bold" className="mt-0.5 shrink-0 text-mm-info-ink" />
          <p className="text-[13px] leading-relaxed text-mm-ink-2">
            Seus materiais são seus. A gente só fala com um responsável na hora do pagamento — e mostra só seu
            progresso, nunca suas respostas.
          </p>
        </div>

        {/* CTA travels with the content rather than being pinned to the
            viewport floor: this screen is one short decision, so on a tall
            window a fixed footer strands the button below ~200px of dead
            space and the page reads as if it has no action. */}
        <MmButton size="block" className="mt-8" onClick={() => router.push("/home?novo=1")}>
          Continuar
        </MmButton>
      </div>
    </div>
  );
}
