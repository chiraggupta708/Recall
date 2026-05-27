"use client";

import { FormEvent, useState } from "react";
import { AppFrame } from "@/components/AppFrame";
import type { Category, Difficulty, QuestionInput } from "@/lib/types";

const initialForm: QuestionInput = {
  category: "dsa",
  question: "",
  link: "",
  topic: "",
  difficulty: "medium",
  codeOrAnswer: "",
  myThinking: "",
  correctThinking: "",
  whatILearned: ""
};

export default function LogPage() {
  const [form, setForm] = useState<QuestionInput>(initialForm);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof QuestionInput>(field: K, value: QuestionInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setSaving(false);

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setStatus(body.error ?? "Could not save question.");
      return;
    }

    setForm(initialForm);
    setStatus("Saved. First recall is scheduled for tomorrow.");
  }

  return (
    <AppFrame active="log">
      <section className="hero">
        <div className="headline">
          <h2>Capture the problem while the reasoning is fresh.</h2>
          <p className="subtitle">
            Keep the entry complete enough for future recall, but light enough to log quickly.
          </p>
        </div>
        <aside className="stat-panel">
          <div>
            <div className="stat-number">1</div>
            <p className="subtitle">day until first recall</p>
          </div>
          <p className="subtitle">DSA, HLD, and LLD all follow the same active recall loop.</p>
        </aside>
      </section>

      <form className="form-panel" onSubmit={submit}>
        <div className="form-grid">
          <label className="field">
            Category
            <select value={form.category} onChange={(event) => updateField("category", event.target.value as Category)}>
              <option value="dsa">DSA Coding</option>
              <option value="hld">HLD</option>
              <option value="lld">LLD</option>
            </select>
          </label>

          <label className="field">
            Difficulty
            <select
              value={form.difficulty}
              onChange={(event) => updateField("difficulty", event.target.value as Difficulty)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label className="field full">
            Question
            <input
              required
              value={form.question}
              onChange={(event) => updateField("question", event.target.value)}
              placeholder="Binary search boundary condition"
            />
          </label>

          <label className="field">
            Link
            <input value={form.link} onChange={(event) => updateField("link", event.target.value)} placeholder="https://..." />
          </label>

          <label className="field">
            Topic
            <input required value={form.topic} onChange={(event) => updateField("topic", event.target.value)} placeholder="Arrays, DP, Rate limiter" />
          </label>

          <label className="field full">
            Code or Answer
            <textarea
              required
              value={form.codeOrAnswer}
              onChange={(event) => updateField("codeOrAnswer", event.target.value)}
              placeholder="Paste code, design answer, or solution notes."
            />
          </label>

          <label className="field full">
            My Thinking
            <textarea
              required
              value={form.myThinking}
              onChange={(event) => updateField("myThinking", event.target.value)}
              placeholder="What you were thinking during the attempt."
            />
          </label>

          <label className="field full">
            Correct Thinking
            <textarea
              required
              value={form.correctThinking}
              onChange={(event) => updateField("correctThinking", event.target.value)}
              placeholder="The clean approach you want future-you to recall."
            />
          </label>

          <label className="field full">
            What I Learned
            <textarea
              required
              value={form.whatILearned}
              onChange={(event) => updateField("whatILearned", event.target.value)}
              placeholder="The lesson, mistake, or pattern to remember."
            />
          </label>
        </div>

        <div className="actions">
          <span className={status.startsWith("Saved") ? "status good" : "status"}>{status}</span>
          <button className="primary" disabled={saving} type="submit">
            {saving ? "Saving..." : "Save question"}
          </button>
        </div>
      </form>
    </AppFrame>
  );
}
