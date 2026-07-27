"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Microphone, FileText, MusicNotes } from "@phosphor-icons/react/ssr";
import { useTutorStore } from "@/stores/tutor-store";
import { MmChip } from "@/components/ui/mm-chip";
import { SafeArea } from "@/components/layout/safe-area";
import type { TutorScope } from "@/types/domain";

function scopeLabel(scope: TutorScope) {
  if (scope.type === "everything") return "Tudo que enviei";
  if (scope.type === "exam") return "Prova ativa";
  if (scope.type === "subject") return scope.subject;
  if (scope.type === "material") return "Material";
  return "Este card";
}

export default function TutorConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  const router = useRouter();
  const { currentConversation, open, send, sending } = useTutorStore();
  const [text, setText] = useState("");

  useEffect(() => {
    if (currentConversation?.id !== conversationId) open(conversationId);
  }, [conversationId, currentConversation?.id, open]);

  if (!currentConversation) return null;

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    const val = text;
    setText("");
    await send(val);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <SafeArea edges={["top"]}>
        <div className="px-5 pt-4 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/tutor")}
            aria-label="Voltar"
            className="flex size-9 items-center justify-center rounded-full text-mm-ink"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div className="flex-1">
            <div className="font-heading font-extrabold text-lg text-mm-ink">Chat do Tutor</div>
          </div>
          <MmChip selected>{scopeLabel(currentConversation.scope)}</MmChip>
        </div>
      </SafeArea>

      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-3 pb-4 pt-1">
        {currentConversation.messages.map((m) => (
          <div key={m.id}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.origin === "student"
                  ? "self-end ml-auto rounded-br-md bg-mm-brand text-mm-on-brand font-medium"
                  : "self-start rounded-bl-md bg-mm-surface-alt text-mm-ink"
              }`}
            >
              {m.beyondMaterial && (
                <span className="inline-block mb-2 rounded-full bg-mm-warn-soft px-3 py-1 font-heading font-extrabold text-xs text-mm-warn-ink">
                  Além do seu material
                </span>
              )}
              <div>{m.text}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {m.sources.map((source) => (
                    <button
                      key={source.excerptId}
                      type="button"
                      onClick={() => toast(`Fonte: ${source.label}`)}
                      className="inline-flex items-center gap-1 rounded-full bg-mm-info-soft px-3 py-1 text-xs font-bold text-mm-info-ink"
                    >
                      {source.label.includes(":") ? (
                        <MusicNotes size={13} weight="bold" />
                      ) : (
                        <FileText size={13} weight="bold" />
                      )}
                      Ver fonte · {source.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => toast("Card criado ✓ Entra na sua próxima sessão.")}
          className="self-start rounded-full border-[1.5px] border-mm-border bg-mm-surface-alt px-4 py-2 font-heading font-bold text-sm text-mm-brand-ink"
        >
          ＋ Criar card disso
        </button>
      </div>

      <SafeArea edges={["bottom"]} className="px-4 pt-3 bg-gradient-to-t from-mm-canvas to-transparent">
        <div className="flex items-center gap-2 pb-5">
          <input
            name="tutorMessage"
            aria-label="Pergunta de boa"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Pergunta de boa…"
            className="min-w-0 flex-1 min-h-12 rounded-xl border-[1.5px] border-mm-border bg-mm-surface-alt px-4 text-sm text-mm-ink outline-none"
          />
          <button
            type="button"
            onClick={() => toast("Fala aí. Pode perguntar do seu jeito.")}
            aria-label="Perguntar por voz"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-mm-brand text-mm-on-brand"
          >
            <Microphone size={22} weight="bold" />
          </button>
        </div>
      </SafeArea>
    </div>
  );
}
