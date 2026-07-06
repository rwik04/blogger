"use client";

import { BookOpen, PenTool, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { StatsResponse } from "@/lib/api/types";

interface StatsRowProps {
  stats: StatsResponse | undefined;
  topicsQueued: number;
  isLoading: boolean;
}

const ACTIVE_STATUSES = ["running", "strategizing", "writing", "finishing", "pending"];

/**
 * Dashboard stats row — 4 metric cards sourced from `GET /stats`
 * (`runs_by_status` + `resource_counts`) plus a live count of suggested
 * topics awaiting review.
 */
export function StatsRow({ stats, topicsQueued, isLoading }: StatsRowProps) {
  const runsByStatus = stats?.runs_by_status ?? {};
  const done = runsByStatus.done ?? 0;
  const inProgress = ACTIVE_STATUSES.reduce((sum, key) => sum + (runsByStatus[key] ?? 0), 0);
  const failed = runsByStatus.failed ?? 0;

  const cards = [
    { label: "Runs completed", value: done, icon: BookOpen, accent: "text-moss-light" },
    { label: "Runs in progress", value: inProgress, icon: PenTool, accent: "text-proof-blue-light" },
    { label: "Runs failed", value: failed, icon: AlertTriangle, accent: "text-redline-light" },
    { label: "Topics queued", value: topicsQueued, icon: Lightbulb, accent: "text-on-surface-variant" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="rounded-lg bg-surface-container ring-0 border border-border p-5 flex-col gap-3 hover:bg-surface-container-high transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-data-label text-graphite">{card.label}</span>
            <card.icon className={cn("w-4 h-4", card.accent)} />
          </div>
          <span className={cn("text-3xl font-mono font-medium tracking-tight", card.accent)}>
            {isLoading ? "—" : card.value}
          </span>
        </Card>
      ))}
    </div>
  );
}
