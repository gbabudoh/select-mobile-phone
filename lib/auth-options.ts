import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("[AUTH] Missing email or password");
            return null;
          }

          const email = credentials.email.trim();
          const password = credentials.password;

          console.log(`[AUTH] Attempting login for: ${email}`);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log(`[AUTH] User not found in DB: ${email}`);
            return null;
          }

          console.log(`[AUTH] User found: ${user.email}, Role: ${user.role}`);
          console.log(`[AUTH] Comparing passwords...`);

          const valid = await bcrypt.compare(password, user.password);
          
          if (!valid) {
            console.log(`[AUTH] Password comparison failed for: ${email}`);
            return null;
          }

          console.log(`[AUTH] Password match successful for: ${email}`);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          console.error(`[AUTH] CRITICAL ERROR during authorize:`, err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "BUYER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "BUYER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Required for Next.js 15+ App Router — trusts the Host header so
  // internal session fetches from client components are not rejected.
  trustHost: true,
};
