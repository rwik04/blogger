"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditPreset, OutlineSection, SectionResult } from "@/lib/api/types";
import { editSection } from "@/lib/api/runs";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { renderMarkdownLite } from "@/lib/utils/markdown";

const PRESET_OPTIONS: { value: EditPreset; label: string }[] = [
  { value: "more_engaging", label: "More engaging" },
  { value: "more_formal", label: "More formal" },
  { value: "more_comprehensive", label: "More comprehensive" },
  { value: "custom", label: "Custom instruction…" },
];

interface SectionEditorPanelProps {
  runId: string;
  outline: OutlineSection[];
  sections: SectionResult[] | undefined;
  isWriting: boolean;
}

/**
 * Content tab: one row per outline section. Once the Writer has produced a
 * draft, each section is expandable with its rendered body + a regenerate
 * control that calls `POST /write/sections/{id}/edit` with a tone preset
 * or custom instruction — creates a new draft version, picked up by the
 * next `GET /write` poll.
 */
export function SectionEditorPanel({ runId, outline, sections, isWriting }: SectionEditorPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(outline[0]?.section_id ?? null);

  if (outline.length === 0) {
    return (
      <p className="text-ui-base text-graphite">
        No outline yet — run Strategize first to plan the sections.
      </p>
    );
  }

  const sectionsById = new Map((sections ?? []).map((s) => [s.section_id, s]));

  return (
    <div className="space-y-2">
      {isWriting && (
        <div className="flex items-center gap-2 text-ui-base text-proof-blue-light">
          <Loader2 className="w-4 h-4 animate-spin" /> Writer is drafting sections…
        </div>
      )}
      {outline
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map((outlineSection) => {
          const section = sectionsById.get(outlineSection.section_id);
          const isOpen = expanded === outlineSection.section_id;

          return (
            <div key={outlineSection.section_id} className="rounded-md border border-border overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-surface-container-low hover:bg-surface-container-high transition-colors"
                onClick={() => setExpanded(isOpen ? null : outlineSection.section_id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-ui-medium text-on-surface truncate">
                    {outlineSection.heading}
                  </span>
                  {!outlineSection.grounded && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-light shrink-0" aria-label="Ungrounded section" />
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {section && (
                    <span className="text-data-value text-graphite">{section.word_count}w</span>
                  )}
                  {!section && <span className="text-data-label text-graphite">not drafted</span>}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-graphite" /> : <ChevronDown className="w-4 h-4 text-graphite" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 py-4 space-y-4 bg-surface-container">
                  {section ? (
                    <>
                      <div className="text-body-content text-on-surface-variant space-y-2 max-h-[320px] overflow-y-auto pr-1">
                        {renderMarkdownLite(section.body_markdown)}
                      </div>
                      {section.unsupported_gaps.length > 0 && (
                        <p className="text-data-label text-amber-light">
                          Unresolved gaps: {section.unsupported_gaps.join("; ")}
                        </p>
                      )}
                      <RegenerateControl runId={runId} sectionId={outlineSection.section_id} />
                    </>
                  ) : (
                    <p className="text-ui-base text-graphite">
                      Not drafted yet — run Write to generate this section.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

function RegenerateControl({ runId, sectionId }: { runId: string; sectionId: string }) {
  const queryClient = useQueryClient();
  const [preset, setPreset] = useState<EditPreset>("more_engaging");
  const [instruction, setInstruction] = useState("");

  const mutation = useMutation({
    mutationFn: () => editSection(runId, sectionId, { preset, instruction: instruction || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["write", runId] });
    },
  });

  const needsInstruction = preset === "custom";
  const canSubmit = !needsInstruction || instruction.trim().length > 0;

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-border">
      <div className="flex items-center gap-2">
        <Select
          value={preset}
          onChange={(e) => setPreset(e.target.value as EditPreset)}
          className="max-w-[220px]"
        >
          {PRESET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Button
          size="sm"
          disabled={!canSubmit || mutation.isPending}
          onClick={() => mutation.mutate()}
          className={cn(mutation.isSuccess && "opacity-70")}
        >
          {mutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Regenerate
        </Button>
        {mutation.isPending && (
          <span className="text-data-label text-graphite">rewriting…</span>
        )}
      </div>

      {needsInstruction && (
        <Textarea
          placeholder="e.g. Add a concrete statistic in the second paragraph"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="min-h-[60px]"
        />
      )}

      {mutation.isError && (
        <p className="text-data-label text-redline-light">Failed to queue regeneration.</p>
      )}
    </div>
  );
}
