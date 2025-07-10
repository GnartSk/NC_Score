import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NODE_ENV === 'production' ? 'https://nc-score.onrender.com' : 'http://localhost:3000'}/dashboard`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: credentials?.email }),
            }
          );

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const user = await res.json();
          if (user) return user;
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email || "";
      session.user.name = token.name;
      return session;
    }
  },
  pages: {
    signIn: "/auth/login"
  },
  secret: process.env.AUTH_SECRET
});

export { handler as GET, handler as POST };