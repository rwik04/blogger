import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Library — Presswork CMS",
  description: "Browse, filter, and manage all your blog posts.",
};

/**
 * Content Library page — Phase 2 implementation.
 * DataTable with filters, row actions, bulk operations.
 */
export default function BlogsPage() {
  return (
    <div className="p-6">
      <h2 className="text-headline-lg text-on-surface">Content Library</h2>
      <p className="text-ui-base text-on-surface-variant mt-1">
        Browse and manage all your blog posts.
      </p>

      {/* Content Library placeholder — Phase 2 */}
      <div className="mt-8 bg-surface-container border border-border rounded-lg p-12 text-center">
        <p className="text-ui-base text-graphite">
          Content Library UI coming in Phase 2
        </p>
      </div>
    </div>
  );
}
