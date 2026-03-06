"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/backend/auth/session";
import {
  deleteUserForAdmin,
  updateUserForAdmin,
} from "@/backend/services/user-admin";

function redirectWithMessage(payload: { status?: string; error?: string }) {
  const params = new URLSearchParams();
  if (payload.status) {
    params.set("status", payload.status);
  }
  if (payload.error) {
    params.set("error", payload.error);
  }

  const query = params.toString();
  const target = query ? `/admin/users?${query}` : "/admin/users";
  redirect(target);
}

export async function updateUserAction(formData: FormData) {
  await requireAdminUser("/admin/users");

  const userId = String(formData.get("userId") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!userId) {
    redirectWithMessage({ error: "Invalid user id." });
  }

  const role = roleRaw as UserRole;
  const validRoles = new Set(Object.values(UserRole));

  if (!validRoles.has(role)) {
    redirectWithMessage({ error: "Invalid role." });
  }

  const result = await updateUserForAdmin({
    userId,
    role,
    isActive,
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirectWithMessage({ status: "user-updated" });
}

export async function deleteUserAction(formData: FormData) {
  await requireAdminUser("/admin/users");

  const userId = String(formData.get("userId") ?? "").trim();
  if (!userId) {
    redirectWithMessage({ error: "Invalid user id." });
  }

  const result = await deleteUserForAdmin(userId);
  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirectWithMessage({ status: "user-deleted" });
}
