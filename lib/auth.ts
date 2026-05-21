import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { AdminRole } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import { loginSchema } from "@/lib/validations/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { admin: true },
        });

        if (!user?.admin) return null;

        const passwordValid = await bcrypt.compare(
          password,
          user.admin.passwordHash
        );

        if (!passwordValid) return null;

        await prisma.admin.update({
          where: { id: user.admin.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: AdminRole }).role ?? "VIEWER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as AdminRole) ?? "VIEWER";
      }
      return session;
    },
  },
  secret: serverEnv.NEXTAUTH_SECRET,
  debug: serverEnv.NODE_ENV === "development",
};

export function isAdminRole(
  role: AdminRole | undefined,
  allowed: AdminRole[]
): boolean {
  if (!role) return false;
  return allowed.includes(role);
}
