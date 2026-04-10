import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set in .env')
    process.exit(1)
  }

  console.log('Connecting to database...')

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const db = new PrismaClient({ adapter })

  try {
    // Test basic connectivity with a raw count on each table
    const [userCount, jobCount, userJobCount] = await Promise.all([
      db.user.count(),
      db.job.count(),
      db.userJob.count(),
    ])

    console.log('✓ Connected successfully\n')
    console.log('Table row counts:')
    console.log(`  users     : ${userCount}`)
    console.log(`  jobs      : ${jobCount}`)
    console.log(`  user_jobs : ${userJobCount}`)
    console.log('\nDatabase is healthy.')
  } finally {
    await db.$disconnect()
  }
}

main().catch((err) => {
  console.error('Connection failed:', err)
  process.exit(1)
})
