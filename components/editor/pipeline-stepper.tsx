"use client";

import { Check, Loader2, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type StageState = "done" | "active" | "pending";

interface Stage {
  key: string;
  label: string;
  state: StageState;
  /** Present only for the stage that can be triggered right now. */
  onRun?: () => void;
  isRunning?: boolean;
}

interface PipelineStepperProps {
  stages: Stage[];
}

/**
 * Top-bar pipeline stepper: Research -> Strategize -> Write -> Finish.
 * Each stage is a proof-mark (blue pulse = in flight, moss check = done,
 * graphite circle = not reached), with a "Run" button on the one stage
 * that's actionable right now (its prerequisite is done, it isn't yet).
 */
export function PipelineStepper({ stages }: PipelineStepperProps) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, idx) => (
        <div key={stage.key} className="flex items-center">
          <div className="flex items-center gap-2 px-2">
            {stage.state === "done" && <Check className="w-4 h-4 text-moss-light" />}
            {stage.state === "active" && (
              <Loader2 className="w-4 h-4 text-proof-blue-light animate-spin" />
            )}
            {stage.state === "pending" && <Circle className="w-3.5 h-3.5 text-graphite" />}
            <span
              className={cn(
                "text-ui-medium",
                stage.state === "done" && "text-moss-light",
                stage.state === "active" && "text-proof-blue-light",
                stage.state === "pending" && "text-graphite"
              )}
            >
              {stage.label}
            </span>
            {stage.onRun && (
              <Button
                size="icon-xs"
                variant="ghost"
                disabled={stage.isRunning}
                onClick={stage.onRun}
                aria-label={`Run ${stage.label}`}
                className="text-proof-blue-light hover:bg-proof-blue/20"
              >
                {stage.isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </Button>
            )}
          </div>
          {idx < stages.length - 1 && <div className="w-6 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}
