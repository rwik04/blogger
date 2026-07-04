/**
 * Presswork — Mock data for Phase 1 (static dashboard)
 *
 * Realistic UPSC content to match the Stitch designs. Will be replaced
 * by TanStack Query hooks in Phase 4.
 */

import type {
  Blog,
  AgentEvent,
  TopicSuggestion,
} from "@/lib/types/blog";

// ─── Dashboard Stats ───

export interface DashboardStats {
  publishedThisWeek: number;
  inProgress: number;
  avgSeoScore: number;
  topicsQueued: number;
}

export const MOCK_STATS: DashboardStats = {
  publishedThisWeek: 3,
  inProgress: 5,
  avgSeoScore: 78,
  topicsQueued: 7,
};

// ─── Continue Drafting ───

export const MOCK_DRAFTS: Blog[] = [
  {
    id: "blog-1",
    title: "Federalism in Indian polity",
    subjectTag: "Polity",
    examPaper: "GS2",
    status: "drafting",
    sections: [
      {
        id: "s1-1",
        blogId: "blog-1",
        order: 1,
        title: "Introduction",
        content: "",
        status: "needs_revision",
        revisionCount: 2,
        seoScore: null,
        updatedAt: "2026-07-04T14:20:00Z",
      },
      {
        id: "s1-2",
        blogId: "blog-1",
        order: 2,
        title: "Constitutional framework",
        content: "",
        status: "approved",
        revisionCount: 1,
        seoScore: { overallScore: 85, readabilityGrade: 8, checks: [] },
        updatedAt: "2026-07-04T13:50:00Z",
      },
      {
        id: "s1-3",
        blogId: "blog-1",
        order: 3,
        title: "Centre-State relations",
        content: "",
        status: "drafting",
        revisionCount: 0,
        seoScore: null,
        updatedAt: "2026-07-04T15:10:00Z",
      },
    ],
    sources: [],
    mcqs: [],
    version: 2,
    seoScore: 72,
    wordCount: 2340,
    createdAt: "2026-07-03T10:00:00Z",
    updatedAt: "2026-07-04T15:10:00Z",
  },
  {
    id: "blog-2",
    title: "Monsoon forecasting and IMD models",
    subjectTag: "Geography",
    examPaper: "GS1",
    status: "drafting",
    sections: [
      {
        id: "s2-1",
        blogId: "blog-2",
        order: 1,
        title: "Introduction",
        content: "",
        status: "approved",
        revisionCount: 1,
        seoScore: { overallScore: 90, readabilityGrade: 7, checks: [] },
        updatedAt: "2026-07-04T12:00:00Z",
      },
      {
        id: "s2-2",
        blogId: "blog-2",
        order: 2,
        title: "Dynamical vs statistical models",
        content: "",
        status: "approved",
        revisionCount: 1,
        seoScore: { overallScore: 88, readabilityGrade: 8, checks: [] },
        updatedAt: "2026-07-04T12:30:00Z",
      },
      {
        id: "s2-3",
        blogId: "blog-2",
        order: 3,
        title: "IMD performance history",
        content: "",
        status: "drafting",
        revisionCount: 0,
        seoScore: null,
        updatedAt: "2026-07-04T14:45:00Z",
      },
    ],
    sources: [],
    mcqs: [],
    version: 1,
    seoScore: 82,
    wordCount: 1850,
    createdAt: "2026-07-02T08:00:00Z",
    updatedAt: "2026-07-04T14:45:00Z",
  },
  {
    id: "blog-3",
    title: "Fiscal federalism and the GST council",
    subjectTag: "Economy",
    examPaper: "GS3",
    status: "needs_revision",
    sections: [
      {
        id: "s3-1",
        blogId: "blog-3",
        order: 1,
        title: "GST architecture",
        content: "",
        status: "approved",
        revisionCount: 1,
        seoScore: { overallScore: 91, readabilityGrade: 9, checks: [] },
        updatedAt: "2026-07-04T10:00:00Z",
      },
      {
        id: "s3-2",
        blogId: "blog-3",
        order: 2,
        title: "Revenue distribution",
        content: "",
        status: "needs_revision",
        revisionCount: 2,
        seoScore: { overallScore: 65, readabilityGrade: 10, checks: [] },
        updatedAt: "2026-07-04T11:20:00Z",
      },
    ],
    sources: [],
    mcqs: [],
    version: 3,
    seoScore: 91,
    wordCount: 3100,
    createdAt: "2026-07-01T09:00:00Z",
    updatedAt: "2026-07-04T11:20:00Z",
  },
];

// ─── Agent Events ───

export const MOCK_AGENT_EVENTS: AgentEvent[] = [
  {
    blogId: "blog-2",
    sectionId: "s2-3",
    agent: "writer",
    message: "Drafting section 3 of Monsoon forecasting",
    timestamp: "2026-07-04T15:12:00Z",
  },
  {
    blogId: "blog-3",
    agent: "seo_analyzer",
    message: "Scored Fiscal federalism at 91",
    timestamp: "2026-07-04T15:08:00Z",
  },
  {
    blogId: "blog-1",
    sectionId: "s1-1",
    agent: "writer",
    message: "Revision loop 2 of 3 on Federalism intro",
    timestamp: "2026-07-04T15:05:00Z",
  },
  {
    blogId: "blog-1",
    agent: "fact_checker",
    message: "Verified 4 constitutional references in Federalism",
    timestamp: "2026-07-04T14:58:00Z",
  },
  {
    blogId: "blog-2",
    agent: "narrative_finder",
    message: "Suggested angle: contrast ECMWF vs IMD accuracy",
    timestamp: "2026-07-04T14:45:00Z",
  },
  {
    blogId: "blog-3",
    sectionId: "s3-2",
    agent: "seo_analyzer",
    message: "Keyword density low in Revenue distribution section",
    timestamp: "2026-07-04T14:30:00Z",
  },
];

