import { apiFetch } from "@/lib/api/client";
import type {
  DraftsResponse,
  EventsResponse,
  FinisherOutput,
  PublishedBlog,
  QueuedResponse,
  ResearchBrief,
  RunControlResponse,
  RunListResponse,
  RunStatusResponse,
  StatsResponse,
  StrategistOutput,
  WriterOutput,
} from "@/lib/api/types";
import type { EditPreset } from "@/lib/api/types";

export function startRun(input: { topic: string; audience_tag?: string }) {
  return apiFetch<QueuedResponse>("/runs", { method: "POST", body: input });
}

export function listRuns(params: { status?: string; limit?: number; offset?: number } = {}) {
  return apiFetch<RunListResponse>("/runs", { query: params });
}

export function getRun(runId: string) {
  return apiFetch<RunStatusResponse>(`/runs/${runId}`);
}

export function getRunEvents(runId: string, limit = 50) {
  return apiFetch<EventsResponse>(`/runs/${runId}/events`, { query: { limit } });
}

/** Stops the supervisor from auto-starting the next stage once the current one finishes. */
export function pauseRun(runId: string) {
  return apiFetch<RunControlResponse>(`/runs/${runId}/pause`, { method: "POST" });
}

/** Clears the pause flag and, if the run is idle between stages, immediately continues the pipeline. */
export function resumeRun(runId: string) {
  return apiFetch<RunControlResponse>(`/runs/${runId}/resume`, { method: "POST" });
}

export function getResearch(runId: string) {
  return apiFetch<ResearchBrief>(`/runs/${runId}/research`);
}

export function startStrategize(runId: string, audienceTag?: string) {
  return apiFetch<QueuedResponse>(`/runs/${runId}/strategize`, {
    method: "POST",
    body: { audience_tag: audienceTag },
  });
}

export function getStrategize(runId: string) {
  return apiFetch<StrategistOutput>(`/runs/${runId}/strategize`);
}

export function startWrite(runId: string) {
  return apiFetch<QueuedResponse>(`/runs/${runId}/write`, { method: "POST" });
}

export function getWrite(runId: string) {
  return apiFetch<WriterOutput>(`/runs/${runId}/write`);
}

export function getWriteDrafts(runId: string) {
  return apiFetch<DraftsResponse>(`/runs/${runId}/write/drafts`);
}

export function editSection(
  runId: string,
  sectionId: string,
  body: { preset: EditPreset; instruction?: string }
) {
  return apiFetch<QueuedResponse>(`/runs/${runId}/write/sections/${sectionId}/edit`, {
    method: "POST",
    body,
  });
}

export function startFinish(runId: string, includeQuiz?: boolean) {
  return apiFetch<QueuedResponse>(`/runs/${runId}/finish`, {
    method: "POST",
    body: { include_quiz: includeQuiz },
  });
}

export function getFinish(runId: string) {
  return apiFetch<FinisherOutput>(`/runs/${runId}/finish`);
}

export function getBlog(runId: string) {
  return apiFetch<PublishedBlog>(`/runs/${runId}/blog`);
}

export function getStats() {
  return apiFetch<StatsResponse>("/stats");
}
