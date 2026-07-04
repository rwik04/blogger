"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Blog } from "@/lib/types/blog";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScoreInline } from "@/components/shared/score-pill";
import { formatRelativeTime, formatWordCount } from "@/lib/utils/seo-format";

interface ContinueDraftingListProps {
  blogs: Blog[];
}

/**
 * Continue Drafting section — displays blogs with status `drafting` or `needs_revision`.
 * Each row shows title, subject tag, status badge, SEO score, and links to the editor.
 *
 * Empty state: "No blogs in progress. Start one." with CTA (per task.md §7.1).
 */
export function ContinueDraftingList({ blogs }: ContinueDraftingListProps) {
  if (blogs.length === 0) {
    return (
      <div className="bg-surface-container border border-border rounded-lg p-8 text-center">
        <FileText className="w-8 h-8 text-graphite mx-auto mb-3" />
        <p className="text-ui-base text-on-surface-variant mb-4">
          No blogs in progress. Start one.
        </p>
        <Link
          href="/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-proof-blue text-white rounded-md text-ui-medium hover:bg-proof-blue/90 transition-colors"
        >
          New Blog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-headline-md text-on-surface">Continue drafting</h3>
        <Link
          href="/blogs"
          className="text-data-label text-proof-blue-light hover:text-proof-blue transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="divide-y divide-border">
        {blogs.map((blog) => {
          const approvedSections = blog.sections.filter((s) => s.status === "approved").length;
          const totalSections = blog.sections.length;
          const progressPercent = totalSections > 0 ? (approvedSections / totalSections) * 100 : 0;

          return (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              id={`draft-${blog.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-high transition-colors duration-150 group"
            >
              {/* Progress bar mini */}
              <div className="w-1 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0">
                <div
                  className={cn(
                    "w-full rounded-full transition-all",
                    progressPercent === 100 ? "bg-moss" : "bg-proof-blue"
                  )}
                  style={{ height: `${progressPercent}%` }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-ui-medium text-on-surface truncate">
                    {blog.title}
                  </span>
                  <StatusBadge status={blog.status} />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-data-label text-graphite">
                    {blog.subjectTag}
                    {blog.examPaper && `, ${blog.examPaper}`}
                  </span>
                  <span className="text-data-value text-graphite">
                    {formatWordCount(blog.wordCount)} words
                  </span>
                  <span className="text-data-value text-graphite">
                    {approvedSections}/{totalSections} sections
                  </span>
                </div>
              </div>

              {/* SEO Score */}
              {blog.seoScore !== null && (
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-data-label text-graphite">SEO</span>
                  <ScoreInline score={blog.seoScore} />
                </div>
              )}

              {/* Timestamp */}
              <span className="text-data-value text-graphite shrink-0">
                {formatRelativeTime(blog.updatedAt)}
              </span>

              <ArrowRight className="w-4 h-4 text-graphite opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
