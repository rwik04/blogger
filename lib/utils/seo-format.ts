/**
 * SEO formatting helpers for score display.
 */

/**
 * Returns the Tailwind color class for a given SEO score.
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-moss-light";
  if (score >= 60) return "text-yellow-400";
  return "text-redline-light";
}

/**
 * Returns the background color class for score pills.
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-moss/20";
  if (score >= 60) return "bg-yellow-400/20";
  return "bg-redline/20";
}

/**
 * Returns a human-readable label for a blog status.
 */
export function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    drafting: "Drafting",
    needs_revision: "Needs Revision",
    in_review: "In Review",
    ready: "Ready",
    published: "Published",
    queued: "Queued",
    approved: "Approved",
  };
  return labels[status] ?? status;
}

/**
 * Format a relative time string (e.g., "2 min ago").
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * Formats a word count with comma separators.
 */
export function formatWordCount(count: number): string {
  return count.toLocaleString("en-IN");
}
