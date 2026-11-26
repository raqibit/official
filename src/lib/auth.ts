import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// ─────────────────────────────────────────────────────────────────────────────
// NextAuth v5 config — simple single-owner credentials auth
// Only the portfolio owner (you) can log into /admin
// ─────────────────────────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Admin Password',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const password = credentials?.password as string
        if (!password || !process.env.ADMIN_PASSWORD) return null

        // Constant-time comparison to prevent timing attacks
        const isValid =
          password.length === process.env.ADMIN_PASSWORD.length &&
          password === process.env.ADMIN_PASSWORD

        if (!isValid) return null

        return {
          id: 'admin',
          name: 'Raqīb Ismāʿīl',
          email: process.env.OWNER_EMAIL || 'admin@raqibit.io',
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
  },
})
