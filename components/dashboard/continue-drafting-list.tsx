"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RunStatusResponse } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils/seo-format";

interface ContinueDraftingListProps {
  runs: RunStatusResponse[];
  isLoading: boolean;
}

/** Rough pipeline-stage progress inferred from `blog_runs.status`, for the mini progress bar. */
const STAGE_INDEX: Record<string, number> = {
  pending: 0,
  running: 1,
  strategizing: 2,
  writing: 3,
  finishing: 4,
  done: 5,
};

/**
 * Continue Drafting section — runs that are still in flight (not `done`/
 * `failed`), sourced from `GET /runs?status=...`.
 */
export function ContinueDraftingList({ runs, isLoading }: ContinueDraftingListProps) {
  if (!isLoading && runs.length === 0) {
    return (
      <Card className="rounded-lg bg-surface-container ring-0 border border-border p-8 text-center h-[460px] flex flex-col items-center justify-center">
        <FileText className="w-8 h-8 text-graphite mx-auto mb-3" />
        <p className="text-ui-base text-on-surface-variant mb-4">
          No blogs in progress. Start one.
        </p>
        <Button render={<Link href="/new" />} nativeButton={false}>
          New Blog
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg bg-surface-container ring-0 border border-border p-0 gap-0 h-[460px] flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
        <CardTitle className="text-headline-md text-on-surface font-normal">
          Continue drafting
        </CardTitle>
        <Link
          href="/blogs"
          className="text-data-label text-proof-blue-light hover:text-proof-blue transition-colors"
        >
          View all →
        </Link>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border flex-1 min-h-0 overflow-y-auto">
        {isLoading && (
          <div className="px-5 py-4 text-ui-base text-graphite">Loading runs…</div>
        )}
        {runs.map((run) => {
          const stage = STAGE_INDEX[run.status] ?? 0;
          const progressPercent = (stage / 5) * 100;

          return (
            <Link
              key={run.run_id}
              href={`/blogs/${run.run_id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-high transition-colors duration-150 group"
            >
              <div className="w-1 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0">
                <div
                  className={cn("w-full rounded-full transition-all", "bg-proof-blue")}
                  style={{ height: `${progressPercent}%` }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-ui-medium text-on-surface truncate">{run.topic}</span>
                  <StatusBadge status={run.status} />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {run.audience_tag && (
                    <span className="text-data-label text-graphite">{run.audience_tag}</span>
                  )}
                  <span className="text-data-value text-graphite">
                    run {run.run_id.slice(0, 8)}
                  </span>
                </div>
              </div>

              {run.created_at && (
                <span className="text-data-value text-graphite shrink-0">
                  {formatRelativeTime(run.created_at)}
                </span>
              )}

              <ArrowRight className="w-4 h-4 text-graphite opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
