import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Demo Login",
      credentials: {},
      async authorize() {
        if (process.env.NODE_ENV !== "production") {
          let user = await prisma.user.findUnique({ where: { email: "demo@example.com" } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "Demo Hero",
                email: "demo@example.com",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
              },
            });
          }
          return user;
        }
        return null; // Production blocks demo login
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
