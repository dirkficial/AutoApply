import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { ProfileClient } from './profile-client'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const [user, statusGroups] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, password: true, createdAt: true },
    }),
    db.userJob.groupBy({
      by: ['status'],
      where: { userId: session.user.id },
      _count: { status: true },
    }),
  ])

  if (!user) redirect('/sign-in')

  const countByStatus = Object.fromEntries(
    statusGroups.map((g) => [g.status, g._count.status]),
  )

  const seen = statusGroups.reduce((sum, g) => sum + g._count.status, 0)
  const applied = countByStatus['APPLIED'] ?? 0
  const interviewing = countByStatus['INTERVIEWING'] ?? 0
  const offers = countByStatus['OFFER'] ?? 0
  const responseRate =
    applied > 0 ? `${Math.round(((interviewing + offers) / applied) * 100)}%` : '—'

  const memberSince = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(user.createdAt)

  return (
    <ProfileClient
      name={user.name}
      email={user.email}
      image={user.image}
      memberSince={memberSince}
      isCredentialsUser={!!user.password}
      stats={{ seen, applied, interviewing, offers, responseRate }}
    />
  )
}
