"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/backend/auth/session";
import { createReviewForBooking } from "@/backend/services/review-service";

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

export async function createReviewAction(formData: FormData) {
  const user = await requireAuthUser("/my-account");
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const rating = Number(formData.get("rating") ?? "0");
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!bookingId) {
    redirectWithMessage({
      error: "Invalid booking for review.",
    });
  }

  const result = await createReviewForBooking({
    bookingId,
    userId: user.id,
    rating,
    comment,
  });

  if (!result.ok) {
    redirectWithMessage({
      error: result.error,
    });
  }

  revalidatePath("/my-account");
  revalidatePath("/");
  revalidatePath("/serviceproviders");
  redirectWithMessage({
    status: "review-created",
  });
}
