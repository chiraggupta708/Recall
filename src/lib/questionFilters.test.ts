import { describe, expect, it } from "vitest";
import { createQuestionRecord } from "./recall";
import { filterQuestions } from "./questionFilters";

describe("question filters", () => {
  const now = new Date("2026-05-28T00:00:00.000Z");
  const dueDsa = createQuestionRecord(
    {
      category: "dsa",
      question: "Two Sum",
      link: "",
      topic: "Arrays",
      difficulty: "easy",
      codeOrAnswer: "Hash map",
      myThinking: "Nested loops",
      correctThinking: "Complements",
      whatILearned: "One pass"
    },
    new Date("2026-05-27T00:00:00.000Z")
  );
  const futureHld = createQuestionRecord(
    {
      category: "hld",
      question: "URL shortener",
      link: "",
      topic: "Scale",
      difficulty: "medium",
      codeOrAnswer: "Services",
      myThinking: "Short code",
      correctThinking: "Capacity first",
      whatILearned: "Clarify constraints"
    },
    new Date("2026-05-28T00:00:00.000Z")
  );

  it("filters due questions by category", () => {
    expect(filterQuestions([dueDsa, futureHld], { category: "dsa", view: "due", now })).toEqual([dueDsa]);
    expect(filterQuestions([dueDsa, futureHld], { category: "hld", view: "due", now })).toEqual([]);
  });

  it("shows all logged questions for the selected category", () => {
    expect(filterQuestions([dueDsa, futureHld], { category: "hld", view: "all", now })).toEqual([futureHld]);
  });
});
