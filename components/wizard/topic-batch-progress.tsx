"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AgentEventTimeline, type TimelineEvent } from "@/components/shared/agent-event-timeline";
import { TopicCandidateCard } from "@/components/wizard/topic-candidate-card";
import { getTopicBatch, getTopicBatchEvents, listTopics } from "@/lib/api/topics";
import { usePolling } from "@/lib/hooks/use-poll";

const TERMINAL_BATCH_STATUSES = ["done", "failed"];

interface TopicBatchProgressProps {
  batchId: string;
  onReset: () => void;
}

/**
 * Live status card for a Topic Generator batch: status badge, the growing
 * agent event timeline, and (once done) the resulting candidate cards.
 * Split out of the composer so the query box can go back to its idle state
 * (examples + recent runs) as soon as a batch is kicked off.
 */
export function TopicBatchProgress({ batchId, onReset }: TopicBatchProgressProps) {
  const batchQuery = usePolling(["topic-batch", batchId], () => getTopicBatch(batchId), true);
  const isActive = !TERMINAL_BATCH_STATUSES.includes(batchQuery.data?.status ?? "");
  const eventsQuery = usePolling(["topic-batch-events", batchId], () => getTopicBatchEvents(batchId, 30), isActive);
  const isDone = batchQuery.data?.status === "done";

  const candidatesQuery = useQuery({
    queryKey: ["topics", "batch-candidates", batchId],
    queryFn: () => listTopics({ status: "suggested", limit: 200 }),
    enabled: isDone,
  });

  const candidates = (candidatesQuery.data?.items ?? []).filter((t) => t.batch_id === batchId);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl bg-surface-container-low ring-0 border border-border p-4">
        <CardContent className="p-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isActive && <Loader2 className="w-4 h-4 animate-spin text-proof-blue-light" />}
              <span className="text-ui-medium text-on-surface">Batch</span>
              <StatusBadge status={batchQuery.data?.status ?? "queued"} />
            </div>
            <Button variant="ghost" size="sm" onClick={onReset}>
              Start over
            </Button>
          </div>

          {batchQuery.data?.error && <p className="text-ui-base text-redline-light">{batchQuery.data.error}</p>}

          {eventsQuery.data && eventsQuery.data.events.length > 0 && (
            <AgentEventTimeline
              events={eventsQuery.data.events.map(
                (event, idx): TimelineEvent => ({
                  ...event,
                  key: `${event.step}-${event.created_at}-${idx}`,
                })
              )}
              maxHeightClassName="max-h-[280px]"
            />
          )}
        </CardContent>
      </Card>

      {isDone && (
        <div>
          {candidates.length === 0 ? (
            <p className="text-ui-base text-on-surface-variant">No new candidates survived dedup this round.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {candidates.map((topic) => (
                <TopicCandidateCard key={topic.topic_id} topic={topic} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
