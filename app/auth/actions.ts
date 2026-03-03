"use server";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createPasswordHash, verifyPasswordHash } from "@/lib/server/security";
import { createSession, signOutSession } from "@/lib/server/auth";

function sanitizeRedirectPath(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirectToAuth(payload: {
  mode: "signin" | "signup";
  redirectPath: string;
  error: string;
}): never {
  const params = new URLSearchParams();
  params.set("mode", payload.mode);
  params.set("redirect", sanitizeRedirectPath(payload.redirectPath));
  params.set("error", payload.error);
  redirect(`/auth?${params.toString()}`);
}

export async function signUpAction(formData: FormData) {
  const redirectPath = sanitizeRedirectPath(normalizeString(formData.get("redirectPath")));
  const name = normalizeString(formData.get("name"));
  const email = normalizeEmail(normalizeString(formData.get("email")));
  const password = normalizeString(formData.get("password"));
  const confirmPassword = normalizeString(formData.get("confirmPassword"));

  if (!name || !email || !password || !confirmPassword) {
    redirectToAuth({
      mode: "signup",
      redirectPath,
      error: "All fields are required.",
    });
  }

  if (!email.includes("@")) {
    redirectToAuth({
      mode: "signup",
      redirectPath,
      error: "Please enter a valid email address.",
    });
  }

  if (password.length < 8) {
    redirectToAuth({
      mode: "signup",
      redirectPath,
      error: "Password must be at least 8 characters.",
    });
  }

  if (password !== confirmPassword) {
    redirectToAuth({
      mode: "signup",
      redirectPath,
      error: "Passwords do not match.",
    });
  }

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

  const adminCount = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  const newUserRole = adminCount === 0 ? UserRole.ADMIN : UserRole.CUSTOMER;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role: newUserRole,
      passwordHash: createPasswordHash(password),
    },
    select: {
      id: true,
    },
  });

  await createSession(user.id);
  redirect(redirectPath);
}

export async function signInAction(formData: FormData) {
  const redirectPath = sanitizeRedirectPath(normalizeString(formData.get("redirectPath")));
  const email = normalizeEmail(normalizeString(formData.get("email")));
  const password = normalizeString(formData.get("password"));

  if (!email || !password) {
    redirectToAuth({
      mode: "signin",
      redirectPath,
      error: "Email and password are required.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash) {
    redirectToAuth({
      mode: "signin",
      redirectPath,
      error: "Invalid email or password.",
    });
  }

  const isValidPassword = verifyPasswordHash(password, user.passwordHash);

  if (!isValidPassword) {
    redirectToAuth({
      mode: "signin",
      redirectPath,
      error: "Invalid email or password.",
    });
  }

  await createSession(user.id);
  redirect(redirectPath);
}

export async function logoutAction() {
  await signOutSession();
  redirect("/");
}
