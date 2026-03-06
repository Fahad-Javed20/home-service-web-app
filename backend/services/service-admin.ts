import { prisma } from "@/backend/db/prisma";

export type ServiceAdminRow = {
  id: string;
  name: string;
  slug: string;
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
  slug: string;
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

export type CategoryAdminRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  servicesCount: number;
  updatedAt: Date;
};

function normalizeText(value: string) {
  return value.trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listServiceCategories(): Promise<ServiceCategoryOption[]> {
  return prisma.serviceCategory.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

export async function listCategoriesForAdmin(): Promise<CategoryAdminRow[]> {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          services: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    servicesCount: category._count.services,
    updatedAt: category.updatedAt,
  }));
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
          providerServices: true,
          bookings: true,
        },
      },
    },
  });

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    basePrice: service.basePrice,
    categoryId: service.category.id,
    categoryName: service.category.name,
    providersCount: service._count.providerServices,
    bookingsCount: service._count.bookings,
    updatedAt: service.updatedAt,
  }));
}

async function ensureCategoryExists(categoryId: string) {
  const category = await prisma.serviceCategory.findUnique({
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

async function getUniqueServiceSlug(baseSlug: string, excludedServiceId?: string) {
  const safeBase = baseSlug || "service";
  let candidate = safeBase;
  let suffix = 2;

  while (true) {
    const existing = await prisma.service.findFirst({
      where: {
        slug: candidate,
        ...(excludedServiceId
          ? {
              id: {
                not: excludedServiceId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${safeBase}-${suffix}`;
    suffix += 1;
  }
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

  const name = normalizeText(input.name);
  const slug = await getUniqueServiceSlug(slugify(name));

  await prisma.service.create({
    data: {
      name,
      slug,
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

  const name = normalizeText(input.name);
  const slug = await getUniqueServiceSlug(slugify(name), serviceId);

  await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      name,
      slug,
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
          providerServices: true,
          bookings: true,
          reviews: true,
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

  if (
    service._count.providerServices > 0 ||
    service._count.bookings > 0 ||
    service._count.reviews > 0
  ) {
    return {
      ok: false,
      error:
        "Cannot delete this service because it is linked to providers, bookings, or reviews.",
    };
  }

  await prisma.service.delete({
    where: {
      id,
    },
  });

  return { ok: true };
}

export async function createCategory(input: {
  name: string;
  description: string | null;
  icon?: string | null;
}): Promise<ServiceMutationResult> {
  const name = normalizeText(input.name);
  if (!name) {
    return {
      ok: false,
      error: "Category name is required.",
    };
  }

  const slug = await getUniqueCategorySlug(slugify(name));

  await prisma.serviceCategory.create({
    data: {
      name,
      slug,
      description: normalizeText(input.description ?? "") || null,
      icon: input.icon?.trim() || null,
    },
  });

  return { ok: true };
}

export async function updateCategory(input: {
  categoryId: string;
  name: string;
  description: string | null;
  icon?: string | null;
}): Promise<ServiceMutationResult> {
  const categoryId = normalizeText(input.categoryId);
  if (!categoryId) {
    return {
      ok: false,
      error: "Invalid category id.",
    };
  }

  const name = normalizeText(input.name);
  if (!name) {
    return {
      ok: false,
      error: "Category name is required.",
    };
  }

  const category = await prisma.serviceCategory.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    return {
      ok: false,
      error: "Category not found.",
    };
  }

  const slug = await getUniqueCategorySlug(slugify(name), categoryId);

  await prisma.serviceCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
      slug,
      description: normalizeText(input.description ?? "") || null,
      icon: input.icon?.trim() || null,
    },
  });

  return { ok: true };
}

export async function deleteCategory(categoryIdInput: string): Promise<ServiceMutationResult> {
  const categoryId = normalizeText(categoryIdInput);
  if (!categoryId) {
    return {
      ok: false,
      error: "Invalid category id.",
    };
  }

  const category = await prisma.serviceCategory.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      _count: {
        select: {
          services: true,
        },
      },
    },
  });

  if (!category) {
    return {
      ok: false,
      error: "Category not found.",
    };
  }

  if (category._count.services > 0) {
    return {
      ok: false,
      error: "Cannot delete category with linked services.",
    };
  }

  await prisma.serviceCategory.delete({
    where: {
      id: categoryId,
    },
  });

  return { ok: true };
}

async function getUniqueCategorySlug(baseSlug: string, excludedCategoryId?: string) {
  const safeBase = baseSlug || "category";
  let candidate = safeBase;
  let suffix = 2;

  while (true) {
    const existing = await prisma.serviceCategory.findFirst({
      where: {
        slug: candidate,
        ...(excludedCategoryId
          ? {
              id: {
                not: excludedCategoryId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${safeBase}-${suffix}`;
    suffix += 1;
  }
}
