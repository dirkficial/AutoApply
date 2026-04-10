# Current Feature

Dashboard UI Phase 2 — Filter bar and job feed with interactive cards.

## Status

In Progress

## Goals

- Horizontal scrollable filter chips bar (role type, location, min match score, tech stack, remote toggle)
- Active/inactive chip states + "Clear all" button
- Client-side filtering against mock data
- Job feed with header (batch count + sort toggle) and scrollable card list
- Job cards: company logo, title, match score badge, AI summary, tech stack tags, action buttons
- Card actions: Yes (slide right), No (fade), Skip (fade) with 200ms transitions + optimistic UI
- Keyboard shortcuts: ↑/↓ navigate, Y/N/S act, Enter opens focus view
- Loading shimmer skeleton cards and empty states

## Notes

- Use mock data from `@src/lib/mock-data.ts` — no API calls yet
- See full spec: @context/features/dashboard-phase-2-spec.md

## History

### Dashboard UI Phase 1 — Completed

Layout shell, global styles, and top bar.

- Initialized ShadCN UI with `button`, `badge`, `input`, `tooltip`, `dropdown-menu`, `avatar`, `separator`
- Global styles: dark mode by default, Inter font, color tokens (`--autoapply-primary`, `--autoapply-score-high/mid/low`, `--autoapply-surface`, `--autoapply-bg`)
- Dashboard route at `/dashboard` with two-panel layout (sidebar + main)
- Top bar: AutoApply logo, Feed/Tracker/Settings nav, search input, bell, avatar; mobile hamburger menu
- Bottom batch status bar: "Last checked: —" / "Next check in: —" (static)
