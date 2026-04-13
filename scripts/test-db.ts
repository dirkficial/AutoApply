import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set in .env')
    process.exit(1)
  }

  console.log('Connecting to database...\n')

  // ─── User ───────────────────────────────────────────────────────────────────

  const user = await db.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      isPro: true,
      emailVerified: true,
      password: true,
      resumeParsed: true,
      preferences: true,
      _count: { select: { userJobs: true } },
    },
  })

  if (!user) {
    console.error('No user found. Run `npm run db:seed` first.')
    process.exit(1)
  }

  console.log('─── User ───────────────────────────────────────────────')
  console.log(`  id            : ${user.id}`)
  console.log(`  name          : ${user.name}`)
  console.log(`  email         : ${user.email}`)
  console.log(`  isPro         : ${user.isPro}`)
  console.log(`  emailVerified : ${user.emailVerified?.toISOString() ?? 'null'}`)
  console.log(`  password hash : ${user.password ? user.password.slice(0, 20) + '…' : 'null'}`)
  console.log(`  resumeParsed  : ${user.resumeParsed ? '✓ present' : 'null'}`)
  console.log(`  preferences   : ${user.preferences ? '✓ present' : 'null'}`)
  console.log(`  userJobs      : ${user._count.userJobs}`)

  // ─── Jobs ───────────────────────────────────────────────────────────────────

  const jobs = await db.job.findMany({
    orderBy: { datePosted: 'desc' },
    select: {
      id: true,
      companyName: true,
      title: true,
      location: true,
      isRemote: true,
      source: true,
      techStack: true,
    },
  })

  console.log(`\n─── Jobs (${jobs.length}) ──────────────────────────────────────────`)
  for (const job of jobs) {
    const remote = job.isRemote ? '🌐' : '🏢'
    console.log(`  ${remote} [${job.source.padEnd(11)}] ${job.companyName.padEnd(14)} — ${job.title}`)
    console.log(`       ${job.location.padEnd(30)} ${job.techStack.slice(0, 4).join(', ')}`)
  }

  // ─── UserJobs ───────────────────────────────────────────────────────────────

  const userJobs = await db.userJob.findMany({
    where: { userId: user.id },
    orderBy: { matchScore: 'desc' },
    select: {
      status: true,
      matchScore: true,
      decisionAt: true,
      appliedAt: true,
      job: { select: { companyName: true, title: true } },
    },
  })

  console.log(`\n─── UserJobs (${userJobs.length}) ─────────────────────────────────────`)
  for (const uj of userJobs) {
    const score = String(uj.matchScore).padStart(3)
    const status = uj.status.padEnd(13)
    console.log(`  [${score}] ${status}  ${uj.job.companyName.padEnd(14)} — ${uj.job.title}`)
  }

  // ─── Status breakdown ───────────────────────────────────────────────────────

  const statusCounts = userJobs.reduce<Record<string, number>>((acc, { status }) => {
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  console.log('\n─── Status breakdown ───────────────────────────────────')
  for (const [status, count] of Object.entries(statusCounts)) {
    console.log(`  ${status.padEnd(14)} ${count}`)
  }

  console.log('\n✓ Database is healthy.')
}

main()
  .catch((err) => {
    console.error('Connection failed:', err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
