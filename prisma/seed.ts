import {
  BookingStatus,
  PaymentStatus,
  PrismaClient,
  ProviderApprovalStatus,
  UserRole,
  Weekday,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createPasswordHash } from "../backend/auth/security";
import { normalizePostgresConnectionString } from "../backend/db/connection-string";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: normalizePostgresConnectionString(connectionString),
});
const prisma = new PrismaClient({ adapter });

const daySlots = ["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"];
const workingDays: Weekday[] = [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
];

const categories = [
  {
    name: "Cleaning",
    slug: "cleaning",
    icon: "cleaning",
    description: "Residential and office deep cleaning services.",
    services: [
      { name: "Deep Home Cleaning", slug: "deep-home-cleaning", basePrice: 120 },
      { name: "Bathroom Sanitization", slug: "bathroom-sanitization", basePrice: 85 },
      { name: "Sofa and Carpet Cleaning", slug: "sofa-carpet-cleaning", basePrice: 95 },
    ],
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    icon: "plumbing",
    description: "Pipes, leaks, drains, and fixture installation.",
    services: [
      { name: "Leak Repair", slug: "leak-repair", basePrice: 90 },
      { name: "Drain Cleaning", slug: "drain-cleaning", basePrice: 100 },
    ],
  },
  {
    name: "Electrical",
    slug: "electrical",
    icon: "electric",
    description: "Safe electrical repair and installation work.",
    services: [
      { name: "Wiring and Fixtures", slug: "wiring-and-fixtures", basePrice: 130 },
      { name: "Fan and Light Installation", slug: "fan-and-light-installation", basePrice: 110 },
    ],
  },
  {
    name: "Painting",
    slug: "painting",
    icon: "painting",
    description: "Interior and exterior paint services.",
    services: [
      { name: "Interior Wall Painting", slug: "interior-wall-painting", basePrice: 220 },
      { name: "Exterior Painting", slug: "exterior-painting", basePrice: 260 },
    ],
  },
  {
    name: "Appliance Repair",
    slug: "appliance-repair",
    icon: "repair",
    description: "Major home appliance diagnostics and repair.",
    services: [
      { name: "Washing Machine Repair", slug: "washing-machine-repair", basePrice: 125 },
      { name: "Refrigerator Repair", slug: "refrigerator-repair", basePrice: 140 },
    ],
  },
  {
    name: "Moving",
    slug: "moving",
    icon: "shifting",
    description: "Reliable packing and local moving assistance.",
    services: [
      { name: "Home Shifting", slug: "home-shifting", basePrice: 280 },
      { name: "Packing and Unpacking", slug: "packing-and-unpacking", basePrice: 170 },
    ],
  },
] as const;

const providerPlan = [
  { slug: "cleaning", city: "New York", state: "NY", count: 8 },
  { slug: "plumbing", city: "Dallas", state: "TX", count: 8 },
  { slug: "electrical", city: "San Jose", state: "CA", count: 7 },
  { slug: "painting", city: "Phoenix", state: "AZ", count: 8 },
  { slug: "appliance-repair", city: "Chicago", state: "IL", count: 7 },
  { slug: "moving", city: "Seattle", state: "WA", count: 8 },
] as const;

const customerUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@homeservepro.dev",
    phone: "+1-917-555-0201",
  },
  {
    name: "Michael Chen",
    email: "michael.chen@homeservepro.dev",
    phone: "+1-773-555-0202",
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@homeservepro.dev",
    phone: "+1-213-555-0203",
  },
  {
    name: "Alex Turner",
    email: "alex.turner@homeservepro.dev",
    phone: "+1-206-555-0204",
  },
  {
    name: "Noah Williams",
    email: "noah.williams@homeservepro.dev",
    phone: "+1-404-555-0205",
  },
];

const providerFirstNames = [
  "James",
  "Oliver",
  "William",
  "Benjamin",
  "Elijah",
  "Lucas",
  "Henry",
  "Alexander",
  "Mason",
  "Michael",
  "Daniel",
  "Matthew",
  "Emma",
  "Olivia",
  "Sophia",
  "Ava",
] as const;

const providerLastNames = [
  "Anderson",
  "Bennett",
  "Carter",
  "Davis",
  "Edwards",
  "Foster",
  "Garcia",
  "Harris",
  "Irving",
  "Johnson",
  "Kennedy",
  "Lewis",
  "Mitchell",
  "Nelson",
  "Owens",
  "Parker",
] as const;

const customerPortraitUrls = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop&crop=face",
] as const;

const providerPortraitUrls = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=400&h=400&fit=crop&crop=face",
] as const;

const credentials = {
  admin: {
    email: "fahadbinjaved666@gmail.com",
    password: "123456789",
  },
  userPassword: "Customer@123",
  providerPassword: "Provider@123",
};

