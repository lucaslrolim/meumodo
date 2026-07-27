"use client";

import { toast } from "sonner";
import { Fire, Lightning, Diamond } from "@phosphor-icons/react/ssr";

/** Duolingo-style stat bar for hub screens: streak, XP and gems as tappable
 * chips (tap explains the stat, demo) + avatar on the right. Values are
 * mocked until the gamification backend lands — same convention as the
 * rest of the demo data (Ana, exam-1). */
export function GameHeader({
  streak = 7,
  xp = 340,
  gems = 26,
  avatar = "A",
}: {
  streak?: number;
  xp?: number;
  gems?: number;
  avatar?: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-mm-border px-6 pt-5 pb-3">
      <StatChip
        icon={<Fire size={16} weight="fill" />}
        value={streak}
        color="text-mm-streak"
        label={`${streak} dias seguidos! Estuda hoje pra manter o fogo 🔥`}
      />
      <StatChip
        icon={<Lightning size={16} weight="fill" />}
        value={xp}
        color="text-mm-xp"
        label={`${xp} pontos de prática. Cada acerto soma ⚡`}
      />
      <StatChip
        icon={<Diamond size={16} weight="fill" />}
        value={gems}
        color="text-mm-gem"
        label={`${gems} gemas. Ganha mais fechando sessões 💎`}
      />
      <div className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full bg-mm-surface-alt font-heading font-black text-[14px] text-mm-ink">
        {avatar}
      </div>
    </div>
  );
}

function StatChip({
  icon,
  value,
  color,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  color: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => toast(label)}
      className="flex items-center gap-1.5 font-heading font-black text-[13px] text-mm-ink transition-transform active:scale-95"
    >
      <span className={color}>{icon}</span>
      {value}
    </button>
  );
}
