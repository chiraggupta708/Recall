import {
  categories,
  difficulties,
  reviewGrades,
  type QuestionInput,
  type QuestionUpdate,
  type ReviewGrade
} from "./types";

const editableFields = [
  "category",
  "question",
  "link",
  "topic",
  "difficulty",
  "codeOrAnswer",
  "myThinking",
  "correctThinking",
  "whatILearned"
] as const;

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("request body must be an object");
  }

  return value as Record<string, unknown>;
}

function requiredString(body: Record<string, unknown>, field: keyof QuestionInput) {
  const value = body[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }

  return value.trim();
}

function optionalString(body: Record<string, unknown>, field: keyof QuestionInput) {
  const value = body[field];

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function parseQuestionInput(value: unknown): QuestionInput {
  const body = asRecord(value);
  const category = requiredString(body, "category");
  const question = requiredString(body, "question");
  const topic = requiredString(body, "topic");
  const difficulty = requiredString(body, "difficulty");

  if (!categories.includes(category as QuestionInput["category"])) {
    throw new Error("category must be dsa, hld, or lld");
  }

  if (!difficulties.includes(difficulty as QuestionInput["difficulty"])) {
    throw new Error("difficulty must be easy, medium, or hard");
  }

  return {
    category: category as QuestionInput["category"],
    question,
    link: optionalString(body, "link"),
    topic,
    difficulty: difficulty as QuestionInput["difficulty"],
    codeOrAnswer: requiredString(body, "codeOrAnswer"),
    myThinking: requiredString(body, "myThinking"),
    correctThinking: requiredString(body, "correctThinking"),
    whatILearned: requiredString(body, "whatILearned")
  };
}

export function parseQuestionUpdate(value: unknown): QuestionUpdate {
  const body = asRecord(value);
  const update: QuestionUpdate = {};

  for (const field of editableFields) {
    const value = body[field];

    if (typeof value !== "string") {
      continue;
    }

    if (field === "category" && !categories.includes(value as QuestionInput["category"])) {
      throw new Error("category must be dsa, hld, or lld");
    }

    if (field === "difficulty" && !difficulties.includes(value as QuestionInput["difficulty"])) {
      throw new Error("difficulty must be easy, medium, or hard");
    }

    update[field] = value.trim() as never;
  }

  return update;
}

export function parseReviewGrade(value: unknown): ReviewGrade {
  const body = asRecord(value);
  const grade = body.grade;

  if (!reviewGrades.includes(grade as ReviewGrade)) {
    throw new Error("grade must be again, hard, good, or easy");
  }

  return grade as ReviewGrade;
}
