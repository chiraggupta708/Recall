"use client";

import { useMemo, useState } from "react";
import { AppFrame } from "@/components/AppFrame";
import { filterQuestions } from "@/lib/questionFilters";
import type { Category, QuestionRecord, ReviewGrade } from "@/lib/types";

const categoryLabels: Record<Category, string> = {
  dsa: "DSA Coding",
  hld: "HLD",
  lld: "LLD"
};

const gradeLabels: Record<ReviewGrade, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy"
};

type RevisionClientProps = {
  initialQuestions: QuestionRecord[];
};

export function RevisionClient({ initialQuestions }: RevisionClientProps) {
  const [questions, setQuestions] = useState<QuestionRecord[]>(initialQuestions);
  const [category, setCategory] = useState<Category>("dsa");
  const [view, setView] = useState<"due" | "all">("due");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState("");

  const visibleQuestions = useMemo(
    () => filterQuestions(questions, { category, view, now: new Date() }),
    [category, questions, view]
  );
  const selected = questions.find((question) => question.id === selectedId) ?? visibleQuestions[0] ?? null;
  const dueCount = filterQuestions(questions, { category, view: "due", now: new Date() }).length;

  function selectQuestion(id: string) {
    setSelectedId(id);
    setAttempt("");
    setRevealed(false);
    setStatus("");
  }

  async function gradeQuestion(grade: ReviewGrade) {
    if (!selected) {
      return;
    }

    const response = await fetch(`/api/questions/${selected.id}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade })
    });

    if (!response.ok) {
      setStatus("Could not update recall schedule.");
      return;
    }

    const body = (await response.json()) as { question: QuestionRecord };
    setQuestions((current) => current.map((question) => (question.id === body.question.id ? body.question : question)));
    setSelectedId(null);
    setAttempt("");
    setRevealed(false);
    setStatus("Recall schedule updated.");
  }

  return (
    <AppFrame active="revision">
      <section className="hero">
        <div className="headline">
          <h2>Start with memory. Reveal only after you try.</h2>
          <p className="subtitle">Questions due today stay separate from your full logged library.</p>
        </div>
        <aside className="stat-panel">
          <div>
            <div className="stat-number">{dueCount}</div>
            <p className="subtitle">due in {categoryLabels[category]}</p>
          </div>
          <div className="tabs">
            {(Object.keys(categoryLabels) as Category[]).map((item) => (
              <button className={`tab ${category === item ? "active" : ""}`} key={item} onClick={() => setCategory(item)}>
                {categoryLabels[item]}
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="revision-layout">
        <div className="list-panel">
          <header>
            <div>
              <strong>{categoryLabels[category]}</strong>
              <p className="subtitle">{view === "due" ? "Due and overdue only" : "Every saved question"}</p>
            </div>
            <div className="subtabs">
              <button className={`pill ${view === "due" ? "active" : ""}`} onClick={() => setView("due")}>
                Due
              </button>
              <button className={`pill ${view === "all" ? "active" : ""}`} onClick={() => setView("all")}>
                All Logged
              </button>
            </div>
          </header>

          <div className="question-list">
            {visibleQuestions.length === 0 ? (
              <div className="empty">No questions here yet.</div>
            ) : (
              visibleQuestions.map((question) => (
                <button
                  className={`question-item ${selected?.id === question.id ? "active" : ""}`}
                  key={question.id}
                  onClick={() => selectQuestion(question.id)}
                >
                  <div className="item-title">
                    <span>{question.question}</span>
                    <span>{question.difficulty}</span>
                  </div>
                  <div className="meta">
                    <span>{question.topic}</span>
                    <span>Next: {new Date(question.nextReviewAt).toLocaleDateString()}</span>
                    <span>Reviews: {question.reviewCount}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="recall-panel">
          {selected ? (
            <>
              <header>
                <div>
                  <strong>Recall prompt</strong>
                  <p className="subtitle">Type the approach before revealing the saved answer.</p>
                </div>
                {selected.link ? (
                  <a className="secondary" href={selected.link} rel="noreferrer" target="_blank">
                    Open link
                  </a>
                ) : null}
              </header>

              <div className="prompt">{selected.question}</div>
              <label className="field full" style={{ marginTop: 16 }}>
                Your remembered approach
                <textarea value={attempt} onChange={(event) => setAttempt(event.target.value)} />
              </label>

              <div className="actions">
                <span className="status">{status}</span>
                <button className="secondary" onClick={() => setRevealed((current) => !current)}>
                  {revealed ? "Hide solution" : "Reveal solution"}
                </button>
              </div>

              {revealed ? (
                <div className="answer-block">
                  <section>
                    <h4>Code or Answer</h4>
                    <pre>{selected.codeOrAnswer}</pre>
                  </section>
                  <section>
                    <h4>My Thinking</h4>
                    <p>{selected.myThinking}</p>
                  </section>
                  <section>
                    <h4>Correct Thinking</h4>
                    <p>{selected.correctThinking}</p>
                  </section>
                  <section>
                    <h4>What I Learned</h4>
                    <p>{selected.whatILearned}</p>
                  </section>
                  <div className="grades">
                    {(Object.keys(gradeLabels) as ReviewGrade[]).map((grade) => (
                      <button className={`grade ${grade}`} key={grade} onClick={() => gradeQuestion(grade)}>
                        {gradeLabels[grade]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="empty">Select a question to start recall.</div>
          )}
        </div>
      </section>
    </AppFrame>
  );
}
