"use client";

import type { ElementType } from "react";
import { Landmark, TrendingUp, Rocket, Globe2, Gavel, Wand2 } from "lucide-react";
import type { ComposerMode, ComposerPreset } from "@/components/wizard/topic-composer";

interface Example {
  icon: ElementType;
  category: string;
  mode: ComposerMode;
  text: string;
}

const EXAMPLES: Example[] = [
  {
    icon: Wand2,
    category: "Autonomous",
    mode: "generate",
    text: "Surface trending topics across every GS subject",
  },
  {
    icon: Gavel,
    category: "Steered",
    mode: "generate",
    text: "Recent Supreme Court rulings relevant to GS2",
  },
  {
    icon: TrendingUp,
    category: "Steered",
    mode: "generate",
    text: "RBI monetary policy changes so far this year",
  },
  {
    icon: Rocket,
    category: "Direct topic",
    mode: "direct",
    text: "ISRO Gaganyaan mission progress and readiness reviews",
  },
  {
    icon: Globe2,
    category: "Direct topic",
    mode: "direct",
    text: "India Middle East Europe Economic Corridor developments",
  },
  {
    icon: Landmark,
    category: "Steered",
    mode: "generate",
    text: "Constitutional amendments and federalism debates this quarter",
  },
];

interface ExampleQueriesProps {
  onSelect: (preset: ComposerPreset) => void;
}

/**
 * Clickable starter prompts, mirroring the "Example Runs" pattern from
 * agent-style composer UIs: each card fills the query box with a ready-made
 * instruction/topic and switches to the matching mode, so a first-time user
 * doesn't have to guess what a good query even looks like.
 */
export function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-headline-md text-on-surface font-normal">Example queries</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXAMPLES.map((example, idx) => {
          const Icon = example.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect({ mode: example.mode, text: example.text })}
              className="text-left rounded-lg border border-border bg-surface-container p-4 hover:bg-surface-container-high hover:border-graphite/40 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-graphite mb-2">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-data-label">{example.category}</span>
              </div>
              <p className="text-ui-base text-on-surface leading-snug">{example.text}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