// ─── Topic Suggestions ───

export const MOCK_TOPICS: TopicSuggestion[] = [
  {
    id: "topic-1",
    title: "Ethics in civil services reform",
    subjectTag: "Ethics",
    examPaper: "GS4",
    status: "pending",
    suggestedAt: "2026-07-04T12:00:00Z",
  },
  {
    id: "topic-2",
    title: "India's semiconductor mission",
    subjectTag: "Economy",
    examPaper: "GS3",
    status: "pending",
    suggestedAt: "2026-07-04T11:30:00Z",
  },
  {
    id: "topic-3",
    title: "Judicial pendency and tribunal reform",
    subjectTag: "Polity",
    examPaper: "GS2",
    status: "pending",
    suggestedAt: "2026-07-04T11:00:00Z",
  },
  {
    id: "topic-4",
    title: "Uniform Civil Code debate",
    subjectTag: "Polity",
    examPaper: "GS2",
    status: "pending",
    suggestedAt: "2026-07-04T10:00:00Z",
  },
  {
    id: "topic-5",
    title: "Green hydrogen mission progress",
    subjectTag: "Environment",
    examPaper: "GS3",
    status: "pending",
    suggestedAt: "2026-07-04T09:30:00Z",
  },
];

// ─── Trending Topics (Trendmap) ───

export interface TrendingTopic {
  id: string;
  title: string;
  subjectTag: string;
  trendScore: number; // 0-100
}

export const MOCK_TRENDING: TrendingTopic[] = [
  { id: "t1", title: "Uniform Civil Code debate", subjectTag: "Polity", trendScore: 95 },
  { id: "t2", title: "Green hydrogen mission", subjectTag: "Environment", trendScore: 88 },
  { id: "t3", title: "RBI monetary policy stance", subjectTag: "Economy", trendScore: 84 },
  { id: "t4", title: "India-EU trade pact talks", subjectTag: "International Relations", trendScore: 79 },
  { id: "t5", title: "Char Dham glacier retreat", subjectTag: "Geography", trendScore: 75 },
  { id: "t6", title: "Quantum mission funding", subjectTag: "Science & Tech", trendScore: 71 },
  { id: "t7", title: "Gig worker welfare code", subjectTag: "Economy", trendScore: 68 },
  { id: "t8", title: "Indus Waters Treaty review", subjectTag: "International Relations", trendScore: 64 },
  { id: "t9", title: "Classical language status", subjectTag: "Polity", trendScore: 58 },
  { id: "t10", title: "Coastal regulation zone", subjectTag: "Environment", trendScore: 52 },
];

// ─── Content Library (extended mock) ───

export const MOCK_ALL_BLOGS: Blog[] = [
  ...MOCK_DRAFTS,
  {
    id: "blog-4",
    title: "Constitutional amendments and judicial review",
    subjectTag: "Polity",
    examPaper: "GS2",
    status: "published",
    sections: [],
    sources: [],
    mcqs: [],
    version: 5,
    seoScore: 94,
    wordCount: 4200,
    createdAt: "2026-06-28T09:00:00Z",
    updatedAt: "2026-07-01T16:00:00Z",
  },
  {
    id: "blog-5",
    title: "Climate finance and Paris Agreement commitments",
    subjectTag: "Environment",
    examPaper: "GS3",
    status: "published",
    sections: [],
    sources: [],
    mcqs: [],
    version: 3,
    seoScore: 88,
    wordCount: 3500,
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-30T14:00:00Z",
  },
  {
    id: "blog-6",
    title: "India's nuclear doctrine evolution",
    subjectTag: "International Relations",
    examPaper: "GS2",
    status: "published",
    sections: [],
    sources: [],
    mcqs: [],
    version: 4,
    seoScore: 86,
    wordCount: 2900,
    createdAt: "2026-06-22T11:00:00Z",
    updatedAt: "2026-06-28T12:00:00Z",
  },
  {
    id: "blog-7",
    title: "Digital public infrastructure and India Stack",
    subjectTag: "Science & Tech",
    examPaper: "GS3",
    status: "ready",
    sections: [],
    sources: [],
    mcqs: [],
    version: 2,
    seoScore: 79,
    wordCount: 2650,
    createdAt: "2026-07-02T13:00:00Z",
    updatedAt: "2026-07-04T09:00:00Z",
  },
  {
    id: "blog-8",
    title: "Niti Aayog's role in cooperative federalism",
    subjectTag: "Polity",
    examPaper: "GS2",
    status: "in_review",
    sections: [],
    sources: [],
    mcqs: [],
    version: 2,
    seoScore: 75,
    wordCount: 2100,
    createdAt: "2026-07-03T07:00:00Z",
    updatedAt: "2026-07-04T08:00:00Z",
  },
];
