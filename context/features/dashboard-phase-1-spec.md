# Dashboard UI Phase 1 Spec

## Overview

This is phase 1 of 3 for the AutoApply dashboard UI layout. Phase 1 establishes the shell — layout scaffolding, global styles, and the top bar. No data fetching or interactivity yet.

## Requirements for phase 1

- ShadCN UI initialization and component installation (`button`, `badge`, `input`, `tooltip`, `dropdown-menu`, `avatar`, `separator`)
- Global styles: dark mode by default via `class="dark"` on `<html>`, Inter font via Google Fonts, JetBrains Mono for monospace elements
- Dashboard route at `/dashboard`
- Main dashboard layout using a responsive CSS grid:
  - Left: placeholder for filter chips area (just render `<h2>Filters</h2>` for now)
  - Center: placeholder for job feed (just render `<h2>Job Feed</h2>` for now)
- Top bar with:
  - AutoApply logo/icon (left)
  - Navigation tabs: **Feed** (active), **Tracker**, **Settings** (display only, no routing yet)
  - Search input (display only, no functionality yet)
  - User avatar with initials badge (top right)
- Bottom: batch status bar showing "Last checked: --" and "Next check in: --" (static placeholder)
- Ensure the layout is responsive:
  - Desktop (≥1024px): full top bar + two-area grid
  - Mobile (<768px): stacked single-column layout, hamburger menu for nav

## Color tokens to define

| Token | Dark mode value | Usage |
|-------|----------------|-------|
| `--autoapply-primary` | `#4A6CF7` | CTAs, active tabs, links |
| `--autoapply-score-high` | `#10B981` | Match score ≥ 80 |
| `--autoapply-score-mid` | `#F59E0B` | Match score 50–79 |
| `--autoapply-score-low` | `#EF4444` | Match score < 50 |
| `--autoapply-surface` | `#1A1A2E` | Card backgrounds |
| `--autoapply-bg` | `#0F0F23` | Page background |

## File structure to scaffold

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx            # Dashboard page
│   │   └── layout.tsx          # Dashboard layout (top bar, grid shell)
│   ├── layout.tsx              # Root layout (fonts, dark mode, providers)
│   └── globals.css             # Global styles + color tokens
├── components/
│   ├── layout/
│   │   ├── top-bar.tsx         # Logo, nav tabs, search, avatar
│   │   └── batch-status.tsx    # "Last checked / Next check" footer bar
│   └── ui/                     # ShadCN components (auto-generated)
└── lib/
    └── mock-data.ts            # Mock jobs + user data (used in phase 2+)
```

## References

- @context/project-overview.md (tech stack, color tokens, typography)
- @context/screenshots/dashboard-ui-main.png
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-2-spec.md
- @context/features/dashboard-phase-3-spec.md
