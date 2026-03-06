"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBookingForUser } from "@/backend/services/booking-service";
import { requireAuthUser } from "@/backend/auth/session";
import { normalizeRedirectPath } from "@/backend/auth/role-routes";

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

  const targetPath = normalizeRedirectPath(payload.redirectPath);
  const query = params.toString();
  const target = query ? `${targetPath}?${query}` : targetPath;
  redirect(target);
}

export async function createBookingAction(formData: FormData) {
  const providerId = String(formData.get("providerId") ?? "").trim();
  const bookingDateInput = String(formData.get("bookingDate") ?? "").trim();
  const timeSlot = String(formData.get("timeSlot") ?? "").trim();
  const redirectPath = normalizeRedirectPath(
    String(formData.get("redirectPath") ?? "")
  );

  if (!providerId) {
    redirectWithMessage({
      redirectPath,
      error: "Provider is required.",
    });
  }

  if (!bookingDateInput) {
    redirectWithMessage({
      redirectPath,
      error: "Please choose an appointment date.",
    });
  }

  if (!timeSlot) {
    redirectWithMessage({
      redirectPath,
      error: "Please choose a time slot.",
    });
  }

  const user = await requireAuthUser(redirectPath);
  const bookingDate = new Date(`${bookingDateInput}T00:00:00`);

  const result = await createBookingForUser({
    userId: user.id,
    providerId,
    bookingDate,
    timeSlot,
  });

  if (!result.ok) {
    redirectWithMessage({
      redirectPath,
      error: result.error,
    });
  }

  revalidatePath("/my-account");
  revalidatePath("/dashboard");
  revalidatePath("/serviceproviders");
  revalidatePath(redirectPath);

  redirect("/my-account?status=booking-created");
}
