/** Domain types for the student product. User-facing copy stays PT-BR
 * (positioning doc mandates the product's language); code identifiers are
 * English throughout. */

export type Subject = "Física" | "Matemática" | "Química";

export type MaterialStatus = "sent" | "processing" | "read" | "lowConfidence" | "error";

export type MaterialType = "photo" | "pdf" | "audio";

/** A traceable excerpt of a material, located by page/region or time range. */
export interface SourceExcerpt {
  id: string;
  materialId: string;
  location: { type: "page"; page: number; region?: string } | { type: "time"; startMs: number; endMs: number };
  text: string;
  lowConfidence?: boolean;
}

/** An extracted/transcribed representation of a material, confirmed by the student. */
export interface MaterialVersion {
  id: string;
  materialId: string;
  text: string;
  excerpts: SourceExcerpt[];
  confirmedByStudent: boolean;
}

export interface Material {
  id: string;
  examId: string;
  type: MaterialType;
  name: string;
  status: MaterialStatus;
  createdAt: string;
  durationMs?: number;
  pages?: number;
  currentVersion?: MaterialVersion;
}

export interface Concept {
  id: string;
  name: string;
  mastery: number;
  status: "steady" | "progressing" | "starting";
}

export type AnswerMode = "text" | "voice" | "choice" | "skip";

export interface Attempt {
  id: string;
  cardId: string;
  mode: AnswerMode;
  value: string;
  correct: boolean;
  pointsEarned: number;
  helpUsed: Array<"hint" | "tutor">;
  createdAt: string;
}

export interface Card {
  id: string;
  concept: Concept["name"];
  type: "open" | "multipleChoice";
  question: string;
  options?: string[];
  answer: string;
  unit?: string;
  steps: string[];
  formula?: string;
  source: SourceExcerpt;
  hint: string;
  likeBaseline: number;
}

export interface Exam {
  id: string;
  subject: Subject;
  title: string;
  examDate?: string;
  createdAt: string;
  materials: Material[];
  concepts: Concept[];
  status: "creating" | "materials" | "processing" | "ready" | "inProgress" | "completed";
}

export interface Session {
  id: string;
  examId: string;
  cards: Card[];
  durationMin: number;
  currentIndex: number;
  attempts: Attempt[];
  completedAt?: string;
}

export type MessageOrigin = "student" | "tutor";

export interface TutorMessage {
  id: string;
  origin: MessageOrigin;
  text: string;
  sources?: Array<{ label: string; excerptId: string }>;
  beyondMaterial?: boolean;
  createdAt: string;
}

export type TutorScope =
  | { type: "everything" }
  | { type: "exam"; examId: string }
  | { type: "subject"; subject: Subject }
  | { type: "material"; materialId: string }
  | { type: "card"; cardId: string; sessionId: string };

export interface TutorConversation {
  id: string;
  title: string;
  scope: TutorScope;
  messages: TutorMessage[];
  updatedAt: string;
}
