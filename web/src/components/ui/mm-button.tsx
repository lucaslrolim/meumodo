import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const mmButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-heading font-black text-base tracking-tight transition-[transform,filter,background-color] duration-150 active:scale-[0.97] active:brightness-95 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "min-h-12 bg-mm-action text-mm-on-action hover:bg-mm-action-hover disabled:bg-mm-surface-alt disabled:text-mm-mut",
        secondary:
          "min-h-12 bg-mm-canvas text-mm-ink border-[1.5px] border-mm-ink/15 disabled:opacity-50",
        tertiary:
          "min-h-11 bg-transparent text-mm-info-ink underline-offset-4 hover:underline active:scale-100 disabled:opacity-50",
        whatsapp:
          "min-h-12 bg-[#25D366] text-[#06210f] disabled:bg-mm-surface-alt disabled:text-mm-mut",
        dark: "min-h-12 bg-mm-ink text-white disabled:bg-mm-surface-alt disabled:text-mm-mut",
      },
      size: {
        default: "px-6",
        sm: "min-h-11 px-4 text-sm",
        block: "w-full px-6",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface MmButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mmButtonVariants> {}

/** Primary button primitive: flat fill, TikTok-flat radius, press-only tactility. */
export function MmButton({ className, variant, size, ...props }: MmButtonProps) {
  return <button className={cn(mmButtonVariants({ variant, size }), className)} {...props} />;
}

export const mmButtonClass = mmButtonVariants;
