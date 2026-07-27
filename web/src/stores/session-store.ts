import { create } from "zustand";
import type { Session } from "@/types/domain";
import { sessionRepository } from "@/lib/data";

interface SessionState {
  session: Session | null;
  answered: boolean;
  loading: boolean;
  load: (id: string) => Promise<void>;
  answer: (input: { mode: "text" | "voice" | "choice" | "skip"; value: string }) => Promise<boolean>;
  next: () => Promise<void>;
  currentCard: () => Session["cards"][number] | null;
  isComplete: () => boolean;
  lastPointsEarned: () => number;
  totalPoints: () => number;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  answered: false,
  loading: false,

  async load(id) {
    set({ loading: true });
    const session = await sessionRepository.get(id);
    set({ session, loading: false, answered: false });
  },

  async answer({ mode, value }) {
    const current = get().session;
    if (!current) return false;
    const session = await sessionRepository.answer(current.id, { mode, value });
    set({ session, answered: true });
    return session.attempts[session.attempts.length - 1]?.correct ?? false;
  },

  async next() {
    const current = get().session;
    if (!current) return;
    const session = await sessionRepository.next(current.id);
    set({ session: { ...session }, answered: false });
  },

  currentCard() {
    const current = get().session;
    if (!current) return null;
    return current.cards[current.currentIndex] ?? null;
  },

  isComplete() {
    const current = get().session;
    if (!current) return false;
    return current.currentIndex >= current.cards.length;
  },

  lastPointsEarned() {
    const current = get().session;
    if (!current) return 0;
    return current.attempts[current.attempts.length - 1]?.pointsEarned ?? 0;
  },

  totalPoints() {
    const current = get().session;
    if (!current) return 0;
    return current.attempts.reduce((sum, a) => sum + a.pointsEarned, 0);
  },
}));
