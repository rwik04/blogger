/**
 * TypeScript mirror of blogger-backend's real API contract
 * (`src/api/schemas.py` + each agent's `models.py`). This supersedes the
 * speculative types in `lib/types/blog.ts`, which were written against an
 * assumed contract (SSE, direct section CRUD) that the real backend never
 * implemented.
 */

// --- Runs --------------------------------------------------------------

export type RunStatus =
  | "pending"
  | "running"
  | "strategizing"
  | "writing"
  | "finishing"
  | "done"
  | "failed"
  | "needs_review";

export interface RunStatusResponse {
  run_id: string;
  topic: string;
  audience_tag: string | null;
  status: string;
  paused: boolean;
  created_at: string | null;
}

export interface RunControlResponse {
  run_id: string;
  paused: boolean;
}

export interface RunListResponse {
  items: RunStatusResponse[];
  limit: number;
  offset: number;
}

export interface QueuedResponse {
  run_id: string;
  status: "queued";
}

export interface EventOut {
  step: string;
  phase: "started" | "done" | "failed" | string;
  detail: Record<string, unknown> | null;
  created_at: string | null;
}

export interface EventsResponse {
  run_id: string;
  events: EventOut[];
}

export interface DraftSummary {
  version: number;
  created_by_agent: string;
  created_at: string | null;
}

export interface DraftsResponse {
  run_id: string;
  drafts: DraftSummary[];
}

// --- Researcher ----------------------------------------------------------

export type Confidence = "high" | "medium" | "low";

export interface Source {
  id: string;
  url: string;
  title: string;
  domain: string;
  retrieved_at: string;
}

export interface Claim {
  id: string;
  text: string;
  source_ids: string[];
  confidence: Confidence;
  contradicted: boolean;
}

export interface ResearchBrief {
  run_id: string;
  sub_queries: string[];
  sources: Source[];
  claims: Claim[];
  report_markdown: string;
}

// --- Strategist ----------------------------------------------------------

export interface SeoPlan {
  primary_keyword: string;
  secondary_keywords: string[];
  meta_title: string;
  meta_description: string;
  slug: string;
}

export interface OutlineSection {
  section_id: string;
  heading: string;
  target_keyword: string | null;
  grounded: boolean;
  order_index: number;
}

export interface StrategistOutput {
  run_id: string;
  seo_plan: SeoPlan;
  outline: OutlineSection[];
  narrative_angle: string;
}

// --- Writer ----------------------------------------------------------------

export type EditPreset = "more_engaging" | "more_formal" | "more_comprehensive" | "custom";

export interface SectionResult {
  section_id: string;
  heading: string;
  body_markdown: string;
  claim_ids: string[];
  unsupported_gaps: string[];
  tone_notes: string;
  word_count: number;
  retries_used: number;
}

export interface WriterOutput {
  run_id: string;
  draft_version: number;
  sections: SectionResult[];
  needs_more_research: string[];
}

// --- Finisher ----------------------------------------------------------

export interface MCQOption {
  label: string;
  text: string;
}

export interface MCQStatement {
  text: string;
  is_true: boolean;
  claim_id: string | null;
}

export type QuestionType = "statement_based" | "direct";

export interface UpscStyleQuestion {
  question_id: string;
  question_type: QuestionType;
  stem: string;
  statements: MCQStatement[];
  options: MCQOption[];
  correct_option: string;
  explanation: string;
  related_section_id: string;
}

export interface SeoAudit {
  keyword_density: Record<string, number>;
  heading_issues: string[];
  meta_description_ok: boolean;
  internal_link_suggestions: Array<{ from_section: string; to_section: string; anchor_text: string }>;
}

export interface MediaPrompt {
  media_id: string;
  kind: "banner" | "infographic";
  section_id: string | null;
  prompt: string;
  alt_text: string;
  image_url: string | null;
}

export interface FinisherOutput {
  run_id: string;
  seo_audit: SeoAudit;
  questions: UpscStyleQuestion[];
  media: MediaPrompt[];
  final_title: string;
  final_tags: string[];
  subject: string;
  quality_flags: string[];
}

// --- Published blog (GET /runs/{id}/blog) -------------------------------

export interface PublishedBlogSection {
  id: string;
  draft_id: string;
  section_id: string;
  heading: string;
  body_markdown: string;
  order_index: number;
  word_count: number | null;
  tone_notes: string | null;
  retries_used: number;
  unsupported_gaps: string[] | null;
  claim_ids: string[];
}

export interface PublishedBlogQuestion {
  id: string;
  run_id: string;
  question_type: QuestionType;
  stem: string;
  statements: MCQStatement[];
  options: MCQOption[];
  correct_option: string;
  explanation: string | null;
  related_section_id: string | null;
  created_at: string | null;
}

export interface PublishedBlogMedia {
  id: string;
  run_id: string;
  kind: "banner" | "infographic";
  section_id: string | null;
  prompt: string | null;
  alt_text: string | null;
  image_url: string | null;
  status: string;
  created_at: string | null;
}

export interface PublishedBlog {
  run_id: string;
  final_title: string | null;
  final_tags: string[] | null;
  subject: string | null;
  published_at: string | null;
  canonical_url: string | null;
  draft_version: number | null;
  sections: PublishedBlogSection[];
  questions: PublishedBlogQuestion[];
  media: PublishedBlogMedia[];
  seo_audit: SeoAudit | null;
}

// --- Stats -----------------------------------------------------------------

export interface StatsResponse {
  runs_by_status: Record<string, number>;
  resource_counts: Record<string, number>;
}

// --- Topics ----------------------------------------------------------------

export type TopicGeneratorMode = "autonomous" | "directed";
export type DedupStatus = "new" | "similar_to_existing" | "needs_review";
export type TopicStatus = "suggested" | "selected";

export interface TopicOut {
  topic_id: string;
  batch_id: string | null;
  title: string;
  one_line_summary: string | null;
  subject: string | null;
  gs_papers: string[] | null;
  why_this_topic: string | null;
  current_relevance: string | null;
  trigger_source_url: string | null;
  dedup_status: string;
  similarity_score: number | null;
  status: string;
  created_at: string | null;
}

export interface TopicListResponse {
  items: TopicOut[];
  limit: number;
  offset: number;
}

export interface QueuedBatchResponse {
  batch_id: string;
  status: "queued";
}

export interface TopicBatchStatusResponse {
  batch_id: string;
  mode: string;
  user_instruction: string | null;
  count: number;
  auto_approve: boolean;
  status: string;
  error: string | null;
  created_at: string | null;
}

export interface TopicBatchEventsResponse {
  batch_id: string;
  events: EventOut[];
}

export interface SelectTopicResponse {
  topic_id: string;
  run_id: string;
  status: "queued";
}
