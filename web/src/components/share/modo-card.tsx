"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

export type ModoCardVariant = "transformation" | "session" | "week";
export type ModoCardFormat = "video" | "image" | "square";

const TAG = "Física · Cinemática";

/** Outbound shareable artifact. Never carries material content, answers,
 * errors, school or grade — only aggregate, student-approved stats. Video
 * format reveals beats in sequence via GSAP; reduced motion shows every
 * beat at once. */
export function ModoCard({
  variant,
  format,
  showName,
  studentName = "Ana",
  playing,
}: {
  variant: ModoCardVariant;
  format: ModoCardFormat;
  showName: boolean;
  studentName?: string;
  playing: boolean;
}) {
  const beatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!beatsRef.current) return;
    const beats = Array.from(beatsRef.current.querySelectorAll<HTMLElement>("[data-beat]"));
    if (!playing || format !== "video" || prefersReducedMotion()) {
      gsap.set(beats, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(beats, { opacity: 0, y: 9 });
    const tl = gsap.timeline({ repeat: -1 });
    beats.forEach((beat, i) => {
      tl.to(beat, { opacity: 1, y: 0, duration: 0.3 }, i * 0.55).to(
        beat,
        { opacity: 0, duration: 0.2 },
        i * 0.55 + 1.4,
      );
    });
    return () => {
      tl.kill();
    };
  }, [playing, format, variant]);

  const name = showName ? studentName : null;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[18px] border-[1.5px] border-mm-border bg-mm-canvas p-3.5 ${
        format === "square" ? "aspect-square w-[236px]" : "aspect-[9/16] w-[196px]"
      }`}
    >
      <div
        className="absolute -right-12 -top-12 size-40 rounded-full bg-mm-brand-glow blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 flex items-center gap-1.5">
        <span className="flex size-[17px] items-center justify-center rounded-[5px] bg-mm-brand font-heading font-black text-[9px] text-mm-on-brand">
          mm
        </span>
        <span className="font-heading font-extrabold text-[10.5px] text-mm-ink">meu modo</span>
      </div>

      <div ref={beatsRef} className="relative z-10 flex flex-1 flex-col justify-center gap-2.5 py-2">
        <CardStage variant={variant} name={name} />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-1.5">
        <span className="text-[8.5px] font-semibold text-mm-ink-2">{TAG}</span>
        <span className="font-heading font-extrabold text-[9.5px] text-mm-brand-ink">meumodo.app</span>
      </div>
    </div>
  );
}

function CardStage({ variant, name }: { variant: ModoCardVariant; name: string | null }) {
  if (variant === "transformation") {
    return (
      <>
        <div data-beat className="font-heading font-extrabold text-[8.5px] tracking-widest uppercase text-mm-brand-ink">
          {name ? `${name} mandou o material` : "meu material virou prática"}
        </div>
        <div
          data-beat
          className="-rotate-2 rounded-md bg-[#F5F2EA] p-2 text-[7.5px] leading-relaxed text-[#33322E]"
        >
          <b>Lista — MRU</b>
          <br />
          1) Um carro percorre 200 km em 4 h…
          <br />
          2) Um trem a 90 km/h…
          <br />v = ΔS / Δt
        </div>
        <div data-beat className="flex items-center gap-1.5 font-heading font-extrabold text-[9px] text-mm-brand-ink">
          <span aria-hidden="true">↓</span> virou
        </div>
        <div data-beat>
          <div className="font-heading font-black text-[31px] leading-[1.02] text-mm-ink">
            12
            <br />
            questões
          </div>
          <div className="mt-1.5 text-[11px] font-medium text-mm-ink-2">1 foto do caderno · 3 temas</div>
        </div>
      </>
    );
  }

  if (variant === "session") {
    return (
      <>
        <div data-beat className="font-heading font-extrabold text-[8.5px] tracking-widest uppercase text-mm-brand-ink">
          {name ? `a sessão d${name === "Ana" ? "a" : "e"} ${name}` : "fechou por hoje"}
        </div>
        <div data-beat>
          <div className="font-heading font-black text-[31px] leading-[1.02] text-mm-ink">10 min</div>
          <div className="mt-1.5 text-[11px] font-medium text-mm-ink-2">3 conceitos praticados</div>
        </div>
        <div data-beat className="flex flex-col gap-1.5">
          {[
            ["Velocidade média", 85],
            ["MRU", 80],
            ["Gráficos S×t", 20],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[8.5px] font-semibold text-mm-ink-2">{label}</span>
              <span className="block h-[5px] overflow-hidden rounded-full bg-mm-surface-alt">
                <span
                  className="block h-full rounded-full bg-mm-brand-d"
                  style={{ width: `${value}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div data-beat className="font-heading font-extrabold text-[8.5px] tracking-widest uppercase text-mm-brand-ink">
        {name ? `a semana d${name === "Ana" ? "a" : "e"} ${name}` : "minha semana"}
      </div>
      <div data-beat>
        <div className="font-heading font-black text-[31px] leading-[1.02] text-mm-ink">
          4
          <br />
          sessões
        </div>
        <div className="mt-1.5 text-[11px] font-medium text-mm-ink-2">12 revisões feitas</div>
      </div>
      <div data-beat className="flex gap-1">
        {[1, 1, 0, 1, 1, 0, 0].map((on, i) => (
          <span
            key={i}
            className={`size-3.5 rounded-full ${on ? "bg-mm-brand-d" : "bg-mm-surface-alt"}`}
          />
        ))}
      </div>
    </>
  );
}
