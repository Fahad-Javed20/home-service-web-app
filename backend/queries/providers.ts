import { ProviderApprovalStatus } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";

export type ServiceProviderCard = {
  id: string;
  providerName: string;
  serviceName: string;
  serviceDescription: string | null;
  basePrice: number;
  categoryId: string;
  categoryName: string;
  imageUrl: string | null;
  rating: number;
  totalReviews: number;
  yearsOfExperience: number | null;
  location: string;
  city: string | null;
  state: string | null;
};

export type ServiceProviderDetail = ServiceProviderCard & {
  bio: string | null;
  addressLine1: string | null;
  country: string | null;
  galleryImages: string[];
};

function formatLocation({
  addressLine1,
  city,
  state,
  country,
}: {
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}) {
  const cityState = [city, state].filter(Boolean).join(", ");
  const fullLocation = [addressLine1, cityState, country]
    .filter(Boolean)
    .join(", ");

  return fullLocation || "Location not available";
}

const categoryGalleryMap: Record<string, string[]> = {
  cleaning: [
    "https://images.unsplash.com/photo-1527515637462-daf40b45dd34?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=800&fit=crop",
  ],
  repair: [
    "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=800&fit=crop",
  ],
  painting: [
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&h=800&fit=crop",
  ],
  plumbing: [
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=800&fit=crop",
  ],
  electric: [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop",
  ],
  shifting: [
    "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
  ],
  appliance: [
    "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1582711012124-a56cf5a67c54?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
  ],
  moving: [
    "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop",
  ],
};

function getGalleryImages(categoryName: string, primaryImage: string | null) {
  const key = categoryName.toLowerCase();
  const defaults = categoryGalleryMap[key] ?? categoryGalleryMap.cleaning;
  const images = [primaryImage, ...defaults].filter(
    (image): image is string => Boolean(image)
  );

  return Array.from(new Set(images)).slice(0, 4);
}

type GetServiceProvidersOptions = {
  limit?: number;
  categoryId?: string;
  query?: string;
};

export async function getServiceProviders(
  options: GetServiceProvidersOptions = {}
): Promise<ServiceProviderCard[]> {
  const { limit, categoryId, query } = options;
  const normalizedQuery = query?.trim();

  try {
    const providers = await prisma.serviceProvider.findMany({
      where: {
        approvalStatus: ProviderApprovalStatus.APPROVED,
        providerServices: categoryId
          ? {
              some: {
                service: {
                  categoryId,
                },
              },
            }
          : {
              some: {},
            },
        ...(normalizedQuery
          ? {
              OR: [
                {
                  user: {
                    name: {
                      contains: normalizedQuery,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  city: {
                    contains: normalizedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  providerServices: {
                    some: {
                      service: {
                        name: {
                          contains: normalizedQuery,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [
        { rating: "desc" },
        { totalReviews: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        providerServices: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
          take: 1,
          include: {
            service: {
              select: {
                name: true,
                description: true,
                basePrice: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
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
          providerName: provider.user.name,
          serviceName: primaryService.name,
          serviceDescription: primaryService.description,
          basePrice: primaryService.basePrice,
          categoryId: primaryService.category.id,
          categoryName: primaryService.category.name,
          imageUrl: provider.imageUrl ?? provider.user.profileImage ?? null,
          rating: provider.rating,
          totalReviews: provider.totalReviews,
          yearsOfExperience: provider.yearsOfExperience,
          location: formatLocation({
            addressLine1: provider.addressLine1,
            city: provider.city,
            state: provider.state,
            country: provider.country,
          }),
          city: provider.city,
          state: provider.state,
        };
      })
      .filter((provider): provider is ServiceProviderCard => Boolean(provider));
  } catch (error) {
    console.error("Failed to fetch service providers", error);
    return [];
  }
}

export async function getServiceProviderById(
  providerId: string
): Promise<ServiceProviderDetail | null> {
  try {
    const provider = await prisma.serviceProvider.findFirst({
      where: {
        id: providerId,
        approvalStatus: ProviderApprovalStatus.APPROVED,
      },
      include: {
        user: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        providerServices: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
          take: 1,
          include: {
            service: {
              select: {
                name: true,
                description: true,
                basePrice: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!provider) {
      return null;
    }

    const primaryService = provider.providerServices[0]?.service;
    if (!primaryService) {
      return null;
    }

    const imageUrl = provider.imageUrl ?? provider.user.profileImage ?? null;

    return {
      id: provider.id,
      providerName: provider.user.name,
      serviceName: primaryService.name,
      serviceDescription: primaryService.description,
      basePrice: primaryService.basePrice,
      categoryId: primaryService.category.id,
      categoryName: primaryService.category.name,
      imageUrl,
      rating: provider.rating,
      totalReviews: provider.totalReviews,
      yearsOfExperience: provider.yearsOfExperience,
      location: formatLocation({
        addressLine1: provider.addressLine1,
        city: provider.city,
        state: provider.state,
        country: provider.country,
      }),
      city: provider.city,
      state: provider.state,
      bio: provider.bio,
      addressLine1: provider.addressLine1,
      country: provider.country,
      galleryImages: getGalleryImages(primaryService.category.name, imageUrl),
    };
  } catch (error) {
    console.error("Failed to fetch service provider detail", error);
    return null;
  }
}
