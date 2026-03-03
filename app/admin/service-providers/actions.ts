"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createProvider,
  deleteProvider,
  updateProvider,
} from "@/lib/services/provider-admin";
import { requireAdminUser } from "@/lib/server/auth";

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

function readOptionalNumber(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
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
  const target = query
    ? `/admin/service-providers?${query}`
    : "/admin/service-providers";

  redirect(target);
}

function revalidateProviderPaths() {
  revalidatePath("/admin/service-providers");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/serviceproviders");
}

export async function createProviderAction(formData: FormData) {
  await requireAdminUser("/admin/service-providers");

  const result = await createProvider({
    userName: readRequiredString(formData, "userName"),
    userEmail: readRequiredString(formData, "userEmail"),
    phone: readOptionalString(formData, "phone"),
    profileImage: readOptionalString(formData, "profileImage"),
    serviceId: readRequiredString(formData, "serviceId"),
    bio: readOptionalString(formData, "bio"),
    imageUrl: readOptionalString(formData, "imageUrl"),
    addressLine1: readOptionalString(formData, "addressLine1"),
    city: readOptionalString(formData, "city"),
    state: readOptionalString(formData, "state"),
    country: readOptionalString(formData, "country"),
    yearsOfExperience: readOptionalNumber(formData, "yearsOfExperience"),
    verified: readBoolean(formData, "verified"),
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateProviderPaths();
  redirectWithMessage({ status: "provider-created" });
}

export async function updateProviderAction(formData: FormData) {
  await requireAdminUser("/admin/service-providers");

  const result = await updateProvider({
    providerId: readRequiredString(formData, "providerId"),
    userName: readRequiredString(formData, "userName"),
    userEmail: readRequiredString(formData, "userEmail"),
    phone: readOptionalString(formData, "phone"),
    profileImage: readOptionalString(formData, "profileImage"),
    serviceId: readRequiredString(formData, "serviceId"),
    bio: readOptionalString(formData, "bio"),
    imageUrl: readOptionalString(formData, "imageUrl"),
    addressLine1: readOptionalString(formData, "addressLine1"),
    city: readOptionalString(formData, "city"),
    state: readOptionalString(formData, "state"),
    country: readOptionalString(formData, "country"),
    yearsOfExperience: readOptionalNumber(formData, "yearsOfExperience"),
    verified: readBoolean(formData, "verified"),
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateProviderPaths();
  redirectWithMessage({ status: "provider-updated" });
}

export async function deleteProviderAction(formData: FormData) {
  await requireAdminUser("/admin/service-providers");

  const result = await deleteProvider(readRequiredString(formData, "providerId"));

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidateProviderPaths();
  redirectWithMessage({ status: "provider-deleted" });
}
