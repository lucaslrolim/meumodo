"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { MmButton } from "@/components/ui/mm-button";

const INCLUDED = ["Suas sessões e tempo de estudo", "Temas que você praticou", "Revisões feitas"];
const EXCLUDED = ["Suas respostas e erros", "Seus materiais", "Qualquer diagnóstico"];

export default function GuardianLinkPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Chama um responsável 💌" onBack={true} />
      <div className="px-5 flex flex-col gap-4 pb-10">
        <p className="text-sm leading-relaxed text-mm-ink-2">
          A gente manda um resumo do seu esforço. Olha o que entra e o que{" "}
          <b className="text-mm-ink">não</b> entra:
        </p>
        <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 flex flex-col gap-2.5">
          {INCLUDED.map((t) => (
            <div key={t} className="flex items-center gap-2.5 text-sm">
              <span className="font-black text-mm-brand-ink">✓</span>
              <span className="text-mm-ink">{t}</span>
            </div>
          ))}
          <div className="my-1 h-px bg-mm-border" />
          {EXCLUDED.map((t) => (
            <div key={t} className="flex items-center gap-2.5 text-sm">
              <span className="font-black text-mm-mut">✗</span>
              <span className="text-mm-ink-2">{t}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <MmButton variant="whatsapp" size="block" onClick={() => router.push("/invite/demo")}>
            Mandar no WhatsApp
          </MmButton>
          <MmButton
            variant="secondary"
            size="block"
            onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}/invite/demo`);
              toast("Link copiado ✓");
            }}
          >
            Copiar link
          </MmButton>
        </div>
      </div>
    </div>
  );
}
