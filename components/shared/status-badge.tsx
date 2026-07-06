"use client";

import { formatStatus } from "@/lib/utils/seo-format";
import { STATUS_BADGE_VARIANT, DEFAULT_STATUS_VARIANT } from "@/lib/constants/tag-colors";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  /** Any run/section/topic status string — backend vocabulary, not a closed enum. */
  status: string;
  className?: string;
}

/**
 * Status badge using the Copy Desk proof-mark color language.
 * Each status maps to a semantic Badge variant: blue=active, red=revision,
 * amber=in review, green=approved/published.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = STATUS_BADGE_VARIANT[status] ?? DEFAULT_STATUS_VARIANT;

  return (
    <Badge variant={variant} className={cn("text-label-xs", className)}>
      {formatStatus(status)}
    </Badge>
  );
}
