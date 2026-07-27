"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const COLORS = ["#4AE54A", "#FFD700", "#FF6B35", "#BF5AF2", "#64D2FF", "#FF2D55"];
const PIECES = 28;

/** One-shot confetti burst for celebrations. Renders nothing until fired,
 * then spawns absolutely-positioned dots animated with GSAP and cleans up. */
export function Confetti({ fire }: { fire: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fire || prefersReducedMotion()) return;
    const host = hostRef.current;
    if (!host) return;

    const dots: HTMLSpanElement[] = [];
    for (let i = 0; i < PIECES; i++) {
      const dot = document.createElement("span");
      const size = 6 + Math.random() * 6;
      dot.style.cssText = `position:absolute;left:50%;top:40%;width:${size}px;height:${size}px;border-radius:${Math.random() > 0.5 ? "999px" : "2px"};background:${COLORS[i % COLORS.length]};pointer-events:none;`;
      host.appendChild(dot);
      dots.push(dot);
    }

    const tl = gsap.timeline({
      onComplete: () => dots.forEach((d) => d.remove()),
    });
    dots.forEach((dot) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 150;
      tl.fromTo(
        dot,
        { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.7 + 130,
          scale: 0.3,
          opacity: 0,
          rotation: Math.random() * 360 - 180,
          duration: 1.3 + Math.random() * 0.5,
          ease: "power2.out",
        },
        Math.random() * 0.15,
      );
    });

    return () => {
      tl.kill();
      dots.forEach((d) => d.remove());
    };
  }, [fire]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
