"use client";

import { useState } from "react";
import { Play } from "@phosphor-icons/react/ssr";
import { MmChipStatus } from "@/components/ui/mm-chip";

interface Segment {
  id: string;
  start: string;
  end: string;
  text: string;
  lowConfidence?: boolean;
}

/** Timecoded transcript review for audio materials, editable per segment. */
export function TranscriptEditor({ segments }: { segments: Segment[] }) {
  const [texts, setTexts] = useState(() => Object.fromEntries(segments.map((s) => [s.id, s.text])));

  return (
    <div className="flex flex-col gap-3">
      {segments.map((segment) => (
        <div
          key={segment.id}
          className={`flex gap-3 items-start rounded-2xl border bg-mm-surface p-4 ${
            segment.lowConfidence ? "border-mm-warn" : "border-mm-border"
          }`}
        >
          <button
            type="button"
            aria-label={`Tocar trecho ${segment.start} a ${segment.end}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mm-surface-alt border border-mm-border text-mm-ink"
          >
            <Play size={16} weight="fill" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] text-mm-mut">
                {segment.start} – {segment.end}
              </span>
              {segment.lowConfidence && <MmChipStatus tone="warn">! confere esse trecho</MmChipStatus>}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                setTexts((prev) => ({ ...prev, [segment.id]: e.currentTarget.textContent ?? "" }))
              }
              className="text-sm leading-snug text-mm-ink outline-none"
            >
              {texts[segment.id]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