function addDays(baseDate: Date, dayOffset: number) {
  const value = new Date(baseDate);
  value.setDate(value.getDate() + dayOffset);
  return value;
}

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function getProviderName(index: number) {
  const firstName = providerFirstNames[index % providerFirstNames.length];
  const lastName =
    providerLastNames[
      Math.floor(index / providerFirstNames.length) % providerLastNames.length
    ];

  return `${firstName} ${lastName}`;
}

function getProviderPortrait(index: number) {
  return providerPortraitUrls[index % providerPortraitUrls.length];
}

function imageFromCategory(categorySlug: string, uniqueSeed: number) {
  const serviceImagesByCategory: Record<string, string[]> = {
    cleaning: [
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=800&fit=crop",
    ],
    plumbing: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=800&fit=crop",
    ],
    electrical: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop",
    ],
    painting: [
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&h=800&fit=crop",
    ],
    "appliance-repair": [
      "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    ],
    moving: [
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop",
    ],
  };

  const images = serviceImagesByCategory[categorySlug] ?? serviceImagesByCategory.cleaning;
  return images[uniqueSeed % images.length];
}

async function resetDatabase() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.providerService.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.user.deleteMany();
}

async function seedCoreData() {
  const categoryRecords = await Promise.all(
    categories.map((category) =>
      prisma.serviceCategory.create({
        data: {
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          description: category.description,
        },
      })
    )
  );

  const categoryBySlug = new Map(categoryRecords.map((category) => [category.slug, category]));
  const serviceBySlug = new Map<string, { id: string; categorySlug: string }>();

  for (const category of categories) {
    const categoryRecord = categoryBySlug.get(category.slug);
    if (!categoryRecord) {
      continue;
    }

    for (const service of category.services) {
      const createdService = await prisma.service.create({
        data: {
          name: service.name,
          slug: service.slug,
          description: `${service.name} handled by verified professionals.`,
          basePrice: service.basePrice,
          categoryId: categoryRecord.id,
          durationMinutes: 120,
        },
      });

      serviceBySlug.set(service.slug, {
        id: createdService.id,
        categorySlug: category.slug,
      });
    }
  }

  return { categoryBySlug, serviceBySlug };
}

async function seedAdmin() {
  await prisma.user.create({
    data: {
      name: "Fahad Bin Javed",
      email: credentials.admin.email,
      role: UserRole.ADMIN,
      passwordHash: createPasswordHash(credentials.admin.password),
      isActive: true,
    },
  });
}

async function seedCustomers() {
  const passwordHash = createPasswordHash(credentials.userPassword);

  const users = await Promise.all(
    customerUsers.map((user, index) =>
      prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: customerPortraitUrls[index % customerPortraitUrls.length],
          role: UserRole.USER,
          passwordHash,
          isActive: true,
        },
      })
    )
  );

  return users;
}

async function seedProviders(serviceBySlug: Map<string, { id: string; categorySlug: string }>) {
  const serviceIdsByCategory = new Map<string, string[]>();

  for (const record of serviceBySlug.values()) {
    const current = serviceIdsByCategory.get(record.categorySlug) ?? [];
    current.push(record.id);
    serviceIdsByCategory.set(record.categorySlug, current);
  }

  const createdProviders: Array<{
    providerId: string;
    userId: string;
    primaryServiceId: string;
  }> = [];

  let providerCounter = 1;
  const providerPasswordHash = createPasswordHash(credentials.providerPassword);

  for (const plan of providerPlan) {
    const categoryServices = serviceIdsByCategory.get(plan.slug) ?? [];
    if (categoryServices.length === 0) {
      continue;
    }

    for (let index = 0; index < plan.count; index += 1) {
      const providerIndex = providerCounter - 1;
      const displayName = getProviderName(providerIndex);
      const email = `${slugifyName(displayName)}.${providerCounter}@homeservepro.dev`;

      const user = await prisma.user.create({
        data: {
          name: displayName,
          email,
          phone: `+1-650-555-${String(3000 + providerCounter).padStart(4, "0")}`,
          profileImage: getProviderPortrait(providerIndex),
          role: UserRole.SERVICE_PROVIDER,
          passwordHash: providerPasswordHash,
          isActive: true,
        },
      });

      const serviceProvider = await prisma.serviceProvider.create({
        data: {
          userId: user.id,
          businessName: `${displayName} Home Services`,
          bio: `Experienced ${plan.slug.replace("-", " ")} specialist serving households and apartments across ${plan.city}.`,
          imageUrl: imageFromCategory(plan.slug, providerCounter),
          addressLine1: `${100 + providerCounter}, Street ${index + 1}`,
          city: plan.city,
          state: plan.state,
          country: "USA",
          yearsOfExperience: 3 + (index % 9),
          approvalStatus: ProviderApprovalStatus.APPROVED,
          isFeatured: index % 4 === 0,
        },
      });

      const primaryServiceId = categoryServices[index % categoryServices.length];

      await prisma.providerService.create({
        data: {
          providerId: serviceProvider.id,
          serviceId: primaryServiceId,
          isPrimary: true,
        },
      });

      if (categoryServices.length > 1 && index % 2 === 0) {
        const secondaryServiceId = categoryServices[(index + 1) % categoryServices.length];
        if (secondaryServiceId !== primaryServiceId) {
          await prisma.providerService.create({
            data: {
              providerId: serviceProvider.id,
              serviceId: secondaryServiceId,
              isPrimary: false,
            },
          });
        }
      }

      await prisma.availabilitySlot.createMany({
        data: workingDays.flatMap((day) =>
          daySlots.map((timeSlot) => ({
            providerId: serviceProvider.id,
            dayOfWeek: day,
            timeSlot,
            isAvailable: true,
          }))
        ),
      });

      createdProviders.push({
        providerId: serviceProvider.id,
        userId: user.id,
        primaryServiceId,
      });

      providerCounter += 1;
    }
  }

  return createdProviders;
}

