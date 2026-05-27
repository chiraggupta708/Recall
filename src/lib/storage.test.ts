import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createQuestionRecord } from "./recall";
import { createQuestionStore } from "./storage";

let tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
  tempDirs = [];
});

async function makeStore() {
  const dir = await mkdtemp(join(tmpdir(), "recall-store-"));
  tempDirs.push(dir);
  return createQuestionStore(join(dir, "questions.json"));
}

describe("question storage", () => {
  it("creates a JSON file when reading an empty store", async () => {
    const store = await makeStore();

    await expect(store.list()).resolves.toEqual([]);
    await expect(store.list()).resolves.toEqual([]);
  });

  it("creates, updates, reviews, and deletes questions", async () => {
    const store = await makeStore();
    const question = createQuestionRecord(
      {
        category: "dsa",
        question: "Two Sum",
        link: "",
        topic: "Arrays",
        difficulty: "easy",
        codeOrAnswer: "Hash map",
        myThinking: "Nested loops.",
        correctThinking: "Store complements.",
        whatILearned: "One pass is enough."
      },
      new Date("2026-05-27T00:00:00.000Z")
    );

    await store.create(question);
    expect(await store.list()).toHaveLength(1);

    const updated = await store.update(question.id, {
      question: "Two Sum updated",
      topic: "Hash map"
    });
    expect(updated.question).toBe("Two Sum updated");
    expect(updated.scheduleStep).toBe(0);

    const reviewed = await store.review(question.id, "good", new Date("2026-05-28T00:00:00.000Z"));
    expect(reviewed.scheduleStep).toBe(1);
    expect(reviewed.reviewCount).toBe(1);

    await store.delete(question.id);
    expect(await store.list()).toEqual([]);
  });
});
