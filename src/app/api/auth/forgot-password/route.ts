import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'
import { checkRateLimit, getIP, tooManyRequestsResponse } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getIP(req)
  const rl = await checkRateLimit(`forgot-password:${ip}`, 3, '1 h')
  if (!rl.success) return tooManyRequestsResponse(rl.reset)

  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email } })

  // Always return success to avoid leaking whether an email exists
  if (!user || !user.password) {
    return NextResponse.json({ ok: true })
  }

  // Delete any existing reset token for this email
  await db.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } })

  const token = randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await db.verificationToken.create({
    data: { identifier: `reset:${email}`, token, expires },
  })

  const baseUrl = process.env.NEXTAUTH_URL ?? `https://${req.headers.get('host')}`
  await sendPasswordResetEmail(email, token, baseUrl)

  return NextResponse.json({ ok: true })
}
