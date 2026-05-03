import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

export default {
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // No-op placeholder — real validation is in auth.ts (Node.js only)
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig
