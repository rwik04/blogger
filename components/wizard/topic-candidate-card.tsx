"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2, ArrowRight, Link as LinkIcon } from "lucide-react";
import type { TopicOut } from "@/lib/api/types";
import { selectTopic } from "@/lib/api/topics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopicCandidateCardProps {
  topic: TopicOut;
}

const DEDUP_LABEL: Record<string, string> = {
  new: "New",
  similar_to_existing: "Similar to existing",
  needs_review: "Needs review",
};

export function TopicCandidateCard({ topic }: TopicCandidateCardProps) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => selectTopic(topic.topic_id),
    onSuccess: (data) => router.push(`/blogs/${data.run_id}`),
  });

  return (
    <Card className="rounded-lg bg-surface-container ring-0 border border-border p-4">
      <CardContent className="p-0 h-full flex flex-col gap-3">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-ui-medium text-on-surface leading-snug">{topic.title}</h4>
            <Badge variant={topic.dedup_status === "new" ? "success" : "warning"} className="shrink-0">
              {DEDUP_LABEL[topic.dedup_status] ?? topic.dedup_status}
            </Badge>
          </div>

          {topic.one_line_summary && (
            <p className="text-ui-base text-on-surface-variant leading-relaxed">{topic.one_line_summary}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {topic.subject && (
              <span className="text-data-label text-graphite">{topic.subject.replace(/_/g, " ")}</span>
            )}
            {topic.gs_papers?.map((paper) => (
              <span key={paper} className="text-data-label text-proof-blue-light">
                {paper}
              </span>
            ))}
          </div>

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

        <Button
          size="sm"
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          Generate Blog
        </Button>
      </CardContent>
    </Card>
  );
}
