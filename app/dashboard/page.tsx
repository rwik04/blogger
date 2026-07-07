"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ContinueDraftingList } from "@/components/dashboard/continue-drafting-list";
import { AgentFeed, type DashboardAgentEvent } from "@/components/dashboard/agent-feed";
import { TopicQueue } from "@/components/dashboard/topic-queue";
import { HotTopicsBoard, type HotTopicDomain } from "@/components/dashboard/hot-topics-board";
import { listRuns, getRunEvents, getStats } from "@/lib/api/runs";
import { listTopics } from "@/lib/api/topics";
import type { TopicOut } from "@/lib/api/types";

const ACTIVE_STATUSES = ["pending", "running", "strategizing", "writing", "finishing"];

/**
 * Dashboard page — live view of the pipeline: run stats, in-flight runs,
 * a merged agent-event feed across active runs (polled — no SSE in the
 * real backend), and the topic review queue.
 */
export default function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    refetchInterval: 5000,
  });

  const activeRunsQuery = useQuery({
    queryKey: ["runs", "active"],
    queryFn: async () => {
      const results = await Promise.all(ACTIVE_STATUSES.map((status) => listRuns({ status, limit: 20 })));
      return results
        .flatMap((r) => r.items)
        .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    },
    refetchInterval: 5000,
  });

  const activeRuns = activeRunsQuery.data ?? [];

  const eventsQuery = useQuery({
    queryKey: ["runs", "active-events", activeRuns.map((r) => r.run_id).join(",")],
    queryFn: async (): Promise<DashboardAgentEvent[]> => {
      const topRuns = activeRuns.slice(0, 6);
      const results = await Promise.all(
        topRuns.map(async (run) => {
          const { events } = await getRunEvents(run.run_id, 10);
          return events.map((event) => ({ ...event, run_id: run.run_id, run_topic: run.topic }));
        })
      );
      return results
        .flat()
        .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
        .slice(0, 20);
    },
    enabled: activeRuns.length > 0,
    refetchInterval: 5000,
  });

  const topicsQuery = useQuery({
    queryKey: ["topics", "suggested"],
    queryFn: () => listTopics({ status: "suggested", limit: 50 }),
    refetchInterval: 5000,
  });

  const allTopicsQuery = useQuery({
    queryKey: ["topics", "all-for-hot-topics"],
    queryFn: () => listTopics({ limit: 200 }),
    refetchInterval: 15000,
  });

  // Neutral fallback for topics persisted before `relevance_score` existed
  // (or still awaiting the backfill script) — keeps them visible in the
  // board at a middling weight instead of vanishing or dominating.
  const FALLBACK_RELEVANCE = 50;

  const hotTopicDomains: HotTopicDomain[] = (() => {
    const items = allTopicsQuery.data?.items ?? [];
    const bySubject = new Map<string, TopicOut[]>();
    for (const topic of items) {
      const key = topic.subject ?? "miscellaneous_current_affairs";
      const existing = bySubject.get(key) ?? [];
      existing.push(topic);
      bySubject.set(key, existing);
    }
    return Array.from(bySubject.entries()).map(([subject, topics]) => ({
      subject,
      heat: topics.reduce((sum, t) => sum + (t.relevance_score ?? FALLBACK_RELEVANCE), 0),
      topics,
    }));
  })();

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div>
        <h2 className="text-headline-lg text-on-surface">Dashboard</h2>
        <p className="text-ui-base text-on-surface-variant mt-1">
          Your editorial pipeline at a glance.
        </p>
      </div>

      <StatsRow
        stats={statsQuery.data}
        topicsQueued={topicsQuery.data?.items.length ?? 0}
        isLoading={statsQuery.isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotTopicsBoard domains={hotTopicDomains} isLoading={allTopicsQuery.isLoading} />
        <TopicQueue topics={topicsQuery.data?.items ?? []} isLoading={topicsQuery.isLoading} />
        <ContinueDraftingList runs={activeRuns} isLoading={activeRunsQuery.isLoading} />
        <AgentFeed events={eventsQuery.data ?? []} isLoading={eventsQuery.isLoading && activeRuns.length > 0} />
      </div>
    </div>
  );
}
