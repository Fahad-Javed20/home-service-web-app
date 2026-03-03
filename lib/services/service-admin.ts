import { prisma } from "@/lib/prisma";

export type ServiceAdminRow = {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  categoryId: string;
  categoryName: string;
  providersCount: number;
  bookingsCount: number;
  updatedAt: Date;
};

export type ServiceCategoryOption = {
  id: string;
  name: string;
};

export type ServiceCreateInput = {
  name: string;
  description: string | null;
  basePrice: number;
  categoryId: string;
};

export type ServiceUpdateInput = ServiceCreateInput & {
  id: string;
};

export type ServiceMutationResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeText(value: string) {
  return value.trim();
}

export async function listServiceCategories(): Promise<ServiceCategoryOption[]> {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function listServicesForAdmin(): Promise<ServiceAdminRow[]> {
  const services = await prisma.service.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          providers: true,
          bookings: true,
        },
      },
    },
  });

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    basePrice: service.basePrice,
    categoryId: service.category.id,
    categoryName: service.category.name,
    providersCount: service._count.providers,
    bookingsCount: service._count.bookings,
    updatedAt: service.updatedAt,
  }));
}

async function ensureCategoryExists(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(category);
}

function validateServiceInput(input: ServiceCreateInput): ServiceMutationResult {
  const name = normalizeText(input.name);

  if (!name) {
    return {
      ok: false,
      error: "Service name is required.",
    };
  }

  if (!Number.isFinite(input.basePrice) || input.basePrice < 0) {
    return {
      ok: false,
      error: "Base price must be a valid positive number.",
    };
  }

  if (!normalizeText(input.categoryId)) {
    return {
      ok: false,
      error: "Please select a category.",
    };
  }

  return { ok: true };
}

export async function createService(
  input: ServiceCreateInput
): Promise<ServiceMutationResult> {
  const validation = validateServiceInput(input);
  if (!validation.ok) {
    return validation;
  }

  const categoryExists = await ensureCategoryExists(input.categoryId);
  if (!categoryExists) {
    return {
      ok: false,
      error: "Selected category does not exist.",
    };
  }

  await prisma.service.create({
    data: {
      name: normalizeText(input.name),
      description: normalizeText(input.description ?? "") || null,
      basePrice: input.basePrice,
      categoryId: input.categoryId,
    },
  });

  return { ok: true };
}

export async function updateService(
  input: ServiceUpdateInput
): Promise<ServiceMutationResult> {
  const serviceId = normalizeText(input.id);
  if (!serviceId) {
    return {
      ok: false,
      error: "Invalid service id.",
    };
  }

  const validation = validateServiceInput(input);
  if (!validation.ok) {
    return validation;
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    select: {
      id: true,
    },
  });

  if (!service) {
    return {
      ok: false,
      error: "Service not found.",
    };
  }

  const categoryExists = await ensureCategoryExists(input.categoryId);
  if (!categoryExists) {
    return {
      ok: false,
      error: "Selected category does not exist.",
    };
  }

  await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      name: normalizeText(input.name),
      description: normalizeText(input.description ?? "") || null,
      basePrice: input.basePrice,
      categoryId: input.categoryId,
    },
  });

  return { ok: true };
}

export async function deleteService(serviceId: string): Promise<ServiceMutationResult> {
  const id = normalizeText(serviceId);
  if (!id) {
    return {
      ok: false,
      error: "Invalid service id.",
    };
  }

  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      _count: {
        select: {
          providers: true,
          bookings: true,
        },
      },
    },
  });

  if (!service) {
    return {
      ok: false,
      error: "Service not found.",
    };
  }

  if (service._count.providers > 0 || service._count.bookings > 0) {
    return {
      ok: false,
      error:
        "Cannot delete this service because it is linked to providers or bookings.",
    };
  }

  await prisma.service.delete({
    where: {
      id,
    },
  });

  return { ok: true };
}
