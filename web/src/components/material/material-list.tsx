import { FileText, Camera, MusicNotes, Plus } from "@phosphor-icons/react/ssr";
import type { Material } from "@/types/domain";
import { MmChipStatus } from "@/components/ui/mm-chip";

const ICONS = { pdf: FileText, photo: Camera, audio: MusicNotes };
const ICON_BG = {
  pdf: "bg-mm-info-soft text-mm-info-ink",
  photo: "bg-mm-brand-soft text-mm-brand-ink",
  audio: "bg-mm-warn-soft text-mm-warn-ink",
};

function statusLabel(material: Material) {
  if (material.status === "read") return { tone: "ok" as const, label: "✓ Conferido" };
  if (material.status === "processing") return { tone: "warn" as const, label: "… Processando" };
  if (material.status === "lowConfidence") return { tone: "warn" as const, label: "! Confere" };
  return { tone: "info" as const, label: "Enviado" };
}

function metaLabel(material: Material) {
  if (material.type === "pdf") return `${material.pages ?? "?"} páginas`;
  if (material.type === "audio" && material.durationMs) {
    const seconds = Math.round(material.durationMs / 1000);
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }
  return "agora";
}

/** List of materials attached to an exam, with confirmation status. */
export function MaterialList({ materials }: { materials: Material[] }) {
  return (
    <div className="flex flex-col gap-3">
      {materials.map((material) => {
        const Icon = ICONS[material.type];
        const status = statusLabel(material);
        return (
          <div
            key={material.id}
            className="flex items-center gap-4 rounded-2xl border border-mm-border bg-mm-surface p-4 shadow-[0_2px_0_var(--mm-border)]"
          >
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${ICON_BG[material.type]}`}>
              <Icon size={20} weight="bold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-bold text-[15px] text-mm-ink truncate">{material.name}</div>
              <div className="text-xs text-mm-ink-2">{metaLabel(material)}</div>
            </div>
            <MmChipStatus tone={status.tone} className="shrink-0">
              {status.label}
            </MmChipStatus>
          </div>
        );
      })}
      {materials.length >= 3 && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mm-border p-4 font-heading font-bold text-sm text-mm-mut">
          <Plus size={16} weight="bold" />
          Limite de 3 materiais por prova
        </div>
      )}
    </div>
  );
}
