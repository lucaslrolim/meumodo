"use client";

import { useState } from "react";

/** Editable transcription review for photo/PDF materials, with visual
 * flags for low-confidence spans. */
export function OcrEditor({
  title,
  initialText,
  uncertainSpans = [],
  onChange,
}: {
  title: string;
  initialText: string;
  uncertainSpans?: string[];
  onChange?: (text: string) => void;
}) {
  const [text, setText] = useState(initialText);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-[#F5F2EA] border border-[#E7E1D2] p-5 text-[#33322E]">
        <div className="font-heading font-bold mb-2">{title}</div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onChange?.(e.target.value);
          }}
          rows={8}
          spellCheck={false}
          aria-label={`Texto reconhecido de ${title}`}
          className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed outline-none"
        />
      </div>
      {uncertainSpans.length > 0 && (
        <div className="flex items-center gap-2.5 px-1">
          <span className="inline-block size-3.5 rounded bg-mm-warn/60" aria-hidden="true" />
          <span className="text-[12.5px] text-mm-ink-2">
            Trecho difícil de ler — confere e edita se precisar.
          </span>
        </div>
      )}
    </div>
  );
}
