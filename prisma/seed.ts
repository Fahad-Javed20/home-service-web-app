import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// PrismaPg requires a pg Pool instance, not a plain config object
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const categoriesData = [
    { name: "Cleaning", icon: "🧹" },
    { name: "Repair", icon: "🔧" },
    { name: "Painting", icon: "🎨" },
    { name: "Shifting", icon: "🚚" },
    { name: "Plumbing", icon: "🚰" },
    { name: "Electric", icon: "💡" },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const c = await prisma.category.create({ data: cat });
    categories.push(c);
  }

  const services = [];
  for (const cat of categories) {
    const service = await prisma.service.create({
      data: {
        name: `${cat.name} Service`,
        description: `Professional ${cat.name.toLowerCase()} service`,
        basePrice: Math.floor(Math.random() * 100) + 50,
        categoryId: cat.id,
      },
    });
    services.push(service);
  }

  for (let i = 1; i <= 30; i++) {
    await prisma.user.create({
      data: {
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        role: UserRole.CUSTOMER,
      },
    });
  }

  for (let i = 1; i <= 60; i++) {
    const categoryIndex = Math.floor((i - 1) / 10);
    const service = services[categoryIndex];

    const user = await prisma.user.create({
      data: {
        name: `Provider ${i}`,
        email: `provider${i}@example.com`,
        role: UserRole.SERVICE_PROVIDER,
      },
    });
    // i created image field in service provider model and i am adding random image from unsplash for each provider

    await prisma.serviceProvider.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        imageURL: `https://picsum.photos/200/200?random=${i}`,
        bio: `I am an experienced ${service.name.toLowerCase()}`,
        verified: Math.random() < 0.8,
        rating: Math.floor(Math.random() * 5) + 1,
        totalReviews: Math.floor(Math.random() * 50),
        yearsOfExperience: Math.floor(Math.random() * 10) + 1,
      },
    });
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