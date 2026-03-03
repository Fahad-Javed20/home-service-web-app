import { BookingStatus, PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createPasswordHash } from "../lib/server/security";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const categoryData = [
  { name: "Cleaning", description: "Home and office cleaning services", icon: "cleaning" },
  { name: "Repair", description: "General household repair services", icon: "repair" },
  { name: "Painting", description: "Wall and interior painting services", icon: "painting" },
  { name: "Plumbing", description: "Pipe, tap, and drainage services", icon: "plumbing" },
  { name: "Electric", description: "Electrical installation and repair", icon: "electric" },
  { name: "Shifting", description: "Home moving and relocation support", icon: "shifting" },
];

const serviceData = [
  { name: "House Cleaning", description: "Complete home cleaning package", basePrice: 120, category: "Cleaning" },
  { name: "Bathroom Cleaning", description: "Deep bathroom cleaning", basePrice: 80, category: "Cleaning" },
  { name: "Garage Cleaning", description: "Garage and storage cleaning", basePrice: 95, category: "Cleaning" },
  { name: "House Repairing", description: "General home repair", basePrice: 140, category: "Repair" },
  { name: "Washing Machine Repair", description: "Laundry appliance maintenance", basePrice: 110, category: "Repair" },
  { name: "Wall Painting", description: "Interior and exterior wall painting", basePrice: 200, category: "Painting" },
  { name: "Leak Fixing", description: "Tap and pipe leak repair", basePrice: 90, category: "Plumbing" },
  { name: "Drain Cleaning", description: "Drain and sewer line cleanup", basePrice: 100, category: "Plumbing" },
  { name: "Wiring Fix", description: "Faulty wiring inspection and fix", basePrice: 130, category: "Electric" },
  { name: "Home Shifting", description: "End-to-end moving assistance", basePrice: 250, category: "Shifting" },
];

const providerUsersData = [
  {
    email: "jenny.wilson@homeservepro.dev",
    name: "Jenny Wilson",
    phone: "+1-212-555-0110",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "diana.potter@homeservepro.dev",
    name: "Diana Potter",
    phone: "+1-212-555-0111",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "richelle.corn@homeservepro.dev",
    name: "Richelle Corn",
    phone: "+1-212-555-0112",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "sherry.wilson@homeservepro.dev",
    name: "Sherry Wilson",
    phone: "+1-919-555-0113",
    profileImage:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "betty.hill@homeservepro.dev",
    name: "Betty Hill",
    phone: "+1-313-555-0114",
    profileImage:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "harry.bruce@homeservepro.dev",
    name: "Harry Bruce",
    phone: "+1-312-555-0115",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "bruce.brown@homeservepro.dev",
    name: "Bruce Brown",
    phone: "+1-312-555-0116",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "omar.khan@homeservepro.dev",
    name: "Omar Khan",
    phone: "+1-346-555-0117",
    profileImage:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face",
  },
];

