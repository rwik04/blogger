import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";

const POLL_INTERVAL_MS = 2500;

/**
 * blogger-backend has no SSE/websocket push — every mutating endpoint
 * returns 202 and the frontend has to poll `GET` endpoints for the real
 * result (see CLAUDE.md's "async execution model"). This wraps `useQuery`
 * with a refetch interval that's active only while `active` is true, so
 * callers stop hammering the API once a run/batch reaches a terminal state.
 */
export function usePolling<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  active: boolean,
  options: Partial<UseQueryOptions<T>> = {}
) {
  return useQuery<T>({
    queryKey,
    queryFn,
    refetchInterval: active ? POLL_INTERVAL_MS : false,
    ...options,
  });
}

/** A stage's GET output 404s ("not run yet") or 409s ("prerequisite not done") — both just mean "not ready", not a real error. */
export function isNotReady(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.status === 409);
}
