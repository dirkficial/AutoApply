# Current Feature

Prisma ORM + Neon PostgreSQL Setup

## Status

Completed

## Goals

- Install and configure Prisma 7 with Neon PostgreSQL (serverless)
- Create `prisma/schema.prisma` with full data model from project-overview.md (User, Account, Session, VerificationToken, Job, UserJob)
- Include NextAuth v5 adapter models
- Add appropriate indexes and cascade deletes
- Generate initial migration via `prisma migrate dev --name init` (never `db push`)
- Verify migration runs cleanly against the Neon dev branch

## Notes

- `DATABASE_URL` points to the Neon **development** branch; production branch is separate
- Always use `prisma migrate dev` for schema changes — never `prisma db push`
- Prisma 7 has breaking changes — read the upgrade guide before implementing
- See full spec: @context/features/database-spec.md

## History

### Dashboard UI Phase 1 — Completed

Layout shell, global styles, and top bar.

- Initialized ShadCN UI with `button`, `badge`, `input`, `tooltip`, `dropdown-menu`, `avatar`, `separator`
- Global styles: dark mode by default, Inter font, color tokens (`--autoapply-primary`, `--autoapply-score-high/mid/low`, `--autoapply-surface`, `--autoapply-bg`)
- Dashboard route at `/dashboard` with two-panel layout (sidebar + main)
- Top bar: AutoApply logo, Feed/Tracker/Settings nav, search input, bell, avatar; mobile hamburger menu
- Bottom batch status bar: "Last checked: —" / "Next check in: —" (static)

### Dashboard UI Phase 2 — Completed

Collapsible filter sidebar and interactive job feed.

- Collapsible sidebar with vertical filter sections: role type, location, min match score (range slider), tech stack (multi-select), remote only toggle, clear all
- Job feed: header with new job count + sort toggle (best match / newest), scrollable card list
- Job cards: company color logo, match score badge (green/amber/red), AI summary (2-line truncate), tech stack tags (monospace), Yes/Skip/No action buttons
- Card actions: Yes (green flash 300ms), Skip/No (fade opacity) with optimistic UI
- Loading shimmer skeleton cards and two empty states (no jobs / all decided)
- Client-side filtering via `useJobFilters` hook; `page.tsx` stays a server component

### Prisma ORM + Neon PostgreSQL Setup — Completed

Database layer with Prisma 7 and Neon serverless PostgreSQL.

- Installed Prisma 7 with `@prisma/adapter-pg` + `pg` driver adapter (required in v7)
- `prisma/schema.prisma`: full schema — User, Account, Session, VerificationToken (NextAuth), Job, UserJob with enums, indexes, and cascade deletes; datasource has no `url` (moved to `prisma.config.ts` per Prisma 7)
- `prisma.config.ts`: `defineConfig` with `dotenv/config`, datasource URL, migrations path
- `src/lib/db.ts`: singleton `PrismaClient` using `PrismaPg` driver adapter
- Initial migration `20260410071123_init` applied to Neon dev branch via `prisma migrate dev --name init`
- `scripts/test-db.ts`: connectivity test (`npm run db:test`) — verifies all three tables are reachable
- `postinstall` script auto-regenerates the Prisma client after `npm install`
