"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createService,
  deleteService,
  updateService,
} from "@/backend/services/service-admin";
import { requireAdminUser } from "@/backend/auth/session";

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

function readNumber(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return Number.NaN;
  }

  return Number(value);
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
  const target = query ? `/admin/services?${query}` : "/admin/services";

  redirect(target);
}

function revalidateServicePaths() {
  revalidatePath("/admin/services");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/serviceproviders");
}

export async function createServiceAction(formData: FormData) {
  await requireAdminUser("/admin/services");

  const result = await createService({
    name: readRequiredString(formData, "name"),
    description: readOptionalString(formData, "description"),
    basePrice: readNumber(formData, "basePrice"),
    categoryId: readRequiredString(formData, "categoryId"),
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateServicePaths();
  redirectWithMessage({ status: "service-created" });
}

export async function updateServiceAction(formData: FormData) {
  await requireAdminUser("/admin/services");

  const result = await updateService({
    id: readRequiredString(formData, "serviceId"),
    name: readRequiredString(formData, "name"),
    description: readOptionalString(formData, "description"),
    basePrice: readNumber(formData, "basePrice"),
    categoryId: readRequiredString(formData, "categoryId"),
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateServicePaths();
  redirectWithMessage({ status: "service-updated" });
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdminUser("/admin/services");

  const result = await deleteService(readRequiredString(formData, "serviceId"));

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateServicePaths();
  redirectWithMessage({ status: "service-deleted" });
}
