"use client";

import { toast } from "sonner";

interface Story {
  name: string;
  emoji: string;
  message: string;
  live?: boolean;
}

const STORIES: Story[] = [
  { name: "Lucas", emoji: "🎯", message: "Lucas mandou bem em Cinemática!", live: true },
  { name: "Bia", emoji: "📚", message: "Bia dominou 8 conceitos de Física!", live: true },
  { name: "Pedro", emoji: "🚀", message: "Pedro estudou MRU em 10 min!" },
  { name: "Ju", emoji: "🔥", message: "Ju acertou 12 cards seguidos!" },
  { name: "Rafa", emoji: "🎙️", message: "Rafa usou áudio pra estudar!" },
];

/** Fictional demo activity, same convention as the rest of the mocked data
 * in this app (Ana, Lista_MRU.pdf, etc). Never wire real student data
 * through this component without an explicit consent flow. */
export function StoryRow() {
  return (
    <div className="flex gap-3.5 overflow-x-auto px-6 py-3">
      {STORIES.map((s) => (
        <button
          key={s.name}
          type="button"
          onClick={() => toast(s.message)}
          className="flex w-14 shrink-0 flex-col items-center gap-1.5"
        >
          <span
            className={`rounded-full p-[2px] ${
              s.live ? "bg-gradient-to-br from-mm-brand to-mm-info" : "bg-mm-border"
            }`}
          >
            <span className="flex size-14 items-center justify-center rounded-full border-2 border-mm-canvas bg-mm-surface text-2xl transition-transform active:scale-90">
              {s.emoji}
            </span>
          </span>
          {s.live ? (
            <span className="-mt-3.5 rounded-full bg-mm-heart px-1.5 py-px font-heading text-[8px] font-extrabold uppercase tracking-wide text-white">
              ao vivo
            </span>
          ) : null}
          <span className="text-[11px] font-heading font-bold text-mm-ink-2">{s.name}</span>
        </button>
      ))}
    </div>
  );
}
