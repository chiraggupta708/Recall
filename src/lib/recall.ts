import { randomUUID } from "node:crypto";
import type { QuestionInput, QuestionRecord, ReviewGrade } from "./types";

const reviewIntervals = [1, 3, 7, 14] as const;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getIntervalForStep(step: number) {
  return reviewIntervals[Math.min(Math.max(step, 0), reviewIntervals.length - 1)];
}

export function createQuestionRecord(input: QuestionInput, now = new Date()): QuestionRecord {
  const timestamp = now.toISOString();

  return {
    ...input,
    id: randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
    nextReviewAt: addDays(now, reviewIntervals[0]).toISOString(),
    scheduleStep: 0,
    lastReviewedAt: null,
    reviewCount: 0
  };
}

export function applyReviewGrade(
  question: QuestionRecord,
  grade: ReviewGrade,
  now = new Date()
): QuestionRecord {
  const nextStep =
    grade === "again"
      ? 0
      : grade === "hard"
        ? question.scheduleStep
        : Math.min(question.scheduleStep + 1, reviewIntervals.length - 1);

  return {
    ...question,
    scheduleStep: nextStep,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addDays(now, getIntervalForStep(nextStep)).toISOString(),
    reviewCount: question.reviewCount + 1,
    updatedAt: now.toISOString()
  };
}

export function isDue(question: QuestionRecord, now = new Date()) {
  return new Date(question.nextReviewAt).getTime() <= now.getTime();
}
