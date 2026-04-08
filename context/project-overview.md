# 🚀 AutoApply — Project Overview

> **AI-powered job discovery, resume tailoring, and application pipeline for software engineers.**

| | |
|---|---|
| **Version** | `1.0.0` (MVP) |
| **Last Updated** | April 2026 |
| **Status** | 🟡 Pre-Development |
| **Repo** | `github.com/[your-username]/autoapply` |

---

## Table of Contents

- [1. Problem](#1-problem)
- [2. Users](#2-users)
- [3. Features](#3-features-mvp)
- [4. Architecture](#4-architecture)
- [5. Data Model](#5-data-model)
- [6. Tech Stack](#6-tech-stack)
- [7. Monetization](#7-monetization)
- [8. UI/UX](#8-uiux)
- [9. Documentation](#9-documentation--context)
- [10. Development Phases](#10-development-phases)
- [11. Open Questions](#11-open-questions)

---

## 1. Problem

Applying to software engineering jobs is a repetitive, time-consuming grind that looks like this:

```
📋 Browse job boards
      ↓
🔍 Filter by role / location / level
      ↓
📖 Read each posting to evaluate fit
      ↓
✏️  Tailor resume to match keywords
      ↓
📤 Navigate to portal and submit
      ↓
🔁 Repeat 30–50x per week
```

Each step has friction. Most job seekers burn out somewhere in the middle, start sending generic resumes, and miss opportunities they'd be a strong fit for.

**AutoApply collapses this into a notification-driven, AI-assisted pipeline where the user only makes two decisions:**

1. **"Should I apply?"** — Yes / No / Skip on a job card with an AI-generated summary and match score.
2. **"Does this tailored resume look right?"** — Review a diff of AI-tailored changes, then confirm.

Everything else — discovery, filtering, summarization, keyword matching, resume rewriting, PDF generation — is automated.

---

## 2. Users

### 🎯 Primary (Launch)

**You** — a single user. The app is built as a personal tool first, optimized for your own resume, preferences, and target roles. No auth overhead, no multi-tenancy concerns.

### 🌐 Secondary (Post-Validation)

Other software engineers actively job searching who want to reduce the manual overhead of applications.

| Phase | Scope | Auth | Key Change |
|-------|-------|------|------------|
| **Phase 1** | Solo (you) | None / hardcoded | Validate core workflow |
| **Phase 2** | Invite-only beta | NextAuth v5 (GitHub OAuth) | Multi-user, onboarding flow |
| **Phase 3** | Public launch | Full auth + email verification | Freemium monetization |

---

## 3. Features (MVP)

### P0 — Must Ship

| Feature | Description |
|---------|-------------|
| 🔄 **Job Polling** | Cron job fetches new SWE listings from [SimplifyJobs/New-Grad-Positions](https://github.com/SimplifyJobs/New-Grad-Positions) and [SpeedyApply/2026-SWE-College-Jobs](https://github.com/speedyapply/2026-SWE-College-Jobs) every 4 hours. Deduplicates against previously seen jobs via `external_id`. |
| ⚙️ **Preference Filters** | User configures once: role type, location (remote / hybrid / onsite + specific cities), experience level, tech stack, visa sponsorship, company size. Stored as JSON in user profile. |
| 🤖 **AI Summarization** | Each new job gets a brief AI-generated summary: company context, role overview, tech stack, remote policy, and a **match score (0–100)** against the user's parsed resume. |
| 📬 **Notification Feed** | Dashboard shows new jobs every 4 hours, sorted by match score. Each card: company logo, title, location, match badge, 2-line summary, **Yes / No / Skip** buttons. |
| ✏️ **Resume Tailoring** | On "Yes," Gemini rewrites bullet points, reorders sections, and adjusts keywords to match the job posting. Shows a **side-by-side diff** (original vs. tailored) with highlighted changes. |
| ✅ **Confirmation + Export** | User reviews the tailored resume, confirms, and gets a **downloadable PDF** + the application link opened in a new tab. |

### P1 — Fast Follow

| Feature | Description |
|---------|-------------|
| 📊 **Application Tracker** | Kanban board: `Applied → Interviewing → Offer / Rejected`. Drag-and-drop manual status updates. |
| 🔔 **Email / Push Notifications** | Optional email alerts via [Resend](https://resend.com) and browser push when new batches are ready. |

### P2 — Nice to Have

| Feature | Description |
|---------|-------------|
| 📈 **Analytics Dashboard** | Stats: jobs seen, applied, response rate, top-matching companies, score distribution. |
| 🧠 **AI Task Decomposition** | For vague goals ("prepare for interviews at X"), auto-generate checklists. |
| 🔗 **LinkedIn Integration** | Pull profile data as an alternative to manual resume upload. |

---

## 4. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTOAPPLY ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────┐    ┌──────────────┐
  │  SimplifyJobs │    │  SpeedyApply │
  │  GitHub Repo  │    │  GitHub Repo │
  └──────┬───────┘    └──────┬───────┘
         │                    │
         └────────┬───────────┘
                  ▼
  ┌───────────────────────────┐       ┌─────────────────┐
  │  ⏰ Vercel Cron (4hr)     │──────▶│  Neon (Postgres) │
  │  /api/cron/poll-jobs      │       │  via Prisma 7    │
  │  - Fetch new listings     │       └────────┬────────┘
  │  - Deduplicate            │                │
  │  - Store raw data         │                │
  └───────────────────────────┘                │
                                               ▼
  ┌───────────────────────────┐       ┌─────────────────┐
  │  🤖 Gemini API             │◀─────│  /api/ai/*       │
  │  (gemini-2.5-flash)       │       │  Server Actions   │
  │  - Summarize jobs         │       │  - summarize      │
  │  - Score match            │       │  - tailor resume  │
  │  - Tailor resume          │       │  - score match    │
  └───────────────────────────┘       └────────┬────────┘
                                               │
                                               ▼
  ┌───────────────────────────────────────────────────────┐
  │                    NEXT.JS APP (VERCEL)                │
  │                                                       │
  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │
  │  │  📬 Feed     │  │  ✏️ Tailor    │  │  📊 Tracker   │ │
  │  │  Dashboard   │  │  Diff View   │  │  Kanban      │ │
  │  └─────────────┘  └──────────────┘  └──────────────┘ │
  │                                                       │
  │  ┌─────────────┐  ┌──────────────┐                   │
  │  │  ⚙️ Settings  │  │  📄 Resume    │                   │
  │  │  Preferences │  │  Upload      │                   │
  │  └─────────────┘  └──────────────┘                   │
  └───────────────────────────────────────────────────────┘
                  │
                  ▼
  ┌───────────────────────────┐
  │  📧 Resend (Email)        │
  │  🔔 Web Push API          │
  │  📄 react-pdf (PDF gen)   │
  │  ☁️ Cloudflare R2 (storage)│
  │  💳 Stripe (payments)     │
  └───────────────────────────┘
```

### Data Flow (Happy Path)

```
1. Cron fires every 4 hours
2. Fetch .json listings from GitHub repos (raw content API)
3. Deduplicate against jobs.external_id in DB
4. For each new job:
   a. Store raw data in jobs table
   b. Send to Gemini API → get summary + tech_stack extraction
   c. Score against user's resume_parsed → match_score
   d. Create user_jobs record with status: NEW
5. User opens dashboard → sees new jobs sorted by match_score
6. User taps "Yes" on a job
7. Gemini API receives (base_resume + job_posting) → returns tailored resume
8. User sees diff view → confirms
9. System generates PDF via react-pdf
10. Opens application URL in new tab
11. user_jobs status → APPLIED
```

---

## 5. Data Model

> **Database:** [Neon](https://neon.tech) (Serverless Postgres)
> **ORM:** [Prisma 7](https://www.prisma.io)
> **Auth Tables:** Auto-generated by [NextAuth v5 Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma)

### ⚠️ Migration Policy

> **NEVER use `prisma db push` to apply schema changes.** It skips migration history and can cause data loss.

All schema changes **must** go through Prisma Migrate:

```bash
# 1. Edit prisma/schema.prisma

# 2. Generate a migration (creates SQL file in prisma/migrations/)
npx prisma migrate dev --name descriptive_migration_name

# 3. Review the generated SQL in prisma/migrations/<timestamp>_descriptive_migration_name/
#    Verify it does what you expect — especially for destructive changes (DROP, ALTER)

# 4. Test in development against a Neon branch (not main)
#    Neon branching: create a dev branch to test migrations safely

# 5. Once verified, apply to production
npx prisma migrate deploy
```

**Rules:**
- Every schema change = a new migration file committed to git
- Migrations run in **development first**, then **staging**, then **production** — never skip environments
- Destructive migrations (dropping columns/tables) require a two-step process: deprecate → backfill → drop in a separate migration
- Never edit or delete existing migration files after they've been applied
- Use `npx prisma migrate diff` to preview changes before generating

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── AUTH (NextAuth v5 Prisma Adapter) ───────────────────────

model User {
  id                   String    @id @default(cuid())
  name                 String?
  email                String?   @unique
  emailVerified        DateTime?
  image                String?
  accounts             Account[]
  sessions             Session[]

  // AutoApply fields
  resumeRaw            String?   @db.Text        // Original resume (plain text)
  resumeParsed         Json?                      // AI-extracted: skills, experience, education
  preferences          Json?                      // Filters: roles, locations, stack, visa, etc.
  notificationSettings Json?     @default("{}")   // Email/push prefs, cadence

  userJobs             UserJob[]

  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── JOBS ────────────────────────────────────────────────────

enum JobSource {
  SIMPLIFY        // SimplifyJobs/New-Grad-Positions
  SPEEDYAPPLY     // speedyapply/2026-SWE-College-Jobs
}

model Job {
  id          String    @id @default(cuid())
  externalId  String    @unique                  // Dedup key from source
  source      JobSource
  companyName String
  title       String
  url         String                             // Application link
  location    String
  isRemote    Boolean   @default(false)
  datePosted  DateTime?                          // From source data
  rawData     Json                               // Full original listing
  aiSummary   String?   @db.Text                 // AI-generated summary
  techStack   String[]                           // Extracted technologies
  fetchedAt   DateTime  @default(now())

  userJobs    UserJob[]

  @@index([datePosted])
  @@index([source])
}

// ─── USER ↔ JOB (Interaction / Pipeline) ─────────────────────

enum UserJobStatus {
  NEW
  SKIPPED
  YES
  TAILORING
  CONFIRMED
  APPLIED
  INTERVIEWING
  REJECTED
  OFFER
}

model UserJob {
  id               String        @id @default(cuid())
  userId           String
  jobId            String
  matchScore       Int           @default(0)     // 0–100, AI-calculated
  status           UserJobStatus @default(NEW)
  tailoredResume   String?       @db.Text        // AI-tailored resume content
  tailoredPdfUrl   String?                       // URL/path to generated PDF
  decisionAt       DateTime?                     // When Yes/No was clicked
  appliedAt        DateTime?                     // When confirmed + opened link
  notes            String?       @db.Text        // Personal notes

  user             User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  job              Job           @relation(fields: [jobId], references: [id], onDelete: Cascade)

  createdAt        DateTime      @default(now())

  @@unique([userId, jobId])
  @@index([userId, status])
  @@index([userId, matchScore])
}
```

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│     User     │       │     UserJob      │       │     Job      │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)          │    ┌──│ id (PK)      │
│ name         │  │    │ userId (FK)  ────│────┘  │ externalId   │
│ email        │  └───▶│ jobId (FK)   ────│───────│ source       │
│ resumeRaw    │       │ matchScore       │       │ companyName  │
│ resumeParsed │       │ status           │       │ title        │
│ preferences  │       │ tailoredResume   │       │ url          │
│ ...          │       │ tailoredPdfUrl   │       │ location     │
└──────────────┘       │ decisionAt       │       │ isRemote     │
       │               │ appliedAt        │       │ rawData      │
       │               │ notes            │       │ aiSummary    │
       ▼               └──────────────────┘       │ techStack[]  │
┌──────────────┐                                  └──────────────┘
│   Account    │
│   Session    │
│   Verif.Token│  ◀── NextAuth v5 managed
└──────────────┘
```

---

## 6. Tech Stack

### Language & Framework

| Layer | Choice | Why |
|-------|--------|-----|
| **Language** | TypeScript | Type safety across frontend, API routes, and Prisma |
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) | SSR for dashboard, API routes for cron + AI, RSC for perf |
| **Rendering** | Hybrid SSR + CSR | SSR for initial load; CSR for interactive job cards + real-time actions |
| **API** | Route Handlers + Server Actions | No separate backend — server actions for mutations |

### Database & ORM

| Layer | Choice | Why |
|-------|--------|-----|
| **Database** | [Neon](https://neon.tech) (Serverless Postgres) | Serverless-friendly, scales to zero, branching for dev/staging |
| **ORM** | [Prisma 7](https://www.prisma.io) | Type-safe queries, auto migrations, great DX with Next.js |
| **Auth** | [NextAuth v5 (Auth.js)](https://authjs.dev) | GitHub + Google OAuth, session management, Prisma adapter |

### CSS & UI

| Layer | Choice | Why |
|-------|--------|-----|
| **CSS** | [Tailwind CSS](https://tailwindcss.com) | Utility-first, rapid prototyping, purged in production |
| **Components** | [shadcn/ui](https://ui.shadcn.com) | Accessible, composable, not a dependency (copied into project) |
| **Icons** | [Lucide React](https://lucide.dev) | Consistent, minimal line icons |
| **Fonts** | Inter (sans) + JetBrains Mono (mono) | Clean legibility, tech-stack tags in mono |

### AI Integration

| Layer | Choice | Why |
|-------|--------|-----|
| **AI Model** | [Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs) | Fast, cost-effective for summarization + tailoring. Upgrade to Gemini 2.5 Pro for complex scoring if needed. |
| **SDK** | [`@google/genai`](https://www.npmjs.com/package/@google/genai) | Official Google AI TypeScript SDK |

**AI is used in three places:**

1. **Resume Parsing** — Extract structured data (skills, experience, education) from raw resume text → stored as `resumeParsed` JSON.
2. **Job Summarization + Scoring** — For each new job: generate a 2–3 sentence summary + match score (0–100) against user's parsed resume.
3. **Resume Tailoring** — Given (base resume + job posting), rewrite bullet points, reorder sections, and adjust keywords. Return as structured text with change annotations.

### Infrastructure

| Layer | Choice | Why |
|-------|--------|-----|
| **Deployment** | [Vercel](https://vercel.com) | Zero-config Next.js, edge functions, cron support |
| **Cron** | [Vercel Cron](https://vercel.com/docs/cron-jobs) | Trigger `/api/cron/poll-jobs` every 4 hours |
| **Email** | [Resend](https://resend.com) | Transactional emails, React email templates |
| **Push** | Web Push API | Browser notifications for new batches |
| **PDF** | [react-pdf](https://react-pdf.org) | Generate tailored resume PDFs server-side |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) | S3-compatible object storage, zero egress fees, store generated PDFs |
| **Payments** | [Stripe](https://stripe.com/docs) | Subscriptions (Pro tier), one-time payments (Lifetime), checkout sessions, customer portal |

---

## 7. Monetization

> **MVP: No monetization.** Priority is validating the workflow for yourself.

### Post-Validation Pricing (Phase 3)

Payments handled via [Stripe Checkout](https://stripe.com/docs/payments/checkout) + [Customer Portal](https://stripe.com/docs/customer-management/integrate-customer-portal) for self-service subscription management.

| Tier | Price | Stripe Product | Includes |
|------|-------|----------------|----------|
| 🆓 **Free** | $0 | — | 5 job alerts/day, 3 resume tailors/month, basic filters |
| ⭐ **Pro** | $12/mo | `price_pro_monthly` (recurring) | Unlimited alerts + tailoring, priority scoring, tracker, advanced filters (company size, funding stage, H1B data) |
| 💎 **Lifetime** | $99 once | `price_lifetime` (one-time) | Early adopter — everything in Pro, forever |

**Stripe Integration Notes:**
- Use Stripe Checkout Sessions for payment flow (no custom payment form needed)
- Webhook endpoint at `/api/webhooks/stripe` to handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Store `stripeCustomerId` and `stripeSubscriptionId` on the User model
- Customer Portal for users to manage billing, cancel, update payment method

### Future Revenue Levers

- **Affiliate links** to job boards / application tools
- **Premium resume templates** (ATS-optimized designs)
- **Interview prep add-on** — AI mock interviews based on the role you applied to
- **B2B channel** — university career services, bootcamps

---

## 8. UI/UX

### General Philosophy

Clean, minimal, utility-first. This is a **productivity tool**, not a social app. The UI should feel like a well-designed email client: scannable, fast, zero clutter.

**Inspiration:**
- [Linear](https://linear.app) — keyboard-first, clean density
- [Raycast](https://raycast.com) — speed and focus
- [Vercel Dashboard](https://vercel.com/dashboard) — minimal, functional
- [Sonara](https://sonara.ai) — closest competitor, study their UX

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  🔍 AutoApply          Feed   Tracker   Settings    👤  │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  FILTERS   │   JOB FEED (sorted by match score)        │
│            │                                            │
│  Role ▼    │   ┌────────────────────────────────────┐   │
│  Location ▼│   │ 🟢 92  Stripe — SWE II (Remote)    │   │
│  Stack ▼   │   │ Payments infra, Go/TypeScript...   │   │
│  Remote ▼  │   │ [Yes] [No] [Skip]                  │   │
│  Visa ▼    │   └────────────────────────────────────┘   │
│            │                                            │
│  ───────── │   ┌────────────────────────────────────┐   │
│            │   │ 🟡 74  Figma — Frontend Eng (SF)    │   │
│  STATS     │   │ Design tools, React/TypeScript...  │   │
│  Seen: 142 │   │ [Yes] [No] [Skip]                  │   │
│  Applied:23│   └────────────────────────────────────┘   │
│  Rate: 16% │                                            │
│            │   ┌────────────────────────────────────┐   │
│            │   │ 🔴 38  Acme Corp — Jr Dev (Dallas)  │   │
│            │   │ Legacy Java, onsite only...         │   │
│            │   │ [Yes] [No] [Skip]                  │   │
│            │   └────────────────────────────────────┘   │
└────────────┴────────────────────────────────────────────┘
```

**Resume Tailor View:**

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Feed          Tailoring for: Stripe SWE II  │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│   ORIGINAL RESUME        │   TAILORED RESUME            │
│                          │                              │
│   • Built REST APIs      │   • Built payment-grade      │
│     using Express        │     REST APIs using Express  │
│                          │  +  and Go microservices     │
│                          │                              │
│   • Managed PostgreSQL   │   • Managed PostgreSQL at    │
│     databases            │  +  scale for financial      │
│                          │  +  transaction processing   │
│                          │                              │
├──────────────────────────┴──────────────────────────────┤
│           [✏️ Edit]    [✅ Confirm & Export]    [❌ Reject] │
└─────────────────────────────────────────────────────────┘
```

### Typography, Colors & Icons

| Element | Spec |
|---------|------|
| **Primary Font** | [Inter](https://fonts.google.com/specimen/Inter) — clean, legible at small sizes |
| **Mono Font** | [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — tech stack tags, code |
| **Headings** | Inter SemiBold, 18–24px |
| **Body** | Inter Regular, 14–16px |
| **Secondary** | Inter Regular, 13px, `#6B7280` |

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#4A6CF7` | CTAs, links, active states |
| Success | `#10B981` | Confirmed, applied, diff additions |
| Warning | `#F59E0B` | Pending actions, medium match |
| Danger | `#EF4444` | Rejected, diff removals, low match |
| Background | `#FAFAFA` / `#0F0F23` | Light / dark mode |
| Surface | `#FFFFFF` / `#1A1A2E` | Cards, modals |
| Border | `#E5E7EB` / `#2D2D44` | Dividers, card borders |

**Match Score Badge Colors:**
- 🟢 **80–100:** `#10B981` (strong match)
- 🟡 **50–79:** `#F59E0B` (moderate match)
- 🔴 **0–49:** `#EF4444` (weak match)

**Icons:** [Lucide React](https://lucide.dev) — consistent, minimal line icons throughout.

### Responsive

| Breakpoint | Behavior |
|------------|----------|
| **Desktop** (≥1024px) | Two-panel layout: sidebar filters + job feed. Primary use case. |
| **Tablet** (768–1023px) | Collapsible sidebar, same feed layout. |
| **Mobile** (<768px) | Single column. Swipeable job cards (right = Yes, left = Skip). Bottom nav. |

### Micro-Interactions

| Element | Animation |
|---------|-----------|
| **Match score badge** | Animated fill on load (0 → score), color transitions from red → amber → green |
| **Yes / No buttons** | Subtle scale (`1.05`) + haptic on mobile. Card slides out after decision. |
| **Resume diff** | Typewriter reveal when AI-tailored version loads. Changes fade in with highlight. |
| **New batch indicator** | Pulse animation on the feed icon when new jobs arrive. |
| **Loading states** | Shimmer skeleton cards while fetching / AI is processing. |
| **Keyboard shortcuts** | `Y` = Yes, `N` = No, `S` = Skip, `→` / `←` to navigate cards. |

---

## 9. Documentation & Context

### Files to Maintain

| File | Purpose |
|------|---------|
| `README.md` | Setup instructions, env vars, architecture overview |
| `CONTRIBUTING.md` | Code style, PR process, branch naming |
| `.env.example` | All required env vars with placeholders |
| `prisma/schema.prisma` | Source of truth for data model (keep annotated) |
| `docs/architecture.md` | Data flow diagram: GitHub → Cron → DB → AI → Dashboard → Tailor → PDF |
| `docs/ai-prompts.md` | Version-controlled prompts for summarization, scoring, tailoring. **Treat these as code.** |
| `docs/api-routes.md` | All API routes with request/response shapes |

### AI Context Files

Keep a `/context` folder with files to feed your AI assistant when developing:

| File | Contents |
|------|----------|
| `context/product-spec.md` | This document |
| `context/schema.prisma` | Current database schema |
| `context/api-routes.md` | API route catalog with types |
| `context/component-tree.md` | React component hierarchy + prop types |
| `context/ai-prompts.md` | All prompt templates (symlink to `docs/`) |

### Environment Variables

```bash
# .env.example

# ─── Database ───────────────────────────
DATABASE_URL="postgresql://user:pass@host/autoapply?sslmode=require"

# ─── Auth (NextAuth v5) ────────────────
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_GITHUB_ID="your-github-oauth-app-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-secret"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# ─── AI (Gemini) ────────────────────────
GEMINI_API_KEY="AIza..."

# ─── Email ──────────────────────────────
RESEND_API_KEY="re_..."
EMAIL_FROM="notifications@autoapply.dev"

# ─── Storage (Cloudflare R2) ────────────
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret-key"
R2_BUCKET_NAME="autoapply-pdfs"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"

# ─── Payments (Stripe) ─────────────────
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_LIFETIME_PRICE_ID="price_..."

# ─── Cron ───────────────────────────────
CRON_SECRET="shared-secret-for-cron-auth"
```

---

## 10. Development Phases

### Phase 1: Weekend MVP (Week 1–2)

> Goal: **Polling + feed + summary working for yourself.**

- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Set up Neon database + Prisma schema + **first migration** (`prisma migrate dev --name init`)
- [ ] Build `/api/cron/poll-jobs` — fetch from SimplifyJobs + SpeedyApply GitHub repos
- [ ] Build AI summarization pipeline (Gemini API)
- [ ] Build job feed page with match score + Yes/No/Skip
- [ ] Deploy to Vercel with cron trigger

### Phase 2: Resume Tailoring (Week 3–4)

> Goal: **End-to-end apply flow: Yes → Tailor → Diff → Confirm → PDF.**

- [ ] Resume upload + AI parsing (extract structured data)
- [ ] Build tailoring prompt + diff view
- [ ] PDF generation with `react-pdf`
- [ ] Store PDFs in Cloudflare R2
- [ ] Application tracker (basic list view)

### Phase 3: Polish & Multi-User (Week 5–8)

> Goal: **Ready for other users.**

- [ ] NextAuth v5 integration (GitHub + Google OAuth)
- [ ] Onboarding flow (upload resume → set preferences → first feed)
- [ ] Email notifications via Resend
- [ ] Settings page
- [ ] Dark mode
- [ ] Mobile responsive + swipe gestures

### Phase 4: Monetization (Week 9+)

> Goal: **Sustainable revenue.**

- [ ] Stripe integration: products, prices, checkout sessions
- [ ] Webhook handler at `/api/webhooks/stripe`
- [ ] Add `stripeCustomerId` + `stripeSubscriptionId` to User model (**via migration, not db push**)
- [ ] Customer portal for self-service billing management
- [ ] Usage limits on Free tier (enforce in middleware)
- [ ] Landing page + marketing site
- [ ] Analytics dashboard

---

## 11. Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | How frequently do the GitHub repos actually update their `.json` files? Need to verify the polling interval makes sense. | Polling cadence | 🔴 To investigate |
| 2 | Should we also scrape the actual job posting page (via URL) for richer context, or rely solely on the repo data? | AI summary quality | 🟡 Leaning yes |
| 3 | What format should the tailored resume use? Markdown → PDF? Or replicate the user's original format? | PDF generation | 🟡 Start with Markdown |
| 4 | How to handle jobs that get closed between polling and user action? | UX edge case | 🟢 Show "may be closed" badge |
| 5 | Rate limits on Gemini API for high-volume summarization? Batch processing? | Cost + speed | 🟡 Use batch API if available |
| 6 | Should the match score weigh recency? (Newer jobs score higher even at lower keyword match) | Scoring algorithm | 🟡 Yes, add time decay |

---

## Key Links & Resources

| Resource | URL |
|----------|-----|
| SimplifyJobs New-Grad Repo | [github.com/SimplifyJobs/New-Grad-Positions](https://github.com/SimplifyJobs/New-Grad-Positions) |
| SpeedyApply SWE Jobs Repo | [github.com/speedyapply/2026-SWE-College-Jobs](https://github.com/speedyapply/2026-SWE-College-Jobs) |
| SpeedyApply AI Jobs Repo | [github.com/speedyapply/2026-AI-College-Jobs](https://github.com/speedyapply/2026-AI-College-Jobs) |
| SimplifyJobs Internships Repo | [github.com/SimplifyJobs/Summer2026-Internships](https://github.com/SimplifyJobs/Summer2026-Internships) |
| Next.js Docs | [nextjs.org/docs](https://nextjs.org/docs) |
| Prisma Docs | [prisma.io/docs](https://www.prisma.io/docs) |
| Prisma Migrate Guide | [prisma.io/docs/orm/prisma-migrate](https://www.prisma.io/docs/orm/prisma-migrate) |
| Neon Docs | [neon.tech/docs](https://neon.tech/docs) |
| NextAuth v5 | [authjs.dev](https://authjs.dev) |
| Gemini API | [ai.google.dev](https://ai.google.dev/gemini-api/docs) |
| Google AI SDK (TS) | [npmjs.com/package/@google/genai](https://www.npmjs.com/package/@google/genai) |
| Stripe Docs | [stripe.com/docs](https://stripe.com/docs) |
| Stripe Checkout | [stripe.com/docs/payments/checkout](https://stripe.com/docs/payments/checkout) |
| Cloudflare R2 | [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2/) |
| shadcn/ui | [ui.shadcn.com](https://ui.shadcn.com) |
| Resend | [resend.com/docs](https://resend.com/docs) |
| Vercel Cron | [vercel.com/docs/cron-jobs](https://vercel.com/docs/cron-jobs) |
| react-pdf | [react-pdf.org](https://react-pdf.org) |
| Lucide Icons | [lucide.dev](https://lucide.dev) |

---

> **This spec is a living document.** Update it as decisions change during development. When in doubt, ship the simpler version first.
