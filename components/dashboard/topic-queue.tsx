"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, X, Lightbulb, Loader2 } from "lucide-react";
import type { TopicOut } from "@/lib/api/types";
import { selectTopic } from "@/lib/api/topics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TopicQueueProps {
  topics: TopicOut[];
  isLoading: boolean;
}

/**
 * Topic Review Queue — pending topic suggestions (`status="suggested"`)
 * from `GET /topics`. Approve calls `POST /topics/{id}/select` (kicks off a
 * real Researcher run) and jumps straight into the new run's editor.
 * Reject is UI-only — blogger-backend has no reject/dismiss endpoint.
 */
export function TopicQueue({ topics, isLoading }: TopicQueueProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const approveMutation = useMutation({
    mutationFn: (topicId: string) => selectTopic(topicId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      router.push(`/blogs/${data.run_id}`);
    },
  });

  const visibleTopics = topics.filter((t) => !dismissed.has(t.topic_id));

  if (!isLoading && visibleTopics.length === 0) {
    return (
      <Card className="rounded-lg bg-surface-container ring-0 border border-border p-6 text-center h-[460px] flex flex-col items-center justify-center">
        <Lightbulb className="w-6 h-6 text-graphite mx-auto mb-2" />
        <p className="text-ui-base text-on-surface-variant">
          No topics waiting. Generate some from New Blog.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg bg-surface-container ring-0 border border-border p-0 gap-0 h-[460px] flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-border shrink-0">
        <CardTitle className="text-headline-md text-on-surface font-normal">
          Topics awaiting review
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border flex-1 min-h-0 overflow-y-auto">
        {isLoading && <div className="px-5 py-4 text-ui-base text-graphite">Loading topics…</div>}
        {visibleTopics.map((topic) => {
          const isApproving = approveMutation.isPending && approveMutation.variables === topic.topic_id;

          return (
            <div
              key={topic.topic_id}
              className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container-high transition-colors duration-150"
            >
              <div className="flex-1 min-w-0">
                <p className="text-ui-medium text-on-surface truncate">{topic.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {topic.subject && (
                    <span className="text-data-label text-graphite">
                      {topic.subject.replace(/_/g, " ")}
                    </span>
                  )}
                  {topic.dedup_status !== "new" && (
                    <span className="text-data-label text-amber-light">{topic.dedup_status}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={approveMutation.isPending}
                  onClick={() => approveMutation.mutate(topic.topic_id)}
                  className="text-success-light hover:bg-success/25 hover:text-success-light"
                  aria-label={`Select ${topic.title}`}
                >
                  {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDismissed((prev) => new Set(prev).add(topic.topic_id))}
                  className="text-redline-light hover:bg-redline/25 hover:text-redline-light"
                  aria-label={`Dismiss ${topic.title}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
