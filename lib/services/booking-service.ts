import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AccountBookingRow = {
  id: string;
  serviceName: string;
  categoryName: string;
  providerName: string;
  location: string;
  imageUrl: string | null;
  scheduledDate: Date;
  status: BookingStatus;
  hasReview: boolean;
  createdAt: Date;
};

export type BookingMutationResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

function formatLocation(parts: Array<string | null>) {
  const value = parts.filter(Boolean).join(", ");
  return value || "Location not available";
}

export async function listBookingsForUser(userId: string): Promise<AccountBookingRow[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId: userId,
    },
    orderBy: [{ scheduledDate: "desc" }, { createdAt: "desc" }],
    include: {
      service: {
        select: {
          name: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      serviceProvider: {
        select: {
          imageUrl: true,
          addressLine1: true,
          city: true,
          state: true,
          country: true,
          user: {
            select: {
              name: true,
              profileImage: true,
            },
          },
        },
      },
      review: {
        select: {
          id: true,
        },
      },
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    serviceName: booking.service.name,
    categoryName: booking.service.category.name,
    providerName: booking.serviceProvider.user.name,
    location: formatLocation([
      booking.serviceProvider.addressLine1,
      [booking.serviceProvider.city, booking.serviceProvider.state]
        .filter(Boolean)
        .join(", "),
      booking.serviceProvider.country,
    ]),
    imageUrl: booking.serviceProvider.imageUrl ?? booking.serviceProvider.user.profileImage,
    scheduledDate: booking.scheduledDate,
    status: booking.status,
    hasReview: Boolean(booking.review),
    createdAt: booking.createdAt,
  }));
}

export async function createBookingForUser(input: {
  userId: string;
  providerId: string;
  scheduledDate: Date;
}): Promise<BookingMutationResult> {
  const provider = await prisma.serviceProvider.findFirst({
    where: {
      id: input.providerId,
      verified: true,
    },
    select: {
      id: true,
      serviceId: true,
    },
  });

  if (!provider) {
    return {
      ok: false,
      error: "Service provider not found.",
    };
  }

  if (Number.isNaN(input.scheduledDate.getTime())) {
    return {
      ok: false,
      error: "Please choose a valid appointment date.",
    };
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (input.scheduledDate.getTime() < startOfToday.getTime()) {
    return {
      ok: false,
      error: "Appointment date cannot be in the past.",
    };
  }

  await prisma.booking.create({
    data: {
      customerId: input.userId,
      serviceProviderId: provider.id,
      serviceId: provider.serviceId,
      scheduledDate: input.scheduledDate,
      status: BookingStatus.PENDING,
    },
  });

  return { ok: true };
}

export async function cancelBookingForUser(input: {
  bookingId: string;
  userId: string;
}): Promise<BookingMutationResult> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: input.bookingId,
      customerId: input.userId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!booking) {
    return {
      ok: false,
      error: "Booking not found.",
    };
  }

  if (booking.status === BookingStatus.CANCELLED) {
    return { ok: true };
  }

  if (booking.status === BookingStatus.COMPLETED) {
    return {
      ok: false,
      error: "Completed bookings cannot be cancelled.",
    };
  }

  await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: BookingStatus.CANCELLED,
    },
  });

  return { ok: true };
}

export async function deleteBookingForUser(input: {
  bookingId: string;
  userId: string;
}): Promise<BookingMutationResult> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: input.bookingId,
      customerId: input.userId,
    },
    select: {
      id: true,
      status: true,
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

  if (booking.review) {
    return {
      ok: false,
      error: "Booking with review cannot be deleted.",
    };
  }

  if (
    booking.status !== BookingStatus.CANCELLED &&
    booking.status !== BookingStatus.PENDING
  ) {
    return {
      ok: false,
      error: "Only pending or cancelled bookings can be deleted.",
    };
  }

  await prisma.booking.delete({
    where: {
      id: booking.id,
    },
  });

  return { ok: true };
}
