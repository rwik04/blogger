import { apiFetch } from "@/lib/api/client";
import type {
  QueuedBatchResponse,
  SelectTopicResponse,
  TopicBatchEventsResponse,
  TopicBatchStatusResponse,
  TopicGeneratorMode,
  TopicListResponse,
  TopicOut,
} from "@/lib/api/types";

export function generateTopics(input: {
  mode: TopicGeneratorMode;
  user_instruction?: string;
  count?: number;
  auto_approve?: boolean;
}) {
  return apiFetch<QueuedBatchResponse>("/topics/generate", { method: "POST", body: input });
}

export function getTopicBatch(batchId: string) {
  return apiFetch<TopicBatchStatusResponse>(`/topics/batches/${batchId}`);
}

export function getTopicBatchEvents(batchId: string, limit = 50) {
  return apiFetch<TopicBatchEventsResponse>(`/topics/batches/${batchId}/events`, { query: { limit } });
}

export function listTopics(params: { status?: string; subject?: string; limit?: number; offset?: number } = {}) {
  return apiFetch<TopicListResponse>("/topics", { query: params });
}

export function getTopic(topicId: string) {
  return apiFetch<TopicOut>(`/topics/${topicId}`);
}

export function selectTopic(topicId: string) {
  return apiFetch<SelectTopicResponse>(`/topics/${topicId}/select`, { method: "POST" });
}
