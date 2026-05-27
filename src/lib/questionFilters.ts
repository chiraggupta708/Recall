import type { Category, QuestionRecord } from "./types";

type FilterOptions = {
  category: Category;
  view: "due" | "all";
  now?: Date;
};

export function filterQuestions(questions: QuestionRecord[], options: FilterOptions) {
  return questions
    .filter((question) => question.category === options.category)
    .filter(
      (question) =>
        options.view === "all" ||
        new Date(question.nextReviewAt).getTime() <= (options.now ?? new Date()).getTime()
    )
    .sort((first, second) => new Date(first.nextReviewAt).getTime() - new Date(second.nextReviewAt).getTime());
}
