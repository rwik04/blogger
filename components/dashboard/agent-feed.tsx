"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import type { EventOut } from "@/lib/api/types";
import { AgentEventTimeline, type TimelineEvent } from "@/components/shared/agent-event-timeline";

export interface DashboardAgentEvent extends EventOut {
  run_id: string;
  run_topic: string;
}

interface AgentFeedProps {
  events: DashboardAgentEvent[];
  isLoading: boolean;
}

/**
 * Agent Activity feed — last ~20 pipeline node events across active runs,
 * sourced from `GET /runs/{id}/events` (polled while any run is in flight,
 * see `use-poll.ts`). blogger-backend has no SSE, so this is push-by-polling.
 * Rendered as a growing vertical timeline (see `AgentEventTimeline`) so new
 * events visibly extend the activity graph rather than just prepending rows.
 */
export function AgentFeed({ events, isLoading }: AgentFeedProps) {
  const timelineEvents: (TimelineEvent & { run_id: string; run_topic: string })[] = events.map(
    (event, idx) => ({
      ...event,
      key: `${event.run_id}-${event.step}-${event.created_at}-${idx}`,
    })
  );

  return (
    <div className="rounded-lg bg-surface-container border border-border h-[460px] flex flex-col">
      <div className="px-5 py-3 border-b border-border shrink-0">
        <h3 className="text-headline-md text-on-surface font-normal">Agent activity</h3>
      </div>

      <div className="px-5 pt-4 pb-4 flex-1 min-h-0 flex flex-col">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center text-ui-base text-graphite">
            Loading events…
          </div>
        )}
        {!isLoading && events.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <Activity className="w-6 h-6 text-graphite" />
            <p className="text-ui-base text-on-surface-variant">
              No agent activity right now. Kick off a run to see it live.
            </p>
          </div>
        )}
        {!isLoading && events.length > 0 && (
          <AgentEventTimeline
            events={timelineEvents}
            maxHeightClassName="h-full"
            renderHeading={(event) => (
              <p className="text-ui-base text-on-surface font-medium truncate mb-0.5">
                {event.run_topic}
              </p>
            )}
            renderRow={(event, children) => (
              <Link
                href={`/blogs/${event.run_id}`}
                className="block rounded-md -mx-2 px-2 hover:bg-surface-container-high transition-colors duration-150"
              >
                {children}
              </Link>
            )}
          />
        )}
      </div>
    </div>
  );
}
