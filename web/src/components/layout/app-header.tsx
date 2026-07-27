"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SafeArea } from "./safe-area";

/** Screen header: back button, title, optional progress slot. */
export function AppHeader({
  title,
  eyebrow,
  onBack,
  right,
  progress,
  className,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  onBack?: (() => void) | true;
  right?: ReactNode;
  progress?: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const handleBack = onBack === true ? () => router.back() : onBack;

  return (
    <SafeArea edges={["top"]} className={cn("shrink-0", className)}>
      <header className="flex items-center gap-3 px-4 pt-3 pb-2 min-h-14">
        {handleBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mm-surface-alt border border-mm-border text-mm-ink transition-transform active:scale-95"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <div className="text-[11px] font-bold uppercase tracking-wider text-mm-mut">
              {eyebrow}
            </div>
          )}
          <div className="font-heading font-extrabold text-lg leading-tight text-mm-ink truncate">
            {title}
          </div>
          {progress && <div className="mt-1.5">{progress}</div>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </header>
    </SafeArea>
  );
}
