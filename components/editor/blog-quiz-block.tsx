"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MCQOption, MCQStatement, QuestionType } from "@/lib/api/types";

interface BlogQuizBlockProps {
  questionType: QuestionType;
  stem: string;
  statements: MCQStatement[];
  options: MCQOption[];
  correctOption: string;
  explanation: string | null;
}

/**
 * Interactive MCQ rendered inline within the article body, right after the
 * section it was drawn from — click an option to check yourself, the
 * explanation reveals alongside the correct answer.
 *
 * Two shapes, per `questionType`:
 * - "statement_based": UPSC prelims style — the `options` (e.g. "1 and 3
 *   only") only make sense alongside the numbered `statements` they refer
 *   to, so both render together, plus the "Which of the statements..."
 *   lead-in line.
 * - "direct": a plain single-answer question — `stem` already reads as the
 *   full question, so no statements list or lead-in line is shown, just
 *   the question followed directly by its answer choices.
 * `is_true`/`is_correct` are never shown ahead of time either way — that's
 * exactly what picking an option is supposed to reveal.
 */
export function BlogQuizBlock({
  questionType,
  stem,
  statements,
  options,
  correctOption,
  explanation,
}: BlogQuizBlockProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const isStatementBased = questionType === "statement_based";

  return (
    <div className="my-6 rounded-lg border border-sky/30 bg-sky/[0.06] overflow-hidden not-prose">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-sky/20 bg-sky/10">
        <HelpCircle className="w-4 h-4 text-sky-light shrink-0" />
        <span className="text-data-label text-sky-light uppercase">Check yourself</span>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-ui-medium text-on-surface">{stem}</p>

        {isStatementBased && statements.length > 0 && (
          <ol className="list-decimal pl-5 space-y-1.5">
            {statements.map((s, i) => (
              <li key={i} className="text-ui-base text-on-surface-variant">
                {s.text}
              </li>
            ))}
          </ol>
        )}

        {isStatementBased && (
          <p className="text-ui-base text-on-surface-variant italic">
            Which of the statement{statements.length > 1 ? "s" : ""} given above is/are correct?
          </p>
        )}

        <div className="space-y-1.5">
          {options.map((opt) => {
            const isSelected = selected === opt.label;
            const isCorrect = opt.label === correctOption;
            const revealed = selected !== null;

            return (
              <button
                key={opt.label}
                type="button"
                disabled={revealed}
                onClick={() => setSelected(opt.label)}
                className={cn(
                  "w-full flex items-start gap-2.5 text-left px-3 py-2 rounded-md border text-ui-base transition-colors",
                  !revealed && "border-border hover:border-sky/50 hover:bg-sky/[0.08] cursor-pointer",
                  revealed && isCorrect && "border-moss/50 bg-moss/[0.12] text-on-surface",
                  revealed && isSelected && !isCorrect && "border-redline/50 bg-redline/[0.12] text-on-surface",
                  revealed && !isSelected && !isCorrect && "border-border text-on-surface-variant opacity-60"
                )}
              >
                <span className="shrink-0 font-medium text-graphite">{opt.label}.</span>
                <span className="flex-1">{opt.text}</span>
                {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-moss-light shrink-0 mt-0.5" />}
                {revealed && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-redline-light shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {selected !== null && explanation && (
          <p className="text-data-label text-on-surface-variant border-t border-border/60 mt-1 pt-3">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
}
