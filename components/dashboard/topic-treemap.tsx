"use client";

import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { getSubjectStyle } from "@/lib/constants/tag-colors";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface TrendingTopic {
  id: string;
  title: string;
  subjectTag: string;
  trendScore: number;
}

interface TopicTreemapProps {
  topics: TrendingTopic[];
  isLoading: boolean;
}

/**
 * Topic Treemap — visual display of today's trending topics.
 * Each topic is rendered as a tile whose area is proportional to its
 * trend score, color-coded by subject tag, laid out with a squarified
 * treemap algorithm.
 *
 * This matches the "Today's topic treemap" section in the Stitch designs.
 */

interface TreemapTile {
  topic: TrendingTopic;
  x: number; // 0-100 (%)
  y: number; // 0-100 (%)
  width: number; // 0-100 (%)
  height: number; // 0-100 (%)
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
function squarify(
  items: TrendingTopic[],
  rect: Rect
): TreemapTile[] {
  if (items.length === 0) return [];

  const total = items.reduce((sum, t) => sum + t.trendScore, 0);
  const area = rect.width * rect.height;
  const values = items.map((t) => (t.trendScore / total) * area);

  const tiles: TreemapTile[] = [];
  let remaining = rect;
  let remainingValues = values;
  let remainingItems = items;

  while (remainingItems.length > 0) {
    const isHorizontal = remaining.width >= remaining.height;
    const shortSide = isHorizontal ? remaining.height : remaining.width;

    let row: number[] = [remainingValues[0]];
    const rowItems: TrendingTopic[] = [remainingItems[0]];
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
      tiles.push({ topic: rowItems[j], ...tile });
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

export function TopicTreemap({ topics, isLoading }: TopicTreemapProps) {
  const sorted = [...topics].sort((a, b) => b.trendScore - a.trendScore);
  const tiles = squarify(sorted, { x: 0, y: 0, width: 100, height: 100 });

  return (
    <Card className="rounded-lg bg-surface-container ring-0 border border-border p-0 gap-0 h-[460px] flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-border flex flex-row items-center gap-2 shrink-0">
        <TrendingUp className="w-4 h-4 text-proof-blue-light" />
        <CardTitle className="text-headline-md text-on-surface font-normal">
          Suggested topics by subject
        </CardTitle>
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
            {tiles.map(({ topic, x, y, width, height }) => {
              const tileColor = getSubjectStyle(topic.subjectTag).bg;
              const isSmall = width < 12 || height < 12;

              return (
                <div
                  key={topic.id}
                  className="absolute p-0.5"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                >
                  <div
                    className={cn(
                      "group relative h-full w-full rounded-sm overflow-hidden cursor-pointer",
                      "ring-1 ring-surface-container ring-inset transition-all duration-300",
                      "hover:z-10 hover:ring-2 hover:ring-on-surface/40 hover:brightness-110",
                      tileColor
                    )}
                  >
                    <div className="absolute inset-0 flex flex-col justify-between p-2 overflow-hidden">
                      {!isSmall && (
                        <span className="text-data-label text-white/80 truncate">
                          {topic.subjectTag}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-ui-base font-medium text-white leading-tight",
                          isSmall ? "line-clamp-1 text-[11px]" : "line-clamp-3"
                        )}
                      >
                        {topic.title}
                      </span>
                      {!isSmall && (
                        <span className="text-data-label text-white/80">
                          {topic.trendScore}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
