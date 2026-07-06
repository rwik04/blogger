"use client";

import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { RunStatusResponse } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelativeTime } from "@/lib/utils/seo-format";

interface RunTableProps {
  runs: RunStatusResponse[];
  isLoading: boolean;
}

export function RunTable({ runs, isLoading }: RunTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg bg-surface-container border border-border p-8 text-center text-ui-base text-graphite">
        Loading runs…
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="rounded-lg bg-surface-container border border-border p-12 text-center">
        <FileText className="w-8 h-8 text-graphite mx-auto mb-3" />
        <p className="text-ui-base text-on-surface-variant">No runs match this filter.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-surface-container border border-border overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="px-5 py-3 text-data-label text-graphite">Topic</th>
            <th className="px-5 py-3 text-data-label text-graphite">Status</th>
            <th className="px-5 py-3 text-data-label text-graphite">Audience</th>
            <th className="px-5 py-3 text-data-label text-graphite">Created</th>
            <th className="px-5 py-3 text-data-label text-graphite text-right">Run ID</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {runs.map((run) => (
            <tr key={run.run_id} className="hover:bg-surface-container-high transition-colors duration-150">
              <td className="px-5 py-3 text-ui-medium text-on-surface max-w-[420px] truncate">
                {run.topic}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={run.status} />
                  {run.paused && run.status !== "failed" && <StatusBadge status="paused" />}
                </div>
              </td>
              <td className="px-5 py-3 text-ui-base text-on-surface-variant">
                {run.audience_tag ?? "—"}
              </td>
              <td className="px-5 py-3 text-data-value text-graphite">
                {run.created_at ? formatRelativeTime(run.created_at) : "—"}
              </td>
              <td className="px-5 py-3 text-data-value text-graphite text-right">
                {run.run_id.slice(0, 8)}
              </td>
              <td className="px-5 py-3 text-right">
                <Link
                  href={`/blogs/${run.run_id}`}
                  className="inline-flex items-center gap-1 text-data-label text-proof-blue-light hover:text-proof-blue transition-colors"
                >
                  Open <ArrowUpRight className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
