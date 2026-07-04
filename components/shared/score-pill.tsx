"use client";

import { cn } from "@/lib/utils";
import { getScoreColor, getScoreBgColor } from "@/lib/utils/seo-format";

interface ScorePillProps {
  score: number;
  className?: string;
}

/**
 * Circular score pill for SEO scores. Uses data-value typography
 * and color-codes based on score threshold (red < 60 < amber < 80 < green).
 */
export function ScorePill({ score, className }: ScorePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-full text-data-value font-medium",
        getScoreBgColor(score),
        getScoreColor(score),
        className
      )}
    >
      {score}
    </span>
  );
}

/**
 * Inline score display for table rows.
 */
export function ScoreInline({ score, className }: ScorePillProps) {
  return (
    <span className={cn("text-data-value", getScoreColor(score), className)}>
      {score}
    </span>
  );
}
