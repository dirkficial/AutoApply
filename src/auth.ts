import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import authConfig from './auth.config'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: { signIn: '/sign-in' },
  ...authConfig,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        )

        return valid ? user : null
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // OAuth users are pre-verified by their provider — mark them immediately
      const u = user as { emailVerified?: Date | null; id?: string }
      if (account?.provider !== 'credentials' && !u.emailVerified) {
        await db.user.update({
          where: { id: u.id as string },
          data: { emailVerified: new Date() },
        })
        u.emailVerified = new Date()
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.emailVerified = (user as { emailVerified?: Date | null }).emailVerified ?? null
      }
      return token
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      if ('emailVerified' in token) {
        session.user.emailVerified = token.emailVerified as Date | null
      }
      return session
    },
  },
})
