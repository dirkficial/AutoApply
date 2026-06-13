import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const invalidUrl = new URL('/sign-in?error=invalid-token', req.nextUrl)

  if (!token || !email) {
    return NextResponse.redirect(invalidUrl)
  }

  const record = await db.verificationToken.findUnique({ where: { token } })

  if (!record || record.identifier !== email || record.expires < new Date()) {
    return NextResponse.redirect(invalidUrl)
  }

  await db.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

  await db.verificationToken.delete({ where: { token } })

  return NextResponse.redirect(new URL('/sign-in?verified=true', req.nextUrl))
}
