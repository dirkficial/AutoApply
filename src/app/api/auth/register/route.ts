import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

const emailVerificationEnabled = process.env.REQUIRE_EMAIL_VERIFICATION !== 'false'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, password, confirmPassword } = body

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  if (!emailVerificationEnabled) {
    await db.user.create({
      data: { name, email, password: hashed, emailVerified: new Date() },
    })
    return NextResponse.json({ success: true, redirectTo: '/sign-in?registered=true' }, { status: 201 })
  }

  await db.user.create({
    data: { name, email, password: hashed },
  })

  const token = randomUUID()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await db.verificationToken.create({
    data: { identifier: email, token, expires },
  })

  const protocol = req.headers.get('x-forwarded-proto') ?? 'http'
  const host = req.headers.get('host') ?? 'localhost:3000'
  const baseUrl = `${protocol}://${host}`

  await sendVerificationEmail(email, token, baseUrl)

  return NextResponse.json(
    { success: true, redirectTo: `/verify-email?email=${encodeURIComponent(email)}` },
    { status: 201 },
  )
}
