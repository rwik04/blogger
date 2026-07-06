"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { SeoAudit, SeoPlan } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";

interface SeoTabProps {
  seoPlan: SeoPlan | undefined;
  seoAudit: SeoAudit | null | undefined;
}

export function SeoTab({ seoPlan, seoAudit }: SeoTabProps) {
  if (!seoPlan) {
    return <p className="text-ui-base text-graphite">Run Strategize to generate an SEO plan.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h4 className="text-data-label text-graphite">SEO plan</h4>
        <Field label="Primary keyword">
          <Badge variant="info">{seoPlan.primary_keyword}</Badge>
        </Field>
        <Field label="Secondary keywords">
          <div className="flex flex-wrap gap-1.5">
            {seoPlan.secondary_keywords.map((kw) => (
              <Badge key={kw} variant="neutral">
                {kw}
              </Badge>
            ))}
          </div>
        </Field>
        <Field label="Meta title">
          <p className="text-ui-base text-on-surface">{seoPlan.meta_title}</p>
        </Field>
        <Field label="Meta description">
          <p className="text-ui-base text-on-surface-variant">{seoPlan.meta_description}</p>
        </Field>
        <Field label="Slug">
          <p className="text-data-value text-graphite">/{seoPlan.slug}</p>
        </Field>
      </div>

      <div className="space-y-3 pt-3 border-t border-border">
        <h4 className="text-data-label text-graphite">SEO audit</h4>
        {!seoAudit ? (
          <p className="text-ui-base text-graphite">Run Finish to generate the SEO audit.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {seoAudit.meta_description_ok ? (
                <CheckCircle2 className="w-4 h-4 text-moss-light" />
              ) : (
                <XCircle className="w-4 h-4 text-redline-light" />
              )}
              <span className="text-ui-base text-on-surface-variant">
                Meta description {seoAudit.meta_description_ok ? "passes" : "needs work"}
              </span>
            </div>

            {Object.keys(seoAudit.keyword_density).length > 0 && (
              <Field label="Keyword density">
                <div className="space-y-1">
                  {Object.entries(seoAudit.keyword_density).map(([kw, density]) => (
                    <div key={kw} className="flex items-center justify-between text-data-value">
                      <span className="text-on-surface-variant">{kw}</span>
                      <span className="text-graphite">{(density * 100).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </Field>
            )}

            {seoAudit.heading_issues.length > 0 && (
              <Field label="Heading issues">
                <ul className="list-disc pl-4 text-ui-base text-amber-light space-y-1">
                  {seoAudit.heading_issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </Field>
            )}

            {seoAudit.internal_link_suggestions.length > 0 && (
              <Field label="Internal link suggestions">
                <ul className="text-data-value text-graphite space-y-1">
                  {seoAudit.internal_link_suggestions.map((link, i) => (
                    <li key={i}>
                      {link.from_section} → {link.to_section} (&ldquo;{link.anchor_text}&rdquo;)
                    </li>
                  ))}
                </ul>
              </Field>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="text-data-label text-graphite">{label}</span>
      {children}
    </div>
  );
}
