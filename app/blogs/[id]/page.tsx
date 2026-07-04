import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor — Presswork CMS",
  description: "Edit blog sections with AI assistance and live SEO feedback.",
};

/**
 * Blog Editor page — Phase 3 implementation.
 * Three-column layout: galley rail + Tiptap editor + inspector panel.
 */
export default function EditorPage() {
  return (
    <div className="p-6">
      <h2 className="text-headline-lg text-on-surface">Editor</h2>
      <p className="text-ui-base text-on-surface-variant mt-1">
        Blog editor with section-level editing and AI assistance.
      </p>

      {/* Editor placeholder — Phase 3 */}
      <div className="mt-8 bg-surface-container border border-border rounded-lg p-12 text-center">
        <p className="text-ui-base text-graphite">
          Editor UI coming in Phase 3
        </p>
      </div>
    </div>
  );
}
