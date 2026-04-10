# Current Feature

<!-- Feature name and short description -->

## Status

<!-- Not Started | In Progress | Completed -->

## Goals

<!-- Goals & Requirements -->

## Notes

<!-- Any Extra Notes -->

## History

<!-- Keep this updated. Earliest to Latest -->

### Dashboard UI Phase 1 — Completed

Layout shell, global styles, and top bar.

- Initialized ShadCN UI with `button`, `badge`, `input`, `tooltip`, `dropdown-menu`, `avatar`, `separator`
- Global styles: dark mode by default, Inter font, color tokens (`--autoapply-primary`, `--autoapply-score-high/mid/low`, `--autoapply-surface`, `--autoapply-bg`)
- Dashboard route at `/dashboard` with two-panel layout (sidebar + main)
- Top bar: AutoApply logo, Feed/Tracker/Settings nav, search input, bell, avatar; mobile hamburger menu
- Bottom batch status bar: "Last checked: —" / "Next check in: —" (static)
