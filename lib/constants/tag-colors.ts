import type { badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

/**
 * Single source of truth for every color-coded dimension in the dashboard:
 * blog/section status, subject tag, and agent identity. Centralizing these
 * here keeps every widget consuming the same brand-token palette instead of
 * scattering raw Tailwind color classes across components.
 */

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

/**
 * Run/section status -> Badge variant. Covers both the real backend's
 * `blog_runs.status` vocabulary (pending/running/strategizing/writing/
 * finishing/done/failed/needs_review) and the leftover UI-only statuses
 * (queued/approved) used for topic candidates and drafts.
 */
export const STATUS_BADGE_VARIANT: Record<string, BadgeVariant> = {
  pending: "neutral",
  running: "info",
  strategizing: "info",
  writing: "info",
  finishing: "info",
  done: "success",
  failed: "destructive",
  needs_review: "warning",
  paused: "warning",
  // legacy / topic-candidate statuses
  drafting: "info",
  needs_revision: "destructive",
  in_review: "warning",
  ready: "success",
  published: "success",
  queued: "neutral",
  approved: "success",
  suggested: "neutral",
  selected: "info",
  new: "success",
  similar_to_existing: "warning",
};

export const DEFAULT_STATUS_VARIANT: BadgeVariant = "neutral";

interface SubjectStyle {
  bg: string;
  text: string;
}

/**
 * Subject tag -> tile/accent colors, used by the topic treemap and anywhere
 * else a subject needs a distinct visual identity.
 *
 * Keys match `UpscSubject` values from blogger-backend (snake_case), which
 * is what `getSubjectStyle` normalizes any incoming label down to — so this
 * works whether callers pass `"polity_governance"` or `"Polity Governance"`.
 */
export const SUBJECT_STYLES: Record<string, SubjectStyle> = {
  polity_governance: { bg: "bg-proof-blue", text: "text-proof-blue-light" },
  economy: { bg: "bg-amber", text: "text-amber-light" },
  environment_ecology: { bg: "bg-moss", text: "text-moss-light" },
  science_technology: { bg: "bg-violet", text: "text-violet-light" },
  geography: { bg: "bg-teal", text: "text-teal-light" },
  history_culture: { bg: "bg-tangerine", text: "text-tangerine-light" },
  international_relations: { bg: "bg-indigo", text: "text-indigo-light" },
  social_justice: { bg: "bg-rose", text: "text-rose-light" },
  ethics: { bg: "bg-sky", text: "text-sky-light" },
  security_disaster_management: { bg: "bg-redline", text: "text-redline-light" },
  miscellaneous_current_affairs: { bg: "bg-graphite", text: "text-graphite" },
};

export const DEFAULT_SUBJECT_STYLE: SubjectStyle = {
  bg: "bg-graphite",
  text: "text-graphite",
};

function normalizeSubjectKey(subjectTag: string): string {
  return subjectTag.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function getSubjectStyle(subjectTag: string): SubjectStyle {
  return SUBJECT_STYLES[normalizeSubjectKey(subjectTag)] ?? DEFAULT_SUBJECT_STYLE;
}

/**
 * Event phase (`started`/`done`/`failed`, from `agent_events.phase`) ->
 * accent color, used in the agent activity feed's proof-mark dot.
 */
export const PHASE_STYLES: Record<string, string> = {
  started: "text-proof-blue-light",
  done: "text-moss-light",
  failed: "text-redline-light",
};

/**
 * Dashboard stat card key -> accent color.
 */
export const STAT_ACCENTS = {
  publishedThisWeek: "text-moss-light",
  inProgress: "text-proof-blue-light",
  avgSeoScore: "text-amber-light",
  topicsQueued: "text-on-surface-variant",
} as const;
