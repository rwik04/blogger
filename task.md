# Frontend technical design doc (v0.1)

Working title: **Presswork** (placeholder codename, swap before submission per the assignment's authentic-naming rule; used below for package/repo names only).

Scope: frontend only. Backend contract assumptions are marked explicitly and should be reconciled once the section-based DB schema doc exists.

---

## 1. Goals and non-goals

**Goals**
- Ship four pages at real fidelity: dashboard, new-blog wizard, editor, content library.
- Make the editor genuinely fast to work in: section-level regeneration, live SEO feedback, no full-page reloads.
- Make agent progress visible at all times, this is graded explicitly and is real frontend work, not just a backend event to display.
- Keep the codebase legible enough that a reviewer can tell you wrote it, not Claude Code.

**Non-goals for v1**
- Topic bank and asset library as standalone pages (fold into dashboard / editor for now).
- Analytics page (cut entirely, add back only if time remains).
- Settings polish (one plain form is enough).
- Mobile-first design. Responsive down to tablet is the bar; phone-perfect is a bonus, not a requirement.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+, App Router | Required by the brief |
| Language | TypeScript | Non-negotiable for a project this state-heavy |
| Styling | Tailwind CSS | Fast iteration, pairs with shadcn |
| Component primitives | shadcn/ui (Radix underneath) | Copy-pasted, not a black-box import, satisfies "standard scaffolding OK, rest stays in your control" |
| Rich text editor | Tiptap (ProseMirror) | Headless, React-first, gives you section-scoped editing without hand-rolling contenteditable |
| Server state | TanStack Query | Caching, refetch, optimistic updates for blogs/sections |
| Client/UI state | Zustand | Editor selection, wizard step, panel tabs, no need for Redux ceremony |
| Real-time | native `EventSource` (SSE) wrapped in a hook | Backend is FastAPI, SSE is simpler than WebSockets for one-directional agent status and plays nicer with HTTP infra |
| Forms | React Hook Form + Zod | Wizard inputs, settings form |
| Testing | Vitest + React Testing Library, Playwright for one critical e2e path | Matches "testing matters, limited edge cases allowed" |
| Icons | lucide-react | Already common with shadcn, no separate icon pipeline |

---

## 3. Visual identity

Internal production tool, not a marketing site, so distinctiveness matters less than clarity, but it should still avoid the generic AI-dashboard look (warm cream + terracotta, or near-black + neon accent, or default shadcn gray-on-white with zero personality).

**Concept:** a copy desk. The tool sits between a machine (agents, scores) and a human editor, so the visual language borrows from print production: proof sheets, blue-pencil corrections, galley numbering. This isn't decorative, it maps directly onto real states (a needs-revision badge *is* a red-pencil mark, not an arbitrary amber pill).

**Palette** (named, 6 values):
- `ink` `#1C1B19` — primary text, dark-mode base surface
- `paper` `#F1F0EA` — light surface (cool, muted, deliberately not the warm-cream cliché)
- `proof-blue` `#2C5F8A` — accent, links, active states (the copy editor's blue pencil)
- `redline` `#B4432E` — needs-revision, errors, failed SEO checks (the red pencil)
- `moss` `#4B7A51` — approved, published, passed checks
- `graphite` `#6B6A65` — secondary text, muted UI chrome

**Type roles** (3 faces, each with a job):
- Display/content: `Source Serif 4` — used for the actual blog content preview inside the editor, because that's how the reader will eventually see it. Writers should proof in the real typeface.
- UI: `Inter` — everything that is tool chrome: nav, buttons, labels, forms.
- Data/mono: `IBM Plex Mono` — SEO scores, word counts, timestamps, version numbers. Numbers get a distinct face so they read as measurements, not prose.

**Signature element:** the editor's left rail (section outline) renders as a galley strip, not a generic sidebar list. Each section is numbered like a proof sheet, with a narrow margin column carrying a mark: a blue dot (agent currently drafting, pulses gently), a red tick (needs revision), a moss check (approved). This is the one place worth spending visual effort; everything else stays quiet.

Dark mode is the default (writers spend hours in the editor), light mode is a toggle, not the primary design target.

---

## 4. Assumed data contract (frontend-side)

These types are what the frontend will build against until the backend schema doc is finalized. Treat as a proposal to reconcile, not a spec handed down.

```ts
// lib/types/blog.ts

type BlogStatus = "drafting" | "needs_revision" | "in_review" | "ready" | "published";

type Section = {
  id: string;
  blogId: string;
  order: number;
  title: string;
  content: string;        // HTML or ProseMirror JSON, TBD with backend
  status: "queued" | "drafting" | "needs_revision" | "approved";
  revisionCount: number;  // current loop count, capped at maxRevisions
  seoScore: SEOResult | null;
  updatedAt: string;
};

type SEOCheck = {
  id: string;             // e.g. "title_length", "keyword_density"
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;         // e.g. "0.3% density, target 1-1.5%"
};

type SEOResult = {
  overallScore: number;   // 0-100
  readabilityGrade: number; // from textstat, Flesch-Kincaid grade
  checks: SEOCheck[];
};

type Blog = {
  id: string;
  title: string;
  subjectTag: string;     // Polity, Economy, Geography, etc.
  examPaper: "GS1" | "GS2" | "GS3" | "GS4" | null;
  status: BlogStatus;
  sections: Section[];
  sources: Source[];
  mcqs: MCQ[];
  version: number;
  createdAt: string;
  updatedAt: string;
};

type Source = { id: string; url: string; title: string; sectionId: string };
type MCQ = { id: string; question: string; options: string[]; correctIndex: number };

type AgentEvent = {
  blogId: string;
  sectionId?: string;
  agent: "topic_ideator" | "narrative_finder" | "writer" | "seo_analyzer" | "fact_checker";
  message: string;        // short human-readable status line
  timestamp: string;
};
```

---

## 5. Routing map

```
/                    → redirect to /dashboard
/dashboard           → priority 1
/new                 → wizard, step held in local state (?step=topic|plan)
/blogs               → content library, priority 1
/blogs/[id]          → editor, priority 1
/settings            → single plain form, low priority
```

No topic bank or asset library routes in v1, both fold into existing pages (see section 7).

---

## 6. Folder structure

```
presswork/
  app/
    layout.tsx
    page.tsx
    dashboard/page.tsx
    new/page.tsx
    blogs/page.tsx
    blogs/[id]/page.tsx
    settings/page.tsx
  components/
    ui/                shadcn primitives, generated, not hand-modified
    dashboard/
      stats-row.tsx
      continue-drafting-list.tsx
      agent-feed.tsx
      topic-queue.tsx
    wizard/
      topic-step.tsx
      plan-step.tsx
    editor/
      section-rail.tsx        the "galley strip" signature element
      section-editor.tsx      Tiptap wrapper
      seo-panel.tsx
      keyword-panel.tsx
      sources-panel.tsx
      agent-log-panel.tsx
      version-history.tsx
    library/
      blog-table.tsx
      filter-bar.tsx
    shared/
      status-badge.tsx
      score-pill.tsx
      nav.tsx
  lib/
    api/
      client.ts              fetch wrapper, base URL, error normalization
      blogs.ts                react-query hooks: useBlogs, useBlog, useUpdateSection
      topics.ts
    stores/
      editor-store.ts         zustand: active section id, panel tab
      wizard-store.ts         zustand: current step, draft topic/outline
    hooks/
      use-agent-stream.ts     SSE hook, see section 8
      use-section-autosave.ts debounced save on edit
    types/
      blog.ts                 types from section 4
    utils/
      seo-format.ts           formatting helpers for score display
  styles/
    globals.css
    tokens.css                 palette and type-role CSS variables from section 3
```

---

## 7. Page specs

### 7.1 Dashboard (`/dashboard`)

| Section | Data | Empty state |
|---|---|---|
| Stats row | 4 metric cards: published this week, in progress, avg SEO score, topics queued | Show zeros, not skeletons, once loaded |
| Continue drafting | Blogs with status `drafting` or `needs_revision`, sorted by `updatedAt` desc | "No blogs in progress. Start one." with CTA |
| Agent activity | Last ~20 `AgentEvent`s across all active blogs, newest first | Hide the panel entirely if nothing active, don't show an empty box |
| Topic queue | Top 5 pending topic suggestions, approve/reject inline | "No topics waiting. Add one manually." |

Interactions: clicking a continue-drafting row routes to `/blogs/[id]`. Approve/reject on a topic is optimistic (TanStack Query mutation, roll back on failure with a toast).

### 7.2 New blog wizard (`/new`)

Two steps, held in `wizard-store`, not separate routes, so back/forward doesn't lose state.

**Step 1: Topic**
- Text input for a manual topic, or a list pulled from the approved topic queue to pick from
- Subject tag select, GS paper select (optional)
- "Generate outline" button, triggers a request, shows a loading state that itself streams agent status (topic ideator / narrative finder), not a spinner

**Step 2: Plan**
- Narrative angle shown as a short callout
- Section outline as an editable, reorderable list (drag handles, add/remove)
- "Approve and start drafting" routes to `/blogs/[id]`, which is now in `drafting` status

### 7.3 Editor (`/blogs/[id]`)

The highest-effort page. Layout: three columns on desktop, collapsing to a tabbed layout on tablet.

- **Left rail** (`section-rail.tsx`): galley strip, one row per section, proof-mark icon per status, click to set `activeSectionId` in `editor-store`
- **Center** (`section-editor.tsx`): Tiptap instance scoped to the active section only, not the whole document, so regenerating one section never touches editor state for the others. "Regenerate section" button sends a targeted request, shows the section as `drafting` while waiting
- **Right panel**, tabs: SEO, Keywords, Sources, Agent log
  - SEO tab renders the `SEOCheck[]` list, color-coded via `redline`/`moss`, updates live after each save via the SSE stream, not by polling
  - Agent log tab is a scoped filter of the same `AgentEvent` stream used on the dashboard, filtered to this `blogId`
- **Top bar**: title, status pill, version selector (dropdown of past versions, read-only diff view), save/publish buttons
- **Bottom, once all sections are `approved`**: MCQ builder panel, generated from final content, each MCQ editable inline before publish

State ownership: section content itself is server state (TanStack Query, optimistic on edit), active section id and panel tab are client state (Zustand), agent events are a separate stream-fed store (see section 8).

### 7.4 Content library (`/blogs`)

- Filter bar: status, subject tag, date range, SEO score range, text search
- Table (shadcn `DataTable` pattern): title, subject tag, status, SEO score, word count, last edited
- Row actions: open, duplicate, version history
- Bulk select: archive, re-run SEO check

---

## 8. Real-time agent status

This is graded explicitly and is genuine frontend work, don't let it be an afterthought.

**Contract assumption:** backend exposes `GET /api/blogs/{id}/events` as an SSE stream (and possibly `GET /api/events` for the dashboard's global feed), emitting `AgentEvent` JSON payloads as they happen.

```ts
// lib/hooks/use-agent-stream.ts
function useAgentStream(blogId?: string) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  useEffect(() => {
    const url = blogId ? `/api/blogs/${blogId}/events` : "/api/events";
    const source = new EventSource(url);
    source.onmessage = (e) => {
      const event: AgentEvent = JSON.parse(e.data);
      setEvents((prev) => [event, ...prev].slice(0, 50));
    };
    source.onerror = () => {
      // EventSource auto-reconnects; surface a subtle "reconnecting" indicator
      // rather than an error toast, this is expected on flaky connections
    };
    return () => source.close();
  }, [blogId]);
  return events;
}
```

Design constraints this implies:
- The feed component must render incrementally (newest on top), never require a manual refresh.
- Section status changes (`drafting` → `needs_revision` → `approved`) should come through the same stream and update `section-rail.tsx` live, not just the log text. The rail is the primary status signal, the log is the detail.
- On reconnect, don't clear the existing feed, just resume appending.

---

## 9. Testing strategy

- Component tests (Vitest + RTL): `status-badge`, `score-pill`, `section-rail` status transitions, wizard step validation.
- One Playwright e2e path covering the actual "productive for content writers" claim: create a blog via the wizard, edit a section, see the SEO panel update, approve, publish. This is the flow most worth proving works end to end.
- Explicitly skip: exhaustive edge-case coverage across every SEO check permutation, the brief allows "limited edge cases," don't over-invest here.

---

## 10. Iteration plan

Sequenced so each milestone is independently demoable, matching "try to submit an early version fast."

1. **Scaffold**: Next.js + Tailwind + shadcn init, design tokens from section 3 wired into `tokens.css`, nav shell.
2. **Dashboard, static**: build with mock data, no API calls yet. This is your first shareable screenshot.
3. **Content library, static**: table and filters against mock data.
4. **Wizard**: topic and plan steps, mock outline generation.
5. **Editor shell**: three-column layout, galley rail, Tiptap wired to mock section content, no live scoring yet.
6. **Wire the API**: replace mock data with real TanStack Query calls once backend endpoints exist.
7. **Wire SSE**: agent feed and live section status, this is the milestone where the product actually starts to feel real.
8. **Wire SEO panel live**: connect real scoring results, color-code checks.
9. **Polish pass**: empty states, error states, keyboard focus, reduced motion, responsive check at tablet width.
10. **README, Loom, deploy**: last, not first.

---

## 11. Open questions to reconcile with the backend schema doc

- Is section `content` HTML or ProseMirror JSON over the wire? Affects whether Tiptap needs a custom serializer.
- Does the SSE stream carry section-level `status` changes, or does the frontend infer status from separate poll/refetch? Strongly prefer the former.
- Version history: full snapshots per version, or diffs? Affects whether `version-history.tsx` can do inline diffing client-side or needs a diff endpoint.