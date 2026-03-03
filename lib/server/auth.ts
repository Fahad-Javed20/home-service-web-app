import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionToken, createTokenHash } from "@/lib/server/security";

const SESSION_COOKIE_NAME = "homeserve_session";
const SESSION_MAX_AGE_DAYS = 30;

function sanitizeRedirectPath(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function authPath(redirectPath: string, error?: string) {
  const params = new URLSearchParams();
  params.set("redirect", sanitizeRedirectPath(redirectPath));

  if (error) {
    params.set("error", error);
  }

  return `/auth?${params.toString()}`;
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function createSession(userId: string) {
  const token = createSessionToken();
  const tokenHash = createTokenHash(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  await setSessionCookie(token, expiresAt);
}

export async function signOutSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: createTokenHash(token),
      },
    });
  }

  await clearSessionCookie();
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = createTokenHash(token);
  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          profileImage: true,
        },
      },
    },
  });

  if (!session) {
    await clearSessionCookie();
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    await clearSessionCookie();
    return null;
  }

  return session.user;
}

export async function requireAuthUser(redirectPath: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authPath(redirectPath, "Please sign in to continue."));
  }
  return user;
}

export async function requireAdminUser(redirectPath: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authPath(redirectPath, "Please sign in as admin."));
  }

  if (user.role !== UserRole.ADMIN) {
    redirect(authPath("/", "Only admin users can access this page."));
  }

  return user;
}
