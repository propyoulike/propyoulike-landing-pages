export type FaqSourceLevel = "universal" | "builder" | "project";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;   // optional
}

export interface ResolvedFaqItem extends FaqItem {
  category: string;     // normalized (always exists)
  level: FaqSourceLevel;
}
