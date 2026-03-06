import { BookingStatus } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";

export type ReviewMutationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createReviewForBooking(input: {
  bookingId: string;
  userId: string;
  rating: number;
  comment: string | null;
}): Promise<ReviewMutationResult> {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return {
      ok: false,
      error: "Rating must be between 1 and 5.",
    };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: input.bookingId,
      userId: input.userId,
    },
    select: {
      id: true,
      status: true,
      providerId: true,
      serviceId: true,
      review: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!booking) {
    return {
      ok: false,
      error: "Booking not found.",
    };
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    return {
      ok: false,
      error: "Only completed bookings can be reviewed.",
    };
  }

  if (booking.review) {
    return {
      ok: false,
      error: "You already submitted a review for this booking.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        bookingId: booking.id,
        userId: input.userId,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
        rating: input.rating,
        comment: input.comment?.trim() || null,
      },
    });

    const aggregate = await tx.review.aggregate({
      where: {
        providerId: booking.providerId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    await tx.serviceProvider.update({
      where: {
        id: booking.providerId,
      },
      data: {
        rating: aggregate._avg.rating ?? 0,
        totalReviews: aggregate._count._all,
      },
    });
  });

  return { ok: true };
}
