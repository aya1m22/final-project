const { PrismaClient } = require('@prisma/client');

beforeAll(async () => {
  // Set up test database
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    // Clean up any existing test data
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.warn('Database setup failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
});

afterAll(async () => {
  // Clean up after tests
  const prisma = new PrismaClient();
  try {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.warn('Database cleanup failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
});