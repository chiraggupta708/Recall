import { describe, expect, it } from "vitest";
import { applyReviewGrade, createQuestionRecord, isDue } from "./recall";

describe("recall scheduling", () => {
  it("creates a question with first review scheduled for tomorrow", () => {
    const record = createQuestionRecord(
      {
        category: "dsa",
        question: "Two Sum",
        link: "https://leetcode.com/problems/two-sum/",
        topic: "Arrays",
        difficulty: "easy",
        codeOrAnswer: "function twoSum() {}",
        myThinking: "Use brute force.",
        correctThinking: "Use a hash map for complements.",
        whatILearned: "Track seen values."
      },
      new Date("2026-05-27T08:00:00.000Z")
    );

    expect(record.id).toHaveLength(36);
    expect(record.nextReviewAt).toBe("2026-05-28T08:00:00.000Z");
    expect(record.scheduleStep).toBe(0);
    expect(record.reviewCount).toBe(0);
    expect(record.lastReviewedAt).toBeNull();
  });

  it("moves good reviews through 1, 3, 7, and 14 day intervals", () => {
    const base = createQuestionRecord(
      {
        category: "hld",
        question: "Design URL shortener",
        link: "",
        topic: "System design",
        difficulty: "medium",
        codeOrAnswer: "Use API, DB, cache, redirect service.",
        myThinking: "Need short codes.",
        correctThinking: "Discuss scale, collisions, storage, caching.",
        whatILearned: "Start with constraints."
      },
      new Date("2026-05-27T00:00:00.000Z")
    );

    const afterOne = applyReviewGrade(base, "good", new Date("2026-05-28T00:00:00.000Z"));
    expect(afterOne.scheduleStep).toBe(1);
    expect(afterOne.nextReviewAt).toBe("2026-05-31T00:00:00.000Z");

    const afterThree = applyReviewGrade(afterOne, "easy", new Date("2026-05-31T00:00:00.000Z"));
    expect(afterThree.scheduleStep).toBe(2);
    expect(afterThree.nextReviewAt).toBe("2026-06-07T00:00:00.000Z");

    const afterSeven = applyReviewGrade(afterThree, "good", new Date("2026-06-07T00:00:00.000Z"));
    expect(afterSeven.scheduleStep).toBe(3);
    expect(afterSeven.nextReviewAt).toBe("2026-06-21T00:00:00.000Z");

    const afterFourteen = applyReviewGrade(afterSeven, "easy", new Date("2026-06-21T00:00:00.000Z"));
    expect(afterFourteen.scheduleStep).toBe(3);
    expect(afterFourteen.nextReviewAt).toBe("2026-07-05T00:00:00.000Z");
  });

  it("resets on again and repeats current step on hard", () => {
    const record = createQuestionRecord(
      {
        category: "lld",
        question: "Design parking lot",
        link: "",
        topic: "OOP",
        difficulty: "medium",
        codeOrAnswer: "Classes for lot, floor, spot, vehicle.",
        myThinking: "Use inheritance.",
        correctThinking: "Model responsibilities and constraints.",
        whatILearned: "Keep objects small."
      },
      new Date("2026-05-27T00:00:00.000Z")
    );

    const advanced = applyReviewGrade(record, "good", new Date("2026-05-28T00:00:00.000Z"));
    const hard = applyReviewGrade(advanced, "hard", new Date("2026-05-31T00:00:00.000Z"));
    expect(hard.scheduleStep).toBe(1);
    expect(hard.nextReviewAt).toBe("2026-06-03T00:00:00.000Z");

    const again = applyReviewGrade(hard, "again", new Date("2026-06-03T00:00:00.000Z"));
    expect(again.scheduleStep).toBe(0);
    expect(again.nextReviewAt).toBe("2026-06-04T00:00:00.000Z");
  });

  it("marks questions due when next review is today or earlier", () => {
    const record = createQuestionRecord(
      {
        category: "dsa",
        question: "Binary Search",
        link: "",
        topic: "Search",
        difficulty: "easy",
        codeOrAnswer: "while left <= right",
        myThinking: "Move pointers.",
        correctThinking: "Define invariant first.",
        whatILearned: "Boundaries matter."
      },
      new Date("2026-05-27T00:00:00.000Z")
    );

    expect(isDue(record, new Date("2026-05-27T23:59:00.000Z"))).toBe(false);
    expect(isDue(record, new Date("2026-05-28T00:00:00.000Z"))).toBe(true);
    expect(isDue(record, new Date("2026-05-29T00:00:00.000Z"))).toBe(true);
  });
});
