"use client";

import { useState } from "react";
import { TopicComposer, type ComposerPreset } from "@/components/wizard/topic-composer";
import { TopicBatchProgress } from "@/components/wizard/topic-batch-progress";
import { ExampleQueries } from "@/components/wizard/example-queries";
import { RecentRuns } from "@/components/wizard/recent-runs";

/**
 * New Blog — a single query composer (steer topic generation, go fully
 * autonomous, or start straight from a raw topic) instead of separate tabbed
 * forms. Once a Topic Generator batch is running, the composer gives way to
 * its live progress + resulting candidates.
 */
export default function NewBlogPage() {
  const [batchId, setBatchId] = useState<string | null>(null);
  const [preset, setPreset] = useState<ComposerPreset | null>(null);

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-[860px]">
        <h2 className="text-headline-lg text-on-surface">New Blog</h2>
        <p className="text-ui-base text-on-surface-variant mt-1">
          Generate a batch of fresh topic candidates, or jump straight to researching one you already have in mind.
        </p>
      </div>

      {!batchId && (
        <div className="max-w-[860px]">
          <TopicComposer onBatchStarted={setBatchId} preset={preset} />
        </div>
      )}

      {batchId ? (
        <TopicBatchProgress batchId={batchId} onReset={() => setBatchId(null)} />
      ) : (
        <div className="space-y-8">
          <ExampleQueries onSelect={setPreset} />
          <RecentRuns />
        </div>
      )}
    </div>
  );
}
