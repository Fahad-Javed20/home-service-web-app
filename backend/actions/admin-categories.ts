"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/backend/auth/session";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/backend/services/service-admin";

function readRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function redirectWithMessage(payload: { status?: string; error?: string }) {
  const params = new URLSearchParams();

  if (payload.status) {
    params.set("status", payload.status);
  }

  if (payload.error) {
    params.set("error", payload.error);
  }

  const query = params.toString();
  const target = query ? `/admin/categories?${query}` : "/admin/categories";

  redirect(target);
}

function revalidateCategoryPaths() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/services");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/serviceproviders");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdminUser("/admin/categories");

  const result = await createCategory({
    name: readRequiredString(formData, "name"),
    description: readOptionalString(formData, "description"),
    icon: readOptionalString(formData, "icon"),
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateCategoryPaths();
  redirectWithMessage({ status: "category-created" });
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdminUser("/admin/categories");

  const result = await updateCategory({
    categoryId: readRequiredString(formData, "categoryId"),
    name: readRequiredString(formData, "name"),
    description: readOptionalString(formData, "description"),
    icon: readOptionalString(formData, "icon"),
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateCategoryPaths();
  redirectWithMessage({ status: "category-updated" });
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdminUser("/admin/categories");

  const result = await deleteCategory(readRequiredString(formData, "categoryId"));

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateCategoryPaths();
  redirectWithMessage({ status: "category-deleted" });
}
