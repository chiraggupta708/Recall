import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { applyReviewGrade } from "./recall";
import type { QuestionRecord, QuestionUpdate, ReviewGrade } from "./types";

const defaultDataPath = join(process.cwd(), "data", "questions.json");

async function ensureStore(filePath: string) {
  await mkdir(dirname(filePath), { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }

    await writeFile(filePath, "[]\n", "utf8");
  }
}

async function readQuestions(filePath: string): Promise<QuestionRecord[]> {
  await ensureStore(filePath);
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as QuestionRecord[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeQuestions(filePath: string, questions: QuestionRecord[]) {
  await ensureStore(filePath);
  await writeFile(filePath, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
}

export function createQuestionStore(filePath = defaultDataPath) {
  return {
    async list() {
      return readQuestions(filePath);
    },

    async create(question: QuestionRecord) {
      const questions = await readQuestions(filePath);
      questions.push(question);
      await writeQuestions(filePath, questions);
      return question;
    },

    async update(id: string, update: QuestionUpdate) {
      const questions = await readQuestions(filePath);
      const index = questions.findIndex((question) => question.id === id);

      if (index === -1) {
        return null;
      }

      const updated: QuestionRecord = {
        ...questions[index],
        ...update,
        updatedAt: new Date().toISOString()
      };

      questions[index] = updated;
      await writeQuestions(filePath, questions);
      return updated;
    },

    async review(id: string, grade: ReviewGrade, now = new Date()) {
      const questions = await readQuestions(filePath);
      const index = questions.findIndex((question) => question.id === id);

      if (index === -1) {
        return null;
      }

      const reviewed = applyReviewGrade(questions[index], grade, now);
      questions[index] = reviewed;
      await writeQuestions(filePath, questions);
      return reviewed;
    },

    async delete(id: string) {
      const questions = await readQuestions(filePath);
      const nextQuestions = questions.filter((question) => question.id !== id);

      if (nextQuestions.length === questions.length) {
        return false;
      }

      await writeQuestions(filePath, nextQuestions);
      return true;
    }
  };
}

export const questionStore = createQuestionStore();
