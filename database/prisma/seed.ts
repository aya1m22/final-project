import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = Array.from({ length: 50 }).map((_, i) => ({
    name: `Sample Product ${i + 1}`,
    description: `Description for product ${i + 1}`,
    price: Math.round(Math.random() * 10000) / 100,
    category: ['Women', 'Men', 'Kids', 'Accessories', 'Beauty'][i % 5],
  }));

  for (const p of products) {
    await prisma.product.create({ data: p as any });
  }
  console.log('Seeded', products.length, 'products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
