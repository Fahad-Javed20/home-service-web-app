import { prisma } from "@/backend/db/prisma";
import { getServiceProviders, type ServiceProviderCard } from "@/backend/queries/providers";
import { BookingStatus, ProviderApprovalStatus } from "@prisma/client";

export type HeroCategory = {
  id: string;
  name: string;
  icon: string | null;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string | null;
};

export type HomeStats = {
  completedServices: string;
  verifiedProviders: string;
  citiesCovered: string;
  averageRating: string;
};

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export async function getHeroCategories(limit = 6): Promise<HeroCategory[]> {
  try {
    return await prisma.serviceCategory.findMany({
      take: limit,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch hero categories", error);
    return [];
  }
}

export async function getPopularProviders(
  limit = 8
): Promise<ServiceProviderCard[]> {
  return getServiceProviders({ limit });
}

export async function getTestimonials(limit = 3): Promise<Testimonial[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        rating: {
          gte: 4,
        },
        comment: {
          not: null,
        },
        NOT: {
          comment: "",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        customer: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        provider: {
          select: {
            city: true,
            state: true,
          },
        },
      },
    });

    return reviews.map((review) => {
      const location = [review.provider.city, review.provider.state]
        .filter(Boolean)
        .join(", ");

      return {
        id: review.id,
        name: review.customer.name,
        role: location ? `Customer, ${location}` : "Customer",
        rating: review.rating,
        text: review.comment ?? "",
        avatar: review.customer.profileImage ?? null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch testimonials", error);
    return [];
  }
}

export async function getStats(): Promise<HomeStats> {
  try {
    const [completedServicesCount, verifiedProvidersCount, cities, reviewAggregate] =
      await Promise.all([
        prisma.booking.count({
          where: {
            status: BookingStatus.COMPLETED,
          },
        }),
        prisma.serviceProvider.count({
          where: {
            approvalStatus: ProviderApprovalStatus.APPROVED,
          },
        }),
        prisma.serviceProvider.findMany({
          where: {
            approvalStatus: ProviderApprovalStatus.APPROVED,
            city: {
              not: null,
            },
          },
          distinct: ["city"],
          select: {
            city: true,
          },
        }),
        prisma.review.aggregate({
          _avg: {
            rating: true,
          },
        }),
      ]);

    const averageRating = reviewAggregate._avg.rating ?? 0;

    return {
      completedServices: `${formatCount(completedServicesCount)}+`,
      verifiedProviders: `${formatCount(verifiedProvidersCount)}+`,
      citiesCovered: `${formatCount(cities.length)}+`,
      averageRating: `${averageRating.toFixed(1)}/5`,
    };
  } catch (error) {
    console.error("Failed to fetch stats", error);
    return {
      completedServices: "0+",
      verifiedProviders: "0+",
      citiesCovered: "0+",
      averageRating: "0.0/5",
    };
  }
}
