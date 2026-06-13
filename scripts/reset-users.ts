import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const PRESERVE_EMAIL = 'demo@devstash.io'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set in .env')
    process.exit(1)
  }

  const preserved = await db.user.findUnique({ where: { email: PRESERVE_EMAIL } })
  if (!preserved) {
    console.warn(`⚠ No user found with email "${PRESERVE_EMAIL}" — proceeding anyway.`)
  } else {
    console.log(`✓ Preserving user: ${preserved.name} (${preserved.email})`)
  }

  // Delete all VerificationTokens for non-preserved users
  // VerificationToken uses identifier (email), not userId
  const deletedTokens = await db.verificationToken.deleteMany({
    where: { identifier: { not: PRESERVE_EMAIL } },
  })

  // Deleting users cascades: Account, Session, UserJob
  const deletedUsers = await db.user.deleteMany({
    where: { email: { not: PRESERVE_EMAIL } },
  })

  console.log(`\nDeleted:`)
  console.log(`  ${deletedUsers.count} user(s) (+ their accounts, sessions, userJobs via cascade)`)
  console.log(`  ${deletedTokens.count} verification token(s)`)
  console.log('\n✓ Done.')
}

main()
  .catch((err) => {
    console.error('Error:', err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
