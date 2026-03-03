"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBookingForUser } from "@/lib/services/booking-service";
import { requireAuthUser } from "@/lib/server/auth";

function sanitizeRedirectPath(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function redirectWithMessage(payload: {
  redirectPath: string;
  status?: string;
  error?: string;
}) {
  const params = new URLSearchParams();
  if (payload.status) {
    params.set("status", payload.status);
  }

  if (payload.error) {
    params.set("error", payload.error);
  }

  const targetPath = sanitizeRedirectPath(payload.redirectPath);
  const query = params.toString();
  const target = query ? `${targetPath}?${query}` : targetPath;
  redirect(target);
}

export async function createBookingAction(formData: FormData) {
  const providerId = String(formData.get("providerId") ?? "").trim();
  const scheduledDateInput = String(formData.get("scheduledDate") ?? "").trim();
  const redirectPath = sanitizeRedirectPath(
    String(formData.get("redirectPath") ?? "")
  );

  if (!providerId) {
    redirectWithMessage({
      redirectPath,
      error: "Provider is required.",
    });
  }

  if (!scheduledDateInput) {
    redirectWithMessage({
      redirectPath,
      error: "Please choose an appointment date.",
    });
  }

  const user = await requireAuthUser(redirectPath);
  const scheduledDate = new Date(`${scheduledDateInput}T10:00:00`);

  const result = await createBookingForUser({
    userId: user.id,
    providerId,
    scheduledDate,
  });

  if (!result.ok) {
    redirectWithMessage({
      redirectPath,
      error: result.error,
    });
  }

  revalidatePath("/my-account");
  revalidatePath("/serviceproviders");
  revalidatePath(redirectPath);

  redirect("/my-account?status=booking-created");
}
