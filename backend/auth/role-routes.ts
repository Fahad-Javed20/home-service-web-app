import { UserRole } from "@prisma/client";

export function getDashboardPathByRole(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin";
    case UserRole.SERVICE_PROVIDER:
      return "/providers/dashboard";
    case UserRole.USER:
    default:
      return "/dashboard";
  }
}

export function normalizeRedirectPath(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}
