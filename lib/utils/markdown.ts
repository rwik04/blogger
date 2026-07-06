import * as React from "react";

/**
 * Minimal markdown -> React renderer for backend-generated `body_markdown`/
 * `report_markdown` (headings, bold/italic, inline code, ordered/unordered
 * lists, paragraphs). Deliberately not a full CommonMark implementation —
 * no markdown library is installed and the agents only ever emit this small
 * subset (see WRITER.md/RESEARCHER.md output contracts). Ordered-list
 * support exists specifically for the Writer's "measures/steps/initiatives"
 * sections, which are now instructed to format as a numbered breakdown
 * (one bold-labeled point per list item) rather than flowing prose.
 */
export function renderMarkdownLite(source: string): React.ReactNode[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0 || listType === null) return;
    blocks.push(
      React.createElement(
        listType,
        {
          key: `list-${key++}`,
          className: listType === "ol" ? "list-decimal pl-5 space-y-2" : "list-disc pl-5 space-y-1",
        },
        listItems.map((item, i) =>
          React.createElement("li", { key: i }, renderInline(item))
        )
      )
    );
    listItems = [];
    listType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushList();
      continue;
    }

    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      const sizeClass = level <= 2 ? "text-headline-md" : "text-ui-medium font-semibold";
      blocks.push(
        React.createElement(
          tag,
          { key: `h-${key++}`, className: `${sizeClass} text-on-surface mt-3` },
          renderInline(headingMatch[2])
        )
      );
      continue;
    }

    const orderedMatch = /^\d+[.)]\s+(.*)$/.exec(line);
    if (orderedMatch) {
      if (listType === "ul") flushList();
      listType = "ol";
      listItems.push(orderedMatch[1]);
      continue;
    }

    const unorderedMatch = /^[-*]\s+(.*)$/.exec(line);
    if (unorderedMatch) {
      if (listType === "ol") flushList();
      listType = "ul";
      listItems.push(unorderedMatch[1]);
      continue;
    }

    flushList();
    blocks.push(
      React.createElement("p", { key: `p-${key++}` }, renderInline(line))
    );
  }
  flushList();

  return blocks;
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // bold, italic, inline code, and citation markers like [1]
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(React.createElement("strong", { key: key++ }, token.slice(2, -2)));
    } else if (token.startsWith("*")) {
      nodes.push(React.createElement("em", { key: key++ }, token.slice(1, -1)));
    } else {
      nodes.push(
        React.createElement(
          "code",
          { key: key++, className: "px-1 py-0.5 rounded bg-surface-container-highest text-data-value" },
          token.slice(1, -1)
        )
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
