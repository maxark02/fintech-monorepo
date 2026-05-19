import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getSupabaseAdmin } from "./src/lib/supabaseServer";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mode: { label: "Mode", type: "text" }, // login or register
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const username = String(credentials.username ?? "User");
        const email = String(credentials.email);
        const password = String(credentials.password);
        const mode = String(credentials.mode ?? "login");

        if (password.length < 6) return null;

        if (mode === "register") {
          const { data, error } =
            await getSupabaseAdmin().auth.admin.createUser({
              email,
              password,
              user_metadata: { username },
              email_confirm: true,
            });

          if (error || !data.user) return null;

          return {
            id: data.user.id,
            email: data.user.email,
            name: username,
          };
        }

        const { data, error } =
          await getSupabaseAdmin().auth.signInWithPassword({
            email,
            password,
          });

        if (error || !data.user) return null;

        return {
          id: data.user.id,
          email: data.user.email ?? email,
          name: data.user.user_metadata?.username ?? email.split("@")[0],
        };
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
      if (user) token.id = user.id;
      token.name = user.name;
      return token;
    },
    session({ session, token }) {
      if (token) session.user.id = String(token.id);
      return session;
    },
  },
});
