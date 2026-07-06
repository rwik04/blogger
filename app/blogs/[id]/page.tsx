"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PipelineStepper, type StageState } from "@/components/editor/pipeline-stepper";
import { SectionEditorPanel } from "@/components/editor/section-editor-panel";
import { SeoTab } from "@/components/editor/seo-tab";
import { DetailsTab } from "@/components/editor/details-tab";
import { LivePreview } from "@/components/editor/live-preview";
import { AgentEventTimeline, type TimelineEvent } from "@/components/shared/agent-event-timeline";
import { useRunPipeline } from "@/lib/hooks/use-run-poll";
import { isNotReady } from "@/lib/hooks/use-poll";
import { pauseRun, resumeRun } from "@/lib/api/runs";

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const runId = params.id;
  const [tab, setTab] = useState("content");
  const queryClient = useQueryClient();

  const { run, events, research, strategize, write, finish, blog, isActive, isComplete, paused } =
    useRunPipeline(runId);

  const researchReady = research.isSuccess;
  const strategizeReady = strategize.isSuccess;
  const writeReady = write.isSuccess;
  const finishReady = finish.isSuccess;

  // The supervisor (blogger-backend's `api/supervisor.py`) runs Research ->
  // Strategize -> Write -> Finish on its own — no per-stage "Run" buttons
  // needed anymore, just a single pause/resume toggle for the whole chain.
  const pauseMutation = useMutation({
    mutationFn: () => pauseRun(runId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["run", runId] }),
  });
  const resumeMutation = useMutation({
    mutationFn: () => resumeRun(runId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["run", runId] });
      queryClient.invalidateQueries({ queryKey: ["run-events", runId] });
    },
  });

  function stageState(ready: boolean, prerequisiteReady: boolean): StageState {
    if (ready) return "done";
    if (prerequisiteReady) return "active";
    return "pending";
  }

  const stages = [
    { key: "research", label: "Research", state: stageState(researchReady, true) },
    { key: "strategize", label: "Strategize", state: stageState(strategizeReady, researchReady) },
    { key: "write", label: "Write", state: stageState(writeReady, strategizeReady) },
    { key: "finish", label: "Finish", state: stageState(finishReady, writeReady) },
  ];

  if (run.isLoading) {
    return <div className="p-6 text-ui-base text-graphite">Loading run…</div>;
  }

  if (run.isError) {
    return (
      <div className="p-6">
        <p className="text-ui-base text-redline-light">
          {isNotReady(run.error) ? "Run not found." : "Failed to load run."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--topbar-h,0px))]">
      {/* Top bar */}
      <div className="border-b border-border px-6 py-3 flex items-center justify-between gap-4 bg-surface-container-low shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/blogs" className="text-graphite hover:text-on-surface transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-ui-medium text-on-surface truncate max-w-[420px]">{run.data?.topic}</h1>
              {run.data && <StatusBadge status={run.data.status} />}
              {paused && !isComplete && <StatusBadge status="paused" />}
            </div>
            <span className="text-data-value text-graphite">run {runId.slice(0, 8)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <PipelineStepper stages={stages} />
          {isActive && (
            <Button
              size="sm"
              variant="outline"
              disabled={pauseMutation.isPending || resumeMutation.isPending}
              onClick={() => (paused ? resumeMutation.mutate() : pauseMutation.mutate())}
              className={paused ? "text-moss-light hover:bg-moss/15" : "text-amber-light hover:bg-amber/15"}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {paused ? "Resume" : "Pause"}
            </Button>
          )}
        </div>
      </div>

      {/* Split editor */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="w-[440px] shrink-0 border-r border-border flex flex-col min-h-0">
          <Tabs value={tab} onValueChange={setTab} className="flex flex-col h-full min-h-0">
            <div className="px-4 pt-3 shrink-0">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <TabsContent value="content">
                <SectionEditorPanel
                  runId={runId}
                  outline={strategize.data?.outline ?? []}
                  sections={write.data?.sections}
                  isWriting={run.data?.status === "writing" && !writeReady}
                />
              </TabsContent>
              <TabsContent value="seo">
                <SeoTab seoPlan={strategize.data?.seo_plan} seoAudit={finish.data?.seo_audit} />
              </TabsContent>
              <TabsContent value="details">
                <DetailsTab research={research.data} finish={finish.data} />
              </TabsContent>
            </div>
          </Tabs>

          {events.data && events.data.events.length > 0 && (
            <div className="border-t border-border px-4 pt-3 pb-1 max-h-[280px] overflow-hidden shrink-0 flex flex-col">
              <p className="text-data-label text-graphite mb-2 shrink-0">Agent log</p>
              <AgentEventTimeline
                events={events.data.events.map(
                  (event, idx): TimelineEvent => ({
                    ...event,
                    key: `${event.step}-${event.created_at}-${idx}`,
                  })
                )}
                maxHeightClassName="max-h-[230px]"
              />
            </div>
          )}
        </div>

        {/* Right panel — live preview */}
        <div className="flex-1 min-h-0">
          <LivePreview
            run={run.data}
            blog={finishReady ? blog.data : undefined}
            strategize={strategize.data}
            sections={write.data?.sections}
          />
        </div>
      </div>
    </div>
  );
}
