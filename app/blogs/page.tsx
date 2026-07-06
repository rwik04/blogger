"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { RunTable } from "@/components/library/run-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { listRuns } from "@/lib/api/runs";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "running", label: "Researching" },
  { value: "strategizing", label: "Strategizing" },
  { value: "writing", label: "Writing" },
  { value: "finishing", label: "Finishing" },
  { value: "done", label: "Done" },
  { value: "failed", label: "Failed" },
  { value: "needs_review", label: "Needs review" },
];

/**
 * Content library — a run table sourced from `GET /runs`, since
 * blogger-backend has no direct blog CRUD; every "blog" is a pipeline run.
 */
export default function BlogsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const runsQuery = useQuery({
    queryKey: ["runs", "library", status],
    queryFn: () => listRuns({ status: status || undefined, limit: 100 }),
    refetchInterval: 8000,
  });

  const filtered = (runsQuery.data?.items ?? []).filter((run) =>
    run.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-lg text-on-surface">Content Library</h2>
          <p className="text-ui-base text-on-surface-variant mt-1">
            Every pipeline run, from first research pass to published blog.
          </p>
        </div>
        <Button render={<Link href="/new" />} nativeButton={false}>
          <Plus className="w-4 h-4" />
          New Blog
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-graphite" />
          <Input
            placeholder="Search by topic…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[220px]">
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <RunTable runs={filtered} isLoading={runsQuery.isLoading} />
    </div>
  );
}
