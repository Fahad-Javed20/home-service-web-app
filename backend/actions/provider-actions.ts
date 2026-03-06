"use server";

import { BookingStatus, Weekday } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProviderUser } from "@/backend/auth/session";
import {
  removeAvailabilitySlotForProvider,
  updateBookingStatusByProvider,
  upsertAvailabilitySlotForProvider,
} from "@/backend/services/provider-dashboard";

function redirectWithMessage(payload: { status?: string; error?: string }) {
  const params = new URLSearchParams();

  if (payload.status) {
    params.set("status", payload.status);
  }

  if (payload.error) {
    params.set("error", payload.error);
  }

  const query = params.toString();
  const target = query ? `/providers/dashboard?${query}` : "/providers/dashboard";
  redirect(target);
}

export async function upsertAvailabilitySlotAction(formData: FormData) {
  const user = await requireProviderUser("/providers/dashboard");

  const dayOfWeekRaw = String(formData.get("dayOfWeek") ?? "").trim();
  const timeSlot = String(formData.get("timeSlot") ?? "").trim();
  const isAvailable = formData.get("isAvailable") === "on";

  if (!dayOfWeekRaw || !timeSlot) {
    redirectWithMessage({
      error: "Day and time slot are required.",
    });
  }

  const dayOfWeek = dayOfWeekRaw as Weekday;
  const validDays = new Set(Object.values(Weekday));

  if (!validDays.has(dayOfWeek)) {
    redirectWithMessage({
      error: "Invalid day of week.",
    });
  }

  const result = await upsertAvailabilitySlotForProvider({
    userId: user.id,
    dayOfWeek,
    timeSlot,
    isAvailable,
  });

  if (!result.ok) {
    redirectWithMessage({
      error: result.error,
    });
  }

  revalidatePath("/providers/dashboard");
  redirectWithMessage({
    status: "availability-updated",
  });
}

export async function removeAvailabilitySlotAction(formData: FormData) {
  const user = await requireProviderUser("/providers/dashboard");
  const slotId = String(formData.get("slotId") ?? "").trim();

  if (!slotId) {
    redirectWithMessage({
      error: "Invalid availability slot.",
    });
  }

  const result = await removeAvailabilitySlotForProvider({
    userId: user.id,
    slotId,
  });

  if (!result.ok) {
    redirectWithMessage({
      error: result.error,
    });
  }

  revalidatePath("/providers/dashboard");
  redirectWithMessage({
    status: "availability-removed",
  });
}

export async function updateProviderBookingStatusAction(formData: FormData) {
  const user = await requireProviderUser("/providers/dashboard");
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();

  if (!bookingId || !statusRaw) {
    redirectWithMessage({
      error: "Booking id and status are required.",
    });
  }

  const allowedStatuses = new Set<BookingStatus>([
    BookingStatus.CONFIRMED,
    BookingStatus.REJECTED,
    BookingStatus.COMPLETED,
  ]);

  const status = statusRaw as BookingStatus;
  if (!allowedStatuses.has(status)) {
    redirectWithMessage({
      error: "Invalid booking status update.",
    });
  }

  const result = await updateBookingStatusByProvider({
    userId: user.id,
    bookingId,
    status,
  });

  if (!result.ok) {
    redirectWithMessage({
      error: result.error,
    });
  }

  revalidatePath("/providers/dashboard");
  revalidatePath("/my-account");
  redirectWithMessage({
    status: "booking-updated",
  });
}
