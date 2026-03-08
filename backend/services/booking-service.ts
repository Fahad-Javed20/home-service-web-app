import {
  BookingStatus,
  PaymentStatus,
  Prisma,
  ProviderApprovalStatus,
  Weekday,
} from "@prisma/client";
import { prisma } from "@/backend/db/prisma";

export const BOOKING_TIME_SLOTS = [
  "09:00-11:00",
  "11:00-13:00",
  "14:00-16:00",
  "16:00-18:00",
] as const;

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.IN_PROGRESS,
];

const DUPLICATE_CHECK_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.IN_PROGRESS,
  BookingStatus.COMPLETED,
];

export type AccountBookingRow = {
  id: string;
  serviceName: string;
  categoryName: string;
  providerName: string;
  location: string;
  imageUrl: string | null;
  bookingDate: Date;
  timeSlot: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
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

function normalizeDate(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isPastDate(value: Date) {
  const today = normalizeDate(new Date());
  return value.getTime() < today.getTime();
}

function weekdayFromDate(date: Date): Weekday {
  const weekdays: Weekday[] = [
    Weekday.SUNDAY,
    Weekday.MONDAY,
    Weekday.TUESDAY,
    Weekday.WEDNESDAY,
    Weekday.THURSDAY,
    Weekday.FRIDAY,
    Weekday.SATURDAY,
  ];

  return weekdays[date.getDay()] ?? Weekday.MONDAY;
}

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function listBookingsForUser(userId: string): Promise<AccountBookingRow[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
    },
    orderBy: [{ bookingDate: "desc" }, { createdAt: "desc" }],
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
      provider: {
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
    providerName: booking.provider.user.name,
    location: formatLocation([
      booking.provider.addressLine1,
      [booking.provider.city, booking.provider.state].filter(Boolean).join(", "),
      booking.provider.country,
    ]),
    imageUrl: booking.provider.imageUrl ?? booking.provider.user.profileImage,
    bookingDate: booking.bookingDate,
    timeSlot: booking.timeSlot,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    hasReview: Boolean(booking.review),
    createdAt: booking.createdAt,
  }));
}

export async function createBookingForUser(input: {
  userId: string;
  providerId: string;
  bookingDate: Date;
  timeSlot: string;
}): Promise<BookingMutationResult> {
  if (Number.isNaN(input.bookingDate.getTime())) {
    return {
      ok: false,
      error: "Please choose a valid appointment date.",
    };
  }

  const bookingDate = normalizeDate(input.bookingDate);
  const timeSlot = input.timeSlot.trim();

  if (!BOOKING_TIME_SLOTS.includes(timeSlot as (typeof BOOKING_TIME_SLOTS)[number])) {
    return {
      ok: false,
      error: "Please choose a valid time slot.",
    };
  }

  if (isPastDate(bookingDate)) {
    return {
      ok: false,
      error: "Appointment date cannot be in the past.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!user?.isActive) {
    return {
      ok: false,
      error: "Your session is no longer valid. Please sign in again.",
    };
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: {
      id: input.providerId,
    },
    select: {
      id: true,
      approvalStatus: true,
      providerServices: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        take: 1,
        select: {
          serviceId: true,
        },
      },
    },
  });

  if (!provider || provider.approvalStatus !== ProviderApprovalStatus.APPROVED) {
    return {
      ok: false,
      error: "Service provider not found or not approved yet.",
    };
  }

  const selectedServiceId = provider.providerServices[0]?.serviceId;
  if (!selectedServiceId) {
    return {
      ok: false,
      error: "This provider has no active service assignment.",
    };
  }

  const slotDay = weekdayFromDate(bookingDate);

  const availability = await prisma.availabilitySlot.findUnique({
    where: {
      providerId_dayOfWeek_timeSlot: {
        providerId: provider.id,
        dayOfWeek: slotDay,
        timeSlot,
      },
    },
    select: {
      isAvailable: true,
    },
  });

  if (!availability?.isAvailable) {
    return {
      ok: false,
      error: "Provider is not available in the selected date and time slot.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const providerSlotConflict = await tx.booking.findFirst({
        where: {
          providerId: provider.id,
          bookingDate,
          timeSlot,
          status: {
            in: ACTIVE_BOOKING_STATUSES,
          },
        },
        select: {
          id: true,
        },
      });

      if (providerSlotConflict) {
        throw new Error("provider_slot_taken");
      }

      const duplicateUserBooking = await tx.booking.findFirst({
        where: {
          userId: input.userId,
          providerId: provider.id,
          bookingDate,
          timeSlot,
          status: {
            in: DUPLICATE_CHECK_STATUSES,
          },
        },
        select: {
          id: true,
        },
      });

      if (duplicateUserBooking) {
        throw new Error("duplicate_user_booking");
      }

      await tx.booking.create({
        data: {
          userId: input.userId,
          providerId: provider.id,
          serviceId: selectedServiceId,
          bookingDate,
          timeSlot,
          status: BookingStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
        },
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "provider_slot_taken") {
        return {
          ok: false,
          error: "This provider is already booked for the selected slot.",
        };
      }

      if (error.message === "duplicate_user_booking") {
        return {
          ok: false,
          error: "You already booked this provider for the selected slot.",
        };
      }
    }

    if (isUniqueViolation(error)) {
      return {
        ok: false,
        error: "Booking conflict detected. Please select another slot.",
      };
    }

    throw error;
  }

  return { ok: true };
}

export async function cancelBookingForUser(input: {
  bookingId: string;
  userId: string;
}): Promise<BookingMutationResult> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: input.bookingId,
      userId: input.userId,
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
      userId: input.userId,
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
