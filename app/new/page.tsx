import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Blog — Presswork CMS",
  description: "Create a new blog post with AI-assisted topic selection and outline generation.",
};

/**
 * New Blog Wizard — Phase 2 implementation.
 * Two steps: Topic → Plan, held in wizard-store (Zustand).
 */
export default function NewBlogPage() {
  return (
    <div className="p-6 max-w-[800px]">
      <h2 className="text-headline-lg text-on-surface">New Blog</h2>
      <p className="text-ui-base text-on-surface-variant mt-1">
        Start a new blog post with AI-assisted topic selection.
      </p>

      {/* Wizard placeholder — Phase 2 */}
      <div className="mt-8 bg-surface-container border border-border rounded-lg p-12 text-center">
        <p className="text-ui-base text-graphite">
          Wizard UI coming in Phase 2
        </p>
      </div>
    </div>
  );
}
