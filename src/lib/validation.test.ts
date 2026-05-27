import { describe, expect, it } from "vitest";
import { parseQuestionInput, parseQuestionUpdate, parseReviewGrade } from "./validation";

describe("api validation", () => {
  it("accepts a complete question input", () => {
    expect(
      parseQuestionInput({
        category: "dsa",
        question: "Two Sum",
        link: "",
        topic: "Arrays",
        difficulty: "easy",
        codeOrAnswer: "Hash map",
        myThinking: "Nested loops",
        correctThinking: "Use complements",
        whatILearned: "One pass"
      })
    ).toMatchObject({ category: "dsa", question: "Two Sum" });
  });

  it("rejects missing required fields", () => {
    expect(() => parseQuestionInput({ category: "dsa" })).toThrow("question is required");
  });

  it("accepts partial editable updates only", () => {
    expect(parseQuestionUpdate({ topic: "Graphs", scheduleStep: 3 })).toEqual({ topic: "Graphs" });
  });

  it("validates review grade values", () => {
    expect(parseReviewGrade({ grade: "good" })).toBe("good");
    expect(() => parseReviewGrade({ grade: "great" })).toThrow("grade must be again, hard, good, or easy");
  });
});
