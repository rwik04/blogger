"use client";

import {
  PenTool,
  Search,
  ShieldCheck,
  Lightbulb,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentEvent, AgentName } from "@/lib/types/blog";
import { formatRelativeTime } from "@/lib/utils/seo-format";

interface AgentFeedProps {
  events: AgentEvent[];
}

/**
 * Agent icon and color configuration. Each agent gets a distinct visual
 * identity so editors can scan the feed quickly.
 */
const AGENT_CONFIG: Record<AgentName, { icon: React.ElementType; colorClass: string }> = {
  writer: { icon: PenTool, colorClass: "text-proof-blue-light" },
  seo_analyzer: { icon: Search, colorClass: "text-yellow-400" },
  fact_checker: { icon: ShieldCheck, colorClass: "text-moss-light" },
  topic_ideator: { icon: Lightbulb, colorClass: "text-on-surface-variant" },
  narrative_finder: { icon: Bot, colorClass: "text-purple-400" },
};

/**
 * Agent Activity feed — renders the last ~20 AgentEvents, newest first.
 * Hidden entirely if no events (per task.md §7.1).
 *
 * In Phase 4, this will be driven by the SSE stream via useAgentStream().
 */
export function AgentFeed({ events }: AgentFeedProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-container border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-headline-md text-on-surface">Agent activity</h3>
      </div>

      <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
        {events.map((event, idx) => {
          const config = AGENT_CONFIG[event.agent];
          const Icon = config.icon;

          return (
            <div
              key={`${event.timestamp}-${idx}`}
              className="flex items-start gap-3 px-5 py-3 hover:bg-surface-container-high transition-colors duration-150"
            >
              {/* Agent icon with pulse for active drafting */}
              <div
                className={cn(
                  "mt-0.5 shrink-0",
                  config.colorClass,
                  event.agent === "writer" && event.message.includes("Drafting")
                    ? "animate-proof-pulse"
                    : ""
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Message */}
              <p className="flex-1 text-ui-base text-on-surface-variant leading-relaxed">
                <span className={cn("font-medium", config.colorClass)}>
                  {formatAgentName(event.agent)}
                </span>{" "}
                {event.message.replace(/^[A-Z][a-z]+\s/, "")}
              </p>

              {/* Timestamp */}
              <span className="text-data-value text-graphite shrink-0">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatAgentName(agent: AgentName): string {
  const labels: Record<AgentName, string> = {
    writer: "Writer",
    seo_analyzer: "SEO Analyzer",
    fact_checker: "Fact Checker",
    topic_ideator: "Topic Ideator",
    narrative_finder: "Narrative Finder",
  };
  return labels[agent];
}