const customerUsersData = [
  {
    email: "sarah.johnson@homeservepro.dev",
    name: "Sarah Johnson",
    phone: "+1-917-555-0210",
    profileImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "michael.chen@homeservepro.dev",
    name: "Michael Chen",
    phone: "+1-773-555-0211",
    profileImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "emily.rodriguez@homeservepro.dev",
    name: "Emily Rodriguez",
    phone: "+1-213-555-0212",
    profileImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop&crop=face",
  },
  {
    email: "alex.turner@homeservepro.dev",
    name: "Alex Turner",
    phone: "+1-206-555-0213",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
];

const providerProfileData = [
  {
    email: "jenny.wilson@homeservepro.dev",
    serviceName: "House Cleaning",
    bio: "Detail-oriented cleaner with a focus on eco-safe products.",
    imageUrl:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 6,
    addressLine1: "123 North Park Ave",
    city: "New York",
    state: "NY",
  },
  {
    email: "diana.potter@homeservepro.dev",
    serviceName: "Washing Machine Repair",
    bio: "Certified appliance specialist for washers and dryers.",
    imageUrl:
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 8,
    addressLine1: "234 Turner Street",
    city: "New York",
    state: "NY",
  },
  {
    email: "richelle.corn@homeservepro.dev",
    serviceName: "House Repairing",
    bio: "Fast and clean repair work for everyday household issues.",
    imageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 10,
    addressLine1: "445 N Fern Drive",
    city: "New York",
    state: "NY",
  },
  {
    email: "sherry.wilson@homeservepro.dev",
    serviceName: "Bathroom Cleaning",
    bio: "Bathroom deep-clean expert with same-day availability.",
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 5,
    addressLine1: "124 N Front Street",
    city: "Charlotte",
    state: "NC",
  },
  {
    email: "betty.hill@homeservepro.dev",
    serviceName: "Garage Cleaning",
    bio: "Organized and efficient garage and storage cleanup services.",
    imageUrl:
      "https://images.unsplash.com/photo-1718152421680-d1580e843cc9?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 4,
    addressLine1: "5400 Loop",
    city: "Detroit",
    state: "MI",
  },
  {
    email: "harry.bruce@homeservepro.dev",
    serviceName: "Drain Cleaning",
    bio: "Plumbing specialist for clogged drains and sewer issues.",
    imageUrl:
      "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 9,
    addressLine1: "546 North Street",
    city: "Chicago",
    state: "IL",
  },
  {
    email: "bruce.brown@homeservepro.dev",
    serviceName: "Wall Painting",
    bio: "Interior and accent wall painter for homes and offices.",
    imageUrl:
      "https://images.unsplash.com/photo-1642755623141-23b3cb4284aa?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 7,
    addressLine1: "414 South Street",
    city: "Chicago",
    state: "IL",
  },
  {
    email: "omar.khan@homeservepro.dev",
    serviceName: "Wiring Fix",
    bio: "Licensed electrician focused on safety-first fixes.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092446327-9b52bd4f7f87?w=800&h=600&fit=crop&crop=top",
    verified: true,
    yearsOfExperience: 6,
    addressLine1: "88 River Lane",
    city: "Houston",
    state: "TX",
  },
];

const providerExpansionPlan = [
  {
    prefix: "cleaning",
    count: 4,
    serviceNames: ["House Cleaning", "Bathroom Cleaning", "Garage Cleaning"],
    city: "Brooklyn",
    state: "NY",
    bio: "Reliable cleaning specialist focused on hygiene and detail.",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop&crop=top",
  },
  {
    prefix: "repair",
    count: 5,
    serviceNames: ["House Repairing", "Washing Machine Repair"],
    city: "Austin",
    state: "TX",
    bio: "Experienced repair expert for home fixes and appliances.",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&crop=top",
  },
  {
    prefix: "painting",
    count: 6,
    serviceNames: ["Wall Painting"],
    city: "Phoenix",
    state: "AZ",
    bio: "Interior and exterior painting with clean finishing work.",
    imageUrl:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop&crop=top",
  },
  {
    prefix: "plumbing",
    count: 6,
    serviceNames: ["Leak Fixing", "Drain Cleaning"],
    city: "Dallas",
    state: "TX",
    bio: "Fast plumbing support for leaks, drains, and maintenance.",
    imageUrl:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop&crop=top",
  },
  {
    prefix: "electric",
    count: 6,
    serviceNames: ["Wiring Fix"],
    city: "San Jose",
    state: "CA",
    bio: "Licensed electrician for safe and reliable home power fixes.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&h=600&fit=crop&crop=top",
  },
  {
    prefix: "shifting",
    count: 7,
    serviceNames: ["Home Shifting"],
    city: "Seattle",
    state: "WA",
    bio: "Complete home relocation services with careful handling.",
    imageUrl:
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&h=600&fit=crop&crop=top",
  },
] as const;

let generatedProviderCounter = 1;

for (const plan of providerExpansionPlan) {
  for (let index = 0; index < plan.count; index += 1) {
    const number = generatedProviderCounter;
    const serviceName = plan.serviceNames[index % plan.serviceNames.length];
    const label = `${plan.prefix[0].toUpperCase()}${plan.prefix.slice(1)} Expert ${index + 1}`;
    const email = `${plan.prefix}.expert${index + 1}@homeservepro.dev`;

    providerUsersData.push({
      email,
      name: label,
      phone: `+1-650-555-${String(1200 + number).padStart(4, "0")}`,
      profileImage: `https://i.pravatar.cc/400?img=${(number % 70) + 1}`,
    });

    providerProfileData.push({
      email,
      serviceName,
      bio: plan.bio,
      imageUrl: plan.imageUrl,
      verified: true,
      yearsOfExperience: 3 + (index % 8),
      addressLine1: `${100 + number} ${plan.city} Service Ave`,
      city: plan.city,
      state: plan.state,
    });

    generatedProviderCounter += 1;
  }
}

const completedBookingData = [
  {
    providerEmail: "jenny.wilson@homeservepro.dev",
    customerEmail: "sarah.johnson@homeservepro.dev",
    serviceName: "House Cleaning",
    daysAgo: 15,
    rating: 5,
    comment:
      "Absolutely fantastic service! The cleaner arrived on time and left my apartment spotless.",
  },
  {
    providerEmail: "diana.potter@homeservepro.dev",
    customerEmail: "michael.chen@homeservepro.dev",
    serviceName: "Washing Machine Repair",
    daysAgo: 12,
    rating: 5,
    comment:
      "The technician fixed the issue quickly and explained everything clearly with fair pricing.",
  },
  {
    providerEmail: "bruce.brown@homeservepro.dev",
    customerEmail: "emily.rodriguez@homeservepro.dev",
    serviceName: "Wall Painting",
    daysAgo: 10,
    rating: 5,
    comment:
      "Smooth process from booking to completion. The paint finish looks amazing.",
  },
  {
    providerEmail: "richelle.corn@homeservepro.dev",
    customerEmail: "alex.turner@homeservepro.dev",
    serviceName: "House Repairing",
    daysAgo: 8,
    rating: 4,
    comment: "Great repair work and very professional behavior.",
  },
  {
    providerEmail: "harry.bruce@homeservepro.dev",
    customerEmail: "sarah.johnson@homeservepro.dev",
    serviceName: "Drain Cleaning",
    daysAgo: 7,
    rating: 5,
    comment: "Solved a long-running drain problem in one visit.",
  },
  {
    providerEmail: "sherry.wilson@homeservepro.dev",
    customerEmail: "michael.chen@homeservepro.dev",
    serviceName: "Bathroom Cleaning",
    daysAgo: 6,
    rating: 4,
    comment: "Very detailed deep clean. Bathroom feels brand new.",
  },
  {
    providerEmail: "betty.hill@homeservepro.dev",
    customerEmail: "emily.rodriguez@homeservepro.dev",
    serviceName: "Garage Cleaning",
    daysAgo: 5,
    rating: 4,
    comment: "Organized everything neatly and finished on schedule.",
  },
];

const futureBookingData = [
  {
    providerEmail: "jenny.wilson@homeservepro.dev",
    customerEmail: "alex.turner@homeservepro.dev",
    serviceName: "House Cleaning",
    daysAhead: 2,
    status: BookingStatus.CONFIRMED,
  },
  {
    providerEmail: "harry.bruce@homeservepro.dev",
    customerEmail: "michael.chen@homeservepro.dev",
    serviceName: "Drain Cleaning",
    daysAhead: 3,
    status: BookingStatus.PENDING,
  },
  {
    providerEmail: "bruce.brown@homeservepro.dev",
    customerEmail: "sarah.johnson@homeservepro.dev",
    serviceName: "Wall Painting",
    daysAhead: 4,
    status: BookingStatus.CONFIRMED,
  },
];

const seedLoginCredentials = {
  adminEmail: "admin@homeservepro.dev",
  adminPassword: "Admin@12345",
  customerPassword: "Customer@123",
};

async function main() {
  console.log("Seeding database...");

  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all(
    categoryData.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  );

  const categoryIdByName = new Map(categories.map((category) => [category.name, category.id]));

  const services = await Promise.all(
    serviceData.map((service) =>
      prisma.service.create({
        data: {
          name: service.name,
          description: service.description,
          basePrice: service.basePrice,
          categoryId: categoryIdByName.get(service.category)!,
        },
      })
    )
  );

  const serviceIdByName = new Map(services.map((service) => [service.name, service.id]));

  const providerUsers = await Promise.all(
    providerUsersData.map((user) =>
      prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          phone: user.phone,
          profileImage: user.profileImage,
          role: UserRole.SERVICE_PROVIDER,
          passwordHash: null,
        },
      })
    )
  );

  const customerUsers = await Promise.all(
    customerUsersData.map((user) =>
      prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          phone: user.phone,
          profileImage: user.profileImage,
          role: UserRole.CUSTOMER,
          passwordHash: createPasswordHash(seedLoginCredentials.customerPassword),
        },
      })
    )
  );

  await prisma.user.create({
    data: {
      email: seedLoginCredentials.adminEmail,
      name: "Platform Admin",
      role: UserRole.ADMIN,
      passwordHash: createPasswordHash(seedLoginCredentials.adminPassword),
    },
  });

  const providerIdByEmail = new Map(providerUsers.map((user) => [user.email, user.id]));
  const customerIdByEmail = new Map(customerUsers.map((user) => [user.email, user.id]));

  await Promise.all(
    providerProfileData.map((profile) =>
      prisma.serviceProvider.create({
        data: {
          userId: providerIdByEmail.get(profile.email)!,
          serviceId: serviceIdByName.get(profile.serviceName)!,
          bio: profile.bio,
          imageUrl: profile.imageUrl,
          verified: profile.verified,
          rating: 0,
          totalReviews: 0,
          yearsOfExperience: profile.yearsOfExperience,
          addressLine1: profile.addressLine1,
          city: profile.city,
          state: profile.state,
          country: "USA",
        },
      })
    )
  );

  const providerRecords = await prisma.serviceProvider.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const providerByEmail = new Map(providerRecords.map((provider) => [provider.user.email, provider]));

  for (const bookingInput of completedBookingData) {
    const provider = providerByEmail.get(bookingInput.providerEmail);
    const customerId = customerIdByEmail.get(bookingInput.customerEmail);
    const serviceId = serviceIdByName.get(bookingInput.serviceName);

    if (!provider || !customerId || !serviceId) {
      continue;
    }

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() - bookingInput.daysAgo);

    const booking = await prisma.booking.create({
      data: {
        customerId,
        serviceProviderId: provider.id,
        serviceId,
        scheduledDate,
        status: BookingStatus.COMPLETED,
        notes: "Completed during seed process",
        completedAt: scheduledDate,
      },
    });

    await prisma.review.create({
      data: {
        bookingId: booking.id,
        customerId,
        serviceProviderId: provider.id,
        rating: bookingInput.rating,
        comment: bookingInput.comment,
      },
    });
  }

  for (const bookingInput of futureBookingData) {
    const provider = providerByEmail.get(bookingInput.providerEmail);
    const customerId = customerIdByEmail.get(bookingInput.customerEmail);
    const serviceId = serviceIdByName.get(bookingInput.serviceName);

    if (!provider || !customerId || !serviceId) {
      continue;
    }

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + bookingInput.daysAhead);

    await prisma.booking.create({
      data: {
        customerId,
        serviceProviderId: provider.id,
        serviceId,
        scheduledDate,
        status: bookingInput.status,
        notes: "Upcoming appointment",
      },
    });
  }

  await prisma.serviceProvider.updateMany({
    data: {
      rating: 0,
      totalReviews: 0,
    },
  });

  const groupedReviews = await prisma.review.groupBy({
    by: ["serviceProviderId"],
    _avg: {
      rating: true,
    },
    _count: {
      _all: true,
    },
  });

  await Promise.all(
    groupedReviews.map((item) =>
      prisma.serviceProvider.update({
        where: {
          id: item.serviceProviderId,
        },
        data: {
          rating: item._avg.rating ?? 0,
          totalReviews: item._count._all,
        },
      })
    )
  );

  const [categoryCount, serviceCount, providerCount, bookingCount, reviewCount] =
    await Promise.all([
      prisma.category.count(),
      prisma.service.count(),
      prisma.serviceProvider.count(),
      prisma.booking.count(),
      prisma.review.count(),
    ]);

  console.log(
    `Seed complete: ${categoryCount} categories, ${serviceCount} services, ${providerCount} providers, ${bookingCount} bookings, ${reviewCount} reviews.`
  );
  console.log(
    `Login credentials: admin (${seedLoginCredentials.adminEmail} / ${seedLoginCredentials.adminPassword}) and demo customers (* / ${seedLoginCredentials.customerPassword}).`
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