async function seedBookingsAndReviews(
  customers: Array<{ id: string }>,
  providers: Array<{ providerId: string; primaryServiceId: string }>
) {
  const today = startOfDay(new Date());
  const pastBookingsCount = 24;
  const futureBookingsCount = 18;

  for (let index = 0; index < pastBookingsCount; index += 1) {
    const customer = customers[index % customers.length];
    const provider = providers[index % providers.length];
    const bookingDate = addDays(today, -(index + 2));
    const timeSlot = daySlots[index % daySlots.length];

    const booking = await prisma.booking.create({
      data: {
        userId: customer.id,
        providerId: provider.providerId,
        serviceId: provider.primaryServiceId,
        bookingDate,
        timeSlot,
        status: BookingStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        notes: "Completed service booking seeded for demo data.",
        completedAt: bookingDate,
      },
    });

    await prisma.review.create({
      data: {
        bookingId: booking.id,
        userId: customer.id,
        providerId: provider.providerId,
        serviceId: provider.primaryServiceId,
        rating: 4 + (index % 2),
        comment:
          index % 2 === 0
            ? "Excellent service quality and very professional behavior."
            : "Timely arrival and clean execution. Recommended provider.",
      },
    });
  }

  for (let index = 0; index < futureBookingsCount; index += 1) {
    const customer = customers[(index + 1) % customers.length];
    const provider = providers[(index + 5) % providers.length];
    const bookingDate = addDays(today, index + 1);
    const timeSlot = daySlots[index % daySlots.length];
    const status = index % 3 === 0 ? BookingStatus.CONFIRMED : BookingStatus.PENDING;

    await prisma.booking.create({
      data: {
        userId: customer.id,
        providerId: provider.providerId,
        serviceId: provider.primaryServiceId,
        bookingDate,
        timeSlot,
        status,
        paymentStatus: PaymentStatus.PENDING,
        notes: "Upcoming booking seeded for demo data.",
      },
    });
  }
}

async function refreshProviderMetrics() {
  await prisma.serviceProvider.updateMany({
    data: {
      rating: 0,
      totalReviews: 0,
      jobsCompleted: 0,
    },
  });

  const [reviewGroups, completedJobs] = await Promise.all([
    prisma.review.groupBy({
      by: ["providerId"],
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.booking.groupBy({
      by: ["providerId"],
      where: { status: BookingStatus.COMPLETED },
      _count: { _all: true },
    }),
  ]);

  const completedByProvider = new Map(
    completedJobs.map((item) => [item.providerId, item._count._all])
  );

  for (const reviewGroup of reviewGroups) {
    await prisma.serviceProvider.update({
      where: {
        id: reviewGroup.providerId,
      },
      data: {
        rating: reviewGroup._avg.rating ?? 0,
        totalReviews: reviewGroup._count._all,
        jobsCompleted: completedByProvider.get(reviewGroup.providerId) ?? 0,
      },
    });
  }
}

async function main() {
  console.log("Seeding HomeServePro marketplace schema...");
  await resetDatabase();

  const { serviceBySlug } = await seedCoreData();
  await seedAdmin();
  const customers = await seedCustomers();
  const providers = await seedProviders(serviceBySlug);
  await seedBookingsAndReviews(customers, providers);
  await refreshProviderMetrics();

  const [categoryCount, serviceCount, providerCount, bookingCount, reviewCount, slotCount] =
    await Promise.all([
      prisma.serviceCategory.count(),
      prisma.service.count(),
      prisma.serviceProvider.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.availabilitySlot.count(),
    ]);

  console.log(
    `Seed complete: ${categoryCount} categories, ${serviceCount} services, ${providerCount} providers, ${slotCount} availability slots, ${bookingCount} bookings, ${reviewCount} reviews.`
  );
  console.log(
    `Credentials: admin (${credentials.admin.email} / ${credentials.admin.password}), customers (* / ${credentials.userPassword}), providers (* / ${credentials.providerPassword}).`
  );
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

