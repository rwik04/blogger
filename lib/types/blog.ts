/**
 * Presswork — Core domain types
 *
 * These types represent the frontend data contract. They should be reconciled
 * with the backend schema once it's finalized (see task.md §11).
 */

export type BlogStatus =
  | "drafting"
  | "needs_revision"
  | "in_review"
  | "ready"
  | "published";

export type SectionStatus =
  | "queued"
  | "drafting"
  | "needs_revision"
  | "approved";

export interface SEOCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface SEOResult {
  overallScore: number;
  readabilityGrade: number;
  checks: SEOCheck[];
}

export interface Section {
  id: string;
  blogId: string;
  order: number;
  title: string;
  content: string;
  status: SectionStatus;
  revisionCount: number;
  seoScore: SEOResult | null;
  updatedAt: string;
}

export interface Source {
  id: string;
  url: string;
  title: string;
  sectionId: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Blog {
  id: string;
  title: string;
  subjectTag: string;
  examPaper: "GS1" | "GS2" | "GS3" | "GS4" | null;
  status: BlogStatus;
  sections: Section[];
  sources: Source[];
  mcqs: MCQ[];
  version: number;
  seoScore: number | null;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export type AgentName =
  | "topic_ideator"
  | "narrative_finder"
  | "writer"
  | "seo_analyzer"
  | "fact_checker";

export interface AgentEvent {
  blogId: string;
  sectionId?: string;
  agent: AgentName;
  message: string;
  timestamp: string;
}

export interface TopicSuggestion {
  id: string;
  title: string;
  subjectTag: string;
  examPaper: "GS1" | "GS2" | "GS3" | "GS4" | null;
  status: "pending" | "approved" | "rejected";
  suggestedAt: string;
}
