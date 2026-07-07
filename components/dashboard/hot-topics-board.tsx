"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { getSubjectStyle } from "@/lib/constants/tag-colors";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HotTopicsModal } from "@/components/dashboard/hot-topics-modal";
import type { TopicOut } from "@/lib/api/types";

export interface HotTopicDomain {
  subject: string;
  heat: number;
  topics: TopicOut[];
}

interface HotTopicsBoardProps {
  domains: HotTopicDomain[];
  isLoading: boolean;
}

interface TreemapTile {
  domain: HotTopicDomain;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Squarified treemap layout — recursively lays out rectangles that keep
 * aspect ratios as close to square as possible.
 * See: Bruls, Huizing, van Wijk (2000), "Squarified Treemaps".
 */
function squarify(items: HotTopicDomain[], rect: Rect): TreemapTile[] {
  if (items.length === 0) return [];

  const total = items.reduce((sum, t) => sum + t.heat, 0);
  const area = rect.width * rect.height;
  const values = items.map((t) => (t.heat / total) * area);

  const tiles: TreemapTile[] = [];
  let remaining = rect;
  let remainingValues = values;
  let remainingItems = items;

  while (remainingItems.length > 0) {
    const isHorizontal = remaining.width >= remaining.height;
    const shortSide = isHorizontal ? remaining.height : remaining.width;

    let row: number[] = [remainingValues[0]];
    const rowItems: HotTopicDomain[] = [remainingItems[0]];
    let bestRatio = worstRatio(row, shortSide);

    let i = 1;
    while (i < remainingValues.length) {
      const nextRow = [...row, remainingValues[i]];
      const nextRatio = worstRatio(nextRow, shortSide);
      if (nextRatio > bestRatio) break;
      row = nextRow;
      rowItems.push(remainingItems[i]);
      bestRatio = nextRatio;
      i++;
    }

    const rowSum = row.reduce((a, b) => a + b, 0);
    const rowThickness = rowSum / shortSide;

    let offset = 0;
    for (let j = 0; j < row.length; j++) {
      const itemLength = row[j] / rowThickness;
      const tile: Rect = isHorizontal
        ? { x: remaining.x, y: remaining.y + offset, width: rowThickness, height: itemLength }
        : { x: remaining.x + offset, y: remaining.y, width: itemLength, height: rowThickness };
      tiles.push({ domain: rowItems[j], ...tile });
      offset += itemLength;
    }

    remaining = isHorizontal
      ? { x: remaining.x + rowThickness, y: remaining.y, width: remaining.width - rowThickness, height: remaining.height }
      : { x: remaining.x, y: remaining.y + rowThickness, width: remaining.width, height: remaining.height - rowThickness };

    remainingValues = remainingValues.slice(row.length);
    remainingItems = remainingItems.slice(row.length);
  }

  return tiles;
}

function worstRatio(row: number[], shortSide: number): number {
  const sum = row.reduce((a, b) => a + b, 0);
  const max = Math.max(...row);
  const min = Math.min(...row);
  const thickness = sum / shortSide;
  return Math.max(
    (thickness * thickness * max) / (sum * sum) || 0,
    (sum * sum) / (thickness * thickness * min) || 0
  );
}

/**
 * Hot Topics — sized-by-relevance treemap of the day's suggested topics,
 * grouped by subject. Each tile's area reflects the combined relevance of
 * every topic in that subject (not just how many there are), and its hook
 * line surfaces the single highest-relevance story so the tile actually
 * says something instead of repeating the subject name twice. Clicking a
 * tile opens the full topic list for that subject.
 */
export function HotTopicsBoard({ domains, isLoading }: HotTopicsBoardProps) {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const sorted = [...domains].sort((a, b) => b.heat - a.heat);
  const tiles = squarify(sorted, { x: 0, y: 0, width: 100, height: 100 });
  const activeDomain = domains.find((d) => d.subject === activeSubject) ?? null;

  return (
    <Card className="rounded-lg bg-surface-container ring-0 border border-border p-0 gap-0 h-[460px] flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-border flex flex-row items-center gap-2 shrink-0">
        <Flame className="w-4 h-4 text-amber-light" />
        <CardTitle className="text-headline-md text-on-surface font-normal">Hot Topics</CardTitle>
      </CardHeader>

      <CardContent className="p-3 flex-1 min-h-0 flex flex-col">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center text-ui-base text-graphite">
            Loading topics…
          </div>
        )}
        {!isLoading && tiles.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center text-ui-base text-graphite px-6">
            No topic candidates yet. Generate some from New Blog.
          </div>
        )}
        {!isLoading && tiles.length > 0 && (
          <div className="relative w-full flex-1">
            {tiles.map(({ domain, x, y, width, height }) => {
              const tileColor = getSubjectStyle(domain.subject).bg;
              const isSmall = width < 12 || height < 12;
              const topStory = [...domain.topics].sort(
                (a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0)
              )[0];

              return (
                <div
                  key={domain.subject}
                  className="absolute p-0.5"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSubject(domain.subject)}
                    className={cn(
                      "group relative h-full w-full rounded-sm overflow-hidden cursor-pointer text-left",
                      "ring-1 ring-surface-container ring-inset transition-all duration-300",
                      "hover:z-10 hover:ring-2 hover:ring-on-surface/40 hover:brightness-110",
                      tileColor
                    )}
                  >
                    <div className="absolute inset-0 flex flex-col justify-between p-2 overflow-hidden">
                      {!isSmall && (
                        <span className="text-data-label text-white/80 truncate uppercase tracking-wide">
                          {domain.subject.replace(/_/g, " ")}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-ui-base font-medium text-white leading-tight",
                          isSmall ? "line-clamp-1 text-[11px]" : "line-clamp-3"
                        )}
                      >
                        {topStory?.title ?? domain.subject.replace(/_/g, " ")}
                      </span>
                      {!isSmall && (
                        <span className="flex items-center gap-1 text-data-label text-white/80">
                          <Flame className="w-3 h-3" />
                          {domain.heat} · {domain.topics.length} topic{domain.topics.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <HotTopicsModal
        subject={activeSubject}
        topics={activeDomain?.topics ?? []}
        onOpenChange={(open) => {
          if (!open) setActiveSubject(null);
        }}
      />
    </Card>
  );
}
