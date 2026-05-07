const request = require('supertest');
import app from '../index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

describe('Admin API', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Create admin user directly in database
    const hashedPassword = bcrypt.hashSync('password123', 12);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
      }
    });

    // Create regular user
    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        password: hashedPassword,
        role: 'customer'
      }
    });

    // Generate tokens
    adminToken = jwt.sign(
      { sub: adminUser.id, email: adminUser.email, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    userToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  }, 30000);

  afterAll(async () => {
    // Clean up
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/admin/stats', () => {
    it('returns dashboard stats for admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalUsers');
      expect(res.body).toHaveProperty('totalProducts');
      expect(res.body).toHaveProperty('totalOrders');
      expect(res.body).toHaveProperty('totalRevenue');
    });

    it('denies access to non-admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('Product Management', () => {
    let productId: number;

    it('gets all products for admin', async () => {
      const res = await request(app)
        .get('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('creates a new product', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          category: 'Test',
          images: ['test.jpg']
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      productId = res.body.id;
    });

    it('updates a product', async () => {
      const res = await request(app)
        .put(`/api/admin/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Test Product',
          price: 39.99
        });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Test Product');
    });

    it('deletes a product', async () => {
      const res = await request(app)
        .delete(`/api/admin/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Product deleted');
    });
  });

  describe('User Management', () => {
    it('gets all users for admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('updates user role', async () => {
      // First get a user ID
      const usersRes = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      const userId = usersRes.body[0].id;

      const res = await request(app)
        .put(`/api/admin/users/${userId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'vendor' });
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('vendor');
    });
  });

  describe('Order Management', () => {
    it('gets orders for admin', async () => {
      const res = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});