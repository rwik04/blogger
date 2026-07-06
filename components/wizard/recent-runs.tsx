"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Inbox } from "lucide-react";
import { listRuns } from "@/lib/api/runs";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelativeTime } from "@/lib/utils/seo-format";

/**
 * Recent runs list — a lightweight preview (last 5) of `GET /runs`, mirroring
 * the "Past Runs" section of agent-style composer UIs. `/blogs` has the full
 * filterable table; this is just enough to jump back into recent work.
 */
export function RecentRuns() {
  const { data, isLoading } = useQuery({
    queryKey: ["runs", "recent"],
    queryFn: () => listRuns({ limit: 5 }),
  });

  const runs = data?.items ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-headline-md text-on-surface font-normal">Recent runs</h3>
        <Link
          href="/blogs"
          className="text-data-label text-proof-blue-light hover:text-proof-blue transition-colors"
        >
          View all
        </Link>
      </div>

      {isLoading && <p className="text-ui-base text-graphite">Loading runs</p>}

      {!isLoading && runs.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <Inbox className="w-6 h-6 text-graphite mx-auto mb-2" />
          <p className="text-ui-base text-graphite">No previous runs yet. Try a query above.</p>
        </div>
      )}

      {runs.length > 0 && (
        <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
          {runs.map((run) => (
            <Link
              key={run.run_id}
              href={`/blogs/${run.run_id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors duration-150 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-ui-base text-on-surface truncate">{run.topic}</span>
                  <StatusBadge status={run.status} />
                </div>
              </div>
              {run.created_at && (
                <span className="text-data-value text-graphite shrink-0">
                  {formatRelativeTime(run.created_at)}
                </span>
              )}
              <ArrowRight className="w-4 h-4 text-graphite opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
