// prisma/seed.ts
import { PrismaClient, UserRole } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
import { PrismaPg } from "@prisma/adapter-pg";
// adapter will pick up DATABASE_URL from env
const prisma = new PrismaClient({
  adapter: new PrismaPg(),
});

async function main() {
  console.log("Seeding database...");

  // services list derived from Hero component
  const serviceList = [
    { label: "Cleaning", icon: "🧹" },
    { label: "Repair", icon: "🔧" },
    { label: "Painting", icon: "🎨" },
    { label: "Shifting", icon: "🚚" },
    { label: "Plumbing", icon: "🚰" },
    { label: "Electric", icon: "💡" },
  ];

  // create or upsert categories
  const categories: Array<any> = [];
  for (const svc of serviceList) {
    const cat = await prisma.category.upsert({
      where: { name: svc.label },
      update: {},
      create: {
        name: svc.label,
        icon: svc.icon,
        description: `${svc.label} related jobs`,
      },
    });
    categories.push(cat);
  }

  // create one service per category
  const services: Array<any> = [];
  for (const cat of categories) {
    const svc = await prisma.service.upsert({
      where: { name: `${cat.name} Service` },
      update: {},
      create: {
        name: `${cat.name} Service`,
        description: `Professional ${cat.name.toLowerCase()} work`,
        basePrice: Math.floor(Math.random() * 100) + 50,
        categoryId: cat.id,
      },
    });
    services.push(svc);
  }

  // create some customers
  for (let i = 1; i <= 30; i++) {
    await prisma.user.upsert({
      where: { email: `customer${i}@example.com` },
      update: {},
      create: {
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        role: UserRole.CUSTOMER,
      },
    });
  }

  // create providers: 10 per service
  let providerCount = 1;
  for (const svc of services) {
    for (let j = 0; j < 10; j++) {
      const user = await prisma.user.upsert({
        where: { email: `provider${providerCount}@example.com` },
        update: {},
        create: {
          name: `Provider ${providerCount}`,
          email: `provider${providerCount}@example.com`,
          role: UserRole.SERVICE_PROVIDER,
        },
      });

      await prisma.serviceProvider.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          serviceId: svc.id,
          bio: `Experienced ${svc.name.toLowerCase()}`,
          imageURL: `https://source.unsplash.com/200x200/?${svc.name.toLowerCase()}&sig=${j}`,
          verified: Math.random() < 0.8,
          rating: Math.floor(Math.random() * 5) + 1,
          totalReviews: Math.floor(Math.random() * 50),
          yearsOfExperience: Math.floor(Math.random() * 10) + 1,
        },
      });

      providerCount++;
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });