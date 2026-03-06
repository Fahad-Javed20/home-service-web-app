"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  cancelBookingForUser,
  deleteBookingForUser,
} from "@/backend/services/booking-service";
import { requireAuthUser } from "@/backend/auth/session";

function redirectWithMessage(payload: { status?: string; error?: string }) {
  const params = new URLSearchParams();

  if (payload.status) {
    params.set("status", payload.status);
  }

  if (payload.error) {
    params.set("error", payload.error);
  }

  const query = params.toString();
  const target = query ? `/my-account?${query}` : "/my-account";
  redirect(target);
}

export async function cancelBookingAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") ?? "").trim();

  if (!bookingId) {
    redirectWithMessage({ error: "Invalid booking." });
  }

  const user = await requireAuthUser("/my-account");
  const result = await cancelBookingForUser({
    bookingId,
    userId: user.id,
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidatePath("/my-account");
  revalidatePath("/dashboard");
  redirectWithMessage({ status: "booking-cancelled" });
}

export async function deleteBookingAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") ?? "").trim();

  if (!bookingId) {
    redirectWithMessage({ error: "Invalid booking." });
  }

  const user = await requireAuthUser("/my-account");
  const result = await deleteBookingForUser({
    bookingId,
    userId: user.id,
  });

  if (!result.ok) {
    redirectWithMessage({ error: result.error });
  }

  revalidatePath("/my-account");
  revalidatePath("/dashboard");
  redirectWithMessage({ status: "booking-deleted" });
}
