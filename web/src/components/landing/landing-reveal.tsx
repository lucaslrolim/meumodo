"use client";

import { useEffect } from "react";

/** Adds .lp-in to .lp-rv elements as they enter the viewport (landing scroll reveal). */
export function LandingReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("lp-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    document.querySelectorAll(".lp-rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
