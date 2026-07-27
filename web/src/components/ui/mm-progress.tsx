"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { progressFill } from "@/lib/motion";

/** Linear progress bar with an animated brand fill. */
export function MmProgress({
  value,
  label,
  className,
  tone = "brand",
}: {
  value: number;
  label?: string;
  className?: string;
  tone?: "brand" | "warn" | "mut" | "mastery";
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const fillColor =
    tone === "brand"
      ? "var(--mm-brand-d)"
      : tone === "warn"
        ? "var(--mm-warn)"
        : tone === "mastery"
          ? "var(--mm-mastery)"
          : "var(--mm-mut)";

  useEffect(() => {
    if (fillRef.current) progressFill(fillRef.current, { width: `${value}%` });
  }, [value]);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-mm-surface-alt"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div ref={fillRef} className="h-full rounded-full" style={{ width: 0, background: fillColor }} />
      </div>
    </div>
  );
}

/** Segmented progress for the session: one pip per card. */
export function MmSegmentedProgress({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex gap-1 h-[10px]", className)}
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Questão ${current + 1} de ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-full transition-colors duration-200",
            i < current ? "bg-mm-brand-d" : i === current ? "bg-mm-brand-d/60" : "bg-mm-surface-alt",
          )}
        />
      ))}
    </div>
  );
}
