import { useQuery } from "@tanstack/react-query";
import {
  getRun,
  getRunEvents,
  getResearch,
  getStrategize,
  getWrite,
  getFinish,
  getBlog,
} from "@/lib/api/runs";
import { usePolling } from "@/lib/hooks/use-poll";

/**
 * A run's `status` field only ever means "the most recently completed (or
 * in-flight) stage" — `done` fires after Research, Strategize, and Write
 * too, not just at the very end. With the supervisor auto-advancing through
 * every stage on its own (see blogger-backend's `api/supervisor.py`), a
 * `done` status is almost always transient, so it can't be treated as
 * terminal here the way it used to be — only `failed`, or an actually
 * persisted Finisher output, means the run is done polling for good.
 */
const HARD_TERMINAL_STATUSES = ["failed"];

/**
 * Composes every query the editor page needs for one run: run status,
 * its event trail, and each stage's output (research/strategize/write/
 * finish/published-blog). Each stage GET 404s/409s until that stage has
 * run — that's expected, not a real error, see `isNotReady`.
 *
 * Polls everything on a fixed interval while the run hasn't reached a
 * terminal status, since blogger-backend has no push channel.
 */
export function useRunPipeline(runId: string) {
  const run = usePolling(["run", runId], () => getRun(runId), true);
  const status = run.data?.status;
  const paused = run.data?.paused ?? false;
  const hasFailed = status ? HARD_TERMINAL_STATUSES.includes(status) : false;

  const finish = useQuery({
    queryKey: ["finish", runId],
    queryFn: () => getFinish(runId),
    retry: false,
    // Self-terminating: stop polling once a Finisher output actually shows
    // up, rather than relying on `status` (which the supervisor will have
    // already moved past `done` for every stage but the last one anyway).
    refetchInterval: (query) => (hasFailed || query.state.data ? false : 3000),
  });

  const isComplete = finish.isSuccess;
  const isActive = !hasFailed && !isComplete;

  const events = usePolling(["run-events", runId], () => getRunEvents(runId, 100), isActive);

  const research = useQuery({
    queryKey: ["research", runId],
    queryFn: () => getResearch(runId),
    retry: false,
    refetchInterval: isActive ? 3000 : false,
  });

  const strategize = useQuery({
    queryKey: ["strategize", runId],
    queryFn: () => getStrategize(runId),
    retry: false,
    refetchInterval: isActive ? 3000 : false,
  });

  const write = useQuery({
    queryKey: ["write", runId],
    queryFn: () => getWrite(runId),
    retry: false,
    refetchInterval: isActive ? 3000 : false,
  });

  const blog = useQuery({
    queryKey: ["blog", runId],
    queryFn: () => getBlog(runId),
    retry: false,
    refetchInterval: isActive ? 3000 : false,
  });

  return { run, events, research, strategize, write, finish, blog, isActive, isComplete, paused };
}

export type RunPipeline = ReturnType<typeof useRunPipeline>;
