import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { normalizeRedirectPath } from "@/backend/auth/role-routes";

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

  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role ?? UserRole.USER,
    profileImage: session.user.image ?? null,
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
