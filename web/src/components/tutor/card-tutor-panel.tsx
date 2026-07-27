"use client";

import { useState } from "react";
import { Microphone } from "@phosphor-icons/react/ssr";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { MmButton } from "@/components/ui/mm-button";
import { MmChip } from "@/components/ui/mm-chip";
import type { Card } from "@/types/domain";

interface Message {
  id: string;
  origin: "student" | "tutor";
  text: string;
}

const REPLIES: Record<string, string> = {
  simpler: "De boa. É só: <b>o quanto andou ÷ o tempo que levou</b>.",
  differently: "Pensa assim: se anda 50 km/h, ele faz 50 km a cada hora. Em 4h: 4 × 50 = 200 km. Bate ✓",
  example: "Exemplo do seu material: uma bike que percorre 60 km em 3 horas tem velocidade média de 20 km/h.",
  source: "Isso tá na fonte marcada aqui em cima — toca em \"Fonte\" pra ver o trecho.",
  similar: "Manda: um ônibus percorre 300 km em 5 horas. Qual a velocidade média?",
};

/** Tutor of the Card: opens within the activity without losing the current
 * card, attempt or progress. Prioritizes the current card but keeps the
 * free-text field open for other questions. */
export function CardTutorPanel({
  card,
  open,
  onOpenChange,
}: {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      origin: "tutor",
      text: "Oi! Tô aqui pra essa questão. Travou em alguma parte, ou quer que eu explique de outro jeito?",
    },
  ]);
  const [text, setText] = useState("");

  const askQuick = (key: keyof typeof REPLIES, label: string) => {
    setMessages((m) => [
      ...m,
      { id: `${Date.now()}-q`, origin: "student", text: label },
      { id: `${Date.now()}-a`, origin: "tutor", text: REPLIES[key] },
    ]);
  };

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { id: `${Date.now()}-q`, origin: "student", text },
      {
        id: `${Date.now()}-a`,
        origin: "tutor",
        text:
          "Boa. O caminho é sempre distância ÷ tempo. Tenta aplicar isso na questão — se travar, pede uma pista.",
      },
    ]);
    setText("");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-mm-surface border-mm-border p-5 pb-8 gap-0 max-h-[92dvh]">
        <div className="flex items-center justify-between mb-1">
          <div className="font-heading font-extrabold text-lg text-mm-ink">Tutor do card</div>
          <span className="rounded-full bg-mm-info-soft px-3 py-1 font-heading font-extrabold text-xs text-mm-info-ink">
            Sobre esta questão
          </span>
        </div>
        <div className="flex flex-wrap gap-2 my-4">
          <MmChip onClick={() => askQuick("simpler", "Explica mais simples")}>Explica mais simples</MmChip>
          <MmChip onClick={() => askQuick("differently", "De outro jeito")}>De outro jeito</MmChip>
          <MmChip onClick={() => askQuick("example", "Dá um exemplo")}>Dá um exemplo</MmChip>
          <MmChip onClick={() => askQuick("source", "Onde tá na fonte?")}>Onde tá na fonte?</MmChip>
          <MmChip onClick={() => askQuick("similar", "Cria uma parecida")}>Cria uma parecida</MmChip>
        </div>
        <div className="flex flex-col gap-3 my-2 max-h-56 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.origin === "student"
                  ? "self-end rounded-br-md bg-mm-brand text-mm-on-brand"
                  : "self-start rounded-bl-md bg-mm-surface-alt text-mm-ink"
              }`}
              dangerouslySetInnerHTML={{ __html: m.text }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2.5 mt-4">
          <input
            name="cardTutorMessage"
            aria-label="Pergunta pro tutor"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Pergunta pro tutor…"
            className="min-w-0 flex-1 min-h-12 rounded-xl border-[1.5px] border-mm-border bg-mm-surface-alt px-4 text-sm text-mm-ink outline-none"
          />
          <button
            type="button"
            aria-label="Perguntar por voz"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-mm-brand text-mm-on-brand"
          >
            <Microphone size={22} weight="bold" />
          </button>
        </div>
        <MmButton variant="secondary" size="block" className="mt-4" onClick={() => onOpenChange(false)}>
          Voltar pra questão
        </MmButton>
      </DrawerContent>
    </Drawer>
  );
}
