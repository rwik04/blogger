"use client";

import type {
  PublishedBlog,
  PublishedBlogQuestion,
  SectionResult,
  StrategistOutput,
  RunStatusResponse,
} from "@/lib/api/types";
import { renderMarkdownLite } from "@/lib/utils/markdown";
import { BlogMediaBlock } from "@/components/editor/blog-media-block";
import { BlogQuizBlock } from "@/components/editor/blog-quiz-block";

interface LivePreviewProps {
  run: RunStatusResponse | undefined;
  blog: PublishedBlog | undefined;
  strategize: StrategistOutput | undefined;
  sections: SectionResult[] | undefined;
}

/**
 * Right-hand live render — mirrors the Payload CMS reference: title, banner,
 * meta, and the article body as the reader will eventually see it. Prefers
 * the fully-assembled `GET /runs/{id}/blog` once the Finisher has run;
 * falls back to the latest Writer draft while the pipeline is still going.
 *
 * Once the Finisher has run, quiz questions and infographics are interleaved
 * directly into the body at the position of the section they were drawn
 * from (`related_section_id`/`section_id`) rather than listed separately —
 * that pairing only exists post-Finisher, so it's a no-op on the
 * Writer-only fallback path.
 */
export function LivePreview({ run, blog, strategize, sections }: LivePreviewProps) {
  const title = blog?.final_title ?? strategize?.seo_plan.meta_title ?? run?.topic ?? "Untitled";
  const tags = blog?.final_tags ?? strategize?.seo_plan.secondary_keywords ?? [];
  const subject = blog?.subject;
  const previewSections =
    blog?.sections.map((s) => ({
      section_id: s.section_id,
      heading: s.heading,
      body_markdown: s.body_markdown,
      order_index: s.order_index,
    })) ??
    sections?.map((s) => ({ section_id: s.section_id, heading: s.heading, body_markdown: s.body_markdown, order_index: 0 })) ??
    [];
  const banner = blog?.media.find((m) => m.kind === "banner");
  const infographicsBySection = new Map(
    (blog?.media ?? []).filter((m) => m.kind === "infographic" && m.section_id).map((m) => [m.section_id as string, m])
  );
  const questionsBySection = new Map<string, PublishedBlogQuestion[]>();
  for (const q of blog?.questions ?? []) {
    if (!q.related_section_id) continue;
    const existing = questionsBySection.get(q.related_section_id) ?? [];
    existing.push(q);
    questionsBySection.set(q.related_section_id, existing);
  }

  return (
    <div className="h-full overflow-y-auto bg-surface-container-lowest">
      <div className="max-w-[720px] mx-auto py-10 px-8">
        {/* Banner */}
        <BlogMediaBlock
          variant="banner"
          imageUrl={banner?.image_url ?? null}
          prompt={banner?.prompt ?? null}
          altText={banner?.alt_text ?? null}
        />

        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          {subject && (
            <span className="text-data-label text-proof-blue-light uppercase">
              {subject.replace(/_/g, " ")}
            </span>
          )}
          {run?.created_at && (
            <span className="text-data-label text-graphite">
              {new Date(run.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-display-editor text-on-surface mb-6">{title}</h1>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-data-label text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        {previewSections.length === 0 ? (
          <p className="text-body-content text-graphite italic">
            Nothing to preview yet — run the pipeline stages on the left to see content appear here.
          </p>
        ) : (
          <div className="space-y-6">
            {previewSections
              .slice()
              .sort((a, b) => a.order_index - b.order_index)
              .map((section, i) => {
                const infographic = infographicsBySection.get(section.section_id);
                const questions = questionsBySection.get(section.section_id) ?? [];

                return (
                  <div key={section.section_id || i}>
                    <h2 className="text-headline-md text-on-surface mb-2">{section.heading}</h2>
                    <div className="text-body-content text-on-surface-variant space-y-3">
                      {renderMarkdownLite(section.body_markdown)}
                    </div>

                    {infographic && (
                      <BlogMediaBlock
                        variant="infographic"
                        imageUrl={infographic.image_url}
                        prompt={infographic.prompt}
                        altText={infographic.alt_text}
                      />
                    )}

                    {questions.map((q) => (
                      <BlogQuizBlock
                        key={q.id}
                        questionType={q.question_type}
                        stem={q.stem}
                        statements={q.statements}
                        options={q.options}
                        correctOption={q.correct_option}
                        explanation={q.explanation}
                      />
                    ))}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
