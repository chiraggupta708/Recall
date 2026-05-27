export const categories = ["dsa", "hld", "lld"] as const;
export const difficulties = ["easy", "medium", "hard"] as const;
export const reviewGrades = ["again", "hard", "good", "easy"] as const;

export type Category = (typeof categories)[number];
export type Difficulty = (typeof difficulties)[number];
export type ReviewGrade = (typeof reviewGrades)[number];

export type QuestionInput = {
  category: Category;
  question: string;
  link: string;
  topic: string;
  difficulty: Difficulty;
  codeOrAnswer: string;
  myThinking: string;
  correctThinking: string;
  whatILearned: string;
};

export type QuestionRecord = QuestionInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
  nextReviewAt: string;
  scheduleStep: number;
  lastReviewedAt: string | null;
  reviewCount: number;
};

export type QuestionUpdate = Partial<QuestionInput>;
