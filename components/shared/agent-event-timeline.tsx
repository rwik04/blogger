"use client";

import type { ReactNode } from "react";
import { CheckCircle2, XCircle, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventOut } from "@/lib/api/types";
import { formatRelativeTime } from "@/lib/utils/seo-format";

/**
 * Per-phase visual language shared by every dot/line/badge in the timeline —
 * kept together (rather than just text color, as `PHASE_STYLES` in
 * tag-colors.ts covers) since the timeline needs matching dot/ring/line
 * colors too, not just a text accent.
 */
const PHASE_THEME: Record<
  string,
  { dot: string; ring: string; line: string; text: string; chip: string; Icon: React.ElementType }
> = {
  started: {
    dot: "bg-proof-blue",
    ring: "ring-proof-blue/30",
    line: "bg-proof-blue/40",
    text: "text-proof-blue-light",
    chip: "bg-proof-blue/15 text-proof-blue-light border-proof-blue/30",
    Icon: Loader2,
  },
  done: {
    dot: "bg-moss",
    ring: "ring-moss/30",
    line: "bg-moss/40",
    text: "text-moss-light",
    chip: "bg-moss/15 text-moss-light border-moss/30",
    Icon: CheckCircle2,
  },
  failed: {
    dot: "bg-redline",
    ring: "ring-redline/30",
    line: "bg-redline/40",
    text: "text-redline-light",
    chip: "bg-redline/15 text-redline-light border-redline/30",
    Icon: XCircle,
  },
};

const DEFAULT_THEME = {
  dot: "bg-graphite",
  ring: "ring-graphite/30",
  line: "bg-border",
  text: "text-on-surface-variant",
  chip: "bg-surface-container-high text-on-surface-variant border-border",
  Icon: Info,
};

function themeFor(phase: string) {
  return PHASE_THEME[phase] ?? DEFAULT_THEME;
}

export function formatStepName(step: string): string {
  return step
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface EventDetail {
  summary?: string;
  error?: string;
  elapsed_ms?: number;
}

export function describeEvent(event: EventOut): string | null {
  const detail = event.detail as EventDetail | null;
  if (detail?.error) return detail.error;
  if (detail?.summary) return detail.summary;
  return null;
}

export interface TimelineEvent extends EventOut {
  key: string;
}

/** Scopes step-name matching to a single run when the caller's event type
 * carries one (e.g. the dashboard feed mixes events from many runs) — falls
 * back to matching by step name alone for single-run/single-batch feeds. */
function scopeKeyFor(event: TimelineEvent): string {
  const runId = (event as { run_id?: string }).run_id;
  return `${runId ?? ""}:${event.step}`;
}

/**
 * Each pipeline step fires a `started` event, then later a `done`/`failed`
 * event for that same step — folds the two into a single row in place
 * (same position, updated phase/detail) so a step's dot visually flips from
 * blue to green/red instead of leaving the "started" row sitting there
 * alongside a new "done" row underneath it.
 */
function mergeStartedWithTerminal<T extends TimelineEvent>(events: T[]): T[] {
  const merged: T[] = [];
  const pendingIndex = new Map<string, number>();

  for (const event of events) {
    const scopeKey = scopeKeyFor(event);

    if (event.phase === "started") {
      pendingIndex.set(scopeKey, merged.length);
      merged.push(event);
      continue;
    }

    if (event.phase === "done" || event.phase === "failed") {
      const idx = pendingIndex.get(scopeKey);
      if (idx !== undefined) {
        merged[idx] = { ...event, key: merged[idx].key };
        pendingIndex.delete(scopeKey);
        continue;
      }
    }

    merged.push(event);
  }

  return merged;
}

interface AgentEventTimelineProps<T extends TimelineEvent> {
  events: T[];
  /** Optional per-event leading content rendered above the description (e.g. run topic + link). */
  renderHeading?: (event: T) => ReactNode;
  /** Wraps each row — used by the dashboard feed to make rows clickable links. */
  renderRow?: (event: T, children: ReactNode) => ReactNode;
  className?: string;
  maxHeightClassName?: string;
}

/**
 * Vertical "growing" activity timeline: a continuous line runs through every
 * event's dot, so as new events stream in (via polling) the line visually
 * extends downward like a live graph, instead of a flat list of rows. Each
 * phase (started/done/failed) gets a distinct color, icon, and a small
 * status chip, and the node's `_event_summary` detail (queries being
 * researched, claims extracted, etc.) is surfaced as the description line.
 */
export function AgentEventTimeline<T extends TimelineEvent>({
  events,
  renderHeading,
  renderRow,
  className,
  maxHeightClassName = "max-h-[420px]",
}: AgentEventTimelineProps<T>) {
  const mergedEvents = mergeStartedWithTerminal(events);

  return (
    <div className={cn("overflow-y-auto", maxHeightClassName, className)}>
      <ol className="relative">
        {mergedEvents.map((event, idx) => {
          const theme = themeFor(event.phase);
          const Icon = theme.Icon;
          const isLast = idx === mergedEvents.length - 1;
          const description = describeEvent(event);
          const detail = event.detail as EventDetail | null;

          const row = (
            <div className="relative flex gap-3 pb-5 pl-1 pr-4 group">
              {/* Connecting line — extends from this dot to the next one */}
              {!isLast && (
                <span
                  className={cn("absolute left-[15px] top-6 bottom-0 w-px", theme.line)}
                  aria-hidden
                />
              )}

              {/* Phase dot */}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ring-4",
                  theme.dot,
                  theme.ring
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 text-surface",
                    event.phase === "started" && "animate-spin"
                  )}
                  strokeWidth={2.5}
                />
              </span>

              <div className="min-w-0 flex-1 pt-1">
                {renderHeading?.(event)}

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-data-label font-medium uppercase tracking-wide",
                      theme.chip
                    )}
                  >
                    {event.phase}
                  </span>
                  <span className={cn("text-ui-base font-medium", theme.text)}>
                    {formatStepName(event.step)}
                  </span>
                  {typeof detail?.elapsed_ms === "number" && (
                    <span className="text-data-value text-graphite">
                      {detail.elapsed_ms < 1000
                        ? `${detail.elapsed_ms}ms`
                        : `${(detail.elapsed_ms / 1000).toFixed(1)}s`}
                    </span>
                  )}
                  {event.created_at && (
                    <span className="text-data-value text-graphite ml-auto shrink-0">
                      {formatRelativeTime(event.created_at)}
                    </span>
                  )}
                </div>

                {description && (
                  <p className="mt-1 text-ui-base text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          );

          return (
            <li key={event.key} className="last:pb-0">
              {renderRow ? renderRow(event, row) : row}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
