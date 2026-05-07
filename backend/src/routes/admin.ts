import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';
import roles from '../middleware/roles';

const router = express.Router();
const prisma = new PrismaClient();

// Admin middleware
router.use(auth);
router.use(roles(['admin']));

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = 0; // Since orders are in memory, we'll hardcode for now
    const totalRevenue = 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Product management
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, brand, description, price, category, images } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        brand: brand || 'Unknown Brand',
        description,
        price: parseFloat(price),
        category,
        images: Array.isArray(images) ? JSON.stringify(images) : images
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, images } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        images: Array.isArray(images) ? JSON.stringify(images) : images
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Order management (basic since orders are in memory)
router.get('/orders', (req, res) => {
  // For now, return empty array since orders are in memory
  res.json([]);
});

export default router;