import { ProviderApprovalStatus, UserRole } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";

export type ProviderAdminRow = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string | null;
  profileImage: string | null;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  bio: string | null;
  imageUrl: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  yearsOfExperience: number | null;
  verified: boolean;
  rating: number;
  totalReviews: number;
  bookingsCount: number;
  reviewsCount: number;
  updatedAt: Date;
};

export type ProviderServiceOption = {
  id: string;
  name: string;
  categoryName: string;
};

export type ProviderCreateInput = {
  userName: string;
  userEmail: string;
  phone: string | null;
  profileImage: string | null;
  serviceId: string;
  bio: string | null;
  imageUrl: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  yearsOfExperience: number | null;
  verified: boolean;
};

export type ProviderUpdateInput = ProviderCreateInput & {
  providerId: string;
};

export type ProviderMutationResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeText(value: string) {
  return value.trim();
}

function normalizeOptional(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

async function serviceExists(serviceId: string) {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(service);
}

function validateProviderInput(input: ProviderCreateInput): ProviderMutationResult {
  const userName = normalizeText(input.userName);
  const userEmail = normalizeEmail(input.userEmail);
  const serviceId = normalizeText(input.serviceId);

  if (!userName) {
    return {
      ok: false,
      error: "Provider name is required.",
    };
  }

  if (!userEmail || !userEmail.includes("@")) {
    return {
      ok: false,
      error: "A valid provider email is required.",
    };
  }

  if (!serviceId) {
    return {
      ok: false,
      error: "Please select a service.",
    };
  }

  if (
    input.yearsOfExperience !== null &&
    (!Number.isFinite(input.yearsOfExperience) || input.yearsOfExperience < 0)
  ) {
    return {
      ok: false,
      error: "Years of experience must be a valid positive number.",
    };
  }

  return { ok: true };
}

export async function listServicesForProviderForm(): Promise<ProviderServiceOption[]> {
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ name: "asc" }],
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    categoryName: service.category.name,
  }));
}

export async function listProvidersForAdmin(): Promise<ProviderAdminRow[]> {
  const providers = await prisma.serviceProvider.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      providerServices: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        include: {
          service: {
            select: {
              id: true,
              name: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  return providers
    .map((provider) => {
      const primaryService = provider.providerServices[0]?.service;

      if (!primaryService) {
        return null;
      }

      return {
        id: provider.id,
        userId: provider.user.id,
        userName: provider.user.name,
        userEmail: provider.user.email,
        phone: provider.user.phone,
        profileImage: provider.user.profileImage,
        serviceId: primaryService.id,
        serviceName: primaryService.name,
        categoryName: primaryService.category.name,
        bio: provider.bio,
        imageUrl: provider.imageUrl,
        addressLine1: provider.addressLine1,
        city: provider.city,
        state: provider.state,
        country: provider.country,
        yearsOfExperience: provider.yearsOfExperience,
        verified: provider.approvalStatus === ProviderApprovalStatus.APPROVED,
        rating: provider.rating,
        totalReviews: provider.totalReviews,
        bookingsCount: provider._count.bookings,
        reviewsCount: provider._count.reviews,
        updatedAt: provider.updatedAt,
      };
    })
    .filter((provider): provider is ProviderAdminRow => Boolean(provider));
}

export async function createProvider(
  input: ProviderCreateInput
): Promise<ProviderMutationResult> {
  const validation = validateProviderInput(input);
  if (!validation.ok) {
    return validation;
  }

  const serviceId = normalizeText(input.serviceId);
  const userEmail = normalizeEmail(input.userEmail);

  const serviceIsValid = await serviceExists(serviceId);
  if (!serviceIsValid) {
    return {
      ok: false,
      error: "Selected service does not exist.",
    };
  }

  const userByEmail = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
    },
  });

  if (userByEmail) {
    return {
      ok: false,
      error: "A user with this email already exists.",
    };
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: normalizeText(input.userName),
        email: userEmail,
        phone: normalizeOptional(input.phone),
        profileImage: normalizeOptional(input.profileImage),
        role: UserRole.SERVICE_PROVIDER,
      },
      select: {
        id: true,
      },
    });

    const provider = await tx.serviceProvider.create({
      data: {
        userId: user.id,
        bio: normalizeOptional(input.bio),
        imageUrl: normalizeOptional(input.imageUrl),
        addressLine1: normalizeOptional(input.addressLine1),
        city: normalizeOptional(input.city),
        state: normalizeOptional(input.state),
        country: normalizeOptional(input.country) ?? "USA",
        yearsOfExperience: input.yearsOfExperience,
        approvalStatus: input.verified
          ? ProviderApprovalStatus.APPROVED
          : ProviderApprovalStatus.PENDING,
      },
    });

    await tx.providerService.create({
      data: {
        providerId: provider.id,
        serviceId,
        isPrimary: true,
      },
    });
  });

  return { ok: true };
}

