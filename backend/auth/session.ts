import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { normalizeRedirectPath } from "@/backend/auth/role-routes";
import { prisma } from "@/backend/db/prisma";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
};

function authPath(redirectPath: string, error?: string) {
  const params = new URLSearchParams();
  params.set("mode", "signin");
  params.set("redirect", normalizeRedirectPath(redirectPath));

  if (error) {
    params.set("error", error);
  }

  return `/auth?${params.toString()}`;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      isActive: true,
    },
  });

  if (!dbUser || !dbUser.isActive) {
    return null;
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role ?? UserRole.USER,
    profileImage: dbUser.profileImage ?? null,
  };
}

export async function requireAuthUser(redirectPath: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authPath(redirectPath, "Please sign in to continue."));
  }

  return user;
}

export async function requireAdminUser(redirectPath: string) {
  const user = await requireAuthUser(redirectPath);
  if (user.role !== UserRole.ADMIN) {
    redirect(authPath("/", "Only admin users can access this page."));
  }

  return user;
}

export async function requireProviderUser(redirectPath: string) {
  const user = await requireAuthUser(redirectPath);
  if (user.role !== UserRole.SERVICE_PROVIDER) {
    redirect(authPath("/", "Only service providers can access this page."));
  }

  return user;
}
