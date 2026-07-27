"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Pause, Play } from "@phosphor-icons/react/ssr";
import { AppHeader } from "@/components/layout/app-header";
import { MmChip } from "@/components/ui/mm-chip";
import { ModoCard, type ModoCardFormat, type ModoCardVariant } from "@/components/share/modo-card";
import { PrivacyDisclosure } from "@/components/share/privacy-disclosure";
import { DestinationRow } from "@/components/share/destination-row";

const VARIANTS: Array<{ value: ModoCardVariant; label: string }> = [
  { value: "transformation", label: "Meu material virou prática" },
  { value: "session", label: "Sessão de hoje" },
  { value: "week", label: "Minha semana" },
];

const FORMATS: Array<{ value: ModoCardFormat; label: string }> = [
  { value: "video", label: "Vídeo 9:16" },
  { value: "image", label: "Imagem" },
  { value: "square", label: "Quadrado" },
];

function ShareComposer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVariant = (searchParams.get("variant") as ModoCardVariant) ?? "session";

  const [variant, setVariant] = useState<ModoCardVariant>(
    VARIANTS.some((v) => v.value === initialVariant) ? initialVariant : "session",
  );
  const [format, setFormat] = useState<ModoCardFormat>("video");
  const [showName, setShowName] = useState(false);
  const [playing, setPlaying] = useState(true);

  const share = (destination: string) => {
    const messages: Record<string, string> = {
      WhatsApp: "Abrindo o WhatsApp com seu card ✓",
      Stories: "Card salvo pro Stories ✓",
      TikTok: "Vídeo exportado pro TikTok ✓",
      Salvar: "Salvo na galeria ✓",
      Link: "Link copiado ✓",
    };
    toast(messages[destination] ?? "Compartilhado ✓");
  };

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Compartilhar" eyebrow="Você escolhe o que aparece." onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex justify-center pt-1">
          <ModoCard variant={variant} format={format} showName={showName} playing={playing} />
        </div>

        {format === "video" && (
          <div className="flex items-center gap-3 mt-4 px-1">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar prévia" : "Tocar prévia"}
              className="flex size-[38px] items-center justify-center rounded-full bg-mm-surface-alt border border-mm-border text-mm-ink"
            >
              {playing ? <Pause size={16} weight="bold" /> : <Play size={16} weight="bold" />}
            </button>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-mm-surface-alt">
              <div
                className="h-full rounded-full bg-mm-brand-d motion-safe:animate-[mm-fill_4.4s_linear_infinite]"
                style={{ width: playing ? undefined : "0%" }}
              />
            </div>
            <span className="font-mono text-[11px] text-mm-mut">0:05</span>
          </div>
        )}

        <div className="text-xs font-bold uppercase tracking-wider text-mm-mut mt-6 mb-2.5">Formato</div>
        <div className="flex rounded-full border-[1.5px] border-mm-border bg-mm-surface-alt p-[3px] gap-[3px]">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFormat(f.value)}
              className={`flex-1 min-h-[38px] rounded-full font-heading font-extrabold text-[13px] transition-colors ${
                format === f.value ? "bg-mm-brand text-mm-on-brand" : "text-mm-ink-2"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-mm-mut mt-6 mb-2.5">O que mostrar</div>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((v) => (
            <MmChip key={v.value} selected={variant === v.value} onClick={() => setVariant(v.value)}>
              {v.label}
            </MmChip>
          ))}
        </div>

        <div className="mt-6">
          <PrivacyDisclosure />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border-[1.5px] border-mm-border bg-mm-surface p-4 mt-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showName}
            onChange={(e) => setShowName(e.target.checked)}
            className="size-5 accent-mm-brand"
          />
          <span className="text-[13.5px] text-mm-ink-2">Mostrar meu nome no card</span>
        </label>
      </div>

      <div className="px-5 pb-8 pt-4 border-t-[1.5px] border-mm-border bg-mm-surface">
        <DestinationRow onSelect={share} />
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <ShareComposer />
    </Suspense>
  );
}
