import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // мок — потом заменишь на реальный запрос
        if (!credentials?.email || !credentials?.password) return null
        
        if (String(credentials.password).length < 6) return null

        return {
          id: "1",
          email: String(credentials.email),
          name: String(credentials.email).split("@")[0],
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token) session.user.id = String(token.id)
      return session
    },
  },
})
