"use client";

import { useState } from "react";
import { Check, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopicSuggestion } from "@/lib/types/blog";

interface TopicQueueProps {
  topics: TopicSuggestion[];
}

/**
 * Topic Review Queue — displays pending topic suggestions with approve/reject actions.
 *
 * Approve/reject is optimistic in Phase 1 (immediate UI update). In Phase 4,
 * this will use TanStack Query mutations with rollback on failure + toast.
 */
export function TopicQueue({ topics: initialTopics }: TopicQueueProps) {
  const [topics, setTopics] = useState(initialTopics);

  const handleApprove = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "approved" as const } : t))
    );
  };

  const handleReject = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "rejected" as const } : t))
    );
  };

  const pendingTopics = topics.filter((t) => t.status === "pending");

  if (pendingTopics.length === 0) {
    return (
      <div className="bg-surface-container border border-border rounded-lg p-6 text-center">
        <Lightbulb className="w-6 h-6 text-graphite mx-auto mb-2" />
        <p className="text-ui-base text-on-surface-variant">
          No topics waiting. Add one manually.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-headline-md text-on-surface">Topics awaiting review</h3>
      </div>

      <div className="divide-y divide-border">
        {pendingTopics.slice(0, 5).map((topic) => (
          <div
            key={topic.id}
            id={`topic-${topic.id}`}
            className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container-high transition-colors duration-150"
          >
            <div className="flex-1 min-w-0">
              <p className="text-ui-medium text-on-surface truncate">
                {topic.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-data-label text-graphite">
                  {topic.subjectTag}
                </span>
                {topic.examPaper && (
                  <span className="text-data-label text-graphite">
                    {topic.examPaper}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleApprove(topic.id)}
                className="p-1.5 rounded-md bg-moss/15 text-moss-light hover:bg-moss/25 transition-colors duration-150"
                aria-label={`Approve ${topic.title}`}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(topic.id)}
                className="p-1.5 rounded-md bg-redline/15 text-redline-light hover:bg-redline/25 transition-colors duration-150"
                aria-label={`Reject ${topic.title}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
