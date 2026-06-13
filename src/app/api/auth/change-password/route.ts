import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })

  if (!user?.password) {
    return NextResponse.json({ error: 'No password set on this account.' }, { status: 400 })
  }

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await db.user.update({ where: { id: user.id }, data: { password: hashed } })

  return NextResponse.json({ ok: true })
}
