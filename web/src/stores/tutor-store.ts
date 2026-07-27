import { create } from "zustand";
import type { TutorConversation, TutorScope } from "@/types/domain";
import { tutorRepository } from "@/lib/data";

interface TutorState {
  conversations: TutorConversation[];
  currentConversation: TutorConversation | null;
  sending: boolean;
  list: () => Promise<void>;
  open: (id: string) => Promise<void>;
  create: (scope: TutorScope, firstQuestion: string) => Promise<TutorConversation>;
  send: (text: string) => Promise<void>;
  cardScope: TutorScope | null;
  openCardTutor: (scope: TutorScope) => void;
  closeCardTutor: () => void;
}

export const useTutorStore = create<TutorState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  sending: false,
  cardScope: null,

  async list() {
    const conversations = await tutorRepository.list();
    set({ conversations });
  },

  async open(id) {
    const conversation = await tutorRepository.get(id);
    set({ currentConversation: conversation });
  },

  async create(scope, firstQuestion) {
    const conversation = await tutorRepository.create(scope, firstQuestion);
    set((s) => ({ conversations: [conversation, ...s.conversations], currentConversation: conversation }));
    return conversation;
  },

  async send(text) {
    const current = get().currentConversation;
    if (!current) return;
    set({ sending: true });
    const { conversation } = await tutorRepository.send(current.id, text);
    set({ currentConversation: conversation, sending: false });
  },

  openCardTutor(scope) {
    set({ cardScope: scope });
  },

  closeCardTutor() {
    set({ cardScope: null });
  },
}));
