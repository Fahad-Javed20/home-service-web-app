"use server";

import { AuthError } from "next-auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/backend/db/prisma";
import { createPasswordHash } from "@/backend/auth/security";
import {
  getDashboardPathByRole,
  normalizeRedirectPath,
} from "@/backend/auth/role-routes";
import { signInSchema, signUpSchema } from "@/backend/validations/auth";
import { signIn, signOut } from "@/auth";

function redirectToAuth(payload: {
  mode: "signin" | "signup";
  redirectPath: string;
  error: string;
}): never {
  const params = new URLSearchParams();
  params.set("mode", payload.mode);
  params.set("redirect", normalizeRedirectPath(payload.redirectPath));
  params.set("error", payload.error);
  redirect(`/auth?${params.toString()}`);
}

function roleFromAccountType(accountType: "user" | "provider") {
  return accountType === "provider" ? UserRole.SERVICE_PROVIDER : UserRole.USER;
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    accountType: formData.get("accountType"),
    redirectPath: formData.get("redirectPath"),
  });

  if (!parsed.success) {
    redirectToAuth({
      mode: "signup",
      redirectPath: String(formData.get("redirectPath") ?? "/"),
      error: parsed.error.issues[0]?.message ?? "Please check your form input.",
    });
  }

  const redirectPath = normalizeRedirectPath(parsed.data.redirectPath);
  const email = parsed.data.email;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    redirectToAuth({
      mode: "signup",
      redirectPath,
      error: "An account with this email already exists.",
    });
  }

  const role = roleFromAccountType(parsed.data.accountType);
  const passwordHash = createPasswordHash(parsed.data.password);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: parsed.data.name,
        email,
        role,
        passwordHash,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (role === UserRole.SERVICE_PROVIDER) {
      await tx.serviceProvider.create({
        data: {
          userId: user.id,
          approvalStatus: "PENDING",
        },
      });
    }
  });

  const defaultRedirect = getDashboardPathByRole(role);
  const targetPath = redirectPath !== "/" ? redirectPath : defaultRedirect;

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: targetPath,
  });
}

export async function signInAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectPath: formData.get("redirectPath"),
  });

  if (!parsed.success) {
    redirectToAuth({
      mode: "signin",
      redirectPath: String(formData.get("redirectPath") ?? "/"),
      error: parsed.error.issues[0]?.message ?? "Please check your credentials.",
    });
  }

  const redirectPath = normalizeRedirectPath(parsed.data.redirectPath);

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
    select: {
      role: true,
      isActive: true,
    },
  });

  if (!user?.isActive) {
    redirectToAuth({
      mode: "signin",
      redirectPath,
      error: "Account is disabled or does not exist.",
    });
  }

  const defaultRedirect = getDashboardPathByRole(user.role);
  const targetPath = redirectPath !== "/" ? redirectPath : defaultRedirect;

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: targetPath,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirectToAuth({
        mode: "signin",
        redirectPath,
        error: "Invalid email or password.",
      });
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/",
  });
}
