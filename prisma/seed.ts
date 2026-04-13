import 'dotenv/config'
import { hashSync } from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

// ─── Sample data ─────────────────────────────────────────────────────────────

const JOBS = [
  {
    externalId: 'seed-stripe-swe2',
    source: 'SIMPLIFY' as const,
    companyName: 'Stripe',
    title: 'Software Engineer II — Payments Infrastructure',
    url: 'https://stripe.com/jobs/listing/software-engineer-ii',
    location: 'Remote (US)',
    isRemote: true,
    datePosted: daysAgo(1),
    techStack: ['Go', 'TypeScript', 'PostgreSQL', 'Kafka', 'Kubernetes'],
    aiSummary:
      'Stripe is hiring a mid-level SWE to work on the core payments infrastructure that processes hundreds of billions of dollars annually. The role focuses on reliability, latency, and distributed systems in Go and TypeScript. Strong fit for candidates with backend distributed systems experience.',
    rawData: { source: 'SimplifyJobs', active: true },
  },
  {
    externalId: 'seed-figma-frontend',
    source: 'SIMPLIFY' as const,
    companyName: 'Figma',
    title: 'Frontend Engineer — Collaboration',
    url: 'https://www.figma.com/careers/job/frontend-engineer-collaboration',
    location: 'San Francisco, CA',
    isRemote: false,
    datePosted: daysAgo(2),
    techStack: ['React', 'TypeScript', 'WebSockets', 'C++', 'WebAssembly'],
    aiSummary:
      'Figma is looking for a frontend engineer to build real-time collaboration features used by 4M+ designers. The stack leans heavily on React and TypeScript with performance-critical C++/WASM layers. Hybrid onsite in SF; strong focus on UX quality and cross-functional work with design.',
    rawData: { source: 'SimplifyJobs', active: true },
  },
  {
    externalId: 'seed-vercel-platform',
    source: 'SPEEDYAPPLY' as const,
    companyName: 'Vercel',
    title: 'Platform Engineer — Edge Runtime',
    url: 'https://vercel.com/careers/platform-engineer-edge-runtime',
    location: 'Remote (Worldwide)',
    isRemote: true,
    datePosted: daysAgo(1),
    techStack: ['TypeScript', 'Rust', 'Node.js', 'V8', 'Cloudflare Workers'],
    aiSummary:
      'Vercel is building the next generation of their edge runtime and needs an engineer comfortable working deep in the JavaScript/V8 engine layer alongside Rust. Fully remote, async-first culture. Great match for candidates with runtime or infrastructure experience.',
    rawData: { source: 'SpeedyApply', active: true },
  },
  {
    externalId: 'seed-linear-product',
    source: 'SIMPLIFY' as const,
    companyName: 'Linear',
    title: 'Software Engineer — Product',
    url: 'https://linear.app/jobs/software-engineer',
    location: 'Remote (US/EU)',
    isRemote: true,
    datePosted: daysAgo(3),
    techStack: ['React', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Electron'],
    aiSummary:
      'Linear is a small, high-craft team building the issue tracker trusted by the fastest-growing startups. This role spans frontend and backend and requires opinionated product thinking. Fully remote, strong TypeScript codebase. Match is high for full-stack engineers who care about developer tools.',
    rawData: { source: 'SimplifyJobs', active: true },
  },
  {
    externalId: 'seed-anthropic-swe',
    source: 'SPEEDYAPPLY' as const,
    companyName: 'Anthropic',
    title: 'Software Engineer — Product',
    url: 'https://www.anthropic.com/jobs/software-engineer-product',
    location: 'San Francisco, CA',
    isRemote: false,
    datePosted: daysAgo(4),
    techStack: ['Python', 'TypeScript', 'React', 'FastAPI', 'AWS'],
    aiSummary:
      'Anthropic is hiring product engineers to build Claude-facing surfaces — APIs, developer tools, and the Claude.ai product. The role is Python-heavy on the backend with React on the frontend. SF-based, in-person preferred. Uniquely positioned at the frontier of AI product development.',
    rawData: { source: 'SpeedyApply', active: true },
  },
  {
    externalId: 'seed-notion-infra',
    source: 'SIMPLIFY' as const,
    companyName: 'Notion',
    title: 'Infrastructure Engineer — Storage',
    url: 'https://www.notion.so/careers/infrastructure-engineer-storage',
    location: 'New York, NY',
    isRemote: false,
    datePosted: daysAgo(5),
    techStack: ['Go', 'PostgreSQL', 'AWS RDS', 'Terraform', 'Kubernetes'],
    aiSummary:
      'Notion is scaling its storage layer to support 100M+ users and needs an infra engineer focused on Postgres performance and reliability. The team owns the critical path between user writes and durable storage. NYC onsite; less relevant for candidates without deep database internals experience.',
    rawData: { source: 'SimplifyJobs', active: true },
  },
  {
    externalId: 'seed-openai-swe-new-grad',
    source: 'SPEEDYAPPLY' as const,
    companyName: 'OpenAI',
    title: 'Software Engineer — New Grad 2026',
    url: 'https://openai.com/careers/software-engineer-new-grad-2026',
    location: 'San Francisco, CA',
    isRemote: false,
    datePosted: daysAgo(2),
    techStack: ['Python', 'TypeScript', 'Kubernetes', 'Triton', 'CUDA'],
    aiSummary:
      'OpenAI is hiring new grad engineers across infrastructure, product, and research engineering. Generalist role with opportunities to rotate across teams. SF onsite; highly competitive. Strong brand but requires relocating to the Bay Area.',
    rawData: { source: 'SpeedyApply', active: true },
  },
  {
    externalId: 'seed-planetscale-swe',
    source: 'SIMPLIFY' as const,
    companyName: 'PlanetScale',
    title: 'Software Engineer — Database',
    url: 'https://planetscale.com/careers/software-engineer-database',
    location: 'Remote (US)',
    isRemote: true,
    datePosted: daysAgo(7),
    techStack: ['Go', 'Vitess', 'MySQL', 'Kubernetes', 'gRPC'],
    aiSummary:
      'PlanetScale is building MySQL-compatible serverless databases on top of Vitess. This role contributes to the query planner, connection pooling, and scaling layer in Go. Fully remote. Excellent match for candidates with distributed database experience; lower match for those without systems background.',
    rawData: { source: 'SimplifyJobs', active: true },
  },
  {
    externalId: 'seed-retool-swe-fullstack',
    source: 'SPEEDYAPPLY' as const,
    companyName: 'Retool',
    title: 'Full Stack Engineer',
    url: 'https://retool.com/careers/full-stack-engineer',
    location: 'San Francisco, CA',
    isRemote: false,
    datePosted: daysAgo(6),
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redux'],
    aiSummary:
      'Retool is looking for a full-stack engineer to build the internal tooling platform used by thousands of companies. The stack is TypeScript end-to-end with React on the frontend and Node/Postgres on the backend. SF-based in-person role. Good cultural fit for engineers who like broad ownership.',
    rawData: { source: 'SpeedyApply', active: true },
  },
  {
    externalId: 'seed-rippling-swe-backend',
    source: 'SIMPLIFY' as const,
    companyName: 'Rippling',
    title: 'Backend Software Engineer',
    url: 'https://www.rippling.com/careers/backend-software-engineer',
    location: 'San Francisco, CA',
    isRemote: false,
    datePosted: daysAgo(8),
    techStack: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
    aiSummary:
      'Rippling is hiring backend engineers to work on their HR/IT/Finance platform. The role involves high-throughput Python services with complex multi-tenant data isolation requirements. Fast-paced environment; onsite SF. Moderate match for TypeScript-first engineers due to the Python-centric stack.',
    rawData: { source: 'SimplifyJobs', active: true },
  },
  {
    externalId: 'seed-neon-dx',
    source: 'SPEEDYAPPLY' as const,
    companyName: 'Neon',
    title: 'Developer Experience Engineer',
    url: 'https://neon.tech/careers/developer-experience-engineer',
    location: 'Remote (Worldwide)',
    isRemote: true,
    datePosted: daysAgo(3),
    techStack: ['TypeScript', 'Rust', 'PostgreSQL', 'Next.js', 'CLI tooling'],
    aiSummary:
      'Neon is building serverless Postgres and looking for a DX engineer to own their SDKs, CLI, and integration ecosystem. The role spans writing TypeScript SDKs, docs, and working directly with early-adopter developers. Fully remote with async culture. High match for full-stack engineers interested in developer tools.',
    rawData: { source: 'SpeedyApply', active: true },
  },
  {
    externalId: 'seed-acme-jr-dev',
    source: 'SIMPLIFY' as const,
    companyName: 'Acme Corp',
    title: 'Junior Developer — Legacy Systems',
    url: 'https://acmecorp.example.com/careers/junior-developer',
    location: 'Dallas, TX (Onsite)',
    isRemote: false,
    datePosted: daysAgo(10),
    techStack: ['Java', 'Oracle DB', 'JSP', 'Spring MVC', 'SVN'],
    aiSummary:
      'Acme Corp is filling a junior developer seat on their legacy ERP team. The tech stack is Java/Spring with an Oracle database. Fully onsite in Dallas; no remote option. Low match for candidates focused on modern web development or cloud-native tooling.',
    rawData: { source: 'SimplifyJobs', active: true },
  },
]

// Status assignments: covers every enum value + varied match scores
const USER_JOB_STATUSES: {
  externalId: string
  status: 'NEW' | 'SKIPPED' | 'YES' | 'TAILORING' | 'APPLIED' | 'INTERVIEWING' | 'REJECTED' | 'OFFER'
  matchScore: number
  decisionAt?: Date
  appliedAt?: Date
}[] = [
  { externalId: 'seed-stripe-swe2',       status: 'NEW',          matchScore: 92 },
  { externalId: 'seed-vercel-platform',   status: 'NEW',          matchScore: 88 },
  { externalId: 'seed-neon-dx',           status: 'NEW',          matchScore: 81 },
  { externalId: 'seed-linear-product',    status: 'NEW',          matchScore: 74 },
  { externalId: 'seed-figma-frontend',    status: 'YES',          matchScore: 78, decisionAt: daysAgo(1) },
  { externalId: 'seed-anthropic-swe',     status: 'TAILORING',    matchScore: 85, decisionAt: daysAgo(1) },
  { externalId: 'seed-openai-swe-new-grad', status: 'APPLIED',    matchScore: 70, decisionAt: daysAgo(3), appliedAt: daysAgo(3) },
  { externalId: 'seed-retool-swe-fullstack', status: 'INTERVIEWING', matchScore: 66, decisionAt: daysAgo(5), appliedAt: daysAgo(5) },
  { externalId: 'seed-notion-infra',      status: 'REJECTED',     matchScore: 55, decisionAt: daysAgo(6), appliedAt: daysAgo(6) },
  { externalId: 'seed-planetscale-swe',   status: 'OFFER',        matchScore: 90, decisionAt: daysAgo(8), appliedAt: daysAgo(8) },
  { externalId: 'seed-rippling-swe-backend', status: 'SKIPPED',   matchScore: 48, decisionAt: daysAgo(2) },
  { externalId: 'seed-acme-jr-dev',       status: 'SKIPPED',      matchScore: 22, decisionAt: daysAgo(4) },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set in .env')
    process.exit(1)
  }

  console.log('Seeding database...\n')

  const passwordHash = hashSync('12345678', 12)

  // Clear in dependency order
  await db.userJob.deleteMany()
  await db.job.deleteMany()
  await db.user.deleteMany()
  console.log('  ✓ Cleared existing data')

  // Create dev user
  const user = await db.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@devstash.io',
        password: passwordHash,
        isPro: false,
        emailVerified: new Date(),
        resumeRaw: `Alex Developer
alex@example.com | github.com/alexdev | linkedin.com/in/alexdev

SKILLS
Languages: TypeScript, JavaScript, Go, Python
Frameworks: React, Next.js, Node.js, Express
Databases: PostgreSQL, Redis, SQLite
Cloud: AWS (EC2, S3, Lambda), Vercel, Cloudflare
Tools: Docker, Kubernetes, Terraform, Git, GitHub Actions

EXPERIENCE
Software Engineer — Acme Startup (2023–Present)
• Built and maintained REST APIs using Express and TypeScript serving 50k+ daily users
• Migrated legacy MySQL schema to PostgreSQL; reduced query latency by 40%
• Developed internal admin dashboard with Next.js App Router and shadcn/ui
• Led adoption of GitHub Actions CI/CD pipeline; cut deployment time from 20 min to 4 min

Frontend Developer Intern — Widget Co (Summer 2022)
• Built responsive React components for the marketing site redesign
• Integrated Stripe payment flow for a subscription checkout page
• Wrote unit tests with Vitest; maintained 85% coverage on critical paths

EDUCATION
B.S. Computer Science — State University (2023)
GPA: 3.7 | Relevant coursework: Distributed Systems, Databases, Algorithms`,
        resumeParsed: {
          skills: ['TypeScript', 'JavaScript', 'Go', 'Python', 'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'AWS', 'Vercel', 'Docker', 'Kubernetes'],
          experience: [
            { company: 'Acme Startup', title: 'Software Engineer', startYear: 2023, endYear: null, current: true },
            { company: 'Widget Co', title: 'Frontend Developer Intern', startYear: 2022, endYear: 2022, current: false },
          ],
          education: [
            { institution: 'State University', degree: 'B.S. Computer Science', graduationYear: 2023 },
          ],
          yearsOfExperience: 2,
        },
        preferences: {
          roles: ['Software Engineer', 'Full Stack Engineer', 'Frontend Engineer', 'Platform Engineer'],
          locations: ['Remote', 'San Francisco, CA', 'New York, NY'],
          remoteOnly: false,
          techStack: ['TypeScript', 'React', 'Next.js', 'Go', 'PostgreSQL'],
          experienceLevel: ['new-grad', 'junior', 'mid'],
          visaSponsorship: false,
          companySizeMin: 10,
          companySizeMax: 5000,
        },
      },
    })
    console.log('  ✓ Created dev user')

  // Create jobs
  const createdJobs = await Promise.all(
    JOBS.map((job) =>
      db.job.create({
          data: {
            externalId: job.externalId,
            source: job.source,
            companyName: job.companyName,
            title: job.title,
            url: job.url,
            location: job.location,
            isRemote: job.isRemote,
            datePosted: job.datePosted,
            rawData: job.rawData,
            aiSummary: job.aiSummary,
            techStack: job.techStack,
          },
        })
      )
    )

  const jobByExternalId = Object.fromEntries(
    createdJobs.map((j) => [j.externalId, j.id])
  )
  console.log(`  ✓ Created ${createdJobs.length} jobs`)

  // Create user↔job records
  const userJobs = await Promise.all(
    USER_JOB_STATUSES.map((entry) =>
      db.userJob.create({
        data: {
          userId: user.id,
          jobId: jobByExternalId[entry.externalId],
          matchScore: entry.matchScore,
          status: entry.status,
          decisionAt: entry.decisionAt ?? null,
          appliedAt: entry.appliedAt ?? null,
        },
      })
    )
  )
  console.log(`  ✓ Created ${userJobs.length} user_job records`)

  const statusCounts = USER_JOB_STATUSES.reduce<Record<string, number>>((acc, { status }) => {
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  console.log('\nStatus breakdown:')
  for (const [status, count] of Object.entries(statusCounts)) {
    console.log(`  ${status.padEnd(14)} ${count}`)
  }
  console.log('\n✓ Seed complete.')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
