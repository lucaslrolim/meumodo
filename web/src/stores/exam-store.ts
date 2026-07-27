import { create } from "zustand";
import type { Exam } from "@/types/domain";
import { examRepository } from "@/lib/data";

interface ExamState {
  currentExam: Exam | null;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
  load: (id: string) => Promise<void>;
  loadActive: () => Promise<Exam | null>;
  create: (input: { subject: Exam["subject"]; title: string; examDate?: string }) => Promise<Exam>;
  addMaterial: (input: { type: "photo" | "pdf" | "audio"; name: string }) => Promise<void>;
  confirmMaterial: (materialId: string, text: string) => Promise<void>;
  generatePractice: () => Promise<string>;
  finish: (rating: number) => Promise<void>;
}

export const useExamStore = create<ExamState>((set, get) => ({
  currentExam: null,
  sessionId: null,
  loading: false,
  error: null,

  async load(id) {
    set({ loading: true, error: null });
    try {
      const exam = await examRepository.get(id);
      set({ currentExam: exam, loading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Erro ao carregar", loading: false });
    }
  },

  async loadActive() {
    set({ loading: true });
    const exam = await examRepository.getActive();
    set({ currentExam: exam, loading: false });
    return exam;
  },

  async create(input) {
    const exam = await examRepository.create(input);
    set({ currentExam: exam });
    return exam;
  },

  async addMaterial(input) {
    const current = get().currentExam;
    if (!current) return;
    const exam = await examRepository.addMaterial(current.id, input);
    set({ currentExam: exam });
  },

  async confirmMaterial(materialId, text) {
    const current = get().currentExam;
    if (!current) return;
    const exam = await examRepository.confirmMaterial(current.id, materialId, text);
    set({ currentExam: exam });
  },

  async generatePractice() {
    const current = get().currentExam;
    if (!current) throw new Error("No active exam");
    const session = await examRepository.generatePractice(current.id);
    set({ sessionId: session.id });
    return session.id;
  },

  async finish(rating) {
    const current = get().currentExam;
    if (!current) return;
    const exam = await examRepository.finish(current.id, rating);
    set({ currentExam: exam });
  },
}));
