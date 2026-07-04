"use client";

import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import type { TrendingTopic } from "@/lib/data/mock-data";

interface TrendmapProps {
  topics: TrendingTopic[];
}

/**
 * Topic Trendmap — visual display of today's trending topics.
 * Each topic shows a horizontal bar proportional to its trend score,
 * color-coded by subject tag.
 *
 * This matches the "Today's topic trendmap" section in the Stitch designs.
 */

const SUBJECT_COLORS: Record<string, string> = {
  Polity: "bg-proof-blue",
  Economy: "bg-yellow-500",
  Geography: "bg-cyan-500",
  Environment: "bg-moss",
  "Science & Tech": "bg-purple-500",
  "International Relations": "bg-orange-500",
  Ethics: "bg-pink-500",
};

const SUBJECT_TEXT_COLORS: Record<string, string> = {
  Polity: "text-proof-blue-light",
  Economy: "text-yellow-400",
  Geography: "text-cyan-400",
  Environment: "text-moss-light",
  "Science & Tech": "text-purple-400",
  "International Relations": "text-orange-400",
  Ethics: "text-pink-400",
};

export function Trendmap({ topics }: TrendmapProps) {
  const maxScore = Math.max(...topics.map((t) => t.trendScore));

  return (
    <div className="bg-surface-container border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-proof-blue-light" />
        <h3 className="text-headline-md text-on-surface">
          Today&apos;s topic trendmap
        </h3>
      </div>

      <div className="p-5 space-y-3">
        {topics.map((topic) => {
          const barWidth = (topic.trendScore / maxScore) * 100;
          const barColor = SUBJECT_COLORS[topic.subjectTag] ?? "bg-graphite";
          const textColor = SUBJECT_TEXT_COLORS[topic.subjectTag] ?? "text-graphite";

          return (
            <div
              key={topic.id}
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-ui-base text-on-surface group-hover:text-on-surface transition-colors truncate flex-1 mr-2">
                  {topic.title}
                </span>
                <span className={cn("text-data-label shrink-0", textColor)}>
                  {topic.subjectTag}
                </span>
              </div>
              <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-80",
                    barColor
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
