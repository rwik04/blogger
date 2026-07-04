"use client";

import {
  BookOpen,
  PenTool,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/data/mock-data";

interface StatsRowProps {
  stats: DashboardStats;
}

interface StatCardConfig {
  label: string;
  key: keyof DashboardStats;
  icon: React.ElementType;
  suffix?: string;
  accentClass: string;
}

const STAT_CARDS: StatCardConfig[] = [
  {
    label: "Published this week",
    key: "publishedThisWeek",
    icon: BookOpen,
    accentClass: "text-moss-light",
  },
  {
    label: "In progress",
    key: "inProgress",
    icon: PenTool,
    accentClass: "text-proof-blue-light",
  },
  {
    label: "Avg SEO score",
    key: "avgSeoScore",
    icon: BarChart3,
    accentClass: "text-yellow-400",
  },
  {
    label: "Topics queued",
    key: "topicsQueued",
    icon: Lightbulb,
    accentClass: "text-on-surface-variant",
  },
];

/**
 * Dashboard stats row — 4 metric cards matching the Stitch designs.
 * Uses IBM Plex Mono for numeric values per the typography role split.
 */
export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {STAT_CARDS.map((card) => (
        <div
          key={card.key}
          id={`stat-${card.key}`}
          className="bg-surface-container border border-border rounded-lg p-5 flex flex-col gap-3 hover:bg-surface-container-high transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-data-label text-graphite">{card.label}</span>
            <card.icon className={cn("w-4 h-4", card.accentClass)} />
          </div>
          <span className={cn("text-3xl font-mono font-medium tracking-tight", card.accentClass)}>
            {stats[card.key]}
          </span>
        </div>
      ))}
    </div>
  );
}
