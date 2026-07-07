"use client";

import type { ResearchBrief, FinisherOutput } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";

interface DetailsTabProps {
  research: ResearchBrief | undefined;
  finish: FinisherOutput | undefined;
}

const CONFIDENCE_VARIANT: Record<string, "success" | "warning" | "destructive"> = {
  high: "success",
  medium: "warning",
  low: "destructive",
};

export function DetailsTab({ research, finish }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-data-label text-graphite">Sources</h4>
        {!research ? (
          <p className="text-ui-base text-graphite">Research hasn&apos;t completed yet.</p>
        ) : research.sources.length === 0 ? (
          <p className="text-ui-base text-graphite">No sources recorded.</p>
        ) : (
          <ul className="space-y-1.5">
            {research.sources.map((source) => (
              <li key={source.id} className="text-ui-base">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-proof-blue-light hover:underline"
                >
                  {source.title}
                </a>
                <span className="text-data-label text-graphite ml-2">{source.domain}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {research && research.claims.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-data-label text-graphite">Claims</h4>
          <ul className="space-y-2">
            {research.claims.map((claim) => (
              <li key={claim.id} className="flex items-start gap-2 text-ui-base text-on-surface-variant">
                <Badge variant={CONFIDENCE_VARIANT[claim.confidence]} className="mt-0.5 shrink-0">
                  {claim.confidence}
                </Badge>
                <span className={claim.contradicted ? "line-through text-graphite" : ""}>{claim.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3 pt-3 border-t border-border">
        <h4 className="text-data-label text-graphite">Quiz questions</h4>
        {!finish ? (
          <p className="text-ui-base text-graphite">Run Finish to generate the quiz.</p>
        ) : finish.questions.length === 0 ? (
          <p className="text-ui-base text-graphite">
            {finish.quality_flags.find((flag) => flag.startsWith("Quiz skipped"))
              ?? "No quiz generated for this run."}
          </p>
        ) : (
          <div className="space-y-4">
            {finish.questions.map((q) => (
              <div key={q.question_id} className="rounded-md border border-border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-ui-medium text-on-surface">{q.stem}</p>
                  <Badge variant="neutral" className="shrink-0">
                    {q.question_type === "direct" ? "Direct" : "Statement-based"}
                  </Badge>
                </div>
                {q.statements.length > 0 && (
                  <ol className="list-decimal pl-5 space-y-1">
                    {q.statements.map((s, i) => (
                      <li key={i} className="text-ui-base text-on-surface-variant">
                        {s.text}
                      </li>
                    ))}
                  </ol>
                )}
                <ul className="space-y-1">
                  {q.options.map((opt) => (
                    <li
                      key={opt.label}
                      className={
                        opt.label === q.correct_option
                          ? "text-ui-base text-moss-light"
                          : "text-ui-base text-on-surface-variant"
                      }
                    >
                      {opt.label}. {opt.text}
                    </li>
                  ))}
                </ul>
                <p className="text-data-label text-graphite">{q.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {finish && finish.quality_flags.filter((flag) => !flag.startsWith("Quiz skipped")).length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border">
          <h4 className="text-data-label text-graphite">Quality flags</h4>
          <ul className="space-y-1">
            {finish.quality_flags
              .filter((flag) => !flag.startsWith("Quiz skipped"))
              .map((flag, i) => (
                <li key={i} className="text-ui-base text-amber-600">
                  {flag}
                </li>
              ))}
          </ul>
        </div>
      )}

      {finish && finish.media.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-border">
          <h4 className="text-data-label text-graphite">Media</h4>
          <div className="space-y-3">
            {finish.media.map((media) => (
              <div key={media.media_id} className="flex items-start gap-3">
                {media.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={media.image_url}
                    alt={media.alt_text}
                    className="w-16 h-16 object-cover rounded-md border border-border shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md border border-border shrink-0 bg-surface-container flex items-center justify-center text-data-label text-graphite">
                    n/a
                  </div>
                )}
                <div className="text-ui-base text-on-surface-variant">
                  <Badge variant="neutral" className="mr-2">
                    {media.kind}
                  </Badge>
                  {media.prompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
