# Current Feature

## Status

Not Started

## Goals

<!-- Add goals here -->

## Notes

<!-- Add notes here -->

## History

### Email Verification on Register — Completed

Resend verification email on registration; unverified users blocked from dashboard; OAuth users auto-verified.

- `src/lib/email.ts`: Resend client + `sendVerificationEmail(email, token, baseUrl)` helper
- `src/app/api/auth/register/route.ts`: generates a 24h `VerificationToken`, sends email after user creation
- `src/app/api/auth/verify-email/route.ts`: GET handler — validates token, sets `emailVerified`, deletes token, redirects to `/sign-in?verified=true`
- `src/app/verify-email/page.tsx`: "Check your email" page shown after registration (displays email from `?email=` param)
- `src/auth.config.ts`: added `session` callback to copy `emailVerified` from JWT into session for middleware use
- `src/auth.ts`: added `signIn` callback (auto-verifies OAuth users); `jwt` callback stores `emailVerified` in token on sign-in
- `src/proxy.ts`: redirects verified-but-signed-in users without `emailVerified` to `/verify-email`
- `src/types/next-auth.d.ts`: added `emailVerified: Date | null` to `Session` and `JWT` type augmentations
- `src/app/sign-in/page.tsx`: handles `?verified=true` (success toast) and `?error=invalid-token` (error message)
- `src/app/register/page.tsx`: redirects to `/verify-email?email=<email>` instead of sign-in on success
- `scripts/reset-users.ts`: utility (`npm run db:reset-users`) to delete all users except `demo@devstash.io`

### Auth UI — Sign In, Register & Sign Out — Completed

Custom auth pages, top-bar account dropdown, reusable `UserAvatar`, and registration toast.

- `src/components/providers.tsx`: `SessionProvider` wrapper added to root layout
- `src/auth.ts`: added `pages: { signIn: '/sign-in' }` to use custom sign-in page
- `src/proxy.ts`: redirect updated to `/sign-in`
- `src/app/sign-in/page.tsx`: custom sign-in — email/password form, GitHub OAuth button, error display, link to `/register`; fires `toast.success` when arriving from registration (`?registered=true`); ref guard prevents double-fire from React Strict Mode
- `src/app/register/page.tsx`: registration form — POSTs to `/api/auth/register`, client-side password-match guard, redirects to `/sign-in?registered=true` on success
- `src/components/ui/user-avatar.tsx`: reusable avatar — shows `AvatarImage` if `image` is set, otherwise initials (up to 2 chars) on primary background
- `src/components/layout/top-bar.tsx`: `UserAvatar` wrapped in `DropdownMenu` — header shows user name + email, items: Profile, Settings, Sign out
- `src/components/dashboard/dashboard-client.tsx`: removed sidebar user footer; top bar is sole account entry point
- `src/components/ui/sonner.tsx`: Sonner toast component added via shadcn; `<Toaster />` mounted in root layout

### Auth Credentials — Email/Password Provider — Completed

Added Credentials provider alongside GitHub OAuth, with registration endpoint.

- `src/auth.config.ts`: added Credentials provider with no-op `authorize: () => null` (edge-safe placeholder)
- `src/auth.ts`: overrides Credentials with real bcrypt validation — looks up user by email, compares hash, returns user or null; `providers` array is explicit `[GitHub, Credentials(real)]` to avoid duplication
- `src/app/api/auth/register/route.ts`: `POST` endpoint — validates all fields present, passwords match, checks for existing email (409), bcrypt-hashes at cost 12, creates user (201)
- `password String?` field was already in schema from prior migration; no new migration needed

### Auth Setup — NextAuth + GitHub Provider — Completed

NextAuth v5 with GitHub OAuth, split config pattern, and `/dashboard` route protection.

- Installed `next-auth@beta` and `@auth/prisma-adapter`
- `src/auth.config.ts`: edge-compatible config with GitHub provider only (no adapter)
- `src/auth.ts`: full config with PrismaAdapter, JWT strategy, and session callback that injects `user.id` from `token.sub`
- `src/app/api/auth/[...nextauth]/route.ts`: exports GET/POST handlers from `auth.ts`
- `src/proxy.ts`: named `proxy` export wrapping `auth()`; redirects unauthenticated requests to `/api/auth/signin` for all `/dashboard/*` routes
- `src/types/next-auth.d.ts`: extends `Session` type with `user.id: string`

### Code Quality Quick Wins — Completed

Four low-risk fixes from post-scan audit.

- `job-card.tsx`: guarded `company[0]` access with optional chaining + `?? "?"` to prevent crash on empty `companyName`
- `utils.ts`: added `diffMs < 0` and `diffMins < 1` guards in `relativeTime()` to return `"just now"` instead of negative strings
- `empty-state.tsx`: removed dead `onViewSkipped` prop and "View skipped jobs" button (never passed by any caller)
- `src/types/dashboard.ts`: new single source of truth for `SortMode`; `use-job-filters.ts` and `sort-toggle.tsx` now import/re-export from there; removed `as SortMode` cast and stale import from `dashboard-client.tsx`

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

### Dashboard Collections — Real Data from Database — Completed

Replaced mock data with live Prisma queries from Neon.

- `src/lib/db/jobs.ts`: `getDashboardJobs()` fetches all jobs with `userJobs` included; reads `matchScore` and `status` from `UserJob`, falling back to `0` / `"NEW"`
- `src/app/dashboard/page.tsx`: converted to `async` server component with `force-dynamic`; passes jobs to `DashboardClient` as `initialJobs` prop
- `DashboardClient`, `JobFeed`, `JobCard`, `JobCardActions`, `useJobFilters`: migrated from `MockJob` to `DashboardJob` type
- Tech stack filter options now derived from actual job data instead of hardcoded preferences

### Prisma ORM + Neon PostgreSQL Setup — Completed

Database layer with Prisma 7 and Neon serverless PostgreSQL.

- Installed Prisma 7 with `@prisma/adapter-pg` + `pg` driver adapter (required in v7)
- `prisma/schema.prisma`: full schema — User, Account, Session, VerificationToken (NextAuth), Job, UserJob with enums, indexes, and cascade deletes; datasource has no `url` (moved to `prisma.config.ts` per Prisma 7)
- `prisma.config.ts`: `defineConfig` with `dotenv/config`, datasource URL, migrations path
- `src/lib/db.ts`: singleton `PrismaClient` using `PrismaPg` driver adapter
- Initial migration `20260410071123_init` applied to Neon dev branch via `prisma migrate dev --name init`
- `scripts/test-db.ts`: connectivity test (`npm run db:test`) — verifies all three tables are reachable
- `postinstall` script auto-regenerates the Prisma client after `npm install`
