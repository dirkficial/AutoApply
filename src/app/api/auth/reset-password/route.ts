import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { checkRateLimit, getIP, tooManyRequestsResponse } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getIP(req)
  const rl = await checkRateLimit(`reset-password:${ip}`, 5, '15 m')
  if (!rl.success) return tooManyRequestsResponse(rl.reset)

  const { token, email, password } = await req.json()

  if (!token || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const record = await db.verificationToken.findUnique({
    where: { token },
  })

  if (!record || record.identifier !== `reset:${email}`) {
    return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
  }

  if (record.expires < new Date()) {
    await db.verificationToken.delete({ where: { token } })
    return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    await db.verificationToken.delete({ where: { token } })
    return NextResponse.json({ error: 'Account not found.' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)

  await db.user.update({
    where: { email },
    data: { password: hashed },
  })

  await db.verificationToken.delete({ where: { token } })

  return NextResponse.json({ ok: true })
}
