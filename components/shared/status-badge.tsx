"use client";

import { type BlogStatus, type SectionStatus } from "@/lib/types/blog";
import { formatStatus } from "@/lib/utils/seo-format";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: BlogStatus | SectionStatus;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  drafting: "bg-proof-blue/20 text-proof-blue-light border-proof-blue/30",
  needs_revision: "bg-redline/20 text-redline-light border-redline/30",
  in_review: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  ready: "bg-moss/20 text-moss-light border-moss/30",
  published: "bg-moss/30 text-moss-light border-moss/40",
  queued: "bg-graphite/20 text-on-surface-variant border-graphite/30",
  approved: "bg-moss/20 text-moss-light border-moss/30",
};

/**
 * Status badge using the Copy Desk proof-mark color language.
 * Each status maps to a semantic color: blue=active, red=revision, green=approved.
 */
export class StatusBadgeRenderer {
  static getStyles(status: string): string {
    return STATUS_STYLES[status] ?? STATUS_STYLES.queued;
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full border text-label-xs",
        StatusBadgeRenderer.getStyles(status),
        className
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