export async function updateProvider(
  input: ProviderUpdateInput
): Promise<ProviderMutationResult> {
  const providerId = normalizeText(input.providerId);
  if (!providerId) {
    return {
      ok: false,
      error: "Invalid provider id.",
    };
  }

  const validation = validateProviderInput(input);
  if (!validation.ok) {
    return validation;
  }

  const serviceId = normalizeText(input.serviceId);
  const userEmail = normalizeEmail(input.userEmail);

  const existingProvider = await prisma.serviceProvider.findUnique({
    where: {
      id: providerId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!existingProvider) {
    return {
      ok: false,
      error: "Provider not found.",
    };
  }

  const serviceIsValid = await serviceExists(serviceId);
  if (!serviceIsValid) {
    return {
      ok: false,
      error: "Selected service does not exist.",
    };
  }

  if (existingProvider.user.email !== userEmail) {
    const emailTaken = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
      },
    });

    if (emailTaken) {
      return {
        ok: false,
        error: "Email is already used by another user.",
      };
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: existingProvider.userId,
      },
      data: {
        name: normalizeText(input.userName),
        email: userEmail,
        phone: normalizeOptional(input.phone),
        profileImage: normalizeOptional(input.profileImage),
        role: UserRole.SERVICE_PROVIDER,
      },
    });

    await tx.serviceProvider.update({
      where: {
        id: providerId,
      },
      data: {
        bio: normalizeOptional(input.bio),
        imageUrl: normalizeOptional(input.imageUrl),
        addressLine1: normalizeOptional(input.addressLine1),
        city: normalizeOptional(input.city),
        state: normalizeOptional(input.state),
        country: normalizeOptional(input.country) ?? "USA",
        yearsOfExperience: input.yearsOfExperience,
        approvalStatus: input.verified
          ? ProviderApprovalStatus.APPROVED
          : ProviderApprovalStatus.PENDING,
      },
    });

    await tx.providerService.deleteMany({
      where: {
        providerId,
      },
    });

    await tx.providerService.create({
      data: {
        providerId,
        serviceId,
        isPrimary: true,
      },
    });
  });

  return { ok: true };
}

export async function deleteProvider(providerId: string): Promise<ProviderMutationResult> {
  const id = normalizeText(providerId);
  if (!id) {
    return {
      ok: false,
      error: "Invalid provider id.",
    };
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userId: true,
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  if (!provider) {
    return {
      ok: false,
      error: "Provider not found.",
    };
  }

  if (provider._count.bookings > 0 || provider._count.reviews > 0) {
    return {
      ok: false,
      error:
        "Cannot delete this provider because it is linked to bookings or reviews.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.deleteMany({
      where: {
        providerId: id,
      },
    });

    await tx.providerService.deleteMany({
      where: {
        providerId: id,
      },
    });

    await tx.serviceProvider.delete({
      where: {
        id,
      },
    });

    const user = await tx.user.findUnique({
      where: {
        id: provider.userId,
      },
      select: {
        id: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
            accounts: true,
            sessions: true,
          },
        },
      },
    });

    if (
      user &&
      user._count.bookings === 0 &&
      user._count.reviews === 0 &&
      user._count.accounts === 0 &&
      user._count.sessions === 0
    ) {
      await tx.user.delete({
        where: {
          id: user.id,
        },
      });
    }
  });

  return { ok: true };
}
