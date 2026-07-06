"use client";

import { useEffect, useState, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Target, Loader2, CornerDownLeft, Minus, Plus, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateTopics } from "@/lib/api/topics";
import { startRun } from "@/lib/api/runs";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { TopicGeneratorMode } from "@/lib/api/types";

export type ComposerMode = "generate" | "direct";

export interface ComposerPreset {
  mode: ComposerMode;
  text: string;
}

interface TopicComposerProps {
  onBatchStarted: (batchId: string) => void;
  preset?: ComposerPreset | null;
}

/**
 * Single unified entry point for starting a blog: one query box that either
 * kicks off a Topic Generator batch (steered by whatever's typed, or fully
 * autonomous if left blank) or starts the Researcher directly on a topic —
 * no separate tabbed forms, no dropdown for picking a sub-mode.
 */
export function TopicComposer({ onBatchStarted, preset }: TopicComposerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<ComposerMode>("generate");
  const [text, setText] = useState("");
  const [count, setCount] = useState(8);
  const [audienceTag, setAudienceTag] = useState("UPSC");

  useEffect(() => {
    if (preset) {
      setMode(preset.mode);
      setText(preset.text);
    }
  }, [preset]);

  const generateMutation = useMutation({
    mutationFn: () =>
      generateTopics({
        mode: (text.trim() ? "directed" : "autonomous") as TopicGeneratorMode,
        user_instruction: text.trim() || undefined,
        count,
      }),
    onSuccess: (data) => onBatchStarted(data.batch_id),
  });

  const directMutation = useMutation({
    mutationFn: () => startRun({ topic: text.trim(), audience_tag: audienceTag.trim() || undefined }),
    onSuccess: (data) => router.push(`/blogs/${data.run_id}`),
  });

  const mutation = mode === "generate" ? generateMutation : directMutation;
  const canSubmit = mode === "direct" ? Boolean(text.trim()) : true;

  function submit() {
    if (!canSubmit || mutation.isPending) return;
    mutation.mutate();
  }

  return (
    <div className="space-y-2">
      <p className="text-data-label text-graphite">Query</p>

      <div className="inline-flex rounded-lg border border-border bg-surface-container-low p-0.5 gap-0.5">
        <ModePill
          active={mode === "generate"}
          onClick={() => setMode("generate")}
          icon={Sparkles}
          label="Generate topics"
        />
        <ModePill active={mode === "direct"} onClick={() => setMode("direct")} icon={Target} label="Direct topic" />
      </div>

      <div className="rounded-2xl border border-border bg-surface-container-low transition-colors overflow-hidden focus-within:border-proof-blue/50">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={mode === "generate" ? "Add custom instructions" : "Add a topic"}
          rows={3}
          className="min-h-[84px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 px-4 pt-4 pb-2"
        />

        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1">
          <div className="flex items-center gap-2">
            {mode === "generate" ? (
              <CountStepper count={count} onChange={setCount} />
            ) : (
              <AudienceTagInput value={audienceTag} onChange={setAudienceTag} />
            )}
          </div>

          <Button onClick={submit} disabled={!canSubmit || mutation.isPending} className="rounded-full">
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CornerDownLeft className="w-4 h-4" />
            )}
            {mode === "generate" ? "Generate" : "Generate Blog"}
          </Button>
        </div>
      </div>

      {mutation.isError && (
        <p className="text-ui-base text-redline-light">
          {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong. Please try again."}
        </p>
      )}
    </div>
  );
}

function ModePill({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-ui-medium transition-colors",
        active
          ? "bg-proof-blue/20 text-proof-blue-light"
          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function CountStepper({ count, onChange }: { count: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-surface-container-high px-1 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, count - 1))}
        className="flex items-center justify-center w-5 h-5 rounded-full text-graphite hover:text-on-surface hover:bg-surface-container-highest transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-data-value text-on-surface w-16 text-center">{count} topics</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, count + 1))}
        className="flex items-center justify-center w-5 h-5 rounded-full text-graphite hover:text-on-surface hover:bg-surface-container-highest transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

function AudienceTagInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface-container-high px-3 py-1.5">
      <Users className="w-3 h-3 text-graphite shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Audience tag"
        className="bg-transparent outline-none text-data-value text-on-surface w-20 placeholder:text-graphite"
      />
    </div>
  );
}
