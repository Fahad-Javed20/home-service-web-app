import {
  BookingStatus,
  ProviderApprovalStatus,
  Weekday,
} from "@prisma/client";
import { prisma } from "@/backend/db/prisma";

export type ProviderDashboardData = {
  providerId: string;
  providerName: string;
  approvalStatus: ProviderApprovalStatus;
  rating: number;
  totalReviews: number;
  jobsCompleted: number;
  upcomingBookings: Array<{
    id: string;
    bookingDate: Date;
    timeSlot: string;
    status: BookingStatus;
    serviceName: string;
    customerName: string;
    notes: string | null;
  }>;
  completedBookings: Array<{
    id: string;
    bookingDate: Date;
    timeSlot: string;
    serviceName: string;
    customerName: string;
  }>;
  availabilitySlots: Array<{
    id: string;
    dayOfWeek: Weekday;
    timeSlot: string;
    isAvailable: boolean;
  }>;
};

function normalizeDate(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function providerByUserId(userId: string) {
  return prisma.serviceProvider.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      approvalStatus: true,
      rating: true,
      totalReviews: true,
      jobsCompleted: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getProviderDashboardData(
  userId: string
): Promise<ProviderDashboardData | null> {
  const provider = await providerByUserId(userId);
  if (!provider) {
    return null;
  }

  const today = normalizeDate(new Date());

  const [upcomingBookings, completedBookings, availabilitySlots] = await Promise.all([
    prisma.booking.findMany({
      where: {
        providerId: provider.id,
        bookingDate: {
          gte: today,
        },
      },
      orderBy: [{ bookingDate: "asc" }, { timeSlot: "asc" }],
      take: 20,
      include: {
        service: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        providerId: provider.id,
        status: BookingStatus.COMPLETED,
      },
      orderBy: [{ bookingDate: "desc" }],
      take: 10,
      include: {
        service: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.availabilitySlot.findMany({
      where: {
        providerId: provider.id,
      },
      orderBy: [{ dayOfWeek: "asc" }, { timeSlot: "asc" }],
    }),
  ]);

  return {
    providerId: provider.id,
    providerName: provider.user.name,
    approvalStatus: provider.approvalStatus,
    rating: provider.rating,
    totalReviews: provider.totalReviews,
    jobsCompleted: provider.jobsCompleted,
    upcomingBookings: upcomingBookings.map((booking) => ({
      id: booking.id,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      status: booking.status,
      serviceName: booking.service.name,
      customerName: booking.customer.name,
      notes: booking.notes,
    })),
    completedBookings: completedBookings.map((booking) => ({
      id: booking.id,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      serviceName: booking.service.name,
      customerName: booking.customer.name,
    })),
    availabilitySlots: availabilitySlots.map((slot) => ({
      id: slot.id,
      dayOfWeek: slot.dayOfWeek,
      timeSlot: slot.timeSlot,
      isAvailable: slot.isAvailable,
    })),
  };
}

export async function upsertAvailabilitySlotForProvider(input: {
  userId: string;
  dayOfWeek: Weekday;
  timeSlot: string;
  isAvailable: boolean;
}) {
  const provider = await providerByUserId(input.userId);
  if (!provider) {
    return {
      ok: false as const,
      error: "Provider profile not found.",
    };
  }

  await prisma.availabilitySlot.upsert({
    where: {
      providerId_dayOfWeek_timeSlot: {
        providerId: provider.id,
        dayOfWeek: input.dayOfWeek,
        timeSlot: input.timeSlot.trim(),
      },
    },
    update: {
      isAvailable: input.isAvailable,
    },
    create: {
      providerId: provider.id,
      dayOfWeek: input.dayOfWeek,
      timeSlot: input.timeSlot.trim(),
      isAvailable: input.isAvailable,
    },
  });

  return { ok: true as const };
}

export async function removeAvailabilitySlotForProvider(input: {
  userId: string;
  slotId: string;
}) {
  const provider = await providerByUserId(input.userId);
  if (!provider) {
    return {
      ok: false as const,
      error: "Provider profile not found.",
    };
  }

  const slot = await prisma.availabilitySlot.findFirst({
    where: {
      id: input.slotId,
      providerId: provider.id,
    },
    select: {
      id: true,
    },
  });

  if (!slot) {
    return {
      ok: false as const,
      error: "Availability slot not found.",
    };
  }

  await prisma.availabilitySlot.delete({
    where: {
      id: slot.id,
    },
  });

  return { ok: true as const };
}

export async function updateBookingStatusByProvider(input: {
  userId: string;
  bookingId: string;
  status: BookingStatus;
}) {
  const provider = await providerByUserId(input.userId);
  if (!provider) {
    return {
      ok: false as const,
      error: "Provider profile not found.",
    };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: input.bookingId,
      providerId: provider.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!booking) {
    return {
      ok: false as const,
      error: "Booking not found.",
    };
  }

  if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.REJECTED) {
    return {
      ok: false as const,
      error: "Cancelled or rejected bookings cannot be updated.",
    };
  }

  await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: input.status,
      ...(input.status === BookingStatus.COMPLETED
        ? {
            completedAt: new Date(),
          }
        : {}),
    },
  });

  return { ok: true as const };
}
