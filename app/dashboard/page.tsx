import type { Metadata } from "next";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ContinueDraftingList } from "@/components/dashboard/continue-drafting-list";
import { AgentFeed } from "@/components/dashboard/agent-feed";
import { TopicQueue } from "@/components/dashboard/topic-queue";
import { Trendmap } from "@/components/dashboard/trendmap";
import {
  MOCK_STATS,
  MOCK_DRAFTS,
  MOCK_AGENT_EVENTS,
  MOCK_TOPICS,
  MOCK_TRENDING,
} from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "Dashboard — Presswork CMS",
  description: "Overview of your editorial pipeline: drafts in progress, agent activity, and trending topics.",
};

/**
 * Dashboard page — Priority 1
 *
 * Layout matches the "Blogger Dashboard - Extended Feed" screen from Stitch:
 * - Stats row (4 metric cards)
 * - Two-column grid: Trendmap + Continue Drafting (left), Agent Activity + Topic Queue (right)
 */
export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Page header */}
      <div>
        <h2 className="text-headline-lg text-on-surface">Dashboard</h2>
        <p className="text-ui-base text-on-surface-variant mt-1">
          Your editorial pipeline at a glance.
        </p>
      </div>

      {/* Stats row */}
      <StatsRow stats={MOCK_STATS} />

      {/* Main content grid — two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column — wider */}
        <div className="lg:col-span-3 space-y-6">
          <Trendmap topics={MOCK_TRENDING} />
          <ContinueDraftingList blogs={MOCK_DRAFTS} />
        </div>

        {/* Right column — narrower */}
        <div className="lg:col-span-2 space-y-6">
          <AgentFeed events={MOCK_AGENT_EVENTS} />
          <TopicQueue topics={MOCK_TOPICS} />
        </div>
      </div>
    </div>
  );
}
