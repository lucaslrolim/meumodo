import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Applies real device safe-area insets via `env(safe-area-inset-*)`. */
export function SafeArea({
  children,
  className,
  edges = ["top", "bottom"],
}: {
  children: ReactNode;
  className?: string;
  edges?: Array<"top" | "bottom">;
}) {
  return (
    <div
      className={cn(className)}
      style={{
        paddingTop: edges.includes("top") ? "env(safe-area-inset-top)" : undefined,
        paddingBottom: edges.includes("bottom") ? "env(safe-area-inset-bottom)" : undefined,
      }}
    >
      {children}
    </div>
  );
}
