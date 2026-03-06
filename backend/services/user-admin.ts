import { UserRole } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  bookingsCount: number;
  reviewsCount: number;
  createdAt: Date;
};

export type UserMutationResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeText(value: string) {
  return value.trim();
}

export async function listUsersForAdmin(): Promise<AdminUserRow[]> {
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    bookingsCount: user._count.bookings,
    reviewsCount: user._count.reviews,
    createdAt: user.createdAt,
  }));
}

export async function updateUserForAdmin(input: {
  userId: string;
  role: UserRole;
  isActive: boolean;
}): Promise<UserMutationResult> {
  const userId = normalizeText(input.userId);
  if (!userId) {
    return {
      ok: false,
      error: "Invalid user id.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      adminProfile: {
        select: {
          id: true,
        },
      },
      providerProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return {
      ok: false,
      error: "User not found.",
    };
  }

  if (user.adminProfile && input.role !== UserRole.ADMIN) {
    return {
      ok: false,
      error: "Admin users must keep admin role.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        role: input.role,
        isActive: input.isActive,
      },
    });

    if (input.role === UserRole.SERVICE_PROVIDER && !user.providerProfile) {
      await tx.serviceProvider.create({
        data: {
          userId,
          approvalStatus: "PENDING",
        },
      });
    }

    if (input.role !== UserRole.ADMIN && user.adminProfile) {
      await tx.admin.delete({
        where: {
          userId,
        },
      });
    }

    if (input.role === UserRole.ADMIN && !user.adminProfile) {
      await tx.admin.create({
        data: {
          userId,
          permissions: "full_access",
        },
      });
    }
  });

  return { ok: true };
}

export async function deleteUserForAdmin(userIdInput: string): Promise<UserMutationResult> {
  const userId = normalizeText(userIdInput);
  if (!userId) {
    return {
      ok: false,
      error: "Invalid user id.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
      _count: {
        select: {
          bookings: true,
          reviews: true,
          accounts: true,
          sessions: true,
        },
      },
      providerProfile: {
        select: {
          id: true,
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      ok: false,
      error: "User not found.",
    };
  }

  if (user.role === UserRole.ADMIN) {
    return {
      ok: false,
      error: "Admin user cannot be deleted from this screen.",
    };
  }

  const providerHasDependencies =
    Boolean(user.providerProfile) &&
    (user.providerProfile?._count.bookings ?? 0) > 0;

  if (
    user._count.bookings > 0 ||
    user._count.reviews > 0 ||
    providerHasDependencies ||
    (user.providerProfile?._count.reviews ?? 0) > 0
  ) {
    return {
      ok: false,
      error: "Cannot delete this user because linked bookings or reviews exist.",
    };
  }

  await prisma.$transaction(async (tx) => {
    if (user.providerProfile) {
      await tx.availabilitySlot.deleteMany({
        where: {
          providerId: user.providerProfile.id,
        },
      });
      await tx.providerService.deleteMany({
        where: {
          providerId: user.providerProfile.id,
        },
      });
      await tx.serviceProvider.delete({
        where: {
          id: user.providerProfile.id,
        },
      });
    }

    await tx.account.deleteMany({
      where: {
        userId,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId,
      },
    });

    await tx.user.delete({
      where: {
        id: userId,
      },
    });
  });

  return { ok: true };
}
