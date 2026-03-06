import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import { verifyPasswordHash } from "@/backend/auth/security";
import { signInSchema } from "@/backend/validations/auth";

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "development"
    ? "homeservepro-dev-auth-secret-change-me"
    : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            passwordHash: true,
            role: true,
            isActive: true,
          },
        });

        if (!user?.passwordHash || !user.isActive) {
          return null;
        }

        const isValidPassword = verifyPasswordHash(
          parsed.data.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImage,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.role = (user.role as UserRole) ?? UserRole.USER;
      }

      if (!token.role && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
          select: {
            role: true,
          },
        });

        token.role = dbUser?.role ?? UserRole.USER;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserRole) ?? UserRole.USER;
      }

      return session;
    },
  },
});
