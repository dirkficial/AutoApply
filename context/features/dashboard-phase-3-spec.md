# Dashboard UI Phase 3 Spec

## Overview

This is phase 3 of 3 for the AutoApply dashboard UI layout. Phase 3 adds the focus view (expanded job detail), stats cards, and the resume tailor transition. Use mock data from `@src/lib/mock-data.ts` until the database is connected.

## Requirements for phase 3

### Stats cards row (top of main area, above feed)

- 4 metric cards in a responsive grid (`grid-template-columns: repeat(4, 1fr)`, collapse to 2×2 on mobile)
- Cards use `background: var(--color-background-secondary)`, no border, `border-radius: var(--border-radius-md)`, padding 1rem
- Each card:
  - Muted label (13px, secondary color) on top
  - Large number (24px, font-weight 500) below
- The 4 stats:

| Card | Label | Value source | Example |
|------|-------|-------------|---------|
| 1 | New jobs | Count of `userJobs` where `status === "NEW"` | 8 |
| 2 | Applied | Count of `userJobs` where `status === "APPLIED"` | 23 |
| 3 | Response rate | `(INTERVIEWING + OFFER) / APPLIED * 100` | 16% |
| 4 | Interviews | Count of `userJobs` where `status === "INTERVIEWING"` | 4 |

### Focus view (expanded job detail)

Triggered when user clicks a job card (anywhere except action buttons) or presses `Enter` on a focused card. Renders as a **slide-over panel from the right** (desktop) or **full-screen overlay** (mobile).

#### Focus view header
- Back arrow (← or Esc to close) + company name + job title
- Match score badge (same color-coded pill from feed)
- "Open original posting" external link icon (opens `job.url` in new tab)

#### Focus view body (scrollable)
- **Job details section**:
  - Company name, location, remote badge, date posted
  - Full AI summary (not truncated)
  - Tech stack tags (full list)
  - Salary range (if available in `rawData`)
  - Visa/sponsorship status (if available in `rawData`)

- **AI match breakdown section**:
  - Overall score with visual progress bar (colored by score tier)
  - "Skills matched" — list of overlapping skills between resume and job, rendered as green-tinted tags
  - "Skills to highlight" — skills from your resume relevant to this role but not explicitly listed in posting
  - "Gaps" — skills the job requires that aren't in your resume, rendered as red-tinted tags
  - This section builds trust in the scoring — users need to understand *why* a job scored the way it did

- **Notes field**:
  - Optional textarea for personal notes ("referred by X", "applied last year")
  - Auto-saves on blur (debounced 500ms)
  - Stored in `userJobs.notes`
  - Placeholder text: "Add notes about this job..."

#### Focus view sticky action bar (bottom)
- Pinned to bottom of panel, always visible
- Layout: `[← Prev] [Skip] [No] [Apply — tailor my resume →] [Next →]`
- "Apply — tailor my resume" is the primary CTA:
  - On click: transitions to the resume tailor view (`/dashboard/tailor/[jobId]`)
  - Loading state: button text changes to "Preparing..." with spinner
- ← Prev / Next → arrows navigate to adjacent jobs in the feed without closing the panel
- Keyboard: `←` / `→` for prev/next, `Y` to apply, `N` to reject, `S` to skip, `Esc` to close

### Recent activity feed (below stats cards, above job feed)

- Small section showing the last 5 actions taken:
  - "Applied to **Stripe — SWE II** · 2h ago"
  - "Skipped **Acme Corp — Jr Dev** · 5h ago"
  - "Tailored resume for **Vercel — Full-Stack Engineer** · 1d ago"
- Each entry: action icon (green check / gray skip / red x) + text + relative time
- Clickable: opens the focus view for that job
- Collapsible: "Show more" expands to full history, default shows 5

### Responsive behavior

| Viewport | Stats cards | Focus view | Activity feed |
|----------|------------|------------|---------------|
| Desktop (≥1024px) | 4-column grid | Slide-over panel (right, 600px wide) | Inline above feed |
| Tablet (768–1023px) | 2×2 grid | Slide-over panel (right, 80% width) | Inline above feed |
| Mobile (<768px) | 2×2 grid, smaller text | Full-screen overlay | Hidden by default, toggle to show |

## File structure additions

```
src/
├── app/
│   └── dashboard/
│       └── tailor/
│           └── [jobId]/
│               └── page.tsx           # Resume tailor view (placeholder for now)
├── components/
│   ├── dashboard/
│   │   ├── stats-cards.tsx            # 4 metric cards row
│   │   ├── recent-activity.tsx        # Last 5 actions feed
│   │   ├── focus-panel.tsx            # Slide-over job detail panel
│   │   ├── focus-header.tsx           # Back arrow, title, score, external link
│   │   ├── focus-job-details.tsx      # Full job info section
│   │   ├── focus-match-breakdown.tsx  # AI score breakdown with skill tags
│   │   ├── focus-notes.tsx            # Auto-saving notes textarea
│   │   ├── focus-action-bar.tsx       # Sticky bottom CTA bar
│   │   └── activity-item.tsx          # Single activity row
│   └── ui/
│       └── ...                        # ShadCN: sheet (for slide-over), progress, textarea
├── hooks/
│   ├── use-focus-navigation.ts        # ←/→ prev/next job navigation
│   └── use-auto-save.ts              # Debounced note saving
└── lib/
    └── mock-data.ts                   # Add mockUserJobs with status history for activity feed
```

## Mock data additions

```typescript
// Add to src/lib/mock-data.ts

export const mockUserJobs: UserJob[] = [
  {
    id: "uj_001",
    userId: "user_001",
    jobId: "job_001",
    matchScore: 94,
    status: "APPLIED",
    tailoredResume: "...",
    tailoredPdfUrl: "/pdfs/stripe-swe2-tailored.pdf",
    decisionAt: new Date("2026-04-10T10:30:00Z"),
    appliedAt: new Date("2026-04-10T10:35:00Z"),
    notes: "Referred by college friend who works on payments team",
    createdAt: new Date("2026-04-10T08:00:00Z"),
  },
  // ... more user-job records with various statuses
];

export const mockMatchBreakdown = {
  matched: ["TypeScript", "React", "Node.js", "PostgreSQL", "REST APIs"],
  highlight: ["System Design", "CI/CD", "Testing"],
  gaps: ["Go", "gRPC", "Kubernetes"],
  experienceAlignment: "strong", // "strong" | "moderate" | "weak"
};
```

## References

- @context/project-overview.md (UserJobStatus enum, data model, UI/UX section)
- @context/screenshots/dashboard-ui-main.png
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
