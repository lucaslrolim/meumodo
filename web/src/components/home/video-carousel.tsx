"use client";

import { toast } from "sonner";
import { Play } from "@phosphor-icons/react/ssr";

interface VideoCard {
  bg: string;
  title: string;
  subtitle: string;
  message: string;
}

const CARDS: VideoCard[] = [
  {
    bg: "linear-gradient(155deg,#123B22,#1E6B33)",
    title: "📸→⚡",
    subtitle: "slide vira exercício",
    message: "Tire foto do slide e veja virar exercício!",
  },
  {
    bg: "linear-gradient(155deg,#0E2A3D,#155E75)",
    title: "🎯 Lucas",
    subtitle: "dominou Cinemática",
    message: "Lucas estudou Cinemática em 10 min e acertou 8 de 10!",
  },
  {
    bg: "linear-gradient(155deg,#2E1A47,#5B21B6)",
    title: "📚 Bia",
    subtitle: "7 conceitos em 1 sem.",
    message: "Bia foi de 0 a 7 conceitos de Física em 1 semana!",
  },
  {
    bg: "linear-gradient(155deg,#3D2410,#B45309)",
    title: "🎙️ Pedro",
    subtitle: "estudou só falando",
    message: "Pedro mandou áudio e os cards foram gerados na hora!",
  },
];

/** TikTok-style horizontal card carousel, 9:16 full-bleed tiles. Fictional/
 * demo content — no real video, tap reveals the caption as a toast. */
export function VideoCarousel() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
      <div className="w-4 shrink-0" aria-hidden="true" />
      {CARDS.map((c) => (
        <button
          key={c.subtitle}
          type="button"
          onClick={() => toast(c.message)}
          style={{ background: c.bg }}
          className="relative flex h-[234px] w-[132px] shrink-0 snap-start flex-col items-center justify-center overflow-hidden rounded-2xl text-left"
        >
          <Play
            size={26}
            weight="fill"
            className="mb-1 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2.5 pb-2 pt-8 text-center">
            <div className="font-heading font-extrabold text-[13px] text-white">{c.title}</div>
            <div className="text-[10.5px] text-white/75">{c.subtitle}</div>
          </div>
        </button>
      ))}
      <div className="w-2 shrink-0" aria-hidden="true" />
    </div>
  );
}
