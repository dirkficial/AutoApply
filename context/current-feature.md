# Current Feature

Dashboard UI Phase 1 — Layout shell, global styles, and top bar.

## Status

In Progress

## Goals

- Initialize ShadCN UI and install components: `button`, `badge`, `input`, `tooltip`, `dropdown-menu`, `avatar`, `separator`
- Global styles: dark mode by default, Inter font, JetBrains Mono for monospace
- Dashboard route at `/dashboard`
- Main dashboard layout (CSS grid): left placeholder for filters, center placeholder for job feed
- Top bar: AutoApply logo, Feed/Tracker/Settings nav tabs, search input, user avatar
- Bottom batch status bar: "Last checked: --" and "Next check in: --" (static)
- Responsive: desktop two-panel grid, mobile single-column with hamburger menu
- Define color tokens: `--autoapply-primary`, `--autoapply-score-high`, `--autoapply-score-mid`, `--autoapply-score-low`, `--autoapply-surface`, `--autoapply-bg`

## Notes

Phase 1 of 3. No data fetching or interactivity — layout scaffolding only. Phase 2 will wire in mock data and job cards.

File structure:
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/layout.tsx`
- `src/components/layout/top-bar.tsx`
- `src/components/layout/batch-status.tsx`

## History

<!-- Keep this updated. Earliest to Latest -->