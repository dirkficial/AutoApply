# Dashboard UI Phase 2 Spec

## Overview

This is phase 2 of 3 for the AutoApply dashboard UI layout. Phase 2 builds the filter system and the job feed with interactive cards. Use mock data imported directly from `@src/lib/mock-data.ts` until the database is connected.

## Requirements for phase 2

### Filter chips bar (replaces phase 1 placeholder)

- Horizontal scrollable row of filter chips above the job feed
- Filter categories:
  - **Role type**: All SWE / Frontend / Backend / Full-stack / DevOps / ML/AI
  - **Location**: Remote / Hybrid / Onsite + city chips (SF, NYC, Austin, Seattle)
  - **Min match score**: Slider chip that expands to a range input (0–100)
  - **Tech stack**: Multi-select chips from user's `preferences.techStack` array
  - **Remote only**: Toggle chip (filled when active)
- Active filters render as filled/highlighted chips, inactive as outlined
- "Clear all" button appears when any filter is active
- Filters apply client-side against mock data (no API calls yet)
- On mobile: single-row horizontal scroll with overflow fade on edges

### Job feed (replaces phase 1 placeholder)

- Feed header row:
  - Left: batch count ("8 new jobs") + last updated timestamp ("12 min ago")
  - Right: sort toggle pills — **Best match** (default, by `matchScore` desc) / **Newest** (by `datePosted` desc)
- Scrollable list of job cards, each showing:
  - Company logo/initial (colored square, 36×36px, rounded-lg)
  - Company name + location + remote badge (if `isRemote`)
  - Job title (font-weight 500)
  - Match score badge (pill, color-coded: green ≥80 / amber 50–79 / red <50)
  - AI summary (2 lines, truncated with ellipsis)
  - Tech stack tags (monospace, `font-family: var(--font-mono)`, small pills)
  - Posted time (relative: "2h ago", "1d ago")
  - Action buttons: **Yes** (green outline), **Skip** (neutral), **No** (red outline)
- Card click (anywhere except buttons) → opens focus view (phase 3)
- Card hover: border color transitions to `--color-border-secondary`

### Card actions

- **Yes**: card slides right with green flash → status updates to `YES` → "Tailoring resume..." loading text replaces buttons
- **No**: card fades to 40% opacity → status updates to `REJECTED` → "Dismissed" label replaces buttons
- **Skip**: card fades to 50% opacity → status updates to `SKIPPED` → "Skipped" label replaces buttons
- All transitions: 200ms ease-out
- Optimistic UI: update state immediately, no blocking

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between job cards (active card gets focus ring) |
| `Y` | Yes on focused card |
| `N` | No on focused card |
| `S` | Skip focused card |
| `Enter` | Open focus view for focused card |

### Loading + empty states

- **Loading**: shimmer skeleton cards (3 cards with pulsing gray blocks)
- **Empty (no jobs)**: centered illustration + "No new matches — next check in 3h 42m" with countdown
- **Empty (all decided)**: "You've reviewed all jobs in this batch. Nice work." + link to view skipped

## Mock data shape

```typescript
// src/lib/mock-data.ts

export const mockJobs: Job[] = [
  {
    id: "job_001",
    externalId: "simplify-stripe-swe2",
    source: "SIMPLIFY",
    companyName: "Stripe",
    title: "Software Engineer II",
    url: "https://stripe.com/jobs/...",
    location: "Remote (US)",
    isRemote: true,
    datePosted: new Date("2026-04-10T08:00:00Z"),
    aiSummary: "Build and maintain payment infrastructure APIs serving millions of merchants. Strong focus on reliability engineering and distributed systems.",
    techStack: ["Go", "TypeScript", "gRPC", "AWS"],
    matchScore: 94,
    status: "NEW",
  },
  // ... more jobs
];
```

## File structure additions

```
src/
├── components/
│   ├── dashboard/
│   │   ├── filter-bar.tsx        # Horizontal filter chips
│   │   ├── job-feed.tsx          # Feed header + card list
│   │   ├── job-card.tsx          # Individual job card
│   │   ├── job-card-actions.tsx  # Yes/Skip/No button group
│   │   ├── match-badge.tsx       # Color-coded score pill
│   │   ├── tech-tag.tsx          # Monospace tech stack tag
│   │   ├── sort-toggle.tsx       # Best match / Newest pills
│   │   ├── skeleton-card.tsx     # Shimmer loading card
│   │   └── empty-state.tsx       # No jobs / all reviewed states
│   └── layout/
│       └── ...                   # From phase 1
├── hooks/
│   ├── use-keyboard-shortcuts.ts # Y/N/S/↑↓/Enter handlers
│   └── use-job-filters.ts        # Client-side filter logic
└── lib/
    ├── mock-data.ts              # Mock jobs array
    └── utils.ts                  # Score color helper, relative time formatter
```

## References

- @context/project-overview.md (data model, UserJobStatus enum, feature descriptions)
- @context/screenshots/dashboard-ui-main.png
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-3-spec.md
