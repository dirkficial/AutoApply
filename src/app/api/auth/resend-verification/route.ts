import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'
import { checkRateLimit, getIP, tooManyRequestsResponse } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = getIP(req)
  const body = await req.json()
  const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : ''

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const rl = await checkRateLimit(`resend-verification:${ip}:${email}`, 3, '15 m')
  if (!rl.success) return tooManyRequestsResponse(rl.reset)

  const user = await db.user.findUnique({ where: { email } })

  // Always return ok to avoid leaking whether an email is registered
  if (!user || user.emailVerified) {
    return NextResponse.json({ ok: true })
  }

  await db.verificationToken.deleteMany({ where: { identifier: email } })

  const token = randomUUID()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await db.verificationToken.create({
    data: { identifier: email, token, expires },
  })

  const protocol = req.headers.get('x-forwarded-proto') ?? 'http'
  const host = req.headers.get('host') ?? 'localhost:3000'
  const baseUrl = `${protocol}://${host}`

  await sendVerificationEmail(email, token, baseUrl)

  return NextResponse.json({ ok: true })
}
