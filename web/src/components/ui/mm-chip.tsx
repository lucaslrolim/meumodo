import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] px-4 py-2 font-heading font-bold text-sm transition-colors",
  {
    variants: {
      selected: {
        true: "border-mm-brand-ink bg-mm-brand-soft text-mm-brand-ink",
        false: "border-mm-border bg-mm-surface-alt text-mm-ink-2",
      },
    },
    defaultVariants: { selected: false },
  },
);

/** Selectable chip for filters, subjects and multiple-choice options. */
export function MmChip({
  className,
  selected,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof chipVariants>) {
  return (
    <button type="button" className={cn(chipVariants({ selected }), className)} {...props} />
  );
}

const chipStatusVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-[5px] font-heading font-extrabold text-xs",
  {
    variants: {
      tone: {
        ok: "bg-mm-brand-soft text-mm-brand-ink",
        warn: "bg-mm-warn-soft text-mm-warn-ink",
        info: "bg-mm-info-soft text-mm-info-ink",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

/** Inline status pill, e.g. "Fonte conferida". */
export function MmChipStatus({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipStatusVariants>) {
  return <span className={cn(chipStatusVariants({ tone }), className)} {...props} />;
}
