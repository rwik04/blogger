"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Loader2, Link as LinkIcon, Flame } from "lucide-react";
import type { TopicOut } from "@/lib/api/types";
import { deleteTopic, selectTopic } from "@/lib/api/topics";
import { getSubjectStyle } from "@/lib/constants/tag-colors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HotTopicsModalProps {
  subject: string | null;
  topics: TopicOut[];
  onOpenChange: (open: boolean) => void;
}

function relevanceVariant(score: number | null): "success" | "info" | "warning" | "neutral" {
  if (score === null) return "neutral";
  if (score >= 75) return "success";
  if (score >= 50) return "info";
  return "warning";
}

/**
 * Domain drill-down modal — opened from a Hot Topics tile, lists every
 * candidate for that subject with the same select/reject actions available
 * in the dashboard's `TopicQueue`.
 */
export function HotTopicsModal({ subject, topics, onOpenChange }: HotTopicsModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const selectMutation = useMutation({
    mutationFn: (topicId: string) => selectTopic(topicId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      router.push(`/blogs/${data.run_id}`);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (topicId: string) => deleteTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const style = subject ? getSubjectStyle(subject) : null;
  const sorted = [...topics].sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0));

  return (
    <Dialog open={subject !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2 text-headline-md font-normal">
            <Flame className={`w-4 h-4 ${style?.text ?? "text-amber-light"}`} />
            {subject?.replace(/_/g, " ")}
          </DialogTitle>
          <DialogDescription>
            {sorted.length} topic{sorted.length === 1 ? "" : "s"} in this subject, ranked by relevance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border">
          {sorted.map((topic) => {
            const isSelecting = selectMutation.isPending && selectMutation.variables === topic.topic_id;
            const isRejecting = rejectMutation.isPending && rejectMutation.variables === topic.topic_id;
            const isBusy = isSelecting || isRejecting;

            return (
              <div key={topic.topic_id} className="px-5 py-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-ui-medium text-on-surface leading-snug">{topic.title}</h4>
                  <Badge variant={relevanceVariant(topic.relevance_score)} className="shrink-0">
                    {topic.relevance_score ?? "—"}
                  </Badge>
                </div>

                {topic.one_line_summary && (
                  <p className="text-ui-base text-on-surface-variant leading-relaxed">{topic.one_line_summary}</p>
                )}

                {topic.current_relevance && (
                  <p className="text-data-label text-graphite leading-relaxed">{topic.current_relevance}</p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {topic.gs_papers?.map((paper) => (
                    <span key={paper} className="text-data-label text-proof-blue-light">
                      {paper}
                    </span>
                  ))}
                  {topic.trigger_source_url && (
                    <a
                      href={topic.trigger_source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-data-label text-proof-blue-light hover:underline"
                    >
                      <LinkIcon className="w-3 h-3" /> source
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    disabled={isBusy}
                    onClick={() => selectMutation.mutate(topic.topic_id)}
                  >
                    {isSelecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Generate Blog
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isBusy}
                    onClick={() => rejectMutation.mutate(topic.topic_id)}
                    className="text-redline-light hover:bg-redline/25 hover:text-redline-light"
                  >
                    {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="px-5 py-8 text-center text-ui-base text-graphite">No topics left in this subject.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
