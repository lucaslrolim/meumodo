"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Simulated waveform and timer while recording audio. */
export function AudioRecorder({ recording }: { recording: boolean }) {
  const [seconds, setSeconds] = useState(0);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  useEffect(() => {
    if (!recording || prefersReducedMotion() || !barsRef.current) return;
    const bars = Array.from(barsRef.current.children);
    const tweens = bars.map((bar) =>
      gsap.to(bar, {
        scaleY: () => 0.35 + Math.random() * 0.65,
        duration: 0.4 + Math.random() * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),
    );
    return () => tweens.forEach((t) => t.kill());
  }, [recording]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="font-heading font-black text-5xl tabular-nums text-mm-ink" aria-live="polite">
        {minutes}:{secs}
      </div>
      <div ref={barsRef} className="flex items-center gap-1 h-14" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} className="w-[5px] h-full rounded-full bg-mm-brand-d origin-center scale-y-50" />
        ))}
      </div>
      <span className="sr-only" role="status">
        {recording ? "Gravando" : "Gravação pausada"}
      </span>
    </div>
  );
}
