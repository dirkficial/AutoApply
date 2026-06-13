import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export const proxy = auth(function proxy(req) {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isDashboard = nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/sign-in', nextUrl))
  }

  if (isDashboard && isLoggedIn && !req.auth?.user?.emailVerified) {
    return Response.redirect(new URL('/verify-email', nextUrl))
  }
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
