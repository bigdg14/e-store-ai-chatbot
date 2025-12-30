import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a demo authentication
        // In production, you would validate against a real database
        if (
          credentials?.email === "demo@example.com" &&
          credentials?.password === "demo123"
        ) {
          return {
            id: "1",
            email: "demo@example.com",
            name: "Demo User",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
